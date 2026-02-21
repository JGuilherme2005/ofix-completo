import { useState, useCallback, useEffect } from 'react';
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

const AGENDAMENTO_DRAFT_KEY = 'matias_agendamento_draft_v1';
const AGENDAMENTO_PENDING_KEY = 'matias_agendamento_pending_v1';

type SyncStatus = 'idle' | 'syncing' | 'error' | 'synced';

interface PendingPayload {
  dados: {
    clienteId?: string | number;
    veiculoId?: string | number;
    servicoId?: string | number;
    dataAgendamento: string;
    horaAgendamento: string;
    tipo: TipoAgendamento;
    observacoes: string;
  };
  createdAt: string;
}

const isNetworkError = (error: any) => {
  if (!error) return false;
  if (!error.response) return true;
  const msg = String(error.message || '').toLowerCase();
  return msg.includes('network') || msg.includes('connection') || msg.includes('timeout');
};

const readPendingPayload = (): PendingPayload | null => {
  try {
    const raw = localStorage.getItem(AGENDAMENTO_PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPayload;
    if (!parsed?.dados?.dataAgendamento || !parsed?.dados?.horaAgendamento) return null;
    return parsed;
  } catch {
    return null;
  }
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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  const buildDadosAgendamento = useCallback(() => {
    return {
      clienteId: (clienteSelecionado as any)?.id || formData.clienteId,
      veiculoId: (clienteSelecionado as any)?.veiculoId || formData.veiculoId,
      servicoId: formData.servicoId,
      dataAgendamento: formData.dataAgendamento,
      horaAgendamento: formData.horaAgendamento,
      tipo: formData.tipo,
      observacoes: formData.observacoes,
    };
  }, [formData, clienteSelecionado]);

  const salvarDraft = useCallback((nextEtapa: AgendamentoEtapa, nextFormData: AgendamentoFormData) => {
    try {
      localStorage.setItem(
        AGENDAMENTO_DRAFT_KEY,
        JSON.stringify({
          etapa: nextEtapa,
          formData: nextFormData,
          savedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore storage failures
    }
  }, []);

  const limparDraft = useCallback(() => {
    try {
      localStorage.removeItem(AGENDAMENTO_DRAFT_KEY);
    } catch {
      // ignore storage failures
    }
  }, []);

  const salvarPendencia = useCallback((dados: PendingPayload['dados']) => {
    try {
      localStorage.setItem(
        AGENDAMENTO_PENDING_KEY,
        JSON.stringify({
          dados,
          createdAt: new Date().toISOString(),
        } as PendingPayload)
      );
      setSyncStatus('syncing');
    } catch {
      setSyncStatus('error');
    }
  }, []);

  const limparPendencia = useCallback(() => {
    try {
      localStorage.removeItem(AGENDAMENTO_PENDING_KEY);
    } catch {
      // ignore storage failures
    }
  }, []);

  // Verificar disponibilidade para data/tipo selecionados
  const verificarHorarios = useCallback(async (data: string, tipo: TipoAgendamento) => {
    if (!data) return;
    setLoading(true);
    setErro('');
    try {
      const result = await verificarDisponibilidade(data, tipo);
      if (Array.isArray(result?.horarios) && result.horarios.length > 0) {
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

  // Carregar agendamentos proximos
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

  const sincronizarPendencia = useCallback(async () => {
    const pending = readPendingPayload();
    if (!pending) {
      if (syncStatus === 'syncing') setSyncStatus('idle');
      return false;
    }

    setSyncStatus('syncing');
    try {
      const result = await agendarServico(pending.dados);
      if (result?.sucesso) {
        limparPendencia();
        setSyncStatus('synced');
        setSucesso('Agendamento sincronizado automaticamente.');
        showToast('Agendamento sincronizado com sucesso.', 'success');
        await carregarAgendamentos();
        window.setTimeout(() => setSyncStatus('idle'), 1800);
        return true;
      }

      setSyncStatus('error');
      setErro(result?.mensagem || 'Nao foi possivel sincronizar o agendamento pendente.');
      return false;
    } catch {
      setSyncStatus('syncing');
      return false;
    }
  }, [carregarAgendamentos, limparPendencia, showToast, syncStatus]);

  // Confirmar agendamento
  const confirmarAgendamento = useCallback(async () => {
    if (!formData.dataAgendamento || !formData.horaAgendamento) {
      setErro('Selecione data e horario.');
      return false;
    }

    setLoading(true);
    setErro('');
    setSucesso('');

    const dados = buildDadosAgendamento();

    try {
      const result = await agendarServico(dados);

      if (result.sucesso) {
        setSyncStatus('idle');
        limparPendencia();
        setSucesso(result.mensagem || 'Agendamento criado com sucesso!');
        showToast(result.mensagem || 'Agendamento criado!', 'success');
        setFormData(INITIAL_FORM);
        setEtapa('tipo');
        setHorarios([]);
        limparDraft();
        carregarAgendamentos();
        return true;
      }

      setErro(result.mensagem || 'Erro ao agendar.');
      showToast(result.mensagem || 'Erro ao agendar.', 'error');
      return false;
    } catch (e: any) {
      if (isNetworkError(e)) {
        salvarPendencia(dados);
        setSucesso('Sem conexao. Rascunho salvo localmente. Sincronizando...');
        showToast('Sem conexao. Agendamento salvo e sincronizando automaticamente.', 'warning');
        setFormData(INITIAL_FORM);
        setEtapa('tipo');
        setHorarios([]);
        limparDraft();
        void sincronizarPendencia();
        return true;
      }

      setSyncStatus('error');
      setErro(e.message || 'Erro ao agendar.');
      showToast('Erro ao criar agendamento.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    buildDadosAgendamento,
    limparPendencia,
    showToast,
    limparDraft,
    carregarAgendamentos,
    salvarPendencia,
    sincronizarPendencia,
  ]);

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

  // Avancar para proxima etapa
  const avancarEtapa = useCallback(() => {
    if (etapa === 'tipo') {
      setEtapa('data');
    } else if (etapa === 'data') {
      if (!formData.dataAgendamento || !formData.horaAgendamento) {
        setErro('Selecione data e horario.');
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
    limparDraft();
  }, [limparDraft]);

  // Atualizar form
  const updateForm = useCallback((patch: Partial<AgendamentoFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
    setErro('');
    setSucesso('');
  }, []);

  // Persistencia de rascunho
  useEffect(() => {
    salvarDraft(etapa, formData);
  }, [etapa, formData, salvarDraft]);

  // Restaurar draft e pendencias no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AGENDAMENTO_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { etapa?: AgendamentoEtapa; formData?: AgendamentoFormData };
        if (parsed?.formData) {
          setFormData((prev) => ({ ...prev, ...parsed.formData }));
        }
        if (parsed?.etapa) {
          setEtapa(parsed.etapa);
        }
      }
    } catch {
      // ignore draft parse errors
    }

    if (readPendingPayload()) {
      setSyncStatus('syncing');
      setSucesso('Dados pendentes em sincronizacao automatica...');
      void sincronizarPendencia();
    }
  }, [sincronizarPendencia]);

  // Tenta sincronizar quando internet voltar
  useEffect(() => {
    const handleOnline = () => {
      void sincronizarPendencia();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [sincronizarPendencia]);

  // Polling simples enquanto houver pendencia
  useEffect(() => {
    if (syncStatus !== 'syncing') return;

    const timer = window.setInterval(() => {
      void sincronizarPendencia();
    }, 15000);

    return () => window.clearInterval(timer);
  }, [syncStatus, sincronizarPendencia]);

  return {
    etapa,
    formData,
    horarios,
    agendamentos,
    loading,
    loadingAgendamentos,
    erro,
    sucesso,
    syncStatus,
    verificarHorarios,
    carregarAgendamentos,
    confirmarAgendamento,
    cancelar,
    reagendar,
    avancarEtapa,
    voltarEtapa,
    resetar,
    updateForm,
    sincronizarPendencia,
  };
}

// Horarios padrao (8h-18h, intervalos de 1h)
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
