import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { analysisSchema } from "@/lib/validations";
import { checkCredits, getPlanLimitError, type PlanLimitErrorType } from "@/lib/plan-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const savedOnly = searchParams.get("saved") === "true";

  const analyses = await db.analysis.findMany({
    where: {
      userId: session.user.id,
      ...(savedOnly ? { saved: true } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      query: true,
      topic: true,
      opportunityScore: true,
      saved: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ analyses });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = analysisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { query, topic, audience } = parsed.data;

  const creditCheck = await checkCredits(session.user.id);
  if (!creditCheck.allowed) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { locale: true },
    });
    const locale = (user?.locale as string) || "en";
    const message = getPlanLimitError(creditCheck.error as PlanLimitErrorType, locale);
    return NextResponse.json(
      { error: message, code: "no_credits" },
      { status: 403 }
    );
  }

  const analysis = await db.analysis.create({
    data: {
      userId: session.user.id,
      query,
      topic,
      audience: audience ?? null,
      status: "generating",
      summary: "",
    },
  });

  return NextResponse.json({ analysis });
}
