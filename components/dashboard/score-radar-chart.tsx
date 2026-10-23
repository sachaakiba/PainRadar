"use client";

import { type ScoreScores } from "./score-breakdown";

const AXES: { key: keyof ScoreScores; label: string }[] = [
  { key: "opportunityScore", label: "Opportunity" },
  { key: "demandScore", label: "Demand" },
  { key: "urgencyScore", label: "Urgency" },
  { key: "competitionScore", label: "Competition" },
  { key: "monetizationScore", label: "Monetization" },
];

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 72;
const LABEL_OFFSET = 18;
const N = AXES.length;

function polarToXY(angle: number, r: number) {
  // Start from top (-90°)
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function buildPolygon(values: number[], r: number) {
  return values
    .map((v, i) => {
      const { x, y } = polarToXY((i * 360) / N, (v / 100) * r);
      return `${x},${y}`;
    })
    .join(" ");
}

function getColor(avg: number) {
  if (avg >= 80) return "var(--score-high, #22c55e)";
  if (avg >= 55) return "var(--score-mid, #f59e0b)";
  return "var(--score-low, #ef4444)";
}

export function ScoreRadarChart({ scores }: { scores: ScoreScores }) {
  const values = AXES.map(({ key }) => scores[key]);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const fillColor = getColor(avg);

  // Grid rings at 25, 50, 75, 100
  const gridRings = [25, 50, 75, 100];

  return (
    <div className="flex justify-center py-2">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Grid rings */}
        {gridRings.map((pct) => (
          <polygon
            key={pct}
            points={buildPolygon(Array(N).fill(pct), RADIUS)}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border opacity-60"
          />
        ))}

        {/* Axis lines */}
        {AXES.map((_, i) => {
          const outer = polarToXY((i * 360) / N, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={outer.x}
              y2={outer.y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border opacity-60"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={buildPolygon(values, RADIUS)}
          fill={fillColor}
          fillOpacity={0.18}
          stroke={fillColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {values.map((v, i) => {
          const { x, y } = polarToXY((i * 360) / N, (v / 100) * RADIUS);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.5}
              fill={fillColor}
            />
          );
        })}

        {/* Labels */}
        {AXES.map(({ label }, i) => {
          const { x, y } = polarToXY(
            (i * 360) / N,
            RADIUS + LABEL_OFFSET
          );
          const anchor =
            x < CENTER - 4 ? "end" : x > CENTER + 4 ? "start" : "middle";
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="9"
              fill="currentColor"
              className="text-muted-foreground"
              fontFamily="inherit"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
