---
estimated_steps: 15
estimated_files: 1
skills_used: []
---

# T02: Created CatalogGrid client component with responsive card grid, image fallback handling, status badge styling, and client-side filter toggle.

Create components/CatalogGrid.tsx as a client component ("use client") that receives an items array and renders the responsive gift card grid with a filter toggle. Each card shows the item image (using native <img> with fallback to a honey-themed placeholder div when url_imagen is null or the image fails to load), item name in Quicksand display font, description (que_es) in Open Sans body font, a status badge pill (Disponible: primary-container bg with ✓, Apartado: tertiary-container bg with 🔒), and a "Ver en la tienda →" link that opens url_elemento in a new tab with rel="noopener noreferrer".

The filter toggle uses React useState — two pill buttons "Todos" and "Disponibles" that filter the displayed cards client-side. Active filter pill has a filled background. The card grid is responsive: grid-cols-1 on mobile, md:grid-cols-2, lg:grid-cols-3. Cards use the Honey Bee design tokens: bg-surface-container-lowest, rounded-xl, soft amber shadow, hover:-translate-y-1 transition.

Why: This is the core visual component of S02 — the card grid is what guests see and interact with. Client-side filtering gives instant feedback without page reloads.

Do:
1. Create components/CatalogGrid.tsx with "use client" directive
2. Define TypeScript interface for the items prop (id, nombre, que_es, url_imagen, url_elemento, estado)
3. Implement useState for filter ('todos' | 'disponibles')
4. Apply filter logic: when 'disponibles', show only items where estado === 'disponible'
5. Render filter toggle: two pill buttons with active/inactive styling
6. Render responsive card grid using CSS grid
7. Each card: image container (aspect-[4/3] relative), name, description (line-clamp-3), status badge, store link
8. Image: use <img> with onError handler that hides the image and shows a placeholder (bee emoji 🐝 on surface-container bg). When url_imagen is null/undefined, show placeholder directly
9. Status badge: conditional styling based on estado value
10. "Ver en la tienda →" link: only render when url_elemento is non-null

Done when: components/CatalogGrid.tsx exists, handles all item states (Disponible/Apartado, with/without image, with/without store URL), filter toggle works, TypeScript types are correct, and the build succeeds.

## Inputs

- `app/catalogo/page.tsx`
- `app/globals.css`

## Expected Output

- `components/CatalogGrid.tsx`

## Verification

test -f components/CatalogGrid.tsx && grep -q 'use client' components/CatalogGrid.tsx && grep -q 'useState' components/CatalogGrid.tsx && grep -q 'grid' components/CatalogGrid.tsx
