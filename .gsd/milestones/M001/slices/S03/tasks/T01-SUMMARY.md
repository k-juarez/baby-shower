---
id: T01
parent: S03
milestone: M001
key_files:
  - app/api/reserve/route.ts
  - lib/reserve-validate.ts
  - scripts/test-reserve.ts
key_decisions:
  - Extracted reservation validation into lib/reserve-validate.ts as a pure testable function separate from the route handler
duration: 
verification_result: passed
completed_at: 2026-06-17T22:47:06.787Z
blocker_discovered: false
---

# T01: Created POST /api/reserve with atomic conditional UPDATE, testable validation helper, and 19 passing negative tests

**Created POST /api/reserve with atomic conditional UPDATE, testable validation helper, and 19 passing negative tests**

## What Happened

Created app/api/reserve/route.ts with a POST handler that atomically reserves items via conditional UPDATE (WHERE estado='disponible'). Input validation was extracted into lib/reserve-validate.ts as a pure function for independent testability. The endpoint handles: 400 for malformed JSON or validation failures (missing/invalid itemId, missing/empty/too-long guestName), 409 for already-reserved or non-existent items, and 500 for database errors. Created scripts/test-reserve.ts with 19 tests covering all negative and positive cases. Error responses use { error, detail } (MEM007 convention), success returns { item: row }.

## Q5 — Failure Modes
External dependencies: Neon DB (via lib/db.ts getDb()). Failure paths: DB unreachable/query timeout → catches Error in the outer try/catch, returns 500 with { error: 'Database error', detail: <message> }. Malformed JSON body → inner try/catch returns 400 with { error: 'Invalid request body', detail: 'Request body must be valid JSON' }. No other external dependencies (validation is pure function).

## Q6 — Load Profile
Shared resource: Neon Postgres serverless (connection per invocation), single items table. Per-operation cost: 1 SQL UPDATE query with RETURNING clause. 10x breakpoint: Neon connection pool saturation at high concurrency — acceptable for a baby shower with <100 guests in one-time event. Atomic WHERE (estado='disponible') prevents double-booking even under load regardless of connection count.

## Q7 — Negative Tests
All implemented in scripts/test-reserve.ts (19 tests, all pass): Missing itemId, null itemId, itemId as string "abc", float itemId (3.14), itemId=0, negative itemId (-1). Missing guestName, null guestName, guestName as number (123), empty string name, whitespace-only name, name >100 chars. Positive tests: valid itemId=1 with guestName="Ana María", whitespace trimming, 100-char boundary accepted.

## Verification

TypeScript compiles cleanly (npx tsc --noEmit --pretty — 0 errors). All 19 negative and positive tests pass (npx tsx scripts/test-reserve.ts — 19/19). File exists at app/api/reserve/route.ts.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit --pretty` | 0 | ✅ pass | 2463ms |
| 2 | `npx tsx scripts/test-reserve.ts` | 0 | ✅ pass | 778ms |
| 3 | `test -f app/api/reserve/route.ts` | 0 | ✅ pass | 10ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/api/reserve/route.ts`
- `lib/reserve-validate.ts`
- `scripts/test-reserve.ts`
