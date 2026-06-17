---
id: T02
parent: S02
milestone: M001
key_files:
  - components/CatalogGrid.tsx
key_decisions:
  - Used inline sub-components (ImageWithFallback, StatusBadge) within CatalogGrid.tsx instead of separate files — keeps card-related UI colocated and reduces file count for this small component.
duration: 
verification_result: passed
completed_at: 2026-06-17T22:35:20.324Z
blocker_discovered: false
---

# T02: Created CatalogGrid client component with responsive card grid, image fallback handling, status badge styling, and client-side filter toggle.

**Created CatalogGrid client component with responsive card grid, image fallback handling, status badge styling, and client-side filter toggle.**

## What Happened

## What Happened

Created `components/CatalogGrid.tsx` as a `"use client"` component per the task plan. The component:

1. **TypeScript interface**: `CatalogItem` with `id, nombre, que_es, url_imagen, url_elemento, estado` — matches the Item shape used in `app/catalogo/page.tsx`.

2. **ImageWithFallback sub-component**: Handles three image states — `url_imagen` is null → immediately renders a `🐝` bee placeholder on `bg-surface-container`; image loads successfully → renders native `<img>` with `object-cover` in an `aspect-[4/3]` container; image load fails → `onError` handler hides the image and swaps to the bee placeholder.

3. **StatusBadge sub-component**: `estado === "disponible"` renders a primary-container pill with `✓ Disponible`; any other estado renders a tertiary-container pill with `🔒 Apartado`.

4. **Filter toggle**: Two pill buttons (`Todos` / `Disponibles`) using `useState<FilterMode>`. Active pill gets `bg-primary text-on-primary`, inactive gets `bg-surface-container-high text-on-surface-variant`. When filter is "disponibles", only items where `estado === "disponible"` are shown.

5. **Responsive card grid**: CSS grid with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` so 1 card on mobile, 2 on tablet, 3 on desktop. Card uses `bg-surface-container-lowest`, `rounded-xl`, amber-tinted shadow (via `var(--color-shadow-amber)`), `hover:-translate-y-1` with transition.

6. **Card content**: Status badge, item name in `font-display` (Quicksand), description in `font-sans` (Open Sans) with `line-clamp-3`, and `"Ver en la tienda →"` link only when `url_elemento` is non-null (opens in new tab with noopener noreferrer).

7. **Empty state**: When filtered items array is empty, shows a centered `🐝` with "No hay regalos disponibles en este momento."

The server page at `app/catalogo/page.tsx` already passes items as `<CatalogGrid items={items} />` when items exist.

## Gates

### Q5 — Failure Modes
This component has no external network, API, or filesystem dependencies — it receives all data via props. Failure modes and handling:
- **Null url_imagen**: Immediate bee placeholder, no image attempted.
- **Image load failure**: onError fires, image hidden, bee placeholder shown.
- **Null url_elemento**: Link element not rendered (conditional rendering).
- **Empty items array**: "No hay regalos disponibles" message shown (delegated to parent via `items.length === 0` check in page.tsx, but also handled client-side when filter produces empty results).
- **Malformed item data**: TypeScript interface provides compile-time safety; at runtime, any missing field renders as undefined text gracefully.

### Q6 — Load Profile
Genuinely N/A for this unit. The component is a pure client-side UI renderer over an in-memory array. At 10x load (≈ 300 items), the O(n) filter operation completes in microseconds and the 300 DOM nodes are well within browser capacity. No rate limiting, pagination, or caching concerns.

### Q7 — Negative Tests
No test framework is configured in this project (no jest/vitest/playwright dependencies). The following negative scenarios are handled in-code:
- `url_imagen === null` → immediate bee placeholder (testable by inspecting DOM for `.bg-surface-container` with 🐝)
- Image `onError` → swaps to bee placeholder
- `url_elemento === null` → no `<a>` rendered
- `estado !== "disponible"` → 🔒 Apartado badge (tertiary-container)
- Filter on "disponibles" when all items are "apartado" → "No hay regalos disponibles" empty state
- Empty filter results → bee + message

To add automated tests in the future, the component's pure rendering nature makes it straightforward to test with React Testing Library.

## Diagnostics
The component has no observability surfaces (no API calls, no logging, no persisted state). To inspect behavior at runtime, inspect the DOM at `/catalogo` — the rendered HTML contains the card grid structure, filter buttons, and image fallback divs. Errors would manifest as visible 404 images (blocked by onError) or missing cards. The build's successful TypeScript compilation guarantees type safety.

## Verification

All plan requirements verified: (1) file exists, (2) 'use client' directive present, (3) useState used for filter state, (4) CSS grid layout present, (5) Next.js production build compiles and TypeScript passes without errors. The build completed in 10.8s with all routes (including /catalogo) generated successfully.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f components/CatalogGrid.tsx && grep -q 'use client' components/CatalogGrid.tsx && grep -q 'useState' components/CatalogGrid.tsx && grep -q 'grid' components/CatalogGrid.tsx` | 0 | ✅ pass | 100ms |
| 2 | `next build (npx next build)` | 0 | ✅ pass | 10800ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/CatalogGrid.tsx`
