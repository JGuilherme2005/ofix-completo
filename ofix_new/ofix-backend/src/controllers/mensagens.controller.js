import prisma from '../config/database.js';

function getOficinaId(req, res) {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    res.status(401).json({ error: 'Usuario nao esta associado a uma oficina.' });
    return null;
  }

  return oficinaId;
}

export const getAllMensagens = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const mensagens = await prisma.mensagemPadrao.findMany({
      where: { oficinaId },
      orderBy: { nome: 'asc' },
    });

    res.json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getMensagemById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const mensagem = await prisma.mensagemPadrao.findFirst({
      where: { id, oficinaId },
    });

    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem nao encontrada.' });
    }

    res.json(mensagem);
  } catch (error) {
    console.error('Erro ao buscar mensagem por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createMensagem = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem criar mensagens.' });
  }

  const { nome, template, categoria } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const newMensagem = await prisma.mensagemPadrao.create({
      data: {
        nome,
        template,
        categoria,
        oficinaId,
      },
    });

    res.status(201).json(newMensagem);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updateMensagem = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem editar mensagens.' });
  }

  const { id } = req.params;
  const { nome, template, categoria } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingMensagem = await prisma.mensagemPadrao.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingMensagem) {
      return res.status(404).json({ error: 'Mensagem nao encontrada.' });
    }

    const updatedMensagem = await prisma.mensagemPadrao.update({
      where: { id },
      data: {
        nome,
        template,
        categoria,
      },
    });

    res.json(updatedMensagem);
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteMensagem = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem excluir mensagens.' });
  }

  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingMensagem = await prisma.mensagemPadrao.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingMensagem) {
      return res.status(404).json({ error: 'Mensagem nao encontrada.' });
    }

    await prisma.mensagemPadrao.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
