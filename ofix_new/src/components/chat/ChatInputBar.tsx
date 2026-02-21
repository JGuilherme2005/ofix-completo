import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Loader2, AlertCircle } from 'lucide-react';
import { AI_CONFIG } from '../../constants/aiPageConfig';

interface ChatInputBarProps {
  mensagem: string;
  setMensagem: (v: string) => void;
  onEnviar: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onValidateInput: (v: string) => void;
  carregando: boolean;
  podeInteragir: boolean;
  gravando: boolean;
  falando: boolean;
  contextoAtivo: string | null;
  inputWarning: string;
  inputHint: string;
  statusConexao: string;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onIniciarGravacao: () => void;
  onPararGravacao: () => void;
}

export default function ChatInputBar({
  mensagem, setMensagem, onEnviar, onKeyDown, onValidateInput,
  carregando, podeInteragir, gravando, falando,
  contextoAtivo, inputWarning, inputHint, statusConexao,
  inputRef, onIniciarGravacao, onPararGravacao,
}: ChatInputBarProps) {
  const getPlaceholder = () => {
    if (gravando) return '🎤 Gravando...';
    if (falando) return 'Matias está falando...';
    if (contextoAtivo) {
      switch (contextoAtivo) {
        case 'buscar_cliente': return 'Digite nome, CPF ou telefone...';
        case 'agendar_servico': return 'Ex: Troca de óleo para amanhã às 14h';
        case 'status_os': return 'Ex: OS 1234 ou cliente João Silva';
        case 'consultar_pecas': return 'Ex: filtro de óleo ou código ABC123';
        case 'calcular_orcamento': return 'Ex: troca de óleo + filtro';
        default: return 'Digite sua mensagem...';
      }
    }
    return 'Digite sua pergunta ou solicitação...';
  };

  return (
    <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-4 bg-white/95 dark:bg-slate-950/20">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Textarea
            ref={inputRef}
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              onValidateInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={onKeyDown}
            placeholder={getPlaceholder()}
            disabled={carregando || !podeInteragir || gravando}
            rows={1}
            aria-label="Mensagem para o assistente Matias"
            className="min-h-[40px] max-h-[120px] resize-none border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 rounded-xl transition-all duration-200 shadow-sm focus:shadow-md"
          />
          <div className={`text-xs mt-1 ${mensagem.length > AI_CONFIG.CHAT.MAX_MESSAGE_LENGTH ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}>
            {mensagem.length}/{AI_CONFIG.CHAT.MAX_MESSAGE_LENGTH} caracteres
          </div>
          {inputWarning && (
            <div className="px-4 py-1 text-xs text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-950/30 rounded" role="alert">⚠️ {inputWarning}</div>
          )}
          {inputHint && (
            <div className="px-4 py-1 text-xs text-green-600 dark:text-green-200 bg-green-50 dark:bg-green-950/30 rounded">{inputHint}</div>
          )}
        </div>

        <Button
          onClick={gravando ? onPararGravacao : onIniciarGravacao}
          variant="outline"
          size="sm"
          disabled={carregando || falando}
          className={`rounded-xl ${gravando ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 animate-pulse' : falando ? 'bg-blue-50 border-blue-300 text-blue-400 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          aria-label={gravando ? 'Parar gravação' : falando ? 'Aguardar o assistente terminar de falar' : 'Gravar mensagem de voz'}
          title={gravando ? 'Parar gravação (Clique ou pressione ESC)' : falando ? 'Aguarde o assistente terminar de falar' : 'Gravar mensagem de voz (Clique para começar)'}
        >
          {gravando ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>

        <Button
          onClick={onEnviar}
          disabled={!mensagem.trim() || carregando || !podeInteragir}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl px-6"
          aria-label={carregando ? 'Enviando mensagem' : 'Enviar mensagem'}
          title="Enviar mensagem"
        >
          {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {statusConexao !== 'conectado' && (
        <div className={`mt-2 text-xs flex items-center gap-1 ${statusConexao === 'erro' ? 'text-red-600 dark:text-red-200' : 'text-amber-600 dark:text-amber-200'}`} aria-live="assertive">
          <AlertCircle className="w-3 h-3" />
          {statusConexao === 'local' ? 'Agno offline: modo local ativo (respostas locais).' : statusConexao === 'conectando' ? 'Conectando ao Matias...' : 'Sem conexao com o agente. Clique em Reconectar.'}
        </div>
      )}
    </div>
  );
}
