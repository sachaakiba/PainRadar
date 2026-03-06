import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowRight, Users } from "lucide-react";
import { useCases } from "@/config/use-cases";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "How PainRadar helps indie hackers, agencies, and startups validate ideas with real pain point data. See which use case fits your needs.",
};

export default function UseCasesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Use Cases",
        item: absoluteUrl("/use-cases"),
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PainRadar Use Cases",
    numberOfItems: useCases.length,
    itemListElement: useCases.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: u.title,
      url: absoluteUrl(`/use-cases/${u.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Use Cases" }]} className="mb-8" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Use Cases
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            PainRadar for every stage of your journey
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Link key={useCase.slug} href={`/use-cases/${useCase.slug}`}>
              <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      {useCase.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {useCase.description}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs font-normal">
                      {useCase.audience}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
