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
import { getTranslations } from "next-intl/server";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple credit-based pricing for PainRadar. Start free with 2 credits. Buy 1 credit for $5, the Hobbyist Pack (10 credits, $15), or Founder Pack (35 credits, $39) — one-time payment, no subscription.",
};

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const faq = t.raw("faq") as { q: string; a: string }[];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tCommon("home"),
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("pricing"),
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
        name: "Single Credit",
        price: "5",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        name: "Hobbyist Pack",
        price: "15",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
      },
      {
        "@type": "Offer",
        name: "Founder Pack",
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
        <Breadcrumb items={[{ label: tNav("pricing") }]} className="mt-4 mb-10" />
        <PricingSection />
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <Accordion type="single" collapsible className="mt-12 w-full">
            {faq.map((item, index) => (
              <AccordionItem key={index} value={`pricing-faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
