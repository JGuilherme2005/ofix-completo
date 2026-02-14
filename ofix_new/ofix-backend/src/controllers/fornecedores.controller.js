import prisma from '../config/database.js';

function getOficinaId(req, res) {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    res.status(401).json({ error: 'Usuario nao esta associado a uma oficina.' });
    return null;
  }

  return oficinaId;
}

export const getAllFornecedores = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const fornecedores = await prisma.fornecedor.findMany({
      where: { oficinaId },
      orderBy: { nome: 'asc' },
    });

    res.json(fornecedores);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getFornecedorById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const fornecedor = await prisma.fornecedor.findFirst({
      where: { id, oficinaId },
    });

    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor nao encontrado.' });
    }

    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createFornecedor = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem criar fornecedores.' });
  }

  const { nome, contato, email } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  if (!nome) {
    return res.status(400).json({ error: 'O campo nome e obrigatorio.' });
  }

  try {
    const newFornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        telefone: contato,
        email,
        oficinaId,
      },
    });

    res.status(201).json(newFornecedor);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updateFornecedor = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem editar fornecedores.' });
  }

  const { id } = req.params;
  const { nome, cnpjCpf, telefone, email, endereco } = req.body;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingFornecedor = await prisma.fornecedor.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingFornecedor) {
      return res.status(404).json({ error: 'Fornecedor nao encontrado.' });
    }

    const updatedFornecedor = await prisma.fornecedor.update({
      where: { id },
      data: {
        nome,
        cnpjCpf,
        telefone,
        email,
        endereco,
      },
    });

    res.json(updatedFornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteFornecedor = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem excluir fornecedores.' });
  }

  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingFornecedor = await prisma.fornecedor.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingFornecedor) {
      return res.status(404).json({ error: 'Fornecedor nao encontrado.' });
    }

    await prisma.fornecedor.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
