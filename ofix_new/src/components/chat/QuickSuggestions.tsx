import type { RefObject } from 'react';
import { CalendarClock, Calculator, Search, Settings2, Boxes } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import logger from '../../utils/logger';

const QUICK_SUGGESTION_CLASS: Record<string, string> = {
  blue: 'border-cyan-300/75 bg-cyan-50/88 text-cyan-800 hover:bg-cyan-100/85 dark:border-cyan-900/55 dark:bg-cyan-950/32 dark:text-cyan-200 dark:hover:bg-cyan-950/48',
  green: 'border-emerald-300/75 bg-emerald-50/88 text-emerald-800 hover:bg-emerald-100/85 dark:border-emerald-900/55 dark:bg-emerald-950/32 dark:text-emerald-200 dark:hover:bg-emerald-950/48',
  indigo: 'border-indigo-300/75 bg-indigo-50/88 text-indigo-800 hover:bg-indigo-100/85 dark:border-indigo-900/55 dark:bg-indigo-950/32 dark:text-indigo-200 dark:hover:bg-indigo-950/48',
  amber: 'border-amber-300/75 bg-amber-50/88 text-amber-800 hover:bg-amber-100/85 dark:border-amber-900/55 dark:bg-amber-950/32 dark:text-amber-200 dark:hover:bg-amber-950/48',
  violet: 'border-violet-300/75 bg-violet-50/88 text-violet-800 hover:bg-violet-100/85 dark:border-violet-900/55 dark:bg-violet-950/32 dark:text-violet-200 dark:hover:bg-violet-950/48',
};

const SUGGESTIONS: Array<{
  icon: LucideIcon;
  text: string;
  command: string;
  placeholder: string;
  mensagemGuia: string;
  color: keyof typeof QUICK_SUGGESTION_CLASS;
}> = [
  {
    icon: Search,
    text: 'Buscar cliente',
    command: 'buscar_cliente',
    placeholder: 'Digite nome, CPF ou telefone...',
    mensagemGuia:
      'Claro. Me diga nome, CPF ou telefone do cliente. Exemplos: Joao Silva, 123.456.789-00 ou (11) 98765-4321.',
    color: 'blue',
  },
  {
    icon: CalendarClock,
    text: 'Agendar servico',
    command: 'agendar_servico',
    placeholder: 'Ex: Troca de oleo para amanha as 14h',
    mensagemGuia:
      'Vamos agendar. Informe servico, data e cliente. Dica: use /agendar + detalhes para abrir a aba de agenda com contexto.',
    color: 'green',
  },
  {
    icon: Settings2,
    text: 'Status da OS',
    command: 'status_os',
    placeholder: 'Ex: OS 1234 ou cliente Joao Silva',
    mensagemGuia: 'Vou consultar o status. Informe numero da OS ou nome do cliente.',
    color: 'indigo',
  },
  {
    icon: Boxes,
    text: 'Consultar pecas',
    command: 'consultar_pecas',
    placeholder: 'Ex: filtro de oleo ou codigo ABC123',
    mensagemGuia: 'Vou buscar as pecas. Informe nome da peca ou codigo.',
    color: 'amber',
  },
  {
    icon: Calculator,
    text: 'Calcular orcamento',
    command: 'calcular_orcamento',
    placeholder: 'Ex: troca de oleo + filtro',
    mensagemGuia: 'Vou montar o orcamento. Informe servicos e pecas desejadas.',
    color: 'violet',
  },
];

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
    <div className="shrink-0 border-t border-cyan-200/55 bg-gradient-to-r from-white/80 via-cyan-50/45 to-blue-50/35 px-4 py-2.5 dark:border-cyan-900/35 dark:from-slate-900/58 dark:via-slate-900/45 dark:to-cyan-950/22 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Atalhos operacionais
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
        {SUGGESTIONS.map((sug) => {
          const Icon = sug.icon;
          return (
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
              className={`flex flex-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 motion-reduce:transition-none hover:scale-[1.02] motion-reduce:hover:scale-100 hover:shadow-sm active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100 ${QUICK_SUGGESTION_CLASS[sug.color]}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{sug.text}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        Dica: use <code className="rounded bg-slate-200/70 px-1 py-0.5 dark:bg-slate-800">/agendar</code> para levar texto do chat direto para Agendamento.
      </p>
    </div>
  );
}
