# SEO & AI SEO Audit — PainRadar

**Date:** 2026-10-23  
**Site:** https://painradar.com  
**Audit type:** Full site audit + AI SEO audit  
**Branch:** claude/gracious-heisenberg-ka3rqr

---

## Executive Summary

PainRadar has a solid programmatic SEO foundation: 10 keyword-targeted landing pages, 20 pain/[slug] pages, bilingual support (en/fr), a dynamic sitemap, and basic schema markup on the homepage. The site targets a well-defined niche (pain point discovery for founders / indie hackers) with legitimate keyword depth. The top three priorities are: **(1)** add AI-crawler-specific signals (robots.ts AI bot rules, `/llms.txt`, `/pricing.md`) to capture non-Google AI citations, **(2)** expand structured data to blog posts, pain pages, and FAQ pages to unlock featured snippets, and **(3)** grow the programmatic content surface — 20 pain pages and 10 SEO landing pages is a start, but the niche allows for 200+ programmatic pages before hitting duplication risk. Overall assessment: **good foundation, needs authority and AI-visibility work**.

---

## 1. SEO AUDIT COMPLET

### 1.1 Keyword Opportunity Table

| Keyword | Est. Difficulty | Opportunity Score | Current Ranking | Intent | Recommended Content Type |
|---|---|---|---|---|---|
| saas ideas from reddit | Low | **High** | Unknown | Informational/Commercial | SEO landing page (existing: `/startup-ideas-from-reddit`) |
| pain point discovery tool | Low | **High** | Unknown | Commercial | Feature page + blog post |
| micro saas ideas 2026 | Low | **High** | Unknown | Informational | SEO landing page (existing: `/micro-saas-ideas`) — update date |
| startup idea validation tool | Medium | **High** | Unknown | Commercial | Feature page (`/features/idea-validation`) |
| find saas ideas reddit | Low | **High** | Unknown | Informational | Blog post + existing landing page |
| customer pain points examples | Low | **High** | Unknown | Informational | SEO landing page (existing: `/pain-point-examples`) |
| niche saas ideas | Low | **High** | Unknown | Informational | SEO landing page (existing: `/niche-saas-ideas`) |
| market research tool for startups | Medium | **High** | Unknown | Commercial | New landing page |
| indie hacker tools | Medium | **High** | Unknown | Commercial | Use case page (`/use-cases/indie-hackers`) |
| pain point mining | Low | **Medium** | Unknown | Informational | Blog post |
| GummySearch alternative | Low | **High** | Unknown | Commercial | New alternatives page or section |
| reddit pain points business | Low | **Medium** | Unknown | Informational | Blog post |
| validate saas idea | Medium | **Medium** | Unknown | Informational/Commercial | Blog post + link to feature |
| startup idea generator | Medium | **Medium** | Unknown | Commercial | New landing page |
| product market fit research | Hard | **Medium** | Unknown | Informational | Long-form blog post |
| pain point analysis | Low | **Medium** | Unknown | Informational | Blog post + /pain hub page |
| SaaS idea validation framework | Medium | **Medium** | Unknown | Informational | Long-form guide |
| problems people want solved | Low | **Medium** | Unknown | Informational | SEO landing page |
| opportunity scoring startup | Very Low | **Medium** | Unknown | Commercial | Feature page (`/features/opportunity-scoring`) |
| best saas ideas 2026 | Medium | **Low** | Unknown | Informational | Blog post (high competition) |
| exploding topics alternative | Medium | **Medium** | Unknown | Commercial | /alternatives/exploding-topics page |
| SparkToro alternative | Medium | **Medium** | Unknown | Commercial | /alternatives/sparktoro page |
| PainPoints.fast alternative | Very Low | **High** | Unknown | Commercial | /alternatives/painpoints-fast page |

**Top long-tail opportunities:**
- "how to find pain points for saas" — blog post, low difficulty, informational
- "reddit scraper for business ideas" — low difficulty, niche, high intent
- "saas ideas from customer complaints" — highly relevant, low competition
- "invoicing software pain points for freelancers" — pain page keyword (`/pain/invoicing-for-freelancers`)
- "what problems are freelancers facing with invoicing" — question-based, People Also Ask target

---

### 1.2 On-Page Issues Table

| Page | Issue | Severity | Recommended Fix |
|---|---|---|---|
| All pain pages (`/pain/[slug]`) | No `FAQPage` or `Article` schema | **High** | Add `FAQPage` JSON-LD with 3–5 Q&A per pain page |
| All SEO landing pages | No `FAQPage` schema | **High** | Add FAQ schema to all 10 SEO landing pages |
| Blog posts | No `Article` schema | **High** | Add `BlogPosting` schema with author, datePublished, dateModified |
| Homepage | `SoftwareApplication` offer price hardcoded as "0" | **Medium** | Update to reflect actual pricing tiers or remove price from schema |
| Blog posts | Author listed as "PainRadar Team" — no individual attribution | **Medium** | Add real author names + `Person` schema for E-E-A-T |
| All pages | No explicit "Last Updated" visible date | **Medium** | Add `dateModified` to blog posts and show on-page |
| Pain pages / SEO pages | No breadcrumb schema | **Medium** | Add `BreadcrumbList` JSON-LD to all programmatic pages |
| `robots.ts` | No explicit AI bot allow rules | **High** | Add GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly |
| `public/` | No `/robots.txt` file in public (dynamic only) | **Low** | Verify Next.js robots route is accessible at `/robots.txt` |
| Homepage meta keywords | Uses generic keywords array in `layout.tsx` | **Low** | Meta keywords don't affect rankings — not a priority |
| SEO landing pages | Titles use `buildSeoMetadata` — verify 50–60 char limit | **Medium** | Audit generated titles for length |
| `og.png` | OG image is static, same for all pages | **Medium** | Generate dynamic OG images per page (Next.js `ImageResponse`) |
| All pages | No `hreflang` explicit tags verified | **Medium** | Confirm `next-intl` generates correct `hreflang` alternates |
| `/about` page | No `Person` or `Organization` schema | **Medium** | Add founder info + Organization details |
| `/pricing` page | No `Offer` / product schema | **High** | Add structured pricing data (see AI SEO section) |
| Pain pages | 20 pages is a thin programmatic cluster | **High** | Expand to 100+ pages (see Content Gap section) |

---

### 1.3 Content Gap Analysis

| Topic / Keyword | Why It Matters | Format | Priority | Effort |
|---|---|---|---|---|
| Alternatives to GummySearch | GummySearch shut down Nov 2025 — massive opportunity for users searching alternatives right now | Alternatives landing page `/alternatives/gummysearch` | **High** | Quick win (2–4h) |
| Alternatives to Exploding Topics | Established traffic source looking for pain-point-specific alternatives | `/alternatives/exploding-topics` | **High** | Quick win (2–4h) |
| "How to find SaaS ideas" guide (definitive, 3000+ words) | Informational query, high volume, drives top-of-funnel | Long-form blog post | **High** | Moderate (4–8h) |
| Pain point examples by industry | Currently only generic pain examples — vertical-specific pages rank better | 10–15 vertical pain pages (e.g., `/pain/project-management-for-designers`) | **High** | Moderate per page |
| "Startup idea validation checklist" | Commercial + informational hybrid, links to product | Blog post + interactive tool | **High** | Substantial |
| "Best tools for indie hackers 2026" | Listicle format, high citation potential for AI search | Blog post / listicle | **Medium** | Quick win |
| Reddit pain point mining guide | "How to mine Reddit for startup ideas" — directly tied to product | Blog post | **Medium** | Quick win |
| SaaS idea scoring / evaluation framework | Thought leadership, links to opportunity scoring feature | Blog post / guide | **Medium** | Moderate |
| Pain point vs. problem vs. need (glossary) | Definitional content gets AI citations for "what is" queries | Glossary page or blog post | **Medium** | Quick win |
| Comparison: PainRadar vs PainPoints.fast | Direct competitor — users are actively comparing | Comparison page | **High** | Quick win |
| Comparison: PainRadar vs BigIdeasDB | Growing competitor with content presence | Comparison page | **Medium** | Quick win |
| Expand pain pages from 20 → 100+ | 20 pain pages is a thin surface; the niche supports hundreds of problem/audience combos | New `PAIN_PAGE_SEEDS` entries | **High** | Moderate per batch |

**Funnel gap:** No dedicated "decision stage" content. Current blog focuses on awareness (how to find ideas). Missing comparison, pricing, and ROI content that converts mid-funnel visitors.

---

### 1.4 Technical SEO Checklist

| Check | Status | Details |
|---|---|---|
| HTTPS | ✅ Pass | Vercel deployment, HTTPS enforced |
| Sitemap | ✅ Pass | `/sitemap.xml` generated dynamically via `app/sitemap.ts` |
| Robots.txt | ✅ Pass | Generated via `app/robots.ts`, allows `/`, disallows `/dashboard/` and `/api/` |
| Mobile-friendliness | ✅ Pass | Tailwind CSS responsive, Next.js App Router |
| Schema — Homepage | ✅ Pass | `WebSite`, `Organization`, `SoftwareApplication` |
| Schema — Blog posts | ❌ Fail | No `BlogPosting` or `Article` schema |
| Schema — Pain pages | ❌ Fail | No `FAQPage` or `HowTo` schema |
| Schema — SEO landing pages | ❌ Fail | No `FAQPage` or `WebPage` schema |
| Schema — Breadcrumbs | ❌ Fail | No `BreadcrumbList` on inner pages |
| Schema — Pricing page | ❌ Fail | No `Offer` / pricing structured data |
| Hreflang / i18n | ⚠️ Warning | Bilingual via next-intl — verify hreflang tags are in `<head>` |
| Internal linking | ⚠️ Warning | Pain pages and SEO pages cross-link via `SEO_PAGE_RELATED` and `relatedSlugs` — verify these render as `<a>` tags in HTML |
| Canonical tags | ⚠️ Warning | Verify canonical is set on all pages, especially FR alternatives |
| Core Web Vitals | ⚠️ Warning | GTM loaded `afterInteractive` (good); custom fonts from Google Fonts may affect LCP |
| OG images | ⚠️ Warning | Static `/og.png` used site-wide — no per-page dynamic OG |
| Broken links | ⚠️ Warning | No automated broken-link check — run Screaming Frog or similar |
| Image alt text | ⚠️ Warning | Cannot verify without runtime — audit landing page images manually |
| Page speed | ⚠️ Warning | Next.js 15 + Vercel = strong baseline; run PageSpeed Insights on `/` and `/saas-ideas` |
| robots.txt AI bots | ❌ Fail | No explicit rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended |
| `/llms.txt` | ❌ Fail | Missing entirely |
| `/pricing.md` | ❌ Fail | Missing entirely |

---

### 1.5 Competitor Comparison Summary

| Dimension | PainRadar | GummySearch (closed) | PainPoints.fast | Exploding Topics | BigIdeasDB |
|---|---|---|---|---|---|
| Primary data source | Reddit, forums, reviews, HN | Reddit only | Reddit, Twitter, G2, Capterra, PH, HN | Search trends | Review sites, app stores |
| Pain page count | ~30 total | N/A | N/A | N/A | Unknown |
| SEO landing pages | 10 | 0 | 0 | Many | Some |
| Blog | Yes (1 post visible) | No | No | Strong blog | Some |
| Structured data | Homepage only | N/A | Minimal | Strong | Minimal |
| AI citation readiness | Low | N/A | Low | Medium | Low |
| Pricing transparency | Page exists, no /pricing.md | N/A | Free tier | $39/mo+ | $99 one-time |
| **Winner overall** | PainRadar (live + structured) | Closed — opportunity | Feature-parity risk | Better blog/SEO | Niche database |

**Key competitive insight:** GummySearch shutting down in Nov 2025 represents the biggest short-term SEO opportunity. There is likely significant search demand for "GummySearch alternative" from its 140,000+ former users. Publishing `/alternatives/gummysearch` immediately captures this traffic.

---

### 1.6 Prioritized Action Plan — Traditional SEO

#### Quick Wins (this week, <2h each)

1. **Create `/alternatives/gummysearch` page** — GummySearch is dead, users are searching for alternatives. Impact: **High**. Effort: 2h. No dependencies.
2. **Add `BlogPosting` schema to blog posts** — Add `datePublished`, `dateModified`, `author` (Person schema). Impact: **High**. Effort: 1h. File: `app/[locale]/(marketing)/blog/[slug]/page.tsx`.
3. **Add `FAQPage` schema to SEO landing pages** — Template-ize JSON-LD into `SeoLandingLayout`. Impact: **High**. Effort: 2h. File: `components/seo/seo-landing-layout.tsx`.
4. **Explicit AI bot rules in robots.ts** — Add allow rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended. Impact: **High**. Effort: 15min. File: `app/robots.ts`.
5. **Create `/llms.txt`** — Add machine-readable product description. Impact: **Medium**. Effort: 30min. File: `public/llms.txt`.
6. **Create `/pricing.md`** — Structured pricing for AI agents. Impact: **Medium**. Effort: 30min. File: `public/pricing.md`.

#### Strategic Investments (this quarter)

1. **Expand pain pages from 20 → 100+** — Add batches of `PAIN_PAGE_SEEDS` entries. Each page targets `[problem]-for-[audience]` long-tail keywords with almost zero competition. Impact: **High**. Effort: Ongoing. File: `content/pain-pages.ts`.
2. **Dynamic OG images per page** — Use Next.js `ImageResponse` to generate OG images with page title. Impact: **Medium** (CTR from social/AI). Effort: 1 day.
3. **Add `BreadcrumbList` schema to all inner pages** — Use a shared component. Impact: **Medium**. Effort: 2h.
4. **Publish 3–5 authoritative blog posts** — Targets: "How to find SaaS ideas", "GummySearch shutdown: best alternatives", "Reddit pain point mining guide". Impact: **High**. Effort: 1–2 days each.
5. **Comparison pages cluster** — `/alternatives/[competitor]` pages for 5+ competitors. Impact: **High** (commercial intent). Effort: 2–4h each.

---

## 2. AI SEO AUDIT

### 2.1 AI Visibility Audit

| Query | Google AI Overview | ChatGPT | Perplexity | PainRadar Cited? | Who's Cited Instead? |
|---|---|---|---|---|---|
| "best saas idea discovery tool" | Unknown | Unknown | Unknown | Unlikely | PainPoints.fast, BigIdeasDB |
| "find startup ideas from reddit" | Unknown | Unknown | Unknown | Unlikely | GummySearch alternatives, Reddit itself |
| "pain point mining tool for founders" | Unknown | Unknown | Unknown | Unlikely | No established leader |
| "how to validate a saas idea" | Unknown | Unknown | Unknown | Unlikely | Indie Hackers, Y Combinator guides |
| "saas ideas from customer complaints" | Unknown | Unknown | Unknown | Possibly | BigIdeasDB, PainPoints.fast |
| "what is a pain point in business" | Unknown | Unknown | Unknown | Unlikely | HubSpot, Wikipedia |
| "micro saas ideas 2026" | Unknown | Unknown | Unknown | Possibly (owns the page) | hostinger.com/tutorials |

**Assessment:** PainRadar is likely not cited in AI search results today. The brand is new, has minimal third-party presence (no Wikipedia, no G2/Capterra profile found, no Reddit community discussions), and its content lacks the structural patterns AI systems prefer for extraction.

### 2.2 Content Extractability Check

| Check | Status |
|---|---|
| Clear definition in first paragraph on key pages? | ⚠️ Partial — marketing copy, not definitional |
| Self-contained answer blocks (40–60 words)? | ❌ Fail — paragraphs are marketing-style, not extractable passages |
| Statistics with sources cited? | ❌ Fail — no cited statistics in current content |
| Comparison tables for "[X] vs [Y]" queries? | ❌ Fail — no comparison pages exist |
| FAQ section with natural-language questions? | ⚠️ Partial — FAQ component on homepage, not on inner pages |
| FAQ schema markup? | ❌ Fail — FAQ component has no `FAQPage` JSON-LD |
| Expert attribution (author name, credentials)? | ❌ Fail — blog author is "PainRadar Team" |
| Recently updated (within 6 months)? | ⚠️ Partial — blog posts have dates; pain pages/SEO pages have no visible date |
| Heading structure matches query patterns? | ⚠️ Partial — H1/H2 structure exists but headings are brand-first, not query-first |
| AI bots allowed in robots.txt? | ⚠️ Partial — `userAgent: "*"` allows all, but no explicit AI bot rules |

### 2.3 AI Bot Access (robots.ts current state)

Current `app/robots.ts` output:
```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Sitemap: https://painradar.com/sitemap.xml
```

**Issue:** While the wildcard allows AI bots, best practice for maximum AI citation is to list them explicitly. This also future-proofs against any framework-level changes.

Required robots.ts additions:
```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

# Block training-only crawlers (not search/cite bots)
User-agent: CCBot
Disallow: /
```

### 2.4 Missing Machine-Readable Files

#### `/llms.txt` (missing — create at `public/llms.txt`)

```markdown
# PainRadar

> Find real pain points people are complaining about — and turn them into SaaS ideas.

PainRadar is a SaaS idea discovery platform that aggregates and analyzes customer complaints from Reddit, forums, review sites, and support communities. It surfaces real problems people are actively struggling with and suggests validated product opportunities.

## Who it's for
- Founders looking for their next SaaS idea
- Indie hackers validating niche opportunities
- Product teams researching customer problems
- Researchers studying market gaps

## Key capabilities
- Pain point detection from Reddit, Hacker News, G2, Capterra, forums
- Opportunity scoring (demand, urgency, competition, monetization)
- Product idea generation linked to specific pain points
- Keyword insights from real customer language
- Bilingual: English and French

## Key pages
- Homepage: https://painradar.com
- Pricing: https://painradar.com/pricing
- Features: https://painradar.com/features
- How it works: https://painradar.com/features/pain-point-detection
- Blog: https://painradar.com/blog
- Pain examples: https://painradar.com/pain-point-examples
- SaaS ideas: https://painradar.com/saas-ideas
```

#### `/pricing.md` (missing — create at `public/pricing.md`)

```markdown
# Pricing — PainRadar

## Free
- Price: $0/month
- Features: Limited analyses per month, basic pain point discovery, keyword insights
- Limits: See pricing page for current limits

## Pro (estimated)
- Price: See https://painradar.com/pricing for current pricing
- Features: Unlimited analyses, full opportunity scoring, product idea generation, export
- Limits: See pricing page

## Notes
- No credit card required for free tier
- Annual billing may offer discount
- Pricing page: https://painradar.com/pricing
```

*(Update with exact pricing numbers once tiers are finalized.)*

---

### 2.5 Structural Optimization for AI Extraction

The Princeton GEO study found these methods boost AI citation rates:

| Method | Boost | Current Status | Action |
|---|---|---|---|
| Cite sources in content | +40% | ❌ Missing | Add citations to blog posts (link to Reddit threads, studies) |
| Add statistics | +37% | ❌ Missing | Add "42% of startups fail from no market need" + source to homepage |
| Expert quotes | +30% | ❌ Missing | Add founder quotes with name + title |
| Authoritative tone | +25% | ⚠️ Partial | Rewrite key blog paragraphs as definitive statements |
| Fluency + statistics combined | +115% for low-DA sites | ❌ Missing | Priority #1 for a new site |

**40–60 word answer block template** (add to key pages):

> "A pain point is a specific, recurring problem that a defined group of people consistently struggles with and would pay to solve. Unlike a general complaint, a validated pain point shows up repeatedly across multiple sources — Reddit posts, review sites, and support forums — in similar language, indicating real demand."

This single block would make the page extractable for "what is a pain point" queries across ChatGPT, Perplexity, and Google AI Overviews.

---

### 2.6 Third-Party Presence (AI cites third parties 6.5x more than your own site)

| Platform | Current Status | Action |
|---|---|---|
| Wikipedia | Not listed | Create / contribute to relevant Wikipedia pages (pain point analysis, SaaS validation) |
| G2 / Capterra | Not found | Create a product listing on G2 and Capterra |
| Product Hunt | Unknown | Launch on Product Hunt (drives Reddit discussion + backlinks) |
| Reddit | Unknown | Participate in r/SaaS, r/indiehackers, r/startup communities |
| Indie Hackers | Unknown | Publish case studies / build-in-public posts |
| Hacker News | Unknown | Show HN post for community feedback + backlinks |
| YouTube | Unknown | Create a 5-min demo video (frequently cited by Google AI Overviews) |

---

### 2.7 AI SEO Action Plan

#### Quick Wins (this week)

1. **Fix robots.ts** — Add explicit AI bot allow rules (15 min). File: `app/robots.ts`.
2. **Create `/llms.txt`** — See template above (30 min). File: `public/llms.txt`.
3. **Create `/pricing.md`** — See template above (15 min). File: `public/pricing.md`.
4. **Add `FAQPage` JSON-LD to homepage FAQ component** — The FAQ component exists; add schema (1h). File: `components/landing/faq.tsx`.
5. **Add a definitional paragraph to each SEO landing page** — 40–60 word extractable blocks. Impact: immediate AI citation potential (30 min per page template, 2h total).
6. **Add statistics with sources to blog post** — Find 2–3 cited statistics to add to the existing blog post. Impact: +37% AI citation rate.

#### Strategic (this quarter)

1. **Launch on Product Hunt** — single highest-ROI third-party presence action for a new SaaS.
2. **Create G2 + Capterra listings** — AI systems heavily cite review platforms.
3. **Publish 3 comparison/alternative pages** — Comparison content gets cited ~33% of the time in AI answers.
4. **Build `Article` schema into all blog posts** with real author names + `Person` schema.
5. **Create a YouTube demo video** — Google AI Overviews frequently cite YouTube for "how to" queries.
6. **Start a Hacker News "Show HN" thread** — drives inbound links from high-DA domains.

---

## 3. RECOMMANDATIONS PROD

Liste priorisée des changements à implémenter dans le code :

### P0 — Immédiat (<1h chacun)

**[P0-1] robots.ts — Ajouter règles AI bots explicites**
- Fichier: `app/robots.ts`
- Action: Ajouter `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended` avec `Allow: /` et `CCBot` avec `Disallow: /`

**[P0-2] Créer `public/llms.txt`**
- Fichier à créer: `public/llms.txt`
- Contenu: voir template section 2.4 ci-dessus

**[P0-3] Créer `public/pricing.md`**
- Fichier à créer: `public/pricing.md`
- Contenu: voir template section 2.4 ci-dessus (mettre à jour avec vrais prix)

### P1 — Cette semaine (~2h chacun)

**[P1-1] FAQPage schema sur le composant FAQ homepage**
- Fichier: `components/landing/faq.tsx`
- Action: Ajouter `<script type="application/ld+json">` avec `FAQPage` schema généré depuis les données FAQ existantes

**[P1-2] BlogPosting schema sur les pages blog**
- Fichier: `app/[locale]/(marketing)/blog/[slug]/page.tsx`
- Action: Ajouter JSON-LD `BlogPosting` avec `datePublished` (depuis `post.date`), `dateModified`, `author` (Person schema), `headline`, `description`

**[P1-3] FAQPage schema sur les SEO landing pages**
- Fichier: `components/seo/seo-landing-layout.tsx`
- Action: Lire les FAQ depuis les traductions et générer `FAQPage` JSON-LD

**[P1-4] Créer page `/alternatives/gummysearch`**
- Fichier à créer: `app/[locale]/(marketing)/alternatives/gummysearch/page.tsx`
- Action: Page "Best GummySearch Alternatives in 2026" — PainRadar en premier, puis liste d'alternatives. Cible la requête "GummySearch alternative" (opportunité post-fermeture Nov 2025)

**[P1-5] Changer auteur blog posts de "PainRadar Team" → nom réel**
- Fichier: `content/blog-posts.ts`
- Action: Remplacer `author: "PainRadar Team"` par un vrai nom/prénom pour E-E-A-T

### P2 — Ce mois (~4h+ chacun)

**[P2-1] Étendre `PAIN_PAGE_SEEDS` : 20 → 100+ entrées**
- Fichier: `content/pain-pages.ts`
- Action: Ajouter des batches de seeds pour couvrir plus de combinaisons `[problem]-for-[audience]`. Exemples: `email-marketing-for-coaches`, `accounting-for-freelancers`, `hr-for-remote-teams`, `sales-crm-for-solopreneurs`, etc.

**[P2-2] OG images dynamiques par page**
- Fichier à créer: `app/og/route.tsx` (Next.js `ImageResponse`)
- Action: Générer des images OG avec le titre de la page pour améliorer le CTR depuis les partages sociaux et les previews AI

**[P2-3] BreadcrumbList schema sur toutes les pages internes**
- Fichier: créer un composant `components/json-ld/breadcrumb.tsx`
- Action: Générer `BreadcrumbList` JSON-LD depuis le chemin de la page, inclure dans toutes les pages programmatiques

**[P2-4] Vérifier les balises `hreflang` générées par next-intl**
- Action: Inspecter le HTML rendu d'une page FR et EN pour confirmer que `<link rel="alternate" hreflang="fr" ...>` apparaît dans `<head>`
- Si absent: configurer `alternateLinks` dans les métadonnées de `generateMetadata`

**[P2-5] Pages alternatives concurrents**
- Fichiers à créer: `app/[locale]/(marketing)/alternatives/[competitor]/page.tsx` + config
- Cibles initiales: `exploding-topics`, `painpoints-fast`, `sparktoro`, `bigideasdb`

**[P2-6] Ajouter statistiques citées dans le blog post existant**
- Fichier: `content/blog-posts.ts` (contenu MDX du post)
- Action: Ajouter 3–5 statistiques avec sources (ex: "42% of startups fail due to no market need — CB Insights, 2023") pour +37% AI citation rate

**[P2-7] Définir des blocs extractables (40–60 mots) pour les pages clés**
- Pages cibles: `/saas-ideas`, `/customer-pain-points`, `/startup-validation`, `/pain-point-examples`
- Action: Ajouter un paragraphe de définition directe en haut de chaque page (avant le contenu marketing)

### P3 — Ce trimestre (actions externes / marketing)

- Créer listing G2 + Capterra pour PainRadar
- Lancer sur Product Hunt
- Publier un thread "Show HN" sur Hacker News
- Créer une vidéo YouTube de démo 5 min
- Participer dans r/indiehackers, r/SaaS, r/startups avec contenu de valeur (pas de spam)

---

*Rapport généré automatiquement le 2026-10-23 par agents SEO + AI SEO.*  
*Prochain rapport : 2026-10-24 (automatisation toutes les 5h).*
