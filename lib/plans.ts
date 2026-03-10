import type { PlanId } from "@/types";

export const PLAN_LIMITS: Record<
  PlanId,
  {
    analysesPerMonth: number;
    maxSavedAnalyses: number;
    canExport: boolean;
  }
> = {
  free: {
    analysesPerMonth: 3,
    maxSavedAnalyses: 3,
    canExport: false,
  },
  starter: {
    analysesPerMonth: 50,
    maxSavedAnalyses: -1,
    canExport: true,
  },
  pro: {
    analysesPerMonth: -1,
    maxSavedAnalyses: -1,
    canExport: true,
  },
} as const;

export function getPlanLimits(plan: PlanId) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}
