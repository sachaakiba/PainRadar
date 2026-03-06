import { MetadataRoute } from "next";
import { exampleAnalyses } from "@/config/examples";
import { useCases } from "@/config/use-cases";
import { features } from "@/config/features";
import { blogPosts } from "@/content/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://painradar.com";

  const staticPages = [
    "",
    "/pricing",
    "/features",
    "/use-cases",
    "/blog",
    "/alternatives",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const examplePages = exampleAnalyses.map((example) => ({
    url: `${baseUrl}/examples/${example.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const useCasePages = useCases.map((uc) => ({
    url: `${baseUrl}/use-cases/${uc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const featurePages = features.map((f) => ({
    url: `${baseUrl}/features/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...examplePages,
    ...useCasePages,
    ...featurePages,
    ...blogPages,
  ];
}
