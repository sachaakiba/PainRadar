"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchForm } from "@/components/dashboard/search-form";
import { AnalysesTable } from "@/components/dashboard/analyses-table";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";
import { Search } from "lucide-react";

export default function AnalysesPage() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<AnalysisCardData[]>([]);
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

  return (
    <div className="space-y-10">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {t("searchTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("searchDesc")}</p>
      </div>

      <div className="fade-up fade-up-2">
        <SearchForm />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl gradient-shimmer" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="fade-up fade-up-3 rounded-lg border border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-primary-tint">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">{t("noAnalysesYet")}</p>
        </div>
      ) : (
        <div className="fade-up fade-up-3">
          <AnalysesTable analyses={analyses} />
        </div>
      )}
    </div>
  );
}
