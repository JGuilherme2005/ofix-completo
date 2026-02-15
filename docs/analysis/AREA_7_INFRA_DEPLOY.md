# AREA 7 - Infraestrutura, Deploy & Secrets (Render/Vercel/Supabase)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `render.yaml`, Dockerfiles/compose, arquivos `.env*`, guias de deploy e consistencia de configuracao entre Frontend (Vercel) + Backend (Render) + Matias (Render/Docker) + DB (Supabase).

---

## Achados

### [INF-RENDER-SEC-01] Matias/AgentOS pode subir sem auth (falta `OS_SECURITY_KEY`) + Node nao define `AGNO_API_TOKEN`
- **Severidade:** P0
- **Arquivo/Local:** `render.yaml` (servico `matias-agno` e `ofix-backend`) + `matias_agnoV1/matias_agno/main.py` (AgentOS) + `ofix_new/ofix-backend/src/routes/agno.routes.js` (headers bearer)
- **Diagnostico:** O repo nao declara `OS_SECURITY_KEY` como env var obrigatoria no blueprint do Render, e tambem nao declara `AGNO_API_TOKEN` no backend Node. Pelo comportamento documentado do Agno AgentOS, sem `OS_SECURITY_KEY` a autenticacao pode ficar desabilitada; e mesmo que voce ative no Python, o Node nao vai conseguir autenticar sem `AGNO_API_TOKEN`.
- **Risco:** bypass total do gateway Node (rate limiting / tenant scoping / logs), abuso de custo e spoof de `user_id/session_id` diretamente no Python.
- **Correcao proposta:** no Render:
  - setar `OS_SECURITY_KEY` no servico `matias-agno` (obrigatorio em prod; falhar startup se ausente).
  - setar `AGNO_API_TOKEN` no servico `ofix-backend` com o MESMO valor (o Node ja envia `Authorization: Bearer ...` quando `AGNO_API_TOKEN` existe).

### [INF-RENDER-AI-01] `OLLAMA_ENABLED=true` por default no Render blueprint (pode quebrar se `OLLAMA_BASE_URL` nao estiver configurado)
- **Severidade:** P1
- **Arquivo/Local:** `render.yaml` (servico `matias-agno`)
- **Diagnostico:** O blueprint liga Ollama (`OLLAMA_ENABLED=true`) e deixa `OLLAMA_BASE_URL` como `sync: false`. Se o usuario nao preencher isso no painel, o Matias tenta usar `http://localhost:11434` (default do codigo) e falha em runtime. Ao mesmo tempo, o blueprint pede `OPENAI_API_KEY`/`GROQ_API_KEY`, mas com Ollama ligado elas podem nem ser usadas.
- **Risco:** instabilidade intermitente (health OK, mas runs falham), e perda de tempo depurando “Agno dormindo” quando na verdade e misconfig.
- **Correcao proposta:** definir uma estrategia clara:
  - ou **Ollama**: manter `OLLAMA_ENABLED=true` e exigir `OLLAMA_BASE_URL` como obrigatoria (falhar startup se ausente).
  - ou **Groq/HF**: `OLLAMA_ENABLED=false` e exigir `GROQ_API_KEY` (ou `HF_TOKEN`) conforme a branch/ambiente.

### [INF-RENDER-DB-01] Matias nao recebe `SUPABASE_DB_URL` no blueprint -> memoria cai pra SQLite efemero
- **Severidade:** P1
- **Arquivo/Local:** `render.yaml` (servico `matias-agno`) + `matias_agnoV1/matias_agno/storage/memory.py`
- **Diagnostico:** O blueprint do Render para `matias-agno` nao define `SUPABASE_DB_URL` nem `DATABASE_URL`. Logo, o Matias usa fallback `SqliteDb` em `/tmp/ofix_matias.db` (ephemeral).
- **Risco:** “memoria ativa” vira ilusao (some a cada restart), comportamento inconsistente entre ambientes, e testes de memoria ficam irreprodutiveis.
- **Correcao proposta:** setar `SUPABASE_DB_URL` no servico `matias-agno` (com `sslmode=require`). Para chat publico, considerar agente sem memoria por padrao.

### [INF-RENDER-DB-02] Backend Node roda migrations no startup e pode crash-loop quando DB esta indisponivel/mal configurado
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/package.json` (`start`) + `ofix_new/ofix-backend/scripts/prisma-migrate-safe.mjs`
- **Diagnostico:** `npm start` executa migrations antes de iniciar o servidor. O script “safe” so ignora `P1001` durante **build** no Render (`RENDER=true`), nao durante startup. Se o DB estiver expirado/fora (como ocorreu no Render Postgres free), o backend sai com status != 0 e reinicia.
- **Risco:** indisponibilidade total do backend por problemas do DB (e cascata no frontend).
- **Correcao proposta:** padronizar DB de producao no Supabase e garantir `DIRECT_DATABASE_URL` correta. Se quiser resiliencia a downtime, implementar “migrate best-effort” com fallback (mas com alarme/alerta, nao silencioso).

### [INF-DOCKER-DRIFT-01] Drift de portas/entrypoints do Matias (7777 vs 8000 vs 8001) e multiplos manifests
- **Severidade:** P2
- **Arquivo/Local:** `matias_agnoV1/Dockerfile` (7777), `matias_agnoV1/matias_agno/Dockerfile` (8000), `matias_agnoV1/HANDOFF_README.md` (8001), `matias_agnoV1/matias_agno/docker-compose.yml` (8000), `matias_agnoV1/matias_agno/render.yaml` (10000)
- **Diagnostico:** Existem varios caminhos de deploy/local-run com portas e comandos diferentes. Isso aumenta a chance de subir o servico errado (sem auth, sem memoria, sem knowledge) e confunde o gateway Node.
- **Risco:** regressao operacional + exposicao acidental (servico aberto em rota/porta inesperada).
- **Correcao proposta:** escolher **um** caminho oficial:
  - Render blueprint (Docker) em `matias_agnoV1/Dockerfile` (7777), e alinhar todos os docs/compose a isso; ou
  - runtime python nativo, mas remover Docker drift e atualizar start commands.

### [INF-DOCKER-INVALID-01] `ofix_new/docker-compose.prod.yml` nao e YAML valido (comentarios JS `/** */` e `//`)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/docker-compose.prod.yml`
- **Diagnostico:** O arquivo comeca com comentarios estilo JS (`/** ... */` e `//`), o que quebra YAML. Mesmo que nao seja usado hoje, e um “landmine” para quem tentar rodar.
- **Risco:** perda de tempo + deploy local/servidor falhando silenciosamente.
- **Correcao proposta:** remover ou corrigir para YAML valido (`#`), e reduzir o escopo (ELK/Grafana/Watchtower e pesado para o estagio atual).

### [INF-DOCKER-NODE-01] `ofix_new/Dockerfile.prod` usa Node 18, mas o repo declara Node 20.x
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/Dockerfile.prod` + `ofix_new/package.json` + `ofix_new/ofix-backend/package.json`
- **Diagnostico:** Projeto (frontend + backend) declara engines `20.x`, mas o Dockerfile.prod fixa `node:18-alpine`. Isso pode gerar divergencias (deps, build, runtime).
- **Risco:** builds locais diferentes de producao e bugs de runtime.
- **Correcao proposta:** alinhar Dockerfile.prod para Node 20.x ou remover se nao for caminho oficial de deploy.

### [INF-DOC-DRIFT-01] Guias de deploy estao desatualizados (Railway vs Render/Supabase; variaveis divergentes)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/docs/deployment/DEPLOY_GUIDE.md`, `matias_agnoV1/HANDOFF_README.md`, `matias_agnoV1/matias_agno/RENDER_ENV_VARS*.md`
- **Diagnostico:** Docs citam Railway, portas antigas e variaveis diferentes (`VITE_API_URL` vs `VITE_API_BASE_URL`, etc.).
- **Risco:** configuracao errada em producao (CORS, URL de API, portas) e inseguranca (servico subindo sem `OS_SECURITY_KEY` porque a doc nao manda configurar).
- **Correcao proposta:** manter 1 guia “source of truth” para Render+Vercel+Supabase, com placeholders e checklist de variaveis (incluindo `OS_SECURITY_KEY`/`AGNO_API_TOKEN`).

### [INF-ENV-EXAMPLE-01] `.env.example` do backend contem `JWT_SECRET` com valor “realista” e `PORT` incoerente
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/.env.example`
- **Diagnostico:** Apesar de ser exemplo, `JWT_SECRET` tem um valor completo (nao placeholder) e `PORT=1000` nao bate com o runtime real (Render usa `PORT=10000` no projeto).
- **Risco:** copy/paste para prod com secret fraco/reutilizado e configuracao errada.
- **Correcao proposta:** substituir por placeholder (`<GERAR_32+_CHARS>`) e alinhar PORT esperado (ou documentar “Render injeta PORT”).

### [INF-SECRETS-SCAN-01] Scan rapido nao encontrou tokens longos reais commitados (bom), mas ha muitos placeholders em docs
- **Severidade:** P3
- **Arquivo/Local:** multiplos (`RENDER_ENV_VARS*.md`, `DEPLOY_GUIDE.md`, etc.)
- **Diagnostico:** Nao foi identificado padrao de key real (ex: `gsk_`/`hf_` com valor nao-placeholder) commitado no repo; aparecem placeholders.
- **Risco:** baixo (hoje). O risco vira P0 se chaves reais forem colocadas em docs por engano.
- **Correcao proposta:** manter politica: exemplos sempre com `xxxx` e nunca com keys reais; adicionar pre-commit/CI grep para bloquear tokens reais.

---

## Nota operacional (free tier / sem gastar agora)

- Render free pode “dormir” os web services. Isso significa que o Node nao consegue manter o Python acordado se o proprio Node dormir. O caminho mais coerente sem custo e:
  - **wake-on-demand** no gateway Node (ja existe) + timeout/UX adequados,
  - evitar rodar “warm” publico sem rate limit,
  - desabilitar memoria no chat publico para reduzir dependencia de DB e custo.

