---
estimated_steps: 16
estimated_files: 2
skills_used: []
---

# T03: Created Notion seed script (scripts/seed-from-notion.ts) using @notionhq/client v5 dataSources.query API, with graceful error handling, per-item skip, and a package.json seed script entry.

Build a standalone TypeScript seed script that fetches ~32 gift items from the Notion database and inserts them into the Neon items table.

Why: The Notion database (800c9949-80ec-445e-ae83-3fd8631cd10d) is the source of truth for the gift catalog. Without this seed, the catalog is empty and the entire application is useless. This script must be runnable once to populate the database.

Do:
1. Install `@notionhq/client` as a dev dependency
2. Create `scripts/seed-from-notion.ts`:
   - Read NOTION_TOKEN and NOTION_DATABASE_ID from process.env (loaded via dotenv)
   - Initialize Notion client with the token
   - Query the database (client.databases.query) to get all pages
   - For each page, extract properties: Name (title) → nombre, "Qué es" (rich_text) → que_es, "URL de la imagen" (url) → url_imagen, "URL del elemento" (url) → url_elemento
   - Insert each item into the items table using the db.ts sql helper: `sql`INSERT INTO items (nombre, que_es, url_imagen, url_elemento) VALUES (...)` `
   - Log count of inserted items
   - Handle errors gracefully (log and skip failed items)
3. Add a `seed` script to package.json: `"seed": "tsx scripts/seed-from-notion.ts"`
4. Install `tsx` as a dev dependency for running the script

Done when: The file scripts/seed-from-notion.ts exists and is syntactically valid TypeScript. When run with `npm run seed` (after env vars are set), it should fetch and insert all items.

Skills expected: none (straightforward integration task)

## Inputs

- `lib/db.ts`
- `lib/schema.sql`
- `.env.example`

## Expected Output

- `scripts/seed-from-notion.ts`

## Verification

test -f scripts/seed-from-notion.ts
