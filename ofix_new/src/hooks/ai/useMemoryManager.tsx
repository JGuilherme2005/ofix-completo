// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import logger from '../../utils/logger';
import apiClient from '../../services/api';

interface MemoryManagerOptions {
  userId?: string;
  showToast: (msg: string, type?: string) => void;
}

/**
 * Hook para gerenciamento de memórias do Matias (LanceDB).
 */
export function useMemoryManager({ userId, showToast }: MemoryManagerOptions) {
  const [memoriaAtiva, setMemoriaAtiva] = useState(false);
  const [memorias, setMemorias] = useState<any[]>([]);
  const [loadingMemorias, setLoadingMemorias] = useState(false);
  const [mostrarMemorias, setMostrarMemorias] = useState(false);

  // Verificar se memória está ativa ao mount
  useEffect(() => {
    const verificarMemoria = async () => {
      try {
        const { data } = await apiClient.get('/agno/memory-status');
        setMemoriaAtiva(data.enabled || false);
        if (data.enabled) logger.info('Sistema de memória ativo', { status: data.status });
      } catch (error) {
        logger.warn('Não foi possível verificar sistema de memória', { error: error.message });
      }
    };
    verificarMemoria();
  }, []);

  // Carregar memórias do usuário
  const carregarMemorias = useCallback(async () => {
    if (!userId || !memoriaAtiva) return;
    setLoadingMemorias(true);
    try {
      const { data } = await apiClient.get(`/agno/memories/${userId}`);
      setMemorias(data.memories || []);
      logger.info('Memórias carregadas', { total: data.total });
    } catch (error) {
      logger.error('Erro ao carregar memórias', { error: error.message });
      showToast('Erro ao carregar memórias', 'error');
    } finally {
      setLoadingMemorias(false);
    }
  }, [userId, memoriaAtiva, showToast]);

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
      await apiClient.delete(`/agno/memories/${userId}`);
      setMemorias([]);
      showToast('Memórias excluídas com sucesso', 'success');
      logger.info('Memórias excluídas pelo usuário', { userId });
    } catch (error) {
      logger.error('Erro ao excluir memórias', { error: error.message });
      showToast('Erro ao excluir memórias', 'error');
    }
  }, [userId, showToast]);

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
