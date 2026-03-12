"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { exampleAnalyses } from "@/config/examples";
import { cn } from "@/lib/utils";

function getScoreBadge(score: number) {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 60) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-orange-500/10 text-orange-400 border-orange-500/20";
}

const slugToKey: Record<string, string> = {
  "invoicing-freelancers": "invoicingFreelancers",
  "crm-therapists": "crmTherapists",
  "scheduling-tutors": "schedulingTutors",
  "recruiting-small-agencies": "recruitingAgencies",
  "restaurant-waitlist": "restaurantWaitlist",
};

export function ExampleCards() {
  const t = useTranslations("examples");

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exampleAnalyses.map((example) => {
            const key = slugToKey[example.slug];
            return (
              <Link
                key={example.slug}
                href={`/examples/${example.slug}`}
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{t("analysis")}</p>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {t(`exampleItems.${key}.query`)}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "ml-3 inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-bold tabular-nums",
                      getScoreBadge(example.opportunityScore)
                    )}
                  >
                    {example.opportunityScore}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t("topPainPoint")}
                  </p>
                  <p className="text-sm text-foreground/80 line-clamp-2">
                    {t(`exampleItems.${key}.topPainPoint`)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t("suggestedProduct")}
                  </p>
                  <p className="text-sm text-foreground/80 line-clamp-2">
                    {t(`exampleItems.${key}.suggestedProduct`)}
                  </p>
                </div>

                <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
                  {t("viewFull")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
