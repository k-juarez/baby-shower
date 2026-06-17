# S01: Scaffold, DB schema, and Notion seed — UAT

**Milestone:** M001
**Written:** 2026-06-17T22:26:11.986Z

## UAT: Artifact

| ID | Check | Finding | Evidence |
|----|-------|---------|----------|
| UAT-01 | Build succeeds | npm run build exits 0 | build output shows Compiled successfully, all routes generated |
| UAT-02 | TypeScript clean | npx tsc --noEmit exits 0 | exit code 0, no errors |
| UAT-03 | db.ts lazy init | neon() wrapped in getDb(), no top-level throw | code review confirmed lazy pattern |
| UAT-04 | Schema 8 columns | id, nombre, que_es, url_imagen, url_elemento, estado, reservado_por, creado_en | CREATE TABLE verified |
| UAT-05 | Seed uses v5 API | dataSources.query() with result_type and data_source_id | code review confirmed v5 pattern |
| UAT-06 | Seed validates env | early exit when NOTION_TOKEN or NOTION_DATABASE_ID missing | guard clauses confirmed |
| UAT-07 | API shape | { items: rows } | verified by code review |
| UAT-08 | API error handling | try/catch returns 500 with { error, detail } | verified by code review |
| UAT-09 | seed script in package.json | "seed": "tsx scripts/seed-from-notion.ts" | package.json verified |
| UAT-10 | .env.example complete | DATABASE_URL, NOTION_TOKEN, NOTION_DATABASE_ID all documented | .env.example verified |
| UAT-11 | API route dynamic | build shows f /api/items (dynamic server-rendered) | build output verified
