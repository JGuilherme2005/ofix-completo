// @ts-nocheck
/**
 * ChatTab - tab de chat extraida do AIPage.
 * Mantem a logica de envio de mensagens, NLP, selecao, cadastro e contexto.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import ClienteModal from '../clientes/ClienteModal';
import toast from 'react-hot-toast';

import logger from '../../utils/logger';
import { validarMensagem } from '../../utils/messageValidator';
import { AI_CONFIG } from '../../constants/aiPageConfig';
import { enrichMessage } from '../../utils/nlp/queryParser';
import apiClient from '../../services/api';

import ChatMessageList from '../chat/ChatMessageList';
import QuickSuggestions from '../chat/QuickSuggestions';
import VoiceStatusBanner from '../chat/VoiceStatusBanner';
import ChatInputBar from '../chat/ChatInputBar';
import ChatHeaderBar from '../chat/ChatHeaderBar';
import VoiceSettingsCard from '../chat/VoiceSettingsCard';
import MemoryCard from '../chat/MemoryCard';
import ActionsCard from '../chat/ActionsCard';
import { useSidePanel } from '../../hooks/ai';
import type { AITabId } from '../../types/ai.types';

interface ChatTabProps {
  user: any;
  showToast: (msg: string, type?: string) => void;
  voice: any;
  memory: any;
  connection: any;
  clienteSelecionado: any;
  setClienteSelecionado: (c: any) => void;
  onNavigateToTab?: (tab: AITabId, payload?: Record<string, unknown>) => void;
}

const enrichClienteSelecionado = (cliente: any) => {
  if (!cliente || typeof cliente !== 'object') return null;
  const veiculos = Array.isArray(cliente.veiculos) ? cliente.veiculos : [];
  const primeiroVeiculo = veiculos.find((item: any) => item && (item.id || item.modelo || item.placa));
  const veiculoId = cliente.veiculoId || primeiroVeiculo?.id;
  const veiculoInfo =
    cliente.veiculoInfo ||
    (primeiroVeiculo
      ? [primeiroVeiculo.marca, primeiroVeiculo.modelo].filter(Boolean).join(' ') || primeiroVeiculo.placa
      : undefined);

  return {
    ...cliente,
    ...(veiculoId ? { veiculoId } : {}),
    ...(veiculoInfo ? { veiculoInfo } : {}),
  };
};

const ChatTab = ({
  user,
  showToast,
  voice,
  memory,
  connection,
  clienteSelecionado,
  setClienteSelecionado,
  onNavigateToTab,
}: ChatTabProps) => {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [contextoAtivo, setContextoAtivo] = useState<any>(null);
  const [inputWarning, setInputWarning] = useState('');
  const [inputHint, setInputHint] = useState('');

  // Modal de cadastro de cliente
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [clientePrePreenchido, setClientePrePreenchido] = useState<any>(null);

  // Refs
  const chatContainerRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const pendingClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousConversationsRef = useRef<any[] | null>(null);
  const { painelFixoDesktop, setPainelFixoDesktop, painelDrawerOpen, setPainelDrawerOpen } = useSidePanel();

  useEffect(() => {
    voice.setOnTranscript?.((text: string, append: boolean) => {
      if (append) {
        setMensagem(prev => prev + (prev ? ' ' : '') + text);
      } else {
        setMensagem(text);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.setOnTranscript]);

  useEffect(() => {
    if (conversas.length === 0 && user) {
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Ola ${user?.nome || 'usuario'}!\n\n**Bem-vindo ao Assistente IA do Pista!**\n\nSou especializado em:\n\n- Diagnosticos automotivos\n- Gestao de pecas e estoque\n- Suporte comercial\n- Analise de dados\n- Agendamento de servicos\n\n${memory.memoriaAtiva ? '**Memoria ativa** - Vou lembrar das nossas conversas!' : ''}\n\nComo posso ajudar hoje?`,
        timestamp: new Date().toISOString(),
      };
      setConversas([msg]);
    }
  }, [user, conversas.length, memory.memoriaAtiva]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversas]);

  useEffect(() => {
    return () => {
      if (pendingClearTimerRef.current) {
        clearTimeout(pendingClearTimerRef.current);
      }
    };
  }, []);

  // FUNÃ‡Ã•ES DE LOCALSTORAGE
  const getStorageKey = useCallback(() => `matias_conversas_${user?.id || 'anonymous'}`, [user]);

  const salvarConversasLocal = useCallback((novasConversas: any[]) => {
    try {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          conversas: novasConversas,
          timestamp: new Date().toISOString(),
          userId: user?.id || 'anonymous',
        })
      );
    } catch (error) {
      logger.error('Erro ao salvar conversas', { error: error.message, context: 'salvarConversasLocal' });
    }
  }, [user, getStorageKey]);

  const restaurarHistorico = useCallback(() => {
    if (!previousConversationsRef.current) return;
    const previous = previousConversationsRef.current;
    setConversas(previous);
    salvarConversasLocal(previous);
    previousConversationsRef.current = null;
    showToast('Limpeza de conversa desfeita.', 'success');
  }, [salvarConversasLocal, showToast]);

  const confirmarLimpezaHistorico = useCallback(() => {
    try {
      localStorage.removeItem(getStorageKey());
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Ola ${user?.nome || 'usuario'}!\n\n**Nova conversa iniciada!**\n\nComo posso ajudar hoje?`,
        timestamp: new Date().toISOString(),
      };
      setConversas([msg]);
      salvarConversasLocal([msg]);
      showToast('Conversa limpa com sucesso.', 'success');
    } catch (error) {
      logger.error('Erro ao limpar historico', { error: error.message });
      showToast('Erro ao limpar historico', 'error');
    } finally {
      pendingClearTimerRef.current = null;
      previousConversationsRef.current = null;
    }
  }, [getStorageKey, salvarConversasLocal, showToast, user]);

  const limparHistorico = useCallback(() => {
    if (pendingClearTimerRef.current) {
      clearTimeout(pendingClearTimerRef.current);
      pendingClearTimerRef.current = null;
    }

    previousConversationsRef.current = [...conversas];
    pendingClearTimerRef.current = setTimeout(() => {
      confirmarLimpezaHistorico();
    }, 5000);

    toast.custom(
      (t) => (
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-cyan-200/80 bg-white px-3 py-2 shadow-lg dark:border-cyan-900/45 dark:bg-slate-900">
          <span className="text-xs text-slate-700 dark:text-slate-200">Conversa sera limpa em 5s.</span>
          <button
            type="button"
            onClick={() => {
              if (pendingClearTimerRef.current) {
                clearTimeout(pendingClearTimerRef.current);
                pendingClearTimerRef.current = null;
              }
              restaurarHistorico();
              toast.dismiss(t.id);
            }}
            className="rounded-md border border-cyan-300/80 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 dark:border-cyan-800/60 dark:bg-cyan-950/35 dark:text-cyan-200"
          >
            Desfazer
          </button>
        </div>
      ),
      { duration: 5000 }
    );
  }, [conversas, confirmarLimpezaHistorico, restaurarHistorico]);

  // VALIDAÃ‡ÃƒO EM TEMPO REAL
  const validarInputBusca = (valor: string) => {
    if (!valor || contextoAtivo !== 'buscar_cliente') {
      setInputWarning('');
      setInputHint('');
      return true;
    }
    if (valor.length < 3) {
      setInputWarning('Digite pelo menos 3 caracteres');
      setInputHint('');
      return false;
    }
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length === 11 && !valor.includes('.')) {
      const cpfFormatado = apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setMensagem(cpfFormatado);
      setInputHint('OK: CPF detectado e formatado');
      setInputWarning('');
      return true;
    }
    if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
      setInputHint('OK: telefone detectado');
      setInputWarning('');
      return true;
    }
    if (valor.length >= 3) {
      setInputHint('OK: pronto para buscar');
      setInputWarning('');
      return true;
    }
    return true;
  };

  // GERAR AÃ‡Ã•ES INLINE
  const gerarAcoesInline = (tipo: string, metadata: any) => {
    const actions: any[] = [];
    if (tipo === 'consulta_cliente' && metadata?.cliente_id) {
      actions.push(
        { type: 'agendar', label: 'Agendar servico', data: { cliente: metadata.cliente_nome } },
        { type: 'ver_detalhes', label: 'Ver detalhes', data: { cliente_id: metadata.cliente_id } }
      );
      if (metadata.telefone) {
        actions.push({ type: 'ligar', label: 'Ligar', data: { telefone: metadata.telefone } });
      }
    }
    if (metadata?.os_id) {
      actions.push(
        { type: 'ver_os', label: 'Ver OS', data: { os_id: metadata.os_id } },
        { type: 'editar', label: 'Editar', data: { os_id: metadata.os_id } }
      );
    }
    if (tipo === 'confirmacao' && metadata?.agendamento_id) {
      actions.push(
        { type: 'ver_detalhes', label: 'Ver agendamento', data: { agendamento_id: metadata.agendamento_id } },
        { type: 'editar', label: 'Reagendar', data: { agendamento_id: metadata.agendamento_id } }
      );
    }
    return actions.length > 0 ? actions : null;
  };

  const abrirAgendamentoComContexto = useCallback((observacoes: string, clienteNomeHint?: string) => {
    if (!onNavigateToTab) return;

    onNavigateToTab('agendamento', {
      clienteId: clienteSelecionado?.id,
      clienteNome: clienteNomeHint || clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome,
      veiculoId: clienteSelecionado?.veiculoId,
      veiculoInfo: clienteSelecionado?.veiculoInfo || clienteSelecionado?.veiculo,
      observacoes,
    });
  }, [onNavigateToTab, clienteSelecionado]);

  const oferecerHandoffAgendamento = useCallback((observacoes: string, clienteNomeHint?: string) => {
    toast.custom(
      (t) => (
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-cyan-200/80 bg-white px-3 py-2 shadow-lg dark:border-cyan-900/45 dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-200">
            Handoff pronto para agendamento.
          </div>
          <button
            type="button"
            onClick={() => {
              abrirAgendamentoComContexto(observacoes, clienteNomeHint);
              toast.dismiss(t.id);
            }}
            className="rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:from-cyan-500 hover:to-blue-500"
          >
            Abrir Agendamento
          </button>
        </div>
      ),
      { duration: 7000 }
    );
  }, [abrirAgendamentoComContexto]);

  const tentarFalarResposta = useCallback((responseContent: string) => {
    if (!voice.vozHabilitada || !responseContent || !('speechSynthesis' in window)) return;
    try {
      const textoLimpo = responseContent
        .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '').replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1').replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .replace(/[\u2022\u2713\u274C]/g, '')
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
        .trim();
      if (textoLimpo.length > 0 && textoLimpo.length < AI_CONFIG.VOICE.MAX_TEXT_LENGTH_FOR_SPEECH) {
        voice.falarTexto(textoLimpo);
      }
    } catch (error) {
      logger.error('Erro TTS', { error: error.message });
    }
  }, [voice]);

  // ENVIAR MENSAGEM
  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim() || carregando) return;

    const comandoAgendar = mensagem.trim().match(/^\/agendar\b(.*)$/i);
    if (comandoAgendar) {
      const observacoes = comandoAgendar[1]?.trim() || 'Solicitacao de agendamento via comando rapido.';
      oferecerHandoffAgendamento(
        observacoes,
        clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome
      );
      setMensagem('');
      showToast('Handoff preparado. Confirme no CTA para abrir agendamento.', 'info');
      return;
    }

    if (contextoAtivo === 'buscar_cliente' && /^\d+$/.test(mensagem.trim())) {
      const numeroDigitado = parseInt(mensagem.trim());
      const ultimaMensagemAssistente = [...conversas].reverse().find(
        c => c.tipo !== 'usuario' && (c.metadata?.clientes || c.tipo === 'consulta_cliente')
      );

      if (ultimaMensagemAssistente) {
        const linhas = ultimaMensagemAssistente.conteudo.split('\n');
        const clientesExtraidos: any[] = [];
        for (const linha of linhas) {
          const match = linha.match(/^(\d+)\.\s*\*\*(.+?)\*\*/);
          if (match) {
            clientesExtraidos.push({ id: parseInt(match[1]), label: match[2].trim(), value: match[1] });
          }
        }
        const clientes = clientesExtraidos.length > 0 ? clientesExtraidos : ultimaMensagemAssistente.metadata?.clientes;

        if (clientes && numeroDigitado >= 1 && numeroDigitado <= clientes.length) {
          const novaMensagem = {
            id: Date.now(), tipo: 'usuario', conteudo: `${numeroDigitado}`,
            timestamp: new Date().toISOString(), metadata: { contexto: contextoAtivo },
          };
          setConversas(prev => { const n = [...prev, novaMensagem]; salvarConversasLocal(n); return n; });
          setMensagem('');
          setCarregando(true);

          try {
            const requestBody = {
              message: novaMensagem.conteudo, usuario_id: user?.id,
              contexto_conversa: conversas.slice(-5).map(c => ({ tipo: c.tipo, conteudo: c.conteudo })),
              contexto_ativo: contextoAtivo,
              cliente_selecionado: clientes[numeroDigitado - 1],
            };
            const { data } = await apiClient.post('/agno/chat-inteligente', requestBody);
            let responseContent = '';
            let tipoResposta = 'agente';
            if (data.response) {
              responseContent = typeof data.response === 'string' ? data.response : data.response.content || data.response.message || data.response.output || JSON.stringify(data.response, null, 2);
              if (data.tipo) tipoResposta = data.tipo;
            } else if (data.message) {
              responseContent = data.message; tipoResposta = data.success ? 'agente' : 'erro';
            } else { responseContent = 'Resposta recebida do agente.'; }

            if (responseContent.includes('Cliente selecionado') || responseContent.includes('cliente selecionado')) {
              setContextoAtivo('cliente_selecionado');
            }
            if (data?.cliente) {
              const clienteNormalizado = enrichClienteSelecionado(data.cliente);
              if (clienteNormalizado) {
                setClienteSelecionado(clienteNormalizado);
                try { localStorage.setItem('clienteSelecionado', JSON.stringify(clienteNormalizado)); } catch { /* noop */ }
              }
            }
            const respostaAgente = {
              id: Date.now() + 1, tipo: tipoResposta, conteudo: responseContent, timestamp: new Date().toISOString(),
              metadata: { ...data.metadata, dadosExtraidos: data.dadosExtraidos, actions: data.metadata?.actions },
            };
            connection.atualizarStatusPorMetadata(respostaAgente.metadata);
            setConversas(prev => { const n = [...prev, respostaAgente]; salvarConversasLocal(n); return n; });
            if (data.success && contextoAtivo && !responseContent.includes('Cliente selecionado')) { setContextoAtivo(null); }
                tentarFalarResposta(responseContent);
          } catch (error) {
            logger.error('Erro ao enviar selecao de cliente', { error: error.message });
            showToast('Erro ao processar selecao de cliente. Tente novamente.', 'error');
            setConversas(prev => [...prev, { id: Date.now() + 1, tipo: 'erro', conteudo: 'Desculpe, ocorreu um erro ao processar sua selecao.', timestamp: new Date().toISOString() }]);
          } finally { setCarregando(false); }
          return;
        } else {
          setConversas(prev => {
            const n = [...prev, { id: Date.now(), tipo: 'erro', conteudo: `Numero invalido: ${numeroDigitado}\n\nEscolha entre 1 e ${clientes ? clientes.length : 'N/A'}.`, timestamp: new Date().toISOString() }];
            salvarConversasLocal(n); return n;
          });
          setMensagem('');
          return;
        }
      }
    }

    const validacao = validarMensagem(mensagem);
    if (!validacao.valid) {
      showToast(validacao.errors[0], 'error');
      return;
    }

    const novaMensagem = {
      id: Date.now(), tipo: 'usuario', conteudo: validacao.sanitized,
      timestamp: new Date().toISOString(), metadata: { contexto: contextoAtivo },
    };
    setConversas(prev => { const n = [...prev, novaMensagem]; salvarConversasLocal(n); return n; });
    setMensagem('');
    setCarregando(true);
    setInputWarning('');
    setInputHint('');

    try {
      let mensagemEnriquecida: any = null;
      try {
        mensagemEnriquecida = enrichMessage(novaMensagem.conteudo);
      } catch (nlpError) {
        logger.warn('Erro NLP', { error: nlpError.message });
      }

      const requestBody: any = {
        message: novaMensagem.conteudo, usuario_id: user?.id,
        contexto_conversa: conversas.slice(-5).map(c => ({ tipo: c.tipo, conteudo: c.conteudo })),
        contexto_ativo: contextoAtivo, cliente_selecionado: clienteSelecionado,
      };
      if (mensagemEnriquecida) {
        requestBody.nlp = mensagemEnriquecida.nlp;
        requestBody.contextoNLP = mensagemEnriquecida.contexto;
      }

      const { data } = await apiClient.post('/agno/chat-inteligente', requestBody);

      let responseContent = '';
      let tipoResposta = 'agente';
      if (data.response) {
        responseContent = typeof data.response === 'string' ? data.response : (typeof data.response === 'object' ? (data.response.content || data.response.message || data.response.output || JSON.stringify(data.response, null, 2)) : String(data.response));
        if (data.tipo) tipoResposta = data.tipo;
      } else if (data.message) {
        responseContent = data.message; tipoResposta = data.success ? 'agente' : 'erro';
      } else { responseContent = 'Resposta recebida do agente.'; }

      // Tratamento: cliente nao encontrado -> oferecer cadastro
      if (contextoAtivo === 'buscar_cliente' && !data.success && data.tipo === 'erro') {
        responseContent = `Nao encontrei "${novaMensagem.conteudo}" no sistema.\n\nQuer cadastrar este cliente agora?`;
        tipoResposta = 'cadastro';
        data.metadata = {
          ...data.metadata,
          dadosExtraidos: { nome: novaMensagem.conteudo },
          actions: [
            { type: 'cadastrar_cliente', label: 'Sim, cadastrar', data: { nome: novaMensagem.conteudo } },
            { type: 'tentar_novamente', label: 'Nao, outro nome', data: {} },
          ],
        };
      }

      const acoesInline = gerarAcoesInline(tipoResposta, data.metadata);
      let metadataAtualizado = { ...data.metadata, dadosExtraidos: data.dadosExtraidos, actions: acoesInline };

      // Extrair clientes listados
      if (tipoResposta === 'consulta_cliente' || contextoAtivo === 'buscar_cliente') {
        const linhas = responseContent.split('\n');
        const clientesExtraidos: any[] = [];
        for (const linha of linhas) {
          const match = linha.match(/^(\d+)\.\s*\*\*(.+?)\*\*/);
          if (match) { clientesExtraidos.push({ id: parseInt(match[1]), label: match[2].trim(), value: match[1] }); }
        }
        if (clientesExtraidos.length > 0) { metadataAtualizado = { ...metadataAtualizado, clientes: clientesExtraidos }; }
      }

      const respostaAgente = {
        id: Date.now() + 1, tipo: tipoResposta, conteudo: responseContent,
        timestamp: new Date().toISOString(), metadata: metadataAtualizado,
      };
      connection.atualizarStatusPorMetadata(respostaAgente.metadata);
      if (tipoResposta === 'consulta_cliente') setContextoAtivo('buscar_cliente');
      setConversas(prev => { const n = [...prev, respostaAgente]; salvarConversasLocal(n); return n; });

      if (tipoResposta === 'cadastro' && data.dadosExtraidos) {
        setClientePrePreenchido({
          nomeCompleto: data.dadosExtraidos.nome || novaMensagem.conteudo,
          telefone: data.dadosExtraidos.telefone || '', cpfCnpj: data.dadosExtraidos.cpfCnpj || '',
          email: data.dadosExtraidos.email || '',
        });
      }
      if (data.success && contextoAtivo && tipoResposta !== 'consulta_cliente' && tipoResposta !== 'cliente_selecionado') {
        setContextoAtivo(null);
      }
      if (tipoResposta === 'cliente_selecionado' && data.cliente) {
        const clienteNormalizado = enrichClienteSelecionado(data.cliente);
        setClienteSelecionado(clienteNormalizado);
        try { localStorage.setItem('clienteSelecionado', JSON.stringify(clienteNormalizado)); } catch { /* noop */ }
        setContextoAtivo('cliente_selecionado');
      }
          tentarFalarResposta(responseContent);
    } catch (error) {
      logger.error('Erro ao enviar mensagem', { error: error.message });
      showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
      setConversas(prev => [...prev, { id: Date.now() + 1, tipo: 'erro', conteudo: 'Desculpe, ocorreu um erro. Tente novamente.', timestamp: new Date().toISOString() }]);
    } finally {
      setCarregando(false);
    }
  }, [mensagem, carregando, contextoAtivo, conversas, user, connection, showToast, clienteSelecionado, salvarConversasLocal, setConversas, setMensagem, setCarregando, setInputWarning, setInputHint, setClientePrePreenchido, setClienteSelecionado, oferecerHandoffAgendamento, tentarFalarResposta]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensagem(); }
  };

  const handleAction = useCallback((action: any) => {
    switch (action.type) {
      case 'cadastrar_cliente':
        setClientePrePreenchido({
          nomeCompleto: action.data.nome || '', telefone: action.data.telefone || '',
          cpfCnpj: action.data.cpfCnpj || '', email: action.data.email || '',
        });
        setModalClienteAberto(true);
        break;
      case 'tentar_novamente':
        setMensagem('');
        if (inputRef.current) { inputRef.current.placeholder = 'Digite outro nome, CPF ou telefone...'; inputRef.current.focus(); }
        setContextoAtivo('buscar_cliente');
        break;
      case 'agendar':
        if (onNavigateToTab) {
          oferecerHandoffAgendamento(
            `Solicitado via chat: ${action.data?.cliente ? `agendar para ${action.data.cliente}` : 'agendar servico'}`,
            action.data?.cliente
          );
          showToast(`Handoff pronto para ${action.data?.cliente || 'cliente'}.`, 'info');
        } else {
          setMensagem(`Agendar servico para ${action.data?.cliente || 'cliente'}`);
        }
        break;
      case 'abrir_agendamento':
      case 'abrir_agendamento_handoff':
      case 'agendar_no_chat':
        oferecerHandoffAgendamento(
          action.data?.observacoes || 'Solicitacao disparada por acao do chat.',
          action.data?.clienteNome || action.data?.cliente
        );
        showToast('Handoff criado. Use o CTA para abrir agendamento.', 'info');
        break;
      case 'ver_os':
        showToast(`Abrindo OS #${action.data?.os_id}`, 'info');
        break;
      case 'ligar':
        window.open(`tel:${action.data?.telefone}`, '_self');
        break;
      default:
        showToast(`Acao: ${action.label}`, 'info');
    }
  }, [showToast, onNavigateToTab, oferecerHandoffAgendamento]);

  const handleSelectOption = useCallback((option: any) => {
    if (option.value) { setMensagem(option.value); setTimeout(() => enviarMensagem(), 100); }
    else if (option.id) { setMensagem(`Selecionado: ${option.label} (ID: ${option.id})`); setTimeout(() => enviarMensagem(), 100); }
  }, [enviarMensagem]);

  const handleSelectCliente = useCallback((numero: number) => {
    setMensagem(`${numero}`);
    setTimeout(() => enviarMensagem(), 100);
  }, [enviarMensagem]);

  const handleAbrirCadastro = useCallback((dados: any) => {
    setClientePrePreenchido({
      nomeCompleto: dados.nome || '', telefone: dados.telefone || '',
      cpfCnpj: dados.cpfCnpj || '', email: dados.email || '',
    });
    setModalClienteAberto(true);
  }, []);

  const handleAddMessage = useCallback((msg: any) => {
    setConversas(prev => { const n = [...prev, msg]; salvarConversasLocal(n); return n; });
  }, [salvarConversasLocal]);

  // RENDER
  const sidePanelContent = (
    <>
      <VoiceSettingsCard
        mostrarConfig={voice.mostrarConfig}
        setMostrarConfig={voice.setMostrarConfig}
        vozesDisponiveis={voice.vozesDisponiveis}
        vozSelecionada={voice.vozSelecionada}
        setVozSelecionada={voice.setVozSelecionada}
        modoContinuo={voice.modoContinuo}
        setModoContinuo={voice.setModoContinuo}
        configVoz={voice.configVoz}
        setConfigVoz={voice.setConfigVoz}
        onTestarVoz={() => voice.falarTexto('Ola, esta e a voz do Matias.')}
      />

      <MemoryCard
        memoriaAtiva={memory.memoriaAtiva}
        memorias={memory.memorias}
        loadingMemorias={memory.loadingMemorias}
        mostrarMemorias={memory.mostrarMemorias}
        setMostrarMemorias={memory.setMostrarMemorias}
        onCarregar={memory.carregarMemorias}
        onExcluir={memory.excluirMemorias}
        isAdmin={user?.role === 'admin'}
      />

      <ActionsCard onLimparHistorico={limparHistorico} />

      <div className="rounded-2xl border border-cyan-200/65 bg-gradient-to-b from-white/90 to-cyan-50/55 p-4 shadow-[0_14px_32px_-22px_rgba(14,116,144,0.55)] ring-1 ring-cyan-200/35 backdrop-blur-sm dark:border-cyan-900/35 dark:from-slate-900/72 dark:to-cyan-950/24 dark:ring-cyan-900/30">
        <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Fluxos guiados</div>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            className="rounded-xl border border-cyan-200/75 bg-white/80 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-white dark:border-cyan-900/40 dark:bg-slate-900/55 dark:text-slate-200 dark:hover:bg-slate-900"
            onClick={() => onNavigateToTab?.('checkin')}
          >
            Iniciar check-in guiado
          </button>
          <button
            type="button"
            className="rounded-xl border border-cyan-200/75 bg-white/80 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-white dark:border-cyan-900/40 dark:bg-slate-900/55 dark:text-slate-200 dark:hover:bg-slate-900"
            onClick={() =>
              onNavigateToTab?.('agendamento', {
                clienteId: clienteSelecionado?.id,
                clienteNome: clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome,
                veiculoId: clienteSelecionado?.veiculoId,
                veiculoInfo: clienteSelecionado?.veiculoInfo || clienteSelecionado?.veiculo,
              })
            }
          >
            Agendar com dados atuais
          </button>
          <button
            type="button"
            className="rounded-xl border border-cyan-200/75 bg-white/80 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-cyan-900/40 dark:bg-slate-900/55 dark:text-slate-200 dark:hover:bg-slate-900"
            onClick={() =>
              abrirAgendamentoComContexto(
                mensagem.trim() || 'Solicitacao de agendamento sem detalhes adicionais.',
                clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome
              )
            }
            disabled={!mensagem.trim() && !clienteSelecionado}
          >
            Levar texto atual para Agendamento
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col gap-2 min-h-0 flex-1">
        <ChatHeaderBar
          statusConexao={connection.statusConexao}
          vozHabilitada={voice.vozHabilitada}
          falando={voice.falando}
          painelFixoDesktop={painelFixoDesktop}
          painelDrawerOpen={painelDrawerOpen}
          setPainelDrawerOpen={setPainelDrawerOpen}
          setPainelFixoDesktop={setPainelFixoDesktop}
          sidePanelContent={sidePanelContent}
          getStatusIcon={connection.getStatusIcon}
          getStatusText={connection.getStatusText}
          onAlternarVoz={voice.alternarVoz}
          onPararFala={voice.pararFala}
          onReconectar={() => connection.verificarConexao({ warm: true })}
        />

        <div className={`min-h-0 flex-1 flex flex-col ${painelFixoDesktop ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-2.5' : ''}`}>
          <div className="min-h-0 min-w-0 rounded-2xl border border-cyan-200/65 bg-gradient-to-b from-white/92 via-white/86 to-cyan-50/45 shadow-[0_16px_34px_-24px_rgba(14,116,144,0.6)] ring-1 ring-cyan-200/35 backdrop-blur-sm dark:border-cyan-900/35 dark:from-slate-900/72 dark:via-slate-900/68 dark:to-cyan-950/24 dark:ring-cyan-900/25 flex flex-col overflow-hidden flex-1">
            <ChatMessageList
              conversas={conversas}
              carregando={carregando}
              chatContainerRef={chatContainerRef}
              formatarFonteResposta={connection.formatarFonteResposta}
              onAction={handleAction}
              onSelectOption={handleSelectOption}
              onAbrirCadastro={handleAbrirCadastro}
              onSelectCliente={handleSelectCliente}
            />

            <QuickSuggestions
              contextoAtivo={contextoAtivo}
              carregando={carregando}
              inputRef={inputRef}
              onSetContextoAtivo={setContextoAtivo}
              setMensagem={setMensagem}
              setInputWarning={setInputWarning}
              setInputHint={setInputHint}
              onAddMessage={handleAddMessage}
            />

            <VoiceStatusBanner
              gravando={voice.gravando}
              falando={voice.falando}
              modoContinuo={voice.modoContinuo}
            />

            <ChatInputBar
              mensagem={mensagem}
              setMensagem={setMensagem}
              onEnviar={enviarMensagem}
              onKeyDown={handleKeyDown}
              onValidateInput={validarInputBusca}
              carregando={carregando}
              podeInteragir={connection.podeInteragir}
              gravando={voice.gravando}
              falando={voice.falando}
              contextoAtivo={contextoAtivo}
              inputWarning={inputWarning}
              inputHint={inputHint}
              statusConexao={connection.statusConexao}
              inputRef={inputRef}
              onIniciarGravacao={voice.iniciarGravacao}
              onPararGravacao={voice.pararGravacao}
            />
          </div>

          {painelFixoDesktop && (
            <aside className="hidden lg:flex lg:flex-col gap-3 overflow-y-auto min-h-0 pr-1">
              {sidePanelContent}
            </aside>
          )}
        </div>
      </div>

      {/* Modal de cadastro de cliente */}
      <ClienteModal
        isOpen={modalClienteAberto}
        onClose={() => setModalClienteAberto(false)}
        cliente={clientePrePreenchido}
        onSuccess={(clienteData: any) => {
          setModalClienteAberto(false);
          setClientePrePreenchido(null);
          const msg = {
            id: Date.now(), tipo: 'sucesso',
            conteudo: `Cliente **${clienteData.nomeCompleto}** cadastrado com sucesso!`,
            timestamp: new Date().toISOString(),
          };
          setConversas(prev => { const n = [...prev, msg]; salvarConversasLocal(n); return n; });
          if (voice.vozHabilitada) { voice.falarTexto(`Cliente ${clienteData.nomeCompleto} cadastrado com sucesso!`); }
        }}
      />
    </>
  );
};

export { ChatTab };
export default ChatTab;

