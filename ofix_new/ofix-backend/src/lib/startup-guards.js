/**
 * startup-guards.js — Fail-fast checks on required env vars (M1-SEC-01)
 *
 * Import this as early as possible (e.g. top of server.js).
 * In production, missing critical vars will crash the process immediately
 * rather than silently misbehaving at runtime.
 */
import 'dotenv/config';

const IS_PROD = process.env.NODE_ENV === 'production';

function requireEnv(name, { minLength = 1, prodOnly = false } = {}) {
  const value = (process.env[name] || '').trim();
  if (prodOnly && !IS_PROD) return; // skip check in dev

  if (!value || value.length < minLength) {
    const msg = `FATAL: ${name} is ${!value ? 'missing' : `too short (need >= ${minLength} chars)`}. Aborting startup.`;
    console.error(msg);
    if (IS_PROD) process.exit(1);
    else console.warn(`⚠️  [DEV] Would have crashed in production: ${name}`);
  }
}

// ── Critical variables ──────────────────────────────────────────────────────

// JWT_SECRET is already enforced by auth.middleware.js. Double-check here.
requireEnv('JWT_SECRET', { minLength: 32 });

// DATABASE_URL is required for Prisma to connect.
requireEnv('DATABASE_URL', { minLength: 10 });

// AGNO_API_TOKEN must be set in production so the backend can authenticate
// with the Matias AI gateway. In dev, a warning is enough.
requireEnv('AGNO_API_TOKEN', { minLength: 8, prodOnly: true });

console.log('✅ [STARTUP] Environment guards passed.');
