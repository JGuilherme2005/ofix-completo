// @ts-nocheck
/**
 * ChatTab — Tab de chat extraída do AIPage
 * Contém toda a lógica de envio de mensagens, NLP, seleção, cadastro e contexto
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import ClienteModal from '../clientes/ClienteModal';

import logger from '../../utils/logger';
import { validarMensagem } from '../../utils/messageValidator';
import { AI_CONFIG } from '../../constants/aiPageConfig';
import { enrichMessage } from '../../utils/nlp/queryParser';
import apiClient from '../../services/api';

import ChatMessageList from '../chat/ChatMessageList';
import QuickSuggestions from '../chat/QuickSuggestions';
import VoiceStatusBanner from '../chat/VoiceStatusBanner';
import ChatInputBar from '../chat/ChatInputBar';

interface ChatTabProps {
  user: any;
  showToast: (msg: string, type?: string) => void;
  voice: any;
  memory: any;
  connection: any;
  clienteSelecionado: any;
  setClienteSelecionado: (c: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

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
  // ── Estado local (chat + contexto) ─────────
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

  // ── Wiring: conectar STT transcript → setMensagem ──
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

  // ── Mensagem inicial ───────────────────────
  useEffect(() => {
    if (conversas.length === 0 && user) {
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Olá ${user?.nome || 'usuário'}! 👋\n\n**Bem-vindo ao Assistente IA do Pista!**\n\nSou especializado em:\n\n🔧 Diagnósticos automotivos\n🚗 Gestão de peças e estoque\n💼 Suporte comercial\n📊 Análise de dados\n📅 Agendamento de serviços\n\n${memory.memoriaAtiva ? '🧠 **Memória ativa** — Vou lembrar das nossas conversas!' : ''}\n\nComo posso ajudá-lo hoje?`,
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

  const _limparHistorico = () => {
    try {
      localStorage.removeItem(getStorageKey());
      const msg = {
        id: Date.now(),
        tipo: 'sistema',
        conteudo: `Olá ${user?.nome || 'usuário'}! 👋\n\n**Nova conversa iniciada!**\n\nComo posso ajudá-lo hoje?`,
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
  // VALIDAÇÃO EM TEMPO REAL
  // ════════════════════════════════════════════
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
    return true;
  };

  // ════════════════════════════════════════════
  // GERAR AÇÕES INLINE
  // ════════════════════════════════════════════
  const gerarAcoesInline = (tipo: string, metadata: any) => {
    const actions: any[] = [];
    if (tipo === 'consulta_cliente' && metadata?.cliente_id) {
      actions.push(
        { type: 'agendar', label: '📅 Agendar serviço', data: { cliente: metadata.cliente_nome } },
        { type: 'ver_detalhes', label: '👁️ Ver detalhes', data: { cliente_id: metadata.cliente_id } }
      );
      if (metadata.telefone) {
        actions.push({ type: 'ligar', label: '📞 Ligar', data: { telefone: metadata.telefone } });
      }
    }
    if (metadata?.os_id) {
      actions.push(
        { type: 'ver_os', label: '📋 Ver OS', data: { os_id: metadata.os_id } },
        { type: 'editar', label: '✏️ Editar', data: { os_id: metadata.os_id } }
      );
    }
    if (tipo === 'confirmacao' && metadata?.agendamento_id) {
      actions.push(
        { type: 'ver_detalhes', label: '👁️ Ver agendamento', data: { agendamento_id: metadata.agendamento_id } },
        { type: 'editar', label: '🔄 Reagendar', data: { agendamento_id: metadata.agendamento_id } }
      );
    }
    return actions.length > 0 ? actions : null;
  };

  // ════════════════════════════════════════════
  // ENVIAR MENSAGEM
  // ════════════════════════════════════════════
  const enviarMensagem = useCallback(async () => {
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
            const respostaAgente = {
              id: Date.now() + 1, tipo: tipoResposta, conteudo: responseContent, timestamp: new Date().toISOString(),
              metadata: { ...data.metadata, dadosExtraidos: data.dadosExtraidos, actions: data.metadata?.actions },
            };
            connection.atualizarStatusPorMetadata(respostaAgente.metadata);
            setConversas(prev => { const n = [...prev, respostaAgente]; salvarConversasLocal(n); return n; });
            if (data.success && contextoAtivo && !responseContent.includes('Cliente selecionado')) { setContextoAtivo(null); }
                tentarFalarResposta(responseContent);
          } catch (error) {
            logger.error('Erro ao enviar seleção de cliente', { error: error.message });
            showToast('Erro ao processar seleção de cliente. Tente novamente.', 'error');
            setConversas(prev => [...prev, { id: Date.now() + 1, tipo: 'erro', conteudo: 'Desculpe, ocorreu um erro ao processar sua seleção.', timestamp: new Date().toISOString() }]);
          } finally { setCarregando(false); }
          return;
        } else {
          setConversas(prev => {
            const n = [...prev, { id: Date.now(), tipo: 'erro', conteudo: `❌ Número inválido: ${numeroDigitado}\n\nEscolha entre 1 e ${clientes ? clientes.length : 'N/A'}.`, timestamp: new Date().toISOString() }];
            salvarConversasLocal(n); return n;
          });
          setMensagem('');
          return;
        }
      }
    }

    // ── Validação ──
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

      // Tratamento: cliente não encontrado → oferecer cadastro
      if (contextoAtivo === 'buscar_cliente' && !data.success && data.tipo === 'erro') {
        responseContent = `🔍 Não encontrei "${novaMensagem.conteudo}" no sistema.\n\n🆕 Quer cadastrar este cliente agora?`;
        tipoResposta = 'cadastro';
        data.metadata = {
          ...data.metadata,
          dadosExtraidos: { nome: novaMensagem.conteudo },
          actions: [
            { type: 'cadastrar_cliente', label: 'Sim, cadastrar', data: { nome: novaMensagem.conteudo } },
            { type: 'tentar_novamente', label: 'Não, outro nome', data: {} },
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
        setClienteSelecionado(data.cliente);
        try { localStorage.setItem('clienteSelecionado', JSON.stringify(data.cliente)); } catch { /* noop */ }
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
  }, [mensagem, carregando, contextoAtivo, conversas, user, connection, showToast, clienteSelecionado, salvarConversasLocal, setConversas, setMensagem, setCarregando, setInputWarning, setInputHint, setClientePrePreenchido, setClienteSelecionado, tentarFalarResposta]);

  /** Helper: falar resposta se voz habilitada */
  const tentarFalarResposta = useCallback((responseContent: string) => {
    if (!voice.vozHabilitada || !responseContent || !('speechSynthesis' in window)) return;
    try {
      const textoLimpo = responseContent
        .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '').replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1').replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ').replace(/[•✅❌📋🔧🚗💼📊🔍🆕👤📅💰📦]/gu, '').trim();
      if (textoLimpo.length > 0 && textoLimpo.length < AI_CONFIG.VOICE.MAX_TEXT_LENGTH_FOR_SPEECH) {
        voice.falarTexto(textoLimpo);
      }
    } catch (error) {
      logger.error('Erro TTS', { error: error.message });
    }
  }, [voice]);

  // ── Handlers ────────────────────────────────
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
          onNavigateToTab('agendamento');
          showToast(`Agendar serviço para ${action.data?.cliente || 'cliente'}`, 'success');
        } else {
          setMensagem(`Agendar serviço para ${action.data?.cliente || 'cliente'}`);
        }
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
  }, [showToast, onNavigateToTab]);

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

  // ════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════
  return (
    <>
      <div className="min-h-0 min-w-0 bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 flex flex-col overflow-hidden flex-1">
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
            conteudo: `✅ Cliente **${clienteData.nomeCompleto}** cadastrado com sucesso!`,
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
