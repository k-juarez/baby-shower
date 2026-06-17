---
estimated_steps: 24
estimated_files: 2
skills_used: []
---

# T02: Built ReservationModal with four-state UI machine and wired Yo lo regalo button into CatalogGrid cards, with 18 passing negative tests and zero-error build

Why: Guests need a warm, intuitive UI to reserve gifts — a modal that captures their name, calls the atomic reservation API, and shows a confirmation with store redirect. The CatalogGrid must be extended with the "Yo lo regalo" button.

Do:
1. Create components/ReservationModal.tsx as a "use client" component with state machine: idle (name input + "Confirmar que lo regalaré" button), loading (spinner + disabled button), success (thank-you message with "Ir a la tienda para comprarlo →" external link styled as primary button), error ("Alguien más acaba de apartar este regalo" message with "Entendido" close button).
2. Modal backdrop: semi-transparent dark overlay, centered white card with rounded-xl, max-w-md, closeable via backdrop click or Esc key.
3. Name input: text field with label "Tu nombre", placeholder "Escribe tu nombre", min 1 char after trim, max 100 chars. Show validation error inline if empty on submit.
4. On confirm: POST to /api/reserve with { itemId, guestName }. Show loading state during request. On 200 → transition to success view. On 409 → transition to error view. On 4xx/5xx → show generic error with retry.
5. Success view: display "¡Gracias, [name]! 🎉" heading, warm message about Natalia's arrival, the item name, and prominent "Ir a la tienda para comprarlo →" button (external link in new tab) plus "Volver al catálogo" secondary button.
6. Add "Yo lo regalo" button to CatalogGrid card footer for Disponible items: full-width at card bottom, primary-container bg with hover effect, icon 🐝 + "Yo lo regalo" text. Disabled/hidden for Apartado items.
7. Wire CatalogGrid to manage modal open/close state: track which item is being reserved, open modal on "Yo lo regalo" click, close modal on success/error dismissal.
8. On modal close after successful reservation, call router.refresh() so catalog re-fetches from server and reflects updated estado. Import useRouter from next/navigation.
9. All copy in Spanish with warm festive tone. Use design tokens: font-display for headings, font-sans for body, primary/primary-container colors, rounded-xl, shadow-amber.

Done when: Full flow works — click "Yo lo regalo" → modal opens with item info → enter name → confirm → loading → success confirmation with store link OR error for already-reserved. Build succeeds with zero TypeScript errors.

## Failure Modes (Q5)

| Dependency | On error | On timeout | On malformed response |
|------------|----------|-----------|----------------------|
| /api/reserve (fetch) | Show error message in modal with "Intentar de nuevo" option | Show "Tardando más de lo esperado..." message, allow retry | Show generic error — if response is not valid JSON, treat as network error |

## Load Profile (Q6)

- Shared resources: None client-side — each reservation is a single fetch to /api/reserve
- Per-operation cost: 1 HTTP POST, 1 DB UPDATE (server-side)
- 10x breakpoint: N/A — client-side is per-guest, not pooled. Server-side bottleneck is Neon connection pool (covered in T01)

## Negative Tests (Q7)

- Malformed inputs: empty name → validation error shown inline, whitespace-only name → validation error, name > 100 chars → validation error
- Error paths: API returns 409 → "ya apartado" error state, API returns 500 → generic error with retry, network failure → generic error, non-JSON response → generic error
- Boundary conditions: modal open with no item → should not render (guard clause), rapid double-click on "Yo lo regalo" → button disabled during loading state

## Inputs

- `components/CatalogGrid.tsx`
- `app/api/reserve/route.ts`
- `app/globals.css`

## Expected Output

- `components/ReservationModal.tsx`
- `components/CatalogGrid.tsx`

## Verification

npm run build

## Observability Impact

ReservationModal exposes a four-state UI machine (idle/loading/success/error) with visual feedback for every transition. All failure paths surface inline — validation errors appear below the name input, API errors render in the modal body with retry options. CatalogGrid refreshes via router.refresh() after successful reservation so catalog always reflects DB state. No console.error logging in production; errors are user-facing in the modal.
