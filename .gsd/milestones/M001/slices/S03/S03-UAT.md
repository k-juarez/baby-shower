# S03: Reserva atómica y confirmación — UAT

**Milestone:** M001
**Written:** 2026-06-17T22:52:03.540Z

# S03: Reserva atómica y confirmación — UAT

**Milestone:** M001
**Written:** 2026-06-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: The reservation logic is fully exercised by 37 automated tests covering validation (client + server), atomicity, state machine transitions, and API response handling. The build compiles with zero errors. Frontend behavior (modal rendering, button visibility) requires browser verification.

## Preconditions

- Neon Postgres database seeded with items (S01)
- `DATABASE_URL` env var set
- Build passes (`npm run build`)

## Smoke Test

POST /api/reserve with valid { itemId: 1, guestName: "Test" } returns 200 with item data including estado='apartado'.

## Test Cases

### 1. Atomic reservation via API

1. POST /api/reserve with { itemId: 1, guestName: "Ana" } → 200, estado='apartado'
2. POST /api/reserve with { itemId: 1, guestName: "Luis" } → 409 Conflict
3. **Expected:** First caller reserves atomically; second caller gets conflict.

### 2. Input validation on client matches server

1. Empty name → client error "Tu nombre es obligatorio."
2. Whitespace-only name → same client error
3. >100 char name → "El nombre no debe exceder 100 caracteres."
4. 100-char name → accepted
5. **Expected:** Client and server validation rules agree on all 4 cases (verified by cross-check tests).

### 3. Modal state machine flows

1. Idle → click "Confirmar" → loading spinner appears
2. Loading → 200 response → success view with "¡Gracias, [name]!" and store link
3. Loading → 409 response → error view "Alguien más acaba de apartar este regalo"
4. Loading → fetch error → error view with "Intentar de nuevo" button
5. **Expected:** All 3 paths render correct UI (verified by state machine transition tests).

### 4. Catalog refresh after reservation

1. Modal closes after successful reservation
2. Catalog re-renders via router.refresh()
3. Reserved item now shows "🔒 Apartado" badge and disabled button
4. **Expected:** Catalog reflects DB state after modal close.

## Edge Cases

### Concurrent reservation for same item

1. Send 2 simultaneous POST /api/reserve calls with same itemId
2. One returns 200, the other returns 409
3. **Expected:** No double-booking possible (atomic UPDATE guarantees this at DB level).

### Name with leading/trailing whitespace

1. POST /api/reserve with { itemId: 1, guestName: "  Juan Pérez  " }
2. Server trims and reserves with name "Juan Pérez"
3. **Expected:** Whitespace trimmed before storage.

## Failure Signals

- POST /api/reserve returns 400 for invalid input (missing/hostile data)
- POST /api/reserve returns 409 for already-reserved or non-existent items
- POST /api/reserve returns 500 for DB errors (unreachable, query failure)
- Modal shows loading spinner, error message with retry button, or conflict message — never hangs

## Not Proven By This UAT

- Full browser rendering (modal positioning, scroll lock, responsive layout) — needs manual browser test
- Race condition under real simultaneous requests — verified at DB level but not under actual concurrent HTTP load
- Production deployment at dulce-espera-natalia.vercel.app — deferred to S05

## Notes for Tester

Run `npx tsx scripts/test-reserve.ts` and `npx tsx scripts/test-modal.ts` to verify all automated checks pass. Open /catalogo in browser, click "🐝 Yo lo regalo" on a Disponible item, enter name, confirm — verify confirmation screen with store link appears. Refresh catalog — item should show "🔒 Apartado". Try reserving the same item in another tab — should see conflict message.
