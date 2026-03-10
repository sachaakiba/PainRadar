"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { updateUserLocale } from "@/actions/locale";

const LOCALE_STORAGE_KEY = "painradar-locale";

export const localeLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
};

export const localeFlags: Record<string, string> = {
  en: "EN",
  fr: "FR",
};

export function saveLocaleToStorage(locale: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function getLocaleFromStorage(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  }
  return null;
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  function switchLocale(newLocale: string) {
    saveLocaleToStorage(newLocale);
    startTransition(async () => {
      if (session?.user) {
        await updateUserLocale(newLocale);
      }
      router.replace(pathname, { locale: newLocale as "en" | "fr" });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(isPending && "opacity-50", className)}
          disabled={isPending}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(localeLabels).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => switchLocale(key)}
            className={cn(
              "flex items-center gap-2",
              locale === key && "font-semibold",
            )}
          >
            <span className="text-xs font-bold text-muted-foreground w-5">
              {localeFlags[key]}
            </span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LocaleSwitcherButton({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const nextLocale = locale === "en" ? "fr" : "en";

  function switchLocale() {
    saveLocaleToStorage(nextLocale);
    startTransition(async () => {
      if (session?.user) {
        await updateUserLocale(nextLocale);
      }
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Button
      variant="ghost"
      onClick={switchLocale}
      disabled={isPending}
      className={cn(isPending && "opacity-50", className)}
    >
      <Languages className="mr-2 h-4 w-4" />
      {localeLabels[nextLocale]}
    </Button>
  );
}
