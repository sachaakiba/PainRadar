import { PricingPlan } from "@/types";

export const PACK_CREDITS: Record<"single" | "hobbyist" | "founder", number> = {
  single: 1,
  hobbyist: 10,
  founder: 35,
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    planId: "free",
    price: "$0",
    description: "Perfect to test the radar's power.",
    credits: 2,
    features: [
      "2 credits included at signup",
      "Basic pain point detection",
      "Opportunity scoring",
    ],
    cta: "Start Discovering (Free)",
  },
  {
    name: "Single Credit",
    planId: "single",
    price: "$5",
    badge: "one-time",
    description: "Run one full analysis right now.",
    credits: 1,
    features: [
      "1 full analysis credit",
      "AI-ready prompt generated",
      "Product ideas & MVP",
      "SEO keyword suggestions",
      "Targeted acquisition channels",
      "Export data (PDF / JSON)",
    ],
    cta: "Get 1 Credit",
  },
  {
    name: "Hobbyist Pack",
    planId: "hobbyist",
    price: "$15",
    badge: "one-time",
    description: "Explore several niches this weekend.",
    credits: 10,
    features: [
      "10 full analysis credits",
      "AI-ready prompt generated",
      "Product ideas & MVP",
      "SEO keyword suggestions",
      "Targeted acquisition channels",
      "Export data (PDF / JSON)",
      "Credits never expire",
    ],
    cta: "Get 10 Credits",
    highlighted: true,
  },
  {
    name: "Founder Pack",
    planId: "founder",
    price: "$39",
    badge: "best value",
    description: "For creators who want to validate in depth.",
    credits: 35,
    features: [
      "35 full analysis credits",
      "AI-ready prompt generated",
      "Product ideas & MVP",
      "SEO keyword suggestions",
      "Targeted acquisition channels",
      "Export data (PDF / JSON)",
      "Priority access to new features",
      "Credits never expire",
    ],
    cta: "Get 35 Credits",
  },
];
