import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { SeoCta } from "./seo-cta";
import { FaqBlock } from "./faq-block";
import { RelatedLinks, type RelatedLinkGroup } from "./related-links";
import { absoluteUrl } from "@/lib/utils";
import type { SeoPageSlug } from "@/content/seo-pages";
import { SEO_PAGE_RELATED } from "@/content/seo-pages";
import { getPainPageBySlug } from "@/content/pain-pages";
import { features } from "@/config/features";
import { useCases } from "@/config/use-cases";

type SeoLandingLayoutProps = {
  slug: SeoPageSlug;
  key: string;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
  tCommon: (key: string) => string;
  breadcrumbLabel: string;
};

export function SeoLandingLayout({
  slug,
  key: pageKey,
  t,
  tRaw,
  tCommon,
  breadcrumbLabel,
}: SeoLandingLayoutProps) {
  const related = SEO_PAGE_RELATED[slug];
  const groups: RelatedLinkGroup[] = [];

  if (related?.pain?.length) {
    groups.push({
      title: "Pain point examples",
      links: related.pain
        .map((s) => {
          const pain = getPainPageBySlug(s);
          if (!pain) return null;
          const label = `${pain.problem.replace(/-/g, " ")} for ${pain.audience.replace(/-/g, " ")}`;
          return { href: `/pain/${s}`, label: label.charAt(0).toUpperCase() + label.slice(1) };
        })
        .filter(Boolean) as { href: string; label: string }[],
    });
  }
  if (related?.features?.length) {
    groups.push({
      title: "Features",
      links: related.features
        .map((s) => {
          const f = features.find((x) => x.slug === s);
          return f ? { href: `/features/${s}`, label: f.title } : null;
        })
        .filter(Boolean) as { href: string; label: string }[],
    });
  }
  if (related?.useCases?.length) {
    groups.push({
      title: "Use cases",
      links: related.useCases
        .map((s) => {
          const u = useCases.find((x) => x.slug === s);
          return u ? { href: `/use-cases/${s}`, label: u.title } : null;
        })
        .filter(Boolean) as { href: string; label: string }[],
    });
  }

  const faq = tRaw("faq") as { q: string; a: string }[] | undefined;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: absoluteUrl(`/${slug}`) },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: breadcrumbLabel }]} className="mt-4 mb-10" />
        <article>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("h1")}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t("intro")}</p>

          <Card className="mt-10 border-primary/20 bg-primary/5">
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">How PainRadar helps</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{t("howPainRadarHelps")}</p>
            </CardContent>
          </Card>

          <div className="mt-16">
            <SeoCta
              title={t("ctaTitle")}
              buttonLabel={t("ctaButton")}
              href="/signup"
            />
          </div>

          {faq && faq.length > 0 && (
            <div className="mt-16">
              <FaqBlock
                title={t("faqTitle")}
                items={faq}
                pagePath={`/${slug}`}
              />
            </div>
          )}

          {groups.length > 0 && (
            <div className="mt-16">
              <RelatedLinks groups={groups} />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
