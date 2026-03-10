"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn, getScoreBg } from "@/lib/utils";

export interface PainPoint {
  id: string;
  text: string;
  severityScore: number;
  sentiment?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  authorHandle?: string | null;
  tags: string[];
}

export function PainPointList({ painPoints }: { painPoints: PainPoint[] }) {
  const t = useTranslations("analysis");
  if (painPoints.length === 0) {
    return <p className="text-sm text-muted-foreground">No pain points identified.</p>;
  }

  return (
    <div className="space-y-1">
      {painPoints.map((point, i) => (
        <div key={point.id}>
          <div className="rounded-xl p-4 transition-colors hover:bg-secondary/30">
            <p className="text-sm leading-relaxed text-foreground">{point.text}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="coral"
                className={cn("font-bold", getScoreBg(point.severityScore))}
              >
                {t("severity")}: {point.severityScore}
              </Badge>
              {point.sentiment && (
                <Badge variant="outline" className="text-xs">{point.sentiment}</Badge>
              )}
              {point.sourceName && (
                <span className="text-xs font-medium text-muted-foreground">
                  {t("from")} {point.sourceName}
                  {point.authorHandle && ` (@${point.authorHandle})`}
                </span>
              )}
              {point.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {point.tags.map((tag) => (
                    <Badge key={tag} variant="teal" className="text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {i < painPoints.length - 1 && <div className="mx-4 h-px bg-border/40" />}
        </div>
      ))}
    </div>
  );
}
