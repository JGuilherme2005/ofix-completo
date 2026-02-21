import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
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

  return (
    <div className="relative h-full min-h-0 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-2 sm:p-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] text-slate-900 dark:opacity-[0.10] dark:text-white" />

      <div className="relative mx-auto w-full max-w-screen-2xl flex flex-col min-h-0 flex-1">
        <header className="mb-3 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-200/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/50 dark:ring-slate-800/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Assistente de Inteligencia Artificial</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">Chat, diagnostico, check-in, agendamento e painel admin em uma unica pagina.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              {connection.getStatusIcon()}
              {connection.getStatusText()}
            </span>
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
