import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about PainRadar — our mission, how we work, and what we believe.",
};

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
    ],
  };

  const values = t.raw("values") as Array<{ title: string; description: string }>;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pageTitle") }]} className="mt-4 mb-10" />

        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("pageSubtitle")}
          </p>

          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-xl font-semibold">{t("missionTitle")}</h2>
              <p className="mt-4 whitespace-pre-line text-muted-foreground">{t("missionContent")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">{t("howTitle")}</h2>
              <p className="mt-4 whitespace-pre-line text-muted-foreground">{t("howContent")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">{t("valuesTitle")}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {values.map((value) => (
                  <div key={value.title} className="rounded-lg border border-border/50 bg-muted/30 p-5">
                    <h3 className="font-medium">{value.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-16 rounded-2xl border border-border/50 bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-semibold">{t("ctaTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("ctaDesc")}</p>
            <Button asChild className="mt-6">
              <Link href="/signup">
                {t("ctaButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
