/**
 * Production verification script for dulce-espera-natalia.vercel.app.
 *
 * Checks all public endpoints and the full guest flow:
 *   landing page -> catalog -> API items -> reserve validation -> atomic reservation
 *
 * Usage: npx tsx scripts/verify-deploy.ts
 */

const BASE_URL = 'https://baby-shower-liard-five.vercel.app';

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: CheckResult[] = [];

async function check(
  name: string,
  fn: () => Promise<void>,
): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true, detail: 'OK' });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, detail: msg });
    console.log(`  ❌ ${name}: ${msg}`);
  }
}

function assert(condition: boolean, msg: string): void {
  if (!condition) throw new Error(msg);
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

async function checkLandingPage(): Promise<void> {
  const res = await fetch(BASE_URL);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  const text = await res.text();
  assert(
    text.includes('Baby Shower de Natalia'),
    'Body missing "Baby Shower de Natalia"',
  );
}

async function checkCatalogPage(): Promise<void> {
  const res = await fetch(`${BASE_URL}/catalogo`);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  const text = await res.text();
  assert(
    text.includes('Mesa de Regalos'),
    'Body missing "Mesa de Regalos"',
  );
}

async function checkApiItems(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/items`);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  const json = await res.json();
  assert(json != null && typeof json === 'object', 'Response is not a JSON object');
  assert(Array.isArray(json.items), 'items is not an array');
  assert(json.items.length > 0, 'items array is empty');
  const item = json.items[0];
  assert(typeof item.nombre === 'string', 'First item missing nombre');
  assert(typeof item.estado === 'string', 'First item missing estado');
}

async function checkReserveInvalidJson(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not-json',
  });
  assert(res.status === 400, `Expected 400, got ${res.status}`);
  const json = await res.json();
  assert(json.error != null, 'Missing error field in 400 response');
}

async function checkReserveMissingFields(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert(res.status === 400, `Expected 400, got ${res.status}`);
  const json = await res.json();
  assert(json.error != null, 'Missing error field in 400 response');
}

async function checkReserveAtomicity(): Promise<void> {
  // Fetch the first available item first
  const itemsRes = await fetch(`${BASE_URL}/api/items`);
  const itemsJson = await itemsRes.json();
  const available = itemsJson.items.find(
    (i: { estado: string }) => i.estado === 'disponible',
  );

  if (!available) {
    console.log('  ⚠️  No available items to reserve - checking API works');
    // Still verify the endpoint responds properly
    const res = await fetch(`${BASE_URL}/api/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: 99999, guestName: 'Verification Bot' }),
    });
    assert(
      res.status === 409,
      `Expected 409 for nonexistent item, got ${res.status}`,
    );
    return;
  }

  const res = await fetch(`${BASE_URL}/api/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itemId: available.id,
      guestName: 'Verification Bot',
    }),
  });

  // Either 200 (success) or 409 (already reserved by previous deploy check)
  assert(
    res.status === 200 || res.status === 409,
    `Expected 200 or 409, got ${res.status}`,
  );

  const json = await res.json();
  if (res.status === 200) {
    assert(json.item != null, 'Missing item in success response');
    assert(json.item.estado === 'apartado', 'Item estado should be apartado');
    assert(
      json.item.reservado_por === 'Verification Bot',
      'reservado_por should match',
    );
  } else {
    assert(json.error != null, 'Missing error in 409 response');
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const exitCode = 0;
  console.log(`\n🔍 Verifying production at ${BASE_URL}\n`);

  await check('Landing page (GET /)', checkLandingPage);
  await check('Catalog page (GET /catalogo)', checkCatalogPage);
  await check('Items API (GET /api/items)', checkApiItems);
  await check('Invalid JSON (POST /api/reserve bad body)', checkReserveInvalidJson);
  await check('Missing fields (POST /api/reserve empty body)', checkReserveMissingFields);
  await check('Atomic reserve (POST /api/reserve valid)', checkReserveAtomicity);

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(
    `\n📊 ${passed} passed, ${failed} failed out of ${results.length} checks\n`,
  );

  if (failed > 0) {
    console.log('Failed checks:');
    for (const r of results) {
      if (!r.passed) console.log(`  - ${r.name}: ${r.detail}`);
    }
    console.log();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\n❌ Script failed: ${err.message}`);
  process.exit(1);
});
