"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, TrendingUp, Bookmark, BarChart3 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisCard } from "@/components/dashboard/analysis-card";

interface AnalysisSummary {
  id: string;
  query: string;
  topic: string;
  opportunityScore: number;
  saved: boolean;
  createdAt: string;
}

const statIcons = [BarChart3, Bookmark, TrendingUp];
const statAccents = [
  "border-l-coral-500",
  "border-l-teal-400",
  "border-l-amber-400",
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyses")
      .then((res) => (res.ok ? res.json() : { analyses: [] }))
      .then((data) => {
        setAnalyses(data.analyses ?? []);
      })
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  const totalAnalyses = analyses.length;
  const savedCount = analyses.filter((a) => a.saved).length;
  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((s, a) => s + a.opportunityScore, 0) / analyses.length
        )
      : 0;

  const stats = [
    { label: t("totalAnalyses"), value: totalAnalyses },
    { label: t("savedAnalyses"), value: savedCount },
    { label: t("avgScore"), value: avgScore },
  ];

  return (
    <div className="space-y-10">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t("welcome")}
          {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}{" "}
          <span className="inline-block animate-bounce-click">👋</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("overviewDesc")}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <Card
                key={stat.label}
                className={`fade-up fade-up-${i + 2} card-hover border-l-4 ${statAccents[i]}`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="stat-number text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 fade-up fade-up-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">{t("recentAnalyses")}</h2>
            <Button asChild size="sm">
              <Link href="/dashboard/analyses">
                <Search className="mr-2 h-4 w-4" />
                {t("newAnalysis")}
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card className="border-dashed border-2 border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-500/10">
                  <Search className="h-6 w-6 text-coral-500" />
                </div>
                <p className="text-center text-muted-foreground mb-4">
                  {t("noAnalyses")} {t("startFirst")}
                </p>
                <Button asChild>
                  <Link href="/dashboard/analyses">
                    <Search className="mr-2 h-4 w-4" />
                    {t("newAnalysis")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((a) => (
                <AnalysisCard key={a.id} analysis={a} />
              ))}
            </div>
          )}
        </div>

        <div className="fade-up fade-up-6">
          <Card className="border-t-4 border-t-teal-400 dark:border-t-teal-500">
            <CardHeader>
              <CardTitle className="text-base">{t("quickStats")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="label-sm">{t("bestScore")}</span>
                <span className="font-mono text-lg font-bold text-teal-500">
                  {analyses.length > 0
                    ? Math.max(...analyses.map((a) => a.opportunityScore))
                    : "—"}
                </span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex items-center justify-between">
                <span className="label-sm">{t("thisMonth")}</span>
                <span className="font-mono text-lg font-bold text-foreground">
                  {analyses.filter((a) => {
                    const d = new Date(a.createdAt);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex items-center justify-between">
                <span className="label-sm">{t("saved")}</span>
                <span className="font-mono text-lg font-bold text-coral-500">
                  {savedCount}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
