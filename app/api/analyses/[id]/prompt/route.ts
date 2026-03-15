import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { getPlanLimits } from "@/lib/plans";
import type { PlanId, Role } from "@/types";

const aiPromptOnlySchema = z.object({
  aiPrompt: z.string(),
});

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [analysis, userRows] = await Promise.all([
    db.analysis.findFirst({
      where: { id, userId: session.user.id },
      include: {
        painPoints: true,
        productIdeas: true,
        keywordIdeas: true,
        objections: true,
        acquisitionChannels: true,
        recurringPhrases: true,
      },
    }),
    db.$queryRaw<Array<{ locale: string | null; plan: string | null; role: string | null }>>`
      SELECT "locale", "plan", "role"::text AS "role"
      FROM "users"
      WHERE "id" = ${session.user.id}
      LIMIT 1
    `,
  ]);

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = userRows[0];
  const plan = (user?.plan as PlanId) || "free";
  const locale = (user?.locale as "en" | "fr") || "en";
  const role = (user?.role as Role) || "USER";
  const { canGenerateAiPrompt } = getPlanLimits(plan);

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Only SUPER_ADMIN can regenerate AI prompts." },
      { status: 403 }
    );
  }

  if (!canGenerateAiPrompt) {
    return NextResponse.json(
      { error: "Upgrade to Pro to regenerate the AI prompt." },
      { status: 403 }
    );
  }

  if (analysis.status !== "completed") {
    return NextResponse.json(
      { error: "Analysis must be completed before regenerating the prompt." },
      { status: 400 }
    );
  }

  const system =
    locale === "fr"
      ? `Tu génères uniquement le champ aiPrompt pour un assistant de code. Le prompt doit être autonome, concret et actionnable, en français, avec des titres markdown ##.

Contraintes:
- Baser le prompt UNIQUEMENT sur le JSON d'analyse fourni.
- Ne pas inventer de données absentes.
- Transformer les insights en plan de build clair.
- Inclure: contexte marché, top pain points, mapping fonctionnalités, MVP scope, pricing, objections, SEO, acquisition, stack technique.
- Stack par défaut: Next.js 15 (App Router), TypeScript, Tailwind, Prisma + PostgreSQL, auth email+Google, Stripe.
- Architecture simple: une seule app Next.js, pas de microservices.
- Sortie JSON stricte: { "aiPrompt": "..." }`
      : `You generate only the aiPrompt field for a coding assistant. The prompt must be self-contained, concrete, and actionable, in English, using markdown ## headers.

Constraints:
- Base the prompt ONLY on the provided analysis JSON.
- Do not invent missing data.
- Turn insights into a clear build plan.
- Include: market context, top pain points, feature mapping, MVP scope, pricing, objections, SEO, acquisition, technical stack.
- Default stack: Next.js 15 (App Router), TypeScript, Tailwind, Prisma + PostgreSQL, email+Google auth, Stripe.
- Keep architecture simple: one Next.js app, no microservices.
- Return strict JSON only: { "aiPrompt": "..." }`;

  const analysisContext = {
    topic: analysis.topic,
    query: analysis.query,
    audience: analysis.audience,
    summary: analysis.summary,
    scores: {
      opportunityScore: analysis.opportunityScore,
      demandScore: analysis.demandScore,
      urgencyScore: analysis.urgencyScore,
      competitionScore: analysis.competitionScore,
      monetizationScore: analysis.monetizationScore,
    },
    recommendedMvp: analysis.recommendedMvp,
    pricingSuggestion: analysis.pricingSuggestion,
    seoSummary: analysis.seoSummary,
    painPoints: analysis.painPoints.map((p) => ({
      text: p.text,
      severityScore: p.severityScore,
      sentiment: p.sentiment,
      tags: p.tags,
      sourceName: p.sourceName,
    })),
    productIdeas: analysis.productIdeas.map((p) => ({
      title: p.title,
      description: p.description,
      targetAudience: p.targetAudience,
      differentiation: p.differentiation,
      mvpScope: p.mvpScope,
      monetizationModel: p.monetizationModel,
    })),
    keywordIdeas: analysis.keywordIdeas.map((k) => ({
      keyword: k.keyword,
      intent: k.intent,
      priority: k.priority,
    })),
    objections: analysis.objections.map((o) => o.text),
    acquisitionChannels: analysis.acquisitionChannels.map((c) => ({
      name: c.name,
      rationale: c.rationale,
    })),
    recurringPhrases: analysis.recurringPhrases.map((p) => ({
      phrase: p.phrase,
      frequency: p.frequency,
    })),
  };

  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: aiPromptOnlySchema,
      system,
      prompt:
        locale === "fr"
          ? `Regénère un meilleur prompt AI à partir de cette analyse existante:\n\n${JSON.stringify(analysisContext, null, 2)}`
          : `Regenerate an improved AI prompt from this existing analysis:\n\n${JSON.stringify(analysisContext, null, 2)}`,
    });

    const aiPrompt = result.object.aiPrompt.trim();

    await db.analysis.update({
      where: { id },
      data: { aiPrompt },
    });

    return NextResponse.json({ aiPrompt });
  } catch {
    return NextResponse.json(
      { error: "Failed to regenerate AI prompt." },
      { status: 500 }
    );
  }
}
