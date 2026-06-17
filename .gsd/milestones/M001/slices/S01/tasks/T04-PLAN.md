---
estimated_steps: 12
estimated_files: 1
skills_used: []
---

# T04: Create GET /api/items API route

Create a Next.js App Router API route that returns all items from the database as JSON.

Why: This is the contract surface that downstream slices (S02 catalog, S03 reservation) consume. It must return all item fields needed by the frontend: id, nombre, que_es, url_imagen, url_elemento, estado, reservado_por.

Do:
1. Create `app/api/items/route.ts`
2. Export a GET function that:
   - Imports the sql helper from lib/db.ts
   - Queries `SELECT * FROM items ORDER BY id`
   - Returns NextResponse.json({ items: rows })
   - Wraps in try/catch, returning 500 on error
3. Do NOT add filtering or search — that's the catalog page's responsibility in S02

Done when: The route file exists and exports a valid GET handler. When DATABASE_URL is configured and items are seeded, `curl http://localhost:3000/api/items` returns a JSON array.

Skills expected: none (straightforward route handler)

## Inputs

- `lib/db.ts`

## Expected Output

- `app/api/items/route.ts`

## Verification

test -f app/api/items/route.ts
