import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { buildSeoMetadata } from "@/lib/seo";
import { getSeoPageBySlug } from "@/content/seo-pages";
import { SeoLandingLayout } from "@/components/seo/seo-landing-layout";

const SLUG = "saas-ideas";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = getSeoPageBySlug(SLUG);
  if (!page) return { title: "PainRadar" };
  const t = await getTranslations(`seoLanding.${page.key}`);
  return buildSeoMetadata({
    path: `/${SLUG}`,
    locale,
    title: t("pageTitle"),
    description: t("metaDescription"),
  });
}

export default async function SaasIdeasPage() {
  const page = getSeoPageBySlug(SLUG);
  if (!page) return null;
  const t = await getTranslations(`seoLanding.${page.key}`);
  const tCommon = await getTranslations("common");
  const tRaw = (key: string) => t.raw(key);
  return (
    <SeoLandingLayout
      slug={page.slug}
      key={page.key}
      t={(k) => t(k)}
      tRaw={tRaw}
      tCommon={(k) => tCommon(k)}
      breadcrumbLabel={t("h1")}
    />
  );
}
