import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// ConsultasOS Service — Milestone 2 (multi-tenancy + field fixes)
//
// Correções aplicadas:
//   - oficinaId obrigatório em todas as queries
//   - cliente.nome → cliente.nomeCompleto
//   - dataAbertura → dataEntrada (campo real no schema)
//   - veiculo.ordensServico → veiculo.servicos (relação correta)
//   - valorTotal → valorTotalFinal (campo real no schema)
//   - agendamento.status: 'CANCELADO' → 'CANCELED' (novo enum)
// ============================================================================

class ConsultasOSService {

    // ── Consultar ordens de serviço ────────────────────────────────────
    static async consultarOS(oficinaId, { veiculo, proprietario, status, periodo } = {}) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const whereClause = { oficinaId };

            // Filtros opcionais
            if (veiculo) {
                whereClause.veiculo = {
                    OR: [
                        { marca: { contains: veiculo, mode: 'insensitive' } },
                        { modelo: { contains: veiculo, mode: 'insensitive' } },
                        { placa: { contains: veiculo, mode: 'insensitive' } }
                    ]
                };
            }

            if (proprietario) {
                whereClause.cliente = {
                    nomeCompleto: { contains: proprietario, mode: 'insensitive' }
                };
            }

            if (status) {
                whereClause.status = status.toUpperCase();
            }

            if (periodo) {
                const dataFiltro = this.calcularPeriodo(periodo);
                if (dataFiltro) {
                    whereClause.dataEntrada = dataFiltro;
                }
            }

            const ordensServico = await prisma.servico.findMany({
                where: whereClause,
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nomeCompleto: true,
                            telefone: true
                        }
                    },
                    veiculo: {
                        select: {
                            id: true,
                            marca: true,
                            modelo: true,
                            anoModelo: true,
                            placa: true
                        }
                    },
                    itensPeca: {
                        select: {
                            id: true,
                            quantidade: true,
                            precoUnitarioCobrado: true,
                            valorTotal: true
                        }
                    }
                },
                orderBy: {
                    dataEntrada: 'desc'
                }
            });

            console.log(`🔍 Consulta OS: ${ordensServico.length} encontradas`);
            return ordensServico;

        } catch (error) {
            console.error('❌ Erro na consulta OS:', error);
            throw new Error(`Erro na consulta OS: ${error.message}`);
        }
    }

    // ── Obter estatísticas da oficina ──────────────────────────────────
    static async obterEstatisticas(oficinaId, periodo = '30_dias') {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const dataFiltro = this.calcularPeriodo(periodo);
            const whereClause = { oficinaId };
            if (dataFiltro) whereClause.dataEntrada = dataFiltro;

            // Total de OS
            const totalOS = await prisma.servico.count({
                where: whereClause
            });

            // OS concluídas
            const osConcluidas = await prisma.servico.count({
                where: {
                    ...whereClause,
                    status: 'FINALIZADO'
                }
            });

            // Receita total
            const receitaResult = await prisma.servico.aggregate({
                where: {
                    ...whereClause,
                    status: 'FINALIZADO'
                },
                _sum: {
                    valorTotalFinal: true
                }
            });

            // Serviços agrupados por status
            const servicosPopulares = await prisma.servico.groupBy({
                by: ['status'],
                where: whereClause,
                _count: {
                    status: true
                },
                orderBy: {
                    _count: {
                        status: 'desc'
                    }
                },
                take: 5
            });

            // Clientes ativos
            const clientesAtivos = await prisma.servico.groupBy({
                by: ['clienteId'],
                where: whereClause,
                _count: {
                    clienteId: true
                }
            });

            const estatisticas = {
                total_os: totalOS,
                os_concluidas: osConcluidas,
                os_pendentes: totalOS - osConcluidas,
                receita_total: receitaResult._sum.valorTotalFinal || 0,
                produtividade: totalOS > 0 ? ((osConcluidas / totalOS) * 100).toFixed(1) : 0,
                servicos_populares: servicosPopulares.map(s => ({
                    status: s.status,
                    quantidade: s._count.status
                })),
                clientes_ativos: clientesAtivos.length,
                periodo
            };

            console.log(`📊 Estatísticas ${periodo}: ${totalOS} OS, R$ ${estatisticas.receita_total}`);
            return estatisticas;

        } catch (error) {
            console.error('❌ Erro nas estatísticas:', error);
            throw new Error(`Erro nas estatísticas: ${error.message}`);
        }
    }

    // ── Buscar veículo por placa ───────────────────────────────────────
    static async buscarVeiculoPorPlaca(oficinaId, placa) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const veiculo = await prisma.veiculo.findFirst({
                where: {
                    oficinaId,
                    placa: {
                        contains: placa,
                        mode: 'insensitive'
                    }
                },
                include: {
                    cliente: {
                        select: {
                            nomeCompleto: true,
                            telefone: true
                        }
                    },
                    servicos: {
                        select: {
                            id: true,
                            status: true,
                            dataEntrada: true,
                            valorTotalFinal: true
                        },
                        orderBy: {
                            dataEntrada: 'desc'
                        },
                        take: 5
                    }
                }
            });

            if (veiculo) {
                console.log(`🚗 Veículo encontrado: ${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`);
            } else {
                console.log(`❌ Veículo não encontrado: ${placa}`);
            }

            return veiculo;

        } catch (error) {
            console.error('❌ Erro na busca por placa:', error);
            throw new Error(`Erro na busca por placa: ${error.message}`);
        }
    }

    // ── Calcular período para consultas ────────────────────────────────
    static calcularPeriodo(periodo) {
        const hoje = new Date();

        switch (periodo) {
            case 'hoje':
                const inicioHoje = new Date(hoje);
                inicioHoje.setHours(0, 0, 0, 0);
                const fimHoje = new Date(hoje);
                fimHoje.setHours(23, 59, 59, 999);
                return { gte: inicioHoje, lte: fimHoje };

            case 'semana':
                const inicioSemana = new Date(hoje);
                inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                inicioSemana.setHours(0, 0, 0, 0);
                return { gte: inicioSemana };

            case 'mes':
            case '30_dias':
                const inicioMes = new Date(hoje);
                inicioMes.setDate(hoje.getDate() - 30);
                inicioMes.setHours(0, 0, 0, 0);
                return { gte: inicioMes };

            case 'ano':
            case 'ano_atual':
                const inicioAno = new Date(hoje.getFullYear(), 0, 1);
                return { gte: inicioAno };

            default:
                return null;
        }
    }

    // ── Obter resumo diário ────────────────────────────────────────────
    static async obterResumoDiario(oficinaId) {
        if (!oficinaId) throw new Error('oficinaId é obrigatório');

        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);

            const osHoje = await prisma.servico.count({
                where: {
                    oficinaId,
                    dataEntrada: {
                        gte: hoje,
                        lt: amanha
                    }
                }
            });

            const agendamentosHoje = await prisma.agendamento.count({
                where: {
                    oficinaId,
                    dataHora: {
                        gte: hoje,
                        lt: amanha
                    },
                    status: {
                        not: 'CANCELED'
                    }
                }
            });

            const resumo = {
                data: hoje.toISOString().split('T')[0],
                os_abertas: osHoje,
                agendamentos: agendamentosHoje,
                timestamp: new Date()
            };

            console.log(`📅 Resumo diário: ${osHoje} OS, ${agendamentosHoje} agendamentos`);
            return resumo;

        } catch (error) {
            console.error('❌ Erro no resumo diário:', error);
            throw new Error(`Erro no resumo diário: ${error.message}`);
        }
    }
}

export default ConsultasOSService;