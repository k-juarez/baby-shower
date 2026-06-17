---
id: S05
parent: M001
milestone: M001
provides:
  - Production URL: dulce-espera-natalia.vercel.app
  - 32 catalog items in production database
  - Verify-deploy script for regression detection
requires:
  []
affects:
  []
key_files:
  - scripts/verify-deploy.ts
  - scripts/seed-from-csv.ts
key_decisions:
  - MCP notionApi cannot query v4 databases — used CSV from user instead of Notion API for data extraction
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-06-17T23:20:57.635Z
blocker_discovered: false
---

# S05: Deploy a produccion con datos reales

**Deployed to Vercel production, applied schema, seeded 32 catalog items, verified all 6 endpoints pass**

## What Happened

S05 completed the production deployment and data seeding. Key achievements: (1) Fixed DATABASE_URL on Vercel (was double-prefixed), deployed via vercel --prod to dulce-espera-natalia.vercel.app. (2) Applied DB schema (items table) to production Neon. (3) Created scripts/seed-from-csv.ts and seeded 32 catalog items from the Notion baby shower registry into production. (4) Created scripts/verify-deploy.ts with 6 checks — all pass: landing page, catalog page, items API, reserve validation (bad body, missing fields, atomic reserve). The Notion MCP server (notionApi) confirmed the database structure but the v5 API cannot query v4 databases directly.

## Verification



## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
