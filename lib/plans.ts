import type { PlanId } from "@/types";

export const PLAN_LIMITS: Record<
  PlanId,
  {
    analysesPerMonth: number;
    maxSavedAnalyses: number;
    canExport: boolean;
    canGenerateAiPrompt: boolean;
  }
> = {
  free: {
    analysesPerMonth: 3,
    maxSavedAnalyses: 3,
    canExport: false,
    canGenerateAiPrompt: false,
  },
  starter: {
    analysesPerMonth: 50,
    maxSavedAnalyses: -1,
    canExport: true,
    canGenerateAiPrompt: false,
  },
  pro: {
    analysesPerMonth: -1,
    maxSavedAnalyses: -1,
    canExport: true,
    canGenerateAiPrompt: true,
  },
} as const;

export function getPlanLimits(plan: PlanId) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}
