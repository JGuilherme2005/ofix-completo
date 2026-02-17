// src/services/api.js

import axios from "axios";
import { getApiBaseUrl } from "../utils/api";

// CORREÇÃO: Configuração simplificada e mais robusta
const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    "Content-Type": "application/json",
  },
  // Render free tier pode ter cold start; 10s costuma ser pouco para o primeiro request.
  timeout: 30000,
});

// --- Helpers ---

/** Gera um ID curto (22 chars, base-36) para correlation. */
function generateRequestId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${ts}-${rand}`;
}

// Interceptor de Requisição: Adiciona JWT + X-Request-Id a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    // M6-OBS-01: Correlation ID — permite rastrear request FE→BE→Python.
    config.headers["X-Request-Id"] = generateRequestId();

    const tokenDataString = localStorage.getItem("authToken"); // Pega a string JSON

    if (tokenDataString) {
      try {
        const tokenData = JSON.parse(tokenDataString);
        if (tokenData && tokenData.token) {
          // Se o token existir dentro do objeto, adiciona no cabeçalho de autorização
          config.headers.Authorization = `Bearer ${tokenData.token}`;
        }
      } catch (e) {
        console.error(
          "Erro ao parsear token do localStorage no interceptor:",
          e
        );
        // Opcional: Limpar localStorage se o token estiver corrompido
        localStorage.removeItem("authToken");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Tratamento de Erros)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn(
          "Erro 401: Não autorizado. Limpando token e notificando AuthContext."
        );
        localStorage.removeItem("authToken");
        // M4-FE-04: Dispara evento customizado em vez de hard redirect.
        // AuthContext ouve este evento e faz logout via React Router,
        // preservando o state "from" para redirect-back após re-login.
        window.dispatchEvent(new Event("auth:logout"));
      }
    } else if (error.request) {
      console.error("Erro de rede ou servidor não respondeu:", error.message);
    } else {
      console.error("Erro ao configurar requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
