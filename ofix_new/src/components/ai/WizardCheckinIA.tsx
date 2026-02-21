// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, CheckCircle2, Edit3, RotateCcw } from 'lucide-react';
import apiClient from '../../services/api';

/**
 * Wizard de Check-in Guiado por IA
 * Conduz conversa estruturada para coleta de dados do veículo
 */
const WizardCheckinIA = ({ onCheckinCompleto, dadosIniciais = {} }) => {
  // Estados do componente
  const [etapaAtual, setEtapaAtual] = useState('inicio');
  const [dadosColetados, setDadosColetados] = useState(dadosIniciais);
  const [proximaPergunta, setProximaPergunta] = useState('');
  const [respostaAtual, setRespostaAtual] = useState('');
  const [conversaHistorico, setConversaHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [conversaId, setConversaId] = useState<any>(null);

  // Estados internos
  const [checkinCompleto, setCheckinCompleto] = useState(false);

  /**
   * Inicia a conversa de check-in
   */
  const iniciarCheckin = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const response = await apiClient.post('/ai/checkin/conduzir', {
          etapaAtual: 'inicio',
          dadosParciais: dadosColetados
        });

      const data = response.data;
      setProximaPergunta(data.proxima_pergunta);
      setEtapaAtual(data.etapa_seguinte);
      setConversaId(data.conversaId);

      // Adicionar primeira pergunta ao histórico
      setConversaHistorico([{
        tipo: 'ia',
        conteudo: proximaPergunta || 'Olá! Vamos começar o check-in do seu veículo. Qual problema você está enfrentando?',
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Erro ao iniciar check-in:', error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }, [dadosColetados, proximaPergunta]);

  /**
   * Inicia o check-in quando o componente é montado
   */
  useEffect(() => {
    iniciarCheckin();
  }, [iniciarCheckin]);

  /**
   * Processa resposta do usuário e obtém próxima pergunta
   */
  const processarResposta = async () => {
    if (!respostaAtual.trim()) {
      setErro('Por favor, digite uma resposta.');
      return;
    }

    try {
      setLoading(true);
      setErro('');

      // Adicionar resposta do usuário ao histórico
      const novaResposta = {
        tipo: 'usuario',
        conteudo: respostaAtual,
        timestamp: new Date()
      };

      setConversaHistorico(prev => [...prev, novaResposta]);

      // Simular processamento da IA
      const dadosAtualizados = { ...dadosColetados };
      
      // Lógica simples para extrair dados da resposta
      const resposta = respostaAtual.toLowerCase();
      
      if (etapaAtual === 'aguardando_resposta_problema' || etapaAtual === 'aguardando_resposta') {
        dadosAtualizados.problema_relatado = respostaAtual;
        
        // Detectar tipo de problema
        if (resposta.includes('freio') || resposta.includes('freou')) {
          dadosAtualizados.categoria_problema = 'freios';
        } else if (resposta.includes('motor') || resposta.includes('barulho')) {
          dadosAtualizados.categoria_problema = 'motor';
        } else if (resposta.includes('pneu') || resposta.includes('roda')) {
          dadosAtualizados.categoria_problema = 'pneus';
        } else {
          dadosAtualizados.categoria_problema = 'outros';
        }
      }

      setDadosColetados(dadosAtualizados);

      // Simular resposta da IA baseada na etapa
      let proximaEtapa, proximaPerg;
      
      switch (etapaAtual) {
        case 'aguardando_resposta_problema':
        case 'aguardando_resposta':
          proximaEtapa = 'coletando_detalhes';
          proximaPerg = 'Entendi. Quando você notou esse problema pela primeira vez? Acontece sempre ou apenas em situações específicas?';
          break;
        case 'coletando_detalhes':
          proximaEtapa = 'verificando_manutencao';
          proximaPerg = 'Obrigado pelas informações. Quando foi a última manutenção do veículo? Você lembra quais serviços foram feitos?';
          dadosAtualizados.detalhes_problema = respostaAtual;
          break;
        case 'verificando_manutencao':
          proximaEtapa = 'finalizando_checkin';
          proximaPerg = 'Perfeito! Baseado nas informações coletadas, vou preparar um resumo do check-in. Há mais alguma coisa importante que você gostaria de mencionar?';
          dadosAtualizados.historico_manutencao = respostaAtual;
          break;
        case 'finalizando_checkin':
          proximaEtapa = 'check_in_completo';
          proximaPerg = 'Excelente! Check-in finalizado com sucesso. Todas as informações foram registradas no sistema.';
          dadosAtualizados.observacoes_finais = respostaAtual;
          setCheckinCompleto(true);
          break;
        default:
          proximaEtapa = 'check_in_completo';
          proximaPerg = 'Check-in finalizado!';
          setCheckinCompleto(true);
      }

      // Adicionar resposta da IA ao histórico
      const respostaIA = {
        tipo: 'ia',
        conteudo: proximaPerg,
        timestamp: new Date()
      };

      setConversaHistorico(prev => [...prev, respostaIA]);
      setProximaPergunta(proximaPerg);
      setEtapaAtual(proximaEtapa);
      setRespostaAtual('');

      // Se check-in completo, chamar callback
      if (proximaEtapa === 'check_in_completo' && onCheckinCompleto) {
        onCheckinCompleto(dadosAtualizados);
      }

    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      setErro('Erro ao processar resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reinicia o processo de check-in
   */
  const reiniciarCheckin = () => {
    setEtapaAtual('inicio');
    setDadosColetados(dadosIniciais);
    setConversaHistorico([]);
    setRespostaAtual('');
    setCheckinCompleto(false);
    setErro('');
    iniciarCheckin();
  };

  /**
   * Formata timestamp para exibição
   */
  const formatarTempo = (timestamp) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <MessageCircle size={32} />
          <div>
            <h2 className="text-2xl font-bold">Check-in Guiado por IA</h2>
            <p className="text-purple-100">
              Assistente inteligente para coleta estruturada de informações
            </p>
          </div>
        </div>
        
        {/* Indicador de Progresso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progresso do Check-in</span>
            <span>{checkinCompleto ? '100%' : getProgresso()}%</span>
          </div>
          <div className="w-full bg-purple-300 rounded-full h-2">
            <div 
              className="bg-white dark:bg-slate-900 rounded-full h-2 transition-all duration-500"
              style={{ width: `${checkinCompleto ? 100 : getProgresso()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Área de Conversa */}
      <div className="p-6">
        {/* Histórico da Conversa */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {conversaHistorico.map((mensagem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  mensagem.tipo === 'usuario' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  <p className="text-sm">{mensagem.conteudo}</p>
                  <p className={`text-xs mt-1 ${
                    mensagem.tipo === 'usuario' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {formatarTempo(mensagem.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Área de Input */}
        {!checkinCompleto && (
          <div className="space-y-4">
            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                <p className="text-red-600 text-sm">{erro}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <textarea
                value={respostaAtual}
                onChange={(e) => setRespostaAtual(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                rows={3}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                aria-label="Resposta ao wizard de check-in"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    processarResposta();
                  }
                }}
                disabled={loading}
              />
              
              <motion.button
                onClick={processarResposta}
                disabled={loading || !respostaAtual.trim()}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 text-white rounded-lg transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <span>Enviar</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>

            <p className="text-slate-500 text-sm text-center">
              💡 Dica: Seja específico em suas respostas para que a IA possa ajudar melhor
            </p>
          </div>
        )}

        {/* Check-in Completo */}
        {checkinCompleto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                ✅ Check-in Finalizado com Sucesso!
              </h3>
              <p className="text-green-600">
                Todas as informações foram coletadas e registradas no sistema.
              </p>
            </div>

            {/* Resumo dos Dados Coletados */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                📋 Resumo das Informações Coletadas:
              </h4>
              <div className="space-y-2 text-sm">
                {dadosColetados.problema_relatado && (
                  <div>
                    <span className="font-medium">Problema:</span>
                    <span className="ml-2">{dadosColetados.problema_relatado}</span>
                  </div>
                )}
                {dadosColetados.categoria_problema && (
                  <div>
                    <span className="font-medium">Categoria:</span>
                    <span className="ml-2 capitalize">{dadosColetados.categoria_problema}</span>
                  </div>
                )}
                {dadosColetados.detalhes_problema && (
                  <div>
                    <span className="font-medium">Detalhes:</span>
                    <span className="ml-2">{dadosColetados.detalhes_problema}</span>
                  </div>
                )}
                {dadosColetados.historico_manutencao && (
                  <div>
                    <span className="font-medium">Última Manutenção:</span>
                    <span className="ml-2">{dadosColetados.historico_manutencao}</span>
                  </div>
                )}
                {dadosColetados.observacoes_finais && (
                  <div>
                    <span className="font-medium">Observações:</span>
                    <span className="ml-2">{dadosColetados.observacoes_finais}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center space-x-4">
              <motion.button
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 size={20} />
                <span>Finalizar e Criar OS</span>
              </motion.button>
              
              <motion.button
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 size={20} />
                <span>Editar Informações</span>
              </motion.button>
              
              <motion.button
                onClick={reiniciarCheckin}
                className="px-6 py-3 bg-slate-500 dark:bg-slate-800 hover:bg-slate-600 text-white rounded-lg shadow-md transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={20} />
                <span>Novo Check-in</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  /**
   * Calcula progresso baseado na etapa atual
   */
  function getProgresso() {
    const etapas = {
      'inicio': 0,
      'aguardando_resposta': 20,
      'aguardando_resposta_problema': 20,
      'coletando_detalhes': 40,
      'verificando_manutencao': 60,
      'finalizando_checkin': 80,
      'check_in_completo': 100
    };
    return etapas[etapaAtual] || 0;
  }
};

export default WizardCheckinIA;
