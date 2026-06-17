---
id: S01
parent: M001
milestone: M001
provides:
  - Next.js 16 project scaffold with working build pipeline
  - Tailwind v4 with Honey Bee theme tokens and fonts
  - Neon Postgres connection (lazy-init, serverless-safe)
  - Items table schema with 8 columns including estado and reservado_por
  - Notion seed script using v5 API
  - GET /api/items returning all items as JSON
requires:
  []
affects:
  []
key_files:
  - app/layout.tsx
  - app/page.tsx
  - app/globals.css
  - app/api/items/route.ts
  - lib/db.ts
  - lib/schema.sql
  - scripts/seed-from-notion.ts
  - .env.example
  - postcss.config.mjs
  - next.config.ts
  - eslint.config.mjs
key_decisions:
  - Response shape for /api/items is { items: rows } for consistent frontend consumption
  - Error response includes detail field with actual error message for debugging
  - No caching/pagination on API route — deferred to S02 catalog page
  - Lazy init pattern for neon() — avoids build-time DATABASE_URL validation failures
patterns_established:
  - Lazy initialization for serverless DB connections to avoid build-time module import failures
  - CSS custom properties for design tokens + @theme inline in Tailwind v4
  - @notionhq/client v5 dataSources.query() with result_type: 'page' for Notion integration
observability_surfaces:
  - /api/items returns error detail in 500 responses for debugging
  - Build output clearly marks /api/items as dynamic (f) vs static (O)
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-06-17T22:26:11.985Z
blocker_discovered: false
---

# S01: Scaffold, DB schema, and Notion seed

**Next.js 16 project scaffolded with Tailwind v4 and Honey Bee design tokens, Neon Postgres connected with lazy-init db.ts and 8-column items schema, Notion v5 seed script created, and GET /api/items route returning all items as JSON.**

## What Happened

## What Happened

All 4 tasks in S01 were completed successfully:

**T01 — Project Scaffold**: Next.js 16 project with TypeScript, Tailwind v4, and App Router. Full Honey Bee color palette from DESIGN.md (primary #7e5700, primary-container #ffb300, etc.) configured as CSS custom properties and exposed via Tailwind's `@theme inline` directive. Quicksand (display/headings) and Open Sans (body) fonts loaded via next/font/google with CSS variables. Root layout with Spanish lang and metadata. Minimal placeholder page. Honeycomb SVG pattern utility class (bg-honeycomb). Rounded corner tokens (sm 0.25rem through full 9999px).

**T02 — Database Layer**: @neondatabase/serverless and dotenv installed. lib/db.ts created with Neon sql helper — refactored to use lazy initialization (getDb()) to avoid DATABASE_URL validation during Next.js build module scanning. lib/schema.sql defines the 8-column items table (id SERIAL PK, nombre TEXT NOT NULL, que_es TEXT, url_imagen TEXT, url_elemento TEXT, estado TEXT DEFAULT 'disponible', reservado_por TEXT, creado_en TIMESTAMPTZ DEFAULT NOW()). .env.example documents DATABASE_URL, NOTION_TOKEN, NOTION_DATABASE_ID.

**T03 — Notion Seed Script**: scripts/seed-from-notion.ts created using @notionhq/client v5 with the new dataSources.query() API (replaces deprecated databases.query()). Fetches ~32 items with pagination, extracts properties handling bilingual names (Nombre/Name, Que es, URL de la imagen, URL del elemento). Inserts into Neon with per-item error handling. Package.json seed script: "tsx scripts/seed-from-notion.ts". Key finding: v5 uses dataSources.query() with result_type: 'page' and data_source_id, not database_id.

**T04 — API Route**: GET /api/items route created. Queries SELECT * FROM items ORDER BY id and returns { items: rows }. Try/catch wraps the query, returning { error, detail } with status 500 on failure. No caching or pagination (deferred to S02). Route correctly identified as dynamic (f) in build output.

## Operational Readiness (Q8)

- **Health signal**: GET /api/items returns status 200 with { items: [...] }. Build output shows the route as `f (Dynamic)` confirming server-side rendering on demand.
- **Failure signal**: GET /api/items returns status 500 with { error: "Failed to fetch items", detail: "<message>" } if DATABASE_URL is unset or Neon is unreachable.
- **Recovery**: Missing DATABASE_URL — set the env var and restart. Neon unreachable — check Neon console for status and connection string. Seed script failure — check NOTION_TOKEN and NOTION_DATABASE_ID, retry with npm run seed.
- **Monitoring gaps**: No structured logging or health check endpoint — deferred to S03 when the reservation flow adds observability.

## Verification

1. npm run build — successful (10.3s after lazy-init fix). Compiled successfully, TypeScript pass, static prerendering complete. Routes: / (static), /_not-found (static), /api/items (dynamic server-rendered).
2. npx tsc --noEmit --pretty — exit 0, zero TypeScript errors across the project.
3. All files confirmed present: app/api/items/route.ts, lib/db.ts, lib/schema.sql, scripts/seed-from-notion.ts, .env.example, app/layout.tsx, app/page.tsx, app/globals.css, postcss.config.mjs, next.config.ts, eslint.config.mjs.
4. Key gotcha found and fixed: lib/db.ts needed lazy initialization to avoid build-time DATABASE_URL validation failures.

## Requirements Advanced

- R006 — Created items schema and Notion seed script, ready to populate DB from the Notion catalog source of truth
- R008 — Schema includes estado column with default 'disponible' — per-item availability tracking baked into the data model
- R009 — url_elemento column stores external store URLs — catalog design does not assume a single store source

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

lib/db.ts was refactored from eager to lazy initialization (getDb() wrapper) to fix a Next.js build-time module import issue. This was not in the original task plan but was necessary for the build to succeed.

## Known Limitations

The seed script's dataSources.query() call uses a `as any` type cast because the v5 types for the query params are not fully exhaustive for the query() method signature. This is a known type friction in @notionhq/client v5 and does not affect runtime behavior.

## Follow-ups

S02 will consume the /api/items route to build the catalog page, which may add caching or pagination.

## Files Created/Modified

None.
