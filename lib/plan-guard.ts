import { db } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";
import type { PlanId } from "@/types";

const PLAN_IDS: PlanId[] = ["free", "starter", "pro"];

function normalizePlan(plan: string | null): PlanId {
  if (plan && PLAN_IDS.includes(plan as PlanId)) return plan as PlanId;
  return "free";
}

export type UserPlanInfo = {
  plan: PlanId;
  analysesThisMonth: number;
  savedCount: number;
  analysesPerMonthLimit: number;
  maxSavedAnalyses: number;
};

export async function getUserPlanInfo(userId: string): Promise<UserPlanInfo | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  if (!user) return null;

  const plan = normalizePlan(user.plan);
  const limits = getPlanLimits(plan);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [analysesThisMonth, savedCount] = await Promise.all([
    db.analysis.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    }),
    db.analysis.count({
      where: { userId, saved: true },
    }),
  ]);

  return {
    plan,
    analysesThisMonth,
    savedCount,
    analysesPerMonthLimit: limits.analysesPerMonth,
    maxSavedAnalyses: limits.maxSavedAnalyses,
  };
}

export type LimitCheckResult =
  | { allowed: true }
  | { allowed: false; error: string; upgradeRequired: true };

export async function checkAnalysisLimit(userId: string): Promise<LimitCheckResult> {
  const info = await getUserPlanInfo(userId);
  if (!info) return { allowed: false, error: "unauthorized", upgradeRequired: true };

  const { analysesThisMonth, analysesPerMonthLimit } = info;
  if (analysesPerMonthLimit >= 0 && analysesThisMonth >= analysesPerMonthLimit) {
    return { allowed: false, error: "analysis_limit", upgradeRequired: true };
  }
  return { allowed: true };
}

export async function checkSaveLimit(userId: string): Promise<LimitCheckResult> {
  const info = await getUserPlanInfo(userId);
  if (!info) return { allowed: false, error: "unauthorized", upgradeRequired: true };

  const { savedCount, maxSavedAnalyses } = info;
  if (maxSavedAnalyses >= 0 && savedCount >= maxSavedAnalyses) {
    return { allowed: false, error: "save_limit", upgradeRequired: true };
  }
  return { allowed: true };
}

export type PlanLimitErrorType = "analysis_limit" | "save_limit" | "unauthorized";

const MESSAGES: Record<"en" | "fr", Record<PlanLimitErrorType, string>> = {
  en: {
    analysis_limit:
      "You've reached your monthly analysis limit. Upgrade to continue.",
    save_limit:
      "You've reached your saved analyses limit. Upgrade or unsave an analysis.",
    unauthorized: "You must be signed in to continue.",
  },
  fr: {
    analysis_limit:
      "Vous avez atteint votre limite d'analyses mensuelles. Passez à une offre supérieure pour continuer.",
    save_limit:
      "Vous avez atteint la limite d'analyses enregistrées. Passez à une offre supérieure ou désenregistrez une analyse.",
    unauthorized: "Vous devez être connecté pour continuer.",
  },
};

export function getPlanLimitError(
  type: PlanLimitErrorType,
  locale: string
): string {
  const lang = locale.startsWith("fr") ? "fr" : "en";
  return MESSAGES[lang][type] ?? MESSAGES.en[type];
}
