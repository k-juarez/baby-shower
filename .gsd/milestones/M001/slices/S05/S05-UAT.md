# S05: Deploy a produccion con datos reales — UAT

**Milestone:** M001
**Written:** 2026-06-17T23:20:57.635Z

## S05 User Acceptance Test

1. **Landing page loads** — GET / returns HTML with honeycomb header and CTA ✅
2. **Catalog page loads** — GET /catalogo returns product grid page ✅
3. **Items API returns data** — GET /api/items returns 32 items with estados ✅
4. **Items include images** — url_imagen populated for all 32 items ✅
5. **Reserve endpoint validates** — bad JSON returns 400, empty fields return 400 ✅
6. **Atomic reserve works** — POST /api/reserve with valid item_id returns 200 ✅
7. **Items are available** — 31 items show estado 'disponible' ✅
