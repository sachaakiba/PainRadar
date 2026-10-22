# PainRadar

> Find real pain points people are complaining about — and turn them into SaaS ideas.

## Overview

PainRadar is a SaaS idea discovery platform that helps founders, indie hackers, and product teams uncover validated opportunities. By aggregating and analyzing customer complaints from Reddit, forums, review sites, and support communities, PainRadar surfaces real problems people are actively struggling with—and suggests product ideas that address them. Stop guessing what to build and start with evidence.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Prisma + Neon PostgreSQL
- **Auth:** Better Auth
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** React Hook Form + Zod

## Features

- **Authentication** — Email and password sign-up and sign-in
- **Dashboard** — Manage analyses, view saved pain points, and track opportunities
- **Pain Point Analysis Engine** — Scan Reddit, forums, and reviews for real customer complaints
- **Opportunity Scoring** — Demand, urgency, competition, and monetization scores (0–100)
- **Product Idea Generation** — AI-suggested product ideas linked to specific pain points
- **SEO Keyword Discovery** — High-intent keywords derived from customer language
- **Landing Page** — Marketing site with pricing, features, and use cases
- **Blog System** — Content marketing with MDX support
- **Programmatic SEO** — Dynamic pages for examples, use cases, and features

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm, pnpm, or yarn
- A [Neon](https://neon.tech) PostgreSQL account

### Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Neon Setup

1. Sign up at [neon.tech](https://neon.tech) and create a new project.
2. Copy the pooled connection string and set it as `DATABASE_URL`.
3. Copy the direct (non-pooled) connection string and set it as `DIRECT_URL`. Prisma migrations use the direct connection.
4. Ensure both URLs use `?sslmode=require` if connecting over TLS.

### Installation

```bash
npm install
# or
pnpm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

For production or when using migrations:

```bash
npx prisma migrate dev
```

### Better Auth Setup

Generate a secure secret for session signing:

```bash
openssl rand -base64 32
```

Add the output to `BETTER_AUTH_SECRET` in your `.env` file. Ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your deployment URL in production.

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Studio

To inspect and edit data:

```bash
npx prisma studio
```

## Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env` in the Vercel project settings.
4. Deploy. Vercel will run `prisma generate` automatically via the `postinstall` script in `package.json`.

### Database migrations (rec / prod)

This project has two deployed environments, each backed by its own Neon database:

- **`rec`** — staging branch, deployed by Vercel as the Preview/Branch deployment for the `rec` git branch.
- **`prod`** — production branch, deployed by Vercel as the Production deployment for the `prod` git branch.

Migrations are **applied automatically on every deploy**: the `build` script runs `prisma migrate deploy` before `next build` (see `package.json`). This means:

- In the Vercel project settings, `DATABASE_URL` and `DIRECT_URL` must be set **per environment** (scope `rec`'s variables to the Preview environment / `rec` branch, and `prod`'s to the Production environment), each pointing at its own Neon database.
- Any migration committed under `prisma/migrations/` lands on both databases the next time each branch is deployed — no manual step needed.
- `prisma migrate deploy` only ever applies pending migrations already committed to the repo; it never generates new ones and never prompts, so it's safe to run unattended in CI/CD.

To apply a migration manually (e.g. locally against a specific database, or if a deploy needs to be re-run):

```bash
DATABASE_URL="<pooled connection string>" DIRECT_URL="<direct connection string>" npm run db:deploy
```

Use `npx prisma migrate dev` only for local development (it also diffs and creates new migration files); never run it against `rec` or `prod`.

## Project Structure

```
app/                    # Next.js App Router
  (auth)/               # Auth pages (sign-in, sign-up)
  (marketing)/          # Public marketing pages (home, pricing, features, use cases)
  dashboard/            # Protected dashboard and app
  api/                  # API routes (auth, analyses, etc.)
components/             # React components
  ui/                   # shadcn/ui primitives
  dashboard/            # Dashboard-specific components
  landing/              # Landing page sections
features/               # Feature modules
lib/                    # Utilities, services, and shared logic
hooks/                  # Custom React hooks
actions/                # Server actions
prisma/                 # Prisma schema and migrations
types/                  # TypeScript type definitions
config/                 # App configuration (site, features, examples, pricing)
content/                # Blog posts and static content
```

## License

MIT
