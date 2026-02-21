import type { RefObject } from 'react';
import { Bot } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';
import type { ChatMessage, InlineAction, SelectionOption } from '../../types/ai.types';

interface ChatMessageListProps {
  conversas: ChatMessage[];
  carregando: boolean;
  chatContainerRef: RefObject<HTMLDivElement>;
  formatarFonteResposta: (metadata?: Record<string, unknown>) => string;
  onAction: (action: InlineAction) => void;
  onSelectOption: (option: SelectionOption) => void;
  onAbrirCadastro: (dados: Record<string, unknown>) => void;
  onSelectCliente: (numero: number) => void;
}

export default function ChatMessageList({
  conversas,
  carregando,
  chatContainerRef,
  formatarFonteResposta,
  onAction,
  onSelectOption,
  onAbrirCadastro,
  onSelectCliente,
}: ChatMessageListProps) {
  return (
    <div
      ref={chatContainerRef}
      role="log"
      aria-live="polite"
      aria-label="Historico de conversas com o assistente Matias"
      className="relative flex-1 min-h-0 min-w-0 overflow-y-auto p-4 sm:p-5 space-y-4 animate-in fade-in-0 duration-300 [scrollbar-width:thin] [scrollbar-color:theme(colors.cyan.300)_transparent] dark:[scrollbar-color:theme(colors.cyan.900)_transparent]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-50/45 to-transparent dark:from-cyan-950/18" />

      {conversas.map((conversa) => (
        <ChatMessageItem
          key={conversa.id}
          conversa={conversa}
          formatarFonteResposta={formatarFonteResposta}
          onAction={onAction}
          onSelectOption={onSelectOption}
          onAbrirCadastro={onAbrirCadastro}
          onSelectCliente={onSelectCliente}
        />
      ))}

      {carregando && (
        <div className="flex justify-start gap-3 animate-fade-in">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 shadow-[0_10px_24px_-14px_rgba(37,99,235,0.85)]">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="rounded-2xl border border-cyan-200/65 bg-gradient-to-r from-white/88 to-cyan-50/70 px-4 py-3 text-slate-700 shadow-sm dark:border-cyan-900/35 dark:from-slate-900/68 dark:to-cyan-950/24 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm font-medium">Matias esta preparando a resposta...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
