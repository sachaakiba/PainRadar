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
  // Health & wellness
  { slug: "patient-scheduling-for-dentists", problem: "patient-scheduling", audience: "dentists", translationKey: "patientSchedulingDentists", relatedSlugs: ["appointment-booking-for-salons", "crm-for-therapists"] },
  { slug: "billing-for-physical-therapists", problem: "billing", audience: "physical-therapists", translationKey: "billingPhysicalTherapists", relatedSlugs: ["invoicing-for-freelancers", "crm-for-therapists"] },
  { slug: "ehr-for-solo-practitioners", problem: "ehr", audience: "solo-practitioners", translationKey: "ehrSoloPractitioners", relatedSlugs: ["crm-for-therapists", "document-management-for-accountants"] },
  { slug: "intake-forms-for-therapists", problem: "intake-forms", audience: "therapists", translationKey: "intakeFormsTherapists", relatedSlugs: ["crm-for-therapists", "client-onboarding-for-agencies"] },
  { slug: "no-show-management-for-clinics", problem: "no-show-management", audience: "clinics", translationKey: "noShowManagementClinics", relatedSlugs: ["appointment-booking-for-salons", "patient-scheduling-for-dentists"] },
  { slug: "hipaa-compliance-for-telehealth", problem: "hipaa-compliance", audience: "telehealth", translationKey: "hipaaComplianceTelehealth", relatedSlugs: ["ehr-for-solo-practitioners", "crm-for-therapists"] },
  // Education & tutoring
  { slug: "progress-tracking-for-tutors", problem: "progress-tracking", audience: "tutors", translationKey: "progressTrackingTutors", relatedSlugs: ["scheduling-for-tutors", "invoicing-for-freelancers"] },
  { slug: "homework-management-for-teachers", problem: "homework-management", audience: "teachers", translationKey: "homeworkManagementTeachers", relatedSlugs: ["scheduling-for-tutors", "progress-tracking-for-tutors"] },
  { slug: "lms-for-online-course-creators", problem: "lms", audience: "online-course-creators", translationKey: "lmsOnlineCourseCreators", relatedSlugs: ["scheduling-for-tutors", "membership-management-for-gyms"] },
  { slug: "student-billing-for-music-schools", problem: "student-billing", audience: "music-schools", translationKey: "studentBillingMusicSchools", relatedSlugs: ["invoicing-for-freelancers", "scheduling-for-tutors"] },
  // Real estate
  { slug: "property-management-for-landlords", problem: "property-management", audience: "landlords", translationKey: "propertyManagementLandlords", relatedSlugs: ["lead-tracking-for-realtors", "invoicing-for-freelancers"] },
  { slug: "tenant-communication-for-property-managers", problem: "tenant-communication", audience: "property-managers", translationKey: "tenantCommunicationPropertyManagers", relatedSlugs: ["property-management-for-landlords", "crm-for-lawyers"] },
  { slug: "listing-management-for-realtors", problem: "listing-management", audience: "realtors", translationKey: "listingManagementRealtors", relatedSlugs: ["lead-tracking-for-realtors", "crm-for-lawyers"] },
  { slug: "lease-tracking-for-commercial-real-estate", problem: "lease-tracking", audience: "commercial-real-estate", translationKey: "leaseTrackingCommercialRealEstate", relatedSlugs: ["contract-management-for-lawyers", "document-management-for-accountants"] },
  // Legal & compliance
  { slug: "matter-management-for-solo-lawyers", problem: "matter-management", audience: "solo-lawyers", translationKey: "matterManagementSoloLawyers", relatedSlugs: ["crm-for-lawyers", "contract-management-for-lawyers"] },
  { slug: "billing-for-law-firms", problem: "billing", audience: "law-firms", translationKey: "billingLawFirms", relatedSlugs: ["invoicing-for-freelancers", "crm-for-lawyers"] },
  { slug: "e-signature-for-small-businesses", problem: "e-signature", audience: "small-businesses", translationKey: "eSignatureSmallBusinesses", relatedSlugs: ["contract-management-for-lawyers", "client-onboarding-for-agencies"] },
  { slug: "compliance-tracking-for-hr-teams", problem: "compliance-tracking", audience: "hr-teams", translationKey: "complianceTrackingHrTeams", relatedSlugs: ["recruiting-for-agencies", "payroll-for-contractors"] },
  // Finance & accounting
  { slug: "bookkeeping-for-ecommerce-sellers", problem: "bookkeeping", audience: "ecommerce-sellers", translationKey: "bookkeepingEcommerceSellers", relatedSlugs: ["invoicing-for-freelancers", "expense-tracking-for-freelancers"] },
  { slug: "tax-prep-for-freelancers", problem: "tax-prep", audience: "freelancers", translationKey: "taxPrepFreelancers", relatedSlugs: ["invoicing-for-freelancers", "expense-tracking-for-freelancers"] },
  { slug: "cash-flow-forecasting-for-startups", problem: "cash-flow-forecasting", audience: "startups", translationKey: "cashFlowForecastingStartups", relatedSlugs: ["invoicing-for-freelancers", "quotes-and-proposals-for-agencies"] },
  { slug: "receipt-management-for-small-businesses", problem: "receipt-management", audience: "small-businesses", translationKey: "receiptManagementSmallBusinesses", relatedSlugs: ["expense-tracking-for-freelancers", "document-management-for-accountants"] },
  { slug: "payroll-for-small-teams", problem: "payroll", audience: "small-teams", translationKey: "payrollSmallTeams", relatedSlugs: ["payroll-for-contractors", "recruiting-for-agencies"] },
  // Hospitality & food
  { slug: "table-management-for-restaurants", problem: "table-management", audience: "restaurants", translationKey: "tableManagementRestaurants", relatedSlugs: ["booking-for-restaurants", "restaurant-waitlist"] },
  { slug: "catering-management-for-event-planners", problem: "catering-management", audience: "event-planners", translationKey: "cateringManagementEventPlanners", relatedSlugs: ["booking-for-restaurants", "scheduling-for-tutors"] },
  { slug: "tip-tracking-for-hospitality-workers", problem: "tip-tracking", audience: "hospitality-workers", translationKey: "tipTrackingHospitalityWorkers", relatedSlugs: ["payroll-for-contractors", "invoicing-for-freelancers"] },
  { slug: "inventory-for-food-trucks", problem: "inventory", audience: "food-trucks", translationKey: "inventoryFoodTrucks", relatedSlugs: ["inventory-for-small-retail", "booking-for-restaurants"] },
  { slug: "allergen-tracking-for-restaurants", problem: "allergen-tracking", audience: "restaurants", translationKey: "allergenTrackingRestaurants", relatedSlugs: ["booking-for-restaurants", "inventory-for-food-trucks"] },
  // Marketing & content
  { slug: "social-media-scheduling-for-solopreneurs", problem: "social-media-scheduling", audience: "solopreneurs", translationKey: "socialMediaSchedulingSolopreneurs", relatedSlugs: ["project-management-for-freelancers", "invoicing-for-freelancers"] },
  { slug: "content-calendar-for-agencies", problem: "content-calendar", audience: "agencies", translationKey: "contentCalendarAgencies", relatedSlugs: ["client-onboarding-for-agencies", "quotes-and-proposals-for-agencies"] },
  { slug: "link-building-for-seo-agencies", problem: "link-building", audience: "seo-agencies", translationKey: "linkBuildingSeoAgencies", relatedSlugs: ["recruiting-for-agencies", "client-onboarding-for-agencies"] },
  { slug: "email-list-management-for-creators", problem: "email-list-management", audience: "creators", translationKey: "emailListManagementCreators", relatedSlugs: ["social-media-scheduling-for-solopreneurs", "lms-for-online-course-creators"] },
  { slug: "podcast-editing-workflow-for-indie-creators", problem: "podcast-editing-workflow", audience: "indie-creators", translationKey: "podcastEditingWorkflowIndieCreators", relatedSlugs: ["social-media-scheduling-for-solopreneurs", "email-list-management-for-creators"] },
  // Tech & software
  { slug: "bug-tracking-for-solo-developers", problem: "bug-tracking", audience: "solo-developers", translationKey: "bugTrackingSoloDevelopers", relatedSlugs: ["project-management-for-freelancers", "client-onboarding-for-agencies"] },
  { slug: "api-documentation-for-dev-tools", problem: "api-documentation", audience: "dev-tools", translationKey: "apiDocumentationDevTools", relatedSlugs: ["project-management-for-freelancers", "invoicing-for-freelancers"] },
  { slug: "deployment-tracking-for-indie-hackers", problem: "deployment-tracking", audience: "indie-hackers", translationKey: "deploymentTrackingIndieHackers", relatedSlugs: ["bug-tracking-for-solo-developers", "project-management-for-freelancers"] },
  { slug: "uptime-monitoring-for-saas-founders", problem: "uptime-monitoring", audience: "saas-founders", translationKey: "uptimeMonitoringSaasFounders", relatedSlugs: ["bug-tracking-for-solo-developers", "deployment-tracking-for-indie-hackers"] },
  { slug: "customer-feedback-for-product-teams", problem: "customer-feedback", audience: "product-teams", translationKey: "customerFeedbackProductTeams", relatedSlugs: ["client-onboarding-for-agencies", "bug-tracking-for-solo-developers"] },
  // HR & recruitment
  { slug: "employee-onboarding-for-remote-teams", problem: "employee-onboarding", audience: "remote-teams", translationKey: "employeeOnboardingRemoteTeams", relatedSlugs: ["recruiting-for-agencies", "client-onboarding-for-agencies"] },
  { slug: "performance-reviews-for-small-companies", problem: "performance-reviews", audience: "small-companies", translationKey: "performanceReviewsSmallCompanies", relatedSlugs: ["employee-onboarding-for-remote-teams", "compliance-tracking-for-hr-teams"] },
  { slug: "pto-tracking-for-small-businesses", problem: "pto-tracking", audience: "small-businesses", translationKey: "ptoTrackingSmallBusinesses", relatedSlugs: ["payroll-for-small-teams", "compliance-tracking-for-hr-teams"] },
  { slug: "interview-scheduling-for-hr-teams", problem: "interview-scheduling", audience: "hr-teams", translationKey: "interviewSchedulingHrTeams", relatedSlugs: ["recruiting-for-agencies", "scheduling-for-tutors"] },
  // E-commerce & retail
  { slug: "returns-management-for-ecommerce", problem: "returns-management", audience: "ecommerce", translationKey: "returnsManagementEcommerce", relatedSlugs: ["inventory-for-small-retail", "bookkeeping-for-ecommerce-sellers"] },
  { slug: "product-listing-for-marketplace-sellers", problem: "product-listing", audience: "marketplace-sellers", translationKey: "productListingMarketplaceSellers", relatedSlugs: ["inventory-for-small-retail", "bookkeeping-for-ecommerce-sellers"] },
  { slug: "wholesale-ordering-for-boutiques", problem: "wholesale-ordering", audience: "boutiques", translationKey: "wholesaleOrderingBoutiques", relatedSlugs: ["inventory-for-small-retail", "invoicing-for-freelancers"] },
  { slug: "abandoned-cart-recovery-for-shopify-stores", problem: "abandoned-cart-recovery", audience: "shopify-stores", translationKey: "abandonedCartRecoveryShopifyStores", relatedSlugs: ["email-list-management-for-creators", "inventory-for-small-retail"] },
  { slug: "subscription-management-for-ecommerce", problem: "subscription-management", audience: "ecommerce", translationKey: "subscriptionManagementEcommerce", relatedSlugs: ["membership-management-for-gyms", "bookkeeping-for-ecommerce-sellers"] },
  // Construction & trades
  { slug: "job-costing-for-contractors", problem: "job-costing", audience: "contractors", translationKey: "jobCostingContractors", relatedSlugs: ["invoicing-for-freelancers", "quotes-and-proposals-for-agencies"] },
  { slug: "crew-scheduling-for-construction", problem: "crew-scheduling", audience: "construction", translationKey: "crewSchedulingConstruction", relatedSlugs: ["scheduling-for-tutors", "payroll-for-contractors"] },
  { slug: "permit-tracking-for-general-contractors", problem: "permit-tracking", audience: "general-contractors", translationKey: "permitTrackingGeneralContractors", relatedSlugs: ["document-management-for-accountants", "compliance-tracking-for-hr-teams"] },
  { slug: "punch-list-for-construction-managers", problem: "punch-list", audience: "construction-managers", translationKey: "punchListConstructionManagers", relatedSlugs: ["job-costing-for-contractors", "project-management-for-freelancers"] },
  // Fitness & wellness
  { slug: "class-scheduling-for-yoga-studios", problem: "class-scheduling", audience: "yoga-studios", translationKey: "classSchedulingYogaStudios", relatedSlugs: ["membership-management-for-gyms", "appointment-booking-for-salons"] },
  { slug: "personal-trainer-client-tracking", problem: "client-tracking", audience: "personal-trainers", translationKey: "clientTrackingPersonalTrainers", relatedSlugs: ["crm-for-therapists", "scheduling-for-coaches"] },
  { slug: "nutrition-coaching-for-wellness-coaches", problem: "nutrition-coaching", audience: "wellness-coaches", translationKey: "nutritionCoachingWellnessCoaches", relatedSlugs: ["scheduling-for-coaches", "crm-for-therapists"] },
  // Event & creative services
  { slug: "client-galleries-for-photographers", problem: "client-galleries", audience: "photographers", translationKey: "clientGalleriesPhotographers", relatedSlugs: ["invoicing-for-freelancers", "client-onboarding-for-agencies"] },
  { slug: "event-budgeting-for-wedding-planners", problem: "event-budgeting", audience: "wedding-planners", translationKey: "eventBudgetingWeddingPlanners", relatedSlugs: ["catering-management-for-event-planners", "quotes-and-proposals-for-agencies"] },
  { slug: "vendor-management-for-event-planners", problem: "vendor-management", audience: "event-planners", translationKey: "vendorManagementEventPlanners", relatedSlugs: ["catering-management-for-event-planners", "crm-for-lawyers"] },
  { slug: "portfolio-management-for-designers", problem: "portfolio-management", audience: "designers", translationKey: "portfolioManagementDesigners", relatedSlugs: ["invoicing-for-freelancers", "project-management-for-freelancers"] },
  // Consulting & professional services
  { slug: "proposal-tracking-for-consultants", problem: "proposal-tracking", audience: "consultants", translationKey: "proposalTrackingConsultants", relatedSlugs: ["quotes-and-proposals-for-agencies", "crm-for-lawyers"] },
  { slug: "deliverable-management-for-consultants", problem: "deliverable-management", audience: "consultants", translationKey: "deliverableManagementConsultants", relatedSlugs: ["project-management-for-freelancers", "client-onboarding-for-agencies"] },
  { slug: "retainer-billing-for-agencies", problem: "retainer-billing", audience: "agencies", translationKey: "retainerBillingAgencies", relatedSlugs: ["invoicing-for-freelancers", "quotes-and-proposals-for-agencies"] },
  { slug: "knowledge-management-for-consulting-firms", problem: "knowledge-management", audience: "consulting-firms", translationKey: "knowledgeManagementConsultingFirms", relatedSlugs: ["document-management-for-accountants", "project-management-for-freelancers"] },
  // Childcare & senior care
  { slug: "attendance-tracking-for-daycares", problem: "attendance-tracking", audience: "daycares", translationKey: "attendanceTrackingDaycares", relatedSlugs: ["scheduling-for-tutors", "invoicing-for-freelancers"] },
  { slug: "billing-for-home-care-agencies", problem: "billing", audience: "home-care-agencies", translationKey: "billingHomeCareAgencies", relatedSlugs: ["invoicing-for-freelancers", "compliance-tracking-for-hr-teams"] },
  { slug: "caregiver-scheduling-for-senior-care", problem: "caregiver-scheduling", audience: "senior-care", translationKey: "caregiverSchedulingSeniorCare", relatedSlugs: ["crew-scheduling-for-construction", "scheduling-for-coaches"] },
  // Travel & transportation
  { slug: "route-optimization-for-delivery-businesses", problem: "route-optimization", audience: "delivery-businesses", translationKey: "routeOptimizationDeliveryBusinesses", relatedSlugs: ["inventory-for-small-retail", "invoicing-for-freelancers"] },
  { slug: "fleet-management-for-small-fleets", problem: "fleet-management", audience: "small-fleets", translationKey: "fleetManagementSmallFleets", relatedSlugs: ["route-optimization-for-delivery-businesses", "job-costing-for-contractors"] },
  { slug: "booking-management-for-tour-operators", problem: "booking-management", audience: "tour-operators", translationKey: "bookingManagementTourOperators", relatedSlugs: ["booking-for-restaurants", "catering-management-for-event-planners"] },
  // Nonprofit & community
  { slug: "volunteer-management-for-nonprofits", problem: "volunteer-management", audience: "nonprofits", translationKey: "volunteerManagementNonprofits", relatedSlugs: ["recruiting-for-agencies", "membership-management-for-gyms"] },
  { slug: "donation-tracking-for-nonprofits", problem: "donation-tracking", audience: "nonprofits", translationKey: "donationTrackingNonprofits", relatedSlugs: ["bookkeeping-for-ecommerce-sellers", "crm-for-lawyers"] },
  { slug: "grant-management-for-nonprofits", problem: "grant-management", audience: "nonprofits", translationKey: "grantManagementNonprofits", relatedSlugs: ["document-management-for-accountants", "compliance-tracking-for-hr-teams"] },
  // Insurance & finance
  { slug: "policy-management-for-insurance-brokers", problem: "policy-management", audience: "insurance-brokers", translationKey: "policyManagementInsuranceBrokers", relatedSlugs: ["crm-for-lawyers", "document-management-for-accountants"] },
  { slug: "client-reporting-for-financial-advisors", problem: "client-reporting", audience: "financial-advisors", translationKey: "clientReportingFinancialAdvisors", relatedSlugs: ["crm-for-lawyers", "document-management-for-accountants"] },
  { slug: "onboarding-for-wealth-managers", problem: "onboarding", audience: "wealth-managers", translationKey: "onboardingWealthManagers", relatedSlugs: ["client-onboarding-for-agencies", "e-signature-for-small-businesses"] },
  // Pet services
  { slug: "appointment-booking-for-vets", problem: "appointment-booking", audience: "vets", translationKey: "appointmentBookingVets", relatedSlugs: ["appointment-booking-for-salons", "patient-scheduling-for-dentists"] },
  { slug: "client-management-for-dog-walkers", problem: "client-management", audience: "dog-walkers", translationKey: "clientManagementDogWalkers", relatedSlugs: ["scheduling-for-coaches", "invoicing-for-freelancers"] },
  { slug: "billing-for-pet-groomers", problem: "billing", audience: "pet-groomers", translationKey: "billingPetGroomers", relatedSlugs: ["invoicing-for-freelancers", "appointment-booking-for-salons"] },
  // Automotive
  { slug: "repair-order-management-for-auto-shops", problem: "repair-order-management", audience: "auto-shops", translationKey: "repairOrderManagementAutoShops", relatedSlugs: ["invoicing-for-freelancers", "inventory-for-small-retail"] },
  { slug: "vehicle-inspection-for-dealerships", problem: "vehicle-inspection", audience: "dealerships", translationKey: "vehicleInspectionDealerships", relatedSlugs: ["document-management-for-accountants", "crm-for-lawyers"] },
  // Cleaning & home services
  { slug: "job-scheduling-for-cleaning-businesses", problem: "job-scheduling", audience: "cleaning-businesses", translationKey: "jobSchedulingCleaningBusinesses", relatedSlugs: ["scheduling-for-tutors", "invoicing-for-freelancers"] },
  { slug: "quoting-for-lawn-care-businesses", problem: "quoting", audience: "lawn-care-businesses", translationKey: "quotingLawnCareBusinesses", relatedSlugs: ["quotes-and-proposals-for-agencies", "job-scheduling-for-cleaning-businesses"] },
  { slug: "recurring-service-management-for-home-services", problem: "recurring-service-management", audience: "home-services", translationKey: "recurringServiceManagementHomeServices", relatedSlugs: ["job-scheduling-for-cleaning-businesses", "membership-management-for-gyms"] },
];

export function getPainPageBySlug(slug: string): PainPageSeed | undefined {
  return PAIN_PAGE_SEEDS.find((p) => p.slug === slug);
}

export function getAllPainSlugs(): string[] {
  return PAIN_PAGE_SEEDS.map((p) => p.slug);
}
