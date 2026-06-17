---
estimated_steps: 10
estimated_files: 1
skills_used: []
---

# T01: Verified Next.js build, confirmed Vercel auth and user k-juarez, linked Vercel project dulce-espera-natalia — blocked on missing DATABASE_URL to set in Vercel production environment

Why: Before deploying, the project must build cleanly and the Vercel project must be configured with the required DATABASE_URL environment variable so the Neon Postgres connection works in production.

Do:
1. Run `npm run build` — confirm zero TypeScript errors and successful compilation
2. Run `vercel whoami` — confirm CLI is authenticated; if not, guide executor to run `vercel login`
3. Run `vercel link` — link to a Vercel project; accept default settings, use project name `dulce-espera-natalia`
4. Read DATABASE_URL from local environment (should be in .env or shell env)
5. Run `vercel env add DATABASE_URL production` — set the Neon connection string on Vercel
6. Run `vercel env ls` — confirm DATABASE_URL appears in production environment
7. Run `vercel pull --environment=production` — pull env to verify it is retrievable

Done when: `npm run build` passes, Vercel project is linked, and DATABASE_URL is confirmed set in Vercel production environment.

## Inputs

- `.env`
- `package.json`
- `next.config.ts`

## Expected Output

- `.vercel/project.json`

## Verification

npm run build
