# GTA Junk Removal

Same-day junk removal platform for the Greater Toronto Area.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| API | tRPC |
| ORM | Prisma |
| Database | PostgreSQL (Neon serverless) |
| Styling | Tailwind CSS |
| Monorepo | Turborepo + pnpm |
| CI | GitHub Actions |
| Deployment | Vercel (prod) · GitHub Pages (staging hello-world) |

See [`docs/adr/001-tech-stack.md`](docs/adr/001-tech-stack.md) for full rationale.

## Apps & Packages

```
apps/
  web/          Customer-facing booking site (Next.js)
packages/
  db/           Prisma schema + generated client (shared)
```

## Local Development

### Prerequisites

- Node.js ≥ 20
- pnpm 9 (`npm i -g pnpm@9`)
- A PostgreSQL database (Neon free tier recommended — see below)

### 1. Clone and install

```bash
git clone git@github.com:adammeghji/gta-junk-removal.git
cd gta-junk-removal
pnpm install
```

### 2. Set up environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
# Neon / Postgres
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."   # Neon's direct (non-pooled) URL for migrations
```

**Get a Neon database:** Sign up at [neon.tech](https://neon.tech), create a project, copy the connection strings.

### 3. Run database migrations

```bash
pnpm --filter @gta-jr/db db:generate   # generate Prisma client
pnpm --filter @gta-jr/db db:push        # push schema to database (dev only)
```

### 4. Start the dev server

```bash
pnpm dev
```

The booking site runs at `http://localhost:3000`.

### Useful commands

```bash
pnpm build          # Build all apps
pnpm lint           # ESLint across all apps
pnpm typecheck      # TypeScript check across all apps
pnpm --filter @gta-jr/db db:studio   # Prisma Studio (visual DB browser)
```

## CI

GitHub Actions runs on every push:

- **ci.yml** — lint, typecheck, build
- **staging.yml** — builds a static export and deploys to GitHub Pages (main branch only)

Staging URL: `https://adammeghji.github.io/gta-junk-removal/`

## Production Deployment

Connect the repo to Vercel (5 minutes, no code changes):

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `gta-junk-removal` GitHub repo
3. Set root directory to `apps/web`
4. Add `DATABASE_URL` and `DIRECT_URL` environment variables
5. Deploy

Vercel will auto-deploy every push to `main` and create preview deployments for PRs.
