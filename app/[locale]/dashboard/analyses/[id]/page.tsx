"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  ArrowLeft,
  Bookmark,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Search,
  Brain,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react";
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
import { AiPromptCard } from "@/components/dashboard/ai-prompt-card";
import { absoluteUrl, formatDate, getScoreBg } from "@/lib/utils";
import { toast } from "sonner";
import { getUserPlan } from "@/actions/user";
import { getPlanLimits } from "@/lib/plans";
import { analysisOutputSchema, type AnalysisOutput } from "@/lib/analysis-schema";

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
  status: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  summary: string;
  recommendedMvp?: string | null;
  pricingSuggestion?: string | null;
  seoSummary?: string | null;
  aiPrompt?: string | null;
  saved: boolean;
  createdAt: string;
  painPoints: PainPoint[];
  productIdeas: ProductIdea[];
  keywordIdeas: KeywordIdea[];
  objections: Objection[];
  acquisitionChannels: AcquisitionChannel[];
  recurringPhrases: RecurringPhrase[];
}

interface DisplayData {
  summary: string;
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
  recommendedMvp: string | null;
  pricingSuggestion: string | null;
  seoSummary: string | null;
  aiPrompt: string | null;
  painPoints: PainPoint[];
  productIdeas: ProductIdea[];
  keywordIdeas: KeywordIdea[];
  objections: Objection[];
  acquisitionChannels: AcquisitionChannel[];
  recurringPhrases: RecurringPhrase[];
}

async function fetchAnalysis(id: string): Promise<Analysis> {
  const res = await fetch(`/api/analyses/${id}`);
  if (!res.ok) throw new Error("Not found");
  const data = await res.json();
  return data.analysis;
}

function mapStreamedToDisplay(obj: Partial<AnalysisOutput>): DisplayData {
  return {
    summary: obj.summary ?? "",
    opportunityScore: obj.opportunityScore ?? 0,
    demandScore: obj.demandScore ?? 0,
    urgencyScore: obj.urgencyScore ?? 0,
    competitionScore: obj.competitionScore ?? 0,
    monetizationScore: obj.monetizationScore ?? 0,
    recommendedMvp: obj.recommendedMvp ?? null,
    pricingSuggestion: obj.pricingSuggestion ?? null,
    seoSummary: obj.seoSummary ?? null,
    aiPrompt: obj.aiPrompt ?? null,
    painPoints: (obj.painPoints ?? [])
      .filter((p) => p?.text)
      .map((p, i) => ({
        id: `stream-pp-${i}`,
        text: p.text,
        severityScore: p.severityScore ?? 0,
        sentiment: p.sentiment ?? null,
        sourceName: p.sourceName ?? null,
        sourceType: p.sourceType ?? null,
        sourceUrl: p.sourceUrl ?? null,
        authorHandle: p.authorHandle ?? null,
        tags: p.tags ?? [],
      })),
    productIdeas: (obj.productIdeas ?? [])
      .filter((p) => p?.title)
      .map((p, i) => ({
        id: `stream-pi-${i}`,
        title: p.title,
        description: p.description ?? "",
        targetAudience: p.targetAudience ?? null,
      })),
    keywordIdeas: (obj.keywordIdeas ?? [])
      .filter((k) => k?.keyword)
      .map((k, i) => ({
        id: `stream-kw-${i}`,
        keyword: k.keyword,
      })),
    objections: (obj.objections ?? [])
      .filter((o) => o?.text)
      .map((o, i) => ({
        id: `stream-obj-${i}`,
        text: o.text,
      })),
    acquisitionChannels: (obj.acquisitionChannels ?? [])
      .filter((c) => c?.name)
      .map((c, i) => ({
        id: `stream-ch-${i}`,
        name: c.name,
        rationale: c.rationale ?? null,
      })),
    recurringPhrases: (obj.recurringPhrases ?? [])
      .filter((p) => p?.phrase)
      .map((p, i) => ({
        id: `stream-rp-${i}`,
        phrase: p.phrase,
        frequency: p.frequency ?? 0,
      })),
  };
}

type StreamPhase = "idle" | "reddit" | "scores" | "summary" | "details" | "done";

function useBufferedStream(
  streamedObject: Partial<AnalysisOutput> | undefined,
  isStreaming: boolean,
  streamStarted: boolean
): { buffered: DisplayData | null; phase: StreamPhase } {
  const [buffered, setBuffered] = useState<DisplayData | null>(null);
  const prevCountsRef = useRef({ painPoints: 0, productIdeas: 0, keywords: 0 });

  const phase: StreamPhase = useMemo(() => {
    if (!streamStarted) return "idle";
    if (!streamedObject) return "reddit";
    if ((streamedObject.opportunityScore ?? 0) > 0 && !streamedObject.summary) return "scores";
    if (streamedObject.summary && (streamedObject.painPoints?.length ?? 0) === 0) return "summary";
    if (isStreaming) return "details";
    return "done";
  }, [streamedObject, isStreaming, streamStarted]);

  useEffect(() => {
    if (!streamedObject || !streamStarted) return;

    const data = mapStreamedToDisplay(streamedObject as Partial<AnalysisOutput>);
    const prev = prevCountsRef.current;

    const hasNewPainPoints = data.painPoints.length > prev.painPoints;
    const hasNewProductIdeas = data.productIdeas.length > prev.productIdeas;
    const hasNewKeywords = data.keywordIdeas.length > prev.keywords;
    const scoresReady = data.opportunityScore > 0;
    const summaryReady = data.summary.length > 50;

    if (scoresReady || summaryReady || hasNewPainPoints || hasNewProductIdeas || hasNewKeywords || !isStreaming) {
      setBuffered(data);
      prevCountsRef.current = {
        painPoints: data.painPoints.length,
        productIdeas: data.productIdeas.length,
        keywords: data.keywordIdeas.length,
      };
    }
  }, [streamedObject, isStreaming, streamStarted]);

  return { buffered, phase };
}

function RevealSection({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {children}
    </div>
  );
}

function StreamProgress({ phase, t }: { phase: StreamPhase; t: (key: string) => string }) {
  const steps = [
    { key: "reddit" as const, icon: Search, label: t("generatingReddit") },
    { key: "scores" as const, icon: Brain, label: t("generatingAI") },
    { key: "details" as const, icon: CheckCircle2, label: t("generating") },
  ];

  const phaseOrder: StreamPhase[] = ["reddit", "scores", "summary", "details", "done"];
  const currentIdx = phaseOrder.indexOf(phase);

  return (
    <Card className="border-2 border-coral-200 dark:border-coral-800 bg-coral-50/50 dark:bg-coral-950/20">
      <CardContent className="py-6">
        <div className="flex items-center justify-center gap-8">
          {steps.map((step, i) => {
            const stepIdx = phaseOrder.indexOf(step.key);
            const isActive = currentIdx >= stepIdx && currentIdx < phaseOrder.indexOf("done");
            const isDone = currentIdx > stepIdx || phase === "done";
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-500 ${
                  isDone
                    ? "bg-teal-500 text-white"
                    : isActive
                      ? "bg-coral-500 text-white animate-pulse"
                      : "bg-muted text-muted-foreground"
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${
                  isDone
                    ? "text-teal-600 dark:text-teal-400"
                    : isActive
                      ? "text-coral-600 dark:text-coral-400"
                      : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 transition-colors duration-500 ${
                    isDone ? "bg-teal-400" : "bg-border"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalysisDetailPage() {
  const t = useTranslations("analysis");
  const tDashboard = useTranslations("dashboard");
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [canExport, setCanExport] = useState(false);
  const [canGenerateAiPrompt, setCanGenerateAiPrompt] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);

  const {
    data: analysis,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Analysis>({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysis(id),
  });

  const {
    object: streamedObject,
    submit,
    isLoading: isStreaming,
    error: streamError,
  } = useObject({
    api: `/api/analyses/${id}/stream`,
    schema: analysisOutputSchema,
  });

  const { buffered, phase } = useBufferedStream(
    streamedObject as Partial<AnalysisOutput> | undefined,
    isStreaming,
    streamStarted
  );

  useEffect(() => {
    if (analysis?.status === "generating" && !streamStarted) {
      setStreamStarted(true);
      submit({});
    }
  }, [analysis?.status, streamStarted, submit]);

  useEffect(() => {
    if (!isStreaming && streamStarted && !streamError) {
      const timer = setTimeout(() => {
        refetch();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, streamStarted, streamError, refetch]);

  useEffect(() => {
    getUserPlan().then((plan) => {
      const limits = getPlanLimits(plan);
      setCanExport(limits.canExport);
      setCanGenerateAiPrompt(limits.canGenerateAiPrompt);
    });
  }, []);

  useEffect(() => {
    if (queryError) {
      router.push("/dashboard/analyses");
    }
  }, [queryError, router]);

  const handleRetry = async () => {
    try {
      await fetch(`/api/analyses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "generating" }),
      });
      setStreamStarted(true);
      submit({});
      refetch();
    } catch {
      toast.error(t("updateFailed"));
    }
  };

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
        toast.success(updated.saved ? t("saved") : t("removedFromSaved"));
        refetch();
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.code === "plan_limit_exceeded") {
          toast.error(data.error ?? t("updateFailed"), {
            action: {
              label: tDashboard("upgradeNow"),
              onClick: () => router.push("/dashboard/settings"),
            },
          });
        } else {
          toast.error(data?.error ?? t("updateFailed"));
        }
      }
    } catch {
      toast.error(t("updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !analysis) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const isGenerating = analysis.status === "generating" || isStreaming;
  const isFailed = analysis.status === "failed" && !isStreaming;
  const isCompleted = analysis.status === "completed" && !isStreaming;

  const displayData: DisplayData =
    isGenerating && buffered
      ? buffered
      : {
          ...analysis,
          recommendedMvp: analysis.recommendedMvp ?? null,
          pricingSuggestion: analysis.pricingSuggestion ?? null,
          seoSummary: analysis.seoSummary ?? null,
          aiPrompt: analysis.aiPrompt ?? null,
        };

  const scoresReady = displayData.opportunityScore > 0;
  const summaryReady = displayData.summary.length > 50;
  const painPointsReady = displayData.painPoints.length > 0;
  const detailsReady = displayData.productIdeas.length > 0 || displayData.keywordIdeas.length > 0;

  if (isFailed) {
    return (
      <div className="space-y-8">
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

        <Card className="border-2 border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-lg font-semibold">{t("failed")}</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {t("failedDesc")}
            </p>
            <Button onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
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
        {isCompleted && (
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
              canExport={canExport}
            />
          </div>
        )}
      </div>

      {isGenerating && <StreamProgress phase={phase} t={t} />}

      {/* Scores */}
      {scoresReady ? (
        <RevealSection visible>
          <Card className="border-t-4 border-t-coral-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("score")}</CardTitle>
                <Badge
                  variant="coral"
                  className={getScoreBg(displayData.opportunityScore)}
                >
                  <span className="text-base font-bold">
                    {Math.round(displayData.opportunityScore)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScoreBreakdown
                scores={{
                  opportunityScore: Math.round(displayData.opportunityScore),
                  demandScore: Math.round(displayData.demandScore),
                  urgencyScore: Math.round(displayData.urgencyScore),
                  competitionScore: Math.round(displayData.competitionScore),
                  monetizationScore: Math.round(displayData.monetizationScore),
                }}
              />
            </CardContent>
          </Card>
        </RevealSection>
      ) : isGenerating ? (
        <Card className="border-t-4 border-t-coral-500">
          <CardHeader>
            <CardTitle>{t("score")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Tabs — only show when summary is ready or analysis is completed */}
      {(summaryReady || isCompleted) && (
        <RevealSection visible>
          <Tabs defaultValue="overview">
            <TabsList className="w-full flex-wrap justify-start">
              <TabsTrigger value="overview">{t("summary")}</TabsTrigger>
              <TabsTrigger value="pain-points">
                {t("painPoints")}
                {displayData.painPoints.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs">
                    {displayData.painPoints.length}
                  </Badge>
                )}
              </TabsTrigger>
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
                    {displayData.summary}
                  </p>
                  {displayData.seoSummary && (
                    <RevealSection visible>
                      <div className="mt-6 rounded-xl bg-teal-50 dark:bg-teal-900/10 p-4 border-l-4 border-l-teal-400">
                        <h4 className="label-sm text-teal-700 dark:text-teal-400 mb-2">{t("seoSummary")}</h4>
                        <p className="text-sm text-teal-900 dark:text-teal-200">
                          {displayData.seoSummary}
                        </p>
                      </div>
                    </RevealSection>
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
                  {painPointsReady ? (
                    <PainPointList painPoints={displayData.painPoints} />
                  ) : isGenerating ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noDataIdentified")}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product-ideas" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("productIdeas")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {displayData.productIdeas.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {displayData.productIdeas.map((idea: ProductIdea) => (
                        <RevealSection key={idea.id} visible>
                          <Card className="border-l-4 border-l-amber-400">
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
                        </RevealSection>
                      ))}
                    </div>
                  ) : isGenerating ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noProductIdeas")}</p>
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
                  {displayData.keywordIdeas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayData.keywordIdeas.map((kw: KeywordIdea) => (
                        <Badge key={kw.id} variant="teal">{kw.keyword}</Badge>
                      ))}
                    </div>
                  ) : isGenerating ? (
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-24" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noKeywords")}</p>
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
                  {displayData.acquisitionChannels.length > 0 ? (
                    <ul className="space-y-3">
                      {displayData.acquisitionChannels.map((ch: AcquisitionChannel) => (
                        <RevealSection key={ch.id} visible>
                          <li className="rounded-xl bg-secondary/40 p-4">
                            <span className="font-semibold text-foreground">{ch.name}</span>
                            {ch.rationale && (
                              <p className="mt-1 text-sm text-muted-foreground">{ch.rationale}</p>
                            )}
                          </li>
                        </RevealSection>
                      ))}
                    </ul>
                  ) : isGenerating ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noChannels")}</p>
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
                  {displayData.objections.length > 0 ? (
                    <ul className="space-y-2">
                      {displayData.objections.map((obj: Objection) => (
                        <li key={obj.id} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-coral-400" />
                          {obj.text}
                        </li>
                      ))}
                    </ul>
                  ) : isGenerating ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noObjections")}</p>
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
                  {displayData.recurringPhrases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayData.recurringPhrases.map((p: RecurringPhrase) => (
                        <Badge key={p.id} variant="amber">
                          {p.phrase} <span className="ml-1 opacity-60">({p.frequency})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : isGenerating ? (
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-20" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noRecurringPhrases")}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mvp" className="mt-4">
              <div className="space-y-4">
                {displayData.recommendedMvp ? (
                  <RevealSection visible>
                    <Card className="border-l-4 border-l-teal-400">
                      <CardHeader>
                        <CardTitle className="text-base">{t("recommendedMvp")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayData.recommendedMvp}</p>
                      </CardContent>
                    </Card>
                  </RevealSection>
                ) : isGenerating ? (
                  <Skeleton className="h-32 w-full" />
                ) : null}
                {displayData.pricingSuggestion ? (
                  <RevealSection visible>
                    <Card className="border-l-4 border-l-amber-400">
                      <CardHeader>
                        <CardTitle className="text-base">{t("pricingSuggestion")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayData.pricingSuggestion}</p>
                      </CardContent>
                    </Card>
                  </RevealSection>
                ) : isGenerating ? (
                  <Skeleton className="h-32 w-full" />
                ) : null}
                {!displayData.recommendedMvp && !displayData.pricingSuggestion && !isGenerating && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      {t("noMvp")}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </RevealSection>
      )}

      {/* AI-Ready Prompt — Pro only */}
      {isCompleted && (
        <RevealSection visible>
          {canGenerateAiPrompt && displayData.aiPrompt ? (
            <AiPromptCard prompt={displayData.aiPrompt} />
          ) : (
            <Card className="relative overflow-hidden border-2 border-dashed border-violet-300 dark:border-violet-800 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-amber-500/5">
              <CardContent className="flex flex-col items-center gap-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-500">
                  <div className="relative">
                    <Sparkles className="h-6 w-6" />
                    <Lock className="h-3 w-3 absolute -bottom-1 -right-1 text-violet-700 dark:text-violet-300" />
                  </div>
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="font-semibold text-foreground">{t("aiPromptTitle")}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t("aiPromptUpgradeDesc")}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  {tDashboard("upgradeNow")}
                </Button>
              </CardContent>
            </Card>
          )}
        </RevealSection>
      )}

      {/* Show skeleton tabs while waiting for summary during generation */}
      {isGenerating && !summaryReady && (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
