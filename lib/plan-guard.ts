import { db } from "@/lib/db";
import type { PlanId } from "@/types";

const PLAN_IDS: PlanId[] = ["free", "hobbyist", "founder"];

export function normalizePlan(plan: string | null): PlanId {
  if (plan && PLAN_IDS.includes(plan as PlanId)) return plan as PlanId;
  return "free";
}

export type UserCreditInfo = {
  plan: PlanId;
  credits: number;
};

export async function getUserCreditInfo(userId: string): Promise<UserCreditInfo | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, credits: true },
  });
  if (!user) return null;

  return {
    plan: normalizePlan(user.plan),
    credits: user.credits,
  };
}

export type LimitCheckResult =
  | { allowed: true }
  | { allowed: false; error: string; upgradeRequired: true };

export async function checkCredits(userId: string): Promise<LimitCheckResult> {
  const info = await getUserCreditInfo(userId);
  if (!info) return { allowed: false, error: "unauthorized", upgradeRequired: true };

  if (info.credits <= 0) {
    return { allowed: false, error: "no_credits", upgradeRequired: true };
  }
  return { allowed: true };
}

export async function consumeCredit(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  });
}

export type PlanLimitErrorType = "no_credits" | "unauthorized";

const MESSAGES: Record<"en" | "fr", Record<PlanLimitErrorType, string>> = {
  en: {
    no_credits:
      "You've used all your credits. Purchase a pack to continue analyzing.",
    unauthorized: "You must be signed in to continue.",
  },
  fr: {
    no_credits:
      "Vous avez utilisé tous vos crédits. Achetez un pack pour continuer vos analyses.",
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
