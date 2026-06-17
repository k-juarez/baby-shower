# S04: Landing page y pulido visual — UAT

**Milestone:** M001
**Written:** 2026-06-17T22:58:59.345Z

# S04: Landing page y pulido visual — UAT

**Milestone:** M001
**Written:** 2026-06-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S04 produces only static content (landing page at /) and CSS configuration (globals.css tokens). No runtime services, API endpoints, or dynamic behavior was added. All verification can be performed via build output inspection and content analysis.

## Preconditions

- Next.js project must build successfully (npm run build)
- Landing page source at app/page.tsx must contain all required elements
- globals.css must declare all fixed-color tokens in @theme inline

## Smoke Test

- `npm run build` exits 0, / route listed as static prerendered page

## Test Cases

### 1. Landing page renders all required content

1. Read app/page.tsx source
2. Verify heading "Baby Shower de Natalia" is present
3. Verify bee emoji 🐝 is present as decorative element
4. Verify "Ver catálogo de regalos" CTA with href="/catalogo" is present
5. Verify Spanish welcome paragraph exists
6. Verify "¿Cómo funciona?" section with 3 steps (Explora, Aparta, Compra) is present
7. Verify footer with "Con cariño, para la llegada de Natalia" is present
8. **Expected:** All 8 elements present, CTA links to /catalogo

### 2. Design tokens resolve at build time

1. Run npm run build
2. **Expected:** Build exits 0 with zero TypeScript errors. / route is static.

### 3. Fixed-color tokens present in @theme inline

1. Grep app/globals.css for each fixed-color token: primary-fixed, primary-fixed-dim, on-primary-fixed, on-primary-fixed-variant, secondary-fixed, secondary-fixed-dim, on-secondary-fixed, on-secondary-fixed-variant, tertiary-fixed, tertiary-fixed-dim, on-tertiary-fixed, on-tertiary-fixed-variant, shadow-amber, amber
2. **Expected:** All 14 tokens present in @theme inline block (not just :root)

## Edge Cases

### Responsive layout

1. Read grid classes in app/page.tsx
2. **Expected:** grid-cols-1 on mobile, sm:grid-cols-3 on tablet/desktop for the steps section. sm:py-24 for hero padding.

## Failure Signals

- Build fails with TypeScript errors
- Landing page missing any of the 8 content elements
- Fixed-color tokens absent from @theme inline (hover effects silently broken)

## Not Proven By This UAT

- Visual appearance in actual browsers (font rendering, color appearance, responsive breakpoints) — requires manual visual review
- Actual hover/click interactions in a live browser — requires live environment

## Notes for Tester

Both landing page and catalog page use the same honey bee design system. The landing page has intentionally larger hero padding (py-16 → sm:py-24) since it's the primary entry point. The MEM013 fix ensures hover effects (CTA button, store links, step cards) work correctly at runtime.

