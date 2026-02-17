// @ts-nocheck
/**
 * AIPage.tsx — Página principal de interação com o Assistente IA (Agno Agent)
 *
 * ═══════════════════════════════════════════════════════════════
 *  Refatorado no Bloco I (M5-UX-07): monólito de 2478 linhas →
 *  composição de 4 hooks + 9 componentes (~850 linhas).
 *  enviarMensagem permanece inline por acoplar 16+ estados.
 * ═══════════════════════════════════════════════════════════════
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import ClienteModal from '../components/clientes/ClienteModal';

// ✅ Utils & config
import logger from '../utils/logger';
import { validarMensagem } from '../utils/messageValidator';
import { useToast } from '../components/ui/toast';
import { AI_CONFIG } from '../constants/aiPageConfig';
import { enrichMessage } from '../utils/nlp/queryParser';
import apiClient from '../services/api';

// ✅ Design System
import '../styles/matias-design-system.css';
import '../styles/matias-animations.css';

// ── Custom hooks (extraídos do monólito) ─────
import { useSidePanel } from '../hooks/ai/useSidePanel';
import { useVoiceControl } from '../hooks/ai/useVoiceControl';
import { useMemoryManager } from '../hooks/ai/useMemoryManager';
import { useConnectionStatus } from '../hooks/ai/useConnectionStatus';

// ── Sub-componentes (extraídos do monólito) ──
import ChatHeaderBar from '../components/chat/ChatHeaderBar';
import ChatMessageList from '../components/chat/ChatMessageList';
import QuickSuggestions from '../components/chat/QuickSuggestions';
import VoiceStatusBanner from '../components/chat/VoiceStatusBanner';
import ChatInputBar from '../components/chat/ChatInputBar';
import VoiceSettingsCard from '../components/chat/VoiceSettingsCard';
import MemoryCard from '../components/chat/MemoryCard';
import ActionsCard from '../components/chat/ActionsCard';

// ═══════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════

const AIPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'admin';

  // ── Hooks extraídos ────────────────────────
  const panel = useSidePanel();
  const voice = useVoiceControl({ showToast });
  const memory = useMemoryManager({
    userId: user?.id,
    showToast,
  });
  const connection = useConnectionStatus({
    showToast,
    onMemoryStatus: memory.setMemoriaAtiva,
  });

  // ── Estado local (chat + contexto) ─────────
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [contextoAtivo, setContextoAtivo] = useState<any>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(() => {
    try {
      const saved = localStorage.getItem('clienteSelecionado');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [inputWarning, setInputWarning] = useState('');
  const [inputHint, setInputHint] = useState('');

  // Modal de cadastro de cliente
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [clientePrePreenchido, setClientePrePreenchido] = useState<any>(null);

  // Refs
  const chatContainerRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // ── Wiring: conectar STT transcript → setMensagem ──
  useEffect(() => {
    voice.setOnTranscript((text: string, append: boolean) => {
      if (append) {
        setMensagem(prev => prev + (prev ? ' ' : '') + text);
      } else {
        setMensagem(text);
      }
    });
  }, [voice.setOnTranscript]);

  // ── CSS animation keyframes ────────────────
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fade-in 0.3s ease-out; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ── Mensagem inicial ───────────────────────
  useEffect(() => {
    if (conversas.length === 0 && user) {
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Olá ${user?.nome || 'usuário'}! 👋\n\n**Bem-vindo ao Assistente IA do OFIX!**\n\nSou especializado em:\n\n🔧 Diagnósticos automotivos\n🚗 Gestão de peças e estoque\n💼 Suporte comercial\n📊 Análise de dados operacionais\n\n${memory.memoriaAtiva ? '🧠 **Sistema de memória ativo** - Vou lembrar das nossas conversas!' : ''}\n\nComo posso ajudá-lo hoje?`,
        timestamp: new Date().toISOString(),
      };
      setConversas([msg]);
    }
  }, [user, conversas.length, memory.memoriaAtiva]);

  // ── Auto-scroll ────────────────────────────
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversas]);

  // ════════════════════════════════════════════
  // FUNÇÕES DE LOCALSTORAGE
  // ════════════════════════════════════════════

  const getStorageKey = () => `matias_conversas_${user?.id || 'anonymous'}`;

  const salvarConversasLocal = (novasConversas) => {
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
  };

  const limparHistorico = () => {
    try {
      localStorage.removeItem(getStorageKey());
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Olá ${user?.nome || 'usuário'}! 👋\n\n**Nova conversa iniciada!**\n\nSou o assistente de IA do OFIX, especializado em:\n\n🔧 Diagnósticos automotivos\n🚗 Gestão de peças e estoque\n💼 Suporte comercial\n📊 Análise de dados operacionais\n\n${memory.memoriaAtiva ? '🧠 **Sistema de memória ativo** - Eu lembro das nossas conversas anteriores!' : ''}\n\nComo posso ajudá-lo hoje?`,
        timestamp: new Date().toISOString(),
      };
      setConversas([msg]);
      salvarConversasLocal([msg]);
      showToast('Chat limpo! Nova conversa iniciada.', 'success');
    } catch (error) {
      logger.error('Erro ao limpar histórico', { error: error.message });
      showToast('Erro ao limpar histórico', 'error');
    }
  };

  // ════════════════════════════════════════════
  // VALIDAÇÃO EM TEMPO REAL — Busca de Clientes
  // ════════════════════════════════════════════

  const validarInputBusca = (valor) => {
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
      setInputHint('✅ CPF detectado e formatado');
      setInputWarning('');
      return true;
    }
    if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
      setInputHint('✅ Telefone detectado');
      setInputWarning('');
      return true;
    }
    if (valor.length >= 3) {
      setInputHint('✅ Pronto para buscar');
      setInputWarning('');
      return true;
    }
    setInputWarning('');
    setInputHint('');
    return true;
  };

  // ════════════════════════════════════════════
  // GERAR AÇÕES INLINE
  // ════════════════════════════════════════════

  const gerarAcoesInline = (tipo, metadata) => {
    const actions: any[] = [];
    if (tipo === 'consulta_cliente' && metadata?.cliente_id) {
      actions.push(
        { type: 'agendar', label: 'Agendar serviço', data: { cliente: metadata.cliente_nome } },
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

  // ════════════════════════════════════════════
  // ENVIAR MENSAGEM (permanece inline – 16+ estados)
  // ════════════════════════════════════════════

  const enviarMensagem = async () => {
    if (!mensagem.trim() || carregando) return;

    // ── Contexto de busca de cliente: seleção por número ──
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
            clientesExtraidos.push({
              id: parseInt(match[1]),
              label: match[2].trim(),
              value: match[1],
            });
          }
        }

        const clientes = clientesExtraidos.length > 0
          ? clientesExtraidos
          : ultimaMensagemAssistente.metadata?.clientes;

        if (clientes && numeroDigitado >= 1 && numeroDigitado <= clientes.length) {
          const novaMensagem = {
            id: Date.now(),
            tipo: 'usuario',
            conteudo: `${numeroDigitado}`,
            timestamp: new Date().toISOString(),
            metadata: { contexto: contextoAtivo },
          };

          setConversas(prev => {
            const n = [...prev, novaMensagem];
            salvarConversasLocal(n);
            return n;
          });
          setMensagem('');
          setCarregando(true);

          try {
            const requestBody: any = {
              message: novaMensagem.conteudo,
              usuario_id: user?.id,
              contexto_conversa: conversas.slice(-5).map(c => ({ tipo: c.tipo, conteudo: c.conteudo })),
              contexto_ativo: contextoAtivo,
            };

            logger.info('🚀 Enviando requisição (seleção de cliente)', {
              endpoint: '/agno/chat-inteligente',
              contextoAtivo,
              message: novaMensagem.conteudo,
            });

            const { data } = await apiClient.post('/agno/chat-inteligente', requestBody);
              let responseContent = '';
              let tipoResposta = 'agente';

              if (data.response) {
                responseContent = typeof data.response === 'string'
                  ? data.response
                  : data.response.content || data.response.message || data.response.output || JSON.stringify(data.response, null, 2);
                if (data.tipo) tipoResposta = data.tipo;
              } else if (data.message) {
                responseContent = data.message;
                tipoResposta = data.success ? 'agente' : 'erro';
              } else {
                responseContent = 'Resposta recebida do agente.';
              }

              if (responseContent.includes('Cliente selecionado') || responseContent.includes('cliente selecionado')) {
                setContextoAtivo('cliente_selecionado');
              }

              const respostaAgente = {
                id: Date.now() + 1,
                tipo: tipoResposta,
                conteudo: responseContent,
                timestamp: new Date().toISOString(),
                metadata: { ...data.metadata, dadosExtraidos: data.dadosExtraidos, actions: data.metadata?.actions },
              };

              connection.atualizarStatusPorMetadata(respostaAgente.metadata);
              setConversas(prev => {
                const n = [...prev, respostaAgente];
                salvarConversasLocal(n);
                return n;
              });

              if (data.success && contextoAtivo && !responseContent.includes('Cliente selecionado')) {
                setContextoAtivo(null);
              }

              tentarFalarResposta(responseContent);
          } catch (error) {
            logger.error('Erro ao enviar seleção de cliente', { error: error.message, userId: user?.id });
            showToast('Erro ao processar seleção de cliente. Tente novamente.', 'error');
            setConversas(prev => [...prev, {
              id: Date.now() + 1,
              tipo: 'erro',
              conteudo: 'Desculpe, ocorreu um erro ao processar sua seleção de cliente. Tente novamente em instantes.',
              timestamp: new Date().toISOString(),
            }]);
          } finally {
            setCarregando(false);
          }
          return;
        } else {
          setConversas(prev => {
            const n = [...prev, {
              id: Date.now(),
              tipo: 'erro',
              conteudo: `❌ Número inválido: ${numeroDigitado}\n\nPor favor, escolha um número entre 1 e ${clientes ? clientes.length : 'N/A'}.`,
              timestamp: new Date().toISOString(),
            }];
            salvarConversasLocal(n);
            return n;
          });
          setMensagem('');
          return;
        }
      } else {
        logger.warn('Nenhuma mensagem de consulta de cliente encontrada', { contextoAtivo, mensagem: mensagem.trim() });
      }
    }

    // ── Validação ──
    const validacao = validarMensagem(mensagem);
    if (!validacao.valid) {
      showToast(validacao.errors[0], 'error');
      logger.warn('Mensagem inválida', { errors: validacao.errors, messageLength: mensagem.length });
      return;
    }

    const novaMensagem = {
      id: Date.now(),
      tipo: 'usuario',
      conteudo: validacao.sanitized,
      timestamp: new Date().toISOString(),
      metadata: { contexto: contextoAtivo },
    };

    setConversas(prev => {
      const n = [...prev, novaMensagem];
      salvarConversasLocal(n);
      return n;
    });
    setMensagem('');
    setCarregando(true);
    setInputWarning('');
    setInputHint('');

    try {
      // NLP enrichment
      let mensagemEnriquecida: any = null;
      try {
        mensagemEnriquecida = enrichMessage(novaMensagem.conteudo);
        logger.info('Mensagem enriquecida com NLP', {
          intencao: mensagemEnriquecida?.nlp?.intencao,
          confianca: mensagemEnriquecida?.nlp?.confianca,
        });
      } catch (nlpError) {
        logger.warn('Erro ao enriquecer mensagem com NLP', { error: nlpError.message });
      }

      const requestBody: any = {
        message: novaMensagem.conteudo,
        usuario_id: user?.id,
        contexto_conversa: conversas.slice(-5).map(c => ({ tipo: c.tipo, conteudo: c.conteudo })),
        contexto_ativo: contextoAtivo,
        cliente_selecionado: clienteSelecionado,
      };
      if (mensagemEnriquecida) {
        requestBody.nlp = mensagemEnriquecida.nlp;
        requestBody.contextoNLP = mensagemEnriquecida.contexto;
      }

      logger.info('🚀 Enviando requisição ao backend', {
        endpoint: '/agno/chat-inteligente',
        hasNLP: !!mensagemEnriquecida,
        contextoAtivo,
        message: novaMensagem.conteudo.substring(0, 50),
      });

      const { data } = await apiClient.post('/agno/chat-inteligente', requestBody);

      logger.info('📥 Resposta recebida', { status: 200 });

      let responseContent = '';
      let tipoResposta = 'agente';

      if (data.response) {
          if (typeof data.response === 'string') {
            responseContent = data.response;
          } else if (typeof data.response === 'object') {
            responseContent = data.response.content || data.response.message || data.response.output || JSON.stringify(data.response, null, 2);
          } else {
            responseContent = String(data.response);
          }
          if (data.tipo) tipoResposta = data.tipo;
        } else if (data.message) {
          responseContent = data.message;
          tipoResposta = data.success ? 'agente' : 'erro';
        } else {
          responseContent = 'Resposta recebida do agente.';
        }

        // Tratamento especial: cliente não encontrado → oferecer cadastro
        if (contextoAtivo === 'buscar_cliente' && !data.success && data.tipo === 'erro') {
          responseContent = `🔍 Não encontrei "${novaMensagem.conteudo}" no sistema.\n\n🆕 Quer cadastrar este cliente agora?\n\nVou precisar de:\n• Nome completo\n• Telefone\n• CPF (opcional)\n• Email (opcional)`;
          tipoResposta = 'cadastro';
          data.metadata = {
            ...data.metadata,
            dadosExtraidos: { nome: novaMensagem.conteudo },
            actions: [
              { type: 'cadastrar_cliente', label: 'Sim, cadastrar', data: { nome: novaMensagem.conteudo } },
              { type: 'tentar_novamente', label: 'Não, tentar outro nome', data: {} },
            ],
          };
        }

        const acoesInline = gerarAcoesInline(tipoResposta, data.metadata);
        let metadataAtualizado = { ...data.metadata, dadosExtraidos: data.dadosExtraidos, actions: acoesInline };

        // Extrair clientes listados na resposta
        if (tipoResposta === 'consulta_cliente' || contextoAtivo === 'buscar_cliente') {
          const linhas = responseContent.split('\n');
          const clientesExtraidos: any[] = [];
          for (const linha of linhas) {
            const match = linha.match(/^(\d+)\.\s*\*\*(.+?)\*\*/);
            if (match) {
              clientesExtraidos.push({ id: parseInt(match[1]), label: match[2].trim(), value: match[1] });
            }
          }
          if (clientesExtraidos.length > 0) {
            metadataAtualizado = { ...metadataAtualizado, clientes: clientesExtraidos };
          }
        }

        const respostaAgente = {
          id: Date.now() + 1,
          tipo: tipoResposta,
          conteudo: responseContent,
          timestamp: new Date().toISOString(),
          metadata: metadataAtualizado,
        };

        connection.atualizarStatusPorMetadata(respostaAgente.metadata);

        if (tipoResposta === 'consulta_cliente') setContextoAtivo('buscar_cliente');

        setConversas(prev => {
          const n = [...prev, respostaAgente];
          salvarConversasLocal(n);
          return n;
        });

        // Modal de cadastro
        if (tipoResposta === 'cadastro' && data.dadosExtraidos) {
          setClientePrePreenchido({
            nomeCompleto: data.dadosExtraidos.nome || novaMensagem.conteudo,
            telefone: data.dadosExtraidos.telefone || '',
            cpfCnpj: data.dadosExtraidos.cpfCnpj || '',
            email: data.dadosExtraidos.email || '',
          });
        }

        // Limpar contexto (exceto consulta_cliente / cliente_selecionado)
        if (data.success && contextoAtivo) {
          if (tipoResposta !== 'consulta_cliente' && tipoResposta !== 'cliente_selecionado') {
            setContextoAtivo(null);
          }
        }

        // Atualizar cliente selecionado
        if (tipoResposta === 'cliente_selecionado' && data.cliente) {
          setClienteSelecionado(data.cliente);
          try { localStorage.setItem('clienteSelecionado', JSON.stringify(data.cliente)); } catch { /* ok */ }
          setContextoAtivo('cliente_selecionado');
        }

        tentarFalarResposta(responseContent);
    } catch (error) {
      logger.error('Erro ao enviar mensagem', { error: error.message, userId: user?.id, messageLength: mensagem.length, contextoAtivo });
      showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
      setConversas(prev => [...prev, {
        id: Date.now() + 1,
        tipo: 'erro',
        conteudo: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em instantes.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setCarregando(false);
    }
  };

  /** Helper: falar resposta se voz habilitada */
  const tentarFalarResposta = (responseContent: string) => {
    if (!voice.vozHabilitada || !responseContent || !('speechSynthesis' in window)) return;
    try {
      const textoLimpo = responseContent
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .replace(/[•✅❌📋🔧🚗💼📊🔍🆕👤📅💰📦]/gu, '')
        .trim();
      if (textoLimpo.length > 0 && textoLimpo.length < AI_CONFIG.VOICE.MAX_TEXT_LENGTH_FOR_SPEECH) {
        voice.falarTexto(textoLimpo);
      }
    } catch (error) {
      logger.error('Erro ao preparar texto para fala', { error: error.message });
    }
  };

  // ── Handler: Enter = enviar ────────────────
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  // ── Handler: ação inline ───────────────────
  const handleAction = useCallback((action) => {
    logger.info('Ação inline executada', { action });
    switch (action.type) {
      case 'cadastrar_cliente':
        setClientePrePreenchido({
          nomeCompleto: action.data.nome || '',
          telefone: action.data.telefone || '',
          cpfCnpj: action.data.cpfCnpj || '',
          email: action.data.email || '',
        });
        setModalClienteAberto(true);
        break;
      case 'tentar_novamente':
        setMensagem('');
        if (inputRef.current) { inputRef.current.placeholder = 'Digite outro nome, CPF ou telefone...'; inputRef.current.focus(); }
        setContextoAtivo('buscar_cliente');
        break;
      case 'agendar':
        setMensagem(`Agendar serviço para ${action.data?.cliente || 'cliente'}`);
        break;
      case 'ver_os':
        showToast(`Abrindo OS #${action.data?.os_id}`, 'info');
        break;
      case 'ligar':
        window.open(`tel:${action.data?.telefone}`, '_self');
        break;
      default:
        showToast(`Ação: ${action.label}`, 'info');
    }
  }, [showToast]);

  // ── Handler: opção selecionada ─────────────
  const handleSelectOption = useCallback((option) => {
    logger.info('Opção selecionada', { option });
    if (option.value) {
      setMensagem(option.value);
      setTimeout(() => enviarMensagem(), 100);
    } else if (option.id) {
      setMensagem(`Selecionado: ${option.label} (ID: ${option.id})`);
      setTimeout(() => enviarMensagem(), 100);
    }
  }, []);

  // ── Handler: seleção de cliente por número ─
  const handleSelectCliente = useCallback((numero: number) => {
    logger.info('Cliente selecionado por número', { index: numero });
    setMensagem(`${numero}`);
    setTimeout(() => enviarMensagem(), 100);
  }, []);

  // ── Handler: abrir cadastro ────────────────
  const handleAbrirCadastro = useCallback((dados) => {
    setClientePrePreenchido({
      nomeCompleto: dados.nome || '',
      telefone: dados.telefone || '',
      cpfCnpj: dados.cpfCnpj || '',
      email: dados.email || '',
    });
    setModalClienteAberto(true);
  }, []);

  // ── Handler: adicionar mensagem ao chat (para QuickSuggestions) ──
  const handleAddMessage = useCallback((msg) => {
    setConversas(prev => {
      const n = [...prev, msg];
      salvarConversasLocal(n);
      return n;
    });
  }, []);

  // ════════════════════════════════════════════
  // SIDE PANEL CONTENT
  // ════════════════════════════════════════════

  const sidePanelContent = (
    <div className="flex flex-col gap-3">
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
        onTestarVoz={() => voice.falarTexto('Olá! Esta é a voz do Matias. Como posso ajudá-lo hoje?')}
      />
      <MemoryCard
        memoriaAtiva={memory.memoriaAtiva}
        memorias={memory.memorias}
        loadingMemorias={memory.loadingMemorias}
        mostrarMemorias={memory.mostrarMemorias}
        setMostrarMemorias={memory.setMostrarMemorias}
        onCarregar={memory.carregarMemorias}
        onExcluir={memory.excluirMemorias}
        isAdmin={isAdmin}
      />
      <ActionsCard onLimparHistorico={limparHistorico} />
    </div>
  );

  // ════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════

  return (
    <div className="relative h-full min-h-0 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-2 sm:p-4">
      {/* Dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-[0.10] dark:[background-image:radial-gradient(#ffffff_1px,transparent_1px)]" />

      <div className="relative mx-auto w-full max-w-[1480px] flex flex-col min-h-0">
        {/* ── Header ── */}
        <ChatHeaderBar
          statusConexao={connection.statusConexao}
          memoriaAtiva={memory.memoriaAtiva}
          vozHabilitada={voice.vozHabilitada}
          falando={voice.falando}
          painelFixoDesktop={panel.painelFixoDesktop}
          painelDrawerOpen={panel.painelDrawerOpen}
          setPainelDrawerOpen={panel.setPainelDrawerOpen}
          setPainelFixoDesktop={panel.setPainelFixoDesktop}
          sidePanelContent={sidePanelContent}
          getStatusIcon={connection.getStatusIcon}
          getStatusText={connection.getStatusText}
          onAlternarVoz={voice.alternarVoz}
          onPararFala={voice.pararFala}
          onReconectar={() => connection.verificarConexao({ warm: true })}
        />

        {/* ── Grid: chat + side panel ── */}
        <div className={`flex-1 min-h-0 grid grid-cols-1 gap-3 ${panel.painelFixoDesktop ? 'lg:grid-cols-[minmax(0,1fr)_360px]' : 'lg:grid-cols-1'}`}>
          {/* Área de Chat */}
          <div className="min-h-0 min-w-0 bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 flex flex-col overflow-hidden">
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
              onKeyPress={handleKeyPress}
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

          {/* Side panel (desktop fixo) */}
          {panel.painelFixoDesktop && (
            <div className="hidden lg:flex min-h-0 min-w-0 flex-col">
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Painel do Matias</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => panel.setPainelFixoDesktop(false)}
                  className="h-9 w-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  aria-label="Fechar painel"
                  title="Fechar painel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                {sidePanelContent}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de cadastro de cliente */}
      <ClienteModal
        isOpen={modalClienteAberto}
        onClose={() => setModalClienteAberto(false)}
        cliente={clientePrePreenchido}
        onSuccess={(clienteData) => {
          setModalClienteAberto(false);
          setClientePrePreenchido(null);
          const msg = {
            id: Date.now(),
            tipo: 'sucesso',
            conteudo: `✅ Cliente **${clienteData.nomeCompleto}** cadastrado com sucesso! Posso ajudar em mais alguma coisa?`,
            timestamp: new Date().toISOString(),
          };
          setConversas(prev => {
            const n = [...prev, msg];
            salvarConversasLocal(n);
            return n;
          });
          if (voice.vozHabilitada) {
            voice.falarTexto(`Cliente ${clienteData.nomeCompleto} cadastrado com sucesso!`);
          }
        }}
      />
    </div>
  );
};

export default AIPage;
