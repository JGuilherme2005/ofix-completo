# AREA 1 - Backend Security + Public Endpoints Hardening

Branch analisada: `feat/frontend-tsx-migration`  
Modo: analise / diagnostico / plano (sem alterar codigo)

---

## Relatorio - ETAPA 0 (Pre-scan / Inventario rapido)

### Mapa do monorepo (paths reais)
- Frontend (React/Vite/Tailwind): `ofix_new/` (principalmente `ofix_new/src/`)
- Backend (Node/Express/Prisma): `ofix_new/ofix-backend/` (entry: `ofix_new/ofix-backend/src/server.js` -> `ofix_new/ofix-backend/src/app.js`)
- IA Matias (Python/FastAPI/Uvicorn/Agno): `matias_agnoV1/` (entry Docker: `matias_agnoV1/Dockerfile` -> `uvicorn matias_agno.main:app` porta 7777)

### Deploy/config
- Render blueprint: `render.yaml` (2 services: `ofix-backend` (node) e `matias-agno` (docker))
- Vercel metadata local: `.vercel/` (na raiz) + `ofix_new/.env.production` aponta o FE para `VITE_API_BASE_URL=https://ofix-backend-r556.onrender.com`

### Env vars (o que o codigo realmente usa)
- Backend (principais): `DATABASE_URL`, `DIRECT_DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `AGNO_API_URL`, `AGNO_API_TOKEN`, `AGNO_DEFAULT_AGENT_ID`, e knobs de warmup/timeouts `AGNO_*` (ver `ofix_new/ofix-backend/src/routes/agno.routes.js`)
- Matias (principais): chaves de provedor LLM (`GROQ_API_KEY` / `OPENAI_API_KEY` / `HF_TOKEN`), e opcional DB (`SUPABASE_DB_URL`) (ver `matias_agnoV1/requirements.txt` + `matias_agnoV1/matias_agno/config.py`)

### Testes
- Frontend tem Vitest configurado (`ofix_new/vitest.config.js`), mas existe uma pasta `ofix_new/tests/` com arquivos nomeados `*.cy.js` (sinal forte de legado/stack mista a alinhar depois na Area 10).

### Alertas imediatos encontrados (serao detalhados na Area 1)
- Vazamento de credenciais em logs via `REDIS_URL` (P0).
- Endpoints publicos do Agno (inclui `chat-public` e `warm`) ainda nao estao travados no contrato de oficina/sessao/privacidade (P1/P0 dependendo do caso).

---

## Relatorio - AREA 1 (Backend Security + Public Endpoints Hardening)

### [BE-LOG-01] Possivel vazamento de credenciais do Redis em logs
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/services/cache.service.js` (linha ~23)
- **Diagnostico:** loga `REDIS_URL` parcial via `redisUrl.substring(0, 30)`. URL de Redis normalmente inclui usuario/senha.
- **Risco:** segredo em log = comprometimento do Redis (leitura/escrita de cache, possivel sequestro de chaves, vazamento de respostas cacheadas).
- **Correcao proposta:** nunca logar URL/DSN com credenciais; logar apenas "cache enabled/disabled" + host redigido (ou hash do host) + modo (prod/dev).

### [BE-RATE-01] `trust proxy` configurado depois do rate limiting global
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/app.js` (linhas ~23-27)
- **Diagnostico:** `this.server.use(rateLimit)` roda antes de `this.server.set('trust proxy', 1)`. Em ambientes com proxy (Render), `req.ip` pode ficar errado no rate limit.
- **Risco:** rate limit pode virar "global" (todos compartilham o IP do proxy) causando bloqueio indevido, ou pode ficar inutil/ineficaz contra abuso real.
- **Correcao proposta:** mover `trust proxy` para antes de qualquer middleware que use IP (rate limit, logs, antifraude). Ideal: padronizar rate limit em `express-rate-limit` com keyGenerator correto e (se um dia escalar) store externo.

### [BE-AGNO-PUB-01] `chat-public` usa `userId` fixo (`test_user`) -> mistura de memoria/cache entre usuarios
- **Severidade:** P0 (privacidade)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (rota ~548; chamada ~573)
- **Diagnostico:** `POST /chat-public` chama `processarComAgnoAI(message, 'test_user', ...)`. Isso força `user_id` e `session_id` iguais para todos os usuarios publicos e compartilha cache (`agno:response:test_user:...`).
- **Risco:** vazamento de contexto/respostas entre usuarios finais (especialmente quando evoluir para "Status de OS/Orcamento"); comportamento imprevisivel do agente; impossivel isolar conversas por cliente.
- **Correcao proposta:** gerar/usar `publicSessionId` por cliente (cookie/localStorage no FE) e derivar `publicUserKey` = `public:{oficinaId}:{publicSessionId}`; cache/memoria sempre escopados por oficina+sessoes. Para modo anonimo: considerar desabilitar memoria persistente e usar TTL curto.

### [BE-AGNO-PUB-02] `chat-public` nao exige escopo de oficina (oficinaId/slug) nem valida existencia/ativo
- **Severidade:** P1 (conforme regra de rollout)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (rota ~548)
- **Diagnostico:** o endpoint aceita apenas `message` e nao obriga `oficinaId`/`slug`. Hoje ele e "global".
- **Risco:** impossivel cumprir o contrato de produto ("cliente fala com a IA de uma oficina especifica"); no futuro, risco de vazamento cross-oficina quando houver consultas reais (OS/orcamento).
- **Correcao proposta:** exigir `oficinaRef` (UUID ou slug) e validar no banco (existe + ativo). Observacao: no schema atual `Oficina` nao tem `slug` nem `isActive` (dependencia da Area 3). Ate la, aceitar UUID e validar existencia.

### [BE-AGNO-PUB-03] Nao ha "agente publico read-only" (publico usa `AGNO_DEFAULT_AGENT_ID`)
- **Severidade:** P1 (vira P0 se o agente tiver tools de escrita)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (usa `AGNO_DEFAULT_AGENT_ID`)
- **Diagnostico:** `chat-public` chama o mesmo agente padrao. O backend nao impoe politica "public = somente leitura / sem tools perigosas".
- **Risco:** se o agente (Python/Agno) tiver ferramentas que escrevem (CRM, agenda, DB, etc.), o endpoint publico pode virar um vetor de alteracao indevida e custo alto.
- **Correcao proposta:** separar `AGNO_PUBLIC_AGENT_ID` com toolset reduzido (somente FAQ/public info). Para "Status de OS", permitir apenas uma tool read-only e somente apos 2o fator validado (placa + OS / ultimos digitos telefone), com mascaramento de PII.

### [BE-AGNO-PUB-04] Validacao fraca de payload (tamanho/limites) + JSON body ate 10mb
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (`validateMessage` ~2458) e `ofix_new/ofix-backend/src/app.js` (limit 10mb)
- **Diagnostico:** `validateMessage` so checa vazio; nao ha limite de caracteres/tokens. O parser global permite payload grande.
- **Risco:** abuso de custo/latencia (mensagens gigantes), DoS por payload, e maior chance de prompt injection "pesada".
- **Correcao proposta:** impor limite estrito por rota publica (ex: 500-1000 chars) + recusar anexos/objetos extras; reduzir `express.json` por rota (ou checagem manual antes de encaminhar ao Agno). Para "modo validado", tambem limitar tentativas de verificacao.

### [BE-AGNO-PUB-05] `POST /warm` e publico e sem rate limit
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (rota ~450)
- **Diagnostico:** qualquer pessoa pode chamar warm e manter o Matias acordado.
- **Risco:** derrota a estrategia "wake on demand" no free tier; aumento de uso e instabilidade (spam de warm + health polling).
- **Correcao proposta:** proteger `warm` com token interno (header) ou auth admin; no minimo aplicar rate limit forte e cooldown (ex: 1/min por IP + 1/5min por oficina) e retornar resposta menos detalhada.

### [BE-AGNO-PUB-06] Endpoints publicos revelam informacoes internas (URLs, agent_id, capacidades)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` (`GET /config` ~412, `GET /contexto-sistema` ~2069, `GET /memory-status` ~2639)
- **Diagnostico:** retornam `agno_urls`, `agent_id`, flags e lista de funcoes/endpoints.
- **Risco:** aumenta superficie de reconhecimento (fingerprinting) e facilita abuso direcionado.
- **Correcao proposta:** limitar campos (nao expor lista de URLs internas), ou proteger com auth/admin; para publico, responder apenas "online/offline" e nada mais.

### [BE-AUTH-01] Dois middlewares de auth em paralelo (`protectRoute` vs `verificarAuth`) com shapes diferentes de `req.user`
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/middlewares/auth.middleware.js` vs `ofix_new/ofix-backend/src/routes/agno.routes.js` (func `verificarAuth` ~2114)
- **Diagnostico:** `protectRoute` normaliza `req.user` (id/oficinaId/role). `verificarAuth` injeta o JWT "cru". Rotas fazem `req.user?.id || req.user?.userId` como workaround.
- **Risco:** autorizacao inconsistente (bugs sutis), maior chance de regressao e bypass por divergencia de claims esperados.
- **Correcao proposta:** unificar para um unico middleware (ou um wrapper que sempre normalize) e padronizar claims obrigatorias (ex: `oficinaId` sempre presente para rotas internas).

### [BE-ROUTE-01] Agno router exposto em dois prefixos (`/api/agno/*` e `/agno/*`)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/app.js` (linhas ~126-127) + `ofix_new/ofix-backend/src/routes/index.js` (linha ~64)
- **Diagnostico:** o mesmo conjunto de rotas fica acessivel por 2 caminhos.
- **Risco:** aumenta superficie, dificulta WAF/rules/monitoramento, e facilita "esquecer" de proteger um caminho quando mudar algo.
- **Correcao proposta:** escolher 1 prefixo canonical (recomendado: manter tudo em `/api/...`) e redirecionar/deprecar o outro.

### [BE-LOG-02] Logs de debug com dados de placa/validacao em middleware
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/middlewares/validation.middleware.js` (linhas ~86, ~140+)
- **Diagnostico:** `console.log` sempre ativo para placa/dados do veiculo.
- **Risco:** PII em logs, ruido operacional, e possivel compliance issue quando rodar em prod.
- **Correcao proposta:** remover logs ou gatear estritamente por `NODE_ENV=development` e redigir dados sensiveis.

### [BE-MATIAS-LEGACY-01] Endpoints "legacy" aceitam `userId` do cliente e nao fazem tenant scoping
- **Severidade:** P0 (vazamento cross-user sob token valido)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/matias.routes.js` (ex: POST mensagem ~10; GET historico ~56)
- **Diagnostico:** rotas usam `userId` do body/params (`parseInt(userId)`) em vez de derivar do `req.user`. Nao existe `oficinaId` nesses models (`ConversaMatias`/`MensagemMatias`), entao nao ha isolamento por oficina.
- **Risco:** um usuario autenticado pode enumerar IDs e acessar conversas/mensagens de outros (potencial PII). Tambem ha escrita (criar conversa/agendamento) sem controles de tenant.
- **Correcao proposta:** desabilitar/ocultar essas rotas ate serem reescritas para: (1) usar sempre `req.user`, (2) armazenar conversas vinculadas a `user_uuid` e `oficinaId` (Area 3), (3) impedir enumeracao (IDs UUID, checks de ownership).

---

## Checklist de hardening do Chat Publico (contrato de produto)
- Entrada obrigatoria: `oficinaRef` (UUID agora; slug quando existir no schema) + `publicSessionId`.
- Modos:
  - **Anonimo (FAQ):** sem 2o fator; agente publico read-only; zero acesso a OS/orcamento; memoria opcional (TTL curto).
  - **Validado (Status/Orcamento):** exigir 2o fator (OS+placa ou OS+last4 telefone) antes de qualquer lookup; respostas com mascaramento; cache desabilitado ou chaveado por (oficina+os+verificacao).
- Protecoes:
  - rate limit forte por IP + cooldown por sessionId; limite de tamanho de mensagem; bloquear warm/config detalhado para publico.
  - agente separado: `AGNO_PUBLIC_AGENT_ID` sem tools perigosas.

