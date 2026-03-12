import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ChevronUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for PainRadar. Understand your rights and responsibilities when using our SaaS idea discovery platform.",
};

const sections = [
  { id: "acceptance", titleKey: "acceptance", contentKey: "acceptanceContent" },
  { id: "description", titleKey: "description", contentKey: "descriptionContent" },
  { id: "accounts", titleKey: "accounts", contentKey: "accountsContent" },
  { id: "billing", titleKey: "billing", contentKey: "billingContent" },
  { id: "prohibited", titleKey: "prohibited", contentKey: "prohibitedContent" },
  { id: "ip", titleKey: "ip", contentKey: "ipContent" },
  { id: "disclaimers", titleKey: "disclaimers", contentKey: "disclaimersContent" },
  { id: "termination", titleKey: "termination", contentKey: "terminationContent" },
  { id: "changes", titleKey: "changes", contentKey: "changesContent" },
  { id: "contact", titleKey: "contactTitle", contentKey: "contactContent" },
] as const;

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const tCommon = await getTranslations("common");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: absoluteUrl("/terms"),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div id="top" className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: t("title") }]}
          className="mt-4 mb-10"
        />

        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>

          <nav className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {t("tocTitle")}
            </h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(section.titleKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="text-xl font-semibold text-foreground">
                  {t(section.titleKey)}
                </h2>
                <p className="mt-4 whitespace-pre-line text-muted-foreground">
                  {t(section.contentKey)}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <ChevronUp className="h-4 w-4" />
              {t("scrollToTop")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
