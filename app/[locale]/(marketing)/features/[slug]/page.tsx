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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

const iconMap = {
  Crosshair,
  Lightbulb,
  TrendingUp,
  BarChart3,
};

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = features.find((f) => f.slug === slug);
  if (!feature) return { title: "Feature not found" };
  return {
    title: `${feature.title} | PainRadar`,
    description: feature.description,
    openGraph: {
      title: `${feature.title} | PainRadar`,
      description: feature.description,
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
  
  const t = await getTranslations("common");
  const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? BarChart3;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: absoluteUrl("/features"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: feature.title,
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
            { label: "Features", href: "/features" },
            { label: feature.title },
          ]}
          className="mb-8"
        />
        <article>
          <div className="mb-8 flex items-start gap-4">
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {feature.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t("keyCapabilities")}</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feature.details.map((detail, i) => (
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
