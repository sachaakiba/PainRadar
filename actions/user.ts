"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-server";
import type { PlanId, Role } from "@/types";

export type UserPlanResult = {
  plan: PlanId;
  hideBillingUI: boolean;
  isSuperAdmin: boolean;
};

export async function getUserPlan(): Promise<UserPlanResult> {
  const session = await requireSession();
  const rows = await db.$queryRaw<
    Array<{ plan: string | null; planManagedManually: boolean | null; role: string | null }>
  >`SELECT "plan", "planManagedManually", "role"::text AS "role" FROM "users" WHERE "id" = ${session.user.id} LIMIT 1`;
  const user = rows[0];
  const role = user?.role as Role | undefined;
  const plan = (user?.plan as PlanId) ?? "free";
  return {
    plan,
    hideBillingUI: user?.planManagedManually ?? false,
    isSuperAdmin: role === "SUPER_ADMIN",
  };
}
