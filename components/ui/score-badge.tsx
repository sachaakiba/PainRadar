import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ScoreBadge — PainRadar's core "opportunity score" chip (0–100).
 * Mono numeral on a tinted pill: forest (high ≥80), ochre (mid ≥55), brick (low).
 */
export interface ScoreBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  score: number;
  size?: "sm" | "md" | "lg";
}

function toneFor(score: number) {
  if (score >= 80) return "bg-score-high-tint text-score-high";
  if (score >= 55) return "bg-score-mid-tint text-score-mid";
  return "bg-score-low-tint text-score-low";
}

const sizes = {
  sm: "text-[13px] px-2 py-0.5",
  md: "text-base px-3 py-1",
  lg: "text-xl px-4 py-2",
} as const;

const ScoreBadge = React.forwardRef<HTMLSpanElement, ScoreBadgeProps>(
  ({ score, size = "md", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-sm font-mono font-medium tabular-nums",
        toneFor(score),
        sizes[size],
        className
      )}
      {...props}
    >
      {Math.round(score)}
    </span>
  )
);
ScoreBadge.displayName = "ScoreBadge";

export { ScoreBadge };
