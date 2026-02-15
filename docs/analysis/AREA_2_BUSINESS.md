# AREA 2 - Backend Business Logic & Validation (OS, Agendamento)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: controllers/services/regras de negocio (OS e agendamento) + validacao de inputs criticos + respeito ao `oficinaId` (multi-tenant).

---

## Check de uso - `matias.routes.js` no Frontend

As rotas de `ofix_new/ofix-backend/src/routes/matias.routes.js` **estao sendo chamadas pelo Frontend**.

Evidencias:
- `ofix_new/src/services/conversas.service.js` chama:
  - `POST /api/matias/conversas/mensagem`
  - `GET /api/matias/conversas/historico/:userId`
  - `GET /api/matias/conversas/:conversaId/mensagens`
  - (tambem chama endpoints que nao existem no backend: `/api/matias/conversas/nova`, `/api/matias/conversas/:id/arquivar`)
- `ofix_new/src/hooks/useMatiasOffline.js` chama: `POST /api/matias/chat` (nao existe no backend atual)
- `ofix_new/src/components/ai/MatiasWidget*.tsx` chama: `POST /api/matias/chat` e `POST /api/matias/voice` (nao existem no backend atual)

Conclusao: **nao e codigo morto**; esta em uso (e hoje, parte disso esta quebrado/misalinhado).

---

## Achados

### [BE-OS-PRISMA-01] Uso incorreto de `findUnique/update/delete` com `where: { id, oficinaId }` (nao e unique input)
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/controllers/servicos.controller.js:155`, `:202`, `:244`, `:279`, `:290` (padrao similar aparece em outros controllers)
- **Diagnostico:** Prisma `findUnique`, `update` e `delete` aceitam `where` do tipo `WhereUniqueInput`. No schema atual, `Servico` e `Cliente` possuem `id` unico por si so; **nao existe unique composto `(id, oficinaId)`**. Portanto, chamadas como `findUnique({ where: { id, oficinaId } })` tendem a falhar em runtime (validacao do Prisma) ou a nao fazer o que se espera.
- **Risco:** endpoints de OS podem estar quebrados em producao (500) e/ou a garantia de tenant scoping fica inconsistente (o codigo "parece" seguro, mas nao esta implementando scoping corretamente).
- **Correcao proposta:** para leituras, usar `findFirst({ where: { id, oficinaId } })`. Para mutacoes, preferir `updateMany/deleteMany` com `{ id, oficinaId }` e checar `count`, ou fazer `findFirst` (ownership) + `update({ where: { id } })` dentro de transacao.

### [BE-OS-VALID-01] Validacao insuficiente de inputs criticos (UUIDs, datas, valores) no CRUD de OS
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/servicos.routes.js` + `ofix_new/ofix-backend/src/controllers/servicos.controller.js`
- **Diagnostico:**
  - `/:id` nao valida UUID (nenhum `validateUUID`/schema validation no router).
  - `createServico` valida presenca de `numeroOs/clienteId/veiculoId`, mas nao valida formato (UUID), nao valida `status` contra `ServiceStatus`, e converte datas com `new Date(...)` sem checar `Invalid Date`.
  - `getAllServicos` aceita filtros (`status`, `dataDe`, `dataAte`) sem validacao/normalizacao; `new Date(dataDe)` pode virar data invalida.
  - Campos decimais/inteiros (km/valores) entram sem coercao/checagem.
- **Risco:** 500 por datas invalidas / ids invalidos; dados inconsistentes; maior superficie para abusos (payloads estranhos) e para bugs de regra (status inesperado).
- **Correcao proposta:** introduzir validacao por schema por endpoint (ex: Zod) e/ou middlewares dedicados:
  - `id`/`clienteId`/`veiculoId`/`responsavelId`: UUID valido
  - datas: parse + `isNaN(date.getTime())` + timezone/padrao
  - status: `ServiceStatus`
  - valores: parse/limites (>=0 etc)

### [BE-OS-SCOPE-01] Checagens de ownership (cliente/veiculo/responsavel) tentam escopar por oficina mas estao incorretas
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/controllers/servicos.controller.js:29`, `:33`, `:38`, `:210`, `:214`, `:220`
- **Diagnostico:** o controller tenta garantir que cliente/responsavel pertencem a oficina e que veiculo pertence ao cliente, mas usa `findUnique` com campos extras (ex: `{ id: clienteId, oficinaId }`, `{ id: veiculoId, clienteId }`), o que nao bate com o schema/Prisma.
- **Risco:** (1) quebra funcional (500) ao criar/atualizar OS; (2) se "corrigido pela metade", pode abrir brecha para associar entidades de outra oficina por id (cross-tenant link).
- **Correcao proposta:** usar `findFirst` com filtros completos e sempre derivar `oficinaId` do `req.user`. Para veiculo, garantir `veiculo.clienteId` e que o `cliente.oficinaId === oficinaId`.

### [BE-AI-OS-01] `ConsultasOSService` ignora `oficinaId` e esta divergente do schema (vazamento cross-tenant + quebra funcional)
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:1828` + `ofix_new/ofix-backend/src/services/consultasOS.service.js`
- **Diagnostico:**
  - A rota `/agno/consultar-os` passa `oficinaId`, mas `ConsultasOSService.consultarOS` nao recebe/nao aplica esse filtro.
  - O service usa campos/relacoes que nao batem com o schema atual (ex: `cliente.nome` em vez de `cliente.nomeCompleto`, `dataAbertura`, `veiculo.ordensServico`, `valorTotal`).
  - Instancia `new PrismaClient()` em vez do singleton `src/config/database.js`.
- **Risco:** (1) vazamento de dados entre oficinas nas consultas de OS; (2) endpoint quebra em runtime por campos inexistentes; (3) risco de conexoes excedidas por multiplas instancias de PrismaClient.
- **Correcao proposta:** reescrever `ConsultasOSService` para:
  - aceitar `oficinaId` obrigatorio e sempre filtrar `Servico.where.oficinaId = oficinaId`
  - alinhar nomes de campos/relacoes com `prisma/schema.prisma`
  - usar o prisma singleton (`src/config/database.js`)

### [BE-AI-STATS-01] Estatisticas via Agno estao inconsistentes (oficinaId ignorado + chamada de metodo inexistente)
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js:1931` + func `processarEstatisticas` em `ofix_new/ofix-backend/src/routes/agno.routes.js:1460` + `ofix_new/ofix-backend/src/services/consultasOS.service.js`
- **Diagnostico:**
  - `/agno/estatisticas` chama `ConsultasOSService.obterEstatisticas(periodo, oficinaId)`, mas o service ignora `oficinaId` (assinatura atual aceita 1 parametro).
  - `processarEstatisticas` chama `ConsultasOSService.obterResumoOfficina(...)`, mas esse metodo **nao existe** (existe `obterResumoDiario`).
- **Risco:** estatisticas erradas (cross-tenant) e/ou 500 (metodo inexistente).
- **Correcao proposta:** definir API unica de estatisticas (com `oficinaId` obrigatorio) e alinhar chamadas/assinaturas. Se a intencao e "hoje", implementar `obterResumoOfficina({ oficinaId, periodo })` ou adaptar para `obterResumoDiario` + filtros por oficina (depende da Area 3 se faltar campo no DB).

### [BE-AGEND-SVC-01] `AgendamentosService` nao bate com o schema e nao suporta multi-tenancy
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/services/agendamentos.service.js`
- **Diagnostico:**
  - Usa `new PrismaClient()` e tenta escrever campos que nao existem no schema (`tipoServico`, `descricao`, `criadoEm`, `atualizadoEm`) e inclui relacoes inexistentes (`include: { cliente, veiculo }`).
  - Faz `parseInt(clienteId/veiculoId)` mas no schema atual `Cliente.id` e `Veiculo.id` sao UUID (string). Isso vira `NaN`.
  - Nao existe `oficinaId` no modelo `Agendamento` atual para filtrar conflitos por oficina.
- **Risco:** endpoints de agendamento quebrados (500), e mesmo que funcionassem seriam cross-tenant.
- **Correcao proposta:** decidir o modelo canonico de agendamento:
  - curto prazo (sem "bloquear agenda"): salvar como **Lead/Intencao** (tabela separada) ou como "OS AGUARDANDO" (em `Servico`) com confirmacao humana.
  - medio prazo (agenda real): criar modelo `Agendamento` com `oficinaId` + FKs UUID para `Cliente`/`Veiculo` (Area 3) e reescrever o service em cima disso.

### [BE-AGEND-FLOW-01] Fluxo de agendamento em `agno.routes.js` faz checagem de conflito global e usa relacoes inexistentes
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/agno.routes.js` func `processarAgendamento` (~899-1330)
- **Diagnostico:** checa conflito em `prisma.agendamento.findFirst({ include: { cliente: true } })`, mas `Agendamento` nao tem relacao `cliente` no schema. Alem disso, nao filtra por oficina (e hoje nem existe `oficinaId` nesse modelo).
- **Risco:** 500 em runtime e/ou checagem de conflito errada entre oficinas.
- **Correcao proposta:** migrar checagem de disponibilidade para um modelo com `oficinaId` (Area 3) ou, enquanto isso, tratar como lead e deixar "conflito" para validacao humana da oficina.

### [BE-AGEND-LOCAL-01] `AgendamentoLocalService` viola multi-tenancy e pode quebrar cadastros por unique constraints
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/services/agendamento-local.service.js:322-356`
- **Diagnostico:**
  - Busca cliente por nome **sem filtrar `oficinaId`** (`prisma.cliente.findMany`), podendo selecionar cliente de outra oficina.
  - Ao criar cliente, seta `telefone/email/cpfCnpj` como string vazia (`''`). No schema, `email` e `cpfCnpj` sao `@unique` (mesmo sendo opcionais). Varios registros com `''` vao colidir em `P2002`.
- **Risco:** vazamento cross-tenant e quebra do fluxo (falha ao criar segundo cliente "vazio").
- **Correcao proposta:** sempre filtrar por `oficinaId` derivado de `req.user`. Para campos opcionais unicos, usar `null/undefined` (nao `''`) ate o dado existir.

### [BE-AGEND-LOCAL-02] Contrato de entidades inconsistente entre NLP e agendamento local (chaves diferentes)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/src/services/agendamento-local.service.js:134-137` + `ofix_new/ofix-backend/src/services/nlp.service.js:79+`
- **Diagnostico:** `AgendamentoLocalService.validarEntidades` exige `data`, mas o NLP extrai `diaSemana` e `dataEspecifica` (nao `data`). Isso reduz a chance de completar o fluxo corretamente e pode criar agendamentos com data default (hoje) por fallback de `montarDataHora`.
- **Risco:** agendamento criado com data/hora erradas, loop de perguntas, UX ruim e erros operacionais.
- **Correcao proposta:** padronizar contrato de entidades (ex: sempre normalizar para `dataISO`), e validar `Invalid Date` antes de criar OS.

### [BE-MATIAS-LEGACY-02] `matias.routes.js` mistura IDs int/UUID, nao escopa por oficina e tem endpoints quebrados por schema
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/src/routes/matias.routes.js`
- **Diagnostico:**
  - Aceita `userId` do client e converte com `parseInt` (incompatibilidade com `User.id` UUID).
  - Consultas de OS e veiculos nao filtram por `oficinaId` (`/servicos/count`, `/veiculos`).
  - Usa `prisma.procedimentoServico` (model nao existe no schema atual).
  - Agendamentos usam `clienteId/veiculoId` como `Int` desconectado do modelo real (`Cliente/Veiculo` sao UUID), entao vira um "agendamento sem vinculo real".
- **Risco:** vazamento cross-tenant + endpoints quebrados/enganosos (dados sem integridade).
- **Correcao proposta:** plano de deprecacao:
  - curto prazo: bloquear/limitar rotas problematica (ou esconder do FE) e redirecionar UX para `/api/agno/chat-inteligente` e endpoints canonicos.
  - medio prazo: reimplementar persistencia/agenda em modelos UUID + `oficinaId` (Area 3) e reescrever rotas para usar `req.user` (nunca `userId` do client).

---

## Observacoes finais (Area 2)
- Hoje existem **3 implementacoes** concorrentes de OS/Agendamento: CRUD `servicos.controller`, funcoes locais em `agno.routes.js` e rotas legacy `matias.routes.js` + services legados (`ConsultasOSService`, `AgendamentosService`). Isso aumenta muito a chance de bug e quebra de tenant scoping.
- Varias falhas aqui dependem de alinhamento com a Area 3 (schema/modelos) para ficarem "certas" de forma definitiva (ex: agenda com `oficinaId`, FK UUID).

