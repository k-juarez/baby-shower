---
estimated_steps: 24
estimated_files: 1
skills_used: []
---

# T01: Created POST /api/reserve with atomic conditional UPDATE, testable validation helper, and 19 passing negative tests

Why: The reservation flow needs a backend endpoint that guarantees atomicity — no two guests can reserve the same item. The conditional UPDATE with WHERE estado = 'disponible' is the concurrency safety mechanism.

Do:
1. Create app/api/reserve/route.ts with a POST handler.
2. Validate input: itemId must be a positive integer, guestName must be a non-empty string after trimming.
3. Execute UPDATE items SET estado = 'apartado', reservado_por = $name WHERE id = $id AND estado = 'disponible' RETURNING *.
4. If UPDATE returns zero rows → 409 Conflict (item was already reserved or doesn't exist).
5. On success → 200 with { item: row } shape.
6. On validation failure → 400 with { error, detail }.
7. On DB error → 500 with { error, detail }.
8. Follow MEM007 conventions: success wraps single item under 'item' key; errors use { error, detail }.
9. Use try/catch around DB call; catch returns 500 with detail message.

Done when: The API endpoint file exists at app/api/reserve/route.ts with proper POST handler, input validation, atomic UPDATE, and appropriate HTTP status codes for all edge cases.

## Failure Modes (Q5)

| Dependency | On error | On timeout | On malformed response |
|------------|----------|-----------|----------------------|
| Neon DB (getDb) | Return 500 with detail message from Error object | Return 500 — Neon serverless driver throws on timeout | N/A — SQL template tag returns rows directly |

## Load Profile (Q6)

- Shared resources: Neon Postgres serverless (connection per invocation), single items table
- Per-operation cost: 1 SQL UPDATE query with RETURNING clause
- 10x breakpoint: Neon connection pool saturation at high concurrency — acceptable for <100 guests, one-time event. Atomic WHERE clause prevents double-booking even under load.

## Negative Tests (Q7)

- Malformed inputs: missing itemId → 400, missing guestName → 400, empty guestName after trim → 400, guestName > 100 chars → 400, itemId as string "abc" → 400
- Error paths: DB unreachable → 500 with detail, already-reserved item → 409 with error message
- Boundary conditions: itemId=0 → 400 (not positive), itemId=999999 (non-existent) → 409 (no rows updated), guestName with leading/trailing whitespace → trimmed before DB write

## Inputs

- `lib/db.ts`

## Expected Output

- `app/api/reserve/route.ts`

## Verification

test -f app/api/reserve/route.ts

## Observability Impact

Adds POST /api/reserve endpoint with structured error responses: 400 for validation (missing/invalid itemId or guestName), 409 for conflict (already reserved or non-existent item), 500 for DB failures with detail message. All responses follow { error, detail } error shape and { item: row } success shape per MEM007 conventions.
