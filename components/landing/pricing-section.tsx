"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const planKeys = [
  { key: "free", highlighted: false, accent: "border-t-teal-400" },
  { key: "starter", highlighted: true, accent: "border-t-coral-500" },
  { key: "pro", highlighted: false, accent: "border-t-amber-400" },
] as const;

export function PricingSection() {
  const t = useTranslations("pricing");
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
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
                  : "shadow-card-sm"
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
                  {(t.raw(`${key}.features`) as string[]).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  asChild
                  variant={highlighted ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  <Link href="/signup">{t(`${key}.cta`)}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
