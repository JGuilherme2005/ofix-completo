import { Router } from 'express';

const router = Router();

const MAX_BATCH_SIZE = 100;
const MAX_MESSAGE_LENGTH = 500;
const MAX_URL_LENGTH = 300;
const ALLOWED_LEVELS = new Set(['error', 'warn', 'info', 'debug']);

function trimString(value, maxLength) {
  if (typeof value !== 'string') return null;
  return value.slice(0, maxLength);
}

function normalizeLevel(level) {
  if (typeof level !== 'string') return 'info';
  const normalized = level.toLowerCase();
  return ALLOWED_LEVELS.has(normalized) ? normalized : 'info';
}

function sanitizeLog(rawLog = {}) {
  return {
    timestamp: trimString(rawLog.timestamp, 40) || new Date().toISOString(),
    level: normalizeLevel(rawLog.level),
    message: trimString(rawLog.message, MAX_MESSAGE_LENGTH) || 'Sem mensagem',
    environment: trimString(rawLog.environment, 20) || 'unknown',
    url: trimString(rawLog.url, MAX_URL_LENGTH),
    userId: trimString(String(rawLog.userId ?? ''), 120) || null,
    sessionId: trimString(String(rawLog.sessionId ?? ''), 120) || null,
    context: typeof rawLog.context === 'string' ? trimString(rawLog.context, 80) : null,
  };
}

function logInDevelopment(logs) {
  if (process.env.NODE_ENV !== 'development') return;

  logs.forEach((entry) => {
    const line = `[FRONTEND:${entry.level.toUpperCase()}] ${entry.message}`;

    if (entry.level === 'error') {
      console.error(line);
      return;
    }

    if (entry.level === 'warn') {
      console.warn(line);
      return;
    }

    console.log(line);
  });
}

router.post('/', (req, res) => {
  const sanitized = sanitizeLog(req.body);
  logInDevelopment([sanitized]);

  return res.status(202).json({
    success: true,
    accepted: 1,
  });
});

router.post('/batch', (req, res) => {
  const logs = Array.isArray(req.body?.logs) ? req.body.logs : [];

  if (logs.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Payload invalido. Envie logs no formato { logs: [] }.',
    });
  }

  const limitedLogs = logs.slice(0, MAX_BATCH_SIZE);
  const sanitizedLogs = limitedLogs.map((item) => sanitizeLog(item));

  logInDevelopment(sanitizedLogs);

  return res.status(202).json({
    success: true,
    accepted: sanitizedLogs.length,
    dropped: Math.max(0, logs.length - sanitizedLogs.length),
  });
});

export default router;
