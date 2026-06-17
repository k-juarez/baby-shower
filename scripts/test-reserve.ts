/**
 * Tests for reservation validation and core logic.
 * Run with: npx tsx scripts/test-reserve.ts
 *
 * Covers:
 * - Positive test: valid itemId and guestName
 * - Malformed inputs: missing itemId, missing guestName, empty name after trim, name > 100 chars
 * - Boundary: itemId=0 (not positive), itemId=string "abc", whitespace-only name
 */

import { validateReservation } from '../lib/reserve-validate';

let passed = 0;
let failed = 0;

function assert(label: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function assertError(
  label: string,
  result: ReturnType<typeof validateReservation>,
  expectedDetail: string,
) {
  assert(
    label,
    !result.valid &&
      result.error?.error === 'Validation failed' &&
      result.error.detail === expectedDetail,
    `expected detail="${expectedDetail}", got ${JSON.stringify(result.error)}`,
  );
}

function assertValid(
  label: string,
  result: ReturnType<typeof validateReservation>,
) {
  assert(
    label,
    result.valid &&
      typeof result.parsedItemId === 'number' &&
      typeof result.trimmedName === 'string',
    `expected valid=true with parsedItemId and trimmedName, got ${JSON.stringify(result)}`,
  );
}

// --- Q7 Negative Tests ---

console.log('\n--- Negative Tests ---');

// Missing itemId
assertError('itemId = undefined', validateReservation({ itemId: undefined, guestName: 'Ana' }), 'itemId is required');

// null itemId
assertError('itemId = null', validateReservation({ itemId: null, guestName: 'Ana' }), 'itemId is required');

// itemId as string "abc"
assertError('itemId = "abc" (string)', validateReservation({ itemId: 'abc', guestName: 'Ana' }), 'itemId must be a positive integer');

// itemId as floating point
assertError('itemId = 3.14 (float)', validateReservation({ itemId: 3.14, guestName: 'Ana' }), 'itemId must be a positive integer');

// itemId = 0
assertError('itemId = 0', validateReservation({ itemId: 0, guestName: 'Ana' }), 'itemId must be a positive integer');

// itemId = -1
assertError('itemId = -1 (negative)', validateReservation({ itemId: -1, guestName: 'Ana' }), 'itemId must be a positive integer');

// Missing guestName
assertError('guestName = undefined', validateReservation({ itemId: 1, guestName: undefined }), 'guestName is required and must be a string');

// guestName = null
assertError('guestName = null', validateReservation({ itemId: 1, guestName: null }), 'guestName is required and must be a string');

// guestName = 123 (number, not string)
assertError('guestName = 123 (number)', validateReservation({ itemId: 1, guestName: 123 }), 'guestName is required and must be a string');

// Empty string after trim
assertError('guestName = "" (empty)', validateReservation({ itemId: 1, guestName: '' }), 'guestName must not be empty');

// Whitespace-only string
assertError('guestName = "   " (whitespace)', validateReservation({ itemId: 1, guestName: '   ' }), 'guestName must not be empty');

// Name > 100 chars
assertError('guestName = "A".repeat(101)', validateReservation({ itemId: 1, guestName: 'A'.repeat(101) }), 'guestName must not exceed 100 characters');

// --- Positive tests ---

console.log('\n--- Positive Tests ---');

// Valid reservation
const valid1 = validateReservation({ itemId: 1, guestName: 'Ana María' });
assertValid('valid itemId=1, guestName="Ana María"', valid1);
assert(
  'parsedItemId = 1',
  valid1.valid && valid1.parsedItemId === 1,
);
assert(
  'trimmedName = "Ana María"',
  valid1.valid && valid1.trimmedName === 'Ana María',
);

// Leading/trailing whitespace gets trimmed
const valid2 = validateReservation({ itemId: 42, guestName: '  Juan Pérez  ' });
assertValid('itemId=42, guestName with whitespace', valid2);
assert(
  'trimmedName = "Juan Pérez"',
  valid2.valid && valid2.trimmedName === 'Juan Pérez',
);

// Maximum length (100 chars) is accepted
const name100 = 'A'.repeat(100);
const valid3 = validateReservation({ itemId: 999, guestName: name100 });
assertValid('100-char name accepted', valid3);
assert(
  'trimmedName preserved',
  valid3.valid && valid3.trimmedName === name100,
);

// --- Summary ---

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}
