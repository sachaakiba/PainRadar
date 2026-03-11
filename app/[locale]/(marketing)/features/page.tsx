import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  Crosshair,
  Lightbulb,
  TrendingUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { features } from "@/config/features";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything you need to validate SaaS ideas: pain point detection, idea validation, SEO insights, and opportunity scoring. Discover what PainRadar can do for you.",
};

const iconMap = {
  Crosshair,
  Lightbulb,
  TrendingUp,
  BarChart3,
};

const slugToKey: Record<string, string> = {
  "pain-point-detection": "painPointDetection",
  "idea-validation": "ideaValidation",
  "seo-insights": "seoInsights",
  "opportunity-scoring": "opportunityScoring",
};

export default async function FeaturesPage() {
  const t = await getTranslations("features");
  const tCommon = await getTranslations("common");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: t("pageTitle"),
        item: absoluteUrl("/features"),
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PainRadar Features",
    description: "Pain point discovery and SaaS validation features",
    numberOfItems: features.length,
    itemListElement: features.map((f, i) => {
      const key = slugToKey[f.slug];
      return {
        "@type": "ListItem",
        position: i + 1,
        name: key ? t(`${key}.title`) : f.title,
        url: absoluteUrl(`/features/${f.slug}`),
      };
    }),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pageTitle") }]} className="mt-4 mb-10" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => {
            const key = slugToKey[feature.slug];
            const Icon =
              iconMap[feature.icon as keyof typeof iconMap] ?? BarChart3;
            const title = key ? t(`${key}.title`) : feature.title;
            const description = key ? t(`${key}.description`) : feature.description;
            const details = key ? (t.raw(`${key}.details`) as string[]) : feature.details;
            return (
              <Link key={feature.slug} href={`/features/${feature.slug}`}>
                <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors group-hover:bg-primary/5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                          {title}
                        </h2>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {(details ?? []).slice(0, 2).map((detail, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
