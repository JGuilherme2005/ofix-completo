# AREA 3 - Data Layer (Prisma & DB)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `schema.prisma`, multi-tenancy (`oficinaId`), consistencia de tipos (Int vs UUID), indices para performance e aderencia entre schema e migrations.

Arquivos-base:
- `ofix_new/ofix-backend/prisma/schema.prisma`
- `ofix_new/ofix-backend/prisma/migrations/**/migration.sql`

---

## Achados

### [DB-TENANT-01] Unicidades globais quebram o modelo multi-tenant (devem ser por oficina)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (Cliente ~49, Veiculo ~64, Servico ~83, Peca ~115, Fornecedor ~137, ProcedimentoPadrao ~166, MensagemPadrao ~196)
- **Diagnostico:** varios campos estao marcados como `@unique` globalmente:
  - `Cliente.cpfCnpj`, `Cliente.email`
  - `Veiculo.placa`, `Veiculo.chassi`
  - `Servico.numeroOs`
  - `Peca.codigoInterno`
  - `Fornecedor.cnpjCpf`, `Fornecedor.email`
  - `ProcedimentoPadrao.codigo`
  - `MensagemPadrao.codigo`
  Com isso, dois tenants (oficinas) nao podem cadastrar o mesmo email/CPF/placa/numero OS/codigos, mesmo sendo dados “locais” de cada oficina.
- **Risco:** impede escalar multi-tenant de verdade (onboarding de novas oficinas falha com 409/constraint) e “forca” deduplicacao cruzada entre oficinas (contra o isolamento).
- **Correcao proposta:** substituir unicidades globais por unicidades compostas com `oficinaId` (exemplos):
  - `Cliente`: `@@unique([oficinaId, email])` e `@@unique([oficinaId, cpfCnpj])`
  - `Veiculo`: `@@unique([oficinaId, placa])` e `@@unique([oficinaId, chassi])`
  - `Servico`: `@@unique([oficinaId, numeroOs])`
  - `Fornecedor`: `@@unique([oficinaId, email])` / `@@unique([oficinaId, cnpjCpf])`
  - `Peca`: `@@unique([oficinaId, codigoInterno])` (se fizer sentido manter esse campo)
  - `ProcedimentoPadrao`/`MensagemPadrao`: `@@unique([oficinaId, codigo])`
  Observacao: campos opcionais com `unique` exigem padrao de escrita `null/undefined` (nunca `''`) para evitar colisoes artificiais.

### [DB-TENANT-02] `Veiculo.oficinaId` e opcional, mas o backend assume filtro por oficina
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (Veiculo ~64-81)
- **Diagnostico:** `Veiculo.oficinaId String?` permite veiculos sem oficina. O backend ja consulta por `where: { oficinaId }` (ex: `ofix_new/ofix-backend/src/controllers/veiculos.controller.js`) e cria veiculos conectando oficina, mas o schema permite drift/legado.
- **Risco:** veiculos “invisiveis” em listagens por oficina; inconsistencias de scoping (um veiculo pode existir sem tenant).
- **Correcao proposta:** tornar `Veiculo.oficinaId` obrigatorio e garantir backfill de dados existentes usando `cliente.oficinaId` como fonte de verdade.

### [DB-TYPES-01] Modelos “Matias/Agendamento” estao inconsistentes (Int vs UUID) e sem `oficinaId`
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (ConversaMatias ~251, MensagemMatias ~265, Agendamento ~279)
- **Diagnostico:**
  - Core do sistema usa UUID (`String @default(uuid())`) para `User/Oficina/Cliente/Veiculo/Servico`.
  - `ConversaMatias.userId` e `Int` e nao referencia `User.id`.
  - `Agendamento` usa `clienteId/veiculoId/servicoId` como `Int`, mas no schema oficial esses IDs sao `String (UUID)`.
  - Nenhum desses modelos tem `oficinaId` para isolar por tenant.
- **Risco:** mistura Int/UUID e falta de scoping torna esses dados intrinsecamente inseguros (cross-user / cross-tenant) e quebra integracoes (parseInt => NaN; joins impossiveis; historico/agendamento instavel).
- **Correcao proposta:** seguindo sua diretriz “Unificar no Novo”:
  - criar/ajustar modelos “novos” com UUID + `oficinaId` (ex: `ChatSession`, `ChatMessage`, `AgendamentoLead`/`AgendamentoPublicoLead`), ou migrar `ConversaMatias/MensagemMatias` para `String userId` + `String oficinaId` e IDs UUID.
  - descontinuar o modelo `Agendamento` atual (Int) e reimplementar agenda/lead baseado em modelos oficiais e FKs coerentes.

### [DB-MIG-01] Drift entre `schema.prisma` e migrations: tabelas Matias/Agendamento nao aparecem nas migrations
- **Severidade:** P0
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/migrations/**/migration.sql`
- **Diagnostico:** as migrations versionadas nao contem criacao de `conversas_matias`, `mensagens_matias` nem `agendamentos` (modelos no fim do `schema.prisma`).
- **Risco:** deploy via `prisma migrate deploy` nao cria essas tabelas automaticamente; qualquer rota/servico que dependa delas tende a falhar em runtime (erro de tabela inexistente) ou ficar dependente de “criacoes manuais” (nao reproduzivel).
- **Correcao proposta:** gerar migrations oficiais para:
  - criar os modelos novos/unificados (UUID + oficinaId) e/ou
  - remover do schema os modelos que nao devem existir (ate serem substituidos), evitando “schema fantasma”.

### [DB-INDEX-01] Falta de indices para multi-tenant (quase todas as queries filtram por `oficinaId`)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (modelos com `oficinaId`)
- **Diagnostico:** fora `@unique`, praticamente nao existem `@@index(...)`. No backend, padrao dominante e `where: { oficinaId }` + `orderBy` por nome/data/status.
- **Risco:** com crescimento de dados por oficina, consultas viram scan (lentas), impactando dashboard, listagens e chat (quando fizer lookups).
- **Correcao proposta:** adicionar indices (B-tree) minimos por tabela (baseado nos padrões atuais de query):
  - `User`: `@@index([oficinaId])` (se existir listagem/admin por oficina)
  - `Cliente`: `@@index([oficinaId, nomeCompleto])`, `@@index([oficinaId, createdAt])`
  - `Veiculo`: `@@index([oficinaId, placa])`, `@@index([clienteId])`
  - `Servico`: `@@index([oficinaId, status])`, `@@index([oficinaId, dataEntrada])`, `@@index([oficinaId, veiculoId])`, `@@index([oficinaId, clienteId])`
  - `Peca`: `@@index([oficinaId, nome])`, `@@index([oficinaId, estoqueAtual])`, `@@index([oficinaId, fornecedorId])`
  - `Fornecedor`: `@@index([oficinaId, nome])`
  - `ProcedimentoPadrao`: `@@index([oficinaId, categoria])`, `@@index([oficinaId, nome])`
  - `MensagemPadrao`: `@@index([oficinaId, categoria])`, `@@index([oficinaId, nome])`
  - `Financeiro`: `@@index([oficinaId, data])`, `@@index([oficinaId, tipo])`
  Observacao: para buscas com `contains/ILIKE` em texto (nomeCompleto/placa), indices B-tree nao ajudam muito; quando for prioridade, considerar `pg_trgm` + indices GIN por tenant.

### [DB-INTEGRITY-01] Foreign keys foram removidas por migration; integridade referencial nao esta garantida no banco
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/migrations/20250714154950_sync_teste/migration.sql`
- **Diagnostico:** essa migration faz `DROP CONSTRAINT ..._fkey` para praticamente todas as relacoes (User->Oficina, Cliente->Oficina, Veiculo->Cliente/Oficina, Servico->Cliente/Veiculo/User/Oficina, etc).
- **Risco:** orfaos, links cruzados entre tenants (por bug), e dificuldade de manter consistencia sob concorrencia/importacoes. “OficinaId scoping” vira apenas convencao de app.
- **Correcao proposta:** na fase “Unificar no Novo”, decidir explicitamente:
  - (A) reintroduzir FKs (recomendado para Postgres) e manter `relationMode` padrao (foreignKeys), ou
  - (B) manter sem FKs, mas reforcar validacoes e adicionar constraints/rotinas de limpeza (mais risco).

### [DB-REL-01] `Financeiro.servicoId` nao e relation (perde integridade e joins)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (Financeiro ~220)
- **Diagnostico:** existe campo `servicoId String?`, mas nao existe `servico Servico? @relation(...)`.
- **Risco:** dados financeiros ficam “soltos” (sem integridade) e consultas agregadas por OS exigem query manual/fragil.
- **Correcao proposta:** adicionar relacao opcional com `Servico` (e index em `servicoId` se usado em filtros).

### [DB-PUBLIC-01] Falta suporte no schema para contrato do Chat Publico (slug/ativo/config public)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/ofix-backend/prisma/schema.prisma` (Oficina ~30)
- **Diagnostico:** contrato do produto pede oficina via UUID **ou slug** e validacao de “ativo”. Hoje `Oficina` nao tem `slug` nem `isActive`.
- **Risco:** chat-public nao consegue validar “oficina existe/ativa” de forma consistente (vai ficar na gambiarra do app).
- **Correcao proposta:** adicionar `slug` (unico) e `isActive`/`status` em `Oficina`, e criar tabela/config para credenciais publicas (ex: `publicTokenHash`, limites, branding) se for necessario.

---

## Observacao (alinhamento com sua diretriz “Unificar no Novo”)
Os maiores problemas de estabilidade hoje (Area 2) batem diretamente no Data Layer:
- models Int (`Agendamento`, `ConversaMatias`) nao casam com UUID do core
- unicidades globais impedem multi-tenancy real
- falta de indices e FKs deixa o sistema fragil sob crescimento

O caminho recomendado e: ajustar o schema (UUID + oficinaId + indices + constraints), migrar o backend para rotas canonicas e depois migrar o frontend para consumir apenas essas rotas.

