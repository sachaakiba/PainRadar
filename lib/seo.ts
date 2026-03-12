import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pain-radar.com";

/**
 * Build canonical URL for a path (no leading slash required).
 * Respects localePrefix: as-needed → /path for en, /fr/path for fr.
 */
export function canonicalUrl(path: string, locale: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "fr") return `${BASE_URL}/fr${normalized}`;
  return `${BASE_URL}${normalized}`;
}

/**
 * Build full metadata for an SEO page: title, description, canonical, OG, Twitter, hreflang.
 * Use in generateMetadata for static and dynamic SEO pages.
 */
export function buildSeoMetadata(params: {
  path: string;
  locale: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const { path, locale, title, description, image = "/og.png", type = "website" } = params;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const canonical = canonicalUrl(path, locale);
  const urlEn = `${BASE_URL}${normalized}`;
  const urlFr = `${BASE_URL}/fr${normalized}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "x-default": urlEn,
        en: urlEn,
        fr: urlFr,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: "PainRadar",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@painradar",
    },
  };
}

/** Base URL for use in sitemap, robots, JSON-LD */
export function getBaseUrl(): string {
  return BASE_URL;
}
