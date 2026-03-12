import { MetadataRoute } from "next";
import { exampleAnalyses } from "@/config/examples";
import { useCases } from "@/config/use-cases";
import { features } from "@/config/features";
import { blogPosts } from "@/content/blog-posts";
import { SEO_LANDING_PAGES } from "@/content/seo-pages";
import { getAllPainSlugs } from "@/content/pain-pages";
import { getBaseUrl } from "@/lib/seo";

const LOCALES = ["en", "fr"] as const;

function urlEn(path: string) {
  return `${getBaseUrl()}${path}`;
}
function urlFr(path: string) {
  return `${getBaseUrl()}/fr${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = [
    "",
    "/pricing",
    "/features",
    "/use-cases",
    "/blog",
    "/alternatives",
    "/examples",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ];

  for (const path of staticPaths) {
    entries.push({
      url: urlEn(path),
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
    });
    entries.push({
      url: urlFr(path),
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
    });
  }

  for (const example of exampleAnalyses) {
    const path = `/examples/${example.slug}`;
    entries.push({ url: urlEn(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: urlFr(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }

  for (const uc of useCases) {
    const path = `/use-cases/${uc.slug}`;
    entries.push({ url: urlEn(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: urlFr(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }

  for (const f of features) {
    const path = `/features/${f.slug}`;
    entries.push({ url: urlEn(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: urlFr(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }

  for (const post of blogPosts) {
    const path = `/blog/${post.slug}`;
    entries.push({
      url: urlEn(path),
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
    entries.push({
      url: urlFr(path),
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const page of SEO_LANDING_PAGES) {
    const path = `/${page.slug}`;
    entries.push({ url: urlEn(path), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
    entries.push({ url: urlFr(path), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
  }

  entries.push({ url: urlEn("/pain"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
  entries.push({ url: urlFr("/pain"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });

  for (const slug of getAllPainSlugs()) {
    const path = `/pain/${slug}`;
    entries.push({ url: urlEn(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: urlFr(path), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }

  return entries;
}
