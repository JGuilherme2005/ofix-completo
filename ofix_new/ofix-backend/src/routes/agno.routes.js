import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendSafeError } from '../lib/safe-error.js';

// Importar serviÃ§os do Matias
import ConversasService from '../services/conversas.service.js';
import AgendamentosService from '../services/agendamentos.service.js';
import ConsultasOSService from '../services/consultasOS.service.js';
import NLPService from '../services/nlp.service.js';
import prisma from '../config/database.js';

// â­ NOVA ARQUITETURA MULTI-AGENTE (Nov 2025)
import MessageClassifier from '../services/message-classifier.service.js';
import AgendamentoLocal from '../services/agendamento-local.service.js';
import LocalResponse from '../services/local-response.service.js';
import CacheService from '../services/cache.service.js';

const router = express.Router();

// Configuracoes do Agno (aceita URL principal e fallback para ambientes com DNS interno)
const AGNO_API_URL = (process.env.AGNO_API_URL || '').trim();
const AGNO_PUBLIC_API_URL = (process.env.AGNO_PUBLIC_API_URL || '').trim();
const AGNO_FALLBACK_API_URL = (process.env.AGNO_FALLBACK_API_URL || '').trim();
const AGNO_DEFAULT_PUBLIC_URL =
    process.env.NODE_ENV === 'production' ? 'https://matias-agno-r556.onrender.com' : '';

const AGNO_BASE_URLS = [
    AGNO_API_URL,
    AGNO_PUBLIC_API_URL,
    AGNO_FALLBACK_API_URL,
    AGNO_DEFAULT_PUBLIC_URL,
]
    .map((url) => String(url || '').trim().replace(/\/$/, ''))
    .filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);

const AGNO_BASE_URL = AGNO_BASE_URLS[0] || '';
const AGNO_API_TOKEN = (process.env.AGNO_API_TOKEN || '').trim();
const AGNO_DEFAULT_AGENT_ID = (process.env.AGNO_DEFAULT_AGENT_ID || 'matias').trim();
const AGNO_PUBLIC_AGENT_ID = (process.env.AGNO_PUBLIC_AGENT_ID || 'matias-public').trim();
const AGNO_IS_CONFIGURED = AGNO_BASE_URLS.length > 0;

function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Timeouts and warmup behavior (env overridable)
const AGNO_RUN_TIMEOUT_MS = parsePositiveInt(process.env.AGNO_RUN_TIMEOUT_MS, 120000);
const AGNO_HEALTH_TIMEOUT_MS = parsePositiveInt(process.env.AGNO_HEALTH_TIMEOUT_MS, 10000);
// Warm-up health checks should tolerate cold starts better than regular status checks.
const AGNO_WARM_HEALTH_TIMEOUT_MS = parsePositiveInt(process.env.AGNO_WARM_HEALTH_TIMEOUT_MS, 20000);
// Auto warm-up keeps Render free instances awake; disable for "wake on demand" testing.
const AGNO_AUTO_WARMUP_ENABLED =
    String(process.env.AGNO_AUTO_WARMUP || '').trim().toLowerCase() !== 'false';
// When waking from cold start, poll health for up to this long before giving up.
// Render free tier can take >90s to wake a sleeping service; keep this generous.
const AGNO_WARM_MAX_WAIT_MS = parsePositiveInt(process.env.AGNO_WARM_MAX_WAIT_MS, 240000);
// Chat requests should not block too long waiting for cold-start; the frontend typically times out near ~60s.
const AGNO_CHAT_WARM_MAX_WAIT_MS = parsePositiveInt(process.env.AGNO_CHAT_WARM_MAX_WAIT_MS, 45000);
// Delay between warm health retries (capped in logic below).
const AGNO_WARM_RETRY_DELAY_MS = parsePositiveInt(process.env.AGNO_WARM_RETRY_DELAY_MS, 3000);

// Optional: perform a lightweight warm run to reduce cold-start latency (Render free tier, etc.)
const AGNO_WARM_RUN_ENABLED = String(process.env.AGNO_WARM_RUN || '').trim().toLowerCase() === 'true';
const AGNO_WARM_RUN_TIMEOUT_MS = parsePositiveInt(process.env.AGNO_WARM_RUN_TIMEOUT_MS, 20000);
const AGNO_WARM_RUN_MESSAGE = (process.env.AGNO_WARM_RUN_MESSAGE || 'ping').trim();
const AGNO_WARM_RUN_AGENT_ID = (process.env.AGNO_WARM_RUN_AGENT_ID || AGNO_DEFAULT_AGENT_ID || 'matias').trim() || 'matias';
const AGNO_WARM_RUN_SESSION_ID = (process.env.AGNO_WARM_RUN_SESSION_ID || 'warmup').trim() || 'warmup';
const AGNO_WARM_RUN_USER_ID = (process.env.AGNO_WARM_RUN_USER_ID || 'warmup').trim() || 'warmup';

function ensureDatabaseConfigured(res) {
    if (process.env.DATABASE_URL) {
        return true;
    }

    console.error('[AGNO] DATABASE_URL nao configurada para consultas locais');
    res.status(503).json({
        success: false,
        error: 'Banco de dados nao configurado',
        message: 'Configure DATABASE_URL no backend para habilitar consultas e agendamentos locais.'
    });
    return false;
}

// ðŸ’¾ CACHE DE RESPOSTAS - Reduz 60% das chamadas Ã  API (1h de TTL)
// Cache gerenciado via CacheService (Redis)

// â° WARM-UP INTELIGENTE - Rastrear Ãºltima atividade
let agnoWarmed = false;
let lastWarmingAttempt = null;
let lastActivity = Date.now();

// âš¡ CIRCUIT BREAKER para Rate Limit (429)
let circuitBreakerOpen = false;
let circuitBreakerOpenUntil = null;
const CIRCUIT_BREAKER_COOLDOWN = 300000; // 5 minutos de cooldown apÃ³s 429 (Render free tier)

function checkCircuitBreaker() {
    if (circuitBreakerOpen) {
        const now = Date.now();
        if (now < circuitBreakerOpenUntil) {
            const remainingSeconds = Math.ceil((circuitBreakerOpenUntil - now) / 1000);
            console.log(`ðŸš« [CIRCUIT BREAKER] Agno AI bloqueado por ${remainingSeconds}s (rate limit)`);
            return false; // Bloqueado
        } else {
            // Cooldown expirou, resetar
            console.log('âœ… [CIRCUIT BREAKER] Cooldown expirado, reativando Agno AI');
            circuitBreakerOpen = false;
            circuitBreakerOpenUntil = null;
        }
    }
    return true; // Permitido
}

function openCircuitBreaker() {
    circuitBreakerOpen = true;
    circuitBreakerOpenUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN;
    console.log(`ðŸš« [CIRCUIT BREAKER] Agno AI bloqueado por ${CIRCUIT_BREAKER_COOLDOWN / 1000}s (rate limit detectado)`);
}

// Registro de context e knowledge para o Agno
const AGNO_CONTEXT = {
    name: "OFIX - Sistema de Oficina Automotiva",
    description: "Assistente virtual Matias para oficina automotiva",
    capabilities: [
        "consultar_ordens_servico",
        "agendar_servicos",
        "consultar_pecas",
        "calcular_orcamentos",
        "listar_clientes",
        "historico_veiculos",
        "estatisticas_oficina"
    ],
    endpoints: {
        base_url: process.env.BACKEND_URL || "http://localhost:3001",
        auth_required: true
    }
};

function getAgnoAuthHeaders() {
    return AGNO_API_TOKEN ? { 'Authorization': `Bearer ${AGNO_API_TOKEN}` } : {};
}

function getAgnoCandidateBaseUrls(preferredBaseUrl = AGNO_BASE_URL) {
    const ordered = [preferredBaseUrl, ...AGNO_BASE_URLS].filter(Boolean);
    return ordered.filter((url, index) => ordered.indexOf(url) === index);
}

function shouldRetryWithNextBase(errorOrStatus) {
    if (typeof errorOrStatus === 'number') {
        return errorOrStatus >= 500 || errorOrStatus === 429;
    }

    const message = String(errorOrStatus?.message || '').toLowerCase();
    return (
        errorOrStatus?.name === 'AbortError' ||
        message.includes('aborted') ||
        message.includes('econnrefused') ||
        message.includes('enotfound') ||
        message.includes('timed out') ||
        message.includes('timeout') ||
        message.includes('network')
    );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAgnoHealth({ timeoutMs = AGNO_HEALTH_TIMEOUT_MS } = {}) {
    if (!AGNO_IS_CONFIGURED) {
        return { ok: false, status: null, latency_ms: 0, data: null, error: 'AGNO_NOT_CONFIGURED' };
    }

    const baseUrls = getAgnoCandidateBaseUrls();
    let lastHealthResult = null;

    for (const baseUrl of baseUrls) {
        const startedAt = Date.now();

        try {
            const response = await fetch(`${baseUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAgnoAuthHeaders(),
                },
                signal: AbortSignal.timeout(timeoutMs),
            });

            const latency_ms = Date.now() - startedAt;
            let data = null;
            try {
                data = await response.json();
            } catch (_) {
                // Ignore non-JSON health body.
            }

            const healthResult = {
                ok: response.ok,
                status: response.status,
                latency_ms,
                data,
                error: response.ok ? null : `HTTP ${response.status}`,
                base_url: baseUrl,
                tried_urls: baseUrls,
            };

            if (response.ok) {
                return healthResult;
            }

            lastHealthResult = healthResult;
            if (!shouldRetryWithNextBase(response.status)) {
                return healthResult;
            }
        } catch (error) {
            const latency_ms = Date.now() - startedAt;
            lastHealthResult = {
                ok: false,
                status: null,
                latency_ms,
                data: null,
                error: error.message,
                base_url: baseUrl,
                tried_urls: baseUrls,
            };
        }
    }

    return lastHealthResult || {
        ok: false,
        status: null,
        latency_ms: 0,
        data: null,
        error: 'AGNO_UNREACHABLE',
        base_url: AGNO_BASE_URL,
        tried_urls: baseUrls,
    };
}

async function fetchAgnoWithFallback(path, { method = 'GET', headers = {}, body, timeoutMs = AGNO_RUN_TIMEOUT_MS } = {}) {
    const baseUrls = getAgnoCandidateBaseUrls();
    let lastError = null;

    for (const baseUrl of baseUrls) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = `${baseUrl}${normalizedPath}`;

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: AbortSignal.timeout(timeoutMs),
            });

            if (!response.ok) {
                const errorText = await response.text();
                const httpError = new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
                httpError.status = response.status;
                httpError.base_url = baseUrl;
                httpError.tried_urls = baseUrls;

                if (shouldRetryWithNextBase(response.status)) {
                    lastError = httpError;
                    continue;
                }

                throw httpError;
            }

            return { response, base_url: baseUrl, tried_urls: baseUrls };
        } catch (error) {
            error.base_url = error.base_url || baseUrl;
            error.tried_urls = error.tried_urls || baseUrls;
            lastError = error;

            if (shouldRetryWithNextBase(error)) {
                continue;
            }

            throw error;
        }
    }

    throw lastError || new Error('AGNO_UNREACHABLE');
}

async function runAgnoWarmRun({ agentId = AGNO_WARM_RUN_AGENT_ID } = {}) {
    if (!AGNO_IS_CONFIGURED) {
        return { ok: false, status: null, latency_ms: 0, error: 'AGNO_NOT_CONFIGURED' };
    }

    const resolvedAgentId = (agentId || AGNO_DEFAULT_AGENT_ID || 'matias').trim() || 'matias';
    const baseUrls = getAgnoCandidateBaseUrls();
    let lastError = null;

    const form = new FormData();
    form.append('message', AGNO_WARM_RUN_MESSAGE || 'ping');
    form.append('stream', 'false');
    form.append('session_id', AGNO_WARM_RUN_SESSION_ID);
    form.append('user_id', AGNO_WARM_RUN_USER_ID);

    for (const baseUrl of baseUrls) {
        const endpoint = `${baseUrl}/agents/${encodeURIComponent(resolvedAgentId)}/runs`;
        const startedAt = Date.now();

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    ...form.getHeaders(),
                    ...getAgnoAuthHeaders(),
                },
                body: form,
                signal: AbortSignal.timeout(AGNO_WARM_RUN_TIMEOUT_MS),
            });

            const latency_ms = Date.now() - startedAt;

            if (!response.ok) {
                const errText = await response.text();
                lastError = {
                    ok: false,
                    status: response.status,
                    latency_ms,
                    error: errText.substring(0, 200),
                    base_url: baseUrl,
                };

                if (!shouldRetryWithNextBase(response.status)) {
                    return lastError;
                }

                continue;
            }

            const data = await response.json();
            return {
                ok: true,
                status: 200,
                latency_ms,
                run_id: data.run_id,
                model: data.model,
                agent_id: data.agent_id || resolvedAgentId,
                base_url: baseUrl,
            };
        } catch (error) {
            const latency_ms = Date.now() - startedAt;
            lastError = { ok: false, status: null, latency_ms, error: error.message, base_url: baseUrl };
        }
    }

    return lastError || { ok: false, status: null, latency_ms: 0, error: 'AGNO_UNREACHABLE' };
}

async function warmAgnoService({ reason = 'manual', maxWaitMs = AGNO_WARM_MAX_WAIT_MS } = {}) {
    lastWarmingAttempt = Date.now();

    if (!AGNO_IS_CONFIGURED) {
        console.warn('[AGNO] Warm solicitado, mas AGNO_API_URL nao esta configurada');
        agnoWarmed = false;
        return { ok: false, reason: 'not_configured', health: null, warm_run: null };
    }

    const startedAt = Date.now();
    const deadline = startedAt + Math.max(0, Number(maxWaitMs) || 0);

    let attempts = 0;
    let health = null;

    while (Date.now() <= deadline) {
        attempts += 1;
        health = await fetchAgnoHealth({ timeoutMs: AGNO_WARM_HEALTH_TIMEOUT_MS });

        if (health.ok) {
            break;
        }

        // Break early for non-retryable HTTP statuses (misconfig, auth, etc).
        if (typeof health?.status === 'number' && !shouldRetryWithNextBase(health.status)) {
            break;
        }

        const remainingMs = deadline - Date.now();
        if (remainingMs <= 0) {
            break;
        }

        const backoffMs = Math.min(AGNO_WARM_RETRY_DELAY_MS * attempts, 8000);
        await sleep(Math.min(backoffMs, remainingMs));
    }

    agnoWarmed = Boolean(health?.ok);
    const waited_ms = Date.now() - startedAt;

    if (!health.ok) {
        console.warn('⚠️ [AGNO] Warm falhou no health:', health.error);
        return { ok: false, reason, health, warm_run: null, attempts, waited_ms };
    }

    let warmRunResult = null;
    if (AGNO_WARM_RUN_ENABLED) {
        warmRunResult = await runAgnoWarmRun({ agentId: AGNO_WARM_RUN_AGENT_ID });

        // Don't mark as offline just because the warm-run failed.
        if (!warmRunResult.ok) {
            console.warn('⚠️ [AGNO] Warm-run falhou:', warmRunResult.error);
        }
    }

    return { ok: true, reason, health, warm_run: warmRunResult, attempts, waited_ms };
}

// Endpoint pÃºblico para verificar configuraÃ§Ã£o do Agno
router.get('/config', verificarAuth, async (req, res) => {
    try {

        const memoryEnabled = process.env.AGNO_ENABLE_MEMORY === 'true' && AGNO_IS_CONFIGURED;

        res.json({
            configured: AGNO_IS_CONFIGURED,
            // M1-SEC-06: agno_url/agno_urls removed
            has_token: !!AGNO_API_TOKEN,
            agent_id: AGNO_DEFAULT_AGENT_ID,
            warmed: agnoWarmed,
            memory_enabled: memoryEnabled, // â† NOVO: indica se memÃ³ria estÃ¡ ativa
            last_warming: lastWarmingAttempt ? new Date(lastWarmingAttempt).toISOString() : null,
            timestamp: new Date().toISOString(),
            status: AGNO_IS_CONFIGURED ? 'configured' : 'not_configured'
        });
    } catch (error) {
        console.error('âŒ Erro ao verificar configuraÃ§Ã£o:', error.message);
        res.status(500).json({
            error: 'Erro ao verificar configuraÃ§Ã£o',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// Endpoint para aquecer o serviÃ§o Agno (Ãºtil para evitar cold starts)
router.post('/warm', verificarAuth, async (req, res) => {
    try {
        console.log('ðŸ”¥ RequisiÃ§Ã£o de warming do Agno...');

        const result = await warmAgnoService({ reason: 'manual' });

        res.json({
            success: result.ok,
            warmed: agnoWarmed,
            message: result.ok ? 'ServiÃ§o Agno aquecido com sucesso' : 'Falha ao aquecer serviÃ§o Agno',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('âŒ Erro ao aquecer Agno:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erro ao aquecer serviÃ§o',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// Endpoint autenticado para status consolidado (backend + Agno health)
router.get('/status', verificarAuth, async (req, res) => {
    const base = {
        success: true,
        backend: { ok: true },
        agno: {
            configured: AGNO_IS_CONFIGURED,
            online: false,
            status: AGNO_IS_CONFIGURED ? 'unknown' : 'not_configured',
            agent_id: AGNO_DEFAULT_AGENT_ID,
            warmed: agnoWarmed,
            last_warming: lastWarmingAttempt ? new Date(lastWarmingAttempt).toISOString() : null,
            last_activity: lastActivity ? new Date(lastActivity).toISOString() : null,
            circuit_breaker: {
                open: circuitBreakerOpen,
                open_until: circuitBreakerOpenUntil ? new Date(circuitBreakerOpenUntil).toISOString() : null
            }
        },
        timestamp: new Date().toISOString()
    };

    if (!AGNO_IS_CONFIGURED) {
        return res.json(base);
    }

    const health = await fetchAgnoHealth({ timeoutMs: AGNO_HEALTH_TIMEOUT_MS });

    return res.json({
        ...base,
        agno: {
            ...base.agno,
            online: health.ok,
            status: health.ok ? 'online' : 'offline',

        }
    });
});

// ðŸ”’ RATE LIMITER para endpoints pÃºblicos (previne abuso)
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // 20 requests por IP
    message: {
        error: 'Muitas requisiÃ§Ãµes deste IP',
        retry_after: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // ConfiguraÃ§Ã£o para contar requests corretamente
    keyGenerator: (req, res) => {
        // Use the official helper so IPv6 addresses can't bypass limits.
        // Important: ipKeyGenerator expects (req, res), not a raw IP string.
        return ipKeyGenerator(req, res);
    },
    handler: (req, res) => {
        console.log(`â›” [RATE-LIMIT] Bloqueado IP: ${req.ip}`);
        res.status(429).json({
            error: 'Muitas requisiÃ§Ãµes deste IP',
            retry_after: '15 minutos'
        });
    }
});

// Endpoint pÃºblico para testar chat SEM AUTENTICAÃ‡ÃƒO (com rate limit e cache)
router.post('/chat-public', publicLimiter, validateMessage, async (req, res) => {
    try {
        const message = String(req.body?.message || '').trim();
        // Support both "oficinaRef" (preferred: UUID or slug) and legacy "oficinaId" (UUID).
        const oficinaRefRaw = String(
            req.body?.oficinaRef ||
            req.query?.oficinaRef ||
            req.body?.oficinaId ||
            req.query?.oficinaId ||
            ''
        ).trim();
        const publicSessionId = String(req.body?.publicSessionId || req.query?.publicSessionId || '').trim();

        if (!oficinaRefRaw) {
            return res.status(400).json({ success: false, error: 'oficinaRef obrigatorio' });
        }

        const oficinaRef = oficinaRefRaw.toLowerCase();
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUuid = uuidRe.test(oficinaRef);
        const slugRe = /^[a-z0-9][a-z0-9-]{2,63}$/;
        if (!isUuid && !slugRe.test(oficinaRef)) {
            return res.status(400).json({ success: false, error: 'oficinaRef invalido' });
        }

        if (!publicSessionId) {
            return res.status(400).json({ success: false, error: 'publicSessionId obrigatorio' });
        }
        if (!/^[a-zA-Z0-9_-]{8,64}$/.test(publicSessionId)) {
            return res.status(400).json({ success: false, error: 'publicSessionId invalido' });
        }

        // Nao vaze a mensagem em logs (pode conter PII).
        console.log('[CHAT-PUBLIC] request', { oficinaRef: oficinaRef, ip: req.ip });

        // Se nao esta configurado, retornar status de indisponibilidade (feature publica).
        if (!AGNO_IS_CONFIGURED) {
            return res.status(503).json({
                success: false,
                error: 'Assistente indisponivel',
                message: 'Assistente ainda nao esta configurado neste ambiente.'
            });
        }

        // Validar oficina existente (escopo obrigatorio) e se esta ativa.
        const oficinaWhere = isUuid ? { id: oficinaRef } : { slug: oficinaRef };
        const oficina = await prisma.oficina.findFirst({
            where: oficinaWhere,
            select: { id: true, nome: true, slug: true, isActive: true }
        });
        if (!oficina) {
            return res.status(404).json({ success: false, error: 'Oficina nao encontrada' });
        }
        if (!oficina.isActive) {
            return res.status(403).json({ success: false, error: 'Oficina desativada' });
        }

        const oficinaId = oficina.id;
        // Namespacing evita colisao de memoria/cache entre oficinas.
        const userId = `public_${oficinaId}_${publicSessionId}`;
        const sessionId = `of_${oficinaId}_anon_${publicSessionId}`;

        // Public endpoint: never bubble upstream errors as 500 (clients tend to retry and amplify cost).
        // We return the internal fallback message instead and let the circuit breaker protect the upstream.
        const result = await processarComAgnoAI(message, userId, AGNO_PUBLIC_AGENT_ID, sessionId, {
            throwOnError: false,
            dependencies: {
                oficina_id: oficinaId,
                public: true
            }
        });

        const responseTextRaw = result.response || result.content || result.message || 'Resposta do assistente';
        const responseText = normalizarTextoResposta(responseTextRaw);

        return res.json({
            success: true,
            response: responseText,
            from_cache: Boolean(result.from_cache),
            oficina: { id: oficina.id, nome: oficina.nome, slug: oficina.slug }
        });
    } catch (error) {
        console.error('[CHAT-PUBLIC] erro:', String(error?.message || error));
        return res.status(500).json({ success: false, error: 'Erro interno' });
    }
});

// ============================================================
// ðŸ¤– CHAT INTELIGENTE - PROCESSAMENTO DE LINGUAGEM NATURAL
// ============================================================

router.post('/chat-inteligente', verificarAuth, validateMessage, async (req, res) => {
    try {
        const { message, contexto_ativo } = req.body;

        const usuario_id = req.user?.id || req.user?.userId;
        const oficinaId = req.user?.oficinaId;

        const agentSessionId = `of_${oficinaId}_user_${usuario_id}`;

        if (!usuario_id || !oficinaId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario nao autenticado ou sem oficina vinculada'
            });
        }

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem Ã© obrigatÃ³ria'
            });
        }

        // Track activity for warmup logic (prevents constant warming due to stale lastActivity).
        lastActivity = Date.now();

                console.log('[CHAT-INTELIGENTE] Nova mensagem (len):', message.length);
        console.log('ðŸŽ¯ Usuario ID:', usuario_id);
        console.log('ðŸŽ¯ Contexto ativo:', contexto_ativo);

        // â­ NOVA ARQUITETURA: Usar MessageClassifier
        const classification = MessageClassifier.classify(message);
        console.log('ðŸŽ¯ [CLASSIFIER] Resultado:', {
            processor: classification.processor,
            type: classification.type,
            subtype: classification.subtype,
            confidence: classification.confidence
        });

        // 2ï¸âƒ£ ROTEAMENTO INTELIGENTE
        let responseData;
        const startTime = Date.now();

        if (classification.processor === 'BACKEND_LOCAL') {
            // âš¡ PROCESSA LOCALMENTE (rÃ¡pido, confiÃ¡vel)
            console.log('âš¡ [BACKEND_LOCAL] Processando localmente...');

            responseData = await processarLocal(message, classification, usuario_id, contexto_ativo, req);

            const duration = Date.now() - startTime;
            console.log(`âœ… [BACKEND_LOCAL] Processado em ${duration}ms`);

            // Adiciona metadata
            responseData.metadata = {
                ...responseData.metadata,
                processed_by: 'BACKEND_LOCAL',
                processing_time_ms: duration,
                classification: classification
            };

        } else {
            // ðŸ§  ENVIA PARA AGNO AI (inteligente, conversacional)
            console.log('ðŸ§  [AGNO_AI] Enviando para Agno AI...');

            try {
                responseData = await processarComAgnoAI(message, usuario_id, AGNO_DEFAULT_AGENT_ID, agentSessionId, { throwOnError: true, dependencies: { oficina_id: oficinaId, user_id: usuario_id, role: req.user?.role || null, public: false } });

                const duration = Date.now() - startTime;
                console.log(`âœ… [AGNO_AI] Processado em ${duration}ms`);

                // Adiciona metadata
                if (responseData.metadata) {
                    responseData.metadata.processed_by = 'AGNO_AI';
                    responseData.metadata.processing_time_ms = duration;
                    responseData.metadata.classification = classification;

                    const modelName = String(responseData.metadata.model || '').toLowerCase();
                    const isAgnoFallback =
                        modelName.includes('fallback') || Boolean(responseData.metadata.error);

                    if (isAgnoFallback) {
                        responseData.metadata.processed_by = 'BACKEND_LOCAL_FALLBACK';
                    }
                }
            } catch (agnoError) {
                const errorMessage = String(agnoError?.message || '');
                const isTimeout = Boolean(agnoError?.is_timeout) || /aborted|timeout/i.test(errorMessage);
                const statusCode = Number(agnoError?.status);
                const errorMessageLower = errorMessage.toLowerCase();
                const isRateLimit =
                    Boolean(agnoError?.is_rate_limit) ||
                    (statusCode === 429 && /rate\s*limit|too many requests/i.test(errorMessageLower));
                // Render/proxy cold-start can surface as 429 without being a true model/provider rate limit.
                const isColdStart = Boolean(agnoError?.is_cold_start) || (statusCode === 429 && !isRateLimit);
                const isTimeoutOrRateLimit = isTimeout || isRateLimit || isColdStart;
                const errorType = isTimeoutOrRateLimit ? 'â±ï¸ Timeout/Rate Limit' : 'âŒ Erro';
                console.error(`   âš ï¸ Agno falhou (${errorType}), usando fallback:`, errorMessage);

                const isServerError = Number.isFinite(statusCode) && statusCode >= 500;
                const isAgentNotFound = statusCode === 404 && errorMessageLower.includes('agent not found');
                const isNetworkError = /econnrefused|enotfound|fetch failed|network/i.test(errorMessageLower);

                // Free-tier cold start: warm up once and retry before falling back.
                if (isColdStart || (!isRateLimit && (isTimeout || isServerError || isAgentNotFound || isNetworkError))) {
                    try {
                        console.warn('[AGNO_AI] Provavel cold start. Tentando aquecer e reenviar uma vez...');
                        const warmResult = await warmAgnoService({ reason: 'chat_retry', maxWaitMs: AGNO_CHAT_WARM_MAX_WAIT_MS });

                        if (warmResult?.ok) {
                            responseData = await processarComAgnoAI(message, usuario_id, AGNO_DEFAULT_AGENT_ID, agentSessionId, { throwOnError: true, dependencies: { oficina_id: oficinaId, user_id: usuario_id, role: req.user?.role || null, public: false } });

                            const retryDuration = Date.now() - startTime;
                            console.log(`✅ [AGNO_AI] Reprocessado apos warm em ${retryDuration}ms`);

                            responseData.metadata = {
                                ...responseData.metadata,
                                processed_by: 'AGNO_AI',
                                processing_time_ms: retryDuration,
                                classification: classification,
                                warm_attempted: true,
                                warm_ok: true,
                                warm_attempts: warmResult.attempts,
                                warm_waited_ms: warmResult.waited_ms
                            };
                        }
                    } catch (retryError) {
                        console.warn('[AGNO_AI] Retry apos warm falhou:', String(retryError?.message || retryError));
                    }
                }

                if (!responseData) {
                    // Fallback para resposta local baseado no subtipo
                    const duration = Date.now() - startTime;

                if (classification.subtype === 'ORCAMENTO' || classification.subtype === 'CONSULTA_PRECO') {
                    responseData = {
                        success: true,
                        response: `ðŸ’° **Consulta de PreÃ§o**\n\n${isTimeoutOrRateLimit ? 'âš ï¸ _O assistente estÃ¡ temporariamente indisponÃ­vel._\n\n' : ''}Para fornecer um orÃ§amento preciso, preciso de algumas informaÃ§Ãµes:\n\nâ€¢ Qual Ã© o modelo do veÃ­culo?\nâ€¢ Qual ano?\n\nOs valores variam dependendo do veÃ­culo. Entre em contato para um orÃ§amento personalizado!\n\nðŸ“ž **Contato:** (11) 1234-5678`,
                        tipo: 'consulta_preco',
                        mode: 'fallback',
                        metadata: {
                            processed_by: 'BACKEND_LOCAL_FALLBACK',
                            processing_time_ms: duration,
                            agno_error: errorMessage,
                            is_timeout: isTimeout,
                            is_rate_limit: isRateLimit,
                            is_cold_start: isColdStart,
                            classification: classification
                        }
                    };
                } else {
                    // Fallback genÃ©rico
                    responseData = {
                        success: true,
                        response: `OlÃ¡! ðŸ‘‹\n\n${isTimeoutOrRateLimit ? 'âš ï¸ _O assistente avanÃ§ado estÃ¡ temporariamente indisponÃ­vel._\n\n' : ''}Como posso ajudar vocÃª hoje?\n\nâ€¢ Agendar um serviÃ§o\nâ€¢ Consultar ordem de serviÃ§o\nâ€¢ Ver peÃ§as em estoque\nâ€¢ Cadastrar cliente\nâ€¢ Ver estatÃ­sticas\n\nDigite sua solicitaÃ§Ã£o!`,
                        tipo: 'ajuda',
                        mode: 'fallback',
                        metadata: {
                            processed_by: 'BACKEND_LOCAL_FALLBACK',
                            processing_time_ms: duration,
                            agno_error: errorMessage,
                            is_timeout: isTimeout,
                            is_rate_limit: isRateLimit,
                            is_cold_start: isColdStart,
                            classification: classification
                        }
                    };
                }
                }
            }
        }

        // 3ï¸âƒ£ SALVAR CONVERSA NO BANCO
        if (responseData?.response) {
            const normalizedResponse = normalizarTextoResposta(responseData.response);
            responseData.response = normalizedResponse;
            responseData.conteudo = normalizarTextoResposta(responseData.conteudo || normalizedResponse);
        }

        try {
            if (usuario_id) {
                await ConversasService.salvarConversa({
                    usuarioId: usuario_id,
                    pergunta: message,
                    resposta: responseData.response || 'Sem resposta',
                    contexto: JSON.stringify({
                        classification: classification,
                        contexto_ativo,
                        ...responseData.metadata
                    }),
                    timestamp: new Date()
                });
                console.log('âœ… Mensagem salva no histÃ³rico');
            }
        } catch (saveError) {
            console.error('âš ï¸ Erro ao salvar conversa (nÃ£o crÃ­tico):', saveError.message);
        }

        // 4ï¸âƒ£ RETORNAR RESPOSTA
        return res.json({
            success: true,
            ...responseData
        });

    } catch (error) {
        console.error('âŒ Erro no chat inteligente:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao processar mensagem',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// ============================================================
// ðŸ“œ HISTÃ“RICO DE CONVERSAS
// ============================================================

router.get('/historico-conversa', verificarAuth, async (req, res) => {
    try {
        const requestUserId = req.user?.id || req.user?.userId;
        const requestOficinaId = req.user?.oficinaId;

        if (!requestUserId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario nao autenticado'
            });
        }

        if (!requestOficinaId) {
            return res.status(400).json({ success: false, error: 'Usuário sem oficina vinculada' });
        }

        console.log('📖 Buscando historico para usuario:', requestUserId, '@ oficina:', requestOficinaId);

        const session = await prisma.chatSession.findFirst({
            where: { oficinaId: requestOficinaId, userId: String(requestUserId) },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 50
                }
            }
        });

        if (!session || session.messages.length === 0) {
            return res.json({
                success: true,
                mensagens: [],
                total: 0
            });
        }

        const mensagensFormatadas = session.messages.map(msg => ({
            id: msg.id,
            tipo_remetente: msg.role === 'user' ? 'user' : 'matias',
            conteudo: msg.content,
            timestamp: msg.createdAt
        }));

        console.log(`✅ Histórico retornado: ${mensagensFormatadas.length} mensagens`);

        res.json({
            success: true,
            mensagens: mensagensFormatadas,
            total: mensagensFormatadas.length,
            conversa_id: session.id
        });
    } catch (error) {
        console.error('? Erro no historico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao recuperar historico',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// ============================================================================
// ðŸ“… FUNÃ‡ÃƒO: PROCESSAR AGENDAMENTO
// ============================================================================

async function processarAgendamento(mensagem, usuario_id, cliente_selecionado = null) {
    try {
        console.log('ðŸ” DEBUG AGENDAMENTO:');
        console.log('   - Mensagem recebida:', mensagem);
        console.log('   - Usuario ID:', usuario_id);
        console.log('   - Cliente selecionado:', cliente_selecionado);

        // VerificaÃ§Ã£o especÃ­fica para quando cliente estÃ¡ selecionado e mensagem Ã© "agendar"
        const mensagemNormalizada = mensagem ? mensagem.trim().toLowerCase() : '';
        console.log('   - Mensagem normalizada:', mensagemNormalizada);

        if (cliente_selecionado && (mensagemNormalizada === 'agendar' || mensagemNormalizada === 'agende' || mensagemNormalizada === 'agendar serviÃ§o')) {
            console.log('   âœ… Cliente selecionado e mensagem de agendamento detectada');
            return {
                success: false,
                response: `ðŸ“‹ **Agendamento para ${cliente_selecionado.nomeCompleto}**\n\n` +
                    `ðŸ’¡ **Me informe os dados restantes:**\n\n` +
                    `â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)\n` +
                    `â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)\n` +
                    `â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)\n\n` +
                    `**Exemplo:**\n` +
                    `"RevisÃ£o na segunda Ã s 14h" ou "Troca de Ã³leo amanhÃ£ Ã s 10h"`,
                tipo: 'pergunta',
                cliente_selecionado: cliente_selecionado,
                faltando: [
                    'â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)',
                    'â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)',
                    'â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)'
                ]
            };
        }

        // 0. BUSCAR OFICINA DO USUÃRIO
        let oficinaId = null;
        if (usuario_id) {
            const usuario = await prisma.user.findUnique({
                where: { id: String(usuario_id) }, // USER ID Ã‰ STRING (UUID)
                select: { oficinaId: true }
            });
            oficinaId = usuario?.oficinaId;
            console.log('   ðŸ¢ Oficina ID:', oficinaId);
        }

        // 1. EXTRAIR ENTIDADES
        const entidades = NLPService.extrairEntidadesAgendamento(mensagem);
        console.log('   ðŸ“‹ Entidades:', JSON.stringify(entidades, null, 2));

        // 2. VALIDAR DADOS NECESSÃRIOS
        // SE HOUVER CLIENTE SELECIONADO, NÃƒO VALIDAR A NECESSIDADE DO CLIENTE
        let validacao;
        if (cliente_selecionado) {
            // Quando o cliente jÃ¡ estÃ¡ selecionado e a mensagem Ã© apenas "agendar",
            // retornar uma resposta personalizada pedindo apenas os dados restantes
            if (mensagem.trim().toLowerCase() === 'agendar') {
                return {
                    success: false,
                    response: `ðŸ“‹ **Agendamento para ${cliente_selecionado.nomeCompleto}**\n\n` +
                        `ðŸ’¡ **Me informe os dados restantes:**\n\n` +
                        `â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)\n` +
                        `â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)\n` +
                        `â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)\n\n` +
                        `**Exemplo:**\n` +
                        `"RevisÃ£o na segunda Ã s 14h" ou "Troca de Ã³leo amanhÃ£ Ã s 10h"`,
                    tipo: 'pergunta',
                    cliente_selecionado: cliente_selecionado,
                    faltando: [
                        'â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)',
                        'â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)',
                        'â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)'
                    ]
                };
            }

            // Criar validaÃ§Ã£o personalizada que ignora a falta de cliente
            const entidadesObrigatorias = ['servico', 'dia', 'hora'];
            const faltando = [];

            if (!entidades.servico) faltando.push('â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)');
            if (!entidades.diaSemana && !entidades.dataEspecifica) faltando.push('â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)');
            if (!entidades.hora) faltando.push('â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)');

            // NÃ£o exigir veÃ­culo pois podemos usar o veÃ­culo do cliente selecionado
            // ou pedir para selecionar um dos veÃ­culos do cliente
            validacao = {
                valido: faltando.length === 0,
                faltando: faltando
            };
        } else {
            validacao = NLPService.validarDadosAgendamento(entidades);
        }

        if (!validacao.valido) {
            // Mensagem personalizada baseada no que estÃ¡ faltando
            let mensagemAjuda = 'ðŸ“‹ **Vamos fazer seu agendamento!**\n\n';

            if (cliente_selecionado) {
                // O cliente jÃ¡ estÃ¡ selecionado, mostrar mensagem personalizada
                mensagemAjuda += `**Cliente selecionado:** ${cliente_selecionado.nomeCompleto}\n\n`;
                mensagemAjuda += 'ðŸ’¡ **Me informe os dados restantes:**\n\n';
                mensagemAjuda += validacao.faltando.join('\n');
                mensagemAjuda += '\n\n**Exemplo:**\n';
                mensagemAjuda += '"Agendar revisÃ£o na segunda Ã s 14h" ou "Troca de Ã³leo amanhÃ£ Ã s 10h"';
            } else if (validacao.faltando.length === 4 || validacao.faltando.length === 5) {
                // EstÃ¡ faltando quase tudo - dar exemplo completo
                mensagemAjuda += 'ðŸ’¡ **Me informe os seguintes dados:**\n\n';
                mensagemAjuda += 'â€¢ **Cliente:** Nome do cliente\n';
                mensagemAjuda += 'â€¢ **VeÃ­culo:** Modelo ou placa\n';
                mensagemAjuda += 'â€¢ **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, etc)\n';
                mensagemAjuda += 'â€¢ **Dia:** Dia da semana ou data (segunda, terÃ§a, 20/10)\n';
                mensagemAjuda += 'â€¢ **HorÃ¡rio:** Hora desejada (14h, 16:00)\n\n';
                mensagemAjuda += '**Exemplo:**\n';
                mensagemAjuda += '"Agendar revisÃ£o para o Gol do JoÃ£o na segunda Ã s 14h"';
            } else {
                // EstÃ¡ faltando apenas alguns dados - ser especÃ­fico
                mensagemAjuda += '**InformaÃ§Ãµes que ainda preciso:**\n\n';
                mensagemAjuda += validacao.faltando.map((item, i) => `${i + 1}. ${item}`).join('\n');
                mensagemAjuda += '\n\n**Exemplo:**\n';

                // Gerar exemplo baseado no que jÃ¡ tem
                const partes = [];
                if (entidades.servico) partes.push(entidades.servico);
                else partes.push('revisÃ£o');

                if (cliente_selecionado) {
                    partes.push(`para o cliente ${cliente_selecionado.nomeCompleto}`);
                } else if (entidades.veiculo) {
                    partes.push(`para o ${entidades.veiculo}`);
                } else if (entidades.cliente) {
                    partes.push(`para o cliente ${entidades.cliente}`);
                } else {
                    partes.push('para o Gol do JoÃ£o');
                }

                if (entidades.diaSemana || entidades.dataEspecifica) {
                    partes.push(entidades.diaTexto || new Date(entidades.dataEspecifica).toLocaleDateString('pt-BR'));
                } else {
                    partes.push('na segunda');
                }

                if (entidades.hora) partes.push(`Ã s ${entidades.hora}`);
                else partes.push('Ã s 14h');

                mensagemAjuda += `"${partes.join(' ')}"`;
            }

            return {
                success: false,
                response: mensagemAjuda,
                tipo: 'pergunta',
                faltando: validacao.faltando,
                entidades_detectadas: entidades
            };
        }

        // 3. BUSCAR CLIENTE NO BANCO (com busca inteligente)
        let cliente = null;
        let clientesSugeridos = [];

        // Se houver um cliente selecionado previamente, usÃ¡-lo
        if (cliente_selecionado) {
            cliente = await prisma.cliente.findFirst({
                where: { id: cliente_selecionado.id },
                include: {
                    veiculos: true
                }
            });
        } else if (entidades.cliente) {
            // Busca exata primeiro (FILTRADO POR OFICINA)
            const whereClause = {
                nomeCompleto: {
                    contains: entidades.cliente,
                    mode: 'insensitive'
                }
            };

            // Adicionar filtro de oficina se disponÃ­vel
            if (oficinaId) {
                whereClause.oficinaId = oficinaId; // CAMPO Ã‰ oficinaId (camelCase)
            }

            cliente = await prisma.cliente.findFirst({
                where: whereClause,
                include: {
                    veiculos: true
                }
            });

            // Se nÃ£o encontrou, buscar clientes similares para sugestÃ£o (FILTRADO POR OFICINA)
            if (!cliente) {
                const palavrasBusca = entidades.cliente.split(' ').filter(p => p.length > 2);

                if (palavrasBusca.length > 0) {
                    const whereSugestoes = {
                        OR: palavrasBusca.map(palavra => ({
                            nomeCompleto: {
                                contains: palavra,
                                mode: 'insensitive'
                            }
                        }))
                    };

                    // Adicionar filtro de oficina
                    if (oficinaId) {
                        whereSugestoes.oficinaId = oficinaId; // CAMPO Ã‰ oficinaId (camelCase)
                    }

                    clientesSugeridos = await prisma.cliente.findMany({
                        where: whereSugestoes,
                        include: {
                            veiculos: true
                        },
                        take: 5
                    });
                }
            }
        } else if (entidades.placa) {
            const veiculo = await prisma.veiculo.findFirst({
                where: {
                    placa: entidades.placa
                },
                include: {
                    cliente: {
                        include: {
                            veiculos: true
                        }
                    }
                }
            });
            cliente = veiculo?.cliente;
        }

        // Se nÃ£o encontrou cliente, mostrar sugestÃµes ou listar todos
        if (!cliente) {
            if (clientesSugeridos.length > 0) {
                // Formatar opÃ§Ãµes para seleÃ§Ã£o no frontend
                const options = clientesSugeridos.map((c) => ({
                    id: c.id,
                    label: c.nomeCompleto,
                    subtitle: c.telefone || 'Sem telefone',
                    details: c.veiculos.length > 0
                        ? [`ðŸš— ${c.veiculos.map(v => `${v.marca} ${v.modelo}`).join(', ')}`]
                        : ['Sem veÃ­culos cadastrados'],
                    value: `Buscar cliente ${c.nomeCompleto}` // Mensagem que serÃ¡ enviada ao selecionar
                }));

                return {
                    success: false,
                    response: `ðŸ” **Encontrei ${clientesSugeridos.length} clientes com nome similar a "${entidades.cliente}"**\n\nEscolha o cliente correto abaixo:`,
                    tipo: 'multiplos',
                    metadata: {
                        options: options,
                        selectionTitle: 'Clientes encontrados:'
                    }
                };
            }

            // Se nÃ£o tem sugestÃµes, listar alguns clientes recentes (FILTRADO POR OFICINA)
            const whereClientesRecentes = oficinaId ? { oficinaId } : {};

            const clientesRecentes = await prisma.cliente.findMany({
                where: whereClientesRecentes,
                include: {
                    veiculos: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            });

            console.log('   ðŸ“‹ Clientes recentes encontrados:', clientesRecentes.length);
            console.log('   ðŸ¢ Filtrado por oficinaId:', oficinaId || 'SEM FILTRO');

            if (clientesRecentes.length > 0) {
                return {
                    success: false,
                    response: `âŒ **Cliente nÃ£o encontrado**\n\n${entidades.cliente ? `NÃ£o encontrei "${entidades.cliente}" no sistema.` : 'Nenhum cliente especificado.'}\n\n**Clientes recentes cadastrados:**\n${clientesRecentes.map((c, i) => `${i + 1}. ${c.nomeCompleto}${c.veiculos.length > 0 ? `\n   ðŸš— ${c.veiculos.map(v => `${v.marca} ${v.modelo}`).join(', ')}` : ''}`).join('\n\n')}\n\nðŸ’¡ **OpÃ§Ãµes:**\nâ€¢ Digite o nome completo do cliente\nâ€¢ Ou cadastre um novo cliente primeiro`,
                    tipo: 'erro',
                    clientes_disponiveis: clientesRecentes
                };
            }

            return {
                success: false,
                response: `âŒ **Nenhum cliente cadastrado**\n\n${entidades.cliente ? `NÃ£o encontrei "${entidades.cliente}".` : ''}\n\nðŸ’¡ **Ã‰ necessÃ¡rio cadastrar o cliente primeiro:**\n1. Acesse "Clientes" no menu\n2. Clique em "Novo Cliente"\n3. Preencha os dados\n4. Depois volte aqui para agendar`,
                tipo: 'erro'
            };
        }

        // 4. BUSCAR VEÃCULO (com busca inteligente)
        let veiculo = null;

        if (entidades.placa) {
            // Busca por placa (mais precisa)
            veiculo = cliente.veiculos.find(v => v.placa === entidades.placa);
        } else if (entidades.veiculo) {
            // Busca por modelo (pode ter mÃºltiplos)
            const veiculosEncontrados = cliente.veiculos.filter(v =>
                v.modelo.toLowerCase().includes(entidades.veiculo.toLowerCase()) ||
                v.marca.toLowerCase().includes(entidades.veiculo.toLowerCase())
            );

            if (veiculosEncontrados.length === 1) {
                veiculo = veiculosEncontrados[0];
            } else if (veiculosEncontrados.length > 1) {
                // Formatar opÃ§Ãµes para seleÃ§Ã£o no frontend
                const options = veiculosEncontrados.map((v) => ({
                    id: v.id,
                    label: `${v.marca} ${v.modelo} ${v.anoModelo || ''}`,
                    subtitle: `Placa: ${v.placa}`,
                    details: v.cor ? [`Cor: ${v.cor}`] : [],
                    value: `Agendar para o veÃ­culo ${v.placa}` // Mensagem que serÃ¡ enviada
                }));

                return {
                    success: false,
                    response: `ðŸš— **Encontrei ${veiculosEncontrados.length} veÃ­culos "${entidades.veiculo}" para ${cliente.nomeCompleto}**\n\nEscolha o veÃ­culo correto abaixo:`,
                    tipo: 'multiplos',
                    metadata: {
                        options: options,
                        selectionTitle: 'VeÃ­culos do cliente:'
                    }
                };
            }
        }

        // Se nÃ£o encontrou e o cliente tem veÃ­culos, listar para escolha
        if (!veiculo && cliente.veiculos.length > 0) {
            // Se tem apenas 1 veÃ­culo, usar automaticamente
            if (cliente.veiculos.length === 1) {
                veiculo = cliente.veiculos[0];
                console.log(`   âœ… Ãšnico veÃ­culo do cliente selecionado automaticamente: ${veiculo.marca} ${veiculo.modelo}`);
            } else {
                // Formatar opÃ§Ãµes para seleÃ§Ã£o no frontend
                const options = cliente.veiculos.map((v) => ({
                    id: v.id,
                    label: `${v.marca} ${v.modelo} ${v.anoModelo || ''}`,
                    subtitle: `Placa: ${v.placa}`,
                    details: v.cor ? [`Cor: ${v.cor}`] : [],
                    value: `Agendar para o veÃ­culo ${v.placa} do cliente ${cliente.nomeCompleto}`
                }));

                return {
                    success: false,
                    response: `ðŸš— **${entidades.veiculo ? `VeÃ­culo "${entidades.veiculo}" nÃ£o encontrado.` : 'Qual veÃ­culo deseja agendar?'}**\n\n**Cliente:** ${cliente.nomeCompleto}\n\nEscolha o veÃ­culo abaixo:`,
                    tipo: 'pergunta',
                    metadata: {
                        options: options,
                        selectionTitle: 'VeÃ­culos disponÃ­veis:'
                    },
                    opcoes: cliente.veiculos
                };
            }
        }

        if (!veiculo) {
            return {
                success: false,
                response: `âŒ **Nenhum veÃ­culo cadastrado**\n\n**Cliente:** ${cliente.nomeCompleto}\n\nðŸ’¡ **Ã‰ necessÃ¡rio cadastrar um veÃ­culo primeiro:**\n1. Acesse "Clientes" no menu\n2. Selecione "${cliente.nomeCompleto}"\n3. Adicione um veÃ­culo\n4. Depois volte aqui para agendar`,
                tipo: 'erro',
                cliente_id: cliente.id
            };
        }

        // 5. CALCULAR DATA E HORA
        let dataAgendamento;

        if (entidades.dataEspecifica) {
            dataAgendamento = entidades.dataEspecifica;
        } else if (entidades.diaSemana) {
            dataAgendamento = NLPService.calcularProximaData(entidades.diaSemana);
        } else {
            return {
                success: false,
                response: 'ðŸ“… **Qual dia deseja agendar?**\n\nExemplos: "segunda", "terÃ§a", "20/10"',
                tipo: 'pergunta'
            };
        }

        const dataHora = new Date(`${dataAgendamento}T${entidades.hora}:00`);

        // Validar se a data nÃ£o estÃ¡ no passado
        if (dataHora < new Date()) {
            return {
                success: false,
                response: `âŒ **Data invÃ¡lida**\n\nA data ${NLPService.formatarDataAmigavel(dataAgendamento)} Ã s ${entidades.hora} jÃ¡ passou.\n\nðŸ’¡ Escolha uma data futura.`,
                tipo: 'erro'
            };
        }

        // 6. VERIFICAR DISPONIBILIDADE (scoped by oficina)
        const conflito = await prisma.agendamento.findFirst({
            where: {
                oficinaId,
                dataHora: dataHora,
                status: {
                    not: 'CANCELED'
                }
            },
            include: {
                cliente: true
            }
        });

        if (conflito) {
            return {
                success: false,
                response: `â° **HorÃ¡rio ocupado**\n\n${NLPService.formatarDataAmigavel(dataAgendamento)} Ã s ${entidades.hora} jÃ¡ estÃ¡ reservado para ${conflito.cliente.nomeCompleto}.\n\n**HorÃ¡rios disponÃ­veis no mesmo dia:**\nâ€¢ 08:00\nâ€¢ 10:00\nâ€¢ 14:00\nâ€¢ 16:00\n\nðŸ’¡ Qual horÃ¡rio prefere?`,
                tipo: 'conflito',
                horarios_disponiveis: ['08:00', '10:00', '14:00', '16:00']
            };
        }

        // 7. CRIAR AGENDAMENTO! âœ…
        const agendamento = await AgendamentosService.criarAgendamento({
            oficinaId,
            clienteId: cliente.id,
            veiculoId: veiculo.id,
            dataHora: dataHora,
            tipo: entidades.urgente ? 'urgente' : 'normal',
            status: 'CONFIRMED',
            origem: 'AI_CHAT',
            observacoes: `Agendamento via IA: ${mensagem}`,
            criadoPor: usuario_id || 'matias'
        });

        // 8. CONFIRMAR COM DETALHES
        const dataFormatada = NLPService.formatarDataAmigavel(dataAgendamento);

        return {
            success: true,
            response: `âœ… **Agendamento Confirmado!**\n\nðŸ“‹ **Protocolo:** #${agendamento.id}\n\nðŸ‘¤ **Cliente:** ${cliente.nomeCompleto}\nðŸ“ž **Telefone:** ${cliente.telefone || 'NÃ£o cadastrado'}\n\nðŸš— **VeÃ­culo:** ${veiculo.marca} ${veiculo.modelo}\nðŸ”– **Placa:** ${veiculo.placa}${veiculo.cor ? `\nðŸŽ¨ **Cor:** ${veiculo.cor}` : ''}\n\nðŸ“… **Data:** ${dataFormatada}\nâ° **HorÃ¡rio:** ${entidades.hora}\nðŸ”§ **ServiÃ§o:** ${entidades.servico || 'ServiÃ§o Geral'}\n\n${entidades.urgente ? 'ðŸš¨ **Urgente** - Priorizado\n\n' : ''}ðŸ’¬ ${cliente.nomeCompleto.split(' ')[0]} receberÃ¡ confirmaÃ§Ã£o por WhatsApp.`,
            tipo: 'confirmacao',
            agendamento_id: agendamento.id,
            metadata: {
                cliente_id: cliente.id,
                veiculo_id: veiculo.id,
                data: dataAgendamento,
                hora: entidades.hora
            }
        };

    } catch (error) {
        console.error('âŒ Erro em processarAgendamento:', error);
        return {
            success: false,
            response: `âŒ **Erro ao processar agendamento**\n\n${error.message}\n\nðŸ’¡ Por favor, tente novamente ou contate o suporte.`,
            tipo: 'erro'
        };
    }
}

// ============================================================================
// ðŸ” FUNÃ‡ÃƒO: PROCESSAR CONSULTA OS
// ============================================================================

async function processarConsultaOS(mensagem, oficinaId = null) {
    try {
        const dados = NLPService.extrairDadosConsultaOS(mensagem);
        console.log('   ?? Dados para consulta OS:', dados);

        if (!oficinaId) {
            return {
                success: false,
                response: '? **Erro:** Nao foi possivel identificar sua oficina.',
                tipo: 'erro'
            };
        }

        const where = {};
        if (oficinaId) {
            where.oficinaId = oficinaId;
        }

        if (dados.numeroOS) {
            const numeroStr = String(dados.numeroOS);
            where.OR = [
                { numeroOs: { contains: numeroStr, mode: 'insensitive' } },
                { id: numeroStr }
            ];
        }

        if (dados.placa) {
            where.veiculo = {
                placa: {
                    contains: dados.placa,
                    mode: 'insensitive'
                }
            };
        }

        if (dados.cliente) {
            where.cliente = {
                nomeCompleto: {
                    contains: dados.cliente,
                    mode: 'insensitive'
                }
            };
        }

        if (dados.status) {
            const statusNormalizado = dados.status === 'CONCLUIDO' ? 'FINALIZADO' : dados.status;
            where.status = statusNormalizado;
        }

        const ordensServico = await prisma.servico.findMany({
            where,
            include: {
                cliente: true,
                veiculo: true
            },
            orderBy: {
                dataEntrada: 'desc'
            },
            take: 10
        });

        if (ordensServico.length === 0) {
            return {
                success: false,
                response: 'Nenhuma ordem de servico encontrada. Verifique os dados e tente novamente.',
                tipo: 'vazio'
            };
        }

        const lista = ordensServico.map((os, i) =>
            `${i + 1}. OS #${os.numeroOs || os.id} - ${os.cliente?.nomeCompleto || 'Cliente nao informado'}\n` +
            `   Veiculo: ${os.veiculo?.marca || ''} ${os.veiculo?.modelo || ''} (${os.veiculo?.placa || 'Sem placa'})\n` +
            `   Status: ${os.status}\n` +
            `   Entrada: ${new Date(os.dataEntrada).toLocaleDateString('pt-BR')}`
        ).join('\n\n');

        return {
            success: true,
            response: `Ordens de Servico Encontradas (${ordensServico.length})\n\n${lista}`,
            tipo: 'lista',
            total: ordensServico.length,
            ordensServico
        };

    } catch (error) {
        console.error('? Erro em processarConsultaOS:', error);
        return {
            success: false,
            response: 'Erro ao consultar ordens de servico',
            tipo: 'erro'
        };
    }
}
// ============================================================================
// ðŸ“¦ FUNÃ‡ÃƒO: PROCESSAR CONSULTA ESTOQUE
// ============================================================================

async function processarConsultaEstoque(mensagem) {
    try {
        // Implementar lÃ³gica de consulta de estoque
        return {
            success: true,
            response: 'ðŸ“¦ **Consulta de Estoque**\n\nFuncionalidade em desenvolvimento.',
            tipo: 'info'
        };
    } catch (error) {
        return {
            success: false,
            response: 'âŒ Erro ao consultar estoque',
            tipo: 'erro'
        };
    }
}

// ============================================================================
// ðŸ“Š FUNÃ‡ÃƒO: PROCESSAR ESTATÃSTICAS
// ============================================================================

async function processarEstatisticas(mensagem, oficinaId = null) {
    try {
        if (!oficinaId) {
            return {
                success: false,
                response: '? **Erro:** Nao foi possivel identificar sua oficina.',
                tipo: 'erro'
            };
        }

        const stats = await ConsultasOSService.obterResumoOfficina('hoje', oficinaId);

        return {
            success: true,
            response: `?? **Estat?sticas de Hoje**

? **Ordens de Servi?o:** ${stats.total_os || 0}
? **Agendamentos:** ${stats.agendamentos || 0}
? **Clientes Atendidos:** ${stats.clientes || 0}
? **Receita:** R$ ${(stats.receita || 0).toFixed(2)}`,
            tipo: 'estatisticas',
            stats
        };
    } catch (error) {
        console.error('? Erro em processarEstatisticas:', error);
        return {
            success: false,
            response: '? Erro ao buscar estatisticas',
            tipo: 'erro'
        };
    }
}
// ============================================================================
// ðŸ‘¤ FUNÃ‡ÃƒO: PROCESSAR CONSULTA CLIENTE
// ============================================================================

async function processarConsultaCliente(mensagem, contexto_ativo = null, usuario_id = null, oficinaId = null) {
    try {
        console.log('?? DEBUG: processarConsultaCliente - Mensagem recebida:', mensagem);
        console.log('?? DEBUG: processarConsultaCliente - Contexto ativo:', contexto_ativo);
        console.log('?? DEBUG: processarConsultaCliente - Usuario ID:', usuario_id);

        if (!oficinaId && usuario_id) {
            const usuario = await prisma.user.findUnique({
                where: { id: String(usuario_id) },
                select: { oficinaId: true }
            });
            oficinaId = usuario?.oficinaId;
        }

        if (!oficinaId) {
            return {
                success: false,
                response: '? **Erro:** Nao foi possivel identificar sua oficina.',
                tipo: 'erro'
            };
        }

        const mensagemTrimmed = mensagem.trim();
        console.log('?? DEBUG: Mensagem apos trim:', mensagemTrimmed);

        if (mensagemTrimmed.match(/^\d+$/)) {
            console.log('?? DEBUG: Detectado numero, tentando selecao de cliente');
            const numeroDigitado = parseInt(mensagemTrimmed);

            if (usuario_id) {
                const dadosCache = await CacheService.get(`contexto_cliente:${usuario_id}`);

                if (dadosCache) {
                    const clientes = dadosCache.clientes;
                    console.log('?? DEBUG: Clientes no cache:', clientes.length);

                    if (numeroDigitado >= 1 && numeroDigitado <= clientes.length) {
                        const clienteSelecionado = clientes[numeroDigitado - 1];
                        console.log('?? DEBUG: Cliente selecionado:', clienteSelecionado.nomeCompleto);

                        await CacheService.delete(`contexto_cliente:${usuario_id}`);

                        return {
                            success: true,
                            response: `? **Cliente selecionado:** ${clienteSelecionado.nomeCompleto}

Telefone: ${clienteSelecionado.telefone || 'Nao informado'}
CPF/CNPJ: ${clienteSelecionado.cpfCnpj || 'Nao informado'}
Veiculos: ${clienteSelecionado.veiculos && clienteSelecionado.veiculos.length > 0 ? clienteSelecionado.veiculos.map(v => v.modelo).join(', ') : 'Nenhum veiculo cadastrado'}

?? O que deseja fazer com este cliente?
? "agendar" - Agendar servico
? "editar" - Editar dados
? "historico" - Ver historico de servicos`,
                            tipo: 'cliente_selecionado',
                            cliente: clienteSelecionado,
                            cliente_id: clienteSelecionado.id
                        };
                    } else {
                        console.log('?? DEBUG: Numero fora do intervalo:', numeroDigitado);
                        return {
                            success: false,
                            response: `? **Numero invalido:** ${numeroDigitado}

Por favor, escolha um numero entre 1 e ${clientes.length}.`,
                            tipo: 'erro'
                        };
                    }
                } else {
                    console.log('?? DEBUG: Cache expirado ou nao encontrado para o usuario:', usuario_id);
                    await CacheService.delete(`contexto_cliente:${usuario_id}`);
                }
            } else {
                console.log('?? DEBUG: Nenhum cache encontrado para o usuario ou usuario nao informado');
            }
        }

        const padraoNome = /(?:nome|cliente|dados do cliente|consultar cliente|buscar cliente|telefone|cpf|cnpj):?\s*([A-Z?-?a-z0-9\s-]+)/i;
        let termoBusca = null;
        const matchNome = mensagem.match(padraoNome);

        if (matchNome) {
            termoBusca = matchNome[1].trim();
            console.log('?? DEBUG: Termo de busca extra?do do padr?o:', termoBusca);
        } else {
            termoBusca = mensagem.trim();
            console.log('?? DEBUG: Termo de busca usando mensagem completa:', termoBusca);
        }

        if (!termoBusca || termoBusca.length < 2) {
            console.log('?? DEBUG: Termo de busca invalido ou muito curto');
            return {
                success: false,
                response: '? Informe o nome, telefone ou CPF do cliente para consultar.',
                tipo: 'erro'
            };
        }

        console.log('?? DEBUG: Iniciando busca no banco de dados para:', termoBusca);

        const clientes = await prisma.cliente.findMany({
            where: {
                oficinaId,
                OR: [
                    { nomeCompleto: { contains: termoBusca, mode: 'insensitive' } },
                    { telefone: { contains: termoBusca } },
                    { cpfCnpj: { contains: termoBusca } }
                ]
            },
            include: { veiculos: true },
            take: 10
        });

        console.log('?? DEBUG: Resultado da busca - encontrados:', clientes.length, 'clientes');
        if (clientes.length > 0) {
            console.log('?? DEBUG: Clientes encontrados:', clientes.map(c => c.nomeCompleto));
        }

        if (clientes.length === 0) {
            console.log('?? DEBUG: Nenhum cliente encontrado para o termo de busca:', termoBusca);
            return {
                success: false,
                response: `? Nenhum cliente encontrado para "${termoBusca}".

Tente informar nome completo, telefone ou CPF.`,
                tipo: 'erro'
            };
        }

        if (usuario_id) {
            await CacheService.set(`contexto_cliente:${usuario_id}`, {
                clientes: clientes,
                timestamp: Date.now()
            }, 600);
            console.log('?? DEBUG: Clientes armazenados no cache para usuario:', usuario_id);
        }

        let resposta = 'Clientes encontrados:\n\n';
        clientes.forEach((c, idx) => {
            resposta += `${idx + 1}. ${c.nomeCompleto}\n`;
            resposta += `   Telefone: ${c.telefone || 'Nao informado'}\n`;
            resposta += `   CPF/CNPJ: ${c.cpfCnpj || 'Nao informado'}\n`;
            if (c.veiculos && c.veiculos.length > 0) {
                resposta += `   Veiculos: ${c.veiculos.map(v => v.modelo).join(', ')}\n`;
            }
            resposta += '\n';
        });

        resposta += 'Digite o numero do cliente para selecionar ou "agendar" para iniciar um agendamento.';

        return {
            success: true,
            response: resposta,
            tipo: 'consulta_cliente',
            metadata: {
                clientes: clientes,
                options: clientes.map((c, idx) => ({
                    id: c.id,
                    label: c.nomeCompleto,
                    subtitle: c.telefone || 'Sem telefone',
                    details: c.veiculos && c.veiculos.length > 0 ? [`?? ${c.veiculos.map(v => `${v.marca} ${v.modelo}`).join(', ')}`] : [],
                    value: (idx + 1).toString()
                })),
                selectionTitle: 'Clientes encontrados:'
            },
            contexto_ativo: 'buscar_cliente'
        };
    } catch (error) {
        console.error('? Erro em processarConsultaCliente:', error.message);
        return {
            success: false,
            response: '? Erro ao consultar cliente',
            tipo: 'erro'
        };
    }
}
// ============================================================================
// ðŸ’¬ FUNÃ‡ÃƒO: PROCESSAR CONVERSA GERAL
// ============================================================================

async function processarConversaGeral(mensagem, usuario_id = null) {
    // ðŸ¤– Se Agno estiver configurado, SEMPRE tentar chamar
    if (AGNO_IS_CONFIGURED) {
        try {
            console.log('   ðŸ¤– Chamando Agno AI para conversa geral');
            const agnoResponse = await chamarAgnoAI(mensagem, usuario_id, 'CONVERSA_GERAL', null);
            return agnoResponse;
        } catch (agnoError) {
            const isTimeout = agnoError.message.includes('timeout');
            const errorType = isTimeout ? 'â±ï¸ Timeout' : 'âŒ Erro';
            console.error(`   âš ï¸ Agno falhou (${errorType}), usando fallback:`, agnoError.message);

            // Fallback: resposta genÃ©rica com informaÃ§Ã£o sobre o erro
            const fallbackMessage = isTimeout
                ? `ðŸ¤– **Assistente Matias**\n\nâš ï¸ _O assistente avanÃ§ado estÃ¡ iniciando (pode levar atÃ© 50 segundos no primeiro acesso)._\n\nEnquanto isso, como posso ajudar?\n\nðŸ’¡ Digite "ajuda" para ver o que posso fazer!`
                : `ðŸ¤– **Assistente Matias**\n\nComo posso ajudar?\n\nðŸ’¡ Digite "ajuda" para ver o que posso fazer!`;

            return {
                success: true,
                response: fallbackMessage,
                tipo: 'conversa',
                mode: 'fallback',
                agno_error: agnoError.message,
                is_timeout: isTimeout
            };
        }
    }

    // SenÃ£o, resposta genÃ©rica local
    return {
        success: true,
        response: 'ðŸ¤– **Assistente Matias**\n\nComo posso ajudar?\n\nðŸ’¡ Digite "ajuda" para ver o que posso fazer!',
        tipo: 'conversa',
        mode: 'local',
        agno_configured: false
    };
}

// ============================================================================
// ðŸ‘¤ FUNÃ‡ÃƒO: PROCESSAR CADASTRO DE CLIENTE
// ============================================================================

async function processarCadastroCliente(mensagem, usuario_id, oficinaId = null) {
    try {
        if (!oficinaId && usuario_id) {
            const usuario = await prisma.user.findUnique({
                where: { id: String(usuario_id) },
                select: { oficinaId: true }
            });
            oficinaId = usuario?.oficinaId;
        }

        if (!oficinaId) {
            return {
                success: false,
                response: '? **Erro:** Nao foi possivel identificar sua oficina.',
                tipo: 'erro'
            };
        }

        const dados = NLPService.extrairDadosCliente(mensagem);

        console.log('   ?? Dados extra?dos:', dados);

        if (!dados.nome || dados.nome.length < 3) {
            return {
                success: false,
                response: `?? **Para cadastrar um novo cliente, preciso dos seguintes dados:**

? **Nome completo**
? Telefone (opcional)
? CPF/CNPJ (opcional)
? Email (opcional)

**Exemplo:**
"Nome: Jo?o Silva, Tel: (85) 99999-9999, CPF: 123.456.789-00"

**Ou informe apenas o nome para cadastro rapido:**
"Cadastrar cliente Jo?o Silva"`,
                tipo: 'cadastro',
                dadosExtraidos: dados
            };
        }

        const clienteExistente = await prisma.cliente.findFirst({
            where: {
                nomeCompleto: {
                    equals: dados.nome,
                    mode: 'insensitive'
                },
                oficinaId
            }
        });

        if (clienteExistente) {
            return {
                success: false,
                response: `?? **Cliente ja cadastrado!**

**Nome:** ${clienteExistente.nomeCompleto}
**Telefone:** ${clienteExistente.telefone || 'Nao informado'}
**CPF/CNPJ:** ${clienteExistente.cpfCnpj || 'Nao informado'}

?? Clique no formulario para editar ou adicionar mais informacoes.`,
                tipo: 'alerta',
                cliente: clienteExistente,
                dadosExtraidos: {
                    nome: clienteExistente.nomeCompleto,
                    telefone: clienteExistente.telefone,
                    cpfCnpj: clienteExistente.cpfCnpj,
                    email: clienteExistente.email
                }
            };
        }

        return {
            success: false,
            response: `?? **Detectei os seguintes dados. Por favor, revise e complete no formulario:**

**Nome:** ${dados.nome}
${dados.telefone ? `**Telefone:** ${dados.telefone}` : '? Telefone (recomendado)'}
${dados.cpfCnpj ? `**CPF/CNPJ:** ${dados.cpfCnpj}` : '? CPF/CNPJ (recomendado)'}
${dados.email ? `**Email:** ${dados.email}` : '? Email (opcional)'}

? Clique no formulario que abriu para revisar e salvar o cadastro.`,
            tipo: 'cadastro',
            dadosExtraidos: dados
        };

    } catch (error) {
        console.error('? Erro ao processar cadastro:', error);
        return {
            success: false,
            response: 'Erro ao cadastrar cliente. Tente novamente ou cadastre manualmente na tela de clientes.',
            tipo: 'erro'
        };
    }
}
// ============================================================
// ENDPOINTS PARA INTEGRAÃ‡ÃƒO COM AGNO - FUNCIONALIDADES MATIAS
// ============================================================

// Endpoint para o Agno consultar Ordens de ServiÃ§o
router.post('/consultar-os', verificarAuth, async (req, res) => {
    try {
        const { veiculo, proprietario, status, periodo } = req.body;
        const oficinaId = req.user?.oficinaId;

        if (!oficinaId) {
            return res.status(401).json({
                success: false,
                error: 'Oficina nao identificada'
            });
        }

        if (!ensureDatabaseConfigured(res)) {
            return;
        }

        console.log('?? Agno consultando OS:', { veiculo, proprietario, status, periodo, oficinaId });

        const resultados = await ConsultasOSService.consultarOS(oficinaId, {
            veiculo,
            proprietario,
            status,
            periodo
        });

        res.json({
            success: true,
            total: resultados.length,
            ordens_servico: resultados,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('? Erro na consulta OS:', error);
        const response = {
            success: false,
            error: 'Erro ao consultar ordens de servico'
        };
        if (process.env.NODE_ENV === 'development') {
            response.message = error.message;
        }
        res.status(500).json(response);
    }
});

// Endpoint para o Agno agendar serviÃ§os
router.post('/agendar-servico', verificarAuth, async (req, res) => {
    try {
        const { cliente, veiculo, servico, data_hora, descricao } = req.body;
        const oficinaId = req.user?.oficinaId;

        if (!oficinaId) {
            return res.status(401).json({
                success: false,
                error: 'Oficina nao identificada'
            });
        }

        if (!ensureDatabaseConfigured(res)) {
            return;
        }

        if (!cliente?.id || !veiculo?.id || !data_hora) {
            return res.status(400).json({
                success: false,
                error: 'cliente, veiculo e data_hora sao obrigatorios'
            });
        }

        console.log('📅 Agno agendando servico:', { cliente, veiculo, servico, data_hora, oficinaId });

        const agendamento = await AgendamentosService.criarAgendamento({
            oficinaId,
            clienteId: cliente.id,
            veiculoId: veiculo.id,
            dataHora: new Date(data_hora),
            tipo: 'normal',
            status: 'PENDING',
            origem: 'AI_CHAT',
            observacoes: descricao || `Serviço ${servico} agendado via Agno`,
            criadoPor: req.user?.id || 'matias'
        });

        res.json({
            success: true,
            agendamento,
            mensagem: `Servi?o ${servico} agendado para ${new Date(data_hora).toLocaleString('pt-BR')}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('? Erro no agendamento:', error);
        const response = {
            success: false,
            error: 'Erro ao agendar servico'
        };
        if (process.env.NODE_ENV === 'development') {
            response.message = error.message;
        }
        res.status(500).json(response);
    }
});

// Endpoint para o Agno consultar estatÃ­sticas
router.get('/estatisticas', verificarAuth, async (req, res) => {
    try {
        const { periodo = '30_dias' } = req.query;
        const oficinaId = req.user?.oficinaId;

        if (!oficinaId) {
            return res.status(401).json({
                success: false,
                error: 'Oficina nao identificada'
            });
        }

        if (!ensureDatabaseConfigured(res)) {
            return;
        }

        console.log('?? Agno consultando estatisticas:', { periodo, oficinaId });

        const stats = await ConsultasOSService.obterEstatisticas(oficinaId, periodo);

        res.json({
            success: true,
            periodo,
            estatisticas: stats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('? Erro nas estatisticas:', error);
        const response = {
            success: false,
            error: 'Erro ao consultar estatisticas'
        };
        if (process.env.NODE_ENV === 'development') {
            response.message = error.message;
        }
        res.status(500).json(response);
    }
});

// Endpoint para o Agno salvar conversas
router.post('/salvar-conversa', verificarAuth, async (req, res) => {
    try {
        const { usuario_id, mensagem, resposta, contexto } = req.body;
        const requestUserId = req.user?.id || req.user?.userId;

        if (!requestUserId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario nao autenticado'
            });
        }

        const effectiveUserId = usuario_id ? String(usuario_id) : String(requestUserId);
        if (String(effectiveUserId) !== String(requestUserId)) {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }

        if (!mensagem?.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem ? obrigatoria'
            });
        }

        const requestOficinaId = req.user?.oficinaId;
        if (!requestOficinaId) {
            return res.status(400).json({ success: false, error: 'Usuário sem oficina vinculada' });
        }

        console.log('📝 Agno salvando conversa:', { oficina: requestOficinaId, usuario_id: effectiveUserId, mensagem: mensagem?.substring(0, 50) });

        const conversa = await ConversasService.salvarConversa({
            oficinaId: requestOficinaId,
            usuarioId: effectiveUserId,
            pergunta: mensagem,
            resposta: resposta || '',
            contexto: JSON.stringify(contexto || {}),
            timestamp: new Date()
        });

        res.json({
            success: true,
            conversa_id: conversa.sessionId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('? Erro ao salvar conversa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao salvar conversa',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// Endpoint para o Agno recuperar histÃ³rico de conversas
router.get('/historico-conversas/:usuario_id', verificarAuth, async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { limite = 10 } = req.query;
        const requestUserId = req.user?.id || req.user?.userId;

        if (!requestUserId) {
            return res.status(401).json({
                success: false,
                error: 'Usuario nao autenticado'
            });
        }

        if (usuario_id && usuario_id !== String(requestUserId)) {
            return res.status(403).json({
                success: false,
                error: 'Acesso nao autorizado ao historico deste usuario'
            });
        }

        const requestOficinaId = req.user?.oficinaId;
        if (!requestOficinaId) {
            return res.status(400).json({ success: false, error: 'Usuário sem oficina vinculada' });
        }

        console.log('📖 Agno recuperando historico:', { oficina: requestOficinaId, usuario_id: requestUserId, limite });

        const historico = await ConversasService.obterHistorico(requestOficinaId, String(requestUserId), parseInt(limite));

        res.json({
            success: true,
            usuario_id: String(requestUserId),
            total: historico.length,
            conversas: historico,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('? Erro no historico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao recuperar historico',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// Endpoint para fornecer contexto do sistema ao Agno
router.get('/contexto-sistema', verificarAuth, async (req, res) => {
    try {
        const contexto = {
            sistema: "OFIX - Sistema de Oficina Automotiva",
            versao: "2024.1",
            assistente: "Matias",
            capacidades: [
                "Consultar ordens de serviÃ§o por veÃ­culo, proprietÃ¡rio ou status",
                "Agendar novos serviÃ§os com data e hora especÃ­ficas",
                "Calcular orÃ§amentos baseados em peÃ§as e mÃ£o de obra",
                "Consultar histÃ³rico completo de veÃ­culos",
                "Gerar relatÃ³rios de produtividade da oficina",
                "Buscar peÃ§as no estoque com preÃ§os atualizados",
                "Acompanhar status de serviÃ§os em andamento"
            ],
            exemplos_uso: {
                consulta_os: "Mostrar todas as ordens de serviÃ§o do Gol 2020 prata",
                agendamento: "Agendar revisÃ£o para o Civic do JoÃ£o na prÃ³xima segunda Ã s 14h",
                estatisticas: "Quantos carros atendemos este mÃªs?"
            },
            timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            contexto
        });

    } catch (error) {
        console.error('âŒ Erro no contexto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter contexto do sistema'
        });
    }
});

// Middleware para verificar autenticaÃ§Ã£o
function verificarAuth(req, res, next) {
    return protectRoute(req, res, next);
}

// Health check do agente Agno
  router.get('/health', verificarAuth, async (req, res) => {
      try {
          console.log('ðŸ” Verificando status do agente Agno...');
  
          if (!AGNO_IS_CONFIGURED) {
              return res.status(503).json({
                  status: 'disabled',
                  message: 'AGNO_API_URL nao configurada',
                  timestamp: new Date().toISOString()
              });
          }
  
          const health = await fetchAgnoHealth({ timeoutMs: AGNO_HEALTH_TIMEOUT_MS });
  
          if (health.ok) {
              console.log('âœ… Agente Agno online:', health.data);
  
              res.json({
                  status: 'online',
                  agno_status: health.data,
                  health,
                  timestamp: new Date().toISOString()
              });
          } else {
              console.log('âš ï¸ Agente Agno retornou erro:', health.status);
              res.status(503).json({
                  status: 'erro',
                  message: 'Agente nÃ£o disponÃ­vel',
                  health
              });
          }
      } catch (error) {
          console.error('âŒ Erro ao conectar com agente Agno:', error.message);
          res.status(503).json({
            status: 'erro',
            message: 'ServiÃ§o temporariamente indisponÃ­vel',
            error: error.message
        });
    }
});

// Listar agentes disponÃ­veis
router.get('/agents', verificarAuth, async (req, res) => {
    try {
        console.log('ðŸ“‹ Listando agentes disponÃ­veis...');

        if (!AGNO_IS_CONFIGURED) {
            return res.status(503).json({
                success: false,
                error: 'AGNO_API_URL nao configurada'
            });
        }
        const { response, base_url, tried_urls } = await fetchAgnoWithFallback('/agents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAgnoAuthHeaders()
            },
            timeoutMs: AGNO_HEALTH_TIMEOUT_MS
        });

        if (response.ok) {
            const data = await response.json();
            console.log('ðŸ“‹ Agentes encontrados:', data.length);

            res.json({
                success: true,
                agents: data,
                count: data.length,
                base_url,
                tried_urls
            });
        } else {
            const errorData = await response.text();
            console.error('âŒ Erro ao listar agentes:', response.status, errorData);
            res.status(response.status).json({
                error: 'Erro ao listar agentes',
                details: errorData
            });
        }
    } catch (error) {
        console.error('âŒ Erro ao conectar para listar agentes:', error.message);
        res.status(500).json({
            error: 'Erro interno do servidor',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// Chat com o agente Agno
router.post('/chat', verificarAuth, async (req, res) => {
    try {
        const { message, agent_id, session_id, contexto_ativo } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem Ã© obrigatÃ³ria' });
        }

        lastActivity = Date.now();

        // Verificar se temos user_id vÃ¡lido
        const userId = req.user?.id || req.user?.userId;
        const oficinaId = req.user?.oficinaId;

        if (!userId || !oficinaId) {
            return res.status(401).json({ error: 'Usuario nao autenticado ou sem oficina vinculada' });
        }

        const sessionIdScoped = `of_${oficinaId}_user_${userId}`;
        const agentId = AGNO_DEFAULT_AGENT_ID;

        console.log('ðŸ’¬ [CHAT] Nova mensagem recebida:', {
            user: req.user.email,
            user_id: userId,
            message_len: message.length
        });

        // â­ NOVA ARQUITETURA MULTI-AGENTE
        // 1ï¸âƒ£ CLASSIFICA A MENSAGEM
        const classification = MessageClassifier.classify(message);
        console.log('ðŸŽ¯ [CLASSIFIER] Resultado:', {
            processor: classification.processor,
            type: classification.type,
            subtype: classification.subtype,
            confidence: classification.confidence,
            reason: classification.reason
        });

        // 2ï¸âƒ£ ROTEAMENTO INTELIGENTE
        let responseData;

        if (classification.processor === 'BACKEND_LOCAL') {
            // âš¡ PROCESSA LOCALMENTE (rÃ¡pido, confiÃ¡vel)
            console.log('âš¡ [BACKEND_LOCAL] Processando localmente...');
            const startTime = Date.now();

            responseData = await processarLocal(message, classification, userId, contexto_ativo, req);

            const duration = Date.now() - startTime;
            console.log(`âœ… [BACKEND_LOCAL] Processado em ${duration}ms`);

            // Adiciona metadata
            responseData.metadata = {
                ...responseData.metadata,
                processed_by: 'BACKEND_LOCAL',
                processing_time_ms: duration,
                classification: classification
            };

            if (responseData?.response) {
                const normalizedResponse = normalizarTextoResposta(responseData.response);
                responseData.response = normalizedResponse;
                responseData.conteudo = normalizarTextoResposta(responseData.conteudo || normalizedResponse);
            }

            return res.json({
                success: true,
                ...responseData
            });

        } else {
            // ðŸ§  ENVIA PARA AGNO AI (inteligente, conversacional)
            console.log('ðŸ§  [AGNO_AI] Enviando para Agno AI...');
            const startTime = Date.now();

            responseData = await processarComAgnoAI(message, userId, agentId, sessionIdScoped, { dependencies: { oficina_id: oficinaId, user_id: userId, role: req.user?.role || null, public: false } });

            const duration = Date.now() - startTime;
            console.log(`âœ… [AGNO_AI] Processado em ${duration}ms`);

            // Adiciona metadata
            if (responseData.metadata) {
                responseData.metadata.processed_by = 'AGNO_AI';
                responseData.metadata.processing_time_ms = duration;
                responseData.metadata.classification = classification;

                const modelName = String(responseData.metadata.model || '').toLowerCase();
                if (modelName.includes('fallback') || responseData.metadata.error) {
                    responseData.metadata.processed_by = 'BACKEND_LOCAL_FALLBACK';
                }
            }

            if (responseData?.response) {
                const normalizedResponse = normalizarTextoResposta(responseData.response);
                responseData.response = normalizedResponse;
                responseData.conteudo = normalizarTextoResposta(responseData.conteudo || normalizedResponse);
            }

            return res.json(responseData);
        }

    } catch (error) {
        console.error('âŒ [CHAT] Erro geral:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
});

// ============================================================
// ðŸ”§ FUNÃ‡Ã•ES AUXILIARES - PROCESSAMENTO LOCAL
// ============================================================

/**
 * Processa mensagem localmente (SEM Agno AI)
 */
async function processarLocal(message, classification, userId, contexto_ativo, req) {
    try {
        switch (classification.type) {
            case 'GREETING':
                // SaudaÃ§Ã£o instantÃ¢nea
                const usuario = req.user;
                return LocalResponse.formatarResposta(
                    LocalResponse.gerarSaudacao(usuario),
                    'greeting'
                );

            case 'HELP':
                // Menu de ajuda
                return LocalResponse.formatarResposta(
                    LocalResponse.gerarMenuAjuda(),
                    'help'
                );

            case 'ACTION':
                // AÃ§Ãµes estruturadas (CRUD)
                return await processarAcaoLocal(message, classification.subtype, userId, contexto_ativo, req.user?.oficinaId);

            default:
                // Fallback: envia para Agno AI
                console.log('âš ï¸ [BACKEND_LOCAL] Tipo nÃ£o reconhecido, enviando para Agno AI');
                return await processarComAgnoAI(message, userId);
        }
    } catch (error) {
        console.error('âŒ [BACKEND_LOCAL] Erro:', error);
        // Em caso de erro, tenta Agno AI como fallback
        return await processarComAgnoAI(message, userId);
    }
}

/**
 * Processa aÃ§Ãµes estruturadas localmente
 */
async function processarAcaoLocal(message, actionType, userId, contexto_ativo, oficinaId) {
    console.log(`ðŸ”§ [ACAO_LOCAL] Processando: ${actionType}`);

    try {
        switch (actionType) {
            case 'AGENDAMENTO':
                // â­ AGENDAMENTO LOCAL (10x mais rÃ¡pido) - NOVA IMPLEMENTAÃ‡ÃƒO
                return await AgendamentoLocal.processar(message, userId, contexto_ativo);

            case 'CONSULTA_OS':
                // Consulta de Ordem de ServiÃ§o (usa funÃ§Ã£o existente)
                return await processarConsultaOS(message, oficinaId);

            case 'CONSULTA_ESTOQUE':
                // Consulta de estoque (usa funÃ§Ã£o existente)
                return await processarConsultaEstoque(message);

            case 'CONSULTA_CLIENTE':
                // Consulta de cliente (usa funÃ§Ã£o existente)
                return await processarConsultaCliente(message, contexto_ativo, userId, oficinaId);

            case 'CADASTRO_CLIENTE':
                // Cadastro de cliente (usa funÃ§Ã£o existente)
                return await processarCadastroCliente(message, userId, oficinaId);

            case 'ESTATISTICAS':
                // EstatÃ­sticas (usa funÃ§Ã£o existente)
                return await processarEstatisticas(message, oficinaId);

            default:
                // AÃ§Ã£o nÃ£o implementada, envia para Agno AI
                console.log(`âš ï¸ [ACAO_LOCAL] AÃ§Ã£o ${actionType} nÃ£o implementada, enviando para Agno AI`);
                return await processarComAgnoAI(message, userId);
        }
    } catch (error) {
        console.error(`âŒ [ACAO_LOCAL] Erro ao processar ${actionType}:`, error);
        // Em caso de erro, tenta Agno AI como fallback
        return await processarComAgnoAI(message, userId);
    }
}

/**
 * ðŸ”‘ Gera chave de cache normalizada para mensagens
 */
function getCacheKey(message, userId) {
    return `${userId}:${message.toLowerCase().trim().substring(0, 100)}`;
}

/**
 * ðŸ§¹ Sanitiza dados para logs (LGPD compliance)
 */
function sanitizeForLog(text) {
    if (!text) return '';
    return String(text)
        .replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, 'CPF***')
        .replace(/\(\d{2}\)\s?\d{4,5}-\d{4}/g, 'TEL***')
        .replace(/\d{11}/g, 'TEL***')
        .substring(0, 150);
}

function normalizarTextoResposta(texto) {
    if (!texto || typeof texto !== 'string') return texto;

    // Corrige respostas com texto mojibake mais comum sem alterar respostas ja validas.
    const precisaNormalizar = /Ã.|â.|ðŸ|ï¸|Usu\?|n\?o|hist\?rico/i.test(texto);
    if (!precisaNormalizar) return texto;

    try {
        const decoded = Buffer.from(texto, 'latin1').toString('utf8');
        // Se a conversao introduzir caracteres de substituicao (�), nao piorar a resposta.
        if (decoded && decoded !== texto && !decoded.includes('\uFFFD')) {
            return decoded;
        }
    } catch (_) {
        // fallback para mapa manual abaixo
    }

    return texto
        .replace(/Usu\?rio/g, 'Usuario')
        .replace(/n\?o/g, 'nao')
        .replace(/hist\?rico/gi, 'historico')
        .replace(/servi\?o/gi, 'servico')
        .replace(/estat\?sticas/gi, 'estatisticas')
        .replace(/ap\?s/gi, 'apos')
        .replace(/sele\?\?o/gi, 'selecao');
}

/**
 * âœ… Middleware de validaÃ§Ã£o de mensagens
 */
function validateMessage(req, res, next) {
    const raw = req.body?.message;
    const message = typeof raw === 'string' ? raw.trim() : '';

    if (!message) {
        return res.status(400).json({ error: 'Mensagem obrigatoria' });
    }

    const maxDefault = parsePositiveInt(process.env.AGNO_MAX_MESSAGE_CHARS, 1000);
    const maxPublic = parsePositiveInt(process.env.AGNO_PUBLIC_MAX_MESSAGE_CHARS, Math.min(500, maxDefault));
    const max = req.path === '/chat-public' ? maxPublic : maxDefault;

    if (message.length > max) {
        return res.status(413).json({ error: 'Mensagem muito longa', max_chars: max });
    }

    // Normalize message for downstream handlers.
    req.body.message = message;
    next();
}

/**
 * ðŸ§  GET /api/agno/memories/:userId
 * Recupera memÃ³rias de um usuÃ¡rio especÃ­fico
 */
router.get('/memories/:userId', verificarAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // ðŸ” Validar que usuÃ¡rio sÃ³ acessa suas prÃ³prias memÃ³rias (seguranÃ§a)
        const requestUserId = req.user?.id || req.user?.userId;
        if (userId !== requestUserId.toString()) {
            console.warn(`âš ï¸ [MEMÃ“RIA] Tentativa de acesso nÃ£o autorizado - User ${requestUserId} tentou acessar memÃ³rias de ${userId}`);
            return res.status(403).json({
                success: false,
                error: 'Acesso negado - vocÃª sÃ³ pode ver suas prÃ³prias memÃ³rias'
            });
        }

        const agnoUserId = `user_${userId}`;
        console.log(`ðŸ” [MEMÃ“RIA] Buscando memÃ³rias para: ${agnoUserId}`);

        // Verificar se Agno AI estÃ¡ configurado
        if (!AGNO_IS_CONFIGURED) {
            return res.json({
                success: true,
                memories: [],
                total: 0,
                message: 'Sistema de memÃ³ria nÃ£o disponÃ­vel em modo de desenvolvimento'
            });
        }

        const { response, base_url, tried_urls } = await fetchAgnoWithFallback(
            `/memories?user_id=${encodeURIComponent(agnoUserId)}&limit=200&page=1`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(AGNO_API_TOKEN && { 'Authorization': `Bearer ${AGNO_API_TOKEN}` })
                },
                timeoutMs: 10000
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const memories = data.data || data.memories || data.results || [];
        const meta = data.meta || null;

        console.log(`âœ… [MEMÃ“RIA] ${memories.length} memÃ³rias encontradas para user_${userId}`);

        return res.json({
            success: true,
            memories: memories,
            total: memories.length,
            user_id: agnoUserId,
            meta,
            base_url,
            tried_urls
        });

    } catch (error) {
        console.error('âŒ [MEMÃ“RIA] Erro ao buscar memÃ³rias:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao buscar memÃ³rias do assistente',
            details: error.message
        });
    }
});

/**
 * ðŸ—‘ï¸ DELETE /api/agno/memories/:userId
 * Limpa as memÃ³rias de um usuÃ¡rio (LGPD/GDPR compliance)
 */
router.delete('/memories/:userId', verificarAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // ðŸ” Validar acesso
        const requestUserId = req.user?.id || req.user?.userId;
        if (userId !== requestUserId.toString()) {
            console.warn(`âš ï¸ [MEMÃ“RIA] Tentativa de exclusÃ£o nÃ£o autorizada - User ${requestUserId} tentou excluir memÃ³rias de ${userId}`);
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }

        const agnoUserId = `user_${userId}`;
        console.log(`ðŸ—‘ï¸ [MEMÃ“RIA] Excluindo memÃ³rias para: ${agnoUserId}`);

        // Verificar se Agno AI estÃ¡ configurado
        if (!AGNO_IS_CONFIGURED) {
            return res.json({
                success: true,
                message: 'Sistema de memÃ³ria nÃ£o disponÃ­vel em modo de desenvolvimento'
            });
        }

        // AgentOS delete is by memory_id(s). First list all memories for this user, then bulk-delete.
        const { response: listResponse, base_url, tried_urls } = await fetchAgnoWithFallback(
            `/memories?user_id=${encodeURIComponent(agnoUserId)}&limit=1000&page=1`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(AGNO_API_TOKEN && { 'Authorization': `Bearer ${AGNO_API_TOKEN}` })
                },
                timeoutMs: 15000
            }
        );

        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            throw new Error(`Falha ao listar memorias (HTTP ${listResponse.status}): ${errorText.substring(0, 200)}`);
        }

        const listData = await listResponse.json();
        const memories = listData.data || listData.memories || listData.results || [];
        const memoryIds = memories.map((m) => m.memory_id).filter(Boolean);

        if (!memoryIds.length) {
            return res.json({
                success: true,
                message: 'Nenhuma memoria para excluir.',
                deleted: 0,
                user_id: agnoUserId
            });
        }

        const { response, base_url: delete_base_url } = await fetchAgnoWithFallback('/memories', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(AGNO_API_TOKEN && { 'Authorization': `Bearer ${AGNO_API_TOKEN}` })
            },
            body: JSON.stringify({ memory_ids: memoryIds }),
            timeoutMs: 15000
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha ao excluir memorias (HTTP ${response.status}): ${errorText.substring(0, 200)}`);
        }

        console.log(`âœ… [MEMÃ“RIA] MemÃ³rias excluÃ­das com sucesso: ${memoryIds.length} para user_${userId}`);

        return res.json({
            success: true,
            message: 'MemÃ³rias excluÃ­das com sucesso. O assistente nÃ£o se lembrarÃ¡ mais das conversas anteriores.',
            deleted: memoryIds.length,
            user_id: agnoUserId,
            base_url: delete_base_url || base_url,
            tried_urls
        });

    } catch (error) {
        console.error('âŒ [MEMÃ“RIA] Erro ao excluir memÃ³rias:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao excluir memÃ³rias',
            details: error.message
        });
    }
});

/**
 * ðŸ“Š GET /api/agno/memory-status
 * Verifica se o sistema de memÃ³ria estÃ¡ ativo e funcionando
 */
router.get('/memory-status', verificarAuth, async (req, res) => {
    try {
        // Verificar se Agno AI estÃ¡ configurado
        const isConfigured = AGNO_IS_CONFIGURED;

        if (!isConfigured) {
            return res.json({
                enabled: false,
                status: 'disabled',
                message: 'Sistema de memÃ³ria nÃ£o disponÃ­vel em desenvolvimento'
            });
        }

        const health = await fetchAgnoHealth({ timeoutMs: AGNO_HEALTH_TIMEOUT_MS });
        const isOnline = health.ok;

        return res.json({
            enabled: isOnline,
            status: isOnline ? 'active' : 'unavailable',
            // M1-SEC-06: URLs and health details removed
            message: isOnline
                ? 'Sistema de memÃ³ria ativo - Matias lembra das suas conversas'
                : 'Sistema temporariamente indisponÃ­vel',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('âŒ [MEMÃ“RIA] Erro ao verificar status:', error);
        return res.json({
            enabled: false,
            status: 'error',
            message: 'Erro ao verificar sistema de memÃ³ria',
            details: error.message
        });
    }
});

// Warm-up INTELIGENTE - apenas se inativo por >8 minutos (economia 50%)
if (AGNO_IS_CONFIGURED && AGNO_AUTO_WARMUP_ENABLED) {
    const WARMUP_INTERVAL = 10 * 60 * 1000; // 10 minutos

    setInterval(async () => {
        try {
            const inactiveTime = Date.now() - lastActivity;
            const inactiveMinutes = Math.floor(inactiveTime / 60000);

            // Aquecer apenas se inativo por mais de 8 minutos
            if (inactiveTime > 8 * 60 * 1000) {
                console.log(`ðŸ”¥ [AUTO-WARMUP] Inativo ${inactiveMinutes}min - aquecendo...`);
                const result = await warmAgnoService({ reason: 'auto' });

                if (result.ok) {
                    console.log('âœ… [AUTO-WARMUP] Agno AI aquecido com sucesso');
                    agnoWarmed = true;
                } else {
                    console.warn('âš ï¸ [AUTO-WARMUP] Agno AI nÃ£o respondeu:', result?.health?.status || result?.health?.error);
                }
            } else {
                console.log(`âœ… [AUTO-WARMUP] Ativo (${inactiveMinutes}min) - warm-up desnecessÃ¡rio`);
            }
        } catch (error) {
            console.warn('âš ï¸ [AUTO-WARMUP] Erro ao aquecer:', error.message);
        }
    }, WARMUP_INTERVAL);

    console.log('🔥 [AUTO-WARMUP] Sistema INTELIGENTE ativado (economia 50%)');
}

/**
 * Processa mensagem com Agno AI (com fallback, circuit breaker e CACHE L1)
 */
async function processarComAgnoAI(message, userId, agentId = AGNO_DEFAULT_AGENT_ID, session_id = null, options = {}) {
    const resolvedAgentId = (agentId || AGNO_DEFAULT_AGENT_ID || 'matias').trim() || 'matias';
    const agnoUserId = `user_${userId}`;
    const sessionId = session_id || agnoUserId; // Manter consistencia da sessao

    // Track activity for warmup logic.
    lastActivity = Date.now();

    // 0. Verificar Cache L1 (Redis) - cache deve respeitar sessao e agente
    const cacheKey = `agno:response:${userId}:${resolvedAgentId}:${CacheService.hash(sessionId)}:${CacheService.hash(message)}`;
    const cachedResponse = await CacheService.get(cacheKey);

    if (cachedResponse) {
        console.log('⚡ [CACHE] HIT - Retornando resposta cacheada');
        return {
            ...cachedResponse,
            from_cache: true,
            metadata: {
                ...cachedResponse.metadata,
                cached: true,
                retrieved_at: new Date().toISOString()
            }
        };
    }

    console.log('💨 [CACHE] MISS - Consultando Agno AI...');

    if (!AGNO_IS_CONFIGURED) {
        return {
            response: "Assistente AI nao configurado. Defina AGNO_API_URL para ativar o modo AI.",
            conteudo: "Assistente AI nao configurado. Defina AGNO_API_URL para ativar o modo AI.",
            metadata: {
                model: "demo",
                usage: { total_tokens: 0 }
            }
        };
    }

    // 1. Verificar Circuit Breaker (Rate Limit Protection)
    if (!checkCircuitBreaker()) {
        console.warn('⚠️ [AGNO] Circuit breaker aberto. Usando fallback local.');
        return {
            response: "Estou com muitas requisicoes no momento. Tente novamente em alguns instantes.",
            conteudo: "Estou com muitas requisicoes no momento. Tente novamente em alguns instantes.",
            metadata: {
                model: "fallback-local",
                usage: { total_tokens: 0 }
            }
        };
    }

    const requestedTimeoutMs = parsePositiveInt(options.timeout_ms ?? options.timeoutMs, AGNO_RUN_TIMEOUT_MS);
    const throwOnError = Boolean(options.throwOnError);
    const baseUrls = getAgnoCandidateBaseUrls();
    let lastError = null;
    let lastErrorUrl = null;

    for (const baseUrl of baseUrls) {
        try {
            // AgentOS: POST /agents/{agent_id}/runs (multipart/form-data)
            const endpoint = `${baseUrl}/agents/${encodeURIComponent(resolvedAgentId)}/runs`;
            console.log(`🚀 [AGNO] Executando agent=${resolvedAgentId} url=${endpoint} timeout_ms=${requestedTimeoutMs}`);

            const form = new FormData();
            form.append('message', message);
            form.append('stream', 'false'); // force JSON response (non-streaming)
            form.append('session_id', sessionId);
            form.append('user_id', agnoUserId);

            if (options?.dependencies && typeof options.dependencies === 'object') {
                try {
                    form.append('dependencies', JSON.stringify(options.dependencies));
                } catch (_) {
                    // ignore invalid dependencies
                }
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    ...form.getHeaders(),
                    ...getAgnoAuthHeaders()
                },
                body: form,
                signal: AbortSignal.timeout(requestedTimeoutMs)
            });

            // Tratamento de erros HTTP
            if (!response.ok) {
                const errorText = await response.text();
                const retryAfter = response.headers?.get?.('retry-after') || null;
                const errorTextLower = String(errorText || '').toLowerCase();
                const isHtmlLike =
                    errorTextLower.includes('<!doctype') ||
                    errorTextLower.includes('<html') ||
                    errorTextLower.includes('<body');

                // Render cold start / proxy errors can surface as 429 while the service is waking up.
                // We only open the circuit breaker for explicit, non-cold-start rate limits.
                const isExplicitRateLimit =
                    Boolean(retryAfter) ||
                    /rate\s*limit|too many requests|exceeded/i.test(errorTextLower);
                const isColdStartHint =
                    isHtmlLike || /spin|start|starting|sleep|waking|warming|deploy/i.test(errorTextLower);
                const isRateLimit = response.status === 429 && isExplicitRateLimit && !isColdStartHint;
                const isColdStart = response.status === 429 && !isRateLimit;

                const httpError = new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
                httpError.status = response.status;
                httpError.base_url = baseUrl;
                httpError.retry_after = retryAfter;
                httpError.is_rate_limit = Boolean(isRateLimit);
                httpError.is_cold_start = Boolean(isColdStart);

                if (httpError.is_rate_limit) {
                    openCircuitBreaker();
                }

                if (shouldRetryWithNextBase(response.status)) {
                    lastError = httpError;
                    lastErrorUrl = baseUrl;
                    continue;
                }

                throw httpError;
            }

            // Processamento da resposta
            const data = await response.json();

            const respostaTextoRaw =
                data.content ||
                data.result ||
                data.conteudo ||
                data.response ||
                data.message ||
                "Nao entendi.";

            const respostaTexto = normalizarTextoResposta(respostaTextoRaw);
            const finalResponse = {
                response: respostaTexto,
                conteudo: respostaTexto,
                metadata: {
                    model: data.model || data.modelo || "agno-agent",
                    model_provider: data.model_provider,
                    run_id: data.run_id,
                    agent_id: data.agent_id || resolvedAgentId,
                    usage: { total_tokens: 0 },
                    session_id: data.session_id || sessionId,
                    metrics: data.metrics,
                    timeout_ms: requestedTimeoutMs,
                    base_url: baseUrl
                }
            };

            await CacheService.set(cacheKey, finalResponse, 86400);
            console.log('💾 [CACHE] Resposta salva no Redis (TTL 24h)');

            return finalResponse;
        } catch (error) {
            lastError = error;
            lastErrorUrl = baseUrl;

            if (shouldRetryWithNextBase(error)) {
                continue;
            }

            break;
        }
    }

    const messageText = String(lastError?.message || '');
    const isTimeout = lastError?.name === 'AbortError' || /aborted|timeout/i.test(messageText);

    if (lastError) {
        lastError.is_timeout = Boolean(isTimeout);
        lastError.base_url = lastErrorUrl;
    }

    console.error('❌ [AGNO] Erro na requisicao:', lastError?.message || 'Erro desconhecido');

    if (throwOnError && lastError) {
        throw lastError;
    }

    // Fallback gracioso (mantem compatibilidade onde o caller nao trata throw)
    return {
        response: "Desculpe, estou tendo dificuldades para conectar com minha inteligencia central. Tente novamente em alguns instantes.",
        conteudo: "Desculpe, estou tendo dificuldades para conectar com minha inteligencia central. Tente novamente em alguns instantes.",
        metadata: {
            model: "fallback-error",
            error: lastError?.message || 'Falha de conexao com Agno',
            is_timeout: Boolean(isTimeout),
            is_rate_limit: Boolean(lastError?.is_rate_limit),
            is_cold_start: Boolean(lastError?.is_cold_start),
            retry_after: lastError?.retry_after || null,
            timeout_ms: requestedTimeoutMs,
            base_url: lastErrorUrl,
            tried_urls: baseUrls
        }
    };
}

export default router;
