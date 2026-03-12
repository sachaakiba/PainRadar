import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Lightbulb, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SeoCta } from "@/components/seo/seo-cta";
import { RelatedLinks, type RelatedLinkGroup } from "@/components/seo/related-links";
import {
  PAIN_PAGE_SEEDS,
  getPainPageBySlug,
} from "@/content/pain-pages";
import { buildSeoMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PAIN_PAGE_SEEDS.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seed = getPainPageBySlug(slug);
  if (!seed) return { title: "PainRadar" };
  const locale = await getLocale();
  const t = await getTranslations(`painPages.${seed.translationKey}`);
  const title = t("title");
  const description = t("overview");
  return buildSeoMetadata({
    path: `/pain/${slug}`,
    locale,
    title: `${title} | PainRadar`,
    description,
    type: "article",
  });
}

export default async function PainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seed = getPainPageBySlug(slug);
  if (!seed) notFound();

  const locale = await getLocale();
  const t = await getTranslations(`painPages.${seed.translationKey}`);
  const tCommon = await getTranslations("common");

  const painPoints = t.raw("painPoints") as string[];
  const productOpportunities = t.raw("productOpportunities") as string[];
  const mvpIdeas = t.raw("mvpIdeas") as string[];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: t("title"),
        item: absoluteUrl(`/pain/${slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    description: t("overview"),
    url: absoluteUrl(`/pain/${slug}`),
  };

  const relatedGroups: RelatedLinkGroup[] = [
    {
      title: "Related pain points",
      links: seed.relatedSlugs
        .map((s) => {
          const p = getPainPageBySlug(s);
          if (!p) return null;
          const label = `${p.problem.replace(/-/g, " ")} for ${p.audience.replace(/-/g, " ")}`;
          return {
            href: `/pain/${s}`,
            label: label.charAt(0).toUpperCase() + label.slice(1),
          };
        })
        .filter(Boolean) as { href: string; label: string }[],
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: "Pain points", href: "/pain-point-examples" }, { label: t("title") }]}
          className="mt-4 mb-10"
        />
        <article>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {t("overview")}
          </p>

          <Card className="mt-10 border-border/50">
            <CardHeader>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Target className="h-5 w-5" />
                Why this audience struggles
              </h2>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{t("whyStruggle")}</p>
            </CardContent>
          </Card>

          {painPoints && painPoints.length > 0 && (
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <h2 className="text-xl font-semibold">Common pain points</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {painPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {productOpportunities && productOpportunities.length > 0 && (
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Lightbulb className="h-5 w-5" />
                  Product opportunities
                </h2>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {productOpportunities.map((opp, i) => (
                    <li key={i}>{opp}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {mvpIdeas && mvpIdeas.length > 0 && (
            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <h2 className="text-xl font-semibold">Suggested MVP ideas</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-disc space-y-2 pl-5 text-foreground">
                  {mvpIdeas.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8 border-border/50">
            <CardHeader>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="h-4 w-4" />
                Keyword angle
              </h2>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{t("keywordAngle")}</p>
            </CardContent>
          </Card>

          <div className="mt-16">
            <SeoCta
              title="Analyze this niche in PainRadar"
              subtitle="Get full pain points, opportunity scores, and product ideas in minutes."
              buttonLabel={tCommon("signUpFree")}
              href="/signup"
            />
          </div>

          {relatedGroups[0].links.length > 0 && (
            <div className="mt-16">
              <RelatedLinks groups={relatedGroups} />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
