"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/types";

const planKeys = [
  { key: "free" as const, highlighted: false, accent: "border-t-teal-400" },
  { key: "starter" as const, highlighted: true, accent: "border-t-coral-500" },
  { key: "pro" as const, highlighted: false, accent: "border-t-amber-400" },
] as const;

export function PricingSection() {
  const t = useTranslations("pricing");
  const tDashboard = useTranslations("dashboard");
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);

  const isLoggedIn = !!session?.user;

  async function handleCtaClick(key: (typeof planKeys)[number]["key"]) {
    if (isSessionLoading) return;

    if (key === "free") {
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (key === "starter" || key === "pro") {
      if (!isLoggedIn) {
        router.push("/signin");
        return;
      }

      setPendingPlan(key);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: key }),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          toast.error(data.error ?? tDashboard("somethingWentWrong"));
          return;
        }
        window.location.href = data.url;
      } catch {
        toast.error(tDashboard("somethingWentWrong"));
      } finally {
        setPendingPlan(null);
      }
    }
  }

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {planKeys.map(({ key, highlighted, accent }) => (
            <Card
              key={key}
              className={cn(
                "card-hover relative flex flex-col border-t-4",
                accent,
                highlighted
                  ? "shadow-card-lg ring-2 ring-coral-500/20"
                  : "shadow-card-sm",
              )}
            >
              {highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-pill bg-coral-500 px-4 py-1 text-xs font-bold text-white tracking-wide">
                    {t("mostPopular")}
                  </span>
                </div>
              )}
              <CardHeader className="pb-4 pt-6">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {t(`${key}.name`)}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="stat-number text-foreground">
                    {t(`${key}.price`)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`${key}.period`)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {(t.raw(`${key}.features`) as string[]).map((feature) => {
                    const isAiFeature = /\bAI\b|prompt\s*IA/i.test(feature);
                    return (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-center gap-3 text-sm",
                          isAiFeature && "rounded-lg bg-coral-50 dark:bg-coral-950/20 px-3 py-2 -mx-3"
                        )}
                      >
                        <div className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          isAiFeature
                            ? "bg-coral-100 dark:bg-coral-900/30"
                            : "bg-teal-100 dark:bg-teal-900/30"
                        )}>
                          {isAiFeature ? (
                            <Sparkles className="h-3 w-3 text-coral-600 dark:text-coral-400" />
                          ) : (
                            <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          )}
                        </div>
                        <span className={cn(
                          isAiFeature
                            ? "font-semibold text-coral-700 dark:text-coral-300"
                            : "text-muted-foreground"
                        )}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  variant={highlighted ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => handleCtaClick(key)}
                  disabled={isSessionLoading || !!pendingPlan}
                >
                  {(isSessionLoading && key !== "free") ||
                  pendingPlan === key ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t(`${key}.cta`)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
