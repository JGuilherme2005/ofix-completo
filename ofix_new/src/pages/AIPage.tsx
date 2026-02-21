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
    <div className="relative h-full min-h-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-2 sm:p-4">
      <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-600/16" />
      <div className="pointer-events-none absolute -bottom-36 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-cyan-400/14 blur-3xl dark:bg-cyan-500/20" />

      <div className="relative mx-auto w-full max-w-screen-2xl flex flex-col min-h-0 flex-1">
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
