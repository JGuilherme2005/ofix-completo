import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Wrench, Volume2, VolumeX, RefreshCw, PanelRightOpen } from 'lucide-react';

interface ChatHeaderBarProps {
  statusConexao: string;
  vozHabilitada: boolean;
  falando: boolean;
  painelFixoDesktop: boolean;
  painelDrawerOpen: boolean;
  setPainelDrawerOpen: (v: boolean) => void;
  setPainelFixoDesktop: (v: boolean) => void;
  sidePanelContent: ReactNode;
  getStatusIcon: () => ReactNode;
  getStatusText: () => string;
  onAlternarVoz: () => void;
  onPararFala: () => void;
  onReconectar: () => void;
}

export default function ChatHeaderBar({
  statusConexao,
  vozHabilitada,
  falando,
  painelFixoDesktop,
  painelDrawerOpen,
  setPainelDrawerOpen,
  setPainelFixoDesktop,
  sidePanelContent,
  getStatusIcon,
  getStatusText,
  onAlternarVoz,
  onPararFala,
  onReconectar,
}: ChatHeaderBarProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-cyan-200/70 bg-gradient-to-r from-cyan-50/90 via-sky-50/70 to-blue-50/90 px-2 py-1.5 shadow-sm ring-1 ring-cyan-200/40 dark:border-cyan-900/40 dark:from-slate-900/70 dark:via-slate-900/55 dark:to-blue-950/35 dark:ring-cyan-900/30">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-700 ring-1 ring-cyan-300/50 dark:bg-cyan-500/20 dark:text-cyan-200 dark:ring-cyan-800/40">
            <Wrench className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-900 dark:text-slate-100">Controles do chat</span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400">{getStatusIcon()}</span>
            {getStatusText()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={onAlternarVoz}
            className={`h-8 w-8 border-slate-300/80 bg-white/80 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900 ${
              vozHabilitada ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
            }`}
            title={vozHabilitada ? 'Desativar voz' : 'Ativar voz'}
            aria-label={vozHabilitada ? 'Desativar voz' : 'Ativar voz'}
          >
            {vozHabilitada ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          {falando && (
            <Button
              variant="outline"
              size="icon"
              onClick={onPararFala}
              className="h-8 w-8 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
              title="Parar fala"
              aria-label="Parar fala"
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          )}

          <Sheet open={painelDrawerOpen} onOpenChange={setPainelDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`${painelFixoDesktop ? 'lg:hidden ' : ''}h-8 w-8 border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900`}
                aria-label="Abrir painel"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[92vw] sm:max-w-md lg:max-w-lg">
              <SheetHeader>
                <SheetTitle>Painel da IA</SheetTitle>
                <SheetDescription className="sr-only">Opcoes e informacoes do painel lateral da IA.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex max-h-[calc(100vh-7rem)] flex-col gap-3 overflow-y-auto pr-1">
                {!painelFixoDesktop && (
                  <div className="hidden lg:flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-900/40 px-3 py-2">
                    <div className="text-xs text-slate-600 dark:text-slate-300">Fixar painel lateral no desktop?</div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setPainelFixoDesktop(true);
                        setPainelDrawerOpen(false);
                      }}
                      className="h-8"
                    >
                      Fixar
                    </Button>
                  </div>
                )}
                {sidePanelContent}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="icon"
            onClick={onReconectar}
            disabled={statusConexao === 'conectando'}
            className="h-8 w-8 border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            aria-label="Reconectar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
