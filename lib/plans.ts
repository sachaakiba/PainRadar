import type { PlanId } from "@/types";

export const PLAN_LIMITS: Record<
  PlanId,
  {
    canExport: boolean;
    canGenerateAiPrompt: boolean;
    fullAnalysis: boolean;
  }
> = {
  free: {
    canExport: false,
    canGenerateAiPrompt: false,
    fullAnalysis: false,
  },
  starter: {
    canExport: true,
    canGenerateAiPrompt: true,
    fullAnalysis: true,
  },
  explorer: {
    canExport: true,
    canGenerateAiPrompt: true,
    fullAnalysis: true,
  },
  founder: {
    canExport: true,
    canGenerateAiPrompt: true,
    fullAnalysis: true,
  },
} as const;

export function getPlanLimits(plan: PlanId) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}
