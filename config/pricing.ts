import { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic pain point discovery.",
    features: [
      "3 analyses per month",
      "Basic pain point detection",
      "Opportunity scoring",
      "Product idea generation",
    ],
    cta: "Start for free",
  },
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "For serious founders validating ideas.",
    features: [
      "50 analyses per month",
      "Save unlimited analyses",
      "Advanced scoring breakdown",
      "SEO keyword suggestions",
      "Export to PDF & JSON",
      "Priority support",
    ],
    cta: "Get Starter",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    description: "For teams and power users.",
    features: [
      "Unlimited analyses",
      "Advanced scoring engine",
      "Competitor insights (coming soon)",
      "Custom audience targeting",
      "API access (coming soon)",
      "White-label exports",
      "Dedicated support",
    ],
    cta: "Get Pro",
  },
];
