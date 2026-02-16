/**
 * sanitize-log.js — PII / secret redaction for logs (M1-SEC-09)
 *
 * NEVER import this module from hot paths that already avoid logging.
 * Use the helpers below to strip PII *before* handing the value to console.log / a logger.
 */

const IS_PROD = process.env.NODE_ENV === 'production';

// ── Patterns ─────────────────────────────────────────────────────────────────

// CPF: 000.000.000-00 or 00000000000
const CPF_RE = /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?\d{2}\b/g;
// CNPJ: 00.000.000/0000-00 or 00000000000000
const CNPJ_RE = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
// Phone: (xx) xxxxx-xxxx or variants
const PHONE_RE = /\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/g;
// Email
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Plate: ABC-1234 / ABC1D23 (Mercosul)
const PLATE_RE = /\b[A-Z]{3}[-\s]?\d[A-Z0-9]\d{2}\b/gi;
// Connection strings (postgres://, redis://, mysql://)
const DSN_RE = /(postgres|redis|mysql|mongodb)(:\/\/)[^\s'"]+/gi;
// Bearer / API tokens in strings
const TOKEN_RE = /(Bearer\s+|token[=:]\s*)[^\s'"]{8,}/gi;

const PATTERNS = [
  { re: CPF_RE, label: '[CPF_REDACTED]' },
  { re: CNPJ_RE, label: '[CNPJ_REDACTED]' },
  { re: PHONE_RE, label: '[PHONE_REDACTED]' },
  { re: EMAIL_RE, label: '[EMAIL_REDACTED]' },
  { re: PLATE_RE, label: '[PLATE_REDACTED]' },
  { re: DSN_RE, label: '[DSN_REDACTED]' },
  { re: TOKEN_RE, label: '[TOKEN_REDACTED]' },
];

/**
 * Strip PII / secrets from a string.
 * @param {string} text
 * @returns {string}
 */
export function redactPII(text) {
  if (typeof text !== 'string') return text;
  let out = text;
  for (const { re, label } of PATTERNS) {
    // Reset lastIndex for global regexes that may be reused.
    re.lastIndex = 0;
    out = out.replace(re, label);
  }
  return out;
}

/**
 * Redact an object's string values (shallow — one level deep).
 * Keys listed in `sensitiveKeys` are fully replaced with `[REDACTED]`.
 * All other string values go through `redactPII`.
 */
const SENSITIVE_KEYS = new Set([
  'password', 'senha', 'secret', 'token', 'authorization',
  'cookie', 'jwt', 'apiKey', 'api_key', 'accessToken', 'refreshToken',
  'REDIS_URL', 'DATABASE_URL', 'DIRECT_DATABASE_URL',
]);

export function redactObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(key.toLowerCase())) {
      out[key] = '[REDACTED]';
    } else if (typeof value === 'string') {
      out[key] = redactPII(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Safe logger that only emits in development (or when `force` is true).
 * Always redacts PII from arguments.
 */
export function devLog(...args) {
  if (IS_PROD) return;
  const safe = args.map((a) =>
    typeof a === 'string' ? redactPII(a) : typeof a === 'object' ? redactObject(a) : a
  );
  console.log(...safe);
}

/**
 * Production-safe log: always emits, but always redacts PII.
 */
export function safeLog(...args) {
  const safe = args.map((a) =>
    typeof a === 'string' ? redactPII(a) : typeof a === 'object' ? redactObject(a) : a
  );
  console.log(...safe);
}

/**
 * Production-safe error log: always emits, but always redacts PII.
 */
export function safeError(...args) {
  const safe = args.map((a) =>
    typeof a === 'string' ? redactPII(a) : typeof a === 'object' ? redactObject(a) : a
  );
  console.error(...safe);
}
