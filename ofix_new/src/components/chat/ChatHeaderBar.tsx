import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Wrench, Brain, Volume2, VolumeX, RefreshCw, PanelRightOpen } from 'lucide-react';

interface ChatHeaderBarProps {
  statusConexao: string;
  memoriaAtiva: boolean;
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
  statusConexao, memoriaAtiva, vozHabilitada, falando,
  painelFixoDesktop, painelDrawerOpen, setPainelDrawerOpen, setPainelFixoDesktop,
  sidePanelContent,
  getStatusIcon, getStatusText,
  onAlternarVoz, onPararFala, onReconectar,
}: ChatHeaderBarProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg border-0 p-3 sm:p-4 mb-3 ring-1 ring-white/15 animate-in fade-in-0 duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Assistente IA Pista
              <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">AI v2.0</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">Seu especialista em oficina mecânica</p>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
          {memoriaAtiva && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-500/20 border border-green-300/30 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-green-100" />
              <span className="text-xs font-medium text-green-100 hidden sm:inline">Memória ativa</span>
            </div>
          )}

          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm border ${
            statusConexao === 'conectado' ? 'border-green-300/30' :
            statusConexao === 'local' ? 'border-amber-300/30' :
            statusConexao === 'conectando' ? 'border-yellow-300/30' :
            statusConexao === 'erro' ? 'border-red-300/30' : 'border-white/20'
          }`}>
            <div className="relative">
              <div className="text-white">{getStatusIcon()}</div>
              {statusConexao === 'conectado' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              {statusConexao === 'local' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
            </div>
            <span className="text-xs sm:text-sm font-medium text-white">{getStatusText()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAlternarVoz}
              className={`flex items-center gap-2 bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all ${vozHabilitada ? 'text-white' : 'text-white/60'}`}
              title={vozHabilitada ? 'Desativar voz' : 'Ativar voz'}
              aria-label={vozHabilitada ? 'Desativar voz' : 'Ativar voz'}
            >
              {vozHabilitada ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            {falando && (
              <Button variant="outline" size="sm" onClick={onPararFala}
                className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 animate-pulse"
                title="Parar fala"
                aria-label="Parar fala">
                <VolumeX className="w-4 h-4" />
              </Button>
            )}

            <Sheet open={painelDrawerOpen} onOpenChange={setPainelDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon"
                  className={`${painelFixoDesktop ? 'lg:hidden ' : ''}bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20`}
                  aria-label="Abrir painel">
                  <PanelRightOpen className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[92vw] sm:max-w-md lg:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Painel do Matias</SheetTitle>
                  <SheetDescription className="sr-only">Opcoes e informacoes do painel lateral do Matias.</SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-7rem)] pr-1">
                  {!painelFixoDesktop && (
                    <div className="hidden lg:flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-900/40 px-3 py-2">
                      <div className="text-xs text-slate-600 dark:text-slate-300">Quer deixar este painel fixo ao lado no desktop?</div>
                      <Button type="button" size="sm" variant="secondary" onClick={() => { setPainelFixoDesktop(true); setPainelDrawerOpen(false); }} className="h-8">Fixar</Button>
                    </div>
                  )}
                  {sidePanelContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Button variant="outline" size="sm" onClick={onReconectar} disabled={statusConexao === 'conectando'}
            className="hidden sm:flex items-center gap-2 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all disabled:opacity-50">
            <RefreshCw className="w-4 h-4" /> Reconectar
          </Button>
          <Button variant="outline" size="icon" onClick={onReconectar} disabled={statusConexao === 'conectando'}
            className="sm:hidden bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all disabled:opacity-50"
            aria-label="Reconectar">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
