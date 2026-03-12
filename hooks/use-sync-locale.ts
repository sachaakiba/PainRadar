"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { updateUserLocale } from "@/actions/locale";
import type { Locale } from "@/i18n/config";

export function useSyncLocale() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    fetch("/api/user/locale")
      .then((res) => res.json())
      .then(async (data: { locale: string | null }) => {
        if (data.locale && data.locale !== currentLocale) {
          router.replace(pathname, { locale: data.locale as Locale });
        } else if (!data.locale || data.locale === "en") {
          await updateUserLocale(currentLocale);
        }
      })
      .catch(() => {});
  }, [currentLocale, router, pathname]);
}
