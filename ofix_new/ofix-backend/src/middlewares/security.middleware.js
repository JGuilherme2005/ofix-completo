/**
 * Security middleware for response hardening.
 */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  res.removeHeader('X-Powered-By');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
}

/**
 * Basic in-memory rate limiting middleware.
 */
const requestCounts = new Map();

const parsedWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS);
const parsedMaxRequests = Number(process.env.RATE_LIMIT_MAX);

const RATE_LIMIT_WINDOW = Number.isFinite(parsedWindowMs) && parsedWindowMs > 0
  ? parsedWindowMs
  : 15 * 60 * 1000;

const MAX_REQUESTS = Number.isFinite(parsedMaxRequests) && parsedMaxRequests > 0
  ? parsedMaxRequests
  : 300;

const RATE_LIMIT_BYPASS_PATHS = new Set([
  '/health',
  '/api/agno/status',
  '/api/agno/memory-status',
  '/api/logs/batch',
]);

export function rateLimit(req, res, next) {
  // Never rate-limit preflight requests, otherwise browser reports false CORS failures.
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (RATE_LIMIT_BYPASS_PATHS.has(req.path)) {
    return next();
  }

  const clientIP = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  // Cleanup old entries
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      requestCounts.delete(ip);
    }
  }

  let clientData = requestCounts.get(clientIP);

  if (!clientData) {
    clientData = {
      count: 1,
      firstRequest: now,
    };
    requestCounts.set(clientIP, clientData);
  } else {
    clientData.count += 1;

    if (clientData.count > MAX_REQUESTS) {
      return res.status(429).json({
        error: 'Muitas requisicoes. Tente novamente em alguns minutos.',
        retryAfter: Math.ceil((clientData.firstRequest + RATE_LIMIT_WINDOW - now) / 1000),
      });
    }
  }

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - clientData.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil((clientData.firstRequest + RATE_LIMIT_WINDOW) / 1000));

  next();
}
