/**
 * safe-error.js — Helpers for returning safe error responses (M1-SEC-06).
 *
 * In production, raw error.message may leak stack traces, SQL details,
 * internal paths, etc. These helpers ensure only generic messages are
 * returned to clients in production, while devs still see full detail locally.
 */

const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Build a safe JSON error body.
 * In production, `details` and `message` are replaced with generic text.
 *
 * @param {string} publicMessage  Generic message shown in all environments.
 * @param {Error|string} error    The original error (shown only in dev).
 * @returns {{ error: string, details?: string }}
 */
export function safeErrorBody(publicMessage, error) {
  const body = { error: publicMessage };
  if (IS_DEV && error) {
    body.details = typeof error === 'string' ? error : error.message;
  }
  return body;
}

/**
 * Send a safe error response on `res`.
 *
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} publicMessage
 * @param {Error|string} [error]
 */
export function sendSafeError(res, status, publicMessage, error) {
  return res.status(status).json(safeErrorBody(publicMessage, error));
}
