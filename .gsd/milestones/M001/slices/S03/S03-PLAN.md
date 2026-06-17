# S03: Reserva atómica y confirmación

**Goal:** Clicking "Yo lo regalo" on any Disponible item opens a modal. Guest enters name, confirms, and reservation is atomic (conditional UPDATE). Confirmation screen shows thank-you message with store link. Post-reservation, catalog reflects updated status so no two guests can reserve the same gift.
**Demo:** Clicking 'Yo lo regalo' on any Disponible item opens a modal. Guest enters name, confirms, and the reservation is atomic (conditional UPDATE). Confirmation screen shows thank-you message and link to store.

## Must-Haves

- POST /api/reserve accepts { itemId, guestName } and atomically reserves the item via conditional UPDATE (WHERE estado = 'disponible')
- Concurrent reservations for the same item are rejected with 409 Conflict (UPDATE returns zero rows)
- Guest name is validated: non-empty after trim, max 100 characters
- "Yo lo regalo" button appears on Disponible item cards at the bottom of each card
- Reservation modal opens with item name/image shown, name text input, and "Confirmar que lo regalaré" button
- Loading state (spinner + disabled button) shown while API call is in progress
- Successful reservation shows warm confirmation view with thank-you message and "Ir a la tienda para comprarlo →" external link button
- Already-reserved items show error message "Alguien más acaba de apartar este regalo" with close button
- Closing modal after successful reservation triggers page reload so catalog reflects updated estado
- Build succeeds with zero TypeScript errors

## Proof Level

- This slice proves: integration

## Integration Closure

Upstream surfaces consumed: lib/db.ts (lazy-init getDb helper), components/CatalogGrid.tsx (S02 — card grid with StatusBadge, ImageWithFallback, filter toggle), app/globals.css (Honey Bee design tokens, honeycomb pattern), app/layout.tsx (font config, Spanish lang).

New wiring introduced:
- app/api/reserve/route.ts — POST handler with atomic conditional UPDATE against Neon DB
- components/ReservationModal.tsx — client component with idle/loading/success/error state machine
- components/CatalogGrid.tsx modification — "Yo lo regalo" button in card footer, modal open/close integration

What remains before milestone is truly usable end-to-end: S04 (landing page at / with welcome + CTA) and S05 (deploy to Vercel at dulce-espera-natalia.vercel.app).

## Verification

- POST /api/reserve returns structured error responses: 400 for validation failures ({ error, detail }), 409 for conflict ({ error, detail }), 500 for DB errors ({ error, detail }). ReservationModal surfaces all failure paths visually — loading spinner during API call, error message for already-reserved items, graceful empty/error states. Post-reservation page refresh ensures catalog stays in sync with DB state. No structured logging; errors are surfaced in API responses for diagnosis.

## Tasks

- [x] **T01: Created POST /api/reserve with atomic conditional UPDATE, testable validation helper, and 19 passing negative tests** `est:30m`
  Why: The reservation flow needs a backend endpoint that guarantees atomicity — no two guests can reserve the same item. The conditional UPDATE with WHERE estado = 'disponible' is the concurrency safety mechanism.
  - Files: `app/api/reserve/route.ts`
  - Verify: test -f app/api/reserve/route.ts

- [x] **T02: Built ReservationModal with four-state UI machine and wired Yo lo regalo button into CatalogGrid cards, with 18 passing negative tests and zero-error build** `est:60m`
  Why: Guests need a warm, intuitive UI to reserve gifts — a modal that captures their name, calls the atomic reservation API, and shows a confirmation with store redirect. The CatalogGrid must be extended with the "Yo lo regalo" button.
  - Files: `components/ReservationModal.tsx`, `components/CatalogGrid.tsx`
  - Verify: npm run build

## Files Likely Touched

- app/api/reserve/route.ts
- components/ReservationModal.tsx
- components/CatalogGrid.tsx
