# S02: Catálogo de regalos con datos reales

**Goal:** Create the /catalogo page displaying real items from the Neon database in a responsive card grid. Each card shows the item image (with fallback), name, description, and status badge (Disponible/Apartado). A pill-toggle filter switches between "Todos" and "Disponibles". The page uses the Honey Bee design tokens, honeycomb decorative background, and Spanish copy throughout.
**Demo:** Catalog page at `/catalogo` displaying real items from DB in a responsive card grid. Cards show image, name, description, status badge (Disponible/Apartado). Filter toggle for Disponibles/Todos works.

## Must-Haves

- [ ] `/catalogo` route renders a server component that queries real items from the DB
- [ ] Responsive card grid: 1 column on mobile, 2 on md, 3 on lg
- [ ] Each card displays: image (or fallback placeholder when missing/broken), item name (Quicksand), description (Open Sans), status badge (Disponible in primary-container / Apartado in tertiary-container)
- [ ] "Ver en la tienda" external link on each card opens url_elemento in a new tab
- [ ] Filter toggle pills ("Todos" / "Disponibles") with active state — filtering is instant client-side
- [ ] Cards have soft amber-tinted shadows and hover translate-y effect
- [ ] Page header has honeycomb decorative background and Spanish title/description
- [ ] `npm run build` succeeds with zero TypeScript errors
- [ ] Spanish copy throughout — warm, festive tone matching R010

## Proof Level

- This slice proves: integration

## Integration Closure

Upstream surfaces consumed: lib/db.ts (lazy-init SQL helper), app/globals.css (Honey Bee tokens, honeycomb pattern), app/layout.tsx (fonts, metadata, Spanish lang). New wiring: app/catalogo/page.tsx (server component DB query), components/CatalogGrid.tsx (client component with filter state). What remains: S03 (reservation modal + atomic UPDATE), S04 (landing page), S05 (Vercel deploy).

## Verification

- The catalog page is server-rendered — if DB is unreachable, Next.js shows the error page. Image loading failures are handled gracefully with a CSS fallback placeholder. No new API routes or observability surfaces added beyond the existing /api/items endpoint.

## Tasks

- [x] **T01: Created /catalogo server-rendered page shell with Neon DB data query, honeycomb header, CatalogGrid passthrough, and empty-state fallback** `est:30m`
  Create the catalog page server component at app/catalogo/page.tsx. This is a Next.js App Router server component that queries the Neon database directly using the existing lazy-init db.ts helper (SELECT * FROM items ORDER BY id), renders the page chrome (honeycomb background, Spanish title "Mesa de Regalos", warm description text), and passes the items array to the CatalogGrid client component. Also add page metadata (title, description) via Next.js Metadata API.
  - Files: `app/catalogo/page.tsx`
  - Verify: test -f app/catalogo/page.tsx && grep -q '@/lib/db' app/catalogo/page.tsx && grep -q 'CatalogGrid' app/catalogo/page.tsx

- [ ] **T02: Build CatalogGrid client component with cards and filter** `est:45m`
  Create components/CatalogGrid.tsx as a client component ("use client") that receives an items array and renders the responsive gift card grid with a filter toggle. Each card shows the item image (using native <img> with fallback to a honey-themed placeholder div when url_imagen is null or the image fails to load), item name in Quicksand display font, description (que_es) in Open Sans body font, a status badge pill (Disponible: primary-container bg with ✓, Apartado: tertiary-container bg with 🔒), and a "Ver en la tienda →" link that opens url_elemento in a new tab with rel="noopener noreferrer".
  - Files: `components/CatalogGrid.tsx`
  - Verify: test -f components/CatalogGrid.tsx && grep -q 'use client' components/CatalogGrid.tsx && grep -q 'useState' components/CatalogGrid.tsx && grep -q 'grid' components/CatalogGrid.tsx

## Files Likely Touched

- app/catalogo/page.tsx
- components/CatalogGrid.tsx
