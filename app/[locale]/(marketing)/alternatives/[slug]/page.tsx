import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Check, X } from "lucide-react";
import { alternatives } from "@/config/alternatives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { absoluteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return alternatives.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alt = alternatives.find((a) => a.slug === slug);
  if (!alt) return { title: "Comparison not found" };
  return {
    title: `PainRadar vs ${alt.title} | Alternatives`,
    description: alt.description,
    openGraph: {
      title: `PainRadar vs ${alt.title}`,
      description: alt.description,
      url: absoluteUrl(`/alternatives/${slug}`),
    },
  };
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = alternatives.find((a) => a.slug === slug);
  if (!alt) notFound();

  const t = await getTranslations("common");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alternatives",
        item: absoluteUrl("/alternatives"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `vs ${alt.title}`,
        item: absoluteUrl(`/alternatives/${slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `PainRadar vs ${alt.title}`,
    description: alt.description,
    url: absoluteUrl(`/alternatives/${slug}`),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Alternatives", href: "/alternatives" },
            { label: `vs ${alt.title}` },
          ]}
          className="mb-8"
        />
        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              PainRadar vs {alt.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {alt.description}
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">
                  PainRadar
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {alt.comparison.painRadar.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">
                  {alt.title}
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {alt.comparison.alternative.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
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
            <p className="mt-2 text-muted-foreground">{t("ctaDesc")}</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/signup">{t("signUpFree")}</Link>
            </Button>
          </section>
        </article>
      </div>
    </>
  );
}
