import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { analysisSchema } from "@/lib/validations";
import { generateMockAnalysis } from "@/lib/mock-analysis";
import { checkAnalysisLimit, getPlanLimitError, type PlanLimitErrorType } from "@/lib/plan-guard";

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

  const limitCheck = await checkAnalysisLimit(session.user.id);
  if (!limitCheck.allowed) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { locale: true },
    });
    const locale = (user?.locale as string) || "en";
    const message = getPlanLimitError(limitCheck.error as PlanLimitErrorType, locale);
    return NextResponse.json(
      { error: message, code: "plan_limit_exceeded" },
      { status: 403 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { locale: true },
  });
  const locale = (user?.locale as "en" | "fr") || "en";

  const mock = generateMockAnalysis(query, topic, audience, locale);

  const analysis = await db.analysis.create({
    data: {
      userId: session.user.id,
      query,
      topic,
      audience: audience ?? null,
      summary: mock.summary,
      opportunityScore: mock.opportunityScore,
      demandScore: mock.demandScore,
      urgencyScore: mock.urgencyScore,
      competitionScore: mock.competitionScore,
      monetizationScore: mock.monetizationScore,
      recommendedMvp: mock.recommendedMvp,
      pricingSuggestion: mock.pricingSuggestion,
      seoSummary: mock.seoSummary,
      painPoints: {
        create: mock.painPoints.map((p) => ({
          text: p.text,
          sourceName: p.sourceName,
          sourceType: p.sourceType,
          sourceUrl: p.sourceUrl,
          authorHandle: p.authorHandle,
          sentiment: p.sentiment,
          frequency: p.frequency,
          tags: p.tags,
          audience: p.audience,
          problemCategory: p.problemCategory,
          severityScore: p.severityScore,
        })),
      },
      productIdeas: {
        create: mock.productIdeas.map((p) => ({
          title: p.title,
          description: p.description,
          targetAudience: p.targetAudience,
          monetizationModel: p.monetizationModel,
          differentiation: p.differentiation,
          mvpScope: p.mvpScope,
        })),
      },
      keywordIdeas: {
        create: mock.keywordIdeas.map((k) => ({
          keyword: k.keyword,
          intent: k.intent,
          priority: k.priority,
        })),
      },
      objections: {
        create: mock.objections.map((o) => ({ text: o.text })),
      },
      acquisitionChannels: {
        create: mock.acquisitionChannels.map((c) => ({
          name: c.name,
          rationale: c.rationale,
        })),
      },
      recurringPhrases: {
        create: mock.recurringPhrases.map((p) => ({
          phrase: p.phrase,
          frequency: p.frequency,
        })),
      },
    },
  });

  return NextResponse.json({ analysis });
}
