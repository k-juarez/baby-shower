---
estimated_steps: 10
estimated_files: 1
skills_used: []
---

# T01: Created /catalogo server-rendered page shell with Neon DB data query, honeycomb header, CatalogGrid passthrough, and empty-state fallback

Create the catalog page server component at app/catalogo/page.tsx. This is a Next.js App Router server component that queries the Neon database directly using the existing lazy-init db.ts helper (SELECT * FROM items ORDER BY id), renders the page chrome (honeycomb background, Spanish title "Mesa de Regalos", warm description text), and passes the items array to the CatalogGrid client component. Also add page metadata (title, description) via Next.js Metadata API.

Why: This establishes the /catalogo route with real data flowing from the DB through server rendering. The page shell provides the consistent Honey Bee visual identity (honeycomb background header, Quicksand headings, Open Sans body).

Do:
1. Create app/catalogo/ directory
2. Write app/catalogo/page.tsx as a server component (no "use client" directive)
3. Import sql from @/lib/db and query SELECT * FROM items ORDER BY id
4. Define Metadata export with Spanish title: "Mesa de Regalos — Baby Shower de Natalia"
5. Render page shell: honeycomb background div, h1 with bee hive emoji "🐝 Mesa de Regalos", description paragraph, and <CatalogGrid items={rows} />
6. Handle empty state: if no items, show a warm message "Estamos preparando los regalos. ¡Vuelve pronto!"

Done when: app/catalogo/page.tsx exists, imports and queries correctly, and renders the page shell with CatalogGrid receiving the items array.

## Inputs

- `lib/db.ts`
- `app/globals.css`
- `app/layout.tsx`

## Expected Output

- `app/catalogo/page.tsx`

## Verification

test -f app/catalogo/page.tsx && grep -q '@/lib/db' app/catalogo/page.tsx && grep -q 'CatalogGrid' app/catalogo/page.tsx
