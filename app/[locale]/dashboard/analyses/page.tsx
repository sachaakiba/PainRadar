"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchForm } from "@/components/dashboard/search-form";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";

export default function AnalysesPage() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<AnalysisCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyses")
      .then((res) => res.ok ? res.json() : { analyses: [] })
      .then((data) => {
        setAnalyses(data.analyses ?? []);
      })
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("searchTitle")}</h1>
        <p className="mt-1 text-muted-foreground">
          {t("searchDesc")}
        </p>
      </div>

      <SearchForm />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            {t("noAnalysesYet")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  );
}
