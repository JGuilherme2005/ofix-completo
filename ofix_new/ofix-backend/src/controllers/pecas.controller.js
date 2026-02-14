import prisma from '../config/database.js';

function getOficinaId(req, res) {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    res.status(401).json({ error: 'Usuario nao esta associado a uma oficina.' });
    return null;
  }

  return oficinaId;
}

function formatPecaForFrontend(peca) {
  return {
    ...peca,
    sku: peca.codigoFabricante,
    quantidade: peca.estoqueAtual,
  };
}

function parseDecimal(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseInteger(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function validarFornecedorDaOficina(fornecedorId, oficinaId) {
  if (!fornecedorId) {
    return null;
  }

  const fornecedor = await prisma.fornecedor.findFirst({
    where: { id: fornecedorId, oficinaId },
    select: { id: true },
  });

  return fornecedor;
}

export const getAllPecas = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const pecas = await prisma.peca.findMany({
      where: { oficinaId },
      include: { fornecedor: true },
      orderBy: { nome: 'asc' },
    });

    res.json(pecas.map(formatPecaForFrontend));
  } catch (error) {
    console.error('Erro ao buscar pecas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getPecaById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const peca = await prisma.peca.findFirst({
      where: { id, oficinaId },
      include: { fornecedor: true },
    });

    if (!peca) {
      return res.status(404).json({ error: 'Peca nao encontrada.' });
    }

    res.json(formatPecaForFrontend(peca));
  } catch (error) {
    console.error('Erro ao buscar peca por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createPeca = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem criar pecas.' });
  }

  const {
    nome,
    sku,
    fabricante,
    fornecedorId,
    precoCusto,
    precoVenda,
    quantidade,
    estoqueMinimo,
  } = req.body;

  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  if (!nome || !sku) {
    return res.status(400).json({ error: 'Nome e SKU sao obrigatorios.' });
  }

  try {
    const fornecedor = await validarFornecedorDaOficina(fornecedorId, oficinaId);
    if (fornecedorId && !fornecedor) {
      return res.status(400).json({ error: 'Fornecedor invalido para esta oficina.' });
    }

    const newPeca = await prisma.peca.create({
      data: {
        nome,
        codigoFabricante: sku,
        fabricante,
        precoCusto: parseDecimal(precoCusto) ?? 0,
        precoVenda: parseDecimal(precoVenda) ?? 0,
        estoqueAtual: parseInteger(quantidade) ?? 0,
        estoqueMinimo: parseInteger(estoqueMinimo) ?? 0,
        oficinaId,
        fornecedorId: fornecedor?.id ?? null,
      },
      include: { fornecedor: true },
    });

    res.status(201).json(formatPecaForFrontend(newPeca));
  } catch (error) {
    console.error('Erro ao criar peca:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updatePeca = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem editar pecas.' });
  }

  const { id } = req.params;
  const {
    nome,
    sku,
    fabricante,
    fornecedorId,
    precoCusto,
    precoVenda,
    quantidade,
    estoqueMinimo,
  } = req.body;

  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingPeca = await prisma.peca.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingPeca) {
      return res.status(404).json({ error: 'Peca nao encontrada.' });
    }

    const updateData = {};

    if (nome !== undefined) updateData.nome = nome;
    if (sku !== undefined) updateData.codigoFabricante = sku;
    if (fabricante !== undefined) updateData.fabricante = fabricante;

    const parsedPrecoCusto = parseDecimal(precoCusto);
    const parsedPrecoVenda = parseDecimal(precoVenda);
    const parsedQuantidade = parseInteger(quantidade);
    const parsedEstoqueMinimo = parseInteger(estoqueMinimo);

    if (parsedPrecoCusto !== undefined) updateData.precoCusto = parsedPrecoCusto;
    if (parsedPrecoVenda !== undefined) updateData.precoVenda = parsedPrecoVenda;
    if (parsedQuantidade !== undefined) updateData.estoqueAtual = parsedQuantidade;
    if (parsedEstoqueMinimo !== undefined) updateData.estoqueMinimo = parsedEstoqueMinimo;

    if (fornecedorId !== undefined) {
      if (fornecedorId === null || fornecedorId === '') {
        updateData.fornecedorId = null;
      } else {
        const fornecedor = await validarFornecedorDaOficina(fornecedorId, oficinaId);
        if (!fornecedor) {
          return res.status(400).json({ error: 'Fornecedor invalido para esta oficina.' });
        }
        updateData.fornecedorId = fornecedor.id;
      }
    }

    const updatedPeca = await prisma.peca.update({
      where: { id },
      data: updateData,
      include: { fornecedor: true },
    });

    res.json(formatPecaForFrontend(updatedPeca));
  } catch (error) {
    console.error('Erro ao atualizar peca:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deletePeca = async (req, res) => {
  if (req.user?.isGuest) {
    return res.status(403).json({ error: 'Acesso negado. Convidados nao podem excluir pecas.' });
  }

  const { id } = req.params;
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const existingPeca = await prisma.peca.findFirst({
      where: { id, oficinaId },
      select: { id: true },
    });

    if (!existingPeca) {
      return res.status(404).json({ error: 'Peca nao encontrada.' });
    }

    await prisma.peca.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar peca:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getEstoqueBaixo = async (req, res) => {
  const oficinaId = getOficinaId(req, res);
  if (!oficinaId) return;

  try {
    const pecas = await prisma.peca.findMany({
      where: { oficinaId },
      select: { estoqueAtual: true, estoqueMinimo: true },
    });

    const estoqueBaixo = pecas.filter((peca) => {
      const quantidadeAtual = peca.estoqueAtual || 0;
      const minimo = peca.estoqueMinimo || 0;
      return quantidadeAtual <= minimo;
    }).length;

    res.json({ count: estoqueBaixo });
  } catch (error) {
    console.error('Erro ao buscar estoque baixo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
