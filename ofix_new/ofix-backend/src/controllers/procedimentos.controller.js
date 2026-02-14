import prisma from '../config/database.js';

function getOficinaId(req, res) {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    res.status(401).json({ error: 'Usuario nao esta associado a uma oficina.' });
    return null;
  }

  return oficinaId;
}

export const getAllProcedimentos = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const procedimentos = await prisma.procedimentoPadrao.findMany({
      where: { oficinaId },
      orderBy: { nome: 'asc' },
    });

    res.json(procedimentos);
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getProcedimentoById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const procedimento = await prisma.procedimentoPadrao.findFirst({
      where: { id, oficinaId },
    });

    if (!procedimento) {
      return res.status(404).json({ error: 'Procedimento nao encontrado.' });
    }

    res.json(procedimento);
  } catch (error) {
    console.error('Erro ao buscar procedimento por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createProcedimento = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem criar procedimentos.' });
  }

  const { nome, descricao, tempoEstimadoHoras, checklistJson, categoria } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const newProcedimento = await prisma.procedimentoPadrao.create({
      data: {
        nome,
        descricao,
        tempoEstimadoHoras,
        checklistJson,
        categoria: categoria || 'manutencao_preventiva',
        oficinaId,
      },
    });

    res.status(201).json(newProcedimento);
  } catch (error) {
    console.error('Erro ao criar procedimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updateProcedimento = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem editar procedimentos.' });
  }

  const { id } = req.params;
  const { nome, descricao, tempoEstimadoHoras, checklistJson, categoria } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingProcedimento = await prisma.procedimentoPadrao.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingProcedimento) {
      return res.status(404).json({ error: 'Procedimento nao encontrado.' });
    }

    const updatedProcedimento = await prisma.procedimentoPadrao.update({
      where: { id },
      data: {
        nome,
        descricao,
        tempoEstimadoHoras,
        checklistJson,
        categoria,
      },
    });

    res.json(updatedProcedimento);
  } catch (error) {
    console.error('Erro ao atualizar procedimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteProcedimento = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem excluir procedimentos.' });
  }

  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingProcedimento = await prisma.procedimentoPadrao.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingProcedimento) {
      return res.status(404).json({ error: 'Procedimento nao encontrado.' });
    }

    await prisma.procedimentoPadrao.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar procedimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
