"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ScoreRadarChart } from "./score-radar-chart";

export interface ScoreScores {
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
}

function getBarColor(score: number) {
  if (score >= 80) return "[&>div>*]:!bg-score-high";
  if (score >= 55) return "[&>div>*]:!bg-score-mid";
  return "[&>div>*]:!bg-score-low";
}

function getScoreTextColor(score: number) {
  if (score >= 80) return "text-score-high";
  if (score >= 55) return "text-score-mid";
  return "text-score-low";
}

const labelKeys: Record<keyof ScoreScores, string> = {
  opportunityScore: "opportunity",
  demandScore: "demand",
  urgencyScore: "urgency",
  competitionScore: "competition",
  monetizationScore: "monetization",
};

export function ScoreBreakdown({ scores }: { scores: ScoreScores }) {
  const t = useTranslations("analysis");
  const entries = Object.entries(scores) as [keyof ScoreScores, number][];

  return (
    <div className="space-y-4">
      <ScoreRadarChart scores={scores} />
    <div className="grid gap-5 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-sm">{t(labelKeys[key])}</span>
            <span className={cn("font-mono text-lg font-bold tabular-nums", getScoreTextColor(value))}>
              {value}
            </span>
          </div>
          <div className={getBarColor(value)}>
            <Progress value={Math.min(100, value)} className="h-2.5" />
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
