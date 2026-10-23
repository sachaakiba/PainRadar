export type Alternative = {
  slug: string;
  title: string;
  description: string;
  comparison: {
    painRadar: string[];
    alternative: string[];
  };
};

export const alternatives: Alternative[] = [
  {
    slug: "manual-research",
    title: "Manual Reddit Research",
    description:
      "Manually scrolling through Reddit, forums, and review sites to find pain points. Many founders start here—but it's time-consuming and hard to scale.",
    comparison: {
      painRadar: [
        "Automated analysis across Reddit, forums, G2, Capterra, and niche communities",
        "Structured pain point extraction with severity scoring and source attribution",
        "Opportunity scoring across demand, urgency, competition, and monetization",
        "Product ideas and SEO keywords generated from real customer language",
        "Results in minutes, not hours or days",
      ],
      alternative: [
        "Manual searches and endless scrolling",
        "Unstructured notes and spreadsheets",
        "No consistent scoring or prioritization framework",
        "Ad-hoc keyword ideas from memory",
        "Hours of research for each topic",
      ],
    },
  },
  {
    slug: "google-trends",
    title: "Google Trends",
    description:
      "Google Trends shows search volume over time. Useful for high-level interest, but it doesn't reveal pain points, complaints, or product opportunities.",
    comparison: {
      painRadar: [
        "Real customer complaints and frustrations—not just search volume",
        "Pain point extraction with sentiment and severity",
        "Product ideas and differentiation angles from actual discussions",
        "Competitor gap analysis from review sites and forums",
        "Context: what people say when they're frustrated, not just what they search",
      ],
      alternative: [
        "Search volume trends only—no qualitative insight",
        "No pain point or complaint data",
        "No product or positioning recommendations",
        "Limited competitor context",
        "No direct link to customer language",
      ],
    },
  },
  {
    slug: "survey-tools",
    title: "Survey Tools",
    description:
      "Survey tools like Typeform or Google Forms let you ask people what they want. But surveys require an audience, leading questions, and often miss unsolicited frustration.",
    comparison: {
      painRadar: [
        "Analyzes unsolicited feedback—what people say when nobody's asking",
        "No audience required; works from public discussions",
        "Unbiased: real complaints, not survey-leading answers",
        "Instant insights; no need to design, send, or wait for surveys",
        "Scales to any number of niches and topics",
      ],
      alternative: [
        "Requires building or buying an audience first",
        "Leading questions skew results",
        "People answer what they think you want to hear",
        "Weeks to design, send, and analyze",
        "One survey per topic; hard to scale",
      ],
    },
  },
  {
    slug: "gummysearch",
    title: "GummySearch",
    description:
      "GummySearch was a Reddit audience research tool built for entrepreneurs. It closed in November 2025, leaving thousands of founders searching for a replacement.",
    comparison: {
      painRadar: [
        "Active platform—built for long-term use with ongoing updates",
        "Analyzes Reddit plus G2, Capterra, Trustpilot, and niche forums",
        "Opportunity scoring across demand, urgency, competition, and monetization",
        "AI-generated product ideas and MVP scope from each pain point",
        "SEO keyword discovery from real customer language",
        "One-time pricing—no recurring subscription required",
      ],
      alternative: [
        "Shut down November 2025—no longer available",
        "Reddit-only; no review site or forum analysis",
        "Required ongoing subscription while it was active",
        "Browsing-focused rather than pain point extraction",
        "No opportunity scoring or product idea generation",
      ],
    },
  },
  {
    slug: "exploding-topics",
    title: "Exploding Topics",
    description:
      "Exploding Topics surfaces fast-growing search trends before they peak. It's useful for spotting rising categories, but it doesn't show you why people are frustrated or what to build.",
    comparison: {
      painRadar: [
        "Real customer complaints and frustrations, not just trend signals",
        "Pain point extraction with context, quotes, and severity scoring",
        "Product ideas and differentiation angles from actual discussions",
        "Competitor gap analysis from review sites",
        "One-time credit pricing—not a recurring subscription",
      ],
      alternative: [
        "Trend detection only—no qualitative pain point data",
        "No complaints, frustrations, or customer quotes",
        "No product idea or positioning recommendations",
        "Subscription required for full access",
        "Shows what's growing, not why or what to build for it",
      ],
    },
  },
  {
    slug: "painpoints-fast",
    title: "PainPoints.fast",
    description:
      "PainPoints.fast is a lightweight Reddit pain-point scraper aimed at indie hackers. It extracts posts mentioning frustration but lacks scoring, product ideation, or multi-source analysis.",
    comparison: {
      painRadar: [
        "Multi-source analysis: Reddit, forums, G2, Capterra, niche communities",
        "Structured opportunity scoring across 5 dimensions",
        "Full product ideas, MVP scope, and SEO keywords per analysis",
        "Targeted acquisition channels to reach the audience you found",
        "Export to PDF or JSON for sharing with co-founders or investors",
      ],
      alternative: [
        "Reddit-only; misses review site and forum complaints",
        "Raw post dump — no scoring or prioritization",
        "No product idea generation or MVP guidance",
        "No acquisition channel recommendations",
        "No export functionality",
      ],
    },
  },
  {
    slug: "bigideasdb",
    title: "BigIdeasDB",
    description:
      "BigIdeasDB mines app store and review site data to surface product gaps. It's review-focused but stays at the idea level—without the pain point depth or SEO angle that founders need.",
    comparison: {
      painRadar: [
        "Analyzes Reddit, forums, and review sites—broader data sources",
        "Structured pain point extraction with severity, frequency, and quotes",
        "Opportunity scoring across demand, urgency, competition, and monetization",
        "AI-generated product ideas with MVP scope and differentiation",
        "SEO keyword discovery from real customer language",
        "One-time credit pricing—no subscription",
      ],
      alternative: [
        "Primarily app store and review site data",
        "Curated ideas without deep pain point analysis",
        "Subscription required",
        "Less SEO and acquisition channel guidance",
        "No structured scoring methodology exposed to users",
      ],
    },
  },
];
