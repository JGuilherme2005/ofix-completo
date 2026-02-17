/**
 * Vitest global setup for integration tests.
 *
 * Sets required env vars BEFORE any application module is imported.
 * This prevents fatal process.exit() calls in auth.middleware.js and
 * auth.service.js that validate JWT_SECRET at module level.
 */

// A deterministic secret ≥32 chars (required by auth.middleware.js)
process.env.JWT_SECRET = 'ofix-integration-test-secret-key-32chars!';
process.env.JWT_EXPIRES_IN = '1h';

// Prevent startup-guards from killing the process
process.env.NODE_ENV = 'test';

// Database URL — won't be used because we mock Prisma, but some
// modules check for its existence.
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ofix_test?pgbouncer=true';

// Agno — point to a non-existent local port so AGNO_IS_CONFIGURED = true
// but all HTTP calls fail instantly with ECONNREFUSED.
process.env.AGNO_API_URL = 'http://127.0.0.1:19999';
process.env.AGNO_API_TOKEN = 'test-token-12345678';

// Ultra-short timeouts so warm+retry cycles complete in <1s
process.env.AGNO_RUN_TIMEOUT_MS = '500';
process.env.AGNO_HEALTH_TIMEOUT_MS = '200';
process.env.AGNO_WARM_HEALTH_TIMEOUT_MS = '200';
process.env.AGNO_CHAT_WARM_MAX_WAIT_MS = '300';
process.env.AGNO_WARM_MAX_WAIT_MS = '300';
process.env.AGNO_WARM_RETRY_DELAY_MS = '50';
process.env.AGNO_WARM_RUN = 'false';
process.env.AGNO_AUTO_WARMUP = 'false';
