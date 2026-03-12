import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PAIN_PAGE_SEEDS } from "@/content/pain-pages";
import { buildSeoMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildSeoMetadata({
    path: "/pain",
    locale,
    title: "Pain Points by Niche — Real Problems & SaaS Ideas | PainRadar",
    description:
      "Explore pain points by niche: invoicing for freelancers, CRM for therapists, scheduling for tutors, and more. Find real problems and product opportunities.",
  });
}

export default async function PainIndexPage() {
  const t = await getTranslations("common");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Pain points by niche", item: absoluteUrl("/pain") },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pain points by niche",
    numberOfItems: PAIN_PAGE_SEEDS.length,
    itemListElement: PAIN_PAGE_SEEDS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.problem.replace(/-/g, " ")} for ${p.audience.replace(/-/g, " ")}`,
      url: absoluteUrl(`/pain/${p.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Pain points by niche" }]} className="mt-4 mb-10" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Pain points by niche
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Real problems and product opportunities by audience. Click any topic to see pain points,
          MVP ideas, and keyword angles.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PAIN_PAGE_SEEDS.map((seed) => {
            const label = `${seed.problem.replace(/-/g, " ")} for ${seed.audience.replace(/-/g, " ")}`;
            const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
            return (
              <Link key={seed.slug} href={`/pain/${seed.slug}`}>
                <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary">
                      {displayLabel}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      Pain points, product opportunities, and MVP ideas for this niche.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
