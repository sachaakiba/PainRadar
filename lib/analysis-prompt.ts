type Locale = "en" | "fr";

const BASE_SYSTEM_PROMPTS: Record<Locale, string> = {
  en: `You are an expert SaaS market analyst specializing in pain point discovery and opportunity scoring.

Your task is to analyze real Reddit discussions about a topic/niche and produce a comprehensive market analysis.

IMPORTANT RULES:
- Base your analysis on the REAL Reddit data provided. Quote real users, reference real subreddits, and link to real posts when possible.
- Pain points must reflect what real people are actually saying — not generic templates.
- Scores must be justified by the data: high engagement + repeated complaints = higher scores.
- If Reddit data is sparse, augment with your general knowledge but clearly note this in the summary.
- All text output must be in English.
- Be specific and actionable, not generic.
- Pain point sourceUrl should link to the actual Reddit post when available.
- authorHandle should be the Reddit username of the person expressing the pain point.`,

  fr: `Tu es un expert en analyse de marché SaaS, spécialisé dans la découverte de points de douleur et l'évaluation d'opportunités.

Ta tâche est d'analyser de vraies discussions Reddit sur un sujet/niche et de produire une analyse de marché complète.

RÈGLES IMPORTANTES :
- Base ton analyse sur les VRAIES données Reddit fournies. Cite de vrais utilisateurs, référence de vrais subreddits, et lie vers de vrais posts quand possible.
- Les points de douleur doivent refléter ce que les gens disent réellement — pas des templates génériques.
- Les scores doivent être justifiés par les données : fort engagement + plaintes répétées = scores plus élevés.
- Si les données Reddit sont insuffisantes, complète avec tes connaissances générales mais mentionne-le clairement dans le résumé.
- Tout le texte de sortie doit être en français.
- Sois spécifique et actionnable, pas générique.
- Les sourceUrl des pain points doivent pointer vers le vrai post Reddit quand disponible.
- Les authorHandle doivent être les vrais noms d'utilisateurs Reddit.`,
};

const AI_PROMPT_INSTRUCTIONS: Record<Locale, string> = {
  en: `

AI PROMPT GENERATION:
For the "aiPrompt" field, generate a comprehensive, self-contained prompt that someone can paste directly into an AI coding assistant (Cursor, Claude, ChatGPT) to build the best product idea from your analysis. The prompt should:
- Start with the product name/concept and a compelling 2-sentence pitch
- Include validated market context (opportunity score, key data points)
- List the top 5 pain points ranked by severity with actionable feature mappings
- Define the MVP scope with specific features and user flows
- Specify the pricing strategy with concrete tiers
- List objections to address in the UX and marketing copy
- Include SEO keywords and acquisition channels
- End with clear technical instructions: use Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL + Prisma, Stripe for payments, email+Google OAuth auth
- The prompt must be written in English and be self-contained (someone with zero context should understand exactly what to build and why)
- Format it with markdown headers (##) for readability`,

  fr: `

GÉNÉRATION DU PROMPT IA :
Pour le champ "aiPrompt", génère un prompt complet et autonome qu'on peut coller directement dans un assistant IA de code (Cursor, Claude, ChatGPT) pour construire la meilleure idée de produit issue de ton analyse. Le prompt doit :
- Commencer par le nom/concept du produit et un pitch de 2 phrases
- Inclure le contexte marché validé (score d'opportunité, données clés)
- Lister les 5 points de douleur prioritaires classés par sévérité avec des fonctionnalités correspondantes
- Définir le périmètre MVP avec des fonctionnalités et parcours utilisateurs spécifiques
- Spécifier la stratégie tarifaire avec des paliers concrets
- Lister les objections à adresser dans l'UX et le copywriting
- Inclure les mots-clés SEO et les canaux d'acquisition
- Terminer avec des instructions techniques claires : utiliser Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL + Prisma, Stripe pour les paiements, authentification email + Google OAuth
- Le prompt doit être rédigé en français et autonome (quelqu'un sans contexte doit comprendre exactement quoi construire et pourquoi)
- Le formater avec des titres markdown (##) pour la lisibilité`,
};

export function buildAnalysisPrompt(
  topic: string,
  audience: string | undefined,
  locale: Locale,
  redditData: string,
  includeAiPrompt: boolean = false
): { system: string; user: string } {
  let system = BASE_SYSTEM_PROMPTS[locale];
  if (includeAiPrompt) {
    system += AI_PROMPT_INSTRUCTIONS[locale];
  }

  const audienceContext = audience
    ? locale === "fr"
      ? `L'audience cible est : ${audience}.`
      : `The target audience is: ${audience}.`
    : "";

  const userPrompt =
    locale === "fr"
      ? `Analyse le sujet/niche suivant : "${topic}"
${audienceContext}

Voici les vraies discussions Reddit collectées sur ce sujet :

---
${redditData}
---

Produis une analyse de marché complète basée sur ces données réelles. Identifie les vrais points de douleur exprimés par les utilisateurs, évalue l'opportunité, et génère des idées de produits concrets.`
      : `Analyze the following topic/niche: "${topic}"
${audienceContext}

Here are real Reddit discussions collected on this topic:

---
${redditData}
---

Produce a comprehensive market analysis based on this real data. Identify actual pain points expressed by users, evaluate the opportunity, and generate concrete product ideas.`;

  return {
    system,
    user: userPrompt,
  };
}
