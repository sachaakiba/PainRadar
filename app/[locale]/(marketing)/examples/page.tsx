import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { exampleAnalyses } from "@/config/examples";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl, getScoreBg } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Example Analyses",
  description:
    "See real PainRadar analyses: invoicing for freelancers, CRM for therapists, scheduling for tutors, and more. Discover how pain point validation works.",
};

const slugToKey: Record<string, string> = {
  "invoicing-freelancers": "invoicingFreelancers",
  "crm-therapists": "crmTherapists",
  "scheduling-tutors": "schedulingTutors",
  "recruiting-small-agencies": "recruitingAgencies",
  "restaurant-waitlist": "restaurantWaitlist",
};

export default function ExamplesPage() {
  const t = useTranslations("examples");
  const tAnalysis = useTranslations("analysis");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: t("exampleAnalysis"),
        item: absoluteUrl("/examples"),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("exampleAnalysis") }]} className="mt-4 mb-10" />
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {exampleAnalyses.map((example) => (
            <Link key={example.slug} href={`/examples/${example.slug}`}>
              <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {t(`exampleItems.${slugToKey[example.slug]}.topic`)}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("w-fit", getScoreBg(example.opportunityScore))}
                  >
                    {tAnalysis("score")}: {example.opportunityScore}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {t(`exampleItems.${slugToKey[example.slug]}.summary`)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
