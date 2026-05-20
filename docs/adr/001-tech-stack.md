# ADR-001: Technology Stack

**Date:** 2026-05-20
**Status:** Accepted
**Deciders:** CTO (Founding Engineer)

## Context

GTA Junk Removal needs a technology stack that:

1. Gets the customer booking flow live within days, not weeks.
2. Runs on mobile-first — crew members use phones in trucks with spotty connectivity.
3. Scales to 10x job volume without a rewrite.
4. Keeps infrastructure cost near zero while the business validates.
5. Preserves type safety across the full stack from day one to avoid costly runtime bugs.

## Decision

### Monorepo: Turborepo + pnpm workspaces

**Chosen:** Turborepo with pnpm workspaces.

**Why:** We will share database types, validation schemas, and UI components across the customer site and (future) admin dashboard and crew PWA. A monorepo with a single lockfile eliminates version drift across these apps. Turborepo's remote caching keeps CI fast as the repo grows.

**Packages:**
- `apps/web` — customer-facing booking site
- `apps/admin` — internal ops dashboard (future)
- `packages/db` — Prisma schema + generated client (shared)
- `packages/ui` — shared design system components (future)

### Frontend: Next.js 15 (App Router) + Tailwind CSS

**Chosen:** Next.js 15 with App Router, React 19, Tailwind CSS.

**Why:** Next.js is the dominant React meta-framework with the best Vercel deployment story (zero-config). The App Router enables server components, which reduce client-side JavaScript — critical for booking conversion on slow mobile connections. Tailwind gives us a consistent design system without a CSS bundle overhead. No alternative (Remix, Astro, SvelteKit) matches the combined deployment simplicity and ecosystem maturity.

**Not chosen:**
- Remix — excellent but smaller ecosystem; Vercel/Next.js has stronger same-day deployment tooling.
- Astro — great for static content, wrong fit for a real-time booking platform with dynamic state.

### API Layer: tRPC

**Chosen:** tRPC with Next.js API routes.

**Why:** tRPC provides end-to-end type safety from the database to the UI without code generation or a separate schema language. A wrong field name in the booking form becomes a compile error, not a production bug. Runs serverless within Next.js, so no additional infrastructure. We can expose REST endpoints via the tRPC HTTP adapter later if needed for webhooks or third-party integrations.

**Not chosen:**
- REST (plain): No type inference; we'd write and maintain types in two places.
- GraphQL: Overkill for a team of one; resolver boilerplate slows initial velocity.

### Database: PostgreSQL via Neon (serverless)

**Chosen:** PostgreSQL with Neon (serverless Postgres) + Prisma ORM.

**Why:** Booking, job, customer, and crew data are inherently relational. PostgreSQL is the industry standard for this workload. Neon's serverless branching lets us spin up per-PR database branches in CI for free. Prisma provides a type-safe ORM with first-class migration tooling. Cost is zero on the free tier until we reach consistent concurrent load.

**Not chosen:**
- MongoDB: Non-relational; booking relationships (customer → booking → job → crew) map poorly to documents.
- PlanetScale (MySQL): Vitess' lack of foreign key support creates pain points for relational booking schemas.
- Supabase: Viable alternative (also Postgres + good auth). Neon chosen for simpler serverless connection management; we can migrate if Supabase auth proves desirable.

### Authentication: Auth.js (NextAuth v5)

**Planned (not yet implemented):** Auth.js with magic-link email and Google OAuth for customers; crew auth via short-lived SMS codes.

**Why:** Auth.js integrates natively with Next.js App Router. We defer full auth setup until the booking MVP is functional to avoid premature infrastructure complexity.

### Payments: Stripe

**Planned (not yet implemented):** Stripe for customer payments.

**Why:** PCI compliance without owning card data. Stripe's webhook model integrates cleanly with Next.js API routes. Stripe Connect will enable crew payouts in a future cycle.

### CI/CD

**Chosen:** GitHub Actions for CI; GitHub Pages for initial staging; Vercel for production.

**Why:** GitHub Actions is free for public repos and tightly integrated with the repo. GitHub Pages gives us a zero-credential staging URL for pipeline verification. Vercel is the natural long-term deployment target for Next.js with preview deployments per PR. Switching from Pages → Vercel requires connecting the repo in the Vercel dashboard (5 minutes, no code changes).

### Infrastructure Principle

We provision nothing we must manage. Neon handles Postgres. Vercel handles compute. GitHub handles CI. The CTO's time goes into product, not ops. All infrastructure costs require CEO approval before incurring.

## Consequences

- Full-stack TypeScript from database to UI; runtime type mismatches are eliminated at compile time.
- All apps share the same Prisma schema; migrations apply once and are reflected everywhere.
- GitHub Pages staging is not a production runtime — it uses Next.js static export and cannot run server-side code or database queries. It is sufficient only for pipeline verification and UI smoke tests. The Vercel staging environment (with real server-side rendering) must be set up before HAU-3 ships.
- tRPC does not expose a REST API by default; if third-party webhooks (Stripe, SMS) need HTTP endpoints, we add those as standard Next.js route handlers alongside tRPC.
