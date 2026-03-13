import { z } from "zod";

export const painPointSchema = z.object({
  text: z.string().describe("The pain point described by real users"),
  sourceName: z.string().nullable().describe("Source name, e.g. r/subredditname or 'Hacker News'"),
  sourceType: z.string().nullable().describe("Source type: 'reddit', 'forum', 'review'"),
  sourceUrl: z.string().nullable().describe("URL to the original post/comment"),
  authorHandle: z.string().nullable().describe("Reddit username or author handle"),
  sentiment: z.string().nullable().describe("User sentiment: frustrated, disappointed, annoyed, overwhelmed, confused, hopeful"),
  frequency: z.number().describe("Estimated frequency of this pain point (1-10)"),
  tags: z.array(z.string()).describe("Relevant tags: manual-work, expensive, complex, slow, missing-features, etc."),
  audience: z.string().nullable().describe("Specific audience affected"),
  problemCategory: z.string().nullable().describe("Category: Workflow, Pricing, Integration, UX, Support, Automation, Reporting"),
  severityScore: z.number().min(0).max(100).describe("Severity score from 0 to 100"),
});

export const productIdeaSchema = z.object({
  title: z.string().describe("Product idea name"),
  description: z.string().describe("Detailed description of the product idea"),
  targetAudience: z.string().nullable().describe("Target audience for this product"),
  monetizationModel: z.string().nullable().describe("Suggested monetization model"),
  differentiation: z.string().nullable().describe("What makes this different from existing solutions"),
  mvpScope: z.string().nullable().describe("Scope for a minimum viable product"),
});

export const keywordIdeaSchema = z.object({
  keyword: z.string().describe("SEO keyword"),
  intent: z.string().nullable().describe("Search intent: problem-aware, solution-aware, product-aware"),
  priority: z.string().nullable().describe("Priority: high, medium, low"),
});

export const objectionSchema = z.object({
  text: z.string().describe("A common objection potential customers might have"),
});

export const acquisitionChannelSchema = z.object({
  name: z.string().describe("Channel name, e.g. Reddit, SEO, Product Hunt, LinkedIn"),
  rationale: z.string().nullable().describe("Why this channel would work for this niche"),
});

export const recurringPhraseSchema = z.object({
  phrase: z.string().describe("A recurring phrase found across discussions"),
  frequency: z.number().describe("How often this phrase appears (1-15)"),
});

export const analysisOutputSchema = z.object({
  summary: z.string().describe("Executive summary of the analysis based on real Reddit data"),
  opportunityScore: z.number().min(0).max(100).describe("Overall opportunity score (0-100)"),
  demandScore: z.number().min(0).max(100).describe("Market demand score (0-100)"),
  urgencyScore: z.number().min(0).max(100).describe("Urgency score — how urgently do people need a solution (0-100)"),
  competitionScore: z.number().min(0).max(100).describe("Competition level score — higher means less competition (0-100)"),
  monetizationScore: z.number().min(0).max(100).describe("Monetization potential score (0-100)"),
  recommendedMvp: z.string().describe("Recommended MVP description"),
  pricingSuggestion: z.string().describe("Pricing strategy suggestion"),
  seoSummary: z.string().describe("SEO strategy summary with target keywords"),
  painPoints: z.array(painPointSchema).describe("5-8 pain points discovered from real Reddit discussions"),
  productIdeas: z.array(productIdeaSchema).describe("3 product ideas based on the pain points"),
  keywordIdeas: z.array(keywordIdeaSchema).describe("6-8 SEO keyword ideas"),
  objections: z.array(objectionSchema).describe("3-4 common objections"),
  acquisitionChannels: z.array(acquisitionChannelSchema).describe("4-5 recommended acquisition channels"),
  recurringPhrases: z.array(recurringPhraseSchema).describe("5-6 recurring phrases from discussions"),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
