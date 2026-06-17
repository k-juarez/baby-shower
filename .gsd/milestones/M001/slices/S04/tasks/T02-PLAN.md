---
estimated_steps: 8
estimated_files: 1
skills_used: []
---

# T02: Added 12 fixed-color tokens (primary/secondary/tertiary-fixed variants) and shadow-amber/amber to @theme inline in globals.css, resolving Tailwind hover/color classes that had no runtime effect

Why: The MEM013 gotcha documents that `primary-fixed-dim` and other fixed-color tokens are defined on `:root` but absent from the `@theme inline` block in globals.css. As a result, Tailwind classes like `hover:text-primary-fixed-dim` used in CatalogGrid have no runtime effect. S04 is the visual polish slice — this is the right place to add the missing tokens.

Do:
1. Edit `app/globals.css` to add the missing fixed-color tokens to the `@theme inline` block: `primary-fixed`, `primary-fixed-dim`, `secondary-fixed`, `secondary-fixed-dim`, `tertiary-fixed`, `tertiary-fixed-dim`, and their on- variants (`on-primary-fixed`, `on-primary-fixed-variant`, `on-secondary-fixed`, `on-secondary-fixed-variant`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`).
2. Map each new token to its corresponding CSS custom property, following the existing pattern.
3. Review the landing page against the catalog page for visual consistency: spacing, color usage, typography, border radius, shadows.
4. Ensure `npm run build` succeeds with zero TypeScript errors.
5. Verify the new tokens are present in `@theme inline` using grep.

Done when: All fixed-color tokens are present in `@theme inline`, build passes, and the two pages (landing + catalog) are visually cohesive.

## Inputs

- `app/globals.css`
- `app/page.tsx`
- `app/catalogo/page.tsx`

## Expected Output

- `app/globals.css`

## Verification

grep -q 'primary-fixed-dim' app/globals.css && grep -q 'primary-fixed:' app/globals.css && npm run build
