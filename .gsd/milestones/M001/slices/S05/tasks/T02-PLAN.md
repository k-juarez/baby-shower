---
estimated_steps: 12
estimated_files: 1
skills_used: []
---

# T02: Deploy to production and verify full guest flow

Why: This is the final assembly task — deploy the app to Vercel production and verify the complete guest flow works on the public internet, proving the milestone is truly done.

Do:
1. Run `vercel --prod` — deploy to production at dulce-espera-natalia.vercel.app; confirm the deploy completes successfully and note the production URL
2. Create `scripts/verify-deploy.ts` — a production verification script that uses `fetch()` to check all public endpoints:
   - GET / — landing page returns 200 with 'Baby Shower de Natalia' in body
   - GET /catalogo — catalog page returns 200 with 'Mesa de Regalos' in body
   - GET /api/items — returns 200 with JSON `{ items: [...] }` where items is a non-empty array
   - POST /api/reserve — returns 400 for invalid input (missing fields), proving the endpoint is live and validating
   - POST /api/reserve with valid itemId + guestName — returns either 200 (successful reservation) or 409 (item already reserved), proving atomic reservation works
3. Run `npx tsx scripts/verify-deploy.ts` — execute the verification; all checks must pass
4. If any check fails, inspect `vercel logs` for errors and retry

Done when: All verification checks pass against the production URL — landing page loads, catalog shows items, API returns data, and reservation endpoint processes requests.

## Inputs

- `.vercel/project.json`
- `app/page.tsx`
- `app/catalogo/page.tsx`
- `app/api/items/route.ts`
- `app/api/reserve/route.ts`

## Expected Output

- `scripts/verify-deploy.ts`

## Verification

npx tsx scripts/verify-deploy.ts
