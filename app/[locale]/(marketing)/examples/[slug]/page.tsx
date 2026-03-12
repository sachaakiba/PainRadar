import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BarChart3, Lightbulb, Search, Sparkles } from "lucide-react";
import { exampleAnalyses } from "@/config/examples";
import { generateMockAnalysis } from "@/lib/mock-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl, getScoreBg } from "@/lib/utils";
import { cn } from "@/lib/utils";

const slugToKey: Record<string, string> = {
  "invoicing-freelancers": "invoicingFreelancers",
  "crm-therapists": "crmTherapists",
  "scheduling-tutors": "schedulingTutors",
  "recruiting-small-agencies": "recruitingAgencies",
  "restaurant-waitlist": "restaurantWaitlist",
};

const SCORE_KEYS = [
  "opportunityScore",
  "demandScore",
  "urgencyScore",
  "competitionScore",
  "monetizationScore",
] as const;

const SCORE_LABEL_KEYS: Record<(typeof SCORE_KEYS)[number], string> = {
  opportunityScore: "opportunity",
  demandScore: "demand",
  urgencyScore: "urgency",
  competitionScore: "competition",
  monetizationScore: "monetization",
};

function getScoreIndicatorClass(score: number) {
  if (score >= 80) return "[&>div>*]:!bg-emerald-500";
  if (score >= 60) return "[&>div>*]:!bg-yellow-500";
  if (score >= 40) return "[&>div>*]:!bg-orange-500";
  return "[&>div>*]:!bg-red-500";
}

function getScoreTextColor(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function generateStaticParams() {
  return exampleAnalyses.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const example = exampleAnalyses.find((e) => e.slug === slug);
  if (!example) return { title: "Example not found" };
  const key = slugToKey[slug];
  const tExamples = await getTranslations("examples");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://painradar.com";
  const url = `${baseUrl}/examples/${slug}`;
  const topic = tExamples(`exampleItems.${key}.topic`);
  const summary = tExamples(`exampleItems.${key}.summary`);
  const painPointAnalysis = tExamples("painPointAnalysis");
  return {
    title: `${topic} – ${painPointAnalysis} | PainRadar`,
    description: summary,
    openGraph: {
      title: `${topic} – ${painPointAnalysis} | PainRadar`,
      description: summary,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic} – ${painPointAnalysis} | PainRadar`,
      description: summary,
    },
  };
}

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const example = exampleAnalyses.find((e) => e.slug === slug);
  if (!example) notFound();

  const key = slugToKey[slug];
  const t = await getTranslations("common");
  const tAnalysis = await getTranslations("analysis");
  const tExamples = await getTranslations("examples");
  const analysis = generateMockAnalysis(example.query, example.topic, undefined, locale as "en" | "fr");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: tExamples("exampleAnalysis"),
        item: absoluteUrl("/examples"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tExamples(`exampleItems.${key}.topic`),
        item: absoluteUrl(`/examples/${slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${tExamples(`exampleItems.${key}.topic`)} – ${tExamples("painPointAnalysis")}`,
    description: tExamples(`exampleItems.${key}.summary`),
    url: absoluteUrl(`/examples/${slug}`),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tExamples("exampleAnalysis"), href: "/examples" },
            { label: tExamples(`exampleItems.${key}.topic`) },
          ]}
          className="mt-4 mb-10"
        />
        <article>
          <header className="mb-10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {tExamples("exampleAnalysis")}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {tExamples(`exampleItems.${key}.topic`)}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {analysis.summary}
            </p>
          </header>

          <section className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <BarChart3 className="h-5 w-5" />
                    {tAnalysis("opportunityScore")}
                  </h2>
                  <Badge
                    variant="secondary"
                    className={cn("text-base", getScoreBg(analysis.opportunityScore))}
                  >
                    {analysis.opportunityScore}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SCORE_KEYS.map((key) => {
                    const value = analysis[key];
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-muted-foreground">
                            {tAnalysis(SCORE_LABEL_KEYS[key])}
                          </span>
                          <span
                            className={cn(
                              "font-semibold tabular-nums",
                              getScoreTextColor(value)
                            )}
                          >
                            {value}
                          </span>
                        </div>
                        <div className={getScoreIndicatorClass(value)}>
                          <Progress value={Math.min(100, value)} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">{tAnalysis("painPointsTitle")}</h2>
                <p className="text-sm text-muted-foreground">
                  {tAnalysis("painPointsDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {analysis.painPoints.map((point, i) => (
                    <div
                      key={i}
                      className={i > 0 ? "border-t border-border/50 py-4" : "py-4"}
                    >
                      <p className="text-sm leading-relaxed text-foreground">
                        {point.text}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-medium",
                            getScoreBg(point.severityScore)
                          )}
                        >
                          {tAnalysis("severity")}: {point.severityScore}
                        </Badge>
                        {point.sentiment && (
                          <Badge variant="outline" className="text-xs">
                            {point.sentiment}
                          </Badge>
                        )}
                        {point.sourceName && (
                          <span className="text-xs text-muted-foreground">
                            {tAnalysis("from")} {point.sourceName}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Lightbulb className="h-5 w-5" />
                  {tAnalysis("productIdeas")}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      {tExamples(`exampleItems.${key}.suggestedProduct`)}
                    </p>
                  </div>
                  {analysis.productIdeas.slice(1).map((idea, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-medium text-foreground">
                        {idea.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                      {idea.targetAudience && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {tAnalysis("target")}: {idea.targetAudience}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Search className="h-5 w-5" />
                  {tAnalysis("seoKeywords")}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordIdeas.map((kw, i) => (
                    <Badge key={i} variant="secondary">
                      {kw.keyword}
                      {kw.intent && (
                        <span className="ml-1 text-xs opacity-80">
                          ({kw.intent})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-16 rounded-xl border border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-foreground">
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
