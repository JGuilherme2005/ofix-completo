import prisma from '../config/database.js';

// ============================================================================
// Agendamentos Service — Milestone 2 (UUID + multi-tenancy)
//
// Modelo Prisma: Agendamento (tabela "agendamentos_v2")
//   id          String   @id @default(uuid())
//   oficinaId   String           ← obrigatório em toda query
//   clienteId   String (UUID)
//   veiculoId   String? (UUID)
//   servicoId   String? (UUID)
//   dataHora    DateTime
//   tipo        String   "normal" | "urgente" | "programado" | "especial"
//   status      String   "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED"
//   origem      String   "MANUAL" | "AI_CHAT" | "WHATSAPP"
//   observacoes String?
//   criadoPor   String?  (userId ou "matias")
//   createdAt   DateTime
//   updatedAt   DateTime
// ============================================================================

/** Campos padrão para include nas queries */
const INCLUDE_PADRAO = {
    cliente: {
        select: {
            nomeCompleto: true,
            telefone: true
        }
    },
    veiculo: {
        select: {
            marca: true,
            modelo: true,
            anoModelo: true,
            placa: true
        }
    }
};

class AgendamentosService {

    // ── Criar novo agendamento ─────────────────────────────────────────
    static async criarAgendamento({
        oficinaId,
        clienteId,
        veiculoId = null,
        servicoId = null,
        dataHora,
        tipo = 'normal',
        status = 'PENDING',
        origem = 'MANUAL',
        observacoes = null,
        criadoPor = null
    }) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');
        if (!clienteId) throw new Error('clienteId é obrigatório');

        try {
            const agendamento = await prisma.agendamento.create({
                data: {
                    oficinaId: String(oficinaId),
                    clienteId: String(clienteId),
                    veiculoId: veiculoId ? String(veiculoId) : null,
                    servicoId: servicoId ? String(servicoId) : null,
                    dataHora: new Date(dataHora),
                    tipo,
                    status,
                    origem,
                    observacoes: observacoes || null,
                    criadoPor: criadoPor ? String(criadoPor) : null
                },
                include: INCLUDE_PADRAO
            });

            console.log('✅ Agendamento criado:', agendamento.id);
            return agendamento;

        } catch (error) {
            console.error('❌ Erro ao criar agendamento:', error);
            throw new Error(`Erro ao criar agendamento: ${error.message}`);
        }
    }

    // ── Listar agendamentos por período ────────────────────────────────
    static async listarAgendamentos(oficinaId, periodo = 'semana') {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            let dataInicio = new Date();
            let dataFim = new Date();

            switch (periodo) {
                case 'hoje':
                    dataInicio.setHours(0, 0, 0, 0);
                    dataFim.setHours(23, 59, 59, 999);
                    break;
                case 'semana':
                    dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());
                    dataInicio.setHours(0, 0, 0, 0);
                    dataFim.setDate(dataInicio.getDate() + 6);
                    dataFim.setHours(23, 59, 59, 999);
                    break;
                case 'mes':
                    dataInicio.setDate(1);
                    dataInicio.setHours(0, 0, 0, 0);
                    dataFim.setMonth(dataFim.getMonth() + 1, 0);
                    dataFim.setHours(23, 59, 59, 999);
                    break;
            }

            const agendamentos = await prisma.agendamento.findMany({
                where: {
                    oficinaId,
                    dataHora: {
                        gte: dataInicio,
                        lte: dataFim
                    }
                },
                include: INCLUDE_PADRAO,
                orderBy: {
                    dataHora: 'asc'
                }
            });

            console.log(`📅 Agendamentos ${periodo}: ${agendamentos.length} encontrados`);
            return agendamentos;

        } catch (error) {
            console.error('❌ Erro ao listar agendamentos:', error);
            throw new Error(`Erro ao listar agendamentos: ${error.message}`);
        }
    }

    // ── Atualizar status do agendamento ────────────────────────────────
    static async atualizarStatus(oficinaId, agendamentoId, novoStatus) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            // Garantir que o agendamento pertence à oficina (segurança multi-tenant)
            const existente = await prisma.agendamento.findFirst({
                where: { id: String(agendamentoId), oficinaId }
            });
            if (!existente) throw new Error('Agendamento não encontrado nesta oficina');

            const agendamento = await prisma.agendamento.update({
                where: {
                    id: String(agendamentoId)
                },
                data: {
                    status: novoStatus
                    // updatedAt é @updatedAt automático
                },
                include: {
                    cliente: { select: { nomeCompleto: true } },
                    veiculo: { select: { marca: true, modelo: true } }
                }
            });

            console.log(`✅ Status atualizado para ${novoStatus}:`, agendamento.id);
            return agendamento;

        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            throw new Error(`Erro ao atualizar status: ${error.message}`);
        }
    }

    // ── Buscar agendamentos por cliente ────────────────────────────────
    static async buscarPorCliente(oficinaId, clienteNome) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const agendamentos = await prisma.agendamento.findMany({
                where: {
                    oficinaId,
                    cliente: {
                        nomeCompleto: {
                            contains: clienteNome,
                            mode: 'insensitive'
                        }
                    }
                },
                include: INCLUDE_PADRAO,
                orderBy: {
                    dataHora: 'desc'
                },
                take: 10
            });

            console.log(`🔍 Agendamentos para cliente "${clienteNome}": ${agendamentos.length} encontrados`);
            return agendamentos;

        } catch (error) {
            console.error('❌ Erro na busca por cliente:', error);
            throw new Error(`Erro na busca por cliente: ${error.message}`);
        }
    }

    // ── Verificar disponibilidade ──────────────────────────────────────
    static async verificarDisponibilidade(oficinaId, dataHora) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const data = new Date(dataHora);
            const dataInicio = new Date(data.getTime() - 30 * 60000); // 30 min antes
            const dataFim = new Date(data.getTime() + 30 * 60000);   // 30 min depois

            const conflitos = await prisma.agendamento.count({
                where: {
                    oficinaId,
                    dataHora: {
                        gte: dataInicio,
                        lte: dataFim
                    },
                    status: {
                        not: 'CANCELED'
                    }
                }
            });

            const disponivel = conflitos === 0;
            console.log(`📅 Disponibilidade para ${data.toLocaleString('pt-BR')}: ${disponivel ? 'LIVRE' : 'OCUPADO'}`);

            return {
                disponivel,
                data_hora: data,
                conflitos
            };

        } catch (error) {
            console.error('❌ Erro ao verificar disponibilidade:', error);
            throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
        }
    }
}

export default AgendamentosService;