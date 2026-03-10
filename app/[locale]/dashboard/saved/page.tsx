"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";
import { Bookmark } from "lucide-react";

export default function SavedPage() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<AnalysisCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyses?saved=true")
      .then((res) => (res.ok ? res.json() : { analyses: [] }))
      .then((data) => {
        setAnalyses(data.analyses ?? []);
      })
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t("savedTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Analyses you&apos;ve bookmarked for later.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl gradient-shimmer" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="fade-up fade-up-2 rounded-2xl border-2 border-dashed border-border/60 p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10">
            <Bookmark className="h-6 w-6 text-teal-500" />
          </div>
          <p className="text-muted-foreground">{t("noSavedYet")}</p>
        </div>
      ) : (
        <div className="space-y-3 fade-up fade-up-2">
          {analyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  );
}
