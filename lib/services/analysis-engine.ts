import OpenAI from "openai";
import { searchReddit, formatRedditDataForAnalysis } from "./reddit";
import type { MockAnalysisResult, MockPainPoint, MockProductIdea, MockKeywordIdea, MockObjection, MockAcquisitionChannel, MockRecurringPhrase } from "../mock-analysis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Locale = "en" | "fr";

interface AnalysisPromptContext {
  query: string;
  topic: string;
  audience?: string;
  redditData: string;
  locale: Locale;
}

const SYSTEM_PROMPTS: Record<Locale, string> = {
  en: `You are an expert market researcher and product analyst. Your task is to analyze real discussions from Reddit to identify pain points, product opportunities, and market insights.

You must return a JSON object with the following structure:
{
  "summary": "A 2-3 sentence overview of the main findings",
  "opportunityScore": number (0-100),
  "demandScore": number (0-100),
  "urgencyScore": number (0-100),
  "competitionScore": number (0-100),
  "monetizationScore": number (0-100),
  "recommendedMvp": "Specific MVP recommendation",
  "pricingSuggestion": "Pricing strategy recommendation",
  "seoSummary": "SEO strategy summary",
  "painPoints": [
    {
      "text": "Description of the pain point",
      "sourceName": "Source subreddit or platform",
      "sourceType": "reddit|forum|review",
      "sourceUrl": "URL if available or null",
      "sentiment": "frustrated|disappointed|annoyed|overwhelmed|confused",
      "frequency": number (1-10),
      "tags": ["tag1", "tag2"],
      "problemCategory": "Workflow|Pricing|Integration|UX|Support|Automation|Reporting",
      "severityScore": number (0-100)
    }
  ],
  "productIdeas": [
    {
      "title": "Product name/title",
      "description": "Detailed description",
      "targetAudience": "Who it's for",
      "monetizationModel": "How to monetize",
      "differentiation": "What makes it unique",
      "mvpScope": "MVP features"
    }
  ],
  "keywordIdeas": [
    {
      "keyword": "keyword phrase",
      "intent": "problem-aware|solution-aware|product-aware",
      "priority": "high|medium|low"
    }
  ],
  "objections": [{ "text": "Potential objection" }],
  "acquisitionChannels": [
    {
      "name": "Channel name",
      "rationale": "Why this channel works"
    }
  ],
  "recurringPhrases": [
    {
      "phrase": "Common phrase from discussions",
      "frequency": number (1-15)
    }
  ]
}

Important:
- Base your analysis ONLY on the provided Reddit data
- Extract REAL pain points mentioned by users, with actual quotes when possible
- Be specific and actionable in recommendations
- Score based on evidence: frequency of mentions, upvotes, engagement
- Include at least 5-7 pain points, 3 product ideas, 6-8 keywords
- Return ONLY valid JSON, no markdown or extra text`,

  fr: `Vous êtes un expert en recherche de marché et analyse produit. Votre tâche est d'analyser de vraies discussions Reddit pour identifier les points de douleur, opportunités produit et insights marché.

Vous devez retourner un objet JSON avec la structure suivante:
{
  "summary": "Un résumé de 2-3 phrases des principales découvertes",
  "opportunityScore": number (0-100),
  "demandScore": number (0-100),
  "urgencyScore": number (0-100),
  "competitionScore": number (0-100),
  "monetizationScore": number (0-100),
  "recommendedMvp": "Recommandation MVP spécifique",
  "pricingSuggestion": "Recommandation stratégie de prix",
  "seoSummary": "Résumé stratégie SEO",
  "painPoints": [
    {
      "text": "Description du point de douleur",
      "sourceName": "Subreddit ou plateforme source",
      "sourceType": "reddit|forum|review",
      "sourceUrl": "URL si disponible ou null",
      "sentiment": "frustré|déçu|agacé|submergé|confus",
      "frequency": number (1-10),
      "tags": ["tag1", "tag2"],
      "problemCategory": "Workflow|Tarification|Intégration|UX|Support|Automatisation|Reporting",
      "severityScore": number (0-100)
    }
  ],
  "productIdeas": [
    {
      "title": "Nom/titre du produit",
      "description": "Description détaillée",
      "targetAudience": "Pour qui",
      "monetizationModel": "Comment monétiser",
      "differentiation": "Ce qui le rend unique",
      "mvpScope": "Fonctionnalités MVP"
    }
  ],
  "keywordIdeas": [
    {
      "keyword": "expression clé",
      "intent": "problem-aware|solution-aware|product-aware",
      "priority": "high|medium|low"
    }
  ],
  "objections": [{ "text": "Objection potentielle" }],
  "acquisitionChannels": [
    {
      "name": "Nom du canal",
      "rationale": "Pourquoi ce canal fonctionne"
    }
  ],
  "recurringPhrases": [
    {
      "phrase": "Expression récurrente des discussions",
      "frequency": number (1-15)
    }
  ]
}

Important:
- Basez votre analyse UNIQUEMENT sur les données Reddit fournies
- Extrayez les VRAIS points de douleur mentionnés par les utilisateurs, avec citations réelles si possible
- Soyez spécifique et actionnable dans vos recommandations
- Scorez selon les preuves: fréquence des mentions, upvotes, engagement
- Incluez au moins 5-7 points de douleur, 3 idées produit, 6-8 mots-clés
- Retournez UNIQUEMENT du JSON valide, pas de markdown ou texte supplémentaire`,
};

function buildUserPrompt(ctx: AnalysisPromptContext): string {
  const lang = ctx.locale === "fr" ? "Répondez en français." : "Respond in English.";
  
  return `${lang}

Topic to analyze: "${ctx.topic}"
Search query: "${ctx.query}"
${ctx.audience ? `Target audience: ${ctx.audience}` : ""}

Here is the real data collected from Reddit discussions:

${ctx.redditData}

Based on this data, provide a comprehensive analysis identifying real pain points, product opportunities, and market insights. Focus on what real users are actually complaining about or requesting.`;
}

export async function runAnalysis(
  query: string,
  topic: string,
  locale: Locale = "en",
  audience?: string
): Promise<MockAnalysisResult> {
  console.log(`[Analysis] Starting analysis for "${topic}" (locale: ${locale})`);
  
  console.log("[Analysis] Fetching Reddit data...");
  const redditResult = await searchReddit(query);
  
  if (redditResult.posts.length === 0 && redditResult.comments.length === 0) {
    throw new Error(
      locale === "fr" 
        ? "Aucune donnée trouvée sur Reddit pour ce sujet. Essayez un terme plus large."
        : "No Reddit data found for this topic. Try a broader search term."
    );
  }
  
  console.log(`[Analysis] Found ${redditResult.posts.length} posts, ${redditResult.comments.length} comments`);
  
  const redditData = formatRedditDataForAnalysis(redditResult);
  
  console.log("[Analysis] Sending to OpenAI for analysis...");
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS[locale],
      },
      {
        role: "user",
        content: buildUserPrompt({
          query,
          topic,
          audience,
          redditData,
          locale,
        }),
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content;
  
  if (!responseText) {
    throw new Error("No response from OpenAI");
  }

  console.log("[Analysis] Parsing OpenAI response...");
  
  let analysis: any;
  try {
    analysis = JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse OpenAI response:", responseText);
    throw new Error("Failed to parse analysis results");
  }

  const result: MockAnalysisResult = {
    summary: analysis.summary || "",
    opportunityScore: clamp(analysis.opportunityScore || 50, 0, 100),
    demandScore: clamp(analysis.demandScore || 50, 0, 100),
    urgencyScore: clamp(analysis.urgencyScore || 50, 0, 100),
    competitionScore: clamp(analysis.competitionScore || 50, 0, 100),
    monetizationScore: clamp(analysis.monetizationScore || 50, 0, 100),
    recommendedMvp: analysis.recommendedMvp || "",
    pricingSuggestion: analysis.pricingSuggestion || "",
    seoSummary: analysis.seoSummary || "",
    painPoints: normalizePainPoints(analysis.painPoints || [], redditResult),
    productIdeas: normalizeProductIdeas(analysis.productIdeas || []),
    keywordIdeas: normalizeKeywordIdeas(analysis.keywordIdeas || []),
    objections: normalizeObjections(analysis.objections || []),
    acquisitionChannels: normalizeChannels(analysis.acquisitionChannels || []),
    recurringPhrases: normalizePhrases(analysis.recurringPhrases || []),
  };

  console.log("[Analysis] Analysis complete");
  return result;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizePainPoints(points: any[], redditResult: any): MockPainPoint[] {
  return points.slice(0, 10).map((p, i) => ({
    text: p.text || "",
    sourceName: p.sourceName || redditResult.posts[i]?.subreddit || "Reddit",
    sourceType: p.sourceType || "reddit",
    sourceUrl: p.sourceUrl || redditResult.posts[i]?.url || null,
    authorHandle: null,
    sentiment: p.sentiment || "frustrated",
    frequency: clamp(p.frequency || 3, 1, 10),
    tags: Array.isArray(p.tags) ? p.tags.slice(0, 3) : [],
    audience: p.audience || null,
    problemCategory: p.problemCategory || "Workflow",
    severityScore: clamp(p.severityScore || 70, 0, 100),
  }));
}

function normalizeProductIdeas(ideas: any[]): MockProductIdea[] {
  return ideas.slice(0, 5).map(p => ({
    title: p.title || "",
    description: p.description || "",
    targetAudience: p.targetAudience || null,
    monetizationModel: p.monetizationModel || null,
    differentiation: p.differentiation || null,
    mvpScope: p.mvpScope || null,
  }));
}

function normalizeKeywordIdeas(keywords: any[]): MockKeywordIdea[] {
  return keywords.slice(0, 10).map(k => ({
    keyword: k.keyword || "",
    intent: k.intent || "solution-aware",
    priority: k.priority || "medium",
  }));
}

function normalizeObjections(objections: any[]): MockObjection[] {
  return objections.slice(0, 6).map(o => ({
    text: typeof o === "string" ? o : (o.text || ""),
  }));
}

function normalizeChannels(channels: any[]): MockAcquisitionChannel[] {
  return channels.slice(0, 6).map(c => ({
    name: c.name || "",
    rationale: c.rationale || null,
  }));
}

function normalizePhrases(phrases: any[]): MockRecurringPhrase[] {
  return phrases.slice(0, 8).map(p => ({
    phrase: p.phrase || "",
    frequency: clamp(p.frequency || 5, 1, 15),
  }));
}
