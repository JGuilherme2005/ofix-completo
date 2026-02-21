import { Button } from '@/components/ui/button';
import { Brain, Loader2, RefreshCw, Trash2 } from 'lucide-react';

interface MemoryCardProps {
  memoriaAtiva: boolean;
  memorias: any[];
  loadingMemorias: boolean;
  mostrarMemorias: boolean;
  setMostrarMemorias: (v: boolean) => void;
  onCarregar: () => void;
  onExcluir: () => void;
  /** Se true, esconde instruções de infra (admin only) */
  isAdmin?: boolean;
}

export default function MemoryCard({
  memoriaAtiva, memorias, loadingMemorias,
  mostrarMemorias, setMostrarMemorias,
  onCarregar, onExcluir,
  isAdmin = false,
}: MemoryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-sm border border-blue-200/70 dark:border-blue-900/40 overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setMostrarMemorias(!mostrarMemorias)}
          aria-expanded={mostrarMemorias}
          className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-semibold hover:text-blue-700 dark:hover:text-blue-100 transition-colors min-w-0"
        >
          <Brain className="w-5 h-5 shrink-0" />
          <span className="truncate">O que o Matias lembra sobre você</span>
          {memoriaAtiva && (
            <span className="text-xs bg-blue-100 dark:bg-blue-950/40 dark:text-blue-200 px-2 py-0.5 rounded-full shrink-0">{memorias.length}</span>
          )}
          {!memoriaAtiva && (
            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200 px-2 py-0.5 rounded-full shrink-0">Aguardando ativação</span>
          )}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {mostrarMemorias && memoriaAtiva && (
            <>
              <Button onClick={onCarregar} variant="ghost" size="sm" disabled={loadingMemorias} className="text-blue-600 dark:text-blue-300 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30" title="Atualizar memórias">
                <RefreshCw className={`w-4 h-4 ${loadingMemorias ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={onExcluir} variant="ghost" size="sm" className="text-red-600 dark:text-red-300 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" title="Esquecer minhas conversas (LGPD)">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {mostrarMemorias && (
        <div className="px-4 pb-4 pt-0 border-t border-blue-100/70 dark:border-blue-900/30">
          {!memoriaAtiva ? (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900/30 rounded-lg p-4">
              <p className="text-sm text-yellow-900 dark:text-yellow-200 font-medium mb-2">Sistema de memória não ativado</p>
              {/* M5-UX-06: Só exibe instruções de infra para admin */}
              {isAdmin ? (
                <>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200/90 mb-3">Configure no Render para o Matias lembrar das conversas:</p>
                  <ol className="text-xs text-yellow-800 dark:text-yellow-200/90 space-y-1 list-decimal list-inside">
                    <li>Backend - Environment - <code className="bg-yellow-100 dark:bg-yellow-950/40 px-1 rounded">AGNO_ENABLE_MEMORY=true</code></li>
                    <li>Agente - Start Command - <code className="bg-yellow-100 dark:bg-yellow-950/40 px-1 rounded">python agent_with_memory.py</code></li>
                    <li>Fazer Deploy Manual</li>
                  </ol>
                </>
              ) : (
                <p className="text-xs text-yellow-800 dark:text-yellow-200/90">O recurso de memória será ativado pelo administrador em breve.</p>
              )}
            </div>
          ) : loadingMemorias ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Carregando memórias...</span>
            </div>
          ) : memorias.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {memorias.map((memoria, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="break-words">{memoria.memory || memoria.content || JSON.stringify(memoria)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">Ainda não há memórias salvas.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Continue conversando com o Matias.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
