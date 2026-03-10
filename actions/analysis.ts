"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-server";
import { analysisSchema } from "@/lib/validations";
import { runAnalysis } from "@/lib/services/analysis-engine";
import { generateMockAnalysis } from "@/lib/mock-analysis";
import { revalidatePath } from "next/cache";

type Locale = "en" | "fr";

const USE_REAL_ANALYSIS = process.env.OPENAI_API_KEY ? true : false;

const analysisInclude = {
  painPoints: true,
  productIdeas: true,
  keywordIdeas: true,
  objections: true,
  acquisitionChannels: true,
  recurringPhrases: true,
} as const;

type AnalysisWithRelations = Awaited<
  ReturnType<
    typeof db.analysis.findMany<{ include: typeof analysisInclude }>
  >
>[number];

export async function createAnalysis(formData: {
  query: string;
  topic: string;
  audience?: string;
}): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const parsed = analysisSchema.safeParse(formData);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(", ");
      return { success: false, error: message };
    }

    const { query, topic, audience } = parsed.data;
    const session = await requireSession();
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { locale: true },
    });
    const locale = (user?.locale as Locale) || "en";
    
    let analysisData;
    
    if (USE_REAL_ANALYSIS) {
      console.log("[createAnalysis] Using real analysis engine");
      analysisData = await runAnalysis(query, topic, locale, audience);
    } else {
      console.log("[createAnalysis] Using mock analysis (no OPENAI_API_KEY)");
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

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");

    return { success: true, id: analysis.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create analysis";
    return { success: false, error: message };
  }
}

export async function getAnalyses(): Promise<AnalysisWithRelations[]> {
  const session = await requireSession();
  const analyses = await db.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: analysisInclude,
  });
  return analyses;
}

export async function getAnalysis(id: string): Promise<AnalysisWithRelations> {
  const session = await requireSession();
  const analysis = await db.analysis.findUnique({
    where: { id },
    include: analysisInclude,
  });
  if (!analysis || analysis.userId !== session.user.id) {
    throw new Error("Analysis not found");
  }
  return analysis;
}

export async function getSavedAnalyses(): Promise<AnalysisWithRelations[]> {
  const session = await requireSession();
  const analyses = await db.analysis.findMany({
    where: { userId: session.user.id, saved: true },
    orderBy: { createdAt: "desc" },
    include: analysisInclude,
  });
  return analyses;
}

export async function toggleSaveAnalysis(id: string): Promise<AnalysisWithRelations> {
  const session = await requireSession();
  const analysis = await db.analysis.findUnique({
    where: { id },
  });
  if (!analysis || analysis.userId !== session.user.id) {
    throw new Error("Analysis not found");
  }
  const updated = await db.analysis.update({
    where: { id },
    data: { saved: !analysis.saved },
    include: analysisInclude,
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/saved");
  return updated;
}

export async function deleteAnalysis(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await requireSession();
    const analysis = await db.analysis.findUnique({
      where: { id },
    });
    if (!analysis || analysis.userId !== session.user.id) {
      return { success: false, error: "Analysis not found" };
    }
    await db.analysis.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete analysis";
    return { success: false, error: message };
  }
}
