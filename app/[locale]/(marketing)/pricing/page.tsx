import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/pricing-section";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for PainRadar. Start free with 3 analyses per month. Upgrade to Starter or Pro for more analyses, exports, and advanced features.",
};

const pricingFaqs = [
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 3 analyses per month, basic pain point detection, opportunity scoring, and product idea generation. It's perfect for trying out PainRadar and validating a few ideas.",
  },
  {
    question: "How does billing work?",
    answer:
      "You can upgrade or downgrade at any time. Billing is monthly. Your usage resets each month, and unused analyses do not roll over.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel anytime and you'll keep access until the end of your billing period. No long-term contracts or commitments.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards. Payment is securely processed through Stripe.",
  },
];

export default function PricingPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: absoluteUrl("/pricing"),
      },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "PainRadar",
    description:
      "Pain point discovery platform that validates SaaS ideas with real customer data from Reddit, forums, and reviews.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        name: "Starter",
        price: "19",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "39",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Pricing" }]} className="mb-8" />
        <PricingSection />
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pricing FAQ
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Common questions about our plans
          </p>
          <Accordion type="single" collapsible className="mt-12 w-full">
            {pricingFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`pricing-faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
