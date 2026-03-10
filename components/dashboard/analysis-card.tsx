"use client";

import { Link } from "@/i18n/routing";
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getScoreBg } from "@/lib/utils";

export interface AnalysisCardData {
  id: string;
  query: string;
  topic: string;
  opportunityScore: number;
  saved: boolean;
  createdAt: string | Date;
}

export function AnalysisCard({ analysis }: { analysis: AnalysisCardData }) {
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
          <Badge
            variant="secondary"
            className={cn(
              "w-fit text-sm font-bold tabular-nums",
              getScoreBg(analysis.opportunityScore)
            )}
          >
            {analysis.opportunityScore}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
