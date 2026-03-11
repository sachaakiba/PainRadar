import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { alternatives } from "@/config/alternatives";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "PainRadar vs Alternatives",
  description:
    "How PainRadar compares to manual Reddit research, Google Trends, and survey tools. See why automated pain point discovery beats traditional approaches.",
};

const slugToKey: Record<string, string> = {
  "manual-research": "manualResearch",
  "google-trends": "googleTrends",
  "survey-tools": "surveyTools",
};

export default function AlternativesPage() {
  const t = useTranslations("alternatives");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: t("pageTitle"),
        item: absoluteUrl("/alternatives"),
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PainRadar vs Alternatives",
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `PainRadar vs ${a.title}`,
      url: absoluteUrl(`/alternatives/${a.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pageTitle") }]} className="mt-4 mb-10" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <Link key={alt.slug} href={`/alternatives/${alt.slug}`}>
              <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      vs {t(`${slugToKey[alt.slug]}.title`)}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {t(`${slugToKey[alt.slug]}.description`)}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
