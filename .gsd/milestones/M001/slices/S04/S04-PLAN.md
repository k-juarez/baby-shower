# S04: Landing page y pulido visual

**Goal:** Landing page at `/` with warm welcome message, bee illustrations/icons, 'Ver catálogo de regalos' CTA button. All 4 app screens visually cohesive with bee theme, pastel colors, rounded corners, Google Fonts.
**Demo:** Landing page at `/` with warm welcome message, bee illustrations/icons, 'Ver catálogo de regalos' CTA button. All 4 screens visually cohesive with bee theme, pastel colors, rounded corners, Google Fonts.

## Must-Haves

- Landing page at `/` renders with warm Spanish welcome for Natalia's baby shower
- 🐝 bee emoji illustrations visible as decorative elements
- "Ver catálogo de regalos" CTA button prominently links to `/catalogo`
- Landing page uses the same Honey Bee design tokens (honeycomb pattern, pastel colors, rounded-xl, amber shadows) as the catalog page
- Responsive layout: mobile-first, works on all viewports
- All text in warm Spanish with Quicksand (headings) and Open Sans (body) fonts
- `primary-fixed-dim` and other fixed-color tokens added to `@theme inline` in globals.css so classes like `hover:text-primary-fixed-dim` resolve at runtime (per MEM013)
- Build succeeds with zero TypeScript errors
- Visual review: landing page, catalog page, reservation modal, and confirmation screen form a cohesive whole with consistent spacing, color usage, card styles, and typography

## Proof Level

- This slice proves: contract

## Integration Closure

Upstream surfaces consumed: `app/globals.css` (design tokens, honeycomb pattern), `app/layout.tsx` (fonts, metadata root, body flex layout). New wiring: the home page route at `/` is a static Next.js page component. No new runtime dependencies or API calls. What remains before milestone end-to-end: S05 (Vercel deploy).

## Verification

- Run the task and slice verification checks for this slice.

## Tasks

- [x] **T01: Built bee-themed landing page at / with hero, CTA button, three-step guide, and warm footer — all 14 content checks pass** `est:45m`
  Why: The current landing page is a bare heading with no bee theme, no welcome message, and no CTA. The landing page is the first impression for guests arriving at the site. It must warmly welcome them, explain the gift registry concept, and guide them to the catalog with a prominent CTA button.
  - Files: `app/page.tsx`
  - Verify: node --test app/__tests__/landing-page.test.ts

- [ ] **T02: Fix @theme inline tokens and polish visual coherence** `est:30m`
  Why: The MEM013 gotcha documents that `primary-fixed-dim` and other fixed-color tokens are defined on `:root` but absent from the `@theme inline` block in globals.css. As a result, Tailwind classes like `hover:text-primary-fixed-dim` used in CatalogGrid have no runtime effect. S04 is the visual polish slice — this is the right place to add the missing tokens.
  - Files: `app/globals.css`
  - Verify: grep -q 'primary-fixed-dim' app/globals.css && grep -q 'primary-fixed:' app/globals.css && npm run build

## Files Likely Touched

- app/page.tsx
- app/globals.css
