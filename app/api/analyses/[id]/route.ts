import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";
import type { PlanId } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const { canGenerateAiPrompt } = getPlanLimits((user?.plan as PlanId) || "free");

  if (!canGenerateAiPrompt) {
    analysis.aiPrompt = null;
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

  const { id } = await params;
  const body = await request.json();

  const analysis = await db.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};

  if (body.status === "generating" && analysis.status === "failed") {
    updateData.status = "generating";
    updateData.summary = "";
    updateData.opportunityScore = 0;
    updateData.demandScore = 0;
    updateData.urgencyScore = 0;
    updateData.competitionScore = 0;
    updateData.monetizationScore = 0;
    updateData.recommendedMvp = null;
    updateData.pricingSuggestion = null;
    updateData.seoSummary = null;
    updateData.aiPrompt = null;

    await db.painPoint.deleteMany({ where: { analysisId: id } });
    await db.productIdea.deleteMany({ where: { analysisId: id } });
    await db.keywordIdea.deleteMany({ where: { analysisId: id } });
    await db.objection.deleteMany({ where: { analysisId: id } });
    await db.acquisitionChannel.deleteMany({ where: { analysisId: id } });
    await db.recurringPhrase.deleteMany({ where: { analysisId: id } });
  }

  if (body.saved !== undefined) {
    updateData.saved = body.saved;
  }

  const updated = await db.analysis.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ analysis: updated });
}
