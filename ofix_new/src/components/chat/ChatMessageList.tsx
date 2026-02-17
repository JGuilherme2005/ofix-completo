// @ts-nocheck
import { Bot, Loader2 } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessageListProps {
  conversas: any[];
  carregando: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  formatarFonteResposta: (metadata: any) => string;
  onAction: (action: any) => void;
  onSelectOption: (option: any) => void;
  onAbrirCadastro: (dados: any) => void;
  onSelectCliente: (numero: number) => void;
}

export default function ChatMessageList({
  conversas, carregando, chatContainerRef,
  formatarFonteResposta,
  onAction, onSelectOption, onAbrirCadastro, onSelectCliente,
}: ChatMessageListProps) {
  return (
    <div
      ref={chatContainerRef}
      role="log"
      aria-live="polite"
      aria-label="Histórico de conversas com o assistente Matias"
      className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 sm:p-5 space-y-4 matias-animate-fade-in"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
    >
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

      {/* Loading indicator */}
      {carregando && (
        <div className="flex gap-3 justify-start animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 dark:from-slate-900/60 dark:to-slate-900/40 dark:border-slate-800/60 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Matias está pensando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
