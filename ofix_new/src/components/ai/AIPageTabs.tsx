import { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  Sparkles,
  MessageCircle,
  Wrench,
  ClipboardCheck,
  CalendarDays,
  Settings,
  Brain,
  Mic,
  Radio,
  UserRound,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
  AITabId,
  VoiceControlState,
  ConnectionStatusState,
  MemoryManagerState,
  AgendamentoHandoff,
} from '../../types/ai.types';

import ChatTab from './ChatTab';
import AICentralTab from './AICentralTab';
import DiagnosticPanel from './DiagnosticPanel';
import WizardCheckinIA from './WizardCheckinIA';
import AgendamentoTab from './AgendamentoTab';
import AIAdminDashboard from './AIAdminDashboard';

const TAB_CONFIG: Array<{
  id: AITabId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}> = [
  { id: 'central', label: 'Central IA', shortLabel: 'Central', icon: Sparkles },
  { id: 'chat', label: 'Chat IA', shortLabel: 'Chat', icon: MessageCircle },
  { id: 'diagnostico', label: 'Diagnostico', shortLabel: 'Diag.', icon: Wrench },
  { id: 'checkin', label: 'Check-in', shortLabel: 'Check', icon: ClipboardCheck },
  { id: 'agendamento', label: 'Agendamento', shortLabel: 'Agenda', icon: CalendarDays },
  { id: 'admin', label: 'Admin IA', shortLabel: 'Admin', icon: Settings, adminOnly: true },
];

const FLOW_META: Record<
  AITabId,
  {
    title: string;
    description: string;
    tip: string;
    next?: AITabId;
    secondary?: AITabId;
  }
> = {
  central: {
    title: 'Central de orquestracao',
    description: 'Defina rapidamente para onde o atendimento deve seguir.',
    tip: 'Use esta aba para escolher o fluxo certo antes de executar.',
    next: 'chat',
    secondary: 'agendamento',
  },
  chat: {
    title: 'Conversa operacional',
    description: 'Descubra intencao por linguagem natural e execute com contexto.',
    tip: 'O chat interpreta; as abas executam com previsibilidade.',
    next: 'agendamento',
    secondary: 'checkin',
  },
  diagnostico: {
    title: 'Analise tecnica',
    description: 'Estruture sintomas e hipoteses para acelerar o atendimento.',
    tip: 'Depois do diagnostico, siga para check-in ou agendamento.',
    next: 'checkin',
    secondary: 'agendamento',
  },
  checkin: {
    title: 'Coleta estruturada',
    description: 'Formalize dados de cliente e veiculo antes da execucao.',
    tip: 'Com check-in concluido, avance para agendamento.',
    next: 'agendamento',
    secondary: 'chat',
  },
  agendamento: {
    title: 'Fechamento de agenda',
    description: 'Confirme data e horario com previsibilidade operacional.',
    tip: 'Se faltar contexto, volte ao chat para completar dados.',
    next: 'chat',
    secondary: 'checkin',
  },
  admin: {
    title: 'Governanca da IA',
    description: 'Acompanhe configuracao e uso administrativo da assistente.',
    tip: 'Valide indicadores e ajuste a operacao nas abas de fluxo.',
    next: 'central',
    secondary: 'chat',
  },
};

interface AIPageTabsProps {
  user: { id?: string; nome?: string; role?: string; [key: string]: unknown } | null;
  isAdmin: boolean;
  showToast: (msg: string, type?: string) => void;
  voice: VoiceControlState;
  memory: MemoryManagerState;
  connection: ConnectionStatusState;
  clienteSelecionado: Record<string, unknown> | null;
  setClienteSelecionado: (c: Record<string, unknown> | null) => void;
}

const AIPageTabs = ({
  user,
  isAdmin,
  showToast,
  voice,
  memory,
  connection,
  clienteSelecionado,
  setClienteSelecionado,
}: AIPageTabsProps) => {
  const [activeTab, setActiveTab] = useState<AITabId>('chat');
  const [mountedTabs, setMountedTabs] = useState<Set<AITabId>>(() => new Set<AITabId>(['chat']));
  const [agendamentoHandoff, setAgendamentoHandoff] = useState<AgendamentoHandoff | null>(null);
  const [topExpanded, setTopExpanded] = useState(false);
  const topShellRef = useRef<HTMLDivElement | null>(null);

  const visibleTabs = TAB_CONFIG.filter((tab) => !tab.adminOnly || isAdmin);

  const clienteNome = useMemo(
    () =>
      (clienteSelecionado?.nomeCompleto as string | undefined) ||
      (clienteSelecionado?.nome as string | undefined) ||
      'Cliente nao selecionado',
    [clienteSelecionado]
  );

  const handleNavigateToTab = (tab: AITabId, payload?: Record<string, unknown>) => {
    if (tab === 'agendamento' && payload) {
      setAgendamentoHandoff({
        origem: 'chat',
        clienteId: payload.clienteId as string | number | undefined,
        clienteNome: payload.clienteNome as string | undefined,
        veiculoId: payload.veiculoId as string | number | undefined,
        veiculoInfo: payload.veiculoInfo as string | undefined,
        observacoes: payload.observacoes as string | undefined,
      });
    }

    handleTabChange(tab);
  };

  const currentMeta = FLOW_META[activeTab];
  const isVisibleTab = (tab?: AITabId) => Boolean(tab && visibleTabs.some((item) => item.id === tab));
  const getTabLabel = (tab: AITabId) => TAB_CONFIG.find((item) => item.id === tab)?.label || tab;
  const getTabShortLabel = (tab: AITabId) => TAB_CONFIG.find((item) => item.id === tab)?.shortLabel || tab;

  useEffect(() => {
    if (!topExpanded) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!topShellRef.current) return;
      const target = event.target as Node;
      if (!topShellRef.current.contains(target)) {
        setTopExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [topExpanded]);

  const limparMemoria = () => {
    const confirmed = window.confirm('Limpar memoria do Matias para este usuario?');
    if (!confirmed) return;
    memory.excluirMemorias();
    showToast('Memoria do Matias limpa.', 'success');
    setTopExpanded(false);
  };

  const handleTabChange = (tab: AITabId) => {
    setActiveTab(tab);
    setMountedTabs((prev) => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as AITabId)} className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div ref={topShellRef} className="sticky top-0 z-20 mb-2 rounded-2xl border border-cyan-200/70 dark:border-cyan-900/45 bg-gradient-to-r from-white/86 via-cyan-50/42 to-blue-50/40 dark:from-slate-900/78 dark:via-slate-900/66 dark:to-cyan-950/30 p-1.5 sm:p-2 ring-1 ring-cyan-200/35 dark:ring-cyan-900/25 shadow-[0_12px_30px_-20px_rgba(14,116,144,0.6)] backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 bg-transparent p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="group h-8.5 gap-1.5 px-3 py-1 text-[13px] sm:text-sm rounded-lg text-slate-700 dark:text-slate-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-100/90 data-[state=active]:to-blue-100/80 data-[state=active]:text-cyan-800 data-[state=active]:shadow-sm dark:data-[state=active]:from-cyan-950/45 dark:data-[state=active]:to-blue-950/45 dark:data-[state=active]:text-cyan-200 whitespace-nowrap transition-all border border-transparent data-[state=active]:border-cyan-300/80 dark:data-[state=active]:border-cyan-800/55 hover:bg-white/70 dark:hover:bg-slate-800/55"
                >
                  <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-data-[state=active]:scale-105" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex items-center gap-1">
            {isVisibleTab(currentMeta.next) && (
              <button
                type="button"
                onClick={() => handleTabChange(currentMeta.next as AITabId)}
                className="h-8.5 px-3 rounded-lg text-xs sm:text-[13px] font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-colors whitespace-nowrap shadow-sm"
                title={`Ir para ${getTabLabel(currentMeta.next as AITabId)}`}
              >
                <span className="hidden md:inline">Abrir {getTabLabel(currentMeta.next as AITabId)}</span>
                <span className="md:hidden">Abrir {getTabShortLabel(currentMeta.next as AITabId)}</span>
              </button>
            )}
              <button
                type="button"
                onClick={() => setTopExpanded((prev) => !prev)}
                className="h-8.5 px-2.5 rounded-lg text-xs font-medium border border-slate-300/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 bg-white/75 dark:bg-slate-900/55 hover:bg-white dark:hover:bg-slate-800/75 transition-colors"
                title="Mostrar status operacional"
                aria-label="Mostrar status operacional"
              >
              <span className="inline-flex items-center gap-1">
                Painel
                {topExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </span>
            </button>
            {isVisibleTab(currentMeta.secondary) && (
              <button
                type="button"
                onClick={() => handleTabChange(currentMeta.secondary as AITabId)}
                className="hidden sm:inline-flex h-8.5 px-3 rounded-lg text-xs sm:text-[13px] font-medium border border-slate-300/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/45 hover:bg-white dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
                title={`Ir para ${getTabLabel(currentMeta.secondary as AITabId)}`}
              >
                <span className="hidden lg:inline">Abrir {getTabLabel(currentMeta.secondary as AITabId)}</span>
                <span className="lg:hidden">Abrir {getTabShortLabel(currentMeta.secondary as AITabId)}</span>
              </button>
            )}
          </div>
        </div>

        {topExpanded && (
          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/75 dark:border-slate-800/75 bg-white/90 dark:bg-slate-900/75 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200">
              <Radio className="h-3.5 w-3.5 text-slate-500" />
              {connection.getStatusText()}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/75 dark:border-slate-800/75 bg-white/90 dark:bg-slate-900/75 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200">
              <Mic className="h-3.5 w-3.5 text-slate-500" />
              {voice.vozHabilitada ? 'Voz habilitada' : 'Voz desabilitada'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/75 dark:border-slate-800/75 bg-white/90 dark:bg-slate-900/75 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200">
              <Brain className="h-3.5 w-3.5 text-slate-500" />
              {memory.memoriaAtiva ? 'Memoria ativa' : 'Memoria aguardando ativacao'}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-200/75 dark:border-slate-800/75 bg-white/90 dark:bg-slate-900/75 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200">
              <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span className="truncate">{clienteNome}</span>
            </span>
            <button
              type="button"
              onClick={limparMemoria}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/90 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/45 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Limpar memoria
            </button>
          </div>
        )}
      </div>

      <TabsContent value="chat" forceMount={mountedTabs.has('chat') ? true : undefined} className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
        <ChatTab
          user={user}
          showToast={showToast}
          voice={voice}
          memory={memory}
          connection={connection}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
          onNavigateToTab={handleNavigateToTab}
        />
      </TabsContent>

      <TabsContent value="central" forceMount={mountedTabs.has('central') ? true : undefined} className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <AICentralTab onOpenTab={(tab) => handleTabChange(tab)} />
      </TabsContent>

      <TabsContent value="diagnostico" forceMount={mountedTabs.has('diagnostico') ? true : undefined} className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 p-4 h-full overflow-y-auto">
          <DiagnosticPanel
            isVisible={true}
            vehicleData={null}
            onDiagnosisComplete={() => {
              showToast('Diagnostico concluido!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="checkin" forceMount={mountedTabs.has('checkin') ? true : undefined} className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-hidden">
          <WizardCheckinIA
            onCheckinCompleto={() => {
              showToast('Check-in concluido!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="agendamento" forceMount={mountedTabs.has('agendamento') ? true : undefined} className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-hidden">
          <AgendamentoTab
            showToast={showToast}
            clienteSelecionado={clienteSelecionado}
            handoffContext={agendamentoHandoff}
          />
        </div>
      </TabsContent>

      {isAdmin && (
        <TabsContent value="admin" forceMount={mountedTabs.has('admin') ? true : undefined} className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
          <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-y-auto">
            <AIAdminDashboard isOpen={true} onClose={() => handleTabChange('chat')} className="border-0 shadow-none" />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AIPageTabs;
