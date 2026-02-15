# AREA 4 - AI Gateway (Node <-> Matias/Agno)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `ofix_new/ofix-backend/src/routes/agno.routes.js` + `ofix_new/ofix-backend/src/routes/matias.routes.js` (ponte Node -> Python AgentOS), contrato de contexto (userId/sessionId/oficinaId), resiliencia (timeouts/retries), e comportamento em cold start.

---

## Mapa rapido (fluxos e endpoints)

### Node -> Agno (Python AgentOS)
- Execucao do agente: `POST {AGNO_BASE_URL}/agents/{agent_id}/runs` (multipart/form-data)
- Health: `GET {AGNO_BASE_URL}/health`
- Lista agentes: `GET {AGNO_BASE_URL}/agents`
- Memorias: `GET/DELETE {AGNO_BASE_URL}/memories?user_id=...`

### Backend (rotas expostas)
- `POST /api/agno/chat-inteligente` (auth; classifier; local ou Agno; tem warm+retry no catch)
- `POST /api/agno/chat` (auth; permite override de `agent_id` e `session_id`; sem warm+retry; envelope inconsistente)
- `POST /api/agno/chat-public` (public; rate limit; hoje usa `userId` fixo)
- `POST /api/agno/warm` (public; dispara warm do Agno)
- `GET /api/agno/status` / `GET /api/agno/health` / `GET /api/agno/agents` (status/health/lista)
- `GET /api/agno/memories/:userId` / `DELETE /api/agno/memories/:userId` / `GET /api/agno/memory-status`
- "Legacy Matias" (nao e gateway pro Python): `GET/POST /api/matias/...` (conversas/agendamentos/consultas)

Observacao: o gateway atual passa para o Python apenas `user_id` e `session_id`. `oficinaId` nao e propagado.

---

## Achados

### [BE-AGNO-AUTH-01] Middleware de auth duplicado e inconsistente (`verificarAuth` vs `protectRoute`)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:2114` e `ofix_new/ofix-backend/src/middlewares/auth.middleware.js:19`
- **Diagnostico:** `agno.routes.js` usa um `verificarAuth` local que apenas faz `jwt.verify()` e joga o payload inteiro em `req.user`. O resto do backend usa `protectRoute`, que normaliza `req.user` (id/email/role/oficinaId/isGuest) e faz hard-fail se `JWT_SECRET` estiver ausente/fraco.
- **Risco:** inconsistencias de formato de `req.user` (ex: `id` vs `userId`), bypass acidental de regras (guest/roles), e maior chance de regressao de seguranca quando evoluir o payload do token. Tambem cria caminhos onde `userId` pode virar `anonymous` (ver achado [BE-AGNO-CTX-02]).
- **Correcao proposta:** unificar auth: remover `verificarAuth` e usar `protectRoute` em todas as rotas do Agno (ou extrair um middleware unico). Garantir que todos os handlers leem `req.user.id` e `req.user.oficinaId` (shape canonico).

### [BE-AGNO-CTX-01] Contexto de oficina nao e propagado ao Agno (somente `user_id`/`session_id`)
- **Severidade:** P1 (bloqueia multi-tenancy real no chat quando virar feature de dados)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:2712` (montagem de `FormData`)
- **Diagnostico:** `processarComAgnoAI()` envia `message`, `stream=false`, `session_id` e `user_id` para o AgentOS. Nao existe `oficinaId`/`oficinaSlug`/`tenant` no payload nem namespacing em `user_id`.
- **Risco:** quando o produto evoluir para "cliente da oficina consulta OS/orcamento", o agente pode misturar memoria/sessao entre oficinas (especialmente se um usuario puder trocar de oficina, ou no chat publico). Mesmo antes disso, fica dificil aplicar politicas diferentes por oficina (ex: horario de funcionamento, tom, informacoes publicas).
- **Correcao proposta:** fazer namespacing de contexto por oficina no proprio `user_id` e/ou `session_id` (ex: `of:{oficinaId}:u:{userId}` para autenticado; `of:{oficinaId}:anon:{publicSessionId}` para publico). Alternativamente, adicionar um campo adicional enviado ao Agno (se suportado) via metadados de sessao ou "message prefix" controlado pelo backend (sem expor ao usuario).

### [BE-AGNO-CTX-02] `/agno/chat` aceita tokens sem `id/userId` e cai em `anonymous` (sessao/memoria compartilhada)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:2232`
- **Diagnostico:** a rota `/chat` faz `const userId = req.user?.id || req.user?.userId || 'anonymous';`. Se o payload do JWT nao tiver esses campos (ou se `verificarAuth` mudar), varios usuarios podem compartilhar `user_id=user_anonymous` e `session_id=user_anonymous`.
- **Risco:** mistura de memoria/cache entre usuarios autenticados (privacidade e respostas erradas). Mesmo que isso "nao aconteca hoje", e uma bomba de regressao.
- **Correcao proposta:** exigir `req.user.id` obrigatorio (400/401 se ausente) e remover o fallback `anonymous`. Padronizar para o shape do `protectRoute`.

### [BE-AGNO-ABUSE-01] `/agno/chat` permite override de `agent_id` e `session_id` sem allowlist/validacao
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:2221` (payload) + `:2233` (override)
- **Diagnostico:** o cliente pode informar `agent_id` e `session_id`. Isso altera qual agente executa e em qual sessao. Nao ha allowlist, nem validacao de formato/tamanho, nem politica por role.
- **Risco:** se existirem agentes internos (ex: com tools de escrita), um usuario autenticado pode tentar invoca-los. E mesmo sem isso, pode causar mistura de memoria (sessao arbitraria), elevar custo (rodar agente "mais caro") e dificultar rastreabilidade.
- **Correcao proposta:** remover override do client (fixar `agent_id` e `session_id` no backend) ou aplicar allowlist (`AGNO_ALLOWED_AGENT_IDS`) + validacao estrita de `session_id` (tamanho, charset) + bloquear para guest. Para debug, criar um endpoint admin-only.

### [BE-AGNO-RETRY-01] Failover por base URL nao funciona bem em timeouts (AbortError nao e considerado retryavel)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:148` (`shouldRetryWithNextBase`) + `:2847` (uso em `processarComAgnoAI`) + `:274` (uso em `fetchAgnoWithFallback`)
- **Diagnostico:** `shouldRetryWithNextBase()` nao considera `AbortError` / mensagens com "aborted". Como o codigo usa `AbortSignal.timeout(...)`, os timeouts tipicamente viram `AbortError`. Resultado: quando a base URL "trava", o codigo tende a nao tentar a proxima base.
- **Risco:** maior latencia e mais falhas em cold start/DNS instavel (Render free), apesar de existir lista de fallback (`AGNO_API_URL`, `AGNO_PUBLIC_API_URL`, etc.).
- **Correcao proposta:** tratar `error.name === 'AbortError'` e/ou `message.includes('aborted')` como retryavel. Ideal: centralizar a chamada Agno em uma funcao unica que aplica (timeout -> warm -> retry -> fallback) de forma consistente.

### [BE-AGNO-COLD-01] Tratamento de cold start existe em `/chat-inteligente`, mas nao existe em `/chat` e `/chat-public`
- **Severidade:** P1 (impacta UX e confiabilidade de testes)
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:626` (tem warm+retry) vs `:2221` (nao tem) vs `:548` (nao tem)
- **Diagnostico:** somente `/chat-inteligente` tenta `warmAgnoService()` + retry quando detecta timeout/5xx/network. `/chat` e `/chat-public` dependem do fallback final de `processarComAgnoAI` (ou estouram timeout longo).
- **Risco:** UI/cliente ve "central indisponivel" com frequencia quando o Python esta dormindo; comportamento inconsistente dependendo do endpoint consumido (e hoje o frontend chama ambos ao longo do codigo).
- **Correcao proposta:** mover wake-on-demand para dentro de `processarComAgnoAI` (ex: opcao `wake_on_demand=true`) ou criar um wrapper unico para todas as rotas que chamam Agno. Para o chat publico, usar timeout menor + resposta 202/"acordando" (com retry curto) para nao prender a requisicao por 120s.

### [BE-AGNO-CONTRACT-01] Envelope/resposta inconsistente entre endpoints de chat
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:2312` (retorna `responseData` puro) vs `:816` (retorna `{ success: true, ...responseData }`) vs `:548` (retorna `{ success: true, response, ... }`)
- **Diagnostico:** `/chat` retorna `responseData` sem `success` garantido; `/chat-inteligente` envelopa com `success: true`; `/chat-public` tem outro formato. Isso forca condicionais no frontend e aumenta risco de UI bug.
- **Risco:** regressao silenciosa no frontend (loading infinito, nao exibe mensagens, etc.), e mais custo de manutencao.
- **Correcao proposta:** padronizar um DTO unico para chat (`{ success, response, metadata, mode, ... }`) e aplicar em todas as rotas (publico, autenticado, inteligente).

### [BE-AGNO-MEM-01] Identificadores de "memoria" sao inconsistentes (Agno usa string; DB legado usa Int hash)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:836` (historico DB via hash Int) + `:2472` (memories Agno via `user_${uuid}`)
- **Diagnostico:** o historico local (`conversaMatias`) usa `userIdInt` derivado do UUID, enquanto as memorias do Agno usam `user_id=user_{uuid}`. Sao dois sistemas paralelos e nao-ha uma "fonte da verdade" clara para o frontend.
- **Risco:** UI pode indicar "memoria ativa" mas o usuario nao ve coerencia entre historico e memorias; dificulta debug e migracao.
- **Correcao proposta:** decidir oficialmente: (a) historico = DB (UUID), memoria = Agno; ou (b) historico/memoria unificados no Agno. Enquanto o legado existir, documentar e expor no `/status` qual storage esta ativo e qual endpoint o frontend deve priorizar.

### [BE-AGNO-SAVE-01] `/agno/salvar-conversa` retorna `conversa_id` incorreto (bug de shape)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:1972` (usa `ConversasService`) + `:2011` (retorno)
- **Diagnostico:** `ConversasService.salvarConversa()` retorna `{ conversaId, mensagemId }`, mas o handler responde `conversa_id: conversa.id`. Resultado: `conversa_id` provavelmente `undefined`.
- **Risco:** qualquer integracao que dependa do ID retornado quebra ou fica inconsistente.
- **Correcao proposta:** alinhar o retorno com o service (`conversa_id: conversa.conversaId`) e/ou padronizar DTO.

### [BE-AGNO-INFO-01] Endpoints publicos expõem detalhes internos (urls/rotas/capacidades)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:412` (`/config`), `:2639` (`/memory-status`), `:2069` (`/contexto-sistema`)
- **Diagnostico:** esses endpoints nao exigem auth e retornam `agno_urls`, `agent_id`, endpoints internos e capacidades.
- **Risco:** aumenta superficie de ataque (reconhecimento) e facilita abuse direcionado (ex: spam do warm / tentativa de atingir agentes).
- **Correcao proposta:** exigir auth (admin) em producao, ou ao menos ocultar campos sensiveis quando `NODE_ENV=production` (nao retornar `agno_urls`, nem hints de config).

### [BE-AGNO-PII-01] Logs registram trechos de mensagens sem sanitizacao, apesar de existir helper
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:570`, `:666`, `:2260` (logs) + `:2419` (`sanitizeForLog`, hoje nao usado)
- **Diagnostico:** mensagens do usuario sao logadas (substring) sem usar `sanitizeForLog()`, que ja tem mascaramento de CPF/telefone.
- **Risco:** vazamento de PII em logs (LGPD) e aumento do impacto em caso de incidente.
- **Correcao proposta:** aplicar `sanitizeForLog(message)` em todos os logs que imprimem conteudo do usuario; evitar logar conteudo em producao.

### [BE-MATIAS-LEGACY-01] `matias.routes.js` e "legado" (nao chama Python) e possui falhas de autorizacao/scoping
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/matias.routes.js:8`..`:112`
- **Diagnostico:** rotas usam `protectRoute`, mas aceitam `userId` do client (body/params) e fazem `parseInt(userId)` sem checar se `userId` == `req.user.id`. Tambem nao existe scoping por `oficinaId` nas queries/creates.
- **Risco:** um usuario autenticado pode ler/escrever historico/agendamentos de outro usuario/outra oficina (vazamento e violacao de isolamento). Alem disso, cria confusao de arquitetura (frontend tenta chamar `/api/matias/chat` e `/api/matias/voice`, que nao existem no backend).
- **Correcao proposta:** curto prazo: travar autorizacao (forcar `userId` sempre derivado de `req.user.id` e aplicar `oficinaId` em todas as queries) ou desabilitar essas rotas se nao forem essenciais. Medio prazo: "Unificar no Novo" (Area 2/3) e remover completamente o legado quando o frontend estiver migrado para `/api/agno/*`.

---

## Notas para o contrato do Chat Publico (reforco do hardening)

Mesmo tratando `chat-public` como feature de produto, o gateway precisa impor:
- Rate limit + limites de tamanho (chars/tokens) e tentativas de "2o fator" (OS+placa/telefone).
- Escopo obrigatorio de oficina (UUID/slug validado e ativo).
- Agente publico com permissoes reduzidas (read-only; sem tools de escrita).
- Namespacing de memoria/cache por oficina + sessao anonima (nunca `test_user`).

