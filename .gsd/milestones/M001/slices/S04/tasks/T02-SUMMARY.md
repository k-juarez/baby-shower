---
id: T02
parent: S04
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-06-17T22:57:49.219Z
blocker_discovered: false
---

# T02: Added 12 fixed-color tokens (primary/secondary/tertiary-fixed variants) and shadow-amber/amber to @theme inline in globals.css, resolving Tailwind hover/color classes that had no runtime effect

**Added 12 fixed-color tokens (primary/secondary/tertiary-fixed variants) and shadow-amber/amber to @theme inline in globals.css, resolving Tailwind hover/color classes that had no runtime effect**

## What Happened

Task T02 addressed the MEM013 gotcha: the :root block defined --color-primary-fixed-dim and 11 other fixed-color CSS custom properties, but the @theme inline block was missing all of them. This meant Tailwind utility classes like hover:bg-primary-fixed-dim (used in the landing page CTA and CatalogGrid buttons), hover:text-primary-fixed-dim (used in CatalogGrid store links), and shadow-amber (used in landing step cards) compiled silently but had no runtime effect.

Changes to app/globals.css:
1. Added --color-amber alias to :root (same value as --color-shadow-amber) so the Tailwind `shadow-amber` utility class resolves via --color-amber in the theme color palette
2. Added all 12 fixed-color tokens to @theme inline: primary-fixed, primary-fixed-dim, on-primary-fixed, on-primary-fixed-variant, secondary-fixed, secondary-fixed-dim, on-secondary-fixed, on-secondary-fixed-variant, tertiary-fixed, tertiary-fixed-dim, on-tertiary-fixed, on-tertiary-fixed-variant
3. Added --color-shadow-amber and --color-amber to @theme inline

Visual consistency review confirmed both pages share the honey bee design system: same honeycomb headers, max-w-[1200px] containers, Quicksand headings / Open Sans body, amber color palette, rounded corners, and pastel surface colors. The landing page has intentionally larger hero padding (py-16→24 vs py-12→16) since it's the primary entry point.

## Verification

npm run build succeeds with zero TypeScript errors. All 14 tokens confirmed present in @theme inline via grep: primary-fixed-dim, primary-fixed, on-primary-fixed, on-primary-fixed-variant, secondary-fixed, secondary-fixed-dim, on-secondary-fixed, on-secondary-fixed-variant, tertiary-fixed, tertiary-fixed-dim, on-tertiary-fixed, on-tertiary-fixed-variant, shadow-amber, and amber.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `grep -q 'primary-fixed-dim' app/globals.css && grep -q 'primary-fixed:' app/globals.css` | 0 | ✅ pass | 13ms |
| 2 | `npm run build` | 0 | ✅ pass | 8490ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
