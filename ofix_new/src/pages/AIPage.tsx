import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Brain, Mic, Radio, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AIPageTabs from '../components/ai/AIPageTabs';
import { useConnectionStatus, useMemoryManager, useVoiceControl } from '../hooks/ai';
import '../styles/matias-animations.css';

const getClienteFromStorage = (): Record<string, unknown> | null => {
  try {
    const saved = localStorage.getItem('clienteSelecionado');
    return saved ? (JSON.parse(saved) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

export default function AIPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const showToast = useCallback((msg: string, type?: string) => {
    switch (type) {
      case 'success':
        toast.success(msg);
        break;
      case 'error':
        toast.error(msg);
        break;
      case 'warning':
        toast(msg);
        break;
      case 'info':
        toast(msg);
        break;
      default:
        toast(msg);
    }
  }, []);

  const voice = useVoiceControl({ showToast });
  const memory = useMemoryManager({ userId: user?.id, showToast });
  const connection = useConnectionStatus({
    showToast,
    onMemoryStatus: memory.setMemoriaAtiva,
  });

  const [clienteSelecionado, setClienteSelecionadoState] = useState<Record<string, unknown> | null>(() => getClienteFromStorage());

  const setClienteSelecionado = useCallback((cliente: Record<string, unknown> | null) => {
    setClienteSelecionadoState(cliente);
    try {
      if (cliente) {
        localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));
      } else {
        localStorage.removeItem('clienteSelecionado');
      }
    } catch {
      // ignore localStorage failures
    }
  }, []);

  const clienteNome =
    (clienteSelecionado?.nomeCompleto as string | undefined) ||
    (clienteSelecionado?.nome as string | undefined) ||
    null;

  return (
    <div className="relative h-full min-h-0 flex flex-col bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-2 sm:p-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] text-slate-900 dark:opacity-[0.10] dark:text-white" />
      <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-600/20" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/20" />

      <div className="relative mx-auto w-full max-w-screen-2xl flex flex-col min-h-0 flex-1">
        <header className="mb-3 rounded-2xl border border-slate-200/60 bg-white/85 px-4 py-4 shadow-sm ring-1 ring-slate-200/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/55 dark:ring-slate-800/40">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Assistente de Inteligencia Artificial
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Operacao assistida por IA para conversar, diagnosticar, executar check-in e fechar agendamentos sem sair do fluxo.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  Conexao
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 inline-flex items-center gap-1.5">
                  {connection.getStatusIcon()}
                  {connection.getStatusText()}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  Voz
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                  {voice.vozHabilitada ? 'Habilitada' : 'Desabilitada'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  Memoria
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                  {memory.memoriaAtiva ? 'Ativa' : 'Aguardando ativacao'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5" />
                  Cliente
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {clienteNome || 'Nao selecionado'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <AIPageTabs
          user={user}
          isAdmin={isAdmin}
          showToast={showToast}
          voice={voice}
          memory={memory}
          connection={connection}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
        />
      </div>
    </div>
  );
}
