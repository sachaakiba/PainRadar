import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/content/blog-posts";
import { locales } from "@/i18n/config";
import { markdownToHtml } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/utils";
import { absoluteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPosts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    title: `${post.title} | PainRadar Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const t = await getTranslations("common");
  const tBlog = await getTranslations("blog");
  if (!post) notFound();

  const content = markdownToHtml(post.content);
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: tBlog("pageTitle"),
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: post.date,
    url: absoluteUrl(`/blog/${slug}`),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tBlog("pageTitle"), href: "/blog" },
            { label: post.title },
          ]}
          className="mt-4 mb-10"
        />
        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
              <span>{post.author}</span>
            </div>
          </header>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_a]:hover:no-underline [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-border/50 pt-12">
              <h2 className="text-xl font-semibold text-foreground">
                {tBlog("relatedPosts")}
              </h2>
              <ul className="mt-4 space-y-2">
                {relatedPosts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-primary hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
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
