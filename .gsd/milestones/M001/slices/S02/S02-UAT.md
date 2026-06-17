# S02: Catálogo de regalos con datos reales — UAT

**Milestone:** M001
**Written:** 2026-06-17T22:38:48.244Z

# UAT: Catálogo de regalos con datos reales (S02)

**UAT Type**: Integration / Artifact Inspection

## Preconditions

- Neon DB is connected and items table is seeded with ~32 items (from S01)
- Build passes with npm run build
- Site is deployed or running locally

---

## UAT-01: Page loads and displays item cards
| Field | Value |
|-------|-------|
| **Preconditions** | DB seeded with items, app deployed |
| **Steps** | Navigate to /catalogo |
| **Expected** | Page loads, shows 🐝 Mesa de Regalos header with honeycomb background, items rendered as card grid |
| **Evidence mode** | artifact (check pre-rendered HTML for card structure) |
| **Edge cases** | DB unavailable → graceful "Estamos preparando los regalos" empty state |

## UAT-02: Card shows all required fields
| Field | Value |
|-------|-------|
| **Preconditions** | Items exist in DB |
| **Steps** | Inspect any card in the grid |
| **Expected** | Card contains: image (or 🐝 placeholder if missing), item name in Quicksand font, description (que_es) in Open Sans, status badge (Disponible/Apartado), "Ver en la tienda →" link |
| **Evidence mode** | artifact (inspect rendered HTML) |

## UAT-03: Filter toggle works client-side
| Field | Value |
|-------|-------|
| **Preconditions** | At least one item with estado="disponible" and one with estado="apartado" |
| **Steps** | Click "Todos" → all items shown. Click "Disponibles" → only items with estado="disponible" shown |
| **Expected** | Instant client-side filtering, active pill styled with bg-primary, inactive with bg-surface-container-high |
| **Evidence mode** | runtime (state verification via DOM inspection) |
| **Edge cases** | All items apartado → filter "Disponibles" shows 🐝 "No hay regalos disponibles" empty state |

## UAT-04: Image fallback works
| Field | Value |
|-------|-------|
| **Preconditions** | Item with null url_imagen, or item with broken image URL |
| **Steps** | Inspect card for that item |
| **Expected** | 🐝 bee placeholder on surface-container background instead of broken image. Aspect ratio (4:3) preserved. |
| **Evidence mode** | artifact (check rendered DOM or HTML) |

## UAT-05: Status badge shows correct state
| Field | Value |
|-------|-------|
| **Preconditions** | Mixed estados in DB (disponible and apartado) |
| **Steps** | Inspect badges on different cards |
| **Expected** | "✓ Disponible" on primary-container bg for estado="disponible". "🔒 Apartado" on tertiary-container bg for any other estado |
| **Evidence mode** | artifact (check rendered HTML classes) |

## UAT-06: Store link opens in new tab
| Field | Value |
|-------|-------|
| **Preconditions** | Item with non-null url_elemento |
| **Steps** | Click "Ver en la tienda →" |
| **Expected** | Link opens url_elemento in new tab with rel="noopener noreferrer". If url_elemento is null, no link is rendered. |
| **Evidence mode** | artifact (inspect anchor tag attributes) |

## UAT-07: Responsive card grid
| Field | Value |
|-------|-------|
| **Preconditions** | 4+ items in DB |
| **Steps** | Resize browser: mobile (~375px), tablet (~768px), desktop (~1024px) |
| **Expected** | Mobile: 1 column. md breakpoint: 2 columns. lg breakpoint: 3 columns. Cards have amber-tinted shadow and hover translate-y effect. |
| **Evidence mode** | browser (visual inspection at each breakpoint) |

## UAT-08: Build with zero TypeScript errors
| Field | Value |
|-------|-------|
| **Preconditions** | Clean repo |
| **Steps** | Run npm run build |
| **Expected** | Build completes with zero TypeScript errors. /catalogo route is listed in output. All routes compile successfully. |
| **Evidence mode** | artifact (build output log) |

