/**
 * API helpers for OFIX frontend.
 *
 * getApiBaseUrl() returns the backend base URL without a trailing `/api`.
 * In local development on `localhost`, we return an empty string to use the
 * Vite proxy (`/api` -> `http://localhost:10000`).
 *
 * M4-FE-02 / M4-FE-06: Dead code removido (apiCall, chatWithMatias, testMatiasConnection).
 * Todos os módulos devem usar o apiClient (axios) de services/api.js para chamadas HTTP.
 */

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  return url.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export const getApiBaseUrl = () => {
  const viteUrl = import.meta.env?.VITE_API_BASE_URL;
  if (viteUrl) return normalizeBaseUrl(viteUrl);

  const hostname = window.location.hostname;

  // Local dev (use Vite proxy: /api -> backend local)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }

  // M4-FE-03: Sem fallback hardcoded. Em produção, VITE_API_BASE_URL deve ser definido
  // no ambiente (Vercel/Netlify). Se ausente, usa proxy relativo (funciona com rewrites).
  console.warn('[OFIX] VITE_API_BASE_URL não definido e não é localhost — usando proxy relativo');
  return "";
};

export default { getApiBaseUrl };

