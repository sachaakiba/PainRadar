"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
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
import { cn, formatDate } from "@/lib/utils";
import type { AnalysisCardData } from "@/components/dashboard/analysis-card";

export type SortColumn = "date" | "score";
export type SortDirection = "asc" | "desc";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <ArrowUpDown className="h-3 w-3 opacity-40" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="h-3 w-3" />
  ) : (
    <ArrowDown className="h-3 w-3" />
  );
}

/**
 * Recent / saved / all analyses as an editorial table
 * (Idea · Date · Score), per the dashboard UI kit.
 *
 * Columns keep their natural width and never wrap; the table scrolls
 * horizontally inside its own container (see DataTable) rather than
 * hiding columns on narrow viewports. The Idea column is capped and
 * truncates with an ellipsis (full value in the title attribute) so
 * one long topic can't blow the column out far past what's actually
 * useful to read at a glance.
 *
 * Sorting is controlled by the parent (server-side, via the API) —
 * this component only renders the rows it's given. Pass `sort` +
 * `onSortChange` to make the Date/Score headers clickable; omit them
 * to render static, non-interactive headers (e.g. the dashboard
 * overview's "recent analyses" preview).
 */
export function AnalysesTable({
  analyses,
  showSavedBadge = true,
  sort,
  direction = "desc",
  onSortChange,
}: {
  analyses: AnalysisCardData[];
  showSavedBadge?: boolean;
  sort?: SortColumn;
  direction?: SortDirection;
  onSortChange?: (column: SortColumn) => void;
}) {
  const t = useTranslations("dashboard");
  const tAnalysis = useTranslations("analysis");

  return (
    <DataTable>
      <DataTableHeader>
        <tr>
          <DataTableHead>{t("colIdea")}</DataTableHead>
          <DataTableHead>
            {onSortChange ? (
              <button
                type="button"
                onClick={() => onSortChange("date")}
                className="flex items-center gap-1 uppercase tracking-wide hover:text-foreground"
              >
                {t("colDate")}
                <SortIcon active={sort === "date"} direction={direction} />
              </button>
            ) : (
              t("colDate")
            )}
          </DataTableHead>
          <DataTableHead className="text-right">
            {onSortChange ? (
              <button
                type="button"
                onClick={() => onSortChange("score")}
                className={cn(
                  "flex items-center gap-1 uppercase tracking-wide hover:text-foreground",
                  "ml-auto"
                )}
              >
                {t("colScore")}
                <SortIcon active={sort === "score"} direction={direction} />
              </button>
            ) : (
              t("colScore")
            )}
          </DataTableHead>
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
