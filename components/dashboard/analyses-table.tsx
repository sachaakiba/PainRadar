"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";

/**
 * Recent / saved / all analyses as an editorial table
 * (Category · Idea · Date · Score), per the dashboard UI kit.
 *
 * Columns keep their natural width and never wrap; the table scrolls
 * horizontally inside its own container (see DataTable) rather than
 * hiding columns on narrow viewports. The Category column is the
 * exception — it's capped and truncates with an ellipsis (full value
 * in the title attribute) so one long topic can't blow the column out
 * far past what's actually useful to read at a glance.
 */
export function AnalysesTable({
  analyses,
  showSavedBadge = true,
}: {
  analyses: AnalysisCardData[];
  showSavedBadge?: boolean;
}) {
  const t = useTranslations("dashboard");
  const tAnalysis = useTranslations("analysis");

  return (
    <DataTable>
      <DataTableHeader>
        <tr>
          <DataTableHead>{t("colCategory")}</DataTableHead>
          <DataTableHead>{t("colIdea")}</DataTableHead>
          <DataTableHead>{t("colDate")}</DataTableHead>
          <DataTableHead className="text-right">{t("colScore")}</DataTableHead>
        </tr>
      </DataTableHeader>
      <DataTableBody>
        {analyses.map((analysis) => {
          const isGenerating = analysis.status === "generating";
          const isFailed = analysis.status === "failed";
          return (
            <DataTableRow key={analysis.id} className="group relative">
              <DataTableCell className="max-w-[240px] text-sm font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/analyses/${analysis.id}`}
                    title={analysis.topic || analysis.query}
                    className="truncate after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
                  >
                    {analysis.topic || analysis.query}
                  </Link>
                  {showSavedBadge && analysis.saved && (
                    <Badge variant="accent" className="shrink-0">
                      {tAnalysis("saved")}
                    </Badge>
                  )}
                </div>
              </DataTableCell>
              <DataTableCell className="whitespace-nowrap text-[13px] text-muted-foreground">
                {analysis.query}
              </DataTableCell>
              <DataTableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(analysis.createdAt)}
              </DataTableCell>
              <DataTableCell className="whitespace-nowrap text-right">
                {isGenerating ? (
                  <Badge variant="secondary" className="gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {tAnalysis("statusGenerating")}
                  </Badge>
                ) : isFailed ? (
                  <Badge variant="destructive">{tAnalysis("failed")}</Badge>
                ) : (
                  <ScoreBadge score={analysis.opportunityScore} size="sm" />
                )}
              </DataTableCell>
            </DataTableRow>
          );
        })}
      </DataTableBody>
    </DataTable>
  );
}
