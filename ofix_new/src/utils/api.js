/**
 * API helpers for OFIX frontend.
 *
 * getApiBaseUrl() returns the backend base URL without a trailing `/api`.
 * In local development on `localhost`, we return an empty string to use the
 * Vite proxy (`/api` -> `http://localhost:10000`).
 */

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  return url.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export const getApiBaseUrl = () => {
  const viteUrl = import.meta.env?.VITE_API_BASE_URL;
  if (viteUrl) return normalizeBaseUrl(viteUrl);

  // Production (Vercel)
  if (window.location.hostname === "ofix.vercel.app") {
    return normalizeBaseUrl("https://ofix-backend-prod.onrender.com");
  }

  // Local dev
  if (window.location.hostname === "localhost") {
    return "";
  }

  // Default fallback
  return normalizeBaseUrl("https://ofix-backend-prod.onrender.com");
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Calls the backend API using either:
 * - Direct base URL: `${API_BASE_URL}/api/...`
 * - Local proxy: `/api/...`
 */
export const apiCall = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/${cleanEndpoint}`
    : `/api/${cleanEndpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "OFIX-Frontend/1.0",
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    return await fetch(url, requestOptions);
  } catch (error) {
    throw new Error(`API Error: ${error.message} (URL: ${url})`);
  }
};

export const chatWithMatias = async (message, user_id) => {
  const response = await apiCall("agno/chat-matias", {
    method: "POST",
    body: JSON.stringify({ message, user_id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Agent error");
  return data;
};

export const testMatiasConnection = async (user_id = "connection_test") => {
  try {
    const data = await chatWithMatias("teste de conexao", user_id);
    return data.success === true;
  } catch {
    return false;
  }
};

export default { apiCall, chatWithMatias, testMatiasConnection, getApiBaseUrl };

