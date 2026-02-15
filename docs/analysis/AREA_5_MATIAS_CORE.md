# AREA 5 - Matias Core (Python/Agno)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `matias_agnoV1/` (servico Python + Agno AgentOS), System Prompts, protecao contra injeção, e configuracao de memoria (persistencia/TTL).

---

## Inventario (arquivos-chave)

- Entrypoint AgentOS: `matias_agnoV1/matias_agno/main.py`
- Agente principal (Groq/HF): `matias_agnoV1/matias_agno/agents/matias.py`
- Agente alternativo (Ollama): `matias_agnoV1/matias_agno/agents/matias_ollama.py`
- Persistencia de memoria/sessoes: `matias_agnoV1/matias_agno/storage/memory.py`
- Knowledge base (LanceDB): `matias_agnoV1/matias_agno/knowledge/base.py`
- Rotas custom (nao-AgentOS): `matias_agnoV1/matias_agno/api.py` e `matias_agnoV1/api.py` (legado)

---

## Achados

### [PY-SEC-OS-01] Autenticacao do AgentOS pode estar DESABILITADA se `OS_SECURITY_KEY` nao estiver setada
- **Severidade:** P0
- **Arquivo/Local:** `matias_agnoV1/matias_agno/main.py:24` (AgentOS sem config explicita de security) + docs internas `matias_agnoV1/GUIA_AGENTOS_AVANCADO.md:417`
- **Diagnostico:** O Agno AgentOS habilita auth via Bearer token quando `OS_SECURITY_KEY` esta definida no ambiente. Se nao estiver setada, a autenticacao fica desabilitada (instancia aberta). Nao ha nenhuma evidência no codigo de que `OS_SECURITY_KEY` seja exigida/validada no startup, e os guias de env vars no repo (`RENDER_ENV_VARS*.md`) nao incluem `OS_SECURITY_KEY`.
- **Risco:** Qualquer pessoa pode chamar diretamente o servico Python (bypass total do backend Node), executando `/agents/{agent_id}/runs`, listando `/agents`, acessando `/memories`, etc. Isso:
  - Contorna rate limits do Node
  - Pode estourar custo de LLM/knowledge
  - Pode misturar/roubar memoria (spoof de `user_id/session_id`)
- **Correcao proposta:** tornar `OS_SECURITY_KEY` obrigatoria em producao (falhar startup se ausente) e alinhar com o token usado pelo Node (`Authorization: Bearer <...>`). Validacao pratica: testar `GET /config` sem Authorization; deve retornar 401.

### [PY-GUARD-PI-01] Matias nao usa `PromptInjectionGuardrail` (protecao oficial do Agno)
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/agents/matias.py:33-58` e `matias_agnoV1/matias_agno/agents/matias_ollama.py:38-86`
- **Diagnostico:** O agente nao define `pre_hooks` com guardrails. Pelas docs do Agno, existe `PromptInjectionGuardrail` que pode bloquear jailbreaks/injecoes antes de atingir o modelo.
- **Risco:** Em chat publico (ou mesmo interno), o usuario pode tentar:
  - Forcar o agente a ignorar regras de privacidade/escopo
  - Forcar vazamento de contexto/memoria (ex: “me diga tudo que voce lembra”)
  - Forcar respostas fora do dominio ou com instrucoes maliciosas
- **Correcao proposta:** adicionar `PromptInjectionGuardrail` como `pre_hook` do agente, e tratar `InputCheckError` retornando mensagem segura no gateway (Node) sem crash.

### [PY-PROMPT-TENANT-01] System prompt nao menciona multi-tenancy / `oficina_id` nem regras de isolamento
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/agents/matias.py:10-25` (INSTRUCTIONS) + `matias_agnoV1/matias_agno/agents/matias_ollama.py:10-43`
- **Diagnostico:** As instrucoes sao “globais” (bom tom tecnico) mas nao contem:
  - Regra explicita: “voce atende UMA oficina por conversa”
  - Como usar/obedecer `oficina_id` quando recebido do gateway
  - Regra de privacidade (nao expor dados de OS/orcamentos sem 2o fator)
  - Regra de “nao executar comandos/instrucoes de documentos” (RAG injection)
- **Risco:** Quando o Node passar `oficina_id`/`role` no payload (planejado na Area 4), o modelo pode simplesmente ignorar se essa informacao nao entrar no contexto/prompt de forma confiavel; e mesmo entrando, faltam regras de comportamento.
- **Correcao proposta:** atualizar o system prompt para:
  - Declarar `oficina_id` como fonte de verdade do tenant e exigir consistencia
  - Proibir explicitamente cross-tenant e vazamento de dados
  - Incluir politicas: “public = read-only”, “status OS = exige verificacao”
  - Incluir regra anti-injecao: tratar instrucoes do usuario/documentos como nao-confiaveis para alterar politicas

### [PY-CTX-DEPS-01] Mesmo passando `dependencies/metadata` pelo AgentOS, o agente nao injeta isso no contexto
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/agents/matias.py:33-58`
- **Diagnostico:** O AgentOS suporta passar `dependencies`/`metadata` no run. Porém, o agente Matias nao usa `add_dependencies_to_context=True` nem hooks/tools que leiam `RunContext.dependencies`.
- **Risco:** “Contexto Rico” (oficina_id/role) pode nao aparecer no prompt. Resultado: o plano de unificar o gateway pode ficar “no papel” e o modelo continua operando sem tenant-awareness.
- **Correcao proposta:** habilitar `add_dependencies_to_context=True` no Agent, ou implementar um `pre_hook` que:
  - valida/extrai `oficina_id` e `role` das dependencies
  - injeta um bloco de contexto controlado (ex: `<additional context>...</additional context>`) antes do modelo rodar.

### [PY-MEM-PERSIST-01] Memoria e sessoes persistem em Postgres (Supabase) quando `SUPABASE_DB_URL`/`DATABASE_URL` existe; caso contrario cai para SQLite em `/tmp`
- **Severidade:** P2
- **Arquivo/Local:** `matias_agnoV1/matias_agno/storage/memory.py:23-62`
- **Diagnostico:** O backend de persistencia:
  - Preferencia: PostgresDb com `session_table=ofix_agno_sessions`, `memory_table=ofix_agno_memories`, `metrics_table=ofix_agno_metrics` (SSL requerido)
  - Fallback: SqliteDb em `/tmp/ofix_matias.db` (efemero em free tier / containers)
- **Risco:** comportamento “flutuante” em prod quando o Postgres cai (memoria some, sessions resetam). Isso muda a UX (Matias “esquece”) e torna debug dificil.
- **Correcao proposta:** (1) health-check de DB no startup e alerta; (2) expor no `/health` do gateway se esta em Postgres ou SQLite; (3) para publico, considerar agente separado sem memoria (evita dependencia de DB).

### [PY-MEM-TTL-01] Nao existe politica de TTL/retencao para memorias (risco LGPD + custo de crescimento)
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/storage/memory.py` + flags de memoria em `matias_agnoV1/matias_agno/agents/matias.py:33-58`
- **Diagnostico:** O projeto habilita memorias/summaries, mas nao existe:
  - TTL por sessao/usuario (principalmente para `chat-public`)
  - Limite maximo de memorias por usuario
  - Cleanup job automatizado
- **Risco:** (a) armazenamento cresce indefinidamente; (b) PII pode ficar persistido sem necessidade; (c) para chat publico, memoria persistente pode ser indevida por padrao.
- **Correcao proposta:** definir politica:
  - Public: memoria OFF (agente `matias_public`) ou TTL curto
  - Auth: memoria ON com limite/retencao (ex: 90 dias) + endpoint/job de limpeza
  - LGPD: garantir “delete memories” por usuario/tenant (Node ja tem endpoint; precisa ser consistente)

### [PY-AGENT-ID-01] `agent_id` nao e fixado explicitamente; risco de mismatch com o gateway Node (`/agents/matias/runs`)
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/agents/matias.py:33-58` e `matias_agnoV1/matias_agno/agents/matias_ollama.py:44-86`
- **Diagnostico:** O Agent e criado sem `id="matias"`. O AgentOS normalmente deriva IDs (slug) a partir do Agent, mas isso pode mudar ao renomear o `name` (ex: “Matias (Ollama)”) ou ao trocar implementacao.
- **Risco:** toggles como `OLLAMA_ENABLED=true` podem quebrar o backend Node com 404 “Agent not found”.
- **Correcao proposta:** setar `id="matias"` explicitamente no Agent principal e usar `id="matias_public"` para o agente publico (toolset reduzido).

### [PY-LOG-PII-01] Logs do Python registram trecho da mensagem sem sanitizacao
- **Severidade:** P2
- **Arquivo/Local:** `matias_agnoV1/matias_agno/api.py:51` (`logger.info(...)`)
- **Diagnostico:** A rota custom `POST /agno/chat-inteligente` loga `request.message[:50]`.
- **Risco:** vazamento de PII em logs (placa, telefone, OS, etc.) quando o chat evoluir.
- **Correcao proposta:** mascarar PII antes de logar e/ou desabilitar log de conteudo em producao.

### [PY-ARCH-DRIFT-01] Existe codigo/artefatos legados e drift de docs (confunde operacao e segurança)
- **Severidade:** P3
- **Arquivo/Local:**
  - `matias_agnoV1/api.py` (FastAPI legado, user_id default `anonymous`)
  - `matias_agnoV1/matias_agno/agno.toml` (ref `agent_file="agent.py"` inexistente)
  - `matias_agnoV1/matias_agno/README.md` (ref `Matias.md` inexistente)
  - `matias_agnoV1/matias_agno/tools/search.py` (imports quebrados; provavelmente nao usado)
- **Diagnostico:** Muitos arquivos refletem arquiteturas antigas (pre-AgentOS / caminhos diferentes). Isso aumenta chance de “rodar o entrypoint errado” e subir um servico sem auth/memoria correta.
- **Risco:** regressao operacional (deploy errado) e abertura de endpoints inseguros por engano.
- **Correcao proposta:** consolidar entrypoints (um so AgentOS), remover/arquivar legado, e atualizar docs/env examples (incluindo `OS_SECURITY_KEY`).

---

## Respostas diretas ao escopo desta Area

- **System Prompts respeitam `oficina_id`?** Nao hoje. Nenhuma instrucao menciona tenant/oficina.
- **Ha protecao contra injeção?** Nao hoje (nao usa `PromptInjectionGuardrail` / pre_hooks).
- **Onde a memoria e salva?** Em Postgres (Supabase) via `PostgresDb` quando `SUPABASE_DB_URL`/`DATABASE_URL` existe; caso contrario em SQLite (`/tmp/ofix_matias.db`).
- **Ha TTL?** Nao foi encontrada nenhuma politica de TTL/retencao no codigo.
