---
estimated_steps: 13
estimated_files: 1
skills_used: []
---

# T01: Built bee-themed landing page at / with hero, CTA button, three-step guide, and warm footer — all 14 content checks pass

Why: The current landing page is a bare heading with no bee theme, no welcome message, and no CTA. The landing page is the first impression for guests arriving at the site. It must warmly welcome them, explain the gift registry concept, and guide them to the catalog with a prominent CTA button.

Do:
1. Rewrite `app/page.tsx` as a warm, inviting landing page component.
2. Add Next.js Metadata export with Spanish title/description.
3. Build a hero section with the honeycomb pattern background (`bg-honeycomb`), decorative 🐝 emojis, and a warm heading "Baby Shower de Natalia" with subtitle "Little Honey Bee 🍯".
4. Add a welcoming paragraph in Spanish explaining the gift registry — use the same warm tone as the catalog page.
5. Add a prominent "Ver catálogo de regalos" CTA button using Next.js Link to `/catalogo`, styled with `bg-primary text-on-primary rounded-full px-8 py-3 text-lg font-semibold`.
6. Add a "¿Cómo funciona?" section with 3 simple steps (Explora, Aparta, Compra) in a responsive grid (1-col mobile, 3-col desktop), each with an emoji icon.
7. Add a warm footer message "Con cariño, para la llegada de Natalia 💛".
8. Use Quicksand for headings (`var(--font-display)`) and Open Sans for body text (`var(--font-sans)`).
9. Ensure responsive: max-w-[1200px] container, px-6 gutter, mobile-first spacing.
10. Use the existing design tokens: rounded-xl, shadow-amber, surface containers, primary colors.

Done when: The landing page renders with all elements described above, visually cohesive with the catalog page, and the CTA button navigates to `/catalogo`.

## Inputs

- `app/globals.css`
- `app/layout.tsx`
- `app/catalogo/page.tsx`

## Expected Output

- `app/page.tsx`
- `app/__tests__/landing-page.test.ts`

## Verification

node --test app/__tests__/landing-page.test.ts
