import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { useCases } from "@/config/use-cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = useCases.find((u) => u.slug === slug);
  if (!useCase) return { title: "Use case not found" };
  return {
    title: `${useCase.title} | PainRadar`,
    description: useCase.description,
    openGraph: {
      title: `${useCase.title} | PainRadar`,
      description: useCase.description,
      url: absoluteUrl(`/use-cases/${slug}`),
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = useCases.find((u) => u.slug === slug);
  if (!useCase) notFound();

  const slugToKey: Record<string, string> = {
    "indie-hackers": "indieHackers",
    agencies: "agencies",
    freelancers: "freelancers",
    startups: "startups",
  };
  const key = slugToKey[slug];
  const t = await getTranslations("common");
  const tUseCases = await getTranslations("useCases");

  const useCaseTitle = key ? tUseCases(`${key}.title`) : useCase.title;
  const useCaseDesc = key ? tUseCases(`${key}.description`) : useCase.description;
  const useCaseAudience = key ? tUseCases(`${key}.audience`) : useCase.audience;
  const painPoints = key ? (tUseCases.raw(`${key}.painPoints`) as string[]) : useCase.painPoints;
  const benefits = key ? (tUseCases.raw(`${key}.benefits`) as string[]) : useCase.benefits;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: tUseCases("pageTitle"),
        item: absoluteUrl("/use-cases"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: useCaseTitle,
        item: absoluteUrl(`/use-cases/${slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: useCaseTitle,
    description: useCaseDesc,
    url: absoluteUrl(`/use-cases/${slug}`),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tUseCases("pageTitle"), href: "/use-cases" },
            { label: useCaseTitle },
          ]}
          className="mt-4 mb-10"
        />
        <article>
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <Users className="mr-1.5 h-3 w-3" />
              {useCaseAudience}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {useCaseTitle}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {useCaseDesc}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  {tUseCases("painPoints")}
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {painPoints.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  {tUseCases("benefits")}
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <section className="mt-16 rounded-xl border border-border/50 bg-muted/20 px-8 py-10 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {t("ctaTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("ctaDesc")}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/signup">{t("signUpFree")}</Link>
            </Button>
          </section>
        </article>
      </div>
    </>
  );
}
