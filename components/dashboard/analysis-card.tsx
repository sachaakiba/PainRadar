"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Bookmark, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getScoreBg } from "@/lib/utils";

export interface AnalysisCardData {
  id: string;
  query: string;
  topic: string;
  opportunityScore: number;
  saved: boolean;
  status?: string;
  createdAt: string | Date;
}

export function AnalysisCard({ analysis }: { analysis: AnalysisCardData }) {
  const t = useTranslations("analysis");
  const isGenerating = analysis.status === "generating";
  const isFailed = analysis.status === "failed";

  return (
    <Link href={`/dashboard/analyses/${analysis.id}`} className="block">
      <Card className="card-hover group border-border/40 hover:border-coral-300/40 dark:hover:border-coral-500/30">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-foreground">
                {analysis.topic || analysis.query}
              </p>
              {analysis.saved && (
                <Bookmark className="h-4 w-4 shrink-0 fill-coral-500 text-coral-500" />
              )}
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {analysis.query}
            </p>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground/70">
              {formatDate(analysis.createdAt)}
            </p>
          </div>
          {isGenerating ? (
            <Badge variant="secondary" className="w-fit gap-1.5 text-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("statusGenerating")}
            </Badge>
          ) : isFailed ? (
            <Badge variant="destructive" className="w-fit text-sm">
              {t("failed")}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className={cn(
                "w-fit text-sm font-bold tabular-nums",
                getScoreBg(analysis.opportunityScore)
              )}
            >
              {analysis.opportunityScore}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
