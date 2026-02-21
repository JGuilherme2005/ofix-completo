import { User, Bot, CheckCircle, AlertCircle, MessageSquare, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import ActionButtons from './ActionButtons';
import SelectionOptions from './SelectionOptions';
import type {
  ChatMessage,
  ChatMessageMetadata,
  ClienteExtraido,
  InlineAction,
  SelectionOption,
} from '../../types/ai.types';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const technicalTokenRegex = /\b[A-Z]{3}-\d{4}\b|\b[A-Z]{3}\d[A-Z]\d{2}\b|\b[A-HJ-NPR-Z0-9]{17}\b|\bOS[\s#:-]*\d{2,8}\b|#\d{3,10}\b|\brun[:\s-]*[a-f0-9]{8,32}\b/gi;
const technicalTokenExactRegex = new RegExp(`^(?:${technicalTokenRegex.source})$`, 'i');

const highlightTechnicalTokens = (html: string) => {
  const parts = html.split(/(<[^>]+>)/g);
  let insideCode = false;

  return parts
    .map((part) => {
      if (!part) return part;

      if (part.startsWith('<')) {
        if (/^<code\b/i.test(part)) insideCode = true;
        if (/^<\/code>/i.test(part)) insideCode = false;
        return part;
      }

      if (insideCode) return part;
      return part.replace(technicalTokenRegex, '<code class="matias-tech-id">$&</code>');
    })
    .join('');
};

const formatMatiasMessageHtml = (value: string) => {
  const escaped = escapeHtml(value);
  const withFormatting = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\n/g, '<br />');
  const withTechnical = highlightTechnicalTokens(withFormatting);

  return DOMPurify.sanitize(withTechnical, {
    ALLOWED_TAGS: ['br', 'strong', 'code', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

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

  const iconMap: Record<string, LucideIcon> = {
    confirmacao: CheckCircle,
    erro: AlertCircle,
    pergunta: MessageSquare,
    sistema: Wrench,
    consulta_cliente: User,
  };

  const gradient = gradientMap[tipo] || 'from-blue-500 to-purple-500';
  const Icon = iconMap[tipo] || Bot;

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm animate-in zoom-in-50 duration-500 bg-gradient-to-br ${gradient}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

const bubbleClass: Record<string, string> = {
  usuario: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-400/30 shadow-[0_10px_26px_-16px_rgba(37,99,235,0.9)]',
  confirmacao:
    'bg-gradient-to-r from-emerald-50/92 to-cyan-50/88 text-emerald-900 border border-emerald-200/80 dark:from-emerald-950/38 dark:to-cyan-950/28 dark:text-emerald-100 dark:border-emerald-900/45',
  sistema:
    'bg-gradient-to-r from-emerald-50/92 to-cyan-50/88 text-emerald-900 border border-emerald-200/80 dark:from-emerald-950/38 dark:to-cyan-950/28 dark:text-emerald-100 dark:border-emerald-900/45',
  erro:
    'bg-gradient-to-r from-red-50/92 to-orange-50/90 text-red-800 border border-red-200/85 dark:from-red-950/38 dark:to-orange-950/30 dark:text-red-100 dark:border-red-900/45',
  pergunta:
    'bg-gradient-to-r from-amber-50/92 to-yellow-50/90 text-amber-900 border border-amber-200/85 dark:from-amber-950/35 dark:to-yellow-950/30 dark:text-amber-100 dark:border-amber-900/40',
  cadastro:
    'bg-gradient-to-r from-indigo-50/92 to-purple-50/90 text-indigo-900 border border-indigo-200/85 dark:from-indigo-950/35 dark:to-purple-950/32 dark:text-indigo-100 dark:border-indigo-900/40',
  alerta:
    'bg-gradient-to-r from-indigo-50/92 to-purple-50/90 text-indigo-900 border border-indigo-200/85 dark:from-indigo-950/35 dark:to-purple-950/32 dark:text-indigo-100 dark:border-indigo-900/40',
  consulta_cliente:
    'bg-gradient-to-r from-cyan-50/92 to-blue-50/90 text-cyan-900 border border-cyan-200/85 dark:from-cyan-950/35 dark:to-blue-950/30 dark:text-cyan-100 dark:border-cyan-900/45',
};

const defaultBubble =
  'bg-white/88 dark:bg-slate-900/62 text-slate-900 dark:text-slate-100 border border-cyan-200/55 dark:border-cyan-900/35 ring-1 ring-cyan-200/20 dark:ring-cyan-900/15 backdrop-blur-sm';

interface ChatMessageItemProps {
  conversa: ChatMessage;
  formatarFonteResposta: (metadata?: Record<string, unknown>) => string;
  onAction: (action: InlineAction) => void;
  onSelectOption: (option: SelectionOption) => void;
  onAbrirCadastro: (dados: Record<string, unknown>) => void;
  onSelectCliente: (numero: number) => void;
}

export default function ChatMessageItem({
  conversa,
  formatarFonteResposta,
  onAction,
  onSelectOption,
  onAbrirCadastro,
  onSelectCliente,
}: ChatMessageItemProps) {
  const isUser = conversa.tipo === 'usuario';
  const metadata: ChatMessageMetadata | undefined = conversa.metadata;
  const selectionOptions = metadata?.options ?? [];
  const clientes = metadata?.clientes ?? [];
  const dadosExtraidos = metadata?.dadosExtraidos;
  const selectionTitle =
    typeof metadata?.selectionTitle === 'string'
      ? metadata.selectionTitle
      : 'Escolha uma opcao:';
  const userContentParts = String(conversa.conteudo || '').split(new RegExp(`(${technicalTokenRegex.source})`, 'gi'));

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <MessageAvatar tipo={conversa.tipo} />}

      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 shadow-[0_10px_22px_-18px_rgba(2,132,199,0.6)] animate-in slide-in-from-bottom-2 transition-all duration-200 hover:shadow-[0_14px_28px_-18px_rgba(2,132,199,0.7)] ${bubbleClass[conversa.tipo] || defaultBubble}`}
      >
        <div className="text-[15px] leading-6">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {userContentParts.map((part, index) =>
                technicalTokenExactRegex.test(part) ? (
                  <code
                    key={`${part}-${index}`}
                    className="font-mono text-[12px] rounded-md px-1.5 py-0.5 bg-white/18 border border-white/25"
                  >
                    {part}
                  </code>
                ) : (
                  <span key={`${part}-${index}`}>{part}</span>
                )
              )}
            </div>
          ) : (
            <div
              className="break-words [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_code]:font-mono [&_code]:text-[12px] [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-slate-900/10 dark:[&_code]:bg-white/10 [&_code.matias-tech-id]:border [&_code.matias-tech-id]:border-cyan-300/65 dark:[&_code.matias-tech-id]:border-cyan-800/55 [&_code.matias-tech-id]:text-cyan-900 dark:[&_code.matias-tech-id]:text-cyan-200"
              dangerouslySetInnerHTML={{
                __html: formatMatiasMessageHtml(String(conversa.conteudo || '')),
              }}
            />
          )}
        </div>

        {!isUser && metadata?.processed_by && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/75 bg-white/78 dark:bg-slate-900/55 text-slate-600 dark:text-slate-200">
              Fonte: {formatarFonteResposta(metadata)}
            </span>
            {typeof metadata.processing_time_ms === 'number' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/75 bg-white/78 dark:bg-slate-900/55 text-slate-600 dark:text-slate-200">
                {metadata.processing_time_ms}ms
              </span>
            )}
            {metadata.run_id && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/75 bg-white/78 dark:bg-slate-900/55 text-slate-600 dark:text-slate-200">
                run: {String(metadata.run_id).slice(0, 8)}
              </span>
            )}
            {metadata.cached && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/75 bg-white/78 dark:bg-slate-900/55 text-slate-600 dark:text-slate-200">
                cache
              </span>
            )}
          </div>
        )}

        {!isUser && metadata?.actions && (
          <ActionButtons actions={metadata.actions} onAction={onAction} />
        )}

        {!isUser && selectionOptions.length > 0 && (
          <SelectionOptions
            options={selectionOptions}
            title={selectionTitle}
            onSelect={onSelectOption}
          />
        )}

        {conversa.tipo === 'consulta_cliente' && clientes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-600 mb-2">
              Digite o numero do cliente para selecionar:
            </p>
            <div className="space-y-2">
              {clientes.map((cliente: ClienteExtraido, index) => (
                <button
                  key={`${cliente.id}-${index}`}
                  onClick={() => onSelectCliente(index + 1)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 flex items-center justify-center text-xs font-medium text-slate-600 group-hover:text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-900">
                        {cliente.nomeCompleto || cliente.label || 'Cliente sem nome'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {cliente.telefone || 'Sem telefone'}
                      </div>
                      {Array.isArray(cliente.veiculos) && cliente.veiculos.length > 0 && (
                        <div className="text-xs text-slate-400 mt-1">
                          Veiculos:{' '}
                          {cliente.veiculos
                            .map((v) => `${v.marca || ''} ${v.modelo || ''}`.trim())
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(conversa.tipo === 'cadastro' || conversa.tipo === 'alerta') && dadosExtraidos && (
          <Button
            onClick={() => onAbrirCadastro(dadosExtraidos)}
            className="mt-3 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Abrir formulario de cadastro
          </Button>
        )}

        <div
          className={`text-xs mt-2 opacity-60 ${isUser ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {new Date(conversa.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
