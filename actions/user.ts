"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-server";
import type { PlanId } from "@/types";

export async function getUserPlan(): Promise<PlanId> {
  const session = await requireSession();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  return (user?.plan as PlanId) ?? "free";
}
