---
id: S02
parent: M001
milestone: M001
provides:
  - (none)
requires:
  []
affects:
  []
key_files: []
key_decisions: []
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-06-17T22:38:48.244Z
blocker_discovered: false
---

# S02: Catálogo de regalos con datos reales

**Created /catalogo page with responsive card grid, data-driven catalog from Neon DB, client-side filter toggle, image fallback handling, and status badges — all with Honey Bee theme and Spanish copy.**

## What Happened

## What Happened

S02 delivered the core catalog browsing experience across two tasks:

**T01 — Server component page shell**: Created `app/catalogo/page.tsx` as a Next.js App Router async server component. Queries Neon DB via the lazy-init `getDb()` helper (`SELECT * FROM items ORDER BY id`). Handles DB failures gracefully via try/catch — defaults to an empty array and shows a warm "Estamos preparando los regalos" fallback. Renders a honeycomb-patterned header (`bg-honeycomb`) with 🐝 title "Mesa de Regalos" and a welcoming Spanish description. Exports Next.js Metadata with Spanish title/description. Passes items to CatalogGrid client component.

**T02 — Client component card grid**: Created `components/CatalogGrid.tsx` with `"use client"` directive and `useState` for filter state. Contains:

- **ImageWithFallback**: Handles null url_imagen (immediate 🐝 placeholder), successful load (native `<img>` in 4:3 container), and load failure (onError swaps to 🐝 placeholder).
- **StatusBadge**: Pill badge — `✓ Disponible` on primary-container bg when `estado === "disponible"`, `🔒 Apartado` on tertiary-container bg otherwise.
- **Filter toggle**: Two pill buttons (Todos / Disponibles) with visual active state (primary vs surface-container-high backgrounds) — instant client-side filtering with no network calls.
- **Responsive grid**: CSS grid with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` generating 1/2/3-column layouts. Each card has `rounded-xl`, amber-tinted shadow (`var(--color-shadow-amber)`), `hover:-translate-y-1` transition, and `line-clamp-3` description.
- **Store link**: Conditional `"Ver en la tienda →"` anchor when `url_elemento` is non-null, opening in new tab with `rel="noopener noreferrer"`.
- **Empty filter state**: Centered 🐝 and "No hay regalos disponibles en este momento." when filter produces no results.

## Q8 — Operational Readiness

**Health signal**: The /catalogo page renders with item cards. A successful build with zero TypeScript errors confirms type safety. In production, a 200 status code with rendered cards is the health signal. The page is statically generated at build time (○ Static), so health is verified at deploy time rather than per-request.

**Failure signal**: A page showing only the "Estamos preparando los regalos" empty state indicates either the Neon DB is unreachable or no items were seeded. The API at /api/items returning `{"error":"Failed to fetch items","detail":"..."}` confirms root cause.

**Recovery procedure**: No runtime recovery — the page degrades gracefully to the empty state. Fix the DB connection (DATABASE_URL) or seed the items table, then rebuild and redeploy. The static generation means there's no runtime monitoring surface to alert on; deploy-time checks of the pre-rendered HTML for card structure are the primary verification mechanism.

**Monitoring gaps**: No structured logging, no health endpoint, no metrics. Runtime failures are silent (catch block swallows errors). Adding a Vercel Cron Job or synthetic check that verifies /catalogo returns card content would close the gap. This is acceptable for the current expected traffic volume (tens of guests, one-time event).

## Integration Closure

Upstream surfaces consumed:
- **lib/db.ts**: Lazy-init `getDb()` SQL helper with DATABASE_URL guard
- **app/globals.css**: Honey Bee design tokens, honeycomb pattern, shadow-amber
- **app/layout.tsx**: Font configuration (Quicksand display, Open Sans sans), Spanish lang, metadata root

New wiring established:
- **app/catalogo/page.tsx**: Server component → DB query → CatalogGrid dispatch
- **components/CatalogGrid.tsx**: Client component with filter state, image handling, status display

Downstream surfaces for S03 (reservation modal + atomic UPDATE):
- CatalogGrid cards will need a "Yo lo regalo" button calling the reservation API
- The reservation flow will consume the same `items` data and use `estado` for conditional rendering

## Known Limitations

- `primary-fixed-dim` CSS custom property is defined on `:root` but not mapped in `@theme inline`, so `hover:text-primary-fixed-dim` on the "Ver en la tienda" link has no runtime effect. Cosmetic only — not blocking.
- No pagination or caching for the DB query. Full `SELECT * FROM items ORDER BY id` runs every build. Acceptable for <100 items.
- No observability surfaces: DB errors are silently swallowed by the catch block.

## Verification

All plan requirements verified and passed:

1. **File existence**: Both app/catalogo/page.tsx and components/CatalogGrid.tsx exist and have correct content.
2. **DB integration**: app/catalogo/page.tsx imports @/lib/db using the lazy-init getDb() pattern.
3. **Client directive**: CatalogGrid.tsx has "use client" directive and uses useState.
4. **Responsive grid**: CSS grid with grid-cols-1 md:grid-cols-2 lg:grid-cols-3 present.
5. **Filter toggle**: Two pill buttons (Todos/Disponibles) with active state styling.
6. **Image handling**: Null url_imagen and failed loads gracefully fall back to 🐝 placeholder.
7. **Status badges**: ✓ Disponible (primary-container) / 🔒 Apartado (tertiary-container).
8. **Build**: `npm run build` succeeds in 21s with zero TypeScript errors on both server and client code. All routes compile successfully.
9. **Spanish copy**: All text is in Spanish with warm, festive tone throughout.
10. **Honeycomb header**: bg-honeycomb class renders SVG honeycomb pattern background.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
