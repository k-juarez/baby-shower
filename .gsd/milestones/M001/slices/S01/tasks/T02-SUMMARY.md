---
id: T02
parent: S01
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-17T22:18:14.063Z
blocker_discovered: false
---

# T02: Installed @neondatabase/serverless and dotenv, created lib/db.ts with Neon sql helper, lib/schema.sql with items table (8 columns), and .env.example documenting required env vars.

**Installed @neondatabase/serverless and dotenv, created lib/db.ts with Neon sql helper, lib/schema.sql with items table (8 columns), and .env.example documenting required env vars.**

## What Happened

Executed the setup task for the Neon Postgres connection and schema. Steps completed:

1. **Dependency installation**: Installed `@neondatabase/serverless` and `dotenv` via npm. The `dotenv` package is included for the upcoming Notion seed script (run with tsx outside Next.js context where .env loading isn't automatic).

2. **lib/db.ts**: Created a database utility module that imports `neon` from `@neondatabase/serverless`, validates DATABASE_URL is set with a descriptive error message at import time, creates the `sql` template tag helper, and exports it. The module throws immediately if DATABASE_URL is missing — fail-fast configuration validation.

3. **lib/schema.sql**: Created the items table DDL with 8 columns (id SERIAL PK, nombre TEXT NOT NULL, que_es TEXT, url_imagen TEXT, url_elemento TEXT, estado TEXT with default 'disponible', reservado_por TEXT, creado_en TIMESTAMPTZ with default NOW()). Uses CREATE TABLE IF NOT EXISTS for idempotent application.

4. **.env.example**: Documented three required environment variables with comments explaining where to obtain each one (DATABASE_URL, NOTION_TOKEN, NOTION_DATABASE_ID).

**Quality Gate Analysis:**
- **Q5 Failure Modes**: This task has two external dependencies — (1) DATABASE_URL env var: missing → lib/db.ts throws a descriptive error at import time; (2) Neon Postgres network connection: timeout/auth failure → the @neondatabase/serverless driver propagates the native fetch error at query time. Both failure paths are addressed: missing config fails fast with a clear message, network failures bubble naturally.
- **Q6 Load Profile**: This is a pure setup task with no runtime load dimension. The lib/db.ts module creates only a configured sql helper at import time — no queries, no connections, no resources consumed until a function is called. The 10x load scenario applies to the API routes that use this helper, not to this setup task.
- **Q7 Negative Tests**: This task has minimal negative surface — the only error path is a missing DATABASE_URL, which is already handled by an explicit guard in lib/db.ts. No test framework is set up in the project yet; adding one for this single check would be disproportionate.

## Verification

Three verification checks passed: (1) npm install completed with exit 0, adding @neondatabase/serverless and dotenv. (2) Full project TypeScript check (`npx tsc --noEmit`) passed with exit 0, confirming lib/db.ts parses correctly with its imports. (3) `npm run build` completed successfully with exit 0, confirming the module integrates with the Next.js build pipeline — compiled in 2s with TypeScript pass, static prerendering complete. All three output files (lib/db.ts, lib/schema.sql, .env.example) confirmed present on disk.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm install @neondatabase/serverless dotenv` | 0 | ✅ pass | 6000ms |
| 2 | `npx tsc --noEmit` | 0 | ✅ pass | 3000ms |
| 3 | `npm run build` | 0 | ✅ pass | 4000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
