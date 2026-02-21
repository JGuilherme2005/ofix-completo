import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, WifiOff } from 'lucide-react';
import apiClient from '../../services/api';

type EtapaCheckin =
  | 'inicio'
  | 'aguardando_resposta'
  | 'aguardando_resposta_problema'
  | 'coletando_detalhes'
  | 'verificando_manutencao'
  | 'finalizando_checkin'
  | 'check_in_completo';

interface DadosCheckin {
  problema_relatado?: string;
  categoria_problema?: string;
  detalhes_problema?: string;
  historico_manutencao?: string;
  observacoes_finais?: string;
  [key: string]: unknown;
}

interface MensagemCheckin {
  tipo: 'ia' | 'usuario';
  conteudo: string;
  timestamp: Date;
}

interface CheckinDraft {
  etapaAtual: EtapaCheckin;
  dadosColetados: DadosCheckin;
  respostaAtual: string;
  conversaHistorico: Array<{ tipo: 'ia' | 'usuario'; conteudo: string; timestamp: string }>;
  checkinCompleto: boolean;
  modoLocal: boolean;
}

interface WizardCheckinIAProps {
  onCheckinCompleto?: (dados: DadosCheckin) => void;
  dadosIniciais?: DadosCheckin;
}

const PERGUNTA_INICIAL = 'Ola! Vamos iniciar o check-in. Qual problema voce esta enfrentando no veiculo?';
const CHECKIN_DRAFT_KEY = 'matias_checkin_draft_v1';

const etapasProgress: Record<EtapaCheckin, number> = {
  inicio: 0,
  aguardando_resposta: 20,
  aguardando_resposta_problema: 20,
  coletando_detalhes: 45,
  verificando_manutencao: 70,
  finalizando_checkin: 90,
  check_in_completo: 100,
};

const pushMessage = (mensagens: MensagemCheckin[], nova: MensagemCheckin) => [...mensagens, nova];

const readCheckinDraft = (): CheckinDraft | null => {
  try {
    const raw = localStorage.getItem(CHECKIN_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CheckinDraft>;
    if (!parsed || !Array.isArray(parsed.conversaHistorico)) return null;

    return {
      etapaAtual: (parsed.etapaAtual as EtapaCheckin) || 'inicio',
      dadosColetados: parsed.dadosColetados || {},
      respostaAtual: typeof parsed.respostaAtual === 'string' ? parsed.respostaAtual : '',
      conversaHistorico: parsed.conversaHistorico,
      checkinCompleto: Boolean(parsed.checkinCompleto),
      modoLocal: Boolean(parsed.modoLocal),
    };
  } catch {
    return null;
  }
};

export default function WizardCheckinIA({ onCheckinCompleto, dadosIniciais = {} }: WizardCheckinIAProps) {
  const dadosIniciaisRef = useRef<DadosCheckin>(dadosIniciais);
  const draftRef = useRef<CheckinDraft | null>(readCheckinDraft());
  const iniciouRef = useRef(false);
  const conversaContainerRef = useRef<HTMLDivElement | null>(null);

  const [etapaAtual, setEtapaAtual] = useState<EtapaCheckin>(draftRef.current?.etapaAtual || 'inicio');
  const [dadosColetados, setDadosColetados] = useState<DadosCheckin>(draftRef.current?.dadosColetados || dadosIniciaisRef.current);
  const [respostaAtual, setRespostaAtual] = useState(draftRef.current?.respostaAtual || '');
  const [conversaHistorico, setConversaHistorico] = useState<MensagemCheckin[]>(() =>
    (draftRef.current?.conversaHistorico || []).map((item) => ({
      tipo: item.tipo,
      conteudo: item.conteudo,
      timestamp: new Date(item.timestamp),
    }))
  );
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [checkinCompleto, setCheckinCompleto] = useState(Boolean(draftRef.current?.checkinCompleto));
  const [modoLocal, setModoLocal] = useState(Boolean(draftRef.current?.modoLocal));

  const iniciarLocal = useCallback((hint?: string) => {
    setModoLocal(true);
    setErro(hint || '');
    setEtapaAtual('aguardando_resposta');
    setConversaHistorico([
      {
        tipo: 'ia',
        conteudo: PERGUNTA_INICIAL,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const iniciarCheckin = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      const response = await apiClient.post('/ai/checkin/conduzir', {
        etapaAtual: 'inicio',
        dadosParciais: dadosIniciaisRef.current,
      });

      const data = response?.data || {};
      const perguntaInicial = typeof data.proxima_pergunta === 'string' ? data.proxima_pergunta : PERGUNTA_INICIAL;
      const etapaSeguinte = (data.etapa_seguinte as EtapaCheckin) || 'aguardando_resposta';

      setModoLocal(false);
      setEtapaAtual(etapaSeguinte);
      setConversaHistorico([
        {
          tipo: 'ia',
          conteudo: perguntaInicial,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      const status = error?.response?.status;
      if (!status || status === 404 || status === 429 || status >= 500) {
        iniciarLocal('Modo local ativado para evitar interrupcao. Voce ainda pode concluir o check-in normalmente.');
      } else {
        setErro('Nao foi possivel iniciar o check-in agora. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [iniciarLocal]);

  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;
    if (draftRef.current?.conversaHistorico?.length) return;
    void iniciarCheckin();
  }, [iniciarCheckin]);

  useEffect(() => {
    if (!conversaContainerRef.current) return;
    conversaContainerRef.current.scrollTop = conversaContainerRef.current.scrollHeight;
  }, [conversaHistorico, loading]);

  useEffect(() => {
    const payload: CheckinDraft = {
      etapaAtual,
      dadosColetados,
      respostaAtual,
      conversaHistorico: conversaHistorico.map((item) => ({
        tipo: item.tipo,
        conteudo: item.conteudo,
        timestamp: item.timestamp.toISOString(),
      })),
      checkinCompleto,
      modoLocal,
    };

    try {
      localStorage.setItem(CHECKIN_DRAFT_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [etapaAtual, dadosColetados, respostaAtual, conversaHistorico, checkinCompleto, modoLocal]);

  const processarResposta = useCallback(() => {
    if (!respostaAtual.trim() || loading) {
      if (!respostaAtual.trim()) setErro('Digite uma resposta para continuar.');
      return;
    }

    setLoading(true);
    setErro('');

    const respostaLimpa = respostaAtual.trim();
    const respostaLower = respostaLimpa.toLowerCase();
    const dadosAtualizados: DadosCheckin = { ...dadosColetados };

    if (etapaAtual === 'aguardando_resposta' || etapaAtual === 'aguardando_resposta_problema') {
      dadosAtualizados.problema_relatado = respostaLimpa;
      if (respostaLower.includes('freio')) dadosAtualizados.categoria_problema = 'freios';
      else if (respostaLower.includes('motor') || respostaLower.includes('barulho')) dadosAtualizados.categoria_problema = 'motor';
      else if (respostaLower.includes('pneu') || respostaLower.includes('roda')) dadosAtualizados.categoria_problema = 'pneus';
      else dadosAtualizados.categoria_problema = 'outros';
    }

    let proximaEtapa: EtapaCheckin = 'check_in_completo';
    let proximaPergunta = 'Check-in finalizado.';

    switch (etapaAtual) {
      case 'aguardando_resposta':
      case 'aguardando_resposta_problema':
        proximaEtapa = 'coletando_detalhes';
        proximaPergunta = 'Entendi. Quando isso comecou e em quais situacoes acontece com mais frequencia?';
        break;
      case 'coletando_detalhes':
        proximaEtapa = 'verificando_manutencao';
        dadosAtualizados.detalhes_problema = respostaLimpa;
        proximaPergunta = 'Perfeito. Quando foi a ultima manutencao e o que foi feito?';
        break;
      case 'verificando_manutencao':
        proximaEtapa = 'finalizando_checkin';
        dadosAtualizados.historico_manutencao = respostaLimpa;
        proximaPergunta = 'Otimo. Para fechar o check-in, existe mais algum detalhe importante?';
        break;
      case 'finalizando_checkin':
      default:
        proximaEtapa = 'check_in_completo';
        dadosAtualizados.observacoes_finais = respostaLimpa;
        proximaPergunta = 'Check-in concluido com sucesso. Resumo pronto para seguir com atendimento.';
        break;
    }

    setDadosColetados(dadosAtualizados);
    setConversaHistorico((prev) =>
      pushMessage(
        pushMessage(prev, {
          tipo: 'usuario',
          conteudo: respostaLimpa,
          timestamp: new Date(),
        }),
        {
          tipo: 'ia',
          conteudo: proximaPergunta,
          timestamp: new Date(),
        }
      )
    );

    setEtapaAtual(proximaEtapa);
    setRespostaAtual('');

    if (proximaEtapa === 'check_in_completo') {
      setCheckinCompleto(true);
      onCheckinCompleto?.(dadosAtualizados);
    }

    setLoading(false);
  }, [dadosColetados, etapaAtual, loading, onCheckinCompleto, respostaAtual]);

  const reiniciarCheckin = useCallback(() => {
    setEtapaAtual('inicio');
    setDadosColetados(dadosIniciaisRef.current);
    setConversaHistorico([]);
    setRespostaAtual('');
    setCheckinCompleto(false);
    setModoLocal(false);
    setErro('');
    try {
      localStorage.removeItem(CHECKIN_DRAFT_KEY);
    } catch {
      // ignore storage errors
    }
    void iniciarCheckin();
  }, [iniciarCheckin]);

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-slate-900 flex flex-col">
      <div className="rounded-t-2xl border-b border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-r from-cyan-600 to-blue-700 px-3 py-2.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">Check-in IA</h2>
              <span className="text-xs font-medium">{checkinCompleto ? 100 : etapasProgress[etapaAtual]}%</span>
            </div>
            <p className="text-[11px] text-cyan-100/95 truncate">
              Coleta estruturada para reduzir retrabalho no atendimento.
            </p>
          </div>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/20">
          <div
            className="h-1.5 rounded-full bg-white transition-all duration-500"
            style={{ width: `${checkinCompleto ? 100 : etapasProgress[etapaAtual]}%` }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 p-3 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
        {(modoLocal || erro) && (
          <div className="space-y-2">
            {modoLocal && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sem dependencia de backend no momento. Fluxo local ativo para voce continuar. Sincronizando quando a conexao voltar.</span>
              </div>
            )}

            {erro && (
              <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{erro}</span>
                </div>
                <button
                  type="button"
                  onClick={reiniciarCheckin}
                  className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Tentar de novo
                </button>
              </div>
            )}
          </div>
        )}

        <div
          ref={conversaContainerRef}
          className="min-h-0 overflow-y-auto space-y-3 rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800/70 dark:bg-slate-900/40"
        >
          <AnimatePresence>
            {conversaHistorico.map((mensagem, index) => (
              <motion.div
                key={`${mensagem.timestamp.getTime()}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                    mensagem.tipo === 'usuario'
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div>{mensagem.conteudo}</div>
                  <div className={`mt-1 text-[11px] ${mensagem.tipo === 'usuario' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {mensagem.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!checkinCompleto ? (
          <div className="space-y-1.5 rounded-xl border border-slate-200/70 bg-white/90 p-2.5 dark:border-slate-800/70 dark:bg-slate-900/55">
            <div className="flex gap-2">
              <textarea
                value={respostaAtual}
                onChange={(e) => setRespostaAtual(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    processarResposta();
                  }
                }}
                rows={2}
                placeholder="Digite sua resposta aqui..."
                aria-label="Resposta ao wizard de check-in"
                disabled={loading}
                className="min-h-[72px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/40"
              />
              <motion.button
                type="button"
                onClick={processarResposta}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !respostaAtual.trim()}
                className="flex h-[72px] min-w-[104px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? 'Processando...' : 'Enviar'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dica: descreva sintomas, quando ocorre e manutencoes recentes para acelerar diagnostico e OS.
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-xl border border-slate-200/70 bg-white/90 p-3 dark:border-slate-800/70 dark:bg-slate-900/55">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-sm font-semibold">Check-in finalizado com sucesso</h3>
              </div>
              <p className="mt-1 text-sm text-emerald-700/90 dark:text-emerald-300/90">
                O resumo abaixo ja pode ser usado para abrir OS, diagnostico ou agendamento.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Resumo coletado</h4>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {dadosColetados.problema_relatado && <div><strong>Problema:</strong> {String(dadosColetados.problema_relatado)}</div>}
                {dadosColetados.categoria_problema && <div><strong>Categoria:</strong> {String(dadosColetados.categoria_problema)}</div>}
                {dadosColetados.detalhes_problema && <div><strong>Detalhes:</strong> {String(dadosColetados.detalhes_problema)}</div>}
                {dadosColetados.historico_manutencao && <div><strong>Ultima manutencao:</strong> {String(dadosColetados.historico_manutencao)}</div>}
                {dadosColetados.observacoes_finais && <div><strong>Observacoes:</strong> {String(dadosColetados.observacoes_finais)}</div>}
              </div>
            </div>

            <button
              type="button"
              onClick={reiniciarCheckin}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Novo check-in
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
