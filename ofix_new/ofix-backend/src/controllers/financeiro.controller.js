import prisma from '../config/database.js';

function getOficinaId(req, res) {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    res.status(401).json({ error: 'Usuario nao esta associado a uma oficina.' });
    return null;
  }

  return oficinaId;
}

async function validarServicoDaOficina(servicoId, oficinaId) {
  if (!servicoId) return true;

  const servico = await prisma.servico.findFirst({
    where: { id: servicoId, oficinaId },
    select: { id: true },
  });

  return Boolean(servico);
}

export const getAllTransacoes = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const transacoes = await prisma.financeiro.findMany({
      where: { oficinaId },
      orderBy: { data: 'desc' },
    });

    res.json(transacoes);
  } catch (error) {
    console.error('Erro ao buscar transacoes financeiras:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getTransacaoById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const transacao = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
    });

    if (!transacao) {
      return res.status(404).json({ error: 'Transacao nao encontrada.' });
    }

    res.json(transacao);
  } catch (error) {
    console.error('Erro ao buscar transacao por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createTransacao = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem criar transacoes.' });
  }

  const { descricao, valor, tipo, categoria, data, servicoId } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const servicoValido = await validarServicoDaOficina(servicoId, oficinaId);
    if (!servicoValido) {
      return res.status(400).json({ error: 'Servico informado nao pertence a esta oficina.' });
    }

    const newTransacao = await prisma.financeiro.create({
      data: {
        descricao,
        valor,
        tipo,
        categoria,
        data: new Date(data),
        servicoId: servicoId || null,
        oficinaId,
      },
    });

    res.status(201).json(newTransacao);
  } catch (error) {
    console.error('Erro ao criar transacao:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updateTransacao = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem editar transacoes.' });
  }

  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data, servicoId } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingTransacao = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingTransacao) {
      return res.status(404).json({ error: 'Transacao nao encontrada.' });
    }

    const servicoValido = await validarServicoDaOficina(servicoId, oficinaId);
    if (!servicoValido) {
      return res.status(400).json({ error: 'Servico informado nao pertence a esta oficina.' });
    }

    const updateData = {};
    if (descricao !== undefined) updateData.descricao = descricao;
    if (valor !== undefined) updateData.valor = valor;
    if (tipo !== undefined) updateData.tipo = tipo;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (data !== undefined) updateData.data = new Date(data);
    if (servicoId !== undefined) updateData.servicoId = servicoId || null;

    const updatedTransacao = await prisma.financeiro.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedTransacao);
  } catch (error) {
    console.error('Erro ao atualizar transacao:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteTransacao = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem excluir transacoes.' });
  }

  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingTransacao = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingTransacao) {
      return res.status(404).json({ error: 'Transacao nao encontrada.' });
    }

    await prisma.financeiro.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar transacao:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
