# M001: Catálogo de regalos con reserva atómica

**Vision:** Sitio web de lista de regalos para el baby shower de Natalia Juárez con tema "Little Honey Bee". Los invitados navegan un catálogo de regalos, reservan atómicamente el que comprarán escribiendo su nombre, y son redirigidos a la tienda. Sin registro ni login. Desplegado en Vercel con Neon Postgres.

## Success Criteria

- Guest can browse catalog of ~32 gifts with images, descriptions, and availability status
- Guest can reserve a gift atomically by entering their name — no two guests can reserve the same item
- Reserved items show 'Apartado' status globally visible to all guests
- After reserving, guest is shown confirmation with link to purchase from store
- Site is mobile-first responsive with Little Honey Bee theme (pastel yellow, bees, honeycombs)
- Site is deployed and publicly accessible at dulce-espera-natalia.vercel.app

## Slices

- [ ] **S01: Scaffold, DB schema, and Notion seed** `risk:medium` `depends:[]`
  > After this: Next.js project initialized with Tailwind, Neon Postgres connected, schema created, and ~32 items seeded from Notion. Can query items via API route.

- [ ] **S02: Catálogo de regalos con datos reales** `risk:medium` `depends:[S01]`
  > After this: Catalog page at `/catalogo` displaying real items from DB in a responsive card grid. Cards show image, name, description, status badge (Disponible/Apartado). Filter toggle for Disponibles/Todos works.

- [ ] **S03: Reserva atómica y confirmación** `risk:high` `depends:[S02]`
  > After this: Clicking 'Yo lo regalo' on any Disponible item opens a modal. Guest enters name, confirms, and the reservation is atomic (conditional UPDATE). Confirmation screen shows thank-you message and link to store.

- [ ] **S04: Landing page y pulido visual** `risk:low` `depends:[S02]`
  > After this: Landing page at `/` with warm welcome message, bee illustrations/icons, 'Ver catálogo de regalos' CTA button. All 4 screens visually cohesive with bee theme, pastel colors, rounded corners, Google Fonts.

- [ ] **S05: Deploy a Vercel** `risk:medium` `depends:[S03,S04]`
  > After this: Site live at dulce-espera-natalia.vercel.app. Full guest flow works in production: landing → catalog → reserve → confirmation → store redirect.

## Boundary Map

Not provided.
