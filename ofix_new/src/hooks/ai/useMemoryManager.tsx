// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import logger from '../../utils/logger';
import { getApiBaseUrl } from '../../utils/api';

interface MemoryManagerOptions {
  userId?: string;
  getAuthHeaders: () => Record<string, string>;
  showToast: (msg: string, type?: string) => void;
}

/**
 * Hook para gerenciamento de memórias do Matias (LanceDB).
 */
export function useMemoryManager({ userId, getAuthHeaders, showToast }: MemoryManagerOptions) {
  const [memoriaAtiva, setMemoriaAtiva] = useState(false);
  const [memorias, setMemorias] = useState<any[]>([]);
  const [loadingMemorias, setLoadingMemorias] = useState(false);
  const [mostrarMemorias, setMostrarMemorias] = useState(false);

  // Verificar se memória está ativa ao mount
  useEffect(() => {
    const verificarMemoria = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const API_BASE = getApiBaseUrl();
        const response = await fetch(`${API_BASE}/api/agno/memory-status`, {
          headers: authHeaders,
        });
        if (response.ok) {
          const data = await response.json();
          setMemoriaAtiva(data.enabled || false);
          if (data.enabled) logger.info('Sistema de memória ativo', { status: data.status });
        }
      } catch (error) {
        logger.warn('Não foi possível verificar sistema de memória', { error: error.message });
      }
    };
    verificarMemoria();
  }, [getAuthHeaders]);

  // Carregar memórias do usuário
  const carregarMemorias = useCallback(async () => {
    if (!userId || !memoriaAtiva) return;
    setLoadingMemorias(true);
    try {
      const authHeaders = getAuthHeaders();
      const API_BASE = getApiBaseUrl();
      const response = await fetch(`${API_BASE}/api/agno/memories/${userId}`, {
        headers: authHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setMemorias(data.memories || []);
        logger.info('Memórias carregadas', { total: data.total });
      }
    } catch (error) {
      logger.error('Erro ao carregar memórias', { error: error.message });
      showToast('Erro ao carregar memórias', 'error');
    } finally {
      setLoadingMemorias(false);
    }
  }, [userId, memoriaAtiva, getAuthHeaders, showToast]);

  // Excluir todas as memórias (LGPD)
  const excluirMemorias = useCallback(async () => {
    if (!userId) return;
    const confirmacao = window.confirm(
      '⚠️ Tem certeza que deseja excluir todas as memórias?\n\n' +
        'O assistente Matias esquecerá todas as suas conversas anteriores.\n\n' +
        'Esta ação não pode ser desfeita.'
    );
    if (!confirmacao) return;

    try {
      const authHeaders = getAuthHeaders();
      const API_BASE = getApiBaseUrl();
      const response = await fetch(`${API_BASE}/api/agno/memories/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (response.ok) {
        setMemorias([]);
        showToast('Memórias excluídas com sucesso', 'success');
        logger.info('Memórias excluídas pelo usuário', { userId });
      } else {
        throw new Error('Falha ao excluir memórias');
      }
    } catch (error) {
      logger.error('Erro ao excluir memórias', { error: error.message });
      showToast('Erro ao excluir memórias', 'error');
    }
  }, [userId, getAuthHeaders, showToast]);

  // Carregar quando painel é aberto
  useEffect(() => {
    if (mostrarMemorias && memoriaAtiva) carregarMemorias();
  }, [mostrarMemorias, memoriaAtiva, carregarMemorias]);

  return {
    memoriaAtiva,
    setMemoriaAtiva,
    memorias,
    loadingMemorias,
    mostrarMemorias,
    setMostrarMemorias,
    carregarMemorias,
    excluirMemorias,
  };
}
