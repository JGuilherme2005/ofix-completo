# Relatorio Tecnico Final (Auditoria Modular - OFIX)

Branch analisada: `feat/frontend-tsx-migration`  
Data: 2026-02-15  
Escopo: Backend (Node/Express/Prisma), Data Layer (Prisma/Postgres), Gateway IA (Node <-> Agno), Matias (Python/Agno), Infra/Deploy (Render/Vercel/Supabase), Frontend (Core + UI/UX do Assistente), QA/Observability.

Este documento consolida os achados dos relatorios em `docs/analysis/AREA_1_*` ate `AREA_10_*`.

---

## 1) Resumo Executivo (o que impede producao hoje)

O projeto esta **funcionando para testes**, mas **nao esta pronto para producao multi-tenant** nem para expor um **chat publico** com custo controlado e isolamento. Os riscos principais sao:

- **Isolamento (multi-tenancy) incompleto/inconsistente**: `oficinaId` nao e garantido ponta-a-ponta (DB, backend, gateway e Matias).
- **Gateway de IA poroso**: contexto rico (oficina/role) nao chega ao Python, e existem rotas/contratos que permitem override de session/agent ou caem em `anonymous`.
- **Schema e migrations em drift**: modelos legados (Int) coexistem com UUID e faltam constraints/indices tenant-scoped.
- **Chat publico ainda esta aberto demais**: falta escopo obrigatorio por oficina + rate limiting/cold start consistente + agente publico read-only.
- **Qualidade e observabilidade existem, mas estao fragmentadas**: testes TSX nao rodam hoje; ha suite Jest/Cypress-like sem runner; falta correlacao de request id cross-servicos.

---

## 2) Grafico de Severidade (contagem de achados)

Base: todos os itens com `**Severidade:**` nos relatorios de `docs/analysis/`.

| Severidade | Qtde | Barra |
|---|---:|---|
| P0 | 17 | ################# |
| P1 | 31 | ############################### |
| P2 | 37 | ##################################### |
| P3 | 9  | ######### |

Interpretacao:
- **P0**: bloqueia producao / risco de vazamento grave / quebra estrutural.
- **P1**: alto risco (abuso/custo/instabilidade) e deve entrar antes de rollout.
- **P2/P3**: divida tecnica e melhorias; entram apos estabilizar base.

---

## 3) Top 5 Problemas que “matariam” o projeto se fosse para producao hoje

1) **Bypass do Gateway (Matias/AgentOS pode subir sem autenticacao)**
   - Evidencia: `[PY-SEC-OS-01]` + `[INF-RENDER-SEC-01]`
   - Impacto: qualquer pessoa acessa diretamente o Python AgentOS e contorna rate limiting/tenant scoping/logs do Node; risco de custo e vazamento de memoria.

2) **Chat Publico sem isolamento real (sessao fixa + sem oficina obrigatoria + sem agente read-only)**
   - Evidencia: `[BE-AGNO-PUB-01]`, `[BE-AGNO-PUB-02]`, `[BE-AGNO-PUB-03]`, `[BE-AGNO-PUB-05]`, `[BE-AGNO-CTX-01]`
   - Impacto: mistura de contexto entre usuarios/oficinas, abuso de custo, e impossibilidade de cumprir o contrato do produto (chat por oficina).

3) **Multi-tenancy “de papel” no backend (scoping quebrado e padroes Prisma incorretos)**
   - Evidencia: `[BE-OS-PRISMA-01]`, `[BE-OS-SCOPE-01]`, `[BE-AI-OS-01]`, `[BE-AGEND-LOCAL-01]`
   - Impacto: endpoints quebram (500) e/ou permitem associar entidades cross-tenant por ID; alto risco de vazamento de dados.

4) **Data Layer inconsistente (Int vs UUID + models sem `oficinaId` + drift de migrations)**
   - Evidencia: `[DB-TYPES-01]`, `[DB-MIG-01]`
   - Impacto: historico/agendamento “legado” e intrinsecamente inseguro; deploy pode subir sem tabelas; integracoes falham por `parseInt => NaN`.

5) **Regras de negocio duplicadas/concorrentes (3 caminhos para OS/Agendamento)**
   - Evidencia: Observacoes finais da Area 2 + `[BE-AGEND-SVC-01]`, `[BE-AGEND-FLOW-01]`, `[BE-AI-STATS-01]`
   - Impacto: o sistema fica instavel e impossivel de evoluir sem regressao; qualquer correcao em um fluxo quebra outro.

---

## 4) Estrategia Macro de Correcao (plano de arquitetura)

### 4.1 Isolamento Radical (Tenant First)
- `oficinaId` vira **campo obrigatorio** e **filtro obrigatorio** em tudo que e dado do negocio.
- Regras:
  - backend nunca aceita `userId/oficinaId` do client como fonte de verdade (somente `req.user`).
  - rotas publicas exigem `oficinaRef` (UUID/slug) validado e ativo.
  - session/memory keys sempre namespaced: `of:{oficinaId}:u:{userId}` e `of:{oficinaId}:anon:{publicSessionId}`.

### 4.2 Unificar no Novo (deprecacao controlada)
- Consolidar OS/Agendamento/Consultas em modelos e rotas canonicas (UUID + FKs + constraints).
- Frontend migra para consumir apenas rotas canonicas.
- So depois: deletar `matias.routes.js`, `ConsultasOSService`/`AgendamentosService` legados e quaisquer endpoints fantasma.

### 4.3 Gateway Unico para IA (Node como “Policy Enforcement Point”)
- Python/AgentOS nao deve ser exposto publicamente sem auth.
- Node aplica:
  - rate limiting, tamanho de mensagem, politicas por role, e auditoria.
  - “public = read-only” (agente e toolset separados).
  - verificador (2o fator) antes de qualquer consulta sensivel (Status OS/orcamento).

### 4.4 Schema Primeiro (DB como fonte de verdade)
- Trocar unicidades globais por **unicidades compostas com `oficinaId`**.
- Reintroduzir FKs/indices para performance e integridade.
- Gerar migrations “limpas” alinhadas ao estado real do Postgres.

### 4.5 Qualidade como trava (QA/Obs minimo antes de escalar)
- Testes rodando de verdade (Vitest inclui TS/TSX).
- Smoke tests automatizados por deploy (health + agno + chat-public hardening).
- Observabilidade ponta-a-ponta (correlation id) + redacao de PII.

---

## 5) Go/No-Go (criterio objetivo antes de qualquer rollout)

No-Go ate:
- `OS_SECURITY_KEY` e `AGNO_API_TOKEN` estarem ativos e verificados (401 sem token no AgentOS).
- `chat-public` exigir `oficinaRef` + session anonima + rate limit + tamanho max + agente publico read-only.
- Prisma/schema/migrations alinhados (sem drift) e `oficinaId` corretamente aplicado em entidades criticas.

Go (para beta fechado) quando:
- Milestone 1 e Milestone 2 do backlog estiverem concluidos e com smoke tests.

