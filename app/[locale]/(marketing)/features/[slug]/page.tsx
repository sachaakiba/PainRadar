import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Crosshair,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Check,
} from "lucide-react";
import { features } from "@/config/features";
import { locales } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

const slugToKey: Record<string, string> = {
  "pain-point-detection": "painPointDetection",
  "idea-validation": "ideaValidation",
  "keyword-insights": "keywordInsights",
  "seo-insights": "seoInsights",
  "opportunity-scoring": "opportunityScoring",
};

const iconMap = {
  Crosshair,
  Lightbulb,
  TrendingUp,
  BarChart3,
};

export function generateStaticParams() {
  return locales.flatMap((locale) => features.map((f) => ({ locale, slug: f.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = features.find((f) => f.slug === slug);
  if (!feature) return { title: "Feature not found" };
  const key = slugToKey[slug];
  const tFeatures = await getTranslations("features");
  const title = key ? tFeatures(`${key}.title`) : feature.title;
  const description = key ? tFeatures(`${key}.description`) : feature.description;
  return {
    title: `${title} | PainRadar`,
    description,
    openGraph: {
      title: `${title} | PainRadar`,
      description,
      url: absoluteUrl(`/features/${slug}`),
    },
  };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = features.find((f) => f.slug === slug);
  if (!feature) notFound();

  const key = slugToKey[slug];
  const t = await getTranslations("common");
  const tFeatures = await getTranslations("features");
  const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? BarChart3;

  const title = key ? tFeatures(`${key}.title`) : feature.title;
  const description = key ? tFeatures(`${key}.description`) : feature.description;
  const details = key ? (tFeatures.raw(`${key}.details`) as string[]) : feature.details;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: tFeatures("pageTitle"),
        item: absoluteUrl("/features"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: absoluteUrl(`/features/${slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tFeatures("pageTitle"), href: "/features" },
            { label: title },
          ]}
          className="mt-4 mb-10"
        />
        <article>
          <div className="mb-8 flex items-start gap-4">
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t("keyCapabilities")}</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <section className="mt-16 rounded-xl border border-border/50 bg-muted/20 px-8 py-10 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {t("ctaTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("ctaDesc")}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/signup">{t("signUpFree")}</Link>
            </Button>
          </section>
        </article>
      </div>
    </>
  );
}
