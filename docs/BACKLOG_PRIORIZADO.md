# Backlog Priorizado (Fase de Execucao)

Branch base: `feat/frontend-tsx-migration`  
Origem: auditoria modular (Areas 1 a 10 em `docs/analysis/`).

Formato:
- **[Severidade]**: P0/P1/P2/P3
- **[Complexidade]**: Baixa / Media / Alta

Observacao: tarefas P0/P1 estao ordenadas para reduzir risco primeiro (seguranca + isolamento + banco), e so depois atacar UI/UX e divida tecnica.

---

## Milestone 1 — Blindagem de Seguranca & Isolamento (Backend + Chat Publico + Gateway)

- M1-SEC-01 — Tornar `OS_SECURITY_KEY` obrigatoria no Matias (falhar startup se ausente) + configurar `AGNO_API_TOKEN` no backend e alinhar Bearer token ponta-a-ponta. **[P0][Media]**
- M1-SEC-02 — Hardening do `chat-public` (feature): exigir `oficinaRef` (UUID/slug), validar oficina ativa, exigir `publicSessionId`, gerar `publicUserKey` namespaced e remover `test_user`. **[P0][Alta]**
- M1-SEC-03 — Chat publico com permissoes reduzidas: `AGNO_PUBLIC_AGENT_ID` + toolset read-only + memoria OFF/TTL curto. **[P1][Alta]**
- M1-SEC-04 — Validacao e limites para rotas publicas: tamanho max de mensagem, body limit por rota, cooldown/limite de tentativas de 2o fator, bloquear endpoints que expõem config interna. **[P1][Media]**
- M1-SEC-05 — Proteger `/agno/warm` (token interno/admin) + rate limiting forte (IP + oficina + session) e resposta segura. **[P1][Media]**
- M1-SEC-06 — Unificar middleware de auth do Agno para `protectRoute` (remover `verificarAuth`) e remover fallback `anonymous`. **[P1][Media]**
- M1-SEC-07 — Remover override do client para `agent_id` e `session_id` (ou aplicar allowlist estrita + admin-only). **[P1][Media]**
- M1-SEC-08 — Corrigir `trust proxy` antes do rate limit + ajustar `keyGenerator` (IPv6) no `express-rate-limit` e padronizar store (Redis opcional). **[P1][Media]**
- M1-SEC-09 — Redacao de PII e segredos em logs: parar de logar DSNs/placa/trechos de mensagem; aplicar `sanitizeForLog` e gates por `NODE_ENV`. **[P0][Baixa]**
- M1-SEC-10 — Canonicalizar prefixo de rotas do Agno (evitar exposicao dupla `/agno/*` e `/api/agno/*`). **[P2][Media]**

Entregavel do Milestone 1:
- Chat publico seguro (escopado por oficina, rate limited, read-only, sem memoria compartilhada).
- AgentOS inacessivel sem auth e sem bypass do gateway.
- Tenant scoping reforcado no gateway e nos endpoints de IA.

---

## Milestone 2 — Banco & Prisma (Multi-tenancy real, integridade e performance)

- M2-DB-01 — Definir modelo canonico (UUID) e substituir modelos Int (`ConversaMatias`, `MensagemMatias`, `Agendamento`) por modelos novos com `oficinaId` + FKs coerentes. **[P0][Alta]**
- M2-DB-02 — Eliminar drift: alinhar `schema.prisma` com migrations (sem “models fantasma”) e garantir que `prisma migrate deploy` cria tudo necessario. **[P0][Alta]**
- M2-DB-03 — Trocar `@unique` globais por `@@unique([oficinaId, ...])` (Cliente/Veiculo/Servico/Peca/Fornecedor/Procedimentos/Mensagens). **[P1][Alta]**
- M2-DB-04 — Tornar `Veiculo.oficinaId` obrigatorio e backfill via `cliente.oficinaId`. **[P1][Media]**
- M2-DB-05 — Reintroduzir / corrigir FKs removidas por migration (ou decidir explicitamente a estrategia de integridade). **[P1][Alta]**
- M2-DB-06 — Indices minimos por tenant (ex.: `[oficinaId, status]`, `[oficinaId, createdAt]`, etc.) e revisar queries mais usadas. **[P1][Media]**
- M2-DB-07 — Adicionar `Oficina.slug` e `Oficina.isActive/status` (contrato do chat publico). **[P2][Media]**

Entregavel do Milestone 2:
- DB suporta multi-tenant de verdade (unicidades/indices por oficina).
- Modelos legados perigosos removidos/substituidos.
- Backend deixa de “parecer seguro” e passa a ser seguro por construcao.

---

## Milestone 3 — IA (Matias Core + Guardrails + Memoria)

- M3-AI-01 — Atualizar System Prompt com tenant-awareness (`oficina_id`) + politicas de privacidade (2o fator p/ OS) + regras anti-injecao. **[P1][Alta]**
- M3-AI-02 — Implementar injecao de contexto confiavel (pre_hook / dependencies) e namespacing de sessao por oficina no Python. **[P1][Alta]**
- M3-AI-03 — Ativar `PromptInjectionGuardrail` e tratar erros de guardrail no Node (mensagem segura, sem crash). **[P1][Media]**
- M3-AI-04 — Politica de memoria: TTL/retencao, limite por usuario/oficina, limpeza (job) e “public agent” sem memoria. **[P1][Alta]**
- M3-AI-05 — Fixar `agent_id` explicitamente (`matias`, `matias_public`) para evitar 404 em swaps (Ollama/Groq). **[P1][Baixa]**
- M3-AI-06 — Cold start/wake-on-demand: padronizar warm+retry+timeouts em todos os endpoints que chamam o Agno. **[P1][Media]**
- M3-AI-07 — Tools: remover/arrumar tool quebrada (`buscar_conhecimento`) e definir politica para futuras tools de escrita (HITL/confirmacao/audit). **[P2][Media]**

Entregavel do Milestone 3:
- Matias obedecendo tenant scope e politicas de privacidade.
- Guardrails ativos (anti prompt injection) e memoria controlada (LGPD/custo).

---

## Milestone 4 — Frontend Core (Auth + API + Contratos)

- M4-FE-01 — Normalizar schema do `authToken` (um formato unico) e centralizar `getAuthHeaders`; eliminar `localStorage.token` legacy. **[P1][Media]**
- M4-FE-02 — Consolidar HTTP client (Axios ou fetch wrapper unico): baseURL, auth, 401, timeout, retry. **[P1][Alta]**
- M4-FE-03 — Decidir estrategia de ambiente (Vercel rewrites vs CORS) e remover fallback hardcoded para Render; exigir `VITE_API_BASE_URL` por ambiente. **[P1][Media]**
- M4-FE-04 — Corrigir redirect duplicado no login (AuthProvider vs LoginPage). **[P2][Baixa]**
- M4-FE-05 — Reduzir requests globais do `Layout` (cache/staleTime ou endpoint agregado). **[P2][Media]**
- M4-FE-06 — Limpeza de modulos paralelos/nao usados (agents/widgets/offline/helpers obsoletos) apos migracao do caminho oficial. **[P2][Media]**

Entregavel do Milestone 4:
- Frontend chamando contratos reais e estaveis do backend.
- Menos superficie de bug por duplicacao de clients/fluxos.

---

## Milestone 5 — UI/UX do Assistente (Desktop/Mobile) + A11y

- M5-UX-01 — Corrigir bug de altura/scroll no desktop (cadeia `flex-1/min-h-0`, evitar double scroll com o `Outlet`). **[P1][Media]**
- M5-UX-02 — Melhorar UX do painel: toggle direto no desktop (sem depender do drawer), mantendo “Abrir painel” conforme requisito. **[P2][Media]**
- M5-UX-03 — Acessibilidade: `aria-live/role=log` para mensagens, foco no input, substituir `alert()` por toast padronizado. **[P2][Media]**
- M5-UX-04 — Composer multiline (Textarea autosize): `Enter` envia, `Shift+Enter` quebra linha. **[P3][Media]**
- M5-UX-05 — Reduzir “UI barulhenta” (menos gradientes simultaneos; acentos por tipo). **[P3][Media]**
- M5-UX-06 — Card de memoria: esconder instrucoes de infra para usuarios nao-admin (mostrar apenas status). **[P2][Baixa]**
- M5-UX-07 — Quebrar `AIPage.tsx` em componentes/hooks (manutencao e regressao). **[P2][Alta]**
- M5-UX-08 — Corrigir typo de classe `.matiaS-...` e checar `prefers-reduced-motion`. **[P3][Baixa]**

Entregavel do Milestone 5:
- Tela do assistente confiavel em desktop/mobile, com melhor legibilidade e A11y.

---

## Milestone 6 — QA & Observability (trava de qualidade)

- M6-QA-01 — Corrigir `vitest.config.js` para incluir testes `.test.ts/.test.tsx` (hoje nao rodam). **[P1][Baixa]**
- M6-QA-02 — Unificar estrategia de testes: oficializar Vitest + Playwright; arquivar/remover suite Jest/Cypress-like em `tests/` ou criar scripts reais (se for manter). **[P2][Media]**
- M6-QA-03 — Playwright E2E: responsivo (mobile/desktop), painel, envio de mensagem (com mocks), login e smoke de rotas criticas. **[P2][Alta]**
- M6-QA-04 — Backend tests (supertest) para: auth, tenant scoping, `/agno/*`, `chat-public` (rate limit + oficina scope + 2o fator). **[P1][Alta]**
- M6-OBS-01 — Correlation ID ponta-a-ponta (FE->BE->Python) + incluir em logs/metadata e UI (debug). **[P2][Alta]**
- M6-OBS-02 — Integrar ErrorBoundary ao logger/endpoint `/api/logs` (com amostragem e redacao de PII). **[P2][Media]**
- M6-QA-05 — Acelerar testes lentos com fake timers (retry/backoff). **[P3][Baixa]**

Entregavel do Milestone 6:
- “Verde” significa algo: testes e smoke gates impedem regressao de seguranca e UX.

---

## Milestone 7 — Infra/Docs Cleanup (drift e operacao)

- M7-INF-01 — Eliminar drift de portas/entrypoints do Matias (7777/8000/8001) e padronizar o caminho oficial. **[P2][Media]**
- M7-INF-02 — Corrigir `docker-compose.prod.yml` invalido (comentarios JS) ou remover se nao for usado. **[P2][Baixa]**
- M7-INF-03 — Alinhar Node version em Dockerfiles com `20.x` e remover manifests obsoletos. **[P2][Baixa]**
- M7-INF-04 — Atualizar docs de deploy para Render+Vercel+Supabase (single source of truth) e padronizar nomes de env (`VITE_API_BASE_URL`, etc.). **[P2][Baixa]**

