import type { RefObject } from 'react';
import logger from '../../utils/logger';

const QUICK_SUGGESTION_CLASS: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900/60 dark:hover:bg-blue-950/60',
  green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900/50 dark:hover:bg-green-950/50',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/35 dark:text-purple-200 dark:border-purple-900/50 dark:hover:bg-purple-950/55',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-900/50 dark:hover:bg-orange-950/50',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-200 dark:border-cyan-900/50 dark:hover:bg-cyan-950/50',
};

const SUGGESTIONS = [
  {
    icon: '🔍',
    text: 'Buscar cliente',
    command: 'buscar_cliente',
    placeholder: 'Digite nome, CPF ou telefone...',
    mensagemGuia:
      '👤 Claro! Me diga o nome, CPF ou telefone do cliente que voce procura.\n\nExemplos:\n- Joao Silva\n- 123.456.789-00\n- (11) 98765-4321',
    color: 'blue',
  },
  {
    icon: '📅',
    text: 'Agendar servico',
    command: 'agendar_servico',
    placeholder: 'Ex: Troca de oleo para amanha as 14h',
    mensagemGuia:
      '📅 Vou te ajudar a agendar! Me diga:\n- Qual servico?\n- Para quando?\n- Qual cliente?\n\nDica: use /agendar + detalhes para abrir o fluxo de agenda com contexto.',
    color: 'green',
  },
  {
    icon: '🔧',
    text: 'Status da OS',
    command: 'status_os',
    placeholder: 'Ex: OS 1234 ou cliente Joao Silva',
    mensagemGuia: '🔧 Vou consultar o status! Me informe:\n- Numero da OS, ou\n- Nome do cliente',
    color: 'purple',
  },
  {
    icon: '📦',
    text: 'Consultar pecas',
    command: 'consultar_pecas',
    placeholder: 'Ex: filtro de oleo ou codigo ABC123',
    mensagemGuia: '📦 Vou buscar as pecas! Me diga:\n- Nome da peca, ou\n- Codigo da peca',
    color: 'orange',
  },
  {
    icon: '💰',
    text: 'Calcular orcamento',
    command: 'calcular_orcamento',
    placeholder: 'Ex: troca de oleo + filtro',
    mensagemGuia: '💰 Vou calcular o orcamento! Me diga:\n- Quais servicos?\n- Quais pecas?',
    color: 'cyan',
  },
] as const;

interface QuickSuggestionsProps {
  contextoAtivo: string | null;
  carregando: boolean;
  inputRef: RefObject<HTMLTextAreaElement>;
  onSetContextoAtivo: (v: string | null) => void;
  setMensagem: (v: string) => void;
  setInputWarning: (v: string) => void;
  setInputHint: (v: string) => void;
  onAddMessage: (msg: {
    id: number;
    tipo: string;
    conteudo: string;
    timestamp: string;
  }) => void;
}

export default function QuickSuggestions({
  contextoAtivo,
  carregando,
  inputRef,
  onSetContextoAtivo,
  setMensagem,
  setInputWarning,
  setInputHint,
  onAddMessage,
}: QuickSuggestionsProps) {
  return (
    <div className="border-t border-slate-200/60 bg-slate-50 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-900/40 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Sugestoes rapidas
        </div>
        {contextoAtivo && (
          <button
            type="button"
            onClick={() => {
              onSetContextoAtivo(null);
              setInputWarning('');
              setInputHint('');
              inputRef.current?.focus();
            }}
            className="text-[11px] font-medium text-slate-500 underline decoration-slate-300/60 underline-offset-4 hover:text-slate-800 hover:decoration-slate-500/70 dark:text-slate-400 dark:decoration-slate-600/60 dark:hover:text-slate-100"
          >
            Limpar contexto
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug.text}
            type="button"
            onClick={() => {
              setMensagem('');
              if (inputRef.current) {
                inputRef.current.placeholder = sug.placeholder;
                inputRef.current.focus();
              }
              onSetContextoAtivo(sug.command);
              onAddMessage({
                id: Date.now(),
                tipo: 'sistema',
                conteudo: sug.mensagemGuia,
                timestamp: new Date().toISOString(),
              });
              logger.info('Contexto ativado', { contexto: sug.command });
            }}
            disabled={carregando}
            className={`flex flex-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${QUICK_SUGGESTION_CLASS[sug.color] || QUICK_SUGGESTION_CLASS.blue}`}
          >
            <span aria-hidden="true">{sug.icon}</span>
            <span className="whitespace-nowrap">{sug.text}</span>
          </button>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Dica: comando rapido <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">/agendar</code> leva o texto do chat direto para a aba Agendamento.
      </p>
    </div>
  );
}
