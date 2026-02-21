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

function normalizeStatus(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'CONFIRMED') return 'confirmado';
  if (value === 'CANCELED' || value === 'CANCELADO') return 'cancelado';
  if (value === 'COMPLETED') return 'realizado';
  if (value === 'PENDING') return 'pendente';
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
      veiculoId,
      servicoId,
      dataAgendamento,
      horaAgendamento,
      tipo = 'normal',
      observacoes = '',
      prioridade = 'normal',
    } = dadosAgendamento;

    const novoServico = await servicosService.createServico({
      clienteId,
      veiculoId,
      servicoId,
      status: 'agendado',
      dataAgendamento: `${dataAgendamento}T${horaAgendamento}:00`,
      observacoes: `[AGENDADO VIA MATIAS] ${observacoes}`,
      prioridade,
      origem: 'matias_ia',
    });

    const agendamento = await apiClient.post(`${MATIAS_PREFIX}/agendamentos`, {
      servicoId: novoServico.id,
      clienteId,
      veiculoId,
      dataHora: `${dataAgendamento}T${horaAgendamento}:00`,
      tipo,
      status: 'CONFIRMED',
      observacoes,
      criadoPor: 'matias_ia',
    });

    return {
      sucesso: true,
      servicoId: novoServico.id,
      agendamentoId: agendamento.data?.agendamento?.id || agendamento.data?.id,
      dataHora: `${dataAgendamento}T${horaAgendamento}:00`,
      tipo,
      mensagem: `Agendamento realizado com sucesso! OS #${novoServico.id} criada.`,
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
    return lista.map(normalizeAgendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return [];
  }
};

export const cancelarAgendamento = async (agendamentoId, motivo = '') => {
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
