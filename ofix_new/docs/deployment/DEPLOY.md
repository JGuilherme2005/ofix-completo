# Deploy — Projeto Pista

Guia unificado de deploy. Custo: **R$ 0** (camada gratuita de cada plataforma).

## Arquitetura

| Camada | Plataforma | Plano | Config |
|--------|-----------|-------|--------|
| Frontend (Vite/React) | **Vercel** ou **Netlify** | Free | `vercel.json` / `netlify.toml` |
| Backend (Node/Express + Prisma) | **Render** | Free | `render.yaml` |
| Agente IA (Python/Agno) | **Render** (Docker) | Free | `render.yaml` |
| Banco de Dados (PostgreSQL) | **Supabase** | Free | Dashboard Supabase |

---

## 1. Banco de Dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie as connection strings:
   - **Pooler** (transação): para `DATABASE_URL` no Render.
   - **Direct**: para `DIRECT_DATABASE_URL` no Render.
3. Ative a extensão `pgcrypto` se necessário (`CREATE EXTENSION IF NOT EXISTS pgcrypto`).

> Ambas as URLs devem incluir `?sslmode=require`. A pooler também precisa de `&pgbouncer=true`.

---

## 2. Backend + Agente IA (Render)

O arquivo `render.yaml` na raiz do repositório define os dois serviços.

### Deploy via Blueprint

1. Acesse [render.com](https://render.com) → **New** → **Blueprint**.
2. Conecte o repositório GitHub.
3. O Render detecta `render.yaml` e cria os serviços automaticamente.
4. Preencha as variáveis marcadas como `sync: false` no painel:

**Backend (`ofix-backend`)**:
| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL pooler do Supabase (com `?pgbouncer=true&sslmode=require`) |
| `DIRECT_DATABASE_URL` | URL direta do Supabase (com `?sslmode=require`) |
| `REDIS_URL` | Opcional — caching/sessão |
| `JWT_SECRET` | String aleatória longa (min. 32 chars) |
| `AGNO_API_TOKEN` | Mesmo valor de `OS_SECURITY_KEY` do Matias |

**Matias Agno (`matias-agno`)**:
| Variável | Descrição |
|----------|-----------|
| `OS_SECURITY_KEY` | Token de autenticação do AgentOS (igual a `AGNO_API_TOKEN` do backend) |
| `OPENAI_API_KEY` | Chave da OpenAI (ou outro provider) |
| `GROQ_API_KEY` | Opcional — Groq para modelos rápidos |
| `HF_TOKEN` | Opcional — Hugging Face |
| `OLLAMA_BASE_URL` | URL Ngrok do Ollama local (se ativado) |

### Depois do primeiro deploy

```bash
# Rodar migrations (uma única vez ou após mudanças no schema)
# Use o Shell do Render (painel → serviço → Shell) ou o CLI:
npx prisma migrate deploy
```

---

## 3. Frontend (Vercel ou Netlify)

### Variável de Ambiente

A **única** variável obrigatória é:

```
VITE_API_BASE_URL = https://ofix-backend-r556.onrender.com
```

Ela já está definida em `.env.production` — Vite a carrega automaticamente no build.
Para override, defina a mesma variável no dashboard da plataforma.

### Opção A — Vercel (recomendada)

1. Acesse [vercel.com](https://vercel.com) → login com GitHub.
2. **New Project** → selecione o repositório.
3. Framework: **Vite** (detectado automaticamente).
4. Root Directory: `/ofix_new` (se for monorepo) ou `/` (se clonou só o frontend).
5. Deploy.

O `vercel.json` já configura SPA rewrites.

### Opção B — Netlify

1. Acesse [netlify.com](https://netlify.com) → login com GitHub.
2. **New site from Git** → selecione o repositório.
3. Build command: `npm run build` — Publish directory: `dist`.
4. Deploy.

O `netlify.toml` já configura build, redirects e headers de segurança.

---

## 4. CORS

O backend precisa saber a URL do frontend para liberar CORS.

No painel Render, adicione a variável:
```
CORS_ORIGIN = https://seu-frontend.vercel.app
```

Se usar múltiplas origens, separe com vírgula:
```
CORS_ORIGIN = https://ofix.vercel.app,https://ofix.netlify.app
```

---

## 5. Verificação pós-deploy

| Verificação | Como testar |
|-------------|-------------|
| Backend respondendo | `curl https://ofix-backend-r556.onrender.com/api/health` |
| Agente IA respondendo | `curl -H "Authorization: Bearer <TOKEN>" https://matias-agno.onrender.com/v1/playground/status` |
| Frontend carregando | Abrir URL no navegador |
| Login funcionando | Criar conta e fazer login |
| Chat IA | Enviar mensagem no assistente |

---

## Troubleshooting

### Build do frontend falha
```bash
# Teste local antes de committar
npm run build
npm run preview
```

### Erro CORS
- Verifique se `CORS_ORIGIN` no Render inclui a URL exata do frontend (com `https://`, sem barra final).

### Erro 404 em rotas do frontend
- Vercel: `vercel.json` já tem rewrite `/(.*) → /index.html`.
- Netlify: `netlify.toml` já tem redirect `/* → /index.html 200`.

### Backend não conecta ao banco
- Confirme que `DATABASE_URL` tem `?pgbouncer=true&sslmode=require`.
- Execute `npx prisma migrate deploy` pelo Shell do Render.

### Agente IA retorna 401
- Confirme que `AGNO_API_TOKEN` (backend) = `OS_SECURITY_KEY` (matias-agno).

### Cold start lento no Render Free
- Serviços free dormem após 15 min de inatividade. O primeiro request pode levar ~30s.
- Para manter ativo, configure um health-check cron externo (ex: UptimeRobot).
