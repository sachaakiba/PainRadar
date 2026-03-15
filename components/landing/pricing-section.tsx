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

const planKeys = [
  { key: "free" as const, highlighted: false, accent: "border-t-teal-400" },
  { key: "single" as const, highlighted: false, accent: "border-t-violet-400" },
  { key: "hobbyist" as const, highlighted: true, accent: "border-t-coral-500" },
  { key: "founder" as const, highlighted: false, accent: "border-t-amber-400" },
] as const;

type PricingPackKey = (typeof planKeys)[number]["key"];

export function PricingSection() {
  const t = useTranslations("pricing");
  const tDashboard = useTranslations("dashboard");
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [pendingPlan, setPendingPlan] = useState<PricingPackKey | null>(null);

  const isLoggedIn = !!session?.user;

  async function handleCtaClick(key: PricingPackKey) {
    if (isSessionLoading) return;

    if (key === "free") {
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (key === "single" || key === "hobbyist" || key === "founder") {
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
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {planKeys.map(({ key, highlighted, accent }) => {
            const badge = t(`${key}.badge`);
            return (
              <Card
                key={key}
                className={cn(
                  "card-hover relative flex h-full flex-col border-t-4",
                  accent,
                  highlighted
                    ? "shadow-card-lg ring-2 ring-coral-500/30 bg-coral-500/[0.04]"
                    : "shadow-card-sm bg-card/90",
                )}
              >
                {highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-pill bg-coral-500 px-4 py-1 text-[11px] font-bold text-white tracking-wide">
                      {t("mostPopular")}
                    </span>
                  </div>
                )}
                <CardHeader className="pb-5 pt-6">
                  <h3 className="font-display text-[22px] leading-tight font-bold text-foreground">
                    {t(`${key}.name`)}
                  </h3>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-5xl leading-none text-foreground">
                      {t(`${key}.price`)}
                    </span>
                    {badge && (
                      <span className="rounded-full border border-border/60 bg-secondary/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`${key}.description`)}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5">
                    {(t.raw(`${key}.features`) as string[]).map((feature) => {
                      const isAiFeature = /\bAI\b|prompt\s*IA/i.test(feature);
                      return (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm leading-snug",
                            isAiFeature && "bg-coral-500/10",
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                              isAiFeature
                                ? "bg-coral-500/20"
                                : "bg-teal-500/20",
                            )}
                          >
                            {isAiFeature ? (
                              <Sparkles className="h-3 w-3 text-coral-300" />
                            ) : (
                              <Check className="h-3 w-3 text-teal-300" />
                            )}
                          </div>
                          <span
                            className={cn(
                              isAiFeature
                                ? "font-semibold text-coral-100"
                                : "text-foreground/90",
                            )}
                          >
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter className="pt-5">
                  <Button
                    variant={highlighted ? "default" : "outline"}
                    className={cn(
                      "w-full text-base",
                      !highlighted &&
                        "border-border/70 bg-transparent hover:bg-secondary/40",
                    )}
                    size="lg"
                    onClick={() => handleCtaClick(key)}
                    disabled={
                      isSessionLoading ||
                      !!pendingPlan ||
                      (!!session?.user && key === "free")
                    }
                  >
                    {(isSessionLoading && key !== "free") ||
                    pendingPlan === key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {t(`${key}.cta`)}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
