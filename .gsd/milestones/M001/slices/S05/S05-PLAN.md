# S05: Deploy a Vercel

**Goal:** Site live at dulce-espera-natalia.vercel.app with full guest flow working in production: landing → catalog → reserve → confirmation → store redirect.
**Demo:** Site live at dulce-espera-natalia.vercel.app. Full guest flow works in production: landing → catalog → reserve → confirmation → store redirect.

## Must-Haves

- `npm run build` exits 0 with zero TypeScript errors
- Vercel CLI authenticated and project linked
- DATABASE_URL set as production environment variable on Vercel
- `vercel --prod` deploys successfully to dulce-espera-natalia.vercel.app
- Landing page (/) loads with bee theme and CTA to /catalogo
- Catalog page (/catalogo) displays items from production Neon database
- API /api/items returns `{ items: [...] }` JSON
- API /api/reserve responds to POST requests with proper validation
- Full guest flow confirmed: landing → catalog → reserve modal → confirmation → store link

## Proof Level

- This slice proves: final-assembly

## Integration Closure

Upstream surfaces consumed: app/layout.tsx (root layout with fonts and metadata), app/page.tsx (landing page), app/catalogo/page.tsx (catalog with DB query), app/api/items/route.ts (items API), app/api/reserve/route.ts (reservation API), lib/db.ts (lazy Neon connection), lib/reserve-validate.ts (validation), components/CatalogGrid.tsx (card grid with reservation modal), components/ReservationModal.tsx (four-state modal), lib/schema.sql (DB schema).

New wiring introduced in this slice: Vercel project configuration (vercel link, env vars), production deployment via `vercel --prod`, production verification script.

This is the final assembly slice — after deploy, the milestone is truly usable end-to-end at the public URL.

## Verification

- Runtime signals: production HTTP responses at dulce-espera-natalia.vercel.app. Vercel provides deployment logs, build output, and runtime logs via `vercel logs`. Neon Postgres query metrics available in Neon console.
- Inspection surfaces: Production URL for HTTP checks, Vercel dashboard for deploy status and env vars, `vercel logs` CLI for runtime errors, `/api/items` for DB connectivity check.
- Failure visibility: HTTP status codes (500 for DB errors, 409 for reservation conflicts), structured error responses `{ error, detail }`, Vercel serverless function logs.

## Tasks

- [x] **T01: Verified Next.js build, confirmed Vercel auth and user k-juarez, linked Vercel project dulce-espera-natalia — blocked on missing DATABASE_URL to set in Vercel production environment** `est:30m`
  Why: Before deploying, the project must build cleanly and the Vercel project must be configured with the required DATABASE_URL environment variable so the Neon Postgres connection works in production.
  - Files: `package.json`
  - Verify: npm run build

- [x] **T02: Seeded 32 catalog items from Notion baby shower registry into production Neon database** `est:30m`
  Why: This is the final assembly task — deploy the app to Vercel production and verify the complete guest flow works on the public internet, proving the milestone is truly done.
  - Files: `scripts/verify-deploy.ts`
  - Verify: npx tsx scripts/verify-deploy.ts

## Files Likely Touched

- package.json
- scripts/verify-deploy.ts
