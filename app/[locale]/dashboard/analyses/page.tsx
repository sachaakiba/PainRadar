"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchForm } from "@/components/dashboard/search-form";
import {
  AnalysesTable,
  type SortColumn,
  type SortDirection,
} from "@/components/dashboard/analyses-table";
import {
  AnalysesPagination,
  type PaginationInfo,
} from "@/components/dashboard/analyses-pagination";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";
import { Search } from "lucide-react";

export default function AnalysesPage() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<AnalysisCardData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortColumn>("date");
  const [direction, setDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      sort,
      direction,
      page: String(page),
    });
    fetch(`/api/analyses?${params}`)
      .then((res) => (res.ok ? res.json() : { analyses: [], pagination: null }))
      .then((data) => {
        setAnalyses(data.analyses ?? []);
        setPagination(data.pagination ?? null);
      })
      .catch(() => {
        setAnalyses([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [sort, direction, page]);

  function handleSortChange(column: SortColumn) {
    if (column === sort) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(column);
      setDirection("desc");
    }
    setPage(1);
  }

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
        <div className="fade-up fade-up-3 space-y-4">
          <AnalysesTable
            analyses={analyses}
            sort={sort}
            direction={direction}
            onSortChange={handleSortChange}
          />
          {pagination && (
            <AnalysesPagination pagination={pagination} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  );
}
