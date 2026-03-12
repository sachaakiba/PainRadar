import { Feature } from "@/types";

export const features: Feature[] = [
  {
    slug: "pain-point-detection",
    title: "Pain Point Detection",
    description:
      "We scan Reddit, forums, review sites, and support communities to find real customer complaints—not assumptions. Every pain point is sourced, tagged, and scored for severity and frequency.",
    icon: "Crosshair",
    details: [
      "Multi-source aggregation: Reddit, Hacker News, G2, Capterra, and niche forums",
      "Sentiment analysis and severity scoring per pain point",
      "Source attribution with links back to original posts",
      "Tagging by problem category and target audience",
    ],
  },
  {
    slug: "idea-validation",
    title: "Idea Validation",
    description:
      "Turn pain points into actionable product ideas. We suggest differentiation angles, MVP scope, and monetization models—so you can evaluate opportunities before you invest time building.",
    icon: "Lightbulb",
    details: [
      "AI-generated product ideas linked to specific pain points",
      "Target audience and monetization model suggestions",
      "MVP scope recommendations to ship faster",
      "Differentiation ideas based on competitor gaps",
    ],
  },
  {
    slug: "keyword-insights",
    title: "Keyword Insights",
    description:
      "Discover high-intent keywords and content angles from real customer language. See what your audience searches for when they're in pain—and use it for positioning, content, and acquisition.",
    icon: "TrendingUp",
    details: [
      "Keywords derived from pain point discussions and reviews",
      "Intent classification (problem-aware, solution-aware, product-aware)",
      "Priority scoring for content and landing pages",
      "Recurring phrases that indicate strong demand",
    ],
  },
  {
    slug: "seo-insights",
    title: "SEO Insights",
    description:
      "See what people actually search for when they're in pain. Our keyword analysis surfaces high-intent terms, content gaps, and acquisition opportunities so you can rank where it matters.",
    icon: "TrendingUp",
    details: [
      "Keyword ideas derived from real customer language",
      "Intent classification (problem-aware, solution-aware, product-aware)",
      "Priority scoring for content and landing page planning",
      "Recurring phrases that indicate strong demand",
    ],
  },
  {
    slug: "opportunity-scoring",
    title: "Opportunity Scoring",
    description:
      "We score each opportunity on demand, urgency, competition, and monetization. No more gut feelings—make decisions with a clear framework that compares apples to apples.",
    icon: "BarChart3",
    details: [
      "Composite opportunity score (0–100) across five dimensions",
      "Demand score: volume and consistency of complaints",
      "Urgency score: how badly people want a solution now",
      "Competition and monetization viability assessment",
    ],
  },
];
