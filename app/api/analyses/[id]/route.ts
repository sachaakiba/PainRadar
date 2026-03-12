import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { checkSaveLimit, getPlanLimitError } from "@/lib/plan-guard";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.emailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const { id } = await params;

  const analysis = await db.analysis.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      painPoints: true,
      productIdeas: true,
      keywordIdeas: true,
      objections: true,
      acquisitionChannels: true,
      recurringPhrases: true,
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.emailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const analysis = await db.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newSaved = body.saved ?? analysis.saved;
  if (newSaved && !analysis.saved) {
    const saveCheck = await checkSaveLimit(session.user.id);
    if (!saveCheck.allowed) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { locale: true },
      });
      const locale = (user?.locale as string) || "en";
      const message = getPlanLimitError("save_limit", locale);
      return NextResponse.json(
        { error: message, code: "plan_limit_exceeded" },
        { status: 403 }
      );
    }
  }

  const updated = await db.analysis.update({
    where: { id },
    data: { saved: newSaved },
  });

  return NextResponse.json({ analysis: updated });
}
