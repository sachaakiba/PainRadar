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
    <Link href={`/dashboard/analyses/${analysis.id}`}>
      <Card className="group transition-colors hover:border-primary/30 hover:bg-muted/30">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">
                {analysis.topic || analysis.query}
              </p>
              {analysis.saved && (
                <Bookmark className="h-4 w-4 shrink-0 fill-primary text-primary" />
              )}
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {analysis.query}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(analysis.createdAt)}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "w-fit font-semibold",
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
