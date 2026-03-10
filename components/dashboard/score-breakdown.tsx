"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ScoreScores {
  opportunityScore: number;
  demandScore: number;
  urgencyScore: number;
  competitionScore: number;
  monetizationScore: number;
}

function getBarColor(score: number) {
  if (score >= 80) return "[&>div>*]:!bg-teal-400";
  if (score >= 60) return "[&>div>*]:!bg-amber-400";
  if (score >= 40) return "[&>div>*]:!bg-coral-400";
  return "[&>div>*]:!bg-red-500";
}

function getScoreTextColor(score: number) {
  if (score >= 80) return "text-teal-500";
  if (score >= 60) return "text-amber-500";
  if (score >= 40) return "text-coral-500";
  return "text-red-500";
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
  );
}
