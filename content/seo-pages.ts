/**
 * Typed data for static SEO landing pages.
 * Copy lives in messages (en.json / fr.json) under namespaces seoLanding.* and seoPages.*
 */

export type SeoPageSlug =
  | "saas-ideas"
  | "startup-ideas-from-reddit"
  | "problems-to-build-a-saas"
  | "tools-founders-wish-existed"
  | "customer-pain-points"
  | "startup-validation"
  | "pain-point-examples"
  | "niche-saas-ideas"
  | "reddit-business-ideas"
  | "micro-saas-ideas";

/** Mapping from URL path segment to i18n key prefix (under seoLanding) */
export const SEO_LANDING_PAGES: { slug: SeoPageSlug; key: string }[] = [
  { slug: "saas-ideas", key: "saasIdeas" },
  { slug: "startup-ideas-from-reddit", key: "startupIdeasFromReddit" },
  { slug: "problems-to-build-a-saas", key: "problemsToBuildASaas" },
  { slug: "tools-founders-wish-existed", key: "toolsFoundersWishExisted" },
  { slug: "customer-pain-points", key: "customerPainPoints" },
  { slug: "startup-validation", key: "startupValidation" },
  { slug: "pain-point-examples", key: "painPointExamples" },
  { slug: "niche-saas-ideas", key: "nicheSaasIdeas" },
  { slug: "reddit-business-ideas", key: "redditBusinessIdeas" },
  { slug: "micro-saas-ideas", key: "microSaasIdeas" },
];

export function getSeoPageBySlug(slug: string): { slug: SeoPageSlug; key: string } | undefined {
  return SEO_LANDING_PAGES.find((p) => p.slug === slug);
}

/** Related links groups for internal linking (slugs only) */
export const SEO_PAGE_RELATED: Record<SeoPageSlug, { pain?: string[]; features?: string[]; useCases?: string[] }> = {
  "saas-ideas": { pain: ["invoicing-for-freelancers", "crm-for-therapists"], features: ["idea-validation", "pain-point-detection"], useCases: ["indie-hackers"] },
  "startup-ideas-from-reddit": { pain: ["scheduling-for-tutors", "restaurant-waitlist"], features: ["pain-point-detection", "keyword-insights"], useCases: ["indie-hackers"] },
  "problems-to-build-a-saas": { pain: ["invoicing-for-freelancers", "recruiting-for-agencies"], features: ["idea-validation"], useCases: ["startups"] },
  "tools-founders-wish-existed": { pain: ["client-onboarding-for-agencies"], features: ["opportunity-scoring", "pain-point-detection"], useCases: ["indie-hackers", "agencies"] },
  "customer-pain-points": { pain: ["crm-for-therapists", "booking-for-restaurants"], features: ["pain-point-detection", "idea-validation"], useCases: ["startups"] },
  "startup-validation": { pain: ["invoicing-for-freelancers"], features: ["idea-validation", "opportunity-scoring"], useCases: ["indie-hackers", "startups"] },
  "pain-point-examples": { pain: ["invoicing-for-freelancers", "crm-for-therapists", "scheduling-for-tutors"], features: ["pain-point-detection"], useCases: [] },
  "niche-saas-ideas": { pain: ["crm-for-lawyers", "scheduling-for-tutors", "inventory-for-small-retail"], features: ["idea-validation", "opportunity-scoring"], useCases: ["indie-hackers"] },
  "reddit-business-ideas": { pain: ["scheduling-for-tutors", "invoicing-for-freelancers"], features: ["pain-point-detection", "keyword-insights"], useCases: ["indie-hackers"] },
  "micro-saas-ideas": { pain: ["invoicing-for-freelancers", "booking-for-restaurants"], features: ["idea-validation", "opportunity-scoring"], useCases: ["indie-hackers"] },
};
