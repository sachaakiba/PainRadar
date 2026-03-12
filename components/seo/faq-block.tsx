import { JsonLd } from "@/components/json-ld";
import { FaqAccordion, type FaqItem } from "./faq-accordion";
import { getBaseUrl } from "@/lib/seo";

export type FaqBlockProps = {
  title: string;
  items: FaqItem[];
  /** Optional: base path for FAQPage JSON-LD url (e.g. "/saas-ideas") */
  pagePath?: string;
  className?: string;
};

export function FaqBlock({ title, items, pagePath, className }: FaqBlockProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    ...(pagePath && { url: `${getBaseUrl()}${pagePath}` }),
  };

  return (
    <section className={className} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-foreground mb-6">
        {title}
      </h2>
      <JsonLd data={faqJsonLd} />
      <FaqAccordion items={items} />
    </section>
  );
}
