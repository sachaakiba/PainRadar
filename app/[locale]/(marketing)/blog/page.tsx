import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/content/blog-posts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/utils";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on pain point research, Reddit workflows, and validating SaaS ideas. Learn how to find product ideas from real customer complaints.",
};

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: t("pageTitle"),
        item: absoluteUrl("/blog"),
      },
    ],
  };

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PainRadar Blog",
    url: absoluteUrl("/blog"),
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: absoluteUrl(`/blog/${p.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={blogListJsonLd} />
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t("pageTitle") }]} className="mt-4 mb-10" />
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
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
