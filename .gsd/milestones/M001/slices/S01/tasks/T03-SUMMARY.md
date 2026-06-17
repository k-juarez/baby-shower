---
id: T03
parent: S01
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-17T22:21:05.226Z
blocker_discovered: false
---

# T03: Created Notion seed script (scripts/seed-from-notion.ts) using @notionhq/client v5 dataSources.query API, with graceful error handling, per-item skip, and a package.json seed script entry.

**Created Notion seed script (scripts/seed-from-notion.ts) using @notionhq/client v5 dataSources.query API, with graceful error handling, per-item skip, and a package.json seed script entry.**

## What Happened

Installed @notionhq/client@^5.22.0 and tsx@^4.22.4 as dev dependencies. Created scripts/seed-from-notion.ts that:

1. Loads environment variables (NOTION_TOKEN, NOTION_DATABASE_ID) via dotenv
2. Initializes the Notion client with the provided auth token
3. Queries the Notion database using `notion.dataSources.query()` (the v5 API replacement for deprecated `databases.query()`) with pagination (page_size=100, cursor-based)
4. Extracts properties per page: Name/Nombre (title) → nombre, "Qué es" (rich_text) → que_es, "URL de la imagen" (url) → url_imagen, "URL del elemento" (url) → url_elemento
5. Handles bilingual property names (both Spanish and English) for resilience
6. Inserts each item into the Neon items table using the db.ts sql helper
7. Logs counts of inserted/failed items and exits non-zero on any failures
8. Includes fatal error handling (missing env vars exit early, API failures exit with message)

Added "seed" script to package.json: "tsx scripts/seed-from-notion.ts"

Key adaptation: @notionhq/client v5 deprecated databases.query() in favor of dataSources.query() with result_type: 'page'.

TypeScript compilation verified cleanly with the project's tsconfig.json.

## Verification

1. File exists: scripts/seed-from-notion.ts ✓
2. TypeScript compilation with npx tsc --noEmit --project tsconfig.json: exit 0 ✓
3. Package.json seed script entry: "tsx scripts/seed-from-notion.ts" ✓
4. All dependencies (@notionhq/client, tsx) installed as devDependencies ✓

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f scripts/seed-from-notion.ts` | 0 | ✅ pass | 11ms |
| 2 | `npx tsc --noEmit --project tsconfig.json` | 0 | ✅ pass | 2259ms |
| 3 | `node -e "const pkg = require('./package.json'); process.exit(pkg.scripts.seed === 'tsx scripts/seed-from-notion.ts' ? 0 : 1)"` | 0 | ✅ pass | 27ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
