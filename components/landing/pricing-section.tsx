"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const planKeys = [
  { key: "free", highlighted: false },
  { key: "starter", highlighted: true },
  { key: "pro", highlighted: false },
] as const;

export function PricingSection() {
  const t = useTranslations("pricing");
  return (
    <section className="border-t border-border/50 bg-muted/20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {planKeys.map(({ key, highlighted }) => (
            <Card
              key={key}
              className={cn(
                "relative flex flex-col border-border/50 transition-all duration-200",
                highlighted
                  ? "border-primary/50 bg-card shadow-lg shadow-primary/5 ring-2 ring-primary/20 dark:ring-primary/30"
                  : "bg-card/50"
              )}
            >
              {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {t("mostPopular")}
                  </span>
                </div>
              )}
              <CardHeader className="pb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {t(`${key}.name`)}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {t(`${key}.price`)}
                  </span>
                  <span className="text-muted-foreground">{t(`${key}.period`)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {(t.raw(`${key}.features`) as string[]).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant={highlighted ? "default" : "outline"}
                  className="w-full"
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
