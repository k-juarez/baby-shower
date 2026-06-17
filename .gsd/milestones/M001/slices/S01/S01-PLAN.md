# S01: Scaffold, DB schema, and Notion seed

**Goal:** Next.js project initialized with Tailwind, Neon Postgres connected, schema created, and ~32 items seeded from Notion. Can query items via API route.
**Demo:** Next.js project initialized with Tailwind, Neon Postgres connected, schema created, and ~32 items seeded from Notion. Can query items via API route.

## Must-Haves

- `npm run dev` starts Next.js dev server without errors
- `npm run build` produces a successful production build
- `lib/schema.sql` defines the `items` table with columns: id, nombre, que_es, url_imagen, url_elemento, estado, reservado_por, creado_en
- `lib/db.ts` exports a working `neon()`-based sql helper
- `scripts/seed-from-notion.ts` fetches ~32 items from Notion database 800c9949-80ec-445e-ae83-3fd8631cd10d and inserts into Neon Postgres
- `app/api/items/route.ts` exports a GET handler that returns all items as JSON
- Tailwind config includes the Honey Bee color palette from DESIGN.md (primary #7e5700, primary-container #ffb300, etc.)

## Proof Level

- This slice proves: contract

## Integration Closure

API surface (GET /api/items) established for downstream slices. No UI wiring yet — S02 will consume this endpoint to build the catalog page. The seed script is standalone (run once via `tsx scripts/seed-from-notion.ts`) and not integrated into the build pipeline.

## Verification

- The `items` table includes an `estado` column (disponible/apartado) serving as the global availability signal. The API route at `/api/items` returns all rows making the data contract inspectable with `curl` or a browser. No structured logging yet — that arrives with the reservation flow in S03.

## Tasks

- [ ] **T01: Initialize Next.js with Tailwind and bee-theme design tokens** `est:30m`
  Scaffold the Next.js project with TypeScript, Tailwind CSS v4, and the App Router. Configure the Honey Bee design tokens from the stitch-source DESIGN.md into the Tailwind config, load Quicksand and Open Sans via next/font/google, and create the root layout with font loading and global CSS variables.
  - Files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `next.config.ts`, `postcss.config.mjs`
  - Verify: npm run build

- [ ] **T02: Set up Neon Postgres connection and schema** `est:20m`
  Install the Neon serverless driver, create the database utility module, define the items table schema, and provide environment variable templates.
  - Files: `lib/db.ts`, `lib/schema.sql`, `.env.example`, `package.json`
  - Verify: test -f lib/db.ts

- [ ] **T03: Create Notion seed script** `est:30m`
  Build a standalone TypeScript seed script that fetches ~32 gift items from the Notion database and inserts them into the Neon items table.
  - Files: `scripts/seed-from-notion.ts`, `package.json`
  - Verify: test -f scripts/seed-from-notion.ts

- [ ] **T04: Create GET /api/items API route** `est:15m`
  Create a Next.js App Router API route that returns all items from the database as JSON.
  - Files: `app/api/items/route.ts`
  - Verify: test -f app/api/items/route.ts

## Files Likely Touched

- package.json
- tsconfig.json
- tailwind.config.ts
- app/layout.tsx
- app/globals.css
- app/page.tsx
- next.config.ts
- postcss.config.mjs
- lib/db.ts
- lib/schema.sql
- .env.example
- scripts/seed-from-notion.ts
- app/api/items/route.ts
