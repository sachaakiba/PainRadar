import { UseCase } from "@/types";

export const useCases: UseCase[] = [
  {
    slug: "indie-hackers",
    title: "PainRadar for Indie Hackers",
    description:
      "Stop guessing what to build. PainRadar surfaces real pain points from Reddit, forums, and reviews so you can validate ideas before writing a single line of code. Perfect for solo founders who want to ship products people actually need.",
    audience: "Solo founders and indie hackers building in public",
    painPoints: [
      "Wasting months building ideas that nobody wants",
      "Guessing at problems instead of validating with real data",
      "Not knowing how to find or prioritize customer complaints",
      "Lacking time to manually research dozens of communities",
    ],
    benefits: [
      "Discover validated ideas in minutes, not months",
      "See which pain points have the highest demand and urgency",
      "Get AI-summarized insights from real customer conversations",
      "Focus your limited time on building, not researching",
    ],
  },
  {
    slug: "agencies",
    title: "PainRadar for Agencies",
    description:
      "Win more clients by proposing solutions that solve real problems. PainRadar gives your team data-backed insight into prospect pain points, helping you craft proposals that resonate and differentiate from generic competitors.",
    audience: "Digital agencies, consultancies, and service businesses",
    painPoints: [
      "Proposing generic solutions that don't address specific client pain",
      "Struggling to differentiate in crowded RFP responses",
      "Lacking concrete data to back up recommendations",
      "Spending hours on manual research for each prospect",
    ],
    benefits: [
      "Generate client-specific pain point reports in minutes",
      "Support proposals with real customer complaints and demand signals",
      "Identify underserved niches and expansion opportunities",
      "Equip your team with research that closes deals",
    ],
  },
  {
    slug: "freelancers",
    title: "PainRadar for Freelancers",
    description:
      "Find tools and product ideas that solve real problems freelancers complain about. PainRadar surfaces pain points from invoicing, scheduling, and client management—so you can build or choose solutions that fit how freelancers actually work.",
    audience: "Freelancers, solo consultants, and independent professionals",
    painPoints: [
      "Juggling invoicing, contracts, and time tracking across multiple tools",
      "No single view of client work and payments",
      "Manual follow-ups for late payments and renewals",
      "Finding software built for solo use, not enterprises",
    ],
    benefits: [
      "Discover which pain points freelancers talk about most",
      "See validated product ideas tailored to freelance workflows",
      "Get keyword and positioning angles from real discussions",
      "Validate your own tool idea before building",
    ],
  },
  {
    slug: "startups",
    title: "PainRadar for Startups",
    description:
      "Validate your roadmap with evidence, not intuition. PainRadar analyzes thousands of conversations to surface the pain points that matter most—so product, growth, and founders can align on what to build next.",
    audience: "Early-stage startups and product teams",
    painPoints: [
      "Building features based on HiPPO opinions instead of data",
      "Unclear which customer complaints deserve roadmap priority",
      "Competitive landscape feels opaque and hard to quantify",
      "Limited time for deep customer research before each sprint",
    ],
    benefits: [
      "Prioritize features using real demand and urgency scores",
      "Understand competitive positioning from actual customer feedback",
      "Identify adjacent problems and expansion opportunities",
      "Align the whole team around evidence-based roadmaps",
    ],
  },
];
