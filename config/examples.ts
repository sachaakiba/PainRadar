import { ExampleAnalysis } from "@/types";

export const exampleAnalyses: ExampleAnalysis[] = [
  {
    slug: "invoicing-freelancers",
    query: "invoicing for freelancers",
    topic: "Invoicing for freelancers",
    summary:
      "Freelancers across design, development, and consulting struggle with fragmented invoicing workflows. Manual invoice creation, late payment chasing, and lack of professional branding emerge as the top complaints. Many want a simple tool that handles recurring invoices, payment reminders, and basic expense tracking without the complexity of full accounting software.",
    opportunityScore: 87,
    topPainPoint:
      "Spending hours chasing clients for late payments with no automated reminders or professional follow-up sequences.",
    suggestedProduct:
      "A lightweight invoicing app with smart payment reminders, client-specific payment terms, and Stripe integration—built for solo freelancers, not agencies.",
  },
  {
    slug: "crm-therapists",
    query: "CRM for therapists",
    topic: "CRM for therapists",
    summary:
      "Mental health practitioners need client management that respects HIPAA, handles intake forms, and tracks session notes—but most CRMs feel enterprise-heavy or lack therapy-specific features. Therapists want scheduling, secure notes, and basic progress tracking without switching between five different tools. Compliance and simplicity are non-negotiable.",
    opportunityScore: 79,
    topPainPoint:
      "Using spreadsheets or generic CRMs that aren't built for therapy workflows—missing intake forms, secure note-taking, and session-based client views.",
    suggestedProduct:
      "A HIPAA-compliant practice management tool focused on solo therapists: intake forms, encrypted session notes, appointment scheduling, and simple client progress dashboards.",
  },
  {
    slug: "scheduling-tutors",
    query: "scheduling for tutors",
    topic: "Scheduling for tutors",
    summary:
      "Tutors juggling multiple students, subjects, and time zones need flexible scheduling that handles recurring sessions, make-up classes, and payment collection. Calendly and generic tools don't account for tutor-specific needs like student progress tracking, parent visibility, or session packages. Demand is highest among independent tutors and small tutoring agencies.",
    opportunityScore: 82,
    topPainPoint:
      "Constantly rescheduling sessions manually, losing track of which students need make-ups, and wasting time coordinating with parents across different time zones.",
    suggestedProduct:
      "A tutor-first scheduling platform with recurring sessions, package management, parent portal for availability, and integrated payments—designed for 1–20 students, not hundreds.",
  },
  {
    slug: "recruiting-small-agencies",
    query: "recruiting for small agencies",
    topic: "Recruiting for small agencies",
    summary:
      "Small creative and marketing agencies (5–50 people) find enterprise ATS tools overkill and spreadsheets unsustainable. They need candidate sourcing, pipeline tracking, and client-facing reports without the complexity or cost of Greenhouse or Lever. Key pain points: slow hiring, poor candidate experience, and difficulty proving recruitment ROI to clients.",
    opportunityScore: 74,
    topPainPoint:
      "Paying for bloated ATS software with features they never use, while still tracking candidates in spreadsheets and losing great hires to slow processes.",
    suggestedProduct:
      "A lean ATS for agencies: candidate pipeline, client branding, simple reporting, and integrations with job boards—priced for teams under 50, not enterprise.",
  },
  {
    slug: "restaurant-waitlist",
    query: "restaurant waitlist management",
    topic: "Restaurant waitlist management",
    summary:
      "Independent restaurants and busy cafes struggle with waitlist chaos: paper lists, long hold times on the phone, and no visibility into wait times for customers. Hosts waste time answering 'how long is the wait?' while guests leave for competitors. Demand spikes for walk-in-heavy venues and weekend brunch spots.",
    opportunityScore: 85,
    topPainPoint:
      "Guests calling repeatedly to check wait times, hosts overwhelmed with manual list management, and no way for customers to get real-time updates without standing at the host stand.",
    suggestedProduct:
      "A simple digital waitlist with SMS updates, real-time wait estimates, and a customer-facing status page—no tablets required, works from a single phone or tablet.",
  },
];
