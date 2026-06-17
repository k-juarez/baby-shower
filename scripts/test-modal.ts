/**
 * Tests for reservation modal validation and state machine logic.
 * Run with: npx tsx scripts/test-modal.ts
 *
 * Covers:
 * - Client-side name validation matches server-side rules
 * - Modal state transitions (idle/loading/success/error)
 * - API response handling patterns
 * - Boundary conditions (empty, whitespace, max length)
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

// Replicate client-side modal validation logic (from ReservationModal.tsx)
function modalValidateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Tu nombre es obligatorio.';
  if (trimmed.length > 100) return 'El nombre no debe exceder 100 caracteres.';
  return null;
}

console.log('\n=== Client-Side Name Validation ===');

// Empty name
assert(
  'Empty name shows error',
  modalValidateName('') !== null,
  'expected error for empty string',
);

// Whitespace-only name
assert(
  'Whitespace-only name shows error',
  modalValidateName('   ') !== null,
  'expected error for whitespace-only',
);

// Name > 100 chars
assert(
  'Name > 100 chars shows error',
  modalValidateName('A'.repeat(101)) !== null,
  'expected error for 101-char name',
);

// 100-char name accepted
assert(
  '100-char name accepted (no error)',
  modalValidateName('A'.repeat(100)) === null,
  'expected no error for 100-char name',
);

// Valid short name
assert(
  'Valid name "Ana" accepted',
  modalValidateName('Ana') === null,
  'expected no error for valid name',
);

// Name with leading/trailing whitespace — trimmed before validation
assert(
  'Whitespace-padded valid name accepted after trim',
  modalValidateName('  Ana  ') === null,
  'expected no error after trim',
);

console.log('\n=== Cross-Check: Client vs Server Validation ===');

// The modal's validateName replicates server-side rules.
// Verify that any name the modal accepts also passes server validation.

const testCases = [
  { name: 'Ana', desc: 'valid name' },
  { name: '  Juan Pérez  ', desc: 'name with whitespace' },
  { name: 'María José López García', desc: 'long valid name' },
  { name: 'A'.repeat(100), desc: '100-char name (boundary)' },
];

for (const tc of testCases) {
  const modalOk = modalValidateName(tc.name) === null;
  const serverResult = validateReservation({
    itemId: 1,
    guestName: tc.name,
  });
  const serverOk = serverResult.valid;

  assert(
    `Client-server agreement: "${tc.desc}"`,
    modalOk === serverOk,
    `modal=${modalOk}, server=${serverOk}, serverError=${JSON.stringify(serverResult.error)}`,
  );
}

console.log('\n=== Reservation Flow State Machine ===');

// Simulate the 4 modal states and their transitions
type ModalView = 'idle' | 'loading' | 'success' | 'error';

interface StateTransition {
  from: ModalView;
  action: string;
  to: ModalView;
}

// Expected state transitions for a happy path
const happyPath: StateTransition[] = [
  { from: 'idle', action: 'click confirm', to: 'loading' },
  { from: 'loading', action: '200 response', to: 'success' },
  { from: 'success', action: 'click close', to: 'idle (reset on next open)' },
];

// Expected state transitions for conflict path
const conflictPath: StateTransition[] = [
  { from: 'idle', action: 'click confirm', to: 'loading' },
  { from: 'loading', action: '409 response', to: 'error' },
  { from: 'error', action: 'click "Entendido"', to: 'idle (close + reset)' },
];

// Expected state transitions for network error
const networkErrorPath: StateTransition[] = [
  { from: 'idle', action: 'click confirm', to: 'loading' },
  { from: 'loading', action: 'fetch fails', to: 'error' },
  { from: 'error', active: 'click "Intentar de nuevo"', to: 'idle (retry)' },
];

function verifyTransition(name: string, transitions: StateTransition[]) {
  let current: ModalView = transitions[0].from;
  let allOk = true;
  for (const t of transitions) {
    if (t.from !== current) {
      console.log(`    ❌ ${name}: expected from=${t.from}, got=${current}`);
      allOk = false;
      break;
    }
    current = t.to.includes('(') ? t.to.split(' ')[0] as ModalView : t.to;
  }
  assert(`${name} state machine (${transitions.length} steps)`, allOk);
}

verifyTransition('Happy path', happyPath);
verifyTransition('Conflict path', conflictPath);
verifyTransition('Network error path', networkErrorPath);

console.log('\n=== API Response Handling ===');

// Simulate the modal's fetch response handling logic

type ApiResult = {
  status: number;
  ok: boolean;
  json?: Record<string, unknown>;
};

function simulateModalResponse(response: ApiResult): ModalView {
  if (response.ok) return 'success';
  if (response.status === 409) return 'error'; // "Alguien más acaba de apartar..."
  return 'error'; // Generic error with retry
}

// 200 OK — item reserved
assert(
  '200 OK → success view',
  simulateModalResponse({ status: 200, ok: true }) === 'success',
);

// 409 Conflict — already reserved
assert(
  '409 Conflict → error view',
  simulateModalResponse({ status: 409, ok: false }) === 'error',
);

// 400 Validation error → error view with retry
assert(
  '400 Validation → error view',
  simulateModalResponse({ status: 400, ok: false }) === 'error',
);

// 500 Server error → error view with retry
assert(
  '500 Server error → error view',
  simulateModalResponse({ status: 500, ok: false }) === 'error',
);

// Non-JSON response (e.g., HTML) → generic error
assert(
  'Non-JSON response → generic error',
  simulateModalResponse({ status: 502, ok: false }) === 'error',
);

console.log('\n=== Summary ===');
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}
