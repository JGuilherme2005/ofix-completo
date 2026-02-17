# Backlog Priorizado (Fase de Finalização V2)

Branch: `feat/frontend-tsx-migration`
Status: **96% concluído — restam apenas 2 itens de QA**

Legenda:
- [x] Concluído
- [ ] Pendente

---

## 🚧 Pendente: Suites de Testes Automatizados

Únicos itens restantes. Não bloqueiam funcionalidade — são travas de qualidade.

### Testes E2E (M6-QA-03)
- [ ] **M6-QA-03 [P2][Alta]:** Playwright E2E:
    - Smoke tests responsivos (mobile/desktop)
    - Login + redirect-back
    - Envio de mensagem (com mocks de API)
    - Navegação em rotas críticas

### Testes de Backend (M6-QA-04)
- [ ] **M6-QA-04 [P1][Alta]:** Supertest:
    - Auth (login, register, JWT refresh)
    - Tenant scoping (queries retornam só dados da oficina)
    - Chat público (rate limit, oficina inválida, oficina inativa)
    - `/agno/*` (warm, status, config)

---

## ✅ Concluído (47/49 itens)

### Milestone 1 — Segurança & Isolamento (10/10)
- [x] M1-SEC-01: OS_SECURITY_KEY obrigatória, AGNO_API_TOKEN alinhado
- [x] M1-SEC-02: Chat público hardened (oficinaRef, publicSessionId, isActive, namespacing)
- [x] M1-SEC-03: Agente público com toolset reduzido, sem memória/KB, instructions separadas
- [x] M1-SEC-04: Body limit, tamanho max de mensagem, cooldown
- [x] M1-SEC-05: /agno/warm protegido + warmLimiter
- [x] M1-SEC-06: protectRoute unificado, verificarAuth removido
- [x] M1-SEC-07: Override de agent_id/session_id removido
- [x] M1-SEC-08: trust proxy + ipKeyGenerator IPv6 + security.js normalizado
- [x] M1-SEC-09: sanitizeForLog, PII redacted
- [x] M1-SEC-10: Montagem de rotas canonicalizada

### Milestone 2 — Banco & Prisma (7/7)
- [x] M2-DB-01 a M2-DB-07: Clean slate, UUID, multi-tenancy, FKs, índices, slug+isActive

### Milestone 3 — IA / Matias (7/7)
- [x] M3-AI-01: System Prompt tenant-aware
- [x] M3-AI-02: Injeção de contexto (pre_hook/dependencies)
- [x] M3-AI-03: PromptInjectionGuardrail ativo
- [x] M3-AI-04: Política de memória TTL + cleanup
- [x] M3-AI-05: agent_id explícito e configurável via env (Node↔Python)
- [x] M3-AI-06: Cold start: warm+retry no chat público e autenticado, auto-warmup
- [x] M3-AI-07: buscar_conhecimento corrigida

### Milestone 4 — Frontend Core (6/6)
- [x] M4-FE-01 a M4-FE-06: Auth normalizado, HTTP client unificado, env strategy, 401 redirect, Layout otimizado, 52 mortos deletados

### Milestone 5 — UI/UX (8/8)
- [x] M5-UX-01 a M5-UX-08: AIPage refatorada, scroll, painel dual-mode, a11y, toast, textarea, UI cleanup, CSS typo fix

### Milestone 6 — QA & Observabilidade (5/7)
- [x] M6-QA-01: vitest.config corrigido
- [x] M6-QA-02: Infra Jest/Cypress removida, testes reescritos (224/224)
- [x] M6-QA-05: Fake timers (-80% tempo)
- [x] M6-OBS-01: X-Request-Id (correlation ID)
- [x] M6-OBS-02: ErrorBoundary → logger

### Milestone 7 — Infra/Docs (4/4)
- [x] M7-INF-01 a M7-INF-04: Portas, Dockerfiles, docker-compose, deploy docs
