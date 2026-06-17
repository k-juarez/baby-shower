---
estimated_steps: 11
estimated_files: 8
skills_used: []
---

# T01: Next.js 16 project scaffolded with Tailwind v4, Honey Bee design tokens from DESIGN.md, Quicksand/Open Sans via next/font/google, and minimal placeholder page.

Scaffold the Next.js project with TypeScript, Tailwind CSS v4, and the App Router. Configure the Honey Bee design tokens from the stitch-source DESIGN.md into the Tailwind config, load Quicksand and Open Sans via next/font/google, and create the root layout with font loading and global CSS variables.

Why: This is the project foundation. Every subsequent slice builds on this. The design tokens ensure visual consistency with the stitch-source designs (colors, typography, spacing).

Do:
1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias '@/*'` to initialize the project in-place (the worktree root is already the project root)
2. After scaffolding, install Google Fonts via next/font/google: import Quicksand and Open Sans in app/layout.tsx, assign CSS variables on body
3. Override tailwind.config.ts (or the CSS-based config if Tailwind v4) with the full color palette from stitch-source/stitch_dulce_espera_de_natalia/natalia_s_honey_bee_registry/DESIGN.md: primary (#7e5700), primary-container (#ffb300), secondary (#636037), secondary-container (#e7e1ae), tertiary, surface, background, on-surface, etc.
4. Configure rounded corners: DEFAULT 0.5rem, lg 1rem, full 9999px
5. Write app/globals.css with the bee-theme base styles: body background surface, color on-surface, honeycomb-pattern utility class
6. Create a minimal placeholder app/page.tsx that renders 'Baby Shower de Natalia' heading — S04 replaces this with the real landing page

Done when: `npm run build` completes without errors, tailwind.config reflects the full color palette, fonts load correctly.

Skills expected: write-docs (for understanding DESIGN.md token extraction)

## Inputs

- `stitch-source/stitch_dulce_espera_de_natalia/natalia_s_honey_bee_registry/DESIGN.md`

## Expected Output

- `package.json`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`

## Verification

npm run build
