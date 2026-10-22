import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { ScoreBreakdown } from "@/components/dashboard/score-breakdown";
import { PainPointList } from "@/components/dashboard/pain-point-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getScoreBg, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function getSharedAnalysis(slug: string) {
  return db.analysis.findFirst({
    where: { shareSlug: slug, isPublic: true },
    select: {
      id: true,
      topic: true,
      query: true,
      summary: true,
      opportunityScore: true,
      demandScore: true,
      urgencyScore: true,
      competitionScore: true,
      monetizationScore: true,
      createdAt: true,
      painPoints: {
        select: {
          id: true,
          text: true,
          sentiment: true,
          frequency: true,
          tags: true,
          sourceName: true,
          problemCategory: true,
          severityScore: true,
        },
      },
      productIdeas: {
        select: {
          id: true,
          title: true,
          description: true,
          targetAudience: true,
          monetizationModel: true,
          differentiation: true,
        },
      },
    },
  });
}

export default async function SharedAnalysisPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const analysis = await getSharedAnalysis(slug);

  if (!analysis) {
    notFound();
  }

  const t = await getTranslations("analysis");

  // Public page: never show the original poster's identifying info.
  const painPoints = analysis.painPoints.map((point) => ({
    ...point,
    sourceUrl: null,
    authorHandle: null,
  }));

  return (
    <div className="container max-w-3xl space-y-8 py-12">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {analysis.topic}
        </h1>
        <p className="text-sm text-muted-foreground">
          {analysis.query} · {formatDate(analysis.createdAt.toISOString())}
        </p>
      </div>

      <Card className="border-t-4 border-t-coral-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("score")}</CardTitle>
            <Badge variant="coral" className={getScoreBg(analysis.opportunityScore)}>
              <span className="text-base font-bold">
                {Math.round(analysis.opportunityScore)}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScoreBreakdown
            scores={{
              opportunityScore: Math.round(analysis.opportunityScore),
              demandScore: Math.round(analysis.demandScore),
              urgencyScore: Math.round(analysis.urgencyScore),
              competitionScore: Math.round(analysis.competitionScore),
              monetizationScore: Math.round(analysis.monetizationScore),
            }}
          />
        </CardContent>
      </Card>

      {analysis.summary && (
        <Card>
          <CardHeader>
            <CardTitle>{t("summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {analysis.summary}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("painPointsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PainPointList painPoints={painPoints} />
        </CardContent>
      </Card>

      {analysis.productIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("productIdeas")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.productIdeas.map((idea) => (
              <div key={idea.id} className="rounded-xl p-4 hover:bg-secondary/30">
                <h3 className="font-semibold">{idea.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{idea.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
