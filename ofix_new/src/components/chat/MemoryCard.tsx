import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, RefreshCw, Trash2 } from 'lucide-react';

interface MemoryCardProps {
  memoriaAtiva: boolean;
  memorias: Array<{ memory?: string; content?: string; [key: string]: unknown }>;
  loadingMemorias: boolean;
  mostrarMemorias: boolean;
  setMostrarMemorias: (v: boolean) => void;
  onCarregar: () => void;
  onExcluir: () => void;
  isAdmin?: boolean;
}

export default function MemoryCard({
  memoriaAtiva,
  memorias,
  loadingMemorias,
  mostrarMemorias,
  setMostrarMemorias,
  onCarregar,
  onExcluir,
  isAdmin = false,
}: MemoryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200/65 bg-gradient-to-b from-white/90 to-cyan-50/55 shadow-[0_14px_32px_-22px_rgba(14,116,144,0.55)] ring-1 ring-cyan-200/35 backdrop-blur-sm dark:border-cyan-900/35 dark:from-slate-900/72 dark:to-cyan-950/24 dark:ring-cyan-900/30">
      <div className="flex items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setMostrarMemorias(!mostrarMemorias)}
          aria-expanded={mostrarMemorias}
          className="flex min-w-0 items-center gap-2 font-semibold text-cyan-900 transition-colors hover:text-cyan-700 dark:text-cyan-200 dark:hover:text-cyan-100"
        >
          <Brain className="h-5 w-5 shrink-0" />
          <span className="truncate">Memoria do Matias</span>
          {memoriaAtiva ? (
            <span className="shrink-0 rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200">
              {memorias.length}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Aguardando ativacao
            </span>
          )}
        </button>

        <div className="shrink-0 flex items-center gap-1.5">
          {mostrarMemorias && memoriaAtiva && (
            <>
              <Button
                onClick={onCarregar}
                variant="ghost"
                size="sm"
                disabled={loadingMemorias}
                className="text-cyan-700 hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-cyan-950/35"
                title="Atualizar memorias"
              >
                <RefreshCw className={`h-4 w-4 ${loadingMemorias ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={onExcluir}
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-950/35"
                title="Esquecer memorias"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {mostrarMemorias && (
        <div className="border-t border-cyan-200/55 px-4 pb-4 pt-3 dark:border-cyan-900/35">
          {!memoriaAtiva ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/35 dark:bg-amber-950/28">
              <p className="mb-2 text-sm font-medium text-amber-900 dark:text-amber-200">Memoria ainda nao ativada</p>
              {isAdmin ? (
                <>
                  <p className="mb-2 text-xs text-amber-800/95 dark:text-amber-200/90">Para ativar no ambiente:</p>
                  <ol className="list-inside list-decimal space-y-1 text-xs text-amber-800/95 dark:text-amber-200/90">
                    <li>
                      Defina <code className="rounded bg-amber-100 px-1 dark:bg-amber-950/40">AGNO_ENABLE_MEMORY=true</code>
                    </li>
                    <li>
                      Start command: <code className="rounded bg-amber-100 px-1 dark:bg-amber-950/40">python agent_with_memory.py</code>
                    </li>
                    <li>Rode deploy manual</li>
                  </ol>
                </>
              ) : (
                <p className="text-xs text-amber-800/95 dark:text-amber-200/90">O administrador ativara esse recurso em breve.</p>
              )}
            </div>
          ) : loadingMemorias ? (
            <div className="space-y-2 py-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={`memory-skeleton-${idx}`} className="rounded-lg border border-cyan-200/55 p-3 dark:border-cyan-900/35">
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              ))}
            </div>
          ) : memorias.length > 0 ? (
            <ul className="mt-1 space-y-2">
              {memorias.map((memoria, idx) => (
                <li key={`${idx}-${memoria.memory || memoria.content || 'item'}`} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="mt-1 text-cyan-500">-</span>
                  <span className="break-words">{String(memoria.memory || memoria.content || JSON.stringify(memoria))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-5 text-center">
              <p className="text-sm italic text-slate-600 dark:text-slate-300">Ainda nao ha memorias salvas.</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Continue conversando para criar contexto.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
