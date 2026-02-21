/**
 * Servico de agendamentos da pagina IA.
 * Usa endpoints do router Matias no backend.
 */

import apiClient from './api';
import * as servicosService from './servicos.service';

export const TIPOS_AGENDAMENTO = {
  URGENTE: 'urgente',
  NORMAL: 'normal',
  PROGRAMADO: 'programado',
  ESPECIAL: 'especial',
};

const MATIAS_PREFIX = '/matias';
const AGENDAMENTO_LOCAL_DRAFTS_KEY = 'matias_agendamento_drafts_v1';

const buildDataHora = (dataAgendamento, horaAgendamento) => `${dataAgendamento}T${horaAgendamento}:00`;
const isDraftId = (id) => String(id || '').startsWith('draft-');

const readLocalDrafts = () => {
  try {
    const raw = localStorage.getItem(AGENDAMENTO_LOCAL_DRAFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalDrafts = (drafts) => {
  try {
    localStorage.setItem(AGENDAMENTO_LOCAL_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // ignore storage failures
  }
};

const addLocalDraft = (dadosAgendamento) => {
  const draft = {
    id: `draft-${Date.now()}`,
    servicoId: null,
    clienteId: dadosAgendamento.clienteId || null,
    veiculoId: dadosAgendamento.veiculoId || null,
    clienteNome: dadosAgendamento.clienteNome || 'Cliente nao identificado',
    veiculoInfo: dadosAgendamento.veiculoInfo || '',
    dataHora: buildDataHora(dadosAgendamento.dataAgendamento, dadosAgendamento.horaAgendamento),
    tipo: String(dadosAgendamento.tipo || 'normal').toLowerCase(),
    status: 'rascunho',
    observacoes: dadosAgendamento.observacoes || '',
    criadoPor: 'matias_ia_draft',
    createdAt: new Date().toISOString(),
  };

  const drafts = readLocalDrafts();
  writeLocalDrafts([draft, ...drafts]);
  return draft;
};

const removeLocalDraft = (agendamentoId) => {
  const draftId = String(agendamentoId);
  const drafts = readLocalDrafts();
  const nextDrafts = drafts.filter((draft) => String(draft.id) !== draftId);
  if (nextDrafts.length === drafts.length) return false;
  writeLocalDrafts(nextDrafts);
  return true;
};

const updateLocalDraftDataHora = (agendamentoId, novaData, novaHora) => {
  const draftId = String(agendamentoId);
  const drafts = readLocalDrafts();
  let changed = false;
  const updated = drafts.map((draft) => {
    if (String(draft.id) !== draftId) return draft;
    changed = true;
    return {
      ...draft,
      dataHora: buildDataHora(novaData, novaHora),
      updatedAt: new Date().toISOString(),
    };
  });

  if (changed) writeLocalDrafts(updated);
  return changed;
};

const canCreateFullAgendamento = (clienteId, veiculoId) => Boolean(clienteId && veiculoId);

function normalizeStatus(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'CONFIRMED') return 'confirmado';
  if (value === 'CANCELED' || value === 'CANCELADO') return 'cancelado';
  if (value === 'COMPLETED') return 'realizado';
  if (value === 'PENDING') return 'pendente';
  if (value === 'DRAFT' || value === 'RASCUNHO') return 'rascunho';
  return String(status || 'pendente').toLowerCase();
}

function normalizeAgendamento(item = {}) {
  return {
    ...item,
    status: normalizeStatus(item.status),
    tipo: String(item.tipo || 'normal').toLowerCase(),
    clienteNome: item.clienteNome || item?.cliente?.nomeCompleto || item?.cliente?.nome || '',
  };
}

export const verificarDisponibilidade = async (data, tipo = 'normal') => {
  try {
    const response = await apiClient.get(`${MATIAS_PREFIX}/agendamentos/disponibilidade`, {
      params: { data, tipo },
    });

    const payload = response.data || {};
    const horarios = Array.isArray(payload.horarios)
      ? payload.horarios.map((h) =>
          typeof h === 'string' ? { hora: h, disponivel: true } : { hora: h.hora || h.horario, disponivel: h.disponivel !== false }
        )
      : [];

    return {
      disponivel: Boolean(payload.disponivel),
      horarios,
      proximaDataDisponivel: payload.proximaDataDisponivel || null,
    };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return {
      disponivel: false,
      horarios: [],
      proximaDataDisponivel: null,
    };
  }
};

export const agendarServico = async (dadosAgendamento) => {
  try {
    const {
      clienteId,
      clienteNome = '',
      veiculoId,
      veiculoInfo = '',
      servicoId,
      dataAgendamento,
      horaAgendamento,
      tipo = 'normal',
      observacoes = '',
      prioridade = 'normal',
    } = dadosAgendamento;

    const dataHora = buildDataHora(dataAgendamento, horaAgendamento);

    if (!canCreateFullAgendamento(clienteId, veiculoId)) {
      const draft = addLocalDraft({
        clienteId,
        clienteNome,
        veiculoId,
        veiculoInfo,
        dataAgendamento,
        horaAgendamento,
        tipo,
        observacoes,
      });

      return {
        sucesso: true,
        rascunho: true,
        agendamentoId: draft.id,
        dataHora,
        tipo,
        mensagem: 'Agendamento salvo como rascunho. Selecione cliente e veiculo para confirmar.',
      };
    }

    let servicoIdFinal = servicoId;
    if (!servicoIdFinal) {
      try {
        const novoServico = await servicosService.createServico({
          numeroOs: `MAT-${Date.now()}`,
          clienteId,
          veiculoId,
          status: 'AGUARDANDO',
          dataEntrada: dataHora,
          descricaoProblema: observacoes || 'Agendamento criado via Matias IA.',
          observacoes: `[AGENDADO VIA MATIAS] ${observacoes}`,
          prioridade,
          origem: 'matias_ia',
        });
        servicoIdFinal = novoServico?.id;
      } catch (serviceError) {
        // Continue sem OS para nao bloquear o agendamento.
        console.warn('Falha ao criar OS para agendamento via Matias:', serviceError);
      }
    }

    const payload = {
      clienteId,
      veiculoId,
      dataHora,
      tipo,
      status: 'CONFIRMED',
      observacoes,
      criadoPor: 'matias_ia',
    };
    if (servicoIdFinal) payload.servicoId = servicoIdFinal;

    const agendamento = await apiClient.post(`${MATIAS_PREFIX}/agendamentos`, payload);

    return {
      sucesso: true,
      servicoId: servicoIdFinal,
      agendamentoId: agendamento.data?.agendamento?.id || agendamento.data?.id,
      dataHora,
      tipo,
      mensagem: servicoIdFinal
        ? `Agendamento realizado com sucesso! OS #${servicoIdFinal} criada.`
        : 'Agendamento realizado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao agendar servico:', error);
    return {
      sucesso: false,
      erro: error?.message,
      mensagem: 'Nao foi possivel realizar o agendamento. Tente novamente.',
    };
  }
};

export const buscarAgendamentosProximos = async (dias = 7) => {
  const localDrafts = readLocalDrafts().map((draft) => normalizeAgendamento(draft));

  try {
    const dataInicio = new Date();
    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + dias);

    const response = await apiClient.get(`${MATIAS_PREFIX}/agendamentos`, {
      params: {
        dataInicio: dataInicio.toISOString().split('T')[0],
        dataFim: dataFim.toISOString().split('T')[0],
        status: 'CONFIRMED',
      },
    });

    const payload = response.data;
    const lista = Array.isArray(payload) ? payload : payload?.agendamentos || [];
    const remotos = lista.map(normalizeAgendamento);
    return [...localDrafts, ...remotos].sort(
      (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return localDrafts;
  }
};

export const cancelarAgendamento = async (agendamentoId, motivo = '') => {
  if (isDraftId(agendamentoId)) {
    const removed = removeLocalDraft(agendamentoId);
    return {
      sucesso: removed,
      mensagem: removed ? 'Rascunho removido com sucesso.' : 'Rascunho nao encontrado.',
    };
  }

  try {
    await apiClient.patch(`${MATIAS_PREFIX}/agendamentos/${agendamentoId}/cancelar`, {
      motivo: `[CANCELADO VIA MATIAS] ${motivo}`,
      canceladoPor: 'matias_ia',
    });

    return {
      sucesso: true,
      mensagem: 'Agendamento cancelado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return {
      sucesso: false,
      erro: error?.message,
      mensagem: 'Nao foi possivel cancelar o agendamento.',
    };
  }
};

export const reagendarServico = async (agendamentoId, novaData, novaHora) => {
  if (isDraftId(agendamentoId)) {
    const updated = updateLocalDraftDataHora(agendamentoId, novaData, novaHora);
    return {
      sucesso: updated,
      mensagem: updated ? 'Rascunho reagendado com sucesso!' : 'Rascunho nao encontrado.',
    };
  }

  try {
    await apiClient.patch(`${MATIAS_PREFIX}/agendamentos/${agendamentoId}/reagendar`, {
      novaDataHora: `${novaData}T${novaHora}:00`,
      reagendadoPor: 'matias_ia',
    });

    return {
      sucesso: true,
      mensagem: 'Reagendamento realizado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao reagendar:', error);
    return {
      sucesso: false,
      erro: error?.message,
      mensagem: 'Nao foi possivel reagendar o servico.',
    };
  }
};

export const buscarHorariosHoje = async () => {
  const hoje = new Date().toISOString().split('T')[0];
  return verificarDisponibilidade(hoje, 'urgente');
};

export const buscarProximosHorarios = async (tipo = 'normal') => {
  try {
    const response = await apiClient.get(`${MATIAS_PREFIX}/agendamentos/proximos-horarios`, {
      params: { tipo },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar proximos horarios:', error);
    return {
      horariosDisponiveis: [],
      proximaDataLivre: null,
    };
  }
};
