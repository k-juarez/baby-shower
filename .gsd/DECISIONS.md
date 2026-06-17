# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? | Made By |
|---|------|-------|----------|--------|-----------|------------|---------|
| D001 | M001/S01 planning | library | Use @neondatabase/serverless directly (not an ORM) for database access | @neondatabase/serverless with SQL template tags | The project has a single table with simple CRUD operations. An ORM adds weight without value for this scope. The @neondatabase/serverless driver is purpose-built for Neon's serverless Postgres and provides a lightweight sql template tag API that keeps the codebase minimal. | Yes | agent |
| D002 | M001/S01 planning | architecture | Use Notion API with @notionhq/client for seed script (not the MCP server) | @notionhq/client SDK in a standalone seed script | The Notion MCP server is not configured in this environment. Using the official @notionhq/client SDK in a standalone TS seed script (run with tsx) makes the seed reproducible in CI or any developer machine, decoupled from editor tooling. The script reads NOTION_TOKEN and NOTION_DATABASE_ID from .env. | Yes | agent |
| D003 |  | integration | Vercel operations will use the Vercel CLI directly, not the Vercel MCP server | Use `vercel` CLI for deploy, logs, project management | Vercel MCP server (https://mcp.vercel.com) requires OAuth authentication. GSD's MCP client doesn't support the OAuth flow and doesn't send the Authorization header correctly in Streamable HTTP mode. The Vercel CLI is already authenticated and provides equivalent functionality. | Yes | collaborative |
