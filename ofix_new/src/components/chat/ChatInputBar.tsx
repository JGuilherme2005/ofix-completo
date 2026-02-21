import type { KeyboardEvent, RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Loader2, AlertCircle } from 'lucide-react';
import { AI_CONFIG } from '../../constants/aiPageConfig';

interface ChatInputBarProps {
  mensagem: string;
  setMensagem: (v: string) => void;
  onEnviar: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onValidateInput: (v: string) => void;
  carregando: boolean;
  podeInteragir: boolean;
  gravando: boolean;
  falando: boolean;
  contextoAtivo: string | null;
  inputWarning: string;
  inputHint: string;
  statusConexao: string;
  inputRef: RefObject<HTMLTextAreaElement>;
  onIniciarGravacao: () => void;
  onPararGravacao: () => void;
}

export default function ChatInputBar({
  mensagem,
  setMensagem,
  onEnviar,
  onKeyDown,
  onValidateInput,
  carregando,
  podeInteragir,
  gravando,
  falando,
  contextoAtivo,
  inputWarning,
  inputHint,
  statusConexao,
  inputRef,
  onIniciarGravacao,
  onPararGravacao,
}: ChatInputBarProps) {
  const getPlaceholder = () => {
    if (gravando) return 'Gravando audio...';
    if (falando) return 'Matias esta respondendo...';
    if (contextoAtivo) {
      switch (contextoAtivo) {
        case 'buscar_cliente':
          return 'Digite nome, CPF ou telefone...';
        case 'agendar_servico':
          return 'Ex: Troca de oleo para amanha as 14h';
        case 'status_os':
          return 'Ex: OS 1234 ou cliente Joao Silva';
        case 'consultar_pecas':
          return 'Ex: filtro de oleo ou codigo ABC123';
        case 'calcular_orcamento':
          return 'Ex: troca de oleo + filtro';
        default:
          return 'Digite sua mensagem...';
      }
    }
    return 'Digite sua pergunta ou solicitacao...';
  };

  return (
    <div className="sticky bottom-0 z-20 relative shrink-0 border-t border-cyan-200/70 bg-gradient-to-r from-white/92 via-cyan-50/50 to-blue-50/45 p-3 sm:p-4 backdrop-blur-md dark:border-cyan-900/40 dark:from-slate-900/72 dark:via-slate-900/60 dark:to-cyan-950/32">
      <div className="pointer-events-none absolute -bottom-20 -inset-x-10 h-32 bg-cyan-400/8 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative flex items-end gap-2.5 sm:gap-3">
        <div className="flex-1">
          <Textarea
            ref={inputRef}
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              onValidateInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={onKeyDown}
            placeholder={getPlaceholder()}
            disabled={carregando || !podeInteragir || gravando}
            rows={1}
            aria-label="Mensagem para o assistente Matias"
            className="min-h-[44px] max-h-[120px] resize-none rounded-2xl border-cyan-200/70 bg-white/90 text-[15px] leading-6 text-slate-800 shadow-[0_10px_24px_-16px_rgba(14,116,144,0.6)] focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-300/35 disabled:opacity-100 disabled:bg-slate-100 dark:border-cyan-900/40 dark:bg-slate-950/55 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 dark:focus-visible:ring-cyan-800/35"
          />

          <div className={`mt-1 text-[11px] ${mensagem.length > AI_CONFIG.CHAT.MAX_MESSAGE_LENGTH ? 'text-red-600 dark:text-red-300' : 'text-slate-500 dark:text-slate-400'}`}>
            {mensagem.length}/{AI_CONFIG.CHAT.MAX_MESSAGE_LENGTH} caracteres
          </div>

          {inputWarning && (
            <div className="mt-1 rounded-md border border-red-200/80 bg-red-50/90 px-3 py-1 text-[11px] text-red-700 dark:border-red-900/40 dark:bg-red-950/35 dark:text-red-200" role="alert">
              {inputWarning}
            </div>
          )}

          {inputHint && (
            <div className="mt-1 rounded-md border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-[11px] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-200">
              {inputHint}
            </div>
          )}
        </div>

        <Button
          onClick={gravando ? onPararGravacao : onIniciarGravacao}
          variant="outline"
          size="sm"
          disabled={carregando || falando}
          className={`h-11 w-11 rounded-2xl border shadow-sm ${
            gravando
              ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/45 dark:bg-rose-950/30 dark:text-rose-300'
              : falando
                ? 'border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                : 'border-cyan-200/80 bg-white/88 text-cyan-700 hover:bg-white dark:border-cyan-900/45 dark:bg-slate-900/55 dark:text-cyan-200 dark:hover:bg-slate-900'
          }`}
          aria-label={gravando ? 'Parar gravacao' : falando ? 'Aguardar o assistente terminar de falar' : 'Gravar mensagem de voz'}
          title={gravando ? 'Parar gravacao' : falando ? 'Aguarde o assistente terminar de falar' : 'Gravar mensagem de voz'}
        >
          {gravando ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <Button
          onClick={onEnviar}
          disabled={!mensagem.trim() || carregando || !podeInteragir}
          className="h-11 min-w-[82px] rounded-2xl px-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_12px_28px_-16px_rgba(37,99,235,0.95)] hover:from-cyan-500 hover:to-blue-500"
          aria-label={carregando ? 'Enviando mensagem' : 'Enviar mensagem'}
          title="Enviar mensagem"
        >
          {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {statusConexao !== 'conectado' && (
        <div
          className={`relative mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] ${
            statusConexao === 'erro'
              ? 'border-red-200/90 bg-red-50/90 text-red-700 dark:border-red-900/45 dark:bg-red-950/35 dark:text-red-200'
              : 'border-amber-200/90 bg-amber-50/90 text-amber-700 dark:border-amber-900/45 dark:bg-amber-950/35 dark:text-amber-200'
          }`}
          aria-live="assertive"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {statusConexao === 'local'
            ? 'Matias em modo local. Sincronizacao sera retomada automaticamente.'
            : statusConexao === 'conectando'
              ? 'Conectando ao Matias...'
              : 'Sem conexao com o agente. Tente reconectar.'}
        </div>
      )}
    </div>
  );
}
