export type AnalysisWithRelations = {
  id: string;
  userId: string;
  query: string;
  topic: string;
  audience: string | null;
  summary: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  recommendedMvp: string | null;
  pricingSuggestion: string | null;
  seoSummary: string | null;
  saved: boolean;
  createdAt: Date;
  updatedAt: Date;
  painPoints: PainPointData[];
  productIdeas: ProductIdeaData[];
  keywordIdeas: KeywordIdeaData[];
  objections: ObjectionData[];
  acquisitionChannels: AcquisitionChannelData[];
  recurringPhrases: RecurringPhraseData[];
};

export type PainPointData = {
  id: string;
  analysisId: string;
  text: string;
  sourceName: string | null;
  sourceType: string | null;
  sourceUrl: string | null;
  authorHandle: string | null;
  sentiment: string | null;
  frequency: number;
  tags: string[];
  audience: string | null;
  problemCategory: string | null;
  severityScore: number;
  createdAt: Date;
};

export type ProductIdeaData = {
  id: string;
  analysisId: string;
  title: string;
  description: string;
  targetAudience: string | null;
  monetizationModel: string | null;
  differentiation: string | null;
  mvpScope: string | null;
  createdAt: Date;
};

export type KeywordIdeaData = {
  id: string;
  analysisId: string;
  keyword: string;
  intent: string | null;
  priority: string | null;
  createdAt: Date;
};

export type ObjectionData = {
  id: string;
  analysisId: string;
  text: string;
  createdAt: Date;
};

export type AcquisitionChannelData = {
  id: string;
  analysisId: string;
  name: string;
  rationale: string | null;
  createdAt: Date;
};

export type RecurringPhraseData = {
  id: string;
  analysisId: string;
  phrase: string;
  frequency: number;
  createdAt: Date;
};

export type PlanId = "free" | "hobbyist" | "founder";
export type PricingTierId = "free" | "single" | "hobbyist" | "founder";
export type Role = "USER" | "SUPER_ADMIN";

export type PricingPlan = {
  name: string;
  planId: PricingTierId;
  price: string;
  badge?: string;
  description: string;
  credits: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export type UseCase = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  painPoints: string[];
  benefits: string[];
};

export type Feature = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
};

export type ExampleAnalysis = {
  slug: string;
  query: string;
  topic: string;
  summary: string;
  opportunityScore: number;
  topPainPoint: string;
  suggestedProduct: string;
};
