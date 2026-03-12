"use server";

import { db } from "@/lib/db";
import { requireSessionWithoutEmailCheck } from "@/lib/auth-server";
import { locales, type Locale } from "@/i18n/config";

export async function updateUserLocale(locale: string) {
  if (!locales.includes(locale as Locale)) {
    return { success: false, error: "Invalid locale" };
  }

  const session = await requireSessionWithoutEmailCheck();

  await db.user.update({
    where: { id: session.user.id },
    data: { locale },
  });

  return { success: true };
}
