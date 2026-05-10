import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { relanceEmailTemplate } from "@/emails/relance-template";
import type { Role } from "@/types";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.$queryRaw<Array<{ role: string | null }>>`
    SELECT "role"::text AS "role"
    FROM "users"
    WHERE "id" = ${session.user.id}
    LIMIT 1
  `;
  const role = (rows[0]?.role as Role | undefined) ?? "USER";

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!contactEmail || !resendApiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const users = await db.user.findMany({
    where: { email: { not: "" } },
    select: { email: true, name: true, locale: true },
  });
  if (users.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0 });
  }

  const resend = new Resend(resendApiKey);
  const results = await Promise.allSettled(
    users.map((user) => {
      const locale = user.locale === "fr" ? "fr" : "en";
      const feedbackPath = locale === "fr" ? "/fr/dashboard/feedback" : "/dashboard/feedback";
      return resend.emails.send({
        from: "PainRadar <noreply@pain-radar.com>",
        to: user.email,
        replyTo: contactEmail,
        subject:
          locale === "fr"
            ? "Votre retour nous aiderait beaucoup"
            : "Could we get your quick feedback?",
        html: relanceEmailTemplate({
          name: user.name,
          locale,
          feedbackUrl: absoluteUrl(feedbackPath),
        }),
      });
    }),
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ sent, failed });
}
