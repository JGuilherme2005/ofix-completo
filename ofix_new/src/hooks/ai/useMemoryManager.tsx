// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import logger from '../../utils/logger';
import apiClient from '../../services/api';

interface MemoryManagerOptions {
  userId?: string;
  showToast: (msg: string, type?: string) => void;
}

/**
 * Hook para gerenciamento de memorias do Matias (LanceDB).
 */
export function useMemoryManager({ userId, showToast }: MemoryManagerOptions) {
  const [memoriaAtiva, setMemoriaAtiva] = useState(false);
  const [memorias, setMemorias] = useState<any[]>([]);
  const [loadingMemorias, setLoadingMemorias] = useState(false);
  const [mostrarMemorias, setMostrarMemorias] = useState(false);

  // Verificar se memoria esta ativa ao mount
  useEffect(() => {
    const verificarMemoria = async () => {
      try {
        const { data } = await apiClient.get('/agno/memory-status');
        setMemoriaAtiva(data.enabled || false);
        if (data.enabled) logger.info('Sistema de memoria ativo', { status: data.status });
      } catch (error) {
        logger.warn('Nao foi possivel verificar sistema de memoria', { error: error.message });
      }
    };
    verificarMemoria();
  }, []);

  // Carregar memorias do usuario
  const carregarMemorias = useCallback(async () => {
    if (!userId || !memoriaAtiva) return;
    setLoadingMemorias(true);
    try {
      const { data } = await apiClient.get(`/agno/memories/${userId}`);
      setMemorias(data.memories || []);
      logger.info('Memorias carregadas', { total: data.total });
    } catch (error) {
      logger.error('Erro ao carregar memorias', { error: error.message });
      showToast('Erro ao carregar memorias', 'error');
    } finally {
      setLoadingMemorias(false);
    }
  }, [userId, memoriaAtiva, showToast]);

  // Excluir todas as memorias (LGPD)
  const excluirMemorias = useCallback(async ({ skipConfirm = false }: { skipConfirm?: boolean } = {}) => {
    if (!userId) return false;

    if (!skipConfirm) {
      const confirmacao = window.confirm(
        'Tem certeza que deseja excluir todas as memorias?\n\n' +
          'O assistente Matias esquecera todas as conversas anteriores.\n\n' +
          'Esta acao nao pode ser desfeita.'
      );
      if (!confirmacao) return false;
    }

    try {
      await apiClient.delete(`/agno/memories/${userId}`);
      setMemorias([]);
      showToast('Memorias excluidas com sucesso', 'success');
      logger.info('Memorias excluidas pelo usuario', { userId });
      return true;
    } catch (error) {
      logger.error('Erro ao excluir memorias', { error: error.message });
      showToast('Erro ao excluir memorias', 'error');
      return false;
    }
  }, [userId, showToast]);

  // Carregar quando painel e aberto
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
