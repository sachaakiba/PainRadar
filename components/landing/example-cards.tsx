"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { exampleAnalyses } from "@/config/examples";
import { ScoreBadge } from "@/components/ui/score-badge";

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
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
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
                className="group relative rounded-lg border border-border bg-card p-6 shadow-card-xs transition-shadow duration-200 hover:shadow-card-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{t("analysis")}</p>
                    <h3 className="font-display text-lg font-medium leading-snug group-hover:text-primary transition-colors">
                      {t(`exampleItems.${key}.query`)}
                    </h3>
                  </div>
                  <ScoreBadge score={example.opportunityScore} size="sm" className="ml-3" />
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
