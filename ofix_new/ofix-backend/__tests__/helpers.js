/**
 * Shared test helpers for backend integration tests.
 *
 * Provides:
 * - JWT generation with configurable payloads
 * - Prisma mock factory with chainable API
 * - Convenience wrappers for common operations
 */

import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET;

// ── JWT Helpers ───────────────────────────────────────────────

/**
 * Generate a valid JWT for testing.
 * @param {Object} overrides - Fields to merge into the default payload
 * @returns {string} Signed JWT
 */
export function generateToken(overrides = {}) {
  const payload = {
    userId: overrides.userId ?? crypto.randomUUID(),
    email: overrides.email ?? 'test@ofix.com',
    role: overrides.role ?? 'GESTOR_OFICINA',
    oficinaId: overrides.oficinaId ?? crypto.randomUUID(),
    ...overrides,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Generate an expired JWT for testing 401 on token expiration.
 */
export function generateExpiredToken(overrides = {}) {
  const payload = {
    userId: overrides.userId ?? crypto.randomUUID(),
    email: overrides.email ?? 'expired@ofix.com',
    role: overrides.role ?? 'GESTOR_OFICINA',
    oficinaId: overrides.oficinaId ?? crypto.randomUUID(),
    ...overrides,
  };
  // Sign with a negative expiration so it's already expired
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '-10s' });
}

/**
 * Generate a JWT signed with the WRONG secret.
 */
export function generateBadSignatureToken() {
  return jwt.sign(
    { userId: crypto.randomUUID(), email: 'bad@ofix.com', role: 'USER', oficinaId: crypto.randomUUID() },
    'wrong-secret-that-does-not-match-at-all!',
    { expiresIn: '1h' },
  );
}

// ── Prisma Mock Factory ──────────────────────────────────────

/**
 * Creates a mock Prisma client object compatible with how the codebase
 * uses `import prisma from '../config/database.js'`.
 *
 * Every model exposes the standard Prisma methods as vi.fn() stubs.
 * Callers configure return values per-test via .mockResolvedValue().
 */
export function createPrismaMock() {
  const modelMethods = () => ({
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: crypto.randomUUID(), ...data })),
    update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: crypto.randomUUID(), ...data })),
    updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    delete: vi.fn().mockResolvedValue({}),
    deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    count: vi.fn().mockResolvedValue(0),
    upsert: vi.fn().mockResolvedValue({}),
  });

  return {
    user: modelMethods(),
    oficina: modelMethods(),
    cliente: modelMethods(),
    veiculo: modelMethods(),
    servico: modelMethods(),
    peca: modelMethods(),
    fornecedor: modelMethods(),
    financeiro: modelMethods(),
    chatSession: modelMethods(),
    chatMessage: modelMethods(),
    agendamento: modelMethods(),
    procedimentoPadrao: modelMethods(),
    mensagemPadrao: modelMethods(),
    // Transaction helper — executes callback with the mock as `tx`
    $transaction: vi.fn().mockImplementation(async (fn) => {
      if (typeof fn === 'function') return fn(prismaMockSingleton);
      // Array-style transactions
      return Promise.all(fn);
    }),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $extends: vi.fn().mockReturnThis(),
  };
}

// Singleton so all modules share the same mock instance
let prismaMockSingleton;
export function getPrismaMock() {
  if (!prismaMockSingleton) {
    prismaMockSingleton = createPrismaMock();
  }
  return prismaMockSingleton;
}

/**
 * Reset all mock function call history (but keep implementations).
 * Call in beforeEach() to isolate tests.
 */
export function resetPrismaMock() {
  const mock = getPrismaMock();
  for (const key of Object.keys(mock)) {
    const val = mock[key];
    if (typeof val?.mockClear === 'function') {
      val.mockClear();
    } else if (val && typeof val === 'object') {
      for (const method of Object.values(val)) {
        if (typeof method?.mockClear === 'function') method.mockClear();
      }
    }
  }
}

// ── Fixed UUIDs for test fixtures ────────────────────────────

export const OFICINA_A_ID = '00000000-0000-4000-a000-000000000001';
export const OFICINA_B_ID = '00000000-0000-4000-a000-000000000002';
export const USER_A_ID = '00000000-0000-4000-b000-000000000001';
export const USER_B_ID = '00000000-0000-4000-b000-000000000002';
export const CLIENTE_A_ID = '00000000-0000-4000-8000-000000000001';
export const CLIENTE_B_ID = '00000000-0000-4000-8000-000000000002';
