"use client";

import dynamic from "next/dynamic";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type ScoreScores } from "./score-breakdown";

const AXES: { key: keyof ScoreScores; label: string }[] = [
  { key: "opportunityScore", label: "Opportunity" },
  { key: "demandScore", label: "Demand" },
  { key: "urgencyScore", label: "Urgency" },
  { key: "competitionScore", label: "Competition" },
  { key: "monetizationScore", label: "Monetization" },
];

function getColor(avg: number) {
  if (avg >= 80) return "hsl(142 71% 45%)";  // green
  if (avg >= 55) return "hsl(38 92% 50%)";   // amber
  return "hsl(0 72% 51%)";                    // red
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { label: string; value: number } }[] }) {
  if (!active || !payload?.length) return null;
  const { label, value } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{label}</p>
      <p className="font-mono text-lg font-bold tabular-nums" style={{ color: getColor(value) }}>
        {value}
        <span className="text-xs font-normal text-muted-foreground"> / 100</span>
      </p>
    </div>
  );
}

function ScoreRadarChartInner({ scores }: { scores: ScoreScores }) {
  const data = AXES.map(({ key, label }) => ({
    label,
    value: scores[key],
    fullMark: 100,
  }));

  const avg = data.reduce((s, d) => s + d.value, 0) / data.length;
  const color = getColor(avg);

  return (
    <div className="flex justify-center py-2">
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            stroke="currentColor"
            className="text-border"
            strokeOpacity={0.4}
          />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "currentColor", className: "text-muted-foreground" }}
            tickLine={false}
          />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            animationBegin={0}
            animationDuration={600}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// SSR-safe: recharts uses browser APIs
export const ScoreRadarChart = dynamic(
  () => Promise.resolve(ScoreRadarChartInner),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-muted/40" /> }
);
