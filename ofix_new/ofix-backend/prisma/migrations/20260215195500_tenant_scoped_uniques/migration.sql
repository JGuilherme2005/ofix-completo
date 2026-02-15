-- Tenant-scoped uniques and stronger multi-tenant guarantees.
-- DB is considered disposable in this phase; it's OK to delete legacy/invalid rows.

-- Backfill Veiculo.oficinaId from Cliente.oficinaId when missing.
UPDATE "Veiculo" v
SET "oficinaId" = c."oficinaId"
FROM "Cliente" c
WHERE v."oficinaId" IS NULL
  AND v."clienteId" = c."id";

-- Drop any remaining vehicles without an office scope (unsafe for multi-tenancy).
DELETE FROM "Veiculo"
WHERE "oficinaId" IS NULL;

-- Enforce oficinaId required on Veiculo.
ALTER TABLE "Veiculo" ALTER COLUMN "oficinaId" SET NOT NULL;

-- Drop legacy global unique indexes that block multi-tenancy.
DROP INDEX IF EXISTS "Cliente_cpfCnpj_key";
DROP INDEX IF EXISTS "Cliente_email_key";
DROP INDEX IF EXISTS "Veiculo_placa_key";
DROP INDEX IF EXISTS "Veiculo_chassi_key";
DROP INDEX IF EXISTS "Servico_numeroOs_key";
DROP INDEX IF EXISTS "Peca_codigoInterno_key";
DROP INDEX IF EXISTS "Fornecedor_cnpjCpf_key";
DROP INDEX IF EXISTS "Fornecedor_email_key";
DROP INDEX IF EXISTS "ProcedimentoPadrao_codigo_key";
DROP INDEX IF EXISTS "MensagemPadrao_codigo_key";

-- Create tenant-scoped uniques + supporting indexes.
CREATE UNIQUE INDEX IF NOT EXISTS "Cliente_oficinaId_cpfCnpj_key" ON "Cliente" ("oficinaId", "cpfCnpj");
CREATE UNIQUE INDEX IF NOT EXISTS "Cliente_oficinaId_email_key" ON "Cliente" ("oficinaId", "email");
CREATE INDEX IF NOT EXISTS "Cliente_oficinaId_nomeCompleto_idx" ON "Cliente" ("oficinaId", "nomeCompleto");

CREATE UNIQUE INDEX IF NOT EXISTS "Veiculo_oficinaId_placa_key" ON "Veiculo" ("oficinaId", "placa");
CREATE UNIQUE INDEX IF NOT EXISTS "Veiculo_oficinaId_chassi_key" ON "Veiculo" ("oficinaId", "chassi");
CREATE INDEX IF NOT EXISTS "Veiculo_oficinaId_clienteId_idx" ON "Veiculo" ("oficinaId", "clienteId");

CREATE UNIQUE INDEX IF NOT EXISTS "Servico_oficinaId_numeroOs_key" ON "Servico" ("oficinaId", "numeroOs");
CREATE INDEX IF NOT EXISTS "Servico_oficinaId_status_dataEntrada_idx" ON "Servico" ("oficinaId", "status", "dataEntrada");

CREATE UNIQUE INDEX IF NOT EXISTS "Peca_oficinaId_codigoInterno_key" ON "Peca" ("oficinaId", "codigoInterno");
CREATE INDEX IF NOT EXISTS "Peca_oficinaId_nome_idx" ON "Peca" ("oficinaId", "nome");

CREATE UNIQUE INDEX IF NOT EXISTS "Fornecedor_oficinaId_cnpjCpf_key" ON "Fornecedor" ("oficinaId", "cnpjCpf");
CREATE UNIQUE INDEX IF NOT EXISTS "Fornecedor_oficinaId_email_key" ON "Fornecedor" ("oficinaId", "email");
CREATE INDEX IF NOT EXISTS "Fornecedor_oficinaId_nome_idx" ON "Fornecedor" ("oficinaId", "nome");

CREATE UNIQUE INDEX IF NOT EXISTS "ProcedimentoPadrao_oficinaId_codigo_key" ON "ProcedimentoPadrao" ("oficinaId", "codigo");
CREATE INDEX IF NOT EXISTS "ProcedimentoPadrao_oficinaId_nome_idx" ON "ProcedimentoPadrao" ("oficinaId", "nome");

CREATE UNIQUE INDEX IF NOT EXISTS "MensagemPadrao_oficinaId_codigo_key" ON "MensagemPadrao" ("oficinaId", "codigo");

