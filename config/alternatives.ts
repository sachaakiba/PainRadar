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
];
