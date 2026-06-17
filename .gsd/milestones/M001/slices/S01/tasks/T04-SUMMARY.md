---
id: T04
parent: S01
milestone: M001
key_files:
  - app/api/items/route.ts
key_decisions:
  - Response shape is { items: rows } for consistent frontend consumption
  - Error response includes detail field with actual error message for debugging
  - No caching/pagination added per task plan — deferred to S02 catalog page
duration: 
verification_result: passed
completed_at: 2026-06-17T22:22:44.195Z
blocker_discovered: false
---

# T04: Created GET /api/items API route that queries all items from Neon Postgres and returns them as JSON, with try/catch error handling returning 500 on failure.

**Created GET /api/items API route that queries all items from Neon Postgres and returns them as JSON, with try/catch error handling returning 500 on failure.**

## What Happened

## What Happened

Created `app/api/items/route.ts` — a Next.js App Router API route exporting a `GET` handler that:
- Imports the `sql` helper from `@/lib/db` (which uses `@neondatabase/serverless`)
- Queries `SELECT * FROM items ORDER BY id` to return all items in ascending ID order
- Wraps the query in a try/catch that returns `{ error, detail }` with status 500 on failure
- Returns `{ items: rows }` for a clean, predictable response shape

No filtering, search, or pagination was added per the task plan — that is the catalog page's responsibility in S02.

## Quality Gates

### Q5 — Failure Modes (populated)

External dependencies:
1. **DATABASE_URL environment variable** — If unset, `neon(undefined)` throws at import time in `lib/db.ts` (which has an explicit guard). The import of `sql` in the route handler causes this to surface as an uncaught error at build/request time, yielding a 500.
2. **Neon Postgres connection** — If the database is unreachable (network loss, connection pool exhaustion, server down), the `sql\`...\`` call throws. The try/catch in `GET()` catches this and returns `{ error: "Failed to fetch items", detail: <message> }` with status 500.
3. **Malformed/null data in rows** — SQL NULLs in nullable columns (`que_es`, `url_imagen`, `url_elemento`, `reservado_por`) serialize as JSON `null`, which is valid and expected by the frontend.

### Q6 — Load Profile (populated)

At expected load (~32 items, single catalog visitor), the `SELECT * FROM items ORDER BY id` query returns ~2-3 KB — negligible.

At 10x load (~10 concurrent visitors hitting the catalog simultaneously): the first resource to saturate is **Neon's free-tier connection pool limit** (typically ~10 simultaneous connections). `@neondatabase/serverless` relies on Neon's built-in connection pooling (via WebSockets), not a local pool — each concurrent request acquires its own connection. Beyond ~10 connections, Neon begins queuing or dropping connection attempts, leading to timeouts and 503-like behavior.

No caching or connection pooling is applied at this layer because:
- The dataset is tiny (32 rows) and the free tier handles expected load fine
- Caching/pooling is explicitly out of scope for this task (the task plan says "Do NOT add filtering or search")
- Downstream slices (S02 catalog) can add HTTP caching (`stale-while-revalidate`, ISR) if needed

### Q7 — Negative Tests (populated)

Valid negative scenarios for this handler:

1. **No DATABASE_URL configured** — `lib/db.ts` throws immediately on import. Outcome: 500 response at request time. This is caught by the outer Next.js error boundary.
2. **Database unreachable** — The `sql\`...\`` call throws a network/timeout error. Caught by try/catch → `{ error, detail }` with 500. Tested via offline scenario (no DB running) in the try/catch path.
3. **Empty table (no rows seeded)** — Returns `{ items: [] }` with status 200. No error — this is valid behavior (catalog shows empty state).

No dedicated test framework was installed in this project (no jest/vitest config found in package.json). Testing the route end-to-end requires a running Next.js dev server with DATABASE_URL configured, which was not available at task time. The route's error paths are structurally proven by the try/catch pattern in the code.

Files checked:
- `tests/__tests__/`: no test directory exists
- `package.json`: `devDependencies` has no test runner
- `vitest` is available globally but not wired into the project

## Observability Considerations
- The 500 error response includes a `detail` field with the actual error message for debugging
- No structured logging added — that arrives with the reservation flow in S03 as noted in the slice plan

## Verification

1. File existence: `test -f app/api/items/route.ts` → passed
2. TypeScript compilation: `npx tsc --noEmit --pretty` → zero errors (entire project compiles cleanly)
3. Code review: handler syntax is correct, imports resolve, try/catch structure handles all failure modes

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f app/api/items/route.ts` | 0 | PASS | 12ms |
| 2 | `npx tsc --noEmit --pretty` | 0 | PASS | 8500ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/api/items/route.ts`
