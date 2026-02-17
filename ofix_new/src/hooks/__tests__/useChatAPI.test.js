/**
 * Testes unitários para useChatAPI hook
 * M6-QA-02: Atualizado para apiClient (axios) após migração Bloco J.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatAPI } from '../useChatAPI';
import logger from '../../utils/logger';
import * as messageValidator from '../../utils/messageValidator';
import apiClient from '../../services/api';

// Mock logger
vi.mock('../../utils/logger', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock messageValidator
vi.mock('../../utils/messageValidator', () => ({
  validarMensagem: vi.fn()
}));

// Mock apiClient
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

describe('useChatAPI', () => {
  beforeEach(() => {
    // Mock validarMensagem para retornar válido por padrão
    messageValidator.validarMensagem.mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      sanitized: 'Mensagem teste'
    });

    vi.clearAllMocks();
  });

  describe('enviarMensagem', () => {
    it('deve enviar mensagem com sucesso', async () => {
      const mockData = {
        success: true,
        response: 'Resposta do agente',
        tipo: 'agente'
      };

      apiClient.post.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useChatAPI());

      let response;
      await act(async () => {
        response = await result.current.enviarMensagem('Olá');
      });

      expect(response).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(apiClient.post).toHaveBeenCalledWith(
        '/agno/chat-inteligente',
        expect.objectContaining({ message: 'Mensagem teste' }),
        expect.any(Object)
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Mensagem enviada com sucesso',
        expect.any(Object)
      );
    });

    it('deve validar mensagem antes de enviar', async () => {
      messageValidator.validarMensagem.mockReturnValueOnce({
        valid: false,
        errors: ['Mensagem muito longa'],
        warnings: [],
        sanitized: ''
      });

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        try {
          await result.current.enviarMensagem('Mensagem inválida');
        } catch (error) {
          expect(error.message).toBe('Mensagem muito longa');
        }
      });

      expect(result.current.error).toBe('Mensagem muito longa');
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('deve usar mensagem sanitizada', async () => {
      messageValidator.validarMensagem.mockReturnValueOnce({
        valid: true,
        errors: [],
        warnings: [],
        sanitized: 'Mensagem limpa'
      });

      apiClient.post.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        await result.current.enviarMensagem('<script>alert("xss")</script>');
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/agno/chat-inteligente',
        expect.objectContaining({ message: 'Mensagem limpa' }),
        expect.any(Object)
      );
    });

    it('deve fazer retry em caso de erro de rede', async () => {
      apiClient.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { success: true, response: 'Sucesso', tipo: 'agente' } });

      const { result } = renderHook(() => useChatAPI());

      let response;
      await act(async () => {
        response = await result.current.enviarMensagem('Teste retry');
      });

      expect(response.success).toBe(true);
      expect(apiClient.post).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Tentando novamente'),
        expect.any(Object)
      );
    });

    it('deve respeitar número máximo de tentativas', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        try {
          await result.current.enviarMensagem('Teste');
        } catch (error) {
          expect(error.message).toBe('Network error');
        }
      });

      // Deve ter tentado 3 vezes (configuração padrão)
      expect(apiClient.post).toHaveBeenCalledTimes(3);
      expect(result.current.error).toBe('Network error');
    });

    it('deve tratar timeout (ECONNABORTED)', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      timeoutError.code = 'ECONNABORTED';

      apiClient.post.mockRejectedValueOnce(timeoutError);

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        try {
          await result.current.enviarMensagem('Teste timeout');
        } catch (error) {
          expect(error.message).toContain('Tempo limite excedido');
        }
      });

      expect(result.current.error).toContain('Tempo limite excedido');
    });

    it('não deve fazer retry em caso de timeout', async () => {
      const timeoutError = new Error('timeout');
      timeoutError.code = 'ECONNABORTED';

      apiClient.post.mockRejectedValueOnce(timeoutError);

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        try {
          await result.current.enviarMensagem('Teste');
        } catch (error) {
          // esperado
        }
      });

      // Não deve fazer retry em caso de timeout
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    it('deve incluir contexto na requisição', async () => {
      apiClient.post.mockResolvedValueOnce({ data: { success: true } });

      const contexto = [
        { tipo: 'usuario', conteudo: 'Olá' },
        { tipo: 'agente', conteudo: 'Oi' }
      ];

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        await result.current.enviarMensagem('Nova mensagem', contexto);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/agno/chat-inteligente',
        expect.objectContaining({
          contexto_conversa: contexto
        }),
        expect.any(Object)
      );
    });

    it('deve tratar erro de resposta HTTP (ex: 500)', async () => {
      const serverError = new Error('Request failed');
      serverError.response = { data: { error: 'Internal Server Error' } };

      apiClient.post.mockRejectedValue(serverError);

      const { result } = renderHook(() => useChatAPI());

      await act(async () => {
        try {
          await result.current.enviarMensagem('Teste');
        } catch (error) {
          expect(error.message).toBe('Internal Server Error');
        }
      });

      expect(result.current.error).toBe('Internal Server Error');
    });
  });

  describe('verificarConexao', () => {
    it('deve retornar true quando conexão está ok', async () => {
      apiClient.get.mockResolvedValueOnce({ status: 200 });

      const { result } = renderHook(() => useChatAPI());

      let isConnected;
      await act(async () => {
        isConnected = await result.current.verificarConexao();
      });

      expect(isConnected).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith(
        '/agno/contexto-sistema',
        expect.objectContaining({ timeout: 5000 })
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Verificação de conexão',
        expect.objectContaining({ isConnected: true })
      );
    });

    it('deve retornar false quando conexão falha', async () => {
      apiClient.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useChatAPI());

      let isConnected;
      await act(async () => {
        isConnected = await result.current.verificarConexao();
      });

      expect(isConnected).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });

    it('deve fazer retry até 2 vezes', async () => {
      apiClient.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ status: 200 });

      const { result } = renderHook(() => useChatAPI());

      let isConnected;
      await act(async () => {
        isConnected = await result.current.verificarConexao();
      });

      expect(isConnected).toBe(true);
      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('carregarHistoricoServidor', () => {
    it('deve carregar histórico com sucesso', async () => {
      const mockMensagens = [
        { id: 1, tipo: 'usuario', conteudo: 'Olá' },
        { id: 2, tipo: 'agente', conteudo: 'Oi' }
      ];

      apiClient.get.mockResolvedValueOnce({ data: { mensagens: mockMensagens } });

      const { result } = renderHook(() => useChatAPI());

      let mensagens;
      await act(async () => {
        mensagens = await result.current.carregarHistoricoServidor('user123');
      });

      expect(mensagens).toEqual(mockMensagens);
      expect(apiClient.get).toHaveBeenCalledWith(
        '/agno/historico-conversa',
        expect.objectContaining({ timeout: 10000 })
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Histórico carregado do servidor',
        expect.objectContaining({ mensagensCount: 2 })
      );
    });

    it('deve retornar array vazio se não houver mensagens', async () => {
      apiClient.get.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useChatAPI());

      let mensagens;
      await act(async () => {
        mensagens = await result.current.carregarHistoricoServidor('user123');
      });

      expect(mensagens).toEqual([]);
    });

    it('deve retornar array vazio em caso de erro', async () => {
      apiClient.get.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useChatAPI());

      let mensagens;
      await act(async () => {
        mensagens = await result.current.carregarHistoricoServidor('user123');
      });

      expect(mensagens).toEqual([]);
      expect(logger.error).toHaveBeenCalled();
    });

    it('deve retornar array vazio se userId não for fornecido', async () => {
      const { result } = renderHook(() => useChatAPI());

      let mensagens;
      await act(async () => {
        mensagens = await result.current.carregarHistoricoServidor(null);
      });

      expect(mensagens).toEqual([]);
      expect(logger.warn).toHaveBeenCalledWith(
        'userId não fornecido para carregar histórico'
      );
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('limparErro', () => {
    it('deve limpar erro', async () => {
      const { result } = renderHook(() => useChatAPI());

      act(() => {
        result.current.setError('Erro de teste');
      });

      expect(result.current.error).toBe('Erro de teste');

      act(() => {
        result.current.limparErro();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('loading state', () => {
    it('deve definir loading como true durante requisição', async () => {
      let resolvePromise;
      apiClient.post.mockImplementation(() =>
        new Promise((resolve) => {
          resolvePromise = () => resolve({ data: { success: true } });
        })
      );

      const { result } = renderHook(() => useChatAPI());

      expect(result.current.loading).toBe(false);

      let promise;
      act(() => {
        promise = result.current.enviarMensagem('Teste');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await act(async () => {
        resolvePromise();
        await promise;
      });

      expect(result.current.loading).toBe(false);
    });
  });
});
