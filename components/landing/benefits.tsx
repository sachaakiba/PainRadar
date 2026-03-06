"use client";

import {
  Crosshair,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Megaphone,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const benefitKeys = [
  { key: "painDetection", icon: Crosshair },
  { key: "opportunityScoring", icon: BarChart3 },
  { key: "productIdeas", icon: Lightbulb },
  { key: "seoKeywords", icon: TrendingUp },
  { key: "acquisitionChannels", icon: Megaphone },
  { key: "competitiveAnalysis", icon: Shield },
] as const;

export function Benefits() {
  const t = useTranslations("benefits");
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
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefitKeys.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="group border-border/50 bg-card/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
