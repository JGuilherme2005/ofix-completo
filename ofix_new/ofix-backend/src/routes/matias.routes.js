import express from 'express';
import prisma from '../config/database.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendSafeError } from '../lib/safe-error.js';

const router = express.Router();

// 💬 HISTÓRICO DE CONVERSAS COM MATIAS

// Salvar mensagem na conversa
router.post('/conversas/mensagem', protectRoute, async (req, res) => {
  try {
    const oficinaId = req.user?.oficinaId;
    const userId = req.user?.id || req.user?.userId;
    const { sessionId, role, content, metadata = {} } = req.body;

    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    // Buscar sessão existente ou criar nova
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findFirst({
        where: { id: sessionId, oficinaId }
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          oficinaId,
          userId: String(userId),
          titulo: `Conversa ${new Date().toLocaleDateString('pt-BR')}`,
          status: 'OPEN',
          isPublic: false,
        }
      });
    }

    // Salvar a mensagem
    const mensagem = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: role || 'user',
        content,
        metadata
      }
    });

    res.json({
      success: true,
      mensagem,
      sessionId: session.id,
      // Compat com call sites antigos
      conversaId: session.id
    });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao salvar mensagem', error);
  }
});

// Buscar histórico de conversas do usuário
router.get('/conversas/historico/:userId', protectRoute, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limite = 10 } = req.query;
    const oficinaId = req.user?.oficinaId;

    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    // Segurança: só permite ver próprio histórico (ou admin no futuro)
    const requestUserId = req.user?.id || req.user?.userId;
    if (String(userId) !== String(requestUserId)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const sessions = await prisma.chatSession.findMany({
      where: {
        oficinaId,
        userId: String(userId),
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1 // Última mensagem para preview
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: parseInt(limite)
    });

    res.json(sessions);
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao buscar histórico', error);
  }
});

// Buscar mensagens de uma sessão específica
router.get('/conversas/:sessionId/mensagens', protectRoute, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const oficinaId = req.user?.oficinaId;

    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    // Verificar que a sessão pertence à oficina do usuário
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, oficinaId }
    });
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    const mensagens = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });

    res.json(mensagens);
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao buscar mensagens', error);
  }
});

// 📅 SISTEMA DE AGENDAMENTOS

// Verificar disponibilidade
router.get('/agendamentos/disponibilidade', protectRoute, async (req, res) => {
  try {
    const { data, tipo = 'normal' } = req.query;
    const oficinaId = req.user?.oficinaId;

    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    // Buscar agendamentos já marcados para a data (scoped por oficina)
    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        oficinaId,
        dataHora: {
          gte: new Date(`${data}T00:00:00`),
          lt: new Date(`${data}T23:59:59`)
        },
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    // Definir horários disponíveis baseado no tipo
    const todosHorarios = tipo === 'urgente' 
      ? ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      : ['08:00', '10:00', '13:00', '15:00'];

    // Filtrar horários já ocupados
    const horariosOcupados = agendamentosExistentes.map(ag => {
      const hora = new Date(ag.dataHora).toTimeString().substring(0, 5);
      return hora;
    });

    const horariosDisponiveis = todosHorarios.filter(h => !horariosOcupados.includes(h));

    res.json({
      disponivel: horariosDisponiveis.length > 0,
      horarios: horariosDisponiveis,
      horariosOcupados,
      proximaDataDisponivel: horariosDisponiveis.length === 0 ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
    });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao verificar disponibilidade', error);
  }
});

// Criar agendamento
router.post('/agendamentos', protectRoute, async (req, res) => {
  try {
    const { servicoId, clienteId, veiculoId, dataHora, tipo, observacoes } = req.body;
    const oficinaId = req.user?.oficinaId;
    const userId = req.user?.id || req.user?.userId;

    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });
    if (!clienteId) return res.status(400).json({ error: 'clienteId é obrigatório' });

    const agendamento = await prisma.agendamento.create({
      data: {
        oficinaId,
        clienteId: String(clienteId),
        veiculoId: veiculoId ? String(veiculoId) : null,
        servicoId: servicoId ? String(servicoId) : null,
        dataHora: new Date(dataHora),
        tipo: tipo || 'normal',
        status: 'CONFIRMED',
        origem: 'AI_CHAT',
        observacoes,
        criadoPor: String(userId) || 'matias_ia'
      }
    });

    res.json({
      success: true,
      agendamento
    });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao criar agendamento', error);
  }
});

// Listar agendamentos por periodo
router.get('/agendamentos', protectRoute, async (req, res) => {
  try {
    const { dataInicio, dataFim, status } = req.query;
    const oficinaId = req.user?.oficinaId;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    const where = { oficinaId };
    if (dataInicio || dataFim) {
      where.dataHora = {};
      if (dataInicio) where.dataHora.gte = new Date(`${dataInicio}T00:00:00`);
      if (dataFim) where.dataHora.lte = new Date(`${dataFim}T23:59:59`);
    }
    if (status) {
      const normalized = String(status).toUpperCase();
      where.status = normalized;
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        cliente: {
          select: { id: true, nomeCompleto: true, telefone: true }
        }
      },
      orderBy: { dataHora: 'asc' }
    });

    return res.json({
      success: true,
      agendamentos
    });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao listar agendamentos', error);
  }
});

// Cancelar agendamento
router.patch('/agendamentos/:agendamentoId/cancelar', protectRoute, async (req, res) => {
  try {
    const oficinaId = req.user?.oficinaId;
    const { agendamentoId } = req.params;
    const { motivo = '', canceladoPor } = req.body;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    const existente = await prisma.agendamento.findFirst({
      where: { id: agendamentoId, oficinaId }
    });
    if (!existente) return res.status(404).json({ error: 'Agendamento não encontrado' });

    const observacoes = [existente.observacoes, motivo].filter(Boolean).join('\n');
    const agendamento = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: 'CANCELED',
        observacoes,
        criadoPor: canceladoPor || existente.criadoPor
      }
    });

    return res.json({ success: true, agendamento });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao cancelar agendamento', error);
  }
});

// Reagendar
router.patch('/agendamentos/:agendamentoId/reagendar', protectRoute, async (req, res) => {
  try {
    const oficinaId = req.user?.oficinaId;
    const { agendamentoId } = req.params;
    const { novaDataHora, reagendadoPor } = req.body;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });
    if (!novaDataHora) return res.status(400).json({ error: 'novaDataHora é obrigatória' });

    const existente = await prisma.agendamento.findFirst({
      where: { id: agendamentoId, oficinaId }
    });
    if (!existente) return res.status(404).json({ error: 'Agendamento não encontrado' });

    const agendamento = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        dataHora: new Date(novaDataHora),
        status: 'CONFIRMED',
        criadoPor: reagendadoPor || existente.criadoPor
      }
    });

    return res.json({ success: true, agendamento });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao reagendar', error);
  }
});

// Buscar proximos horarios disponiveis
router.get('/agendamentos/proximos-horarios', protectRoute, async (req, res) => {
  try {
    const oficinaId = req.user?.oficinaId;
    const { tipo = 'normal' } = req.query;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    const baseSlots = tipo === 'urgente'
      ? ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      : ['08:00', '10:00', '13:00', '15:00'];

    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 14);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        oficinaId,
        dataHora: { gte: hoje, lte: limite },
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      select: { dataHora: true }
    });

    const ocupadosPorDia = new Map();
    for (const ag of agendamentos) {
      const data = new Date(ag.dataHora);
      const key = data.toISOString().split('T')[0];
      const hora = data.toTimeString().substring(0, 5);
      const set = ocupadosPorDia.get(key) || new Set();
      set.add(hora);
      ocupadosPorDia.set(key, set);
    }

    let proximaDataLivre = null;
    let horariosDisponiveis = [];

    for (let i = 0; i <= 14; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const ocupados = ocupadosPorDia.get(key) || new Set();
      const livres = baseSlots.filter(slot => !ocupados.has(slot));
      if (livres.length > 0) {
        proximaDataLivre = key;
        horariosDisponiveis = livres;
        break;
      }
    }

    return res.json({ horariosDisponiveis, proximaDataLivre });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao buscar proximos horarios', error);
  }
});

// 📋 CONSULTAS DE OS

// Buscar estatísticas rápidas
router.get('/servicos/count', protectRoute, async (req, res) => {
  try {
    const { status } = req.query;
    const oficinaId = req.user?.oficinaId;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    const count = await prisma.servico.count({
      where: status ? { oficinaId, status } : { oficinaId }
    });

    res.json({ count });
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao contar serviços', error);
  }
});

// Buscar procedimentos de um serviço
router.get('/servicos/:servicoId/procedimentos', protectRoute, async (req, res) => {
  try {
    const { servicoId } = req.params;
    const oficinaId = req.user?.oficinaId;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    // Verificar que o serviço pertence à oficina
    const servico = await prisma.servico.findFirst({ where: { id: servicoId, oficinaId } });
    if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });

    const procedimentos = await prisma.procedimentoPadraoServico.findMany({
      where: { servicoId },
      include: {
        procedimentoPadrao: true
      }
    });

    res.json(procedimentos);
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao buscar procedimentos', error);
  }
});

// Buscar veículos por placa
router.get('/veiculos', protectRoute, async (req, res) => {
  try {
    const { placa } = req.query;
    const oficinaId = req.user?.oficinaId;
    if (!oficinaId) return res.status(400).json({ error: 'Usuário sem oficina vinculada' });

    const where = { oficinaId };
    if (placa) {
      where.placa = { contains: placa.toUpperCase() };
    }

    const veiculos = await prisma.veiculo.findMany({ where });

    res.json(veiculos);
  } catch (error) {
    sendSafeError(res, 500, 'Erro ao buscar veículos', error);
  }
});

export default router;
