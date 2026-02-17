// @ts-nocheck
import { User, Bot, CheckCircle, AlertCircle, MessageSquare, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import ActionButtons from './ActionButtons';
import SelectionOptions from './SelectionOptions';

// ── Helpers ──────────────────────────────────
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const formatMatiasMessageHtml = (value: string) => {
  const escaped = escapeHtml(value);
  const withFormatting = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\n/g, '<br />');
  return DOMPurify.sanitize(withFormatting, { ALLOWED_TAGS: ['br', 'strong', 'code', 'a'], ALLOWED_ATTR: ['href', 'target', 'rel'] });
};

// ── Avatar ───────────────────────────────────
function MessageAvatar({ tipo }: { tipo: string }) {
  const gradientMap: Record<string, string> = {
    confirmacao: 'from-green-500 to-emerald-500',
    sistema: 'from-green-500 to-emerald-500',
    erro: 'from-red-500 to-orange-500',
    pergunta: 'from-yellow-500 to-amber-500',
    cadastro: 'from-purple-500 to-indigo-500',
    alerta: 'from-purple-500 to-indigo-500',
    consulta_cliente: 'from-cyan-500 to-blue-400',
  };
  const gradient = gradientMap[tipo] || 'from-blue-500 to-purple-500';

  const iconMap: Record<string, any> = {
    confirmacao: CheckCircle,
    erro: AlertCircle,
    pergunta: MessageSquare,
    sistema: Wrench,
    consulta_cliente: User,
  };
  const Icon = iconMap[tipo] || Bot;

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm matias-animate-bounce-in bg-gradient-to-br ${gradient}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

// ── Bubble CSS ───────────────────────────────
const bubbleClass: Record<string, string> = {
  usuario: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  confirmacao: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:text-green-100 dark:border-green-900/40',
  sistema: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:text-green-100 dark:border-green-900/40',
  erro: 'bg-gradient-to-r from-red-50 to-orange-50 text-red-800 border border-red-200 dark:from-red-950/30 dark:to-orange-950/30 dark:text-red-100 dark:border-red-900/40',
  pergunta: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border border-yellow-200 dark:from-yellow-950/25 dark:to-amber-950/25 dark:text-yellow-100 dark:border-yellow-900/35',
  cadastro: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200 dark:from-purple-950/30 dark:to-indigo-950/30 dark:text-purple-100 dark:border-purple-900/40',
  alerta: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200 dark:from-purple-950/30 dark:to-indigo-950/30 dark:text-purple-100 dark:border-purple-900/40',
  consulta_cliente: 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 border border-cyan-200 dark:from-cyan-950/25 dark:to-blue-950/25 dark:text-cyan-100 dark:border-cyan-900/40',
};
const defaultBubble = 'bg-white text-slate-900 border border-slate-200 dark:bg-slate-950/30 dark:text-slate-100 dark:border-slate-800/60';

// ── Component ────────────────────────────────
interface ChatMessageItemProps {
  conversa: any;
  formatarFonteResposta: (metadata: any) => string;
  onAction: (action: any) => void;
  onSelectOption: (option: any) => void;
  onAbrirCadastro: (dados: any) => void;
  onSelectCliente: (numero: number) => void;
}

export default function ChatMessageItem({
  conversa, formatarFonteResposta,
  onAction, onSelectOption, onAbrirCadastro, onSelectCliente,
}: ChatMessageItemProps) {
  const isUser = conversa.tipo === 'usuario';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar (não-usuário) */}
      {!isUser && <MessageAvatar tipo={conversa.tipo} />}

      {/* Bolha */}
      <div className={`max-w-2xl rounded-2xl px-4 py-3 shadow-sm matias-animate-message-slide transition-all duration-200 hover:shadow-md ${bubbleClass[conversa.tipo] || defaultBubble}`}>
        {/* Conteúdo */}
        <div className="text-sm leading-relaxed">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{conversa.conteudo}</div>
          ) : (
            <div
              className="break-words [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-slate-900/10 dark:[&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5"
              dangerouslySetInnerHTML={{ __html: formatMatiasMessageHtml(String(conversa.conteudo || '')) }}
            />
          )}
        </div>

        {/* Metadata badges */}
        {!isUser && conversa.metadata?.processed_by && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              Fonte: {formatarFonteResposta(conversa.metadata)}
            </span>
            {typeof conversa.metadata.processing_time_ms === 'number' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{conversa.metadata.processing_time_ms}ms</span>
            )}
            {conversa.metadata.run_id && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">run: {String(conversa.metadata.run_id).slice(0, 8)}</span>
            )}
            {conversa.metadata.cached && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">cache</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        {!isUser && conversa.metadata?.actions && (
          <ActionButtons actions={conversa.metadata.actions} onAction={onAction} />
        )}

        {/* Selection options */}
        {!isUser && conversa.metadata?.options && (
          <SelectionOptions options={conversa.metadata.options} title={conversa.metadata.selectionTitle || 'Escolha uma opção:'} onSelect={onSelectOption} />
        )}

        {/* Client selection buttons */}
        {conversa.tipo === 'consulta_cliente' && conversa.metadata?.clientes && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">Digite o número do cliente para selecionar:</p>
            <div className="space-y-2">
              {conversa.metadata.clientes.map((cliente, index) => (
                <button
                  key={cliente.id}
                  onClick={() => onSelectCliente(index + 1)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-xs font-medium text-slate-600 group-hover:text-blue-600">{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 group-hover:text-blue-900">{cliente.nomeCompleto}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cliente.telefone || 'Sem telefone'}</div>
                      {cliente.veiculos?.length > 0 && (
                        <div className="text-xs text-slate-400 mt-1">Veículos: {cliente.veiculos.map(v => `${v.marca} ${v.modelo}`).join(', ')}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cadastro button */}
        {(conversa.tipo === 'cadastro' || conversa.tipo === 'alerta') && conversa.metadata?.dadosExtraidos && (
          <Button
            onClick={() => onAbrirCadastro(conversa.metadata.dadosExtraidos)}
            className="mt-3 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            📝 Abrir Formulário de Cadastro
          </Button>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-2 opacity-60 ${isUser ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          {new Date(conversa.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Avatar (usuário) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
