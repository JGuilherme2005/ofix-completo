import { useState, useCallback } from 'react';
import type { TipoAgendamento, AgendamentoEtapa, AgendamentoFormData, Agendamento, HorarioDisponivel } from '../../types/ai.types';
import {
  verificarDisponibilidade,
  agendarServico,
  buscarAgendamentosProximos,
  cancelarAgendamento,
  reagendarServico,
} from '../../services/agendamentos.service';

interface UseAgendamentoOptions {
  showToast: (msg: string, type?: string) => void;
  clienteSelecionado?: Record<string, unknown> | null;
}

const INITIAL_FORM: AgendamentoFormData = {
  tipo: 'normal',
  dataAgendamento: '',
  horaAgendamento: '',
  observacoes: '',
};

export function useAgendamento({ showToast, clienteSelecionado }: UseAgendamentoOptions) {
  const [etapa, setEtapa] = useState<AgendamentoEtapa>('tipo');
  const [formData, setFormData] = useState<AgendamentoFormData>(INITIAL_FORM);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Verificar disponibilidade para data/tipo selecionados
  const verificarHorarios = useCallback(async (data: string, tipo: TipoAgendamento) => {
    if (!data) return;
    setLoading(true);
    setErro('');
    try {
      const result = await verificarDisponibilidade(data, tipo);
      if (result && result.horarios) {
        setHorarios(result.horarios.map((h: any) => ({
          hora: typeof h === 'string' ? h : h.hora || h.horario,
          disponivel: typeof h === 'string' ? true : h.disponivel !== false,
        })));
      } else {
        setHorarios(gerarHorariosPadrao());
      }
    } catch {
      setHorarios(gerarHorariosPadrao());
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar agendamentos próximos
  const carregarAgendamentos = useCallback(async () => {
    setLoadingAgendamentos(true);
    try {
      const result = await buscarAgendamentosProximos(7);
      if (Array.isArray(result)) {
        setAgendamentos(result as Agendamento[]);
      } else if (result?.agendamentos) {
        setAgendamentos(result.agendamentos as Agendamento[]);
      } else {
        setAgendamentos([]);
      }
    } catch {
      setAgendamentos([]);
    } finally {
      setLoadingAgendamentos(false);
    }
  }, []);

  // Confirmar agendamento
  const confirmarAgendamento = useCallback(async () => {
    if (!formData.dataAgendamento || !formData.horaAgendamento) {
      setErro('Selecione data e horário.');
      return false;
    }

    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const dados = {
        clienteId: (clienteSelecionado as any)?.id || formData.clienteId,
        veiculoId: (clienteSelecionado as any)?.veiculoId || formData.veiculoId,
        servicoId: formData.servicoId,
        dataAgendamento: formData.dataAgendamento,
        horaAgendamento: formData.horaAgendamento,
        tipo: formData.tipo,
        observacoes: formData.observacoes,
      };

      const result = await agendarServico(dados);

      if (result.sucesso) {
        setSucesso(result.mensagem || 'Agendamento criado com sucesso!');
        showToast(result.mensagem || 'Agendamento criado!', 'success');
        setFormData(INITIAL_FORM);
        setEtapa('tipo');
        setHorarios([]);
        carregarAgendamentos();
        return true;
      } else {
        setErro(result.mensagem || 'Erro ao agendar.');
        showToast(result.mensagem || 'Erro ao agendar.', 'error');
        return false;
      }
    } catch (e: any) {
      setErro(e.message || 'Erro ao agendar.');
      showToast('Erro ao criar agendamento.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, clienteSelecionado, showToast, carregarAgendamentos]);

  // Cancelar um agendamento existente
  const cancelar = useCallback(async (id: string | number, motivo: string) => {
    setLoading(true);
    try {
      const result = await cancelarAgendamento(id, motivo);
      if (result.sucesso) {
        showToast('Agendamento cancelado!', 'success');
        carregarAgendamentos();
      } else {
        showToast(result.mensagem || 'Erro ao cancelar.', 'error');
      }
    } catch {
      showToast('Erro ao cancelar agendamento.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, carregarAgendamentos]);

  // Reagendar
  const reagendar = useCallback(async (id: string | number, novaData: string, novaHora: string) => {
    setLoading(true);
    try {
      const result = await reagendarServico(id, novaData, novaHora);
      if (result.sucesso) {
        showToast('Reagendamento realizado!', 'success');
        carregarAgendamentos();
      } else {
        showToast(result.mensagem || 'Erro ao reagendar.', 'error');
      }
    } catch {
      showToast('Erro ao reagendar.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, carregarAgendamentos]);

  // Avançar para próxima etapa
  const avancarEtapa = useCallback(() => {
    if (etapa === 'tipo') {
      setEtapa('data');
    } else if (etapa === 'data') {
      if (!formData.dataAgendamento || !formData.horaAgendamento) {
        setErro('Selecione data e horário.');
        return;
      }
      setErro('');
      setEtapa('confirmacao');
    }
  }, [etapa, formData]);

  // Voltar etapa
  const voltarEtapa = useCallback(() => {
    setErro('');
    setSucesso('');
    if (etapa === 'data') setEtapa('tipo');
    else if (etapa === 'confirmacao') setEtapa('data');
  }, [etapa]);

  // Reset completo
  const resetar = useCallback(() => {
    setFormData(INITIAL_FORM);
    setEtapa('tipo');
    setHorarios([]);
    setErro('');
    setSucesso('');
  }, []);

  // Atualizar form
  const updateForm = useCallback((patch: Partial<AgendamentoFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
    setErro('');
    setSucesso('');
  }, []);

  return {
    etapa,
    formData,
    horarios,
    agendamentos,
    loading,
    loadingAgendamentos,
    erro,
    sucesso,
    verificarHorarios,
    carregarAgendamentos,
    confirmarAgendamento,
    cancelar,
    reagendar,
    avancarEtapa,
    voltarEtapa,
    resetar,
    updateForm,
  };
}

// Horários padrão (8h-18h, intervalos de 1h)
function gerarHorariosPadrao(): HorarioDisponivel[] {
  const horarios: HorarioDisponivel[] = [];
  for (let h = 8; h <= 17; h++) {
    horarios.push({ hora: `${String(h).padStart(2, '0')}:00`, disponivel: true });
    if (h < 17) {
      horarios.push({ hora: `${String(h).padStart(2, '0')}:30`, disponivel: true });
    }
  }
  return horarios;
}

export default useAgendamento;
