import { streamObject } from "ai";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { analysisOutputSchema, analysisOutputWithPromptSchema } from "@/lib/analysis-schema";
import { buildAnalysisPrompt } from "@/lib/analysis-prompt";
import { fetchRedditPosts, formatRedditDataForPrompt } from "@/lib/reddit";
import { getPlanLimits } from "@/lib/plans";
import type { PlanId } from "@/types";

export const maxDuration = 120;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const analysis = await db.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!analysis) {
    return new Response("Not found", { status: 404 });
  }

  if (analysis.status !== "generating") {
    return new Response("Analysis is not in generating state", { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { locale: true, plan: true },
  });
  const locale = (user?.locale as "en" | "fr") || "en";
  const plan = (user?.plan as PlanId) || "free";
  const { canGenerateAiPrompt } = getPlanLimits(plan);

  let redditData: string;
  try {
    const posts = await fetchRedditPosts(analysis.topic, analysis.audience ?? undefined);
    redditData = formatRedditDataForPrompt(posts);
  } catch {
    redditData = "Reddit data could not be fetched. Please base the analysis on your general knowledge about this topic.";
  }

  const prompt = buildAnalysisPrompt(
    analysis.topic,
    analysis.audience ?? undefined,
    locale,
    redditData,
    canGenerateAiPrompt
  );

  const schema = canGenerateAiPrompt ? analysisOutputWithPromptSchema : analysisOutputSchema;

  const result = streamObject({
    model: openai("gpt-4o"),
    schema,
    system: prompt.system,
    prompt: prompt.user,
    onFinish: async ({ object }) => {
      if (!object) {
        await db.analysis.update({
          where: { id },
          data: { status: "failed" },
        });
        return;
      }

      try {
        await db.$transaction(async (tx) => {
          await tx.analysis.update({
            where: { id },
            data: {
              status: "completed",
              summary: object.summary,
              opportunityScore: Math.round(object.opportunityScore),
              demandScore: Math.round(object.demandScore),
              urgencyScore: Math.round(object.urgencyScore),
              competitionScore: Math.round(object.competitionScore),
              monetizationScore: Math.round(object.monetizationScore),
              recommendedMvp: object.recommendedMvp,
              pricingSuggestion: object.pricingSuggestion,
              seoSummary: object.seoSummary,
              aiPrompt: canGenerateAiPrompt && "aiPrompt" in object ? (object as Record<string, unknown>).aiPrompt as string : null,
            },
          });

          if (object.painPoints?.length) {
            await tx.painPoint.createMany({
              data: object.painPoints.map((p) => ({
                analysisId: id,
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
                severityScore: Math.round(p.severityScore),
              })),
            });
          }

          if (object.productIdeas?.length) {
            await tx.productIdea.createMany({
              data: object.productIdeas.map((p) => ({
                analysisId: id,
                title: p.title,
                description: p.description,
                targetAudience: p.targetAudience,
                monetizationModel: p.monetizationModel,
                differentiation: p.differentiation,
                mvpScope: p.mvpScope,
              })),
            });
          }

          if (object.keywordIdeas?.length) {
            await tx.keywordIdea.createMany({
              data: object.keywordIdeas.map((k) => ({
                analysisId: id,
                keyword: k.keyword,
                intent: k.intent,
                priority: k.priority,
              })),
            });
          }

          if (object.objections?.length) {
            await tx.objection.createMany({
              data: object.objections.map((o) => ({
                analysisId: id,
                text: o.text,
              })),
            });
          }

          if (object.acquisitionChannels?.length) {
            await tx.acquisitionChannel.createMany({
              data: object.acquisitionChannels.map((c) => ({
                analysisId: id,
                name: c.name,
                rationale: c.rationale,
              })),
            });
          }

          if (object.recurringPhrases?.length) {
            await tx.recurringPhrase.createMany({
              data: object.recurringPhrases.map((p) => ({
                analysisId: id,
                phrase: p.phrase,
                frequency: p.frequency,
              })),
            });
          }
        });
      } catch {
        await db.analysis.update({
          where: { id },
          data: { status: "failed" },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
