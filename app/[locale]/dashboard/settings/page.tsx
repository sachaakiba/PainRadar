"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { updateUserLocale } from "@/actions/locale";
import { getUserPlan } from "@/actions/user";
import { saveLocaleToStorage, localeLabels } from "@/components/locale-switcher";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sun, Moon, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlanId } from "@/types";

const themeOptions = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

export default function SettingsPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [userPlan, setUserPlan] = useState<PlanId | null>(null);
  const [isPortalPending, setIsPortalPending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPlan = useCallback(async () => {
    try {
      const plan = await getUserPlan();
      setUserPlan(plan);
    } catch {
      setUserPlan("free");
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success(t("upgradeSuccess"));
      router.replace(pathname);
      fetchPlan();
    }
  }, [searchParams, t, router, pathname, fetchPlan]);

  function handleLocaleChange(newLocale: string) {
    setSelectedLocale(newLocale);
    saveLocaleToStorage(newLocale);
    startTransition(async () => {
      await updateUserLocale(newLocale);
      toast.success(t("languageUpdated"));
      router.replace(pathname, { locale: newLocale as "en" | "fr" });
    });
  }

  async function handleManageSubscription() {
    setIsPortalPending(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? t("somethingWentWrong"));
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error(t("somethingWentWrong"));
    } finally {
      setIsPortalPending(false);
    }
  }

  const planLabel =
    userPlan === "starter"
      ? t("starterPlan")
      : userPlan === "pro"
        ? t("proPlan")
        : userPlan === "free"
          ? t("freePlan")
          : "";

  const planDesc =
    userPlan === "starter"
      ? t("starterPlanDesc")
      : userPlan === "pro"
        ? t("proPlanDesc")
        : userPlan === "free"
          ? t("freePlanDesc")
          : "";

  return (
    <div className="space-y-10">
      <div className="fade-up fade-up-1">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t("settingsTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="fade-up fade-up-2">
          <CardHeader>
            <CardTitle className="text-base">{t("profile")}</CardTitle>
            <CardDescription>{t("profileDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="label-sm">{t("name")}</Label>
              <Input
                id="name"
                value={session?.user?.name ?? ""}
                readOnly
                className="bg-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="label-sm">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email ?? ""}
                readOnly
                className="bg-secondary/40"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="fade-up fade-up-3">
          <CardHeader>
            <CardTitle className="text-base">{t("language")}</CardTitle>
            <CardDescription>{t("languageDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select
                value={selectedLocale}
                onValueChange={handleLocaleChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(localeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="fade-up fade-up-4">
          <CardHeader>
            <CardTitle className="text-base">{t("theme")}</CardTitle>
            <CardDescription>{t("themeDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {!mounted ? (
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {themeOptions.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={theme === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {t(`theme${value.charAt(0).toUpperCase() + value.slice(1)}` as "themeLight" | "themeDark" | "themeSystem")}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="fade-up fade-up-5 border-l-4 border-l-coral-500">
          <CardHeader>
            <CardTitle className="text-base">{t("currentPlan")}</CardTitle>
            <CardDescription>{t("currentPlanDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {userPlan === null ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-10 w-44" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Badge variant="coral">{planLabel}</Badge>
                  <span className="text-sm text-muted-foreground">{planDesc}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {userPlan !== "pro" && (
                    <Button
                      onClick={() => router.push("/pricing")}
                      className="w-fit"
                    >
                      {t("upgradeCta")}
                    </Button>
                  )}
                  {userPlan !== "free" && (
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={isPortalPending}
                      className="w-fit"
                    >
                      {isPortalPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {t("manageSubscription")}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
