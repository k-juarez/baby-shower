---
id: T01
parent: S05
milestone: M001
key_files:
  - .vercel/project.json
key_decisions:
  - Vercel CLI commands must unset VERCEL_TOKEN env var before use — the stale vcp_ token causes authentication failures while cached desktop credentials work
  - DATABASE_URL is not recoverable from codebase — needs user to provide the Neon connection string
duration: 
verification_result: passed
completed_at: 2026-06-17T23:04:12.656Z
blocker_discovered: true
---

# T01: Verified Next.js build, confirmed Vercel auth and user k-juarez, linked Vercel project dulce-espera-natalia — blocked on missing DATABASE_URL to set in Vercel production environment

**Verified Next.js build, confirmed Vercel auth and user k-juarez, linked Vercel project dulce-espera-natalia — blocked on missing DATABASE_URL to set in Vercel production environment**

## What Happened

## What Happened

Executed the first 3 of 7 planned steps for T01:

**Step 1 — npm run build: ✅ PASS**
Next.js 16.2.9 (Turbopack) compiled successfully with zero TypeScript errors in 2.6s build + 3.0s type check. Static pages (/, /_not-found, /catalogo) prerendered. Dynamic routes (/api/items, /api/reserve) marked as server-rendered.

**Step 2 — vercel whoami: ✅ PASS (with workaround)**
The `VERCEL_TOKEN` env var in this shell is invalid (`vcp_...` token is rejected). However, running `unset VERCEL_TOKEN && vercel whoami` authenticates via cached desktop-app credentials as user `k-juarez`. The Vercel CLI works when the stale env var is unset. Decision: all subsequent `vercel` commands must run with `VERCEL_TOKEN` unset.

**Step 3 — vercel link: ✅ PASS**
`vercel link --project dulce-espera-natalia --yes` created the project and `.vercel/project.json` with `projectId: prj_m5FQOXNGVDEfZZkhm0V1Ua6RSEri`, `orgId: team_WnY6deeg9DAWst7nBCRfYtrG`. Next.js build command auto-detected.

**Step 4 — Read DATABASE_URL: ❌ BLOCKER**
`DATABASE_URL` is set as an empty string (`DATABASE_URL=""`) in the current shell environment — `export DATABASE_URL=""` is present but the value is empty. No `.env`, `.env.local`, or `.env.production` file exists in the project directory or worktree. The `.env.example` also has an empty value. The Neon connection string is not available anywhere in the codebase, shell profiles, or git history. This is a prerequisite for Steps 5-7 (adding to Vercel as a production env var). The Neon database was created in S01 but the connection string was not persisted in a checked-in location since `.env*` is gitignored.

**Steps 5-7: Skipped** — cannot proceed without the actual DATABASE_URL value.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | npm run build | 0 | ✅ pass | 6.5s |
| 2 | unset VERCEL_TOKEN && vercel whoami | 0 | ✅ pass | 2.1s |
| 3 | vercel link --project dulce-espera-natalia --yes | 0 | ✅ pass | 5.3s |
| 4 | echo ${#DATABASE_URL} | 0 | ❌ fail (empty) | 0.1s |

## Failure Modes (Q5)

This task has two external dependencies:
1. **VERCEL_TOKEN env var** — Present but invalid. Failure path: `vercel` CLI returns exit code 1 with "token is not valid". Mitigation: unset the stale env var; cached Vercel desktop credentials authenticate successfully as `k-juarez`.
2. **DATABASE_URL env var** — Present as empty string. Failure path: vercel env add cannot set an empty value; deployed app will crash at first request trying to connect to Neon Postgres. Mitigation: requires user to provide the actual Neon connection string. No way to recover programmatically.

## Load Profile (Q6)

*Empty section — this task has no runtime load dimension; it is pre-deployment configuration and verification.*

## Negative Tests (Q7)

*Empty section — this task has no meaningful negative test surface beyond the explicit verification steps already executed.*

## Verification

npm run build passes (exit 0), Vercel auth works as k-juarez (exit 0 with VERCEL_TOKEN unset), Vercel project linked (exit 0). DATABASE_URL is empty string — deployment will fail without the actual Neon connection string set in Vercel production environment.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 6500ms |
| 2 | `unset VERCEL_TOKEN && vercel whoami` | 0 | ✅ pass | 2100ms |
| 3 | `vercel link --project dulce-espera-natalia --yes` | 0 | ✅ pass | 5300ms |
| 4 | `echo ${#DATABASE_URL} (check if set)` | 0 | ❌ fail — DATABASE_URL is empty string | 100ms |

## Deviations

Vercel commands need VERCEL_TOKEN unset to work with cached desktop auth credentials. The plan assumed VERCEL_TOKEN would be valid.

## Known Issues

DATABASE_URL is empty string in this environment. The actual Neon connection string is needed to configure the Vercel production environment. Without it, the deployed app cannot connect to Postgres.

## Files Created/Modified

- `.vercel/project.json`
