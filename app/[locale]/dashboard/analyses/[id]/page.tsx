"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreBreakdown } from "@/components/dashboard/score-breakdown";
import { PainPointList } from "@/components/dashboard/pain-point-list";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ExportMenu } from "@/components/dashboard/export-menu";
import { absoluteUrl, formatDate, getScoreBg } from "@/lib/utils";
import { toast } from "sonner";

interface PainPoint {
  id: string;
  text: string;
  severityScore: number;
  sentiment?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  authorHandle?: string | null;
  tags: string[];
}

interface ProductIdea {
  id: string;
  title: string;
  description: string;
  targetAudience?: string | null;
}

interface KeywordIdea {
  id: string;
  keyword: string;
}

interface Objection {
  id: string;
  text: string;
}

interface AcquisitionChannel {
  id: string;
  name: string;
  rationale?: string | null;
}

interface RecurringPhrase {
  id: string;
  phrase: string;
  frequency: number;
}

interface Analysis {
  id: string;
  query: string;
  topic: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  summary: string;
  recommendedMvp?: string | null;
  pricingSuggestion?: string | null;
  seoSummary?: string | null;
  saved: boolean;
  createdAt: string;
  painPoints: PainPoint[];
  productIdeas: ProductIdea[];
  keywordIdeas: KeywordIdea[];
  objections: Objection[];
  acquisitionChannels: AcquisitionChannel[];
  recurringPhrases: RecurringPhrase[];
}

export default function AnalysisDetailPage() {
  const t = useTranslations("analysis");
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/analyses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setAnalysis(data.analysis))
      .catch(() => router.push("/dashboard/analyses"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const toggleSave = async () => {
    if (!analysis) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/analyses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved: !analysis.saved }),
      });
      if (res.ok) {
        const { analysis: updated } = await res.json();
        setAnalysis((prev) => (prev ? { ...prev, saved: updated.saved } : null));
        toast.success(updated.saved ? t("saved") : t("removedFromSaved"));
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? t("updateFailed"));
      }
    } catch {
      toast.error(t("updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !analysis) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="fade-up fade-up-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/analyses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {analysis.topic}
            </h1>
            <p className="text-sm text-muted-foreground">
              {analysis.query} · {formatDate(analysis.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={analysis.saved ? "secondary" : "outline"}
            size="sm"
            onClick={toggleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bookmark
                className={`h-4 w-4 ${analysis.saved ? "fill-coral-500 text-coral-500" : ""}`}
              />
            )}
            <span className="ml-1">{analysis.saved ? t("saved") : t("save")}</span>
          </Button>
          <CopyButton
            text={absoluteUrl(`/dashboard/analyses/${id}`)}
            variant="outline"
            size="sm"
            label={t("share")}
          />
          <ExportMenu
            data={analysis}
            shareUrl={absoluteUrl(`/dashboard/analyses/${id}`)}
            filename={`painradar-${analysis.topic.replace(/\s+/g, "-")}.json`}
          />
        </div>
      </div>

      <Card className="fade-up fade-up-2 border-t-4 border-t-coral-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("score")}</CardTitle>
            <Badge
              variant="coral"
              className={getScoreBg(analysis.opportunityScore)}
            >
              <span className="text-base font-bold">{analysis.opportunityScore}</span>
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

      <div className="fade-up fade-up-3">
        <Tabs defaultValue="overview">
          <TabsList className="w-full flex-wrap justify-start">
            <TabsTrigger value="overview">{t("summary")}</TabsTrigger>
            <TabsTrigger value="pain-points">{t("painPoints")}</TabsTrigger>
            <TabsTrigger value="product-ideas">{t("productIdeas")}</TabsTrigger>
            <TabsTrigger value="keywords">{t("seoKeywords")}</TabsTrigger>
            <TabsTrigger value="channels">{t("acquisitionChannels")}</TabsTrigger>
            <TabsTrigger value="objections">{t("objections")}</TabsTrigger>
            <TabsTrigger value="phrases">{t("recurringPhrases")}</TabsTrigger>
            <TabsTrigger value="mvp">{t("mvpPricing")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {analysis.summary || t("noSummaryAvailable")}
                </p>
                {analysis.seoSummary && (
                  <div className="mt-6 rounded-xl bg-teal-50 dark:bg-teal-900/10 p-4 border-l-4 border-l-teal-400">
                    <h4 className="label-sm text-teal-700 dark:text-teal-400 mb-2">{t("seoSummary")}</h4>
                    <p className="text-sm text-teal-900 dark:text-teal-200">
                      {analysis.seoSummary}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pain-points" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("painPointsTitle")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("painPointsDesc")}</p>
              </CardHeader>
              <CardContent>
                <PainPointList painPoints={analysis.painPoints} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product-ideas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("productIdeas")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.productIdeas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noProductIdeas")}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {analysis.productIdeas.map((idea) => (
                      <Card key={idea.id} className="border-l-4 border-l-amber-400">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{idea.title}</CardTitle>
                          {idea.targetAudience && (
                            <p className="label-sm">{t("target")}: {idea.targetAudience}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{idea.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("seoKeywords")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.keywordIdeas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noKeywords")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordIdeas.map((kw) => (
                      <Badge key={kw.id} variant="teal">{kw.keyword}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("acquisitionChannels")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.acquisitionChannels.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noChannels")}</p>
                ) : (
                  <ul className="space-y-3">
                    {analysis.acquisitionChannels.map((ch) => (
                      <li key={ch.id} className="rounded-xl bg-secondary/40 p-4">
                        <span className="font-semibold text-foreground">{ch.name}</span>
                        {ch.rationale && (
                          <p className="mt-1 text-sm text-muted-foreground">{ch.rationale}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objections" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("objections")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.objections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noObjections")}</p>
                ) : (
                  <ul className="space-y-2">
                    {analysis.objections.map((obj) => (
                      <li key={obj.id} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-coral-400" />
                        {obj.text}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phrases" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("recurringPhrases")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.recurringPhrases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noRecurringPhrases")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysis.recurringPhrases.map((p) => (
                      <Badge key={p.id} variant="amber">
                        {p.phrase} <span className="ml-1 opacity-60">({p.frequency})</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mvp" className="mt-4">
            <div className="space-y-4">
              {analysis.recommendedMvp && (
                <Card className="border-l-4 border-l-teal-400">
                  <CardHeader>
                    <CardTitle className="text-base">{t("recommendedMvp")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis.recommendedMvp}</p>
                  </CardContent>
                </Card>
              )}
              {analysis.pricingSuggestion && (
                <Card className="border-l-4 border-l-amber-400">
                  <CardHeader>
                    <CardTitle className="text-base">{t("pricingSuggestion")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis.pricingSuggestion}</p>
                  </CardContent>
                </Card>
              )}
              {!analysis.recommendedMvp && !analysis.pricingSuggestion && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    {t("noMvp")}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
