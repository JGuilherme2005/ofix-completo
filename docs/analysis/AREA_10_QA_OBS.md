# AREA 10 - QA & Observability (Testes, Qualidade, Logs, Health)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: estrategia de testes (Vitest/Jest/E2E), configuracoes (`vitest.config.js`, `eslint.config.js`), pasta `tests/`, hooks/tests em `src/**/__tests__`, observabilidade (frontend logger -> `/api/logs`, ErrorBoundary), health/status no backend.

Regra: este relatorio nao implementa mudancas; apenas diagnostico + plano de correcoes.

---

## Execucao rapida (estado atual)

- **Vitest (frontend)**: `npm run test:run` executado em `C:\\ofix-completo\\ofix_new` -> **9 arquivos / 199 testes passando**.
- **Avisos**: React Router future flags aparecem nos testes do `ProtectedRoute` (nao quebra, mas polui output).

---

## Achados

### [QA-TESTS-01] Vitest esta ignorando testes `.test.tsx` (falso senso de cobertura)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/vitest.config.js` (include patterns) + `ofix_new/src/components/chat/__tests__/ChatHeader.test.tsx` + `ofix_new/src/components/chat/__tests__/MessageBubble.test.tsx`
- **Diagnostico:** O `include` do Vitest so contempla `{js,jsx}`. Existem testes em `ts/tsx` dentro de `src/**/__tests__`, mas eles **nao rodam** hoje.
- **Risco:** regressao em componentes de chat passa batido; QA "verde" nao significa qualidade real.
- **Correcao proposta:** expandir o `include` para `{js,jsx,ts,tsx}` e ajustar excludes se necessario.

### [QA-TESTS-02] Test harness fragmentado: Vitest em `src/**` + suite Jest/Cypress-like em `tests/` sem runner oficial
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/jest.config.json` + `ofix_new/tests/**/*`
- **Diagnostico:** Existe uma pasta `tests/` com arquivos que parecem:
  - `tests/unit/*.test.js` (Jest + supertest)
  - `tests/e2e/*.cy.js` (Cypress naming)
  mas o `package.json` do frontend **nao** tem scripts `jest`/`cypress`, e o `vitest.config.js` exclui `tests/**`.
  Alem disso, o `jest.config.json` contem chaves inconsistentes (`moduleNameMapping` vs `moduleNameMapper`), sugerindo que nunca foi estabilizado.
- **Risco:** codigo morto/ilusao de cobertura; novos contribuidores perdem tempo; "testes e2e" nao existem na pratica.
- **Correcao proposta:** decidir 1 caminho e remover o resto:
  - manter **Vitest** para unit/integration (frontend + backend via mocks),
  - e introduzir **Playwright** para E2E (fluxos reais do chat + painel).
  Alternativamente: se quiser manter Jest para o backend, criar scripts e configurar Jest para ESM corretamente (hoje nao existe).

### [QA-TESTS-03] Backend nao tem pipeline de teste/qualidade (sem scripts de test/lint/typecheck)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/package.json`
- **Diagnostico:** O backend nao expõe `test`, `lint`, `typecheck`. Isso dificulta CI e torna regressao de API (auth/tenant scoping) mais provavel.
- **Risco:** bugs P0/P1 escapam (multi-tenancy, auth, rate-limit, prisma regressions).
- **Correcao proposta:** introduzir:
  - lint (ESLint) ou pelo menos `node --check` + `eslint ofix-backend`,
  - suite minima de testes (supertest) para rotas criticas: auth, `/clientes`, `/servicos`, `/agno/chat-inteligente`, `/agno/status`, `/chat-public/*`.

### [QA-TESTS-04] `useChatAPI` tests sao lentos (11s) por delays reais; falta uso consistente de fake timers
- **Severidade:** P3
- **Arquivo/Local:** `ofix_new/src/hooks/__tests__/useChatAPI.test.js`
- **Diagnostico:** Testes de retry/backoff rodam com delays reais (3s + 3s + 3s...). Passa, mas encarece a suite e piora DX.
- **Risco:** suite fica lenta e menos executada no dia-a-dia; tende a virar "roda so no CI".
- **Correcao proposta:** usar `vi.useFakeTimers()` + avancar timers (`vi.advanceTimersByTime`) ou parametrizar delays para testes.

### [QA-OBS-01] Observabilidade no frontend existe (logger -> `/api/logs`), mas sem correlacao cross-servico
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/utils/logger.js` + `ofix_new/ofix-backend/src/routes/logs.routes.js`
- **Diagnostico:** O frontend consegue mandar logs para o backend (inclusive batch) e ha rate-limit local. Porem, nao existe um ID de correlacao comum entre:
  - request do browser -> backend,
  - backend -> Agno/Matias (Python),
  - resposta -> UI.
- **Risco:** debug de producao fica "cego" (nao da para seguir 1 conversa ponta-a-ponta), especialmente com cold start.
- **Correcao proposta:** padronizar `X-Request-Id` / `X-Correlation-Id`:
  - gerar no backend (ou aceitar do frontend) e propagar para Python,
  - incluir esse ID nos logs do backend + python + metadata devolvida ao frontend.

### [QA-OBS-02] ErrorBoundary nao envia erros para o logger/servidor (somente console)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/components/ErrorBoundary.tsx`
- **Diagnostico:** `componentDidCatch` faz `console.error` e nao integra com `logger` nem com endpoint `/api/logs`.
- **Risco:** erros reais em producao podem nao ser capturados (principalmente em browsers sem acesso a console).
- **Correcao proposta:** enviar um log estruturado de nivel `error` via `logger.error(...)`, com throttle, e (opcional) amostrar stacks (LGPD/PII).

### [QA-OBS-03] Health checks existem, mas faltam checks "prontos para trafego" (readiness) e testes de smoke
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/app.js` (`/health`) + `ofix_new/ofix-backend/src/routes/agno.routes.js` (`/status`, `/warm`, `/health`)
- **Diagnostico:** Ha endpoints de health/status. O problema e que nao ha suite automatizada que valide o "contrato" em runtime:
  - backend sobe, DB conecta (ou falha de forma controlada),
  - Agno acorda e responde no tempo esperado,
  - chat publico respeita rate limit + tenant scope.
- **Risco:** deploys "verdes" mas quebrados; cold start volta a ser problema recorrente.
- **Correcao proposta:** criar smoke tests (Playwright ou script Node) rodando contra preview/prod:
  - `/health` do backend,
  - `/agno/status` autenticado,
  - 1 request de chat (sem custo alto, com prompt curto),
  - 1 request de chat-public com rate-limit verificado.

### [QA-SEC-OBS-01] Logs de chat/voz podem virar PII; falta politica de redacao/masking
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/utils/logger.js` + logs no backend + (futuro) logs do Matias/Python
- **Diagnostico:** O logger coleta `url`, `userAgent`, `userId`. No chat, e comum trafegar placa, telefone, CPF etc.
- **Risco:** risco LGPD (armazenar PII em logs sem necessidade).
- **Correcao proposta:** mascarar/redigir campos sensiveis nos logs (telefone, placa, CPF) e evitar logar prompts completos por default; manter "hash/preview" + opt-in para debug.

---

## Recomendacao de fechamento (prioridades)

1) **P1:** corrigir Vitest include para rodar `.test.tsx` (evitar testes "fantasmas").  
2) **P2:** decidir runner unico (Vitest + Playwright) e remover/arquivar `tests/` legado ou oficializar scripts.  
3) **P2:** integrar ErrorBoundary -> logger e criar correlacao `request_id` ponta-a-ponta.  
4) **P2:** adicionar smoke tests automatizados para deploy (health + agno + chat-public hardening).

