# Manual de Operação — OFIX V2

> Guia definitivo para operar, manter e fazer deploy do sistema OFIX V2.
> Última atualização: 17 Fev 2026 | Branch: `feat/frontend-tsx-migration`

---

## Índice

1. [Arquitetura em 30 Segundos](#1-arquitetura-em-30-segundos)
2. [Variáveis de Ambiente Obrigatórias](#2-variáveis-de-ambiente-obrigatórias)
3. [Guia de Cold Start](#3-guia-de-cold-start)
4. [Rotinas de Manutenção](#4-rotinas-de-manutenção)
5. [Checklist de Deploy](#5-checklist-de-deploy)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Arquitetura em 30 Segundos

```
┌─────────────┐     HTTPS      ┌─────────────────┐    interno    ┌──────────────┐
│  Frontend   │ ──────────────► │  Backend Node   │ ────────────► │ Matias Agno  │
│  (Vercel)   │  VITE_API_URL  │  (Render free)  │  AGNO_API_URL │ (Render free)│
│  React+Vite │                │  Express+Prisma │  Bearer token │ Python+Groq  │
└─────────────┘                └────────┬────────┘               └──────┬───────┘
                                        │                               │
                                        ▼                               ▼
                                ┌───────────────┐              ┌───────────────┐
                                │   Supabase    │              │   LanceDB     │
                                │  PostgreSQL   │              │  Cloud (KB)   │
                                └───────────────┘              └───────────────┘
```

| Serviço | Stack | Hospedagem | Porta |
|---------|-------|-----------|-------|
| Frontend | React + Vite + TypeScript | Vercel ou Netlify | — |
| Backend Node | Express + Prisma ORM | Render (free) | 10000 |
| Matias Agno (IA) | Python + Agno Framework + Groq | Render (free, Docker) | 7777 |
| Banco de Dados | PostgreSQL 15 | Supabase | 5432/6543 |
| Knowledge Base | LanceDB Cloud | LanceDB Cloud | — |
| Cache (opcional) | Redis | Render / Upstash | 6379 |

---

## 2. Variáveis de Ambiente Obrigatórias

### 2.1 Backend Node (`ofix-backend`)

> Configuradas no painel do Render → Environment.

#### Críticas (o servidor NÃO inicia sem elas)

| Variável | Exemplo | Validação |
|----------|---------|-----------|
| `DATABASE_URL` | `postgresql://user:pass@host:6543/db?pgbouncer=true` | Fail-fast: ≥10 chars |
| `DIRECT_DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Usada pelo Prisma CLI (migrations) |
| `JWT_SECRET` | `minha-chave-super-secreta-com-32-chars` | Fail-fast: ≥32 chars |
| `AGNO_API_TOKEN` | `token-identico-ao-os-security-key` | Fail-fast: ≥8 chars em produção |
| `AGNO_API_URL` | `https://matias-agno-XXXX.onrender.com` | URL do serviço Python |

#### Importantes (têm default, mas revise)

| Variável | Default | Descrição |
|----------|---------|-----------|
| `NODE_ENV` | `development` | Definir como `production` no Render |
| `PORT` | `10000` | Render atribui automaticamente |
| `AGNO_AUTO_WARMUP` | `true` | Mantém o serviço Python acordado (ver seção 3) |
| `AGNO_DEFAULT_AGENT_ID` | `matias` | ID do agente autenticado |
| `AGNO_PUBLIC_AGENT_ID` | `matias-public` | ID do agente público (sem memória) |
| `REDIS_URL` | — | Opcional. Cache de respostas IA por 24h |
| `ENCRYPTION_KEY` | `default-key` | **Trocar em produção!** Criptografia AES |
| `BACKEND_URL` | `http://localhost:3001` | URL pública do próprio backend |

#### Tuning de Cold Start (raramente precisa mexer)

| Variável | Default | O que faz |
|----------|---------|-----------|
| `AGNO_WARM_MAX_WAIT_MS` | `240000` (4min) | Max polling no endpoint `/warm` manual |
| `AGNO_CHAT_WARM_MAX_WAIT_MS` | `45000` (45s) | Max espera de retry durante chat |
| `AGNO_WARM_RETRY_DELAY_MS` | `3000` (3s) | Delay entre retries de health |
| `AGNO_RUN_TIMEOUT_MS` | `120000` (2min) | Timeout de chamadas ao agente |
| `AGNO_HEALTH_TIMEOUT_MS` | `10000` (10s) | Timeout de health check normal |
| `AGNO_WARM_RUN` | `false` | Se `true`, envia ping real ao agente no warm |

### 2.2 Matias Agno — Python (`matias-agno`)

> Configuradas no painel do Render → Environment (serviço Docker).

#### Críticas

| Variável | Exemplo | Nota |
|----------|---------|------|
| `OS_SECURITY_KEY` | `token-identico-ao-agno-api-token` | **Deve ser IDÊNTICO ao `AGNO_API_TOKEN` do backend** |
| `GROQ_API_KEY` | `gsk_xxxxxxxxxxxxxxx` | Provedor preferido. Modelo default: `llama-3.3-70b-versatile` |
| `PORT` | `7777` | Porta interna do container |

#### Importantes

| Variável | Default | Descrição |
|----------|---------|-----------|
| `ENVIRONMENT` | `development` | Definir como `production` |
| `HOST` | `0.0.0.0` | Bind do uvicorn |
| `GROQ_MODEL_ID` | `llama-3.3-70b-versatile` | Modelo Groq utilizado |
| `HF_TOKEN` | — | Fallback se `GROQ_API_KEY` ausente (usa Qwen 7B) |
| `SUPABASE_DB_URL` | — | URL PostgreSQL (prioridade sobre DATABASE_URL) |
| `DATABASE_URL` | — | URL PostgreSQL (fallback) |
| `LANCEDB_API_KEY` | — | Necessário para Knowledge Base |
| `LANCEDB_URI` | `db://ofx-rbf7i6` | URI do banco LanceDB |
| `LANCEDB_TABLE` | `conhecimento_oficina_v5_completo` | Tabela de conhecimento |
| `AGNO_AUTH_MEMORY_TTL_DAYS` | `30` | Sessões autenticadas expiram em 30 dias |
| `AGNO_PUBLIC_MEMORY_TTL_HOURS` | `1` | Sessões públicas expiram em 1 hora |
| `OLLAMA_ENABLED` | `false` | Se `true`, usa Ollama local em vez de Groq |

### 2.3 Frontend (Vercel / Netlify)

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `https://ofix-backend-r556.onrender.com` | **Única obrigatória.** URL do backend |

### 2.4 Regra de Ouro: Sincronização de Tokens

```
AGNO_API_TOKEN (Backend Node) === OS_SECURITY_KEY (Python Agent)
```

Se eles divergirem, toda comunicação Backend → IA retorna **401 Unauthorized** e o chat para de funcionar.

---

## 3. Guia de Cold Start

### 3.1 Por que acontece?

O Render free tier **dorme** serviços após ~15 minutos de inatividade. O cold start (acordar) leva **30-90 segundos** dependendo do serviço.

### 3.2 Como o OFIX lida automaticamente

O sistema tem **3 camadas** de proteção contra cold start:

```
Camada 1: Auto-Warmup Periódico
    ↓ (previne que durma)
Camada 2: Health Polling no Warm
    ↓ (acorda se dormiu)
Camada 3: Retry no Chat
    ↓ (retenta se pegou cold start)
```

#### Camada 1 — Auto-Warmup (preventivo)

A cada **10 minutos**, o backend verifica se houve atividade nos últimos 8 minutos:

- **Se houve atividade** → pula (economia de recursos)
- **Se NÃO houve** → dispara `GET /health` no serviço Python para mantê-lo acordado

Isso **previne** que o Render durma o container Python na maioria dos casos.

> Controlado por `AGNO_AUTO_WARMUP=true` (default). Desligar com `AGNO_AUTO_WARMUP=false`.

#### Camada 2 — Warm Manual (reativo)

Endpoint para acordar o serviço sob demanda:

```bash
curl -X POST https://seu-backend.onrender.com/api/agno/warm \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Faz polling no `/health` do Python com backoff exponencial (3s → 5s → 8s) por até **4 minutos**.

> Rate-limited: máximo 2 chamadas a cada 5 minutos.

#### Camada 3 — Retry no Chat (automático)

Quando um usuário envia mensagem e o Python está dormindo:

1. A chamada falha (timeout / ECONNREFUSED / 429)
2. O backend detecta que é cold start (não rate-limit)
3. Dispara `warmAgnoService()` com timeout de **45 segundos**
4. Se warm OK → **retenta a mensagem automaticamente**
5. Se falha → retorna **503** com mensagem amigável:
   > "Nosso assistente está temporariamente indisponível. Tente novamente em alguns segundos."

Isso funciona tanto no **chat autenticado** quanto no **chat público**.

### 3.3 Fluxo visual de uma request durante cold start

```
Usuário envia msg
       │
       ▼
  Backend recebe
       │
       ├── Agno online? ──── SIM ──── Responde normal (~2-5s)
       │
       └── NÃO (timeout/ECONNREFUSED)
              │
              ▼
        É cold start? ──── NÃO (429 rate-limit) ──── Circuit breaker (5min)
              │
              SIM
              │
              ▼
        warmAgnoService(45s)
              │
              ├── OK ──── Retenta msg ──── Responde (~15-45s total)
              │
              └── Timeout ──── 503 "Tente novamente"
```

### 3.4 Primeiro acesso do dia

Na manhã (ou após longo período sem uso), ambos os serviços estarão dormindo:

1. Usuário acessa o frontend → Vercel responde instantaneamente (estático)
2. Frontend chama backend → Render acorda o Node (~15-30s)
3. Backend tenta chamar Python → cold start → warm automático (~30-90s)
4. **Tempo total do primeiro acesso: ~45-120 segundos**

Depois do primeiro acesso, tudo funciona em tempo real enquanto houver uso.

### 3.5 Como forçar o "wake up" antes de usar

Abra o navegador e acesse:

```
https://seu-backend.onrender.com/api/agno/status
```

Isso acorda o backend Node. Se o campo `agno.online` retornar `false`, use o Warm:

```bash
# No terminal (com um JWT válido)
curl -X POST https://seu-backend.onrender.com/api/agno/warm \
  -H "Authorization: Bearer <SEU_JWT>"
```

---

## 4. Rotinas de Manutenção

### 4.1 Cleanup de Memória da IA

O Matias armazena sessões e memórias no PostgreSQL. Com o tempo, elas se acumulam.

**Política de TTL:**
| Tipo de Sessão | Tempo de Vida | Tabela |
|----------------|---------------|--------|
| Autenticada (clientes logados) | 30 dias | `ofix_agno_sessions`, `ofix_agno_memories` |
| Pública (visitantes) | 1 hora | mesmas tabelas, filtradas por `agent_id` |

**Para executar o cleanup:**

```bash
# Dry-run (só conta, não deleta)
curl -X POST "https://matias-agno-XXXX.onrender.com/agno/cleanup-memories?dry_run=true" \
  -H "Authorization: Bearer <OS_SECURITY_KEY>"

# Executar de verdade
curl -X POST "https://matias-agno-XXXX.onrender.com/agno/cleanup-memories?dry_run=false" \
  -H "Authorization: Bearer <OS_SECURITY_KEY>"
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "deleted": {
    "public_sessions": 42,
    "auth_sessions": 3,
    "public_memories": 128,
    "auth_memories": 7
  }
}
```

**Frequência recomendada:** Configurar um **Cron Job** semanal (Render Cron ou cron-job.org):

```
0 3 * * 0  curl -X POST "https://matias-agno-XXXX.onrender.com/agno/cleanup-memories?dry_run=false" -H "Authorization: Bearer $OS_SECURITY_KEY"
```

> Isso executa todo domingo às 3h da manhã.

### 4.2 Reset do Banco de Dados

#### Cenário A: Reset completo (apaga TUDO)

> ⚠️ **DESTRUTIVO.** Só usar em desenvolvimento ou se quiser começar do zero.

```bash
# No Supabase SQL Editor:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Depois, no painel do Render, faça **Manual Deploy** do backend. O startup irá:
1. Rodar `prisma migrate deploy` (recria todas as tabelas)
2. Se `RUN_SEED_ON_START=true`, roda seed (cria oficina OFIX + admin)

#### Cenário B: Reset só do seed (mantém schema)

```bash
# No terminal local:
cd ofix_new/ofix-backend
npx prisma db seed
```

Cria:
- Oficina "OFIX" (slug: `ofix`, CNPJ: `00.000.000/0001-00`)
- Admin: `admin@ofix.com` / `admin123`

#### Cenário C: Aplicar nova migration

```bash
# Local (gera migration):
cd ofix_new/ofix-backend
npx prisma migrate dev --name descricao_da_mudanca

# Produção (aplica no deploy):
# Automático — o npm start roda prisma-migrate-safe.mjs
# Ou manualmente:
npx prisma migrate deploy
```

#### Cenário D: Reset das tabelas da IA (sem mexer no app)

```sql
-- No Supabase SQL Editor:
TRUNCATE TABLE ofix_agno_sessions CASCADE;
TRUNCATE TABLE ofix_agno_memories CASCADE;
TRUNCATE TABLE ofix_agno_metrics CASCADE;
```

### 4.3 Verificação de Saúde (Health Checks)

| Endpoint | Auth | O que retorna |
|----------|------|---------------|
| `GET /api/agno/status` | JWT | Status consolidado (backend + Python + circuit breaker) |
| `GET /api/agno/config` | JWT | Configuração atual (warmed, memory, agent IDs) |
| `POST /api/agno/warm` | JWT + rate-limit | Acorda o serviço Python manualmente |
| `GET /health` (Python direto) | Nenhuma | Health do AgentOS |
| `GET /agno/contexto-sistema` (Python) | Nenhuma | Versão, modelo ativo |

### 4.4 Cache Redis

Se Redis estiver configurado (`REDIS_URL`), respostas da IA são cacheadas por **24 horas**.

```bash
# Limpar todo o cache (se tiver acesso ao Redis):
redis-cli -u $REDIS_URL FLUSHDB
```

Sem Redis, o sistema funciona normalmente — apenas sem cache.

---

## 5. Checklist de Deploy

### 5.1 Antes de Fazer Merge para Main

- [ ] Todos os **224 testes** passando: `cd ofix_new && npx vitest run`
- [ ] Sem erros de TypeScript: `cd ofix_new && npx tsc --noEmit`
- [ ] Build do frontend funciona: `cd ofix_new && npm run build`
- [ ] Variáveis de ambiente de produção configuradas (ver seção 2)

### 5.2 Configuração no Render (Backend Node)

- [ ] **Environment Variables** do serviço `ofix-backend`:
  - [ ] `DATABASE_URL` → URL pooler do Supabase (porta 6543)
  - [ ] `DIRECT_DATABASE_URL` → URL direta do Supabase (porta 5432)
  - [ ] `JWT_SECRET` → string aleatória com ≥32 caracteres
  - [ ] `AGNO_API_TOKEN` → token compartilhado com Python (≥8 chars)
  - [ ] `AGNO_API_URL` → URL do serviço `matias-agno` no Render
  - [ ] `NODE_ENV` → `production`
- [ ] **Build Command**: `npm ci --include=dev && npx prisma generate`
- [ ] **Start Command**: `npm start`
- [ ] **Node Version**: 20.x (verificar `NODE_VERSION=20.14.0`)

### 5.3 Configuração no Render (Matias Agno — Python)

- [ ] **Environment Variables** do serviço `matias-agno`:
  - [ ] `OS_SECURITY_KEY` → **idêntico** ao `AGNO_API_TOKEN` do backend
  - [ ] `GROQ_API_KEY` → chave da API Groq
  - [ ] `PORT` → `7777`
  - [ ] `ENVIRONMENT` → `production`
  - [ ] `SUPABASE_DB_URL` ou `DATABASE_URL` → URL PostgreSQL para memória
  - [ ] `LANCEDB_API_KEY` → chave LanceDB Cloud (se usando KB)
- [ ] **Dockerfile path**: `matias_agnoV1/Dockerfile`
- [ ] **Health Check Path**: `/health` (default do Render)

### 5.4 Configuração no Vercel (Frontend)

- [ ] **Environment Variables**:
  - [ ] `VITE_API_BASE_URL` → URL completa do backend (ex: `https://ofix-backend-r556.onrender.com`)
- [ ] **Framework Preset**: Vite
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Root Directory**: `ofix_new`

### 5.5 Pós-Deploy — Validação

Execute nesta ordem:

```bash
# 1. Backend está vivo?
curl https://seu-backend.onrender.com/api/agno/config \
  -H "Authorization: Bearer <JWT>"
# Esperado: { "configured": true, ... }

# 2. Python Agno está vivo?
curl https://seu-backend.onrender.com/api/agno/status \
  -H "Authorization: Bearer <JWT>"
# Esperado: agno.online = true

# 3. Se agno.online = false, aquecer:
curl -X POST https://seu-backend.onrender.com/api/agno/warm \
  -H "Authorization: Bearer <JWT>"
# Esperado: { "success": true, "warmed": true }

# 4. Testar chat autenticado (precisa de JWT de usuário real):
curl -X POST https://seu-backend.onrender.com/api/agno/chat-inteligente \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, tudo bem?"}'

# 5. Testar chat público:
curl -X POST https://seu-backend.onrender.com/api/agno/chat-public \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá!", "oficinaRef": "ofix", "publicSessionId": "test-session-001"}'

# 6. Frontend carrega?
# Abrir https://seu-frontend.vercel.app no navegador
# Verificar Console do DevTools: sem erros de CORS ou 404
```

### 5.6 Checklist Rápido (Copiar e Colar)

```
DEPLOY V2 — CHECKLIST
═══════════════════════════════════════════

RENDER (Backend Node)
  □ DATABASE_URL configurada (pooler, porta 6543)
  □ DIRECT_DATABASE_URL configurada (direta, porta 5432)
  □ JWT_SECRET ≥32 chars
  □ AGNO_API_TOKEN ≥8 chars
  □ AGNO_API_URL aponta para serviço Python
  □ NODE_ENV = production
  □ Deploy manual disparado
  □ Logs sem erros de startup

RENDER (Matias Agno)
  □ OS_SECURITY_KEY = AGNO_API_TOKEN ← CRÍTICO
  □ GROQ_API_KEY preenchida
  □ PORT = 7777
  □ ENVIRONMENT = production
  □ Deploy manual disparado
  □ /health retorna 200

VERCEL / NETLIFY (Frontend)
  □ VITE_API_BASE_URL = URL do backend
  □ Build sem erros
  □ Navegação funciona (SPA redirect)
  □ Chat carrega sem erros de console

VALIDAÇÃO FINAL
  □ /api/agno/status → agno.online = true
  □ Chat autenticado responde
  □ Chat público responde
  □ Auto-warmup ativo (verificar logs após 10min)
```

---

## 6. Troubleshooting

### Chat não responde / timeout

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| 503 "Assistente indisponível" | Python dormindo + warm falhou | Disparar `/agno/warm` manualmente e aguardar ~2min |
| 401 no chat | Token expirado ou divergente | Verificar `AGNO_API_TOKEN` == `OS_SECURITY_KEY` |
| 429 no chat | Rate limit (circuit breaker aberto) | Aguardar 5 min. Verificar se Groq não está throttling |
| Resposta genérica local | Circuit breaker aberto | Fallback deliberado. Aguardar 5 min para reset |

### Banco de dados

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| P1001 no startup | Supabase pausado/unreachable | Verificar Supabase; redeploy no Render |
| Migration falhou | Advisory lock (pgbouncer) | Usar `DIRECT_DATABASE_URL` para migrations |
| Dados sumindo | TTL de memória | Verificar `AGNO_AUTH_MEMORY_TTL_DAYS` |

### Frontend

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| CORS error | `VITE_API_BASE_URL` incorreto | Verificar URL e trailing slash |
| Tela branca | Build com env errado | Rebuild no Vercel com `VITE_API_BASE_URL` correto |
| Logout automático | JWT expirado / 401 | Normal — redireciona para login. Verificar `JWT_EXPIRES_IN` |

### Render específico

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| Serviço "Suspended" | Free tier — inatividade | Acessar painel Render → Manual Deploy |
| Build timeout | Dependências pesadas | Render free tem 15min de build. Verificar cache |
| Porta errada | Env diferente do esperado | Backend: `PORT=10000`, Python: `PORT=7777` |

---

> **Mantido por:** Equipe OFIX
> **Repo:** `JGuilherme2005/ofix-completo`
> **Branch V2:** `feat/frontend-tsx-migration`
