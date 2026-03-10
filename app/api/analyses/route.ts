import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { analysisSchema } from "@/lib/validations";
import { runAnalysis } from "@/lib/services/analysis-engine";
import { generateMockAnalysis } from "@/lib/mock-analysis";

export const dynamic = "force-dynamic";

const USE_REAL_ANALYSIS = process.env.OPENAI_API_KEY ? true : false;

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
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { locale: true },
  });
  const locale = (user?.locale as "en" | "fr") || "en";
  
  let analysisData;
  
  if (USE_REAL_ANALYSIS) {
    analysisData = await runAnalysis(query, topic, locale, audience);
  } else {
    analysisData = generateMockAnalysis(query, topic, audience, locale);
  }

  const analysis = await db.analysis.create({
    data: {
      userId: session.user.id,
      query,
      topic,
      audience: audience ?? null,
      summary: analysisData.summary,
      opportunityScore: analysisData.opportunityScore,
      demandScore: analysisData.demandScore,
      urgencyScore: analysisData.urgencyScore,
      competitionScore: analysisData.competitionScore,
      monetizationScore: analysisData.monetizationScore,
      recommendedMvp: analysisData.recommendedMvp,
      pricingSuggestion: analysisData.pricingSuggestion,
      seoSummary: analysisData.seoSummary,
      painPoints: {
        create: analysisData.painPoints.map((p) => ({
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
        create: analysisData.productIdeas.map((p) => ({
          title: p.title,
          description: p.description,
          targetAudience: p.targetAudience,
          monetizationModel: p.monetizationModel,
          differentiation: p.differentiation,
          mvpScope: p.mvpScope,
        })),
      },
      keywordIdeas: {
        create: analysisData.keywordIdeas.map((k) => ({
          keyword: k.keyword,
          intent: k.intent,
          priority: k.priority,
        })),
      },
      objections: {
        create: analysisData.objections.map((o) => ({ text: o.text })),
      },
      acquisitionChannels: {
        create: analysisData.acquisitionChannels.map((c) => ({
          name: c.name,
          rationale: c.rationale,
        })),
      },
      recurringPhrases: {
        create: analysisData.recurringPhrases.map((p) => ({
          phrase: p.phrase,
          frequency: p.frequency,
        })),
      },
    },
  });

  return NextResponse.json({ analysis });
}
