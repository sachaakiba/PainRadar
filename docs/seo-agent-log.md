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
