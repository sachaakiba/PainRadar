import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireSession } from "@/lib/auth-server";
import { feedbackSchema } from "@/lib/validations";
import { feedbackEmailTemplate } from "@/emails/feedback-template";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await requireSession();
  const body = await request.json();
  const parsed = feedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!contactEmail || !resendApiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: "PainRadar <noreply@pain-radar.com>",
      to: contactEmail,
      replyTo: session.user.email,
      subject: "[PainRadar Feedback] Nouveau feedback utilisateur",
      html: feedbackEmailTemplate({
        userName: session.user.name || "User",
        userEmail: session.user.email || "unknown@email",
        feedback: parsed.data.message,
      }),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send feedback. Please try again later." },
      { status: 500 },
    );
  }
}
