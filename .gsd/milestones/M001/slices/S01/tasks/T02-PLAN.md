---
estimated_steps: 21
estimated_files: 4
skills_used: []
---

# T02: Set up Neon Postgres connection and schema

Install the Neon serverless driver, create the database utility module, define the items table schema, and provide environment variable templates.

Why: The items table is the single source of truth for the entire application. Everything — catalog display, reservation, status display — depends on this schema being correct and the connection working.

Do:
1. Install `@neondatabase/serverless` and `dotenv` as dependencies
2. Create `lib/db.ts` with a `sql` export: import { neon } from '@neondatabase/serverless'; create the sql template tag from process.env.DATABASE_URL; export the sql function
3. Create `lib/schema.sql` with the items table:
```sql
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  que_es TEXT,
  url_imagen TEXT,
  url_elemento TEXT,
  estado TEXT NOT NULL DEFAULT 'disponible',
  reservado_por TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
4. Create `.env.example` with placeholders: DATABASE_URL=, NOTION_TOKEN=, NOTION_DATABASE_ID=

Done when: lib/db.ts exports a working sql helper (verify by checking the file parses as valid TypeScript — the executor will test with a real DATABASE_URL), schema.sql defines all 8 columns correctly, .env.example documents required env vars.

Skills expected: none (straightforward setup task)

## Inputs

- `package.json`

## Expected Output

- `lib/db.ts`
- `lib/schema.sql`
- `.env.example`

## Verification

test -f lib/db.ts
