---
id: S04
parent: M001
milestone: M001
provides:
  - Static landing page at / with bee theme and CTA to /catalogo
  - Complete @theme inline color token set for all interactive variants
  - Visual consistency across all 4 app screens (landing, catalog, modal, confirmation)
requires:
  - slice: S02
    provides: Design tokens (color palette, honeycomb pattern), Google Fonts configuration via next/font, layout structure in app/layout.tsx, CatalogGrid component for visual consistency reference
affects:
  - S05: Vercel deploy — landing page will be deployed alongside catalog as static prerendered content
key_files:
  - app/page.tsx
  - app/globals.css
key_decisions:
  - Fixed-color tokens (12 primary/secondary/tertiary-fixed variants) resolved in @theme inline to fix MEM013 — Tailwind hover/color utility classes now have runtime effect
patterns_established:
  - Landing page pattern: hero section with decorative emojis, heading/subtitle, welcome paragraph, CTA button
observability_surfaces:
  - none — static content only
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-06-17T22:58:59.344Z
blocker_discovered: false
---

# S04: Landing page y pulido visual

**Bee-themed landing page at / with hero, CTA, three-step guide, warm footer, and consistent honey bee design system across all 4 screens — plus all fixed-color tokens added to @theme inline resolving Tailwind hover/color class gaps**

## What Happened

Slice S04 delivered the visual polish and landing page that complete the guest-facing experience. Two tasks were executed:

T01 rewrote app/page.tsx from a bare heading into a warm, inviting landing page. The hero section features decorative bee/flower emojis, the heading 'Baby Shower de Natalia', subtitle 'Little Honey Bee', a welcoming Spanish paragraph explaining the gift registry, and a prominent 'Ver catálogo de regalos' CTA linking to /catalogo. A three-step guide (Explora, Aparta, Compra) explains the flow in card format, and a warm footer closes the page. All styling uses existing design tokens (Quicksand headings, Open Sans body, honeycomb background, amber shadows, rounded corners). A metadata export sets the page title and description for SEO/social sharing.

T02 resolved the MEM013 gotcha by adding 12 fixed-color CSS custom properties (primary/secondary/tertiary-fixed variants) and shadow-amber/amber to the @theme inline block in globals.css. These tokens were defined on :root but absent from the Tailwind theme, causing hover/color utility classes like hover:bg-primary-fixed-dim and shadow-amber to silently have no runtime effect. With this fix, the landing page CTA hover effect, CatalogGrid button hover states, store link hover colors, and step card shadows all render correctly.

## Verification

Three verification gates passed: (1) npm run build — Compiled successfully in 3.2s, zero TypeScript errors, / route prerendered as static content alongside /catalogo; (2) Content analysis — all 14 expected landing page elements present (heading, subtitle, bee emoji, welcome paragraph, CTA with /catalogo href, Cómo funciona section, 3 steps, footer, metadata, responsive grid); (3) Token audit — all 14 color tokens (primary-fixed-dim, primary-fixed, on-primary-fixed, on-primary-fixed-variant, secondary-fixed, secondary-fixed-dim, on-secondary-fixed, on-secondary-fixed-variant, tertiary-fixed, tertiary-fixed-dim, on-tertiary-fixed, on-tertiary-fixed-variant, shadow-amber, amber) confirmed present in @theme inline via grep. Visual cohesion confirmed: all 4 screens share honey bee design system (same palette, honeycomb bg, max-w-[1200px] container, Quicksand headings + Open Sans body, rounded corners, amber shadows).

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

- none

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

- `app/page.tsx` — Rewrote from bare heading to full bee-themed landing page with hero, CTA, three-step guide, footer, and metadata
- `app/globals.css` — Added 12 fixed-color tokens and shadow-amber/amber to @theme inline block; added --color-amber alias to :root
