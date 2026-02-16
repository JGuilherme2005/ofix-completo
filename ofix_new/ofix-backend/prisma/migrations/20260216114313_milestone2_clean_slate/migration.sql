-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'GESTOR_OFICINA');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('AGUARDANDO', 'EM_ANDAMENTO', 'AGUARDANDO_PECAS', 'AGUARDANDO_APROVACAO', 'FINALIZADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "oficinaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oficina" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "cnpj" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oficina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoFabricacao" INTEGER,
    "anoModelo" INTEGER,
    "cor" TEXT,
    "chassi" TEXT,
    "kmAtual" INTEGER,
    "clienteId" TEXT NOT NULL,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL,
    "numeroOs" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "descricaoProblema" TEXT,
    "descricaoSolucao" TEXT,
    "dataEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevisaoEntrega" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "dataEntregaCliente" TIMESTAMP(3),
    "valorTotalEstimado" DECIMAL(65,30),
    "valorTotalServicos" DECIMAL(65,30),
    "valorTotalPecas" DECIMAL(65,30),
    "valorTotalFinal" DECIMAL(65,30),
    "kmEntrada" INTEGER,
    "checklist" JSONB,
    "observacoes" TEXT,
    "clienteId" TEXT,
    "veiculoId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" TEXT NOT NULL,
    "codigoInterno" TEXT,
    "codigoFabricante" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "fabricante" TEXT,
    "unidadeMedida" TEXT NOT NULL DEFAULT 'UN',
    "precoCusto" DECIMAL(65,30),
    "precoVenda" DECIMAL(65,30) NOT NULL,
    "estoqueAtual" INTEGER NOT NULL DEFAULT 0,
    "estoqueMinimo" INTEGER DEFAULT 0,
    "localizacao" TEXT,
    "oficinaId" TEXT NOT NULL,
    "fornecedorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpjCpf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemServicoPeca" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "pecaId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitarioCobrado" DECIMAL(65,30) NOT NULL,
    "valorTotal" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemServicoPeca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedimentoPadrao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tempoEstimadoHoras" DECIMAL(65,30),
    "checklistJson" JSONB,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT DEFAULT 'manutencao_preventiva',

    CONSTRAINT "ProcedimentoPadrao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedimentoPadraoServico" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "procedimentoPadraoId" TEXT NOT NULL,
    "observacoes" TEXT,
    "concluido" BOOLEAN NOT NULL DEFAULT false,
    "dataConclusao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedimentoPadraoServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensagemPadrao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT,

    CONSTRAINT "MensagemPadrao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensagemServico" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipoEnvio" TEXT NOT NULL,
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enviadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MensagemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financeiro" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "servicoId" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "titulo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "oficinaId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos_v2" (
    "id" TEXT NOT NULL,
    "oficinaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT,
    "servicoId" TEXT,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "origem" TEXT NOT NULL DEFAULT 'MANUAL',
    "observacoes" TEXT,
    "criadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_v2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_oficinaId_idx" ON "User"("oficinaId");

-- CreateIndex
CREATE UNIQUE INDEX "Oficina_slug_key" ON "Oficina"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Oficina_cnpj_key" ON "Oficina"("cnpj");

-- CreateIndex
CREATE INDEX "Cliente_oficinaId_nomeCompleto_idx" ON "Cliente"("oficinaId", "nomeCompleto");

-- CreateIndex
CREATE INDEX "Cliente_oficinaId_createdAt_idx" ON "Cliente"("oficinaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_oficinaId_cpfCnpj_key" ON "Cliente"("oficinaId", "cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_oficinaId_email_key" ON "Cliente"("oficinaId", "email");

-- CreateIndex
CREATE INDEX "Veiculo_oficinaId_clienteId_idx" ON "Veiculo"("oficinaId", "clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_oficinaId_placa_key" ON "Veiculo"("oficinaId", "placa");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_oficinaId_chassi_key" ON "Veiculo"("oficinaId", "chassi");

-- CreateIndex
CREATE INDEX "Servico_oficinaId_status_dataEntrada_idx" ON "Servico"("oficinaId", "status", "dataEntrada");

-- CreateIndex
CREATE INDEX "Servico_oficinaId_clienteId_idx" ON "Servico"("oficinaId", "clienteId");

-- CreateIndex
CREATE INDEX "Servico_oficinaId_veiculoId_idx" ON "Servico"("oficinaId", "veiculoId");

-- CreateIndex
CREATE UNIQUE INDEX "Servico_oficinaId_numeroOs_key" ON "Servico"("oficinaId", "numeroOs");

-- CreateIndex
CREATE INDEX "Peca_oficinaId_nome_idx" ON "Peca"("oficinaId", "nome");

-- CreateIndex
CREATE INDEX "Peca_oficinaId_fornecedorId_idx" ON "Peca"("oficinaId", "fornecedorId");

-- CreateIndex
CREATE UNIQUE INDEX "Peca_oficinaId_codigoInterno_key" ON "Peca"("oficinaId", "codigoInterno");

-- CreateIndex
CREATE INDEX "Fornecedor_oficinaId_nome_idx" ON "Fornecedor"("oficinaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_oficinaId_cnpjCpf_key" ON "Fornecedor"("oficinaId", "cnpjCpf");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_oficinaId_email_key" ON "Fornecedor"("oficinaId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "ItemServicoPeca_servicoId_pecaId_key" ON "ItemServicoPeca"("servicoId", "pecaId");

-- CreateIndex
CREATE INDEX "ProcedimentoPadrao_oficinaId_nome_idx" ON "ProcedimentoPadrao"("oficinaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoPadrao_oficinaId_codigo_key" ON "ProcedimentoPadrao"("oficinaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoPadraoServico_servicoId_procedimentoPadraoId_key" ON "ProcedimentoPadraoServico"("servicoId", "procedimentoPadraoId");

-- CreateIndex
CREATE UNIQUE INDEX "MensagemPadrao_oficinaId_codigo_key" ON "MensagemPadrao"("oficinaId", "codigo");

-- CreateIndex
CREATE INDEX "Financeiro_oficinaId_data_idx" ON "Financeiro"("oficinaId", "data");

-- CreateIndex
CREATE INDEX "Financeiro_oficinaId_tipo_idx" ON "Financeiro"("oficinaId", "tipo");

-- CreateIndex
CREATE INDEX "Financeiro_servicoId_idx" ON "Financeiro"("servicoId");

-- CreateIndex
CREATE INDEX "chat_sessions_oficinaId_createdAt_idx" ON "chat_sessions"("oficinaId", "createdAt");

-- CreateIndex
CREATE INDEX "chat_sessions_oficinaId_userId_idx" ON "chat_sessions"("oficinaId", "userId");

-- CreateIndex
CREATE INDEX "chat_sessions_oficinaId_status_idx" ON "chat_sessions"("oficinaId", "status");

-- CreateIndex
CREATE INDEX "chat_messages_sessionId_createdAt_idx" ON "chat_messages"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "agendamentos_v2_oficinaId_dataHora_idx" ON "agendamentos_v2"("oficinaId", "dataHora");

-- CreateIndex
CREATE INDEX "agendamentos_v2_oficinaId_status_idx" ON "agendamentos_v2"("oficinaId", "status");

-- CreateIndex
CREATE INDEX "agendamentos_v2_oficinaId_clienteId_idx" ON "agendamentos_v2"("oficinaId", "clienteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peca" ADD CONSTRAINT "Peca_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peca" ADD CONSTRAINT "Peca_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemServicoPeca" ADD CONSTRAINT "ItemServicoPeca_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemServicoPeca" ADD CONSTRAINT "ItemServicoPeca_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "Peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedimentoPadrao" ADD CONSTRAINT "ProcedimentoPadrao_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedimentoPadraoServico" ADD CONSTRAINT "ProcedimentoPadraoServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedimentoPadraoServico" ADD CONSTRAINT "ProcedimentoPadraoServico_procedimentoPadraoId_fkey" FOREIGN KEY ("procedimentoPadraoId") REFERENCES "ProcedimentoPadrao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagemPadrao" ADD CONSTRAINT "MensagemPadrao_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagemServico" ADD CONSTRAINT "MensagemServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos_v2" ADD CONSTRAINT "agendamentos_v2_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos_v2" ADD CONSTRAINT "agendamentos_v2_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos_v2" ADD CONSTRAINT "agendamentos_v2_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos_v2" ADD CONSTRAINT "agendamentos_v2_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
