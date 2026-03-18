"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBreakdown } from "@/components/dashboard/score-breakdown";
import { formatDate, getScoreBg } from "@/lib/utils";
import {
  Lock,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Search,
  Radio,
  TrendingUp,
} from "lucide-react";

interface SharePainPoint {
  id: string;
  text: string;
  severityScore: number;
  sentiment: string | null;
  tags: string[];
}

interface ShareAnalysis {
  id: string;
  topic: string;
  query: string;
  summary: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  createdAt: string;
  painPoints: SharePainPoint[];
  totalPainPoints: number;
  totalProductIdeas: number;
  totalKeywords: number;
  totalChannels: number;
}

export function SharePreviewClient({ analysis }: { analysis: ShareAnalysis }) {
  const t = useTranslations("analysis");

  const hiddenSections = [
    {
      icon: Lightbulb,
      count: analysis.totalProductIdeas,
      labelKey: "productIdeas" as const,
    },
    {
      icon: Search,
      count: analysis.totalKeywords,
      labelKey: "seoKeywords" as const,
    },
    {
      icon: Radio,
      count: analysis.totalChannels,
      labelKey: "acquisitionChannels" as const,
    },
  ].filter((s) => s.count > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-6 text-center">
        <Badge variant="coral" className="mb-4">
          {t("sharePreviewBadge")}
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {analysis.topic}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {analysis.query} &middot; {formatDate(analysis.createdAt)}
        </p>
      </div>

      {/* Scores */}
      <Card className="border-t-4 border-t-coral-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("score")}</CardTitle>
            <Badge
              variant="coral"
              className={getScoreBg(analysis.opportunityScore)}
            >
              <span className="text-base font-bold">
                {analysis.opportunityScore}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScoreBreakdown
            scores={{
              opportunityScore: analysis.opportunityScore,
              demandScore: analysis.demandScore,
              urgencyScore: analysis.urgencyScore,
              competitionScore: analysis.competitionScore,
              monetizationScore: analysis.monetizationScore,
            }}
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">{t("summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* Visible pain points (top 3) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            {t("painPointsTitle")}
            <Badge variant="secondary" className="ml-2 text-xs">
              {analysis.totalPainPoints}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("painPointsDesc")}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {analysis.painPoints.map((point, i) => (
              <div key={point.id}>
                <div className="rounded-xl p-4 transition-colors hover:bg-secondary/30">
                  <p className="text-sm leading-relaxed text-foreground">
                    {point.text}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="coral"
                      className={getScoreBg(point.severityScore)}
                    >
                      {t("severity")}: {point.severityScore}
                    </Badge>
                    {point.sentiment && (
                      <Badge variant="outline" className="text-xs">
                        {point.sentiment}
                      </Badge>
                    )}
                    {point.tags.length > 0 &&
                      point.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="teal"
                          className="text-xs font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
                {i < analysis.painPoints.length - 1 && (
                  <div className="mx-4 h-px bg-border/40" />
                )}
              </div>
            ))}
          </div>

          {analysis.totalPainPoints > 3 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("shareMorePainPoints", {
                count: analysis.totalPainPoints - 3,
              })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Locked sections teaser */}
      {hiddenSections.length > 0 && (
        <Card className="mt-6 border-2 border-dashed border-amber-300 dark:border-amber-800 bg-gradient-to-r from-amber-500/5 via-coral-500/5 to-teal-500/5">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-coral-500/20 text-amber-500">
                <div className="relative">
                  <Sparkles className="h-6 w-6" />
                  <Lock className="h-3 w-3 absolute -bottom-1 -right-1 text-amber-700 dark:text-amber-300" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground">
                  {t("shareLockedTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t("shareLockedDesc")}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {hiddenSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.labelKey}
                      className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {section.count} {t(section.labelKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="mt-10 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{t("shareCtaHint")}</span>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-coral-600 to-amber-600 hover:from-coral-700 hover:to-amber-700 text-white"
            asChild
          >
            <Link href="/signup">
              {t("viewFullAnalysis")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("shareSignupFree")}
        </p>
      </div>
    </div>
  );
}
