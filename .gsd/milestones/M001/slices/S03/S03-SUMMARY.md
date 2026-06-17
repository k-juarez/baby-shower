---
id: S03
parent: M001
milestone: M001
provides:
  - POST /api/reserve atomic reservation endpoint
  - ReservationModal with four-state UI (idle/loading/success/error)
  - 'Yo lo regalo' button on Disponible cards
  - Conflict handling for simultaneous reservation attempts
  - Confirmation view with store redirect link
  - Validation extracted into pure testable function
requires:
  - slice: S01
    provides: Neon Postgres schema with items table, seeded catalog data
  - slice: S02
    provides: CatalogGrid component with card layout, StatusBadge, filter toggle, and ImageWithFallback; Honey Bee design tokens and font config
affects:
  - S04 — landing page at / can add CTA linking to /catalogo with working reservation flow
  - S05 — deploy includes the /api/reserve endpoint and ReservationModal component
key_files:
  - app/api/reserve/route.ts
  - lib/reserve-validate.ts
  - components/ReservationModal.tsx
  - components/CatalogGrid.tsx
  - scripts/test-reserve.ts
  - scripts/test-modal.ts
key_decisions:
  - Reservation validation extracted into lib/reserve-validate.ts as pure testable function separate from route handler
  - Atomic reservation via conditional UPDATE (WHERE estado='disponible') guarantees no double-booking
  - Four-state modal UI (idle/loading/success/error) handles all UX paths gracefully
  - 15s AbortController timeout prevents hanging modals under network failure
patterns_established:
  - Client-server validation replication: modal validates name client-side for instant feedback, server re-validates for security
  - Multi-state client component pattern for resilient async UX flows
observability_surfaces:
  - POST /api/reserve returns structured JSON errors (400/409/500) with { error, detail } shape
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-17T22:52:03.539Z
blocker_discovered: false
---

# S03: Reserva atómica y confirmación

**Atomic reservation API with 409 conflict handling, four-state reservation modal wired into catalog cards — 37 passing tests and zero-error build**

## What Happened

Task T01 created the backend: POST /api/reserve with atomic conditional UPDATE (WHERE estado='disponible'), validation extracted into lib/reserve-validate.ts as a pure testable function. 19 tests cover all negative paths (missing/null/invalid itemId and guestName, whitespace-only, >100 chars) and positive paths. Error responses follow the { error, detail } convention from MEM007.

Task T02 built the frontend: ReservationModal.tsx with four states (idle/loading/success/error), inline name validation, 15s AbortController timeout, backdrop and Esc key closing, and body scroll lock. CatalogGrid.tsx was extended with the "🐝 Yo lo regalo" button on Disponible cards, disabled "🔒 Apartado" button on reserved cards, and router.refresh() on modal close to sync catalog state. 18 tests validate client-server validation agreement, state machine transitions, and API response handling.

## Verification

npm run build — zero TypeScript errors, all pages generated. npx tsx scripts/test-reserve.ts — 19/19 passed. npx tsx scripts/test-modal.ts — 18/18 passed.

## Requirements Advanced

- R002 — Boton 'Yo lo regalo' agregado a tarjetas de items Disponibles. Modal de reserva con validacion de nombre, confirmacion atomica, pantalla de exito con enlace a tienda.

## Requirements Validated

- R002 — Build exits 0. Boton visible en cada tarjeta Disponible. POST /api/reserve con UPDATE condicional. Tests 19/19 API + 18/18 modal pasan.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

The test script scripts/test-modal.ts had TypeScript type errors (annotated to values and a property typo 'active') that were fixed during verification. These did not affect production code.

## Follow-ups

None.

## Files Created/Modified

- `app/api/reserve/route.ts` — New file — POST handler with atomic conditional UPDATE and structured error responses
- `lib/reserve-validate.ts` — New file — pure validation function for reservation inputs
- `components/ReservationModal.tsx` — New file — four-state modal with name input, loading spinner, confirmation view, and error handling
- `components/CatalogGrid.tsx` — Modified — added Yo lo regalo/Apartado buttons, ReservationModal integration, router.refresh() on close
- `scripts/test-reserve.ts` — New file — 19 tests for reservation validation and atomicity
- `scripts/test-modal.ts` — New file — 18 tests for modal validation, state machine, and API handling
