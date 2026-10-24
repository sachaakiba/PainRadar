# SEO agent log

## 2026-10-23
Done:
- Canonical + hreflang (en/fr/x-default) + OG via `buildSeoMetadata` on about, alternatives, blog, contact, examples, features, pricing, use-cases (index pages) and on blog/examples/features/use-cases/alternatives detail pages (previously no canonical/hreflang).
- robots.ts: explicit allow for AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, ...); uses `getBaseUrl()` so it matches canonicals.
- sitemap.ts: added missing /alternatives/[slug] entries.
- public/llms.txt added.
- New blog post `what-is-a-customer-pain-point` (definition-first, FAQ section, internal links).
Notes: `next lint` is not configured (no eslint config); only tsc is run.

Backlog:
1. Base URL mismatch: lib/seo.ts falls back to pain-radar.com, config/site.ts and llms.txt use painradar.com (lib/ is out of scope; confirm NEXT_PUBLIC_APP_URL in Vercel).
2. Blog posts are English-only; add FR versions/translation, plus Article JSON-LD and FAQPage schema for blog FAQ sections.
3. Per-locale localized titles/descriptions for static pages (currently English strings on /fr); sitemap hreflang alternates; localized detail-page metadata for pain/* pages.

## 2026-10-23 (run 2)
Done:
- Blog post JSON-LD upgraded to BlogPosting (publisher+logo, image, dateModified, inLanguage, mainEntityOfPage).
- FAQPage JSON-LD auto-generated from "## FAQ" / "### question" sections in blog posts.
- New post `validate-saas-idea-with-reddit` (answer-first, FAQ, internal links); llms.txt updated.

Backlog:
1. Base URL mismatch (pain-radar.com vs painradar.com) - lib/ out of scope.
2. FR versions of blog posts; localized titles/descriptions for static pages; sitemap hreflang alternates.
3. Add FAQ sections to older blog posts; per-post OG images.

## 2026-10-24
Done:
- FAQ sections (auto-emitted as FAQPage JSON-LD) added to 4 older posts: how-to-find-saas-ideas-from-pain-points, reddit-research-workflow-saas-founders, gummysearch-alternative, micro-saas-ideas-2026 (with internal links).
- New post `saas-idea-validation-checklist` (answer-first, FAQ, internal links); llms.txt updated.

Backlog:
1. Base URL mismatch (pain-radar.com vs painradar.com) - lib/ out of scope.
2. FR versions of blog posts; localized titles/descriptions for static pages; sitemap hreflang alternates.
3. Per-post OG images; answer-first intro blocks for older posts; comparison posts (e.g. vs Google Trends).

## 2026-10-25
Done:
- New posts `google-trends-vs-pain-point-research` (comparison, answer-first, FAQ) and `how-to-score-a-saas-opportunity` (scoring framework, FAQ), internally linked; llms.txt updated.

Backlog:
1. Base URL mismatch (pain-radar.com vs painradar.com) - lib/ out of scope.
2. FR versions of blog posts; localized titles/descriptions for static pages; sitemap hreflang alternates.
3. Per-post OG images; answer-first intro blocks for older posts.

## 2026-10-24 (run 5)
Done:
- New posts `mine-negative-reviews-for-saas-ideas` and `pain-point-vs-feature-request` (answer-first, FAQ -> FAQPage schema, internal links); llms.txt updated.

Backlog:
1. Base URL mismatch (pain-radar.com vs painradar.com) - lib/ out of scope.
2. FR versions of blog posts; localized titles/descriptions for static pages; sitemap hreflang alternates.
3. Per-post OG images; answer-first intro blocks for older posts.
