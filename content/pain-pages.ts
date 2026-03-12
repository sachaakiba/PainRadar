/**
 * Typed data for programmatic SEO pages: /pain/[slug]
 * Slug format: [problem]-for-[audience]. Copy in messages under painPages.[translationKey].
 * Structured for scaling: swap to DB/ETL later; keep same shape.
 */

export type PainPageSeed = {
  slug: string;
  problem: string;
  audience: string;
  /** Key for getTranslations("painPages.[translationKey]") */
  translationKey: string;
  /** Related pain slugs for internal linking */
  relatedSlugs: string[];
};

export const PAIN_PAGE_SEEDS: PainPageSeed[] = [
  { slug: "invoicing-for-freelancers", problem: "invoicing", audience: "freelancers", translationKey: "invoicingFreelancers", relatedSlugs: ["crm-for-therapists", "scheduling-for-tutors", "client-onboarding-for-agencies"] },
  { slug: "crm-for-therapists", problem: "crm", audience: "therapists", translationKey: "crmTherapists", relatedSlugs: ["invoicing-for-freelancers", "scheduling-for-tutors", "crm-for-lawyers"] },
  { slug: "scheduling-for-tutors", problem: "scheduling", audience: "tutors", translationKey: "schedulingTutors", relatedSlugs: ["invoicing-for-freelancers", "booking-for-restaurants", "crm-for-therapists"] },
  { slug: "recruiting-for-agencies", problem: "recruiting", audience: "agencies", translationKey: "recruitingAgencies", relatedSlugs: ["client-onboarding-for-agencies", "invoicing-for-freelancers"] },
  { slug: "restaurant-waitlist", problem: "waitlist", audience: "restaurants", translationKey: "restaurantWaitlist", relatedSlugs: ["booking-for-restaurants", "scheduling-for-tutors"] },
  { slug: "crm-for-lawyers", problem: "crm", audience: "lawyers", translationKey: "crmLawyers", relatedSlugs: ["crm-for-therapists", "client-onboarding-for-agencies"] },
  { slug: "scheduling-for-coaches", problem: "scheduling", audience: "coaches", translationKey: "schedulingCoaches", relatedSlugs: ["scheduling-for-tutors", "booking-for-restaurants"] },
  { slug: "booking-for-restaurants", problem: "booking", audience: "restaurants", translationKey: "bookingRestaurants", relatedSlugs: ["restaurant-waitlist", "scheduling-for-tutors"] },
  { slug: "client-onboarding-for-agencies", problem: "client-onboarding", audience: "agencies", translationKey: "clientOnboardingAgencies", relatedSlugs: ["recruiting-for-agencies", "invoicing-for-freelancers"] },
  { slug: "inventory-for-small-retail", problem: "inventory", audience: "small-retail", translationKey: "inventorySmallRetail", relatedSlugs: ["invoicing-for-freelancers", "booking-for-restaurants"] },
  { slug: "payroll-for-contractors", problem: "payroll", audience: "contractors", translationKey: "payrollContractors", relatedSlugs: ["invoicing-for-freelancers", "recruiting-for-agencies"] },
  { slug: "project-management-for-freelancers", problem: "project-management", audience: "freelancers", translationKey: "projectManagementFreelancers", relatedSlugs: ["invoicing-for-freelancers", "client-onboarding-for-agencies"] },
  { slug: "time-tracking-for-consultants", problem: "time-tracking", audience: "consultants", translationKey: "timeTrackingConsultants", relatedSlugs: ["invoicing-for-freelancers", "scheduling-for-coaches"] },
  { slug: "contract-management-for-lawyers", problem: "contract-management", audience: "lawyers", translationKey: "contractManagementLawyers", relatedSlugs: ["crm-for-lawyers", "client-onboarding-for-agencies"] },
  { slug: "appointment-booking-for-salons", problem: "appointment-booking", audience: "salons", translationKey: "appointmentBookingSalons", relatedSlugs: ["scheduling-for-tutors", "booking-for-restaurants"] },
  { slug: "document-management-for-accountants", problem: "document-management", audience: "accountants", translationKey: "documentManagementAccountants", relatedSlugs: ["crm-for-lawyers", "invoicing-for-freelancers"] },
  { slug: "lead-tracking-for-realtors", problem: "lead-tracking", audience: "realtors", translationKey: "leadTrackingRealtors", relatedSlugs: ["crm-for-lawyers", "client-onboarding-for-agencies"] },
  { slug: "membership-management-for-gyms", problem: "membership-management", audience: "gyms", translationKey: "membershipManagementGyms", relatedSlugs: ["booking-for-restaurants", "scheduling-for-coaches"] },
  { slug: "expense-tracking-for-freelancers", problem: "expense-tracking", audience: "freelancers", translationKey: "expenseTrackingFreelancers", relatedSlugs: ["invoicing-for-freelancers", "project-management-for-freelancers"] },
  { slug: "quotes-and-proposals-for-agencies", problem: "quotes-and-proposals", audience: "agencies", translationKey: "quotesProposalsAgencies", relatedSlugs: ["client-onboarding-for-agencies", "invoicing-for-freelancers"] },
];

export function getPainPageBySlug(slug: string): PainPageSeed | undefined {
  return PAIN_PAGE_SEEDS.find((p) => p.slug === slug);
}

export function getAllPainSlugs(): string[] {
  return PAIN_PAGE_SEEDS.map((p) => p.slug);
}
