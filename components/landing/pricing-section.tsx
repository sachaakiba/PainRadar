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

const creditPacks = [
  { id: "starter" as const, credits: 5, price: "$9", priceEur: "9 €", popular: false },
  { id: "explorer" as const, credits: 15, price: "$19", priceEur: "19 €", popular: true },
  { id: "founder" as const, credits: 50, price: "$49", priceEur: "49 €", popular: false },
] as const;

type CreditPackId = (typeof creditPacks)[number]["id"];

export function PricingSection() {
  const t = useTranslations("pricing");
  const tDashboard = useTranslations("dashboard");
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [selectedPack, setSelectedPack] = useState<CreditPackId>("explorer");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isLoggedIn = !!session?.user;
  const currentPack = creditPacks.find((p) => p.id === selectedPack)!;

  async function handleFreeCta() {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  }

  async function handlePurchase() {
    if (isSessionLoading) return;

    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPack }),
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
      setIsPurchasing(false);
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

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Card */}
          <Card className="card-hover relative flex h-full flex-col border-t-4 border-t-teal-400 bg-card/90 shadow-card-sm">
            <CardHeader className="pb-5 pt-6">
              <h3 className="font-display text-[22px] font-bold leading-tight text-foreground">
                {t("free.name")}
              </h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-5xl leading-none text-foreground">
                  {t("free.price")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("free.description")}
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5">
                {(t.raw("free.features") as string[]).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm leading-snug"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                      <Check className="h-3 w-3 text-teal-300" />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-5">
              <Button
                variant="outline"
                className="w-full border-border/70 bg-transparent text-base hover:bg-secondary/40"
                size="lg"
                onClick={handleFreeCta}
                disabled={isSessionLoading || (!!session?.user)}
              >
                {t("free.cta")}
              </Button>
            </CardFooter>
          </Card>

          {/* Credits Card */}
          <Card className="card-hover relative flex h-full flex-col border-t-4 border-t-coral-500 bg-coral-500/[0.04] shadow-card-lg ring-2 ring-coral-500/30">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-pill bg-coral-500 px-4 py-1 text-[11px] font-bold tracking-wide text-white">
                {t("mostPopular")}
              </span>
            </div>
            <CardHeader className="pb-5 pt-6">
              <h3 className="font-display text-[22px] font-bold leading-tight text-foreground">
                {t("credits.name")}
              </h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-5xl leading-none text-foreground">
                  {currentPack.price}
                </span>
                <span className="rounded-full border border-border/60 bg-secondary/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("oneTime")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("credits.description")}
              </p>

              {/* Pack Selector */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {creditPacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={cn(
                      "relative rounded-lg border-2 p-3 text-center transition-all hover:border-coral-400",
                      selectedPack === pack.id
                        ? "border-coral-500 bg-coral-500/10"
                        : "border-border/50 bg-card/50"
                    )}
                  >
                    {pack.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-coral-500 px-2 py-0.5 text-[9px] font-bold text-white">
                          ⭐
                        </span>
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground">
                      {pack.credits}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {t("creditsLabel")}
                    </div>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5">
                {(t.raw("credits.features") as string[]).map((feature) => {
                  const isAiFeature = /\bAI\b|prompt\s*IA/i.test(feature);
                  return (
                    <li
                      key={feature}
                      className={cn(
                        "flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm leading-snug",
                        isAiFeature && "bg-coral-500/10"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          isAiFeature ? "bg-coral-500/20" : "bg-teal-500/20"
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
                            : "text-foreground/90"
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
                variant="default"
                className="w-full text-base"
                size="lg"
                onClick={handlePurchase}
                disabled={isSessionLoading || isPurchasing}
              >
                {isSessionLoading || isPurchasing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("credits.cta", { credits: currentPack.credits })}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
