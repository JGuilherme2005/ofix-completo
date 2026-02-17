/**
 * 🌐 Hook useChatAPI
 * 
 * Gerencia comunicação com API com retry logic e timeout.
 * M4-FE-02: Migrado para apiClient (axios) — token, 401, base URL e timeout centralizados.
 */

import { useState, useCallback } from 'react';
import { AI_CONFIG } from '../constants/aiPageConfig';
import logger from '../utils/logger';
import { validarMensagem } from '../utils/messageValidator';
import apiClient from '../services/api';

export const useChatAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calcula delay com exponential backoff
   */
  const calcularDelay = (tentativa) => {
    if (!AI_CONFIG.RETRY.EXPONENTIAL_BACKOFF) {
      return AI_CONFIG.RETRY.BASE_DELAY_MS;
    }
    return AI_CONFIG.RETRY.BASE_DELAY_MS * Math.pow(2, tentativa - 1);
  };

  /**
   * Envia mensagem para API com retry
   */
  const enviarMensagem = useCallback(async (mensagem, contexto = [], tentativa = 1) => {
    // Validar mensagem antes de enviar
    const validacao = validarMensagem(mensagem);
    
    if (!validacao.valid) {
      const errorMsg = validacao.errors[0];
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      logger.debug('Enviando mensagem para API', {
        mensagem: mensagem.substring(0, 50),
        tentativa,
        maxTentativas: AI_CONFIG.RETRY.MAX_ATTEMPTS
      });

      const { data } = await apiClient.post('/agno/chat-inteligente', {
        message: validacao.sanitized,
        contexto_conversa: contexto
      }, {
        timeout: AI_CONFIG.CHAT.REQUEST_TIMEOUT_MS
      });
      
      logger.info('Mensagem enviada com sucesso', {
        tentativa,
        responseType: data.tipo
      });

      return data;

    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED';
      const errorMessage = isTimeout 
        ? 'Tempo limite excedido. Tente novamente.'
        : (err.response?.data?.error || err.message);

      logger.error('Erro ao enviar mensagem', {
        error: errorMessage,
        tentativa,
        maxTentativas: AI_CONFIG.RETRY.MAX_ATTEMPTS,
        isTimeout,
        stack: err.stack
      });

      // Retry logic
      if (tentativa < AI_CONFIG.RETRY.MAX_ATTEMPTS && !isTimeout) {
        const delay = calcularDelay(tentativa);
        
        logger.info(`Tentando novamente em ${delay}ms...`, {
          tentativa: tentativa + 1,
          maxTentativas: AI_CONFIG.RETRY.MAX_ATTEMPTS
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        return enviarMensagem(mensagem, contexto, tentativa + 1);
      }

      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verifica status da conexão com retry
   */
  const verificarConexao = useCallback(async (tentativas = 1) => {
    try {
      const { status } = await apiClient.get('/agno/contexto-sistema', {
        timeout: 5000
      });

      const isConnected = status >= 200 && status < 300;
      
      logger.info('Verificação de conexão', {
        isConnected,
        status,
        tentativa: tentativas
      });

      return isConnected;

    } catch (err) {
      logger.error('Erro ao verificar conexão', {
        error: err.message,
        tentativa: tentativas
      });
      
      // Retry até 2 vezes
      if (tentativas < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return verificarConexao(tentativas + 1);
      }
      
      return false;
    }
  }, []);

  /**
   * Carrega histórico do servidor com timeout
   */
  const carregarHistoricoServidor = useCallback(async (userId) => {
    if (!userId) {
      logger.warn('userId não fornecido para carregar histórico');
      return [];
    }

    try {
      const { data } = await apiClient.get('/agno/historico-conversa', {
        timeout: 10000
      });

      const mensagens = data.mensagens || [];
      
      logger.info('Histórico carregado do servidor', {
        mensagensCount: mensagens.length,
        userId
      });

      return mensagens;

    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED';
      
      logger.error('Erro ao carregar histórico do servidor', {
        error: err.message,
        isTimeout,
        userId
      });
      
      return [];
    }
  }, []);

  /**
   * Limpa erro
   */
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    enviarMensagem,
    verificarConexao,
    carregarHistoricoServidor,
    loading,
    error,
    setError,
    limparErro
  };
};

export default useChatAPI;
