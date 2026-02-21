// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import logger from '../../utils/logger';
import apiClient from '../../services/api';

interface ConnectionOptions {
  showToast: (msg: string, type?: string) => void;
  /** Chamado quando o endpoint de status do Agno retorna o estado da memória */
  onMemoryStatus?: (enabled: boolean) => void;
}

/**
 * Hook para gerenciar conexão com o Agno (status, polling, warm).
 */
export function useConnectionStatus({ showToast, onMemoryStatus }: ConnectionOptions) {
  const [statusConexao, setStatusConexao] = useState('desconectado');
  const podeInteragir = statusConexao === 'conectado' || statusConexao === 'local';

  const verificarConexao = useCallback(async ({ warm = false, silent = false } = {}) => {
    try {
      if (!silent) setStatusConexao('conectando');

      if (warm) {
        try {
          await apiClient.post('/agno/warm', null, { timeout: 180000 });
        } catch (e) {
          logger.warn('Falha ao aquecer Agno', { error: e.message });
        }
      }

      const { data } = await apiClient.get('/agno/status', { timeout: 10000 });
      const agnoOnline = Boolean(data?.agno?.online);
      setStatusConexao(agnoOnline ? 'conectado' : 'local');

      if (agnoOnline) {
        try {
          const { data: memoryData } = await apiClient.get('/agno/memory-status', { timeout: 8000 });
          onMemoryStatus?.(Boolean(memoryData?.enabled));
        } catch (e) {
          logger.warn('Falha ao verificar memoria', { error: e.message });
        }
      }
      return agnoOnline;
    } catch (error) {
      logger.error('Erro ao verificar conexão', { error: error.message, context: 'verificarConexao' });
      if (!silent) {
        setStatusConexao('erro');
        showToast('Erro ao conectar com o agente', 'error');
      } else {
        setStatusConexao('local');
      }
      return false;
    }
  }, [showToast, onMemoryStatus]);

  const atualizarStatusPorMetadata = useCallback((metadata: any = {}) => {
    const processedBy = metadata?.processed_by;
    const model = String(metadata?.model || '').toLowerCase();
    const isFallback =
      processedBy === 'BACKEND_LOCAL_FALLBACK' ||
      model.includes('fallback') ||
      Boolean(metadata?.error) ||
      Boolean(metadata?.is_timeout) ||
      Boolean(metadata?.is_rate_limit);

    if (isFallback) { setStatusConexao('local'); return; }
    if (processedBy === 'AGNO_AI') setStatusConexao('conectado');
  }, []);

  const getStatusIcon = useCallback(() => {
    switch (statusConexao) {
      case 'conectado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'local': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'conectando': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'erro': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  }, [statusConexao]);

  const getStatusText = useCallback(() => {
    switch (statusConexao) {
      case 'conectado': return 'Matias Online';
      case 'local': return 'Modo Local';
      case 'conectando': return 'Conectando...';
      case 'erro': return 'Erro de Conexão';
      default: return 'Desconectado';
    }
  }, [statusConexao]);

  const formatarFonteResposta = useCallback((metadata: any = {}) => {
    const processedBy = metadata?.processed_by;
    const model = String(metadata?.model || '').toLowerCase();
    const isFallback =
      processedBy === 'BACKEND_LOCAL_FALLBACK' ||
      model.includes('fallback') ||
      Boolean(metadata?.error) ||
      Boolean(metadata?.is_timeout) ||
      Boolean(metadata?.is_rate_limit);
    if (isFallback) return 'Fallback local';
    if (processedBy === 'AGNO_AI') return metadata?.model ? `Matias (Agno AI: ${metadata.model})` : 'Matias (Agno AI)';
    if (processedBy === 'BACKEND_LOCAL') return 'Backend local';
    return processedBy || 'Desconhecido';
  }, []);

  // Inicializar conexão + retry
  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      const online = await verificarConexao();
      if (!online && active) {
        // Em modo local, retry simples sem warm evita erros 400 desnecessarios no console.
        retryTimer = setTimeout(() => { if (active) verificarConexao({ silent: true }); }, 1500);
      }
    })();

    return () => { active = false; if (retryTimer) clearTimeout(retryTimer); };
  }, []);

  // Polling silencioso quando em modo local
  useEffect(() => {
    if (statusConexao !== 'local') return;
    let active = true;
    let polls = 0;
    const maxPolls = 12;
    const intervalId = window.setInterval(async () => {
      polls += 1;
      const online = await verificarConexao({ silent: true });
      if (!active || online || polls >= maxPolls) window.clearInterval(intervalId);
    }, 15000);
    return () => { active = false; window.clearInterval(intervalId); };
  }, [statusConexao]);

  return {
    statusConexao,
    podeInteragir,
    verificarConexao,
    atualizarStatusPorMetadata,
    getStatusIcon,
    getStatusText,
    formatarFonteResposta,
  };
}
