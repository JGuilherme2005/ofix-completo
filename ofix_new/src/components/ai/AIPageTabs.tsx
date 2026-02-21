import { useMemo, useState } from 'react';
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
  Workflow,
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
  const [agendamentoHandoff, setAgendamentoHandoff] = useState<AgendamentoHandoff | null>(null);

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

    setActiveTab(tab);
  };

  const currentMeta = FLOW_META[activeTab];
  const isVisibleTab = (tab?: AITabId) => Boolean(tab && visibleTabs.some((item) => item.id === tab));
  const getTabLabel = (tab: AITabId) => TAB_CONFIG.find((item) => item.id === tab)?.label || tab;
  const getTabShortLabel = (tab: AITabId) => TAB_CONFIG.find((item) => item.id === tab)?.shortLabel || tab;

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AITabId)} className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="sticky top-0 z-20 mb-2 rounded-xl border border-cyan-200/60 dark:border-cyan-900/40 bg-white/88 dark:bg-slate-900/72 p-1.5 ring-1 ring-cyan-200/30 dark:ring-cyan-900/20 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <div
            className="hidden xl:inline-flex shrink-0 items-center gap-1 rounded-md border border-cyan-200/70 bg-cyan-50/80 px-2 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-200"
            title={currentMeta.tip}
          >
            <Workflow className="h-3 w-3" />
            {currentMeta.title}
          </div>

          <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 bg-transparent p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="group h-8 gap-1.5 px-3 py-1 text-xs sm:text-sm rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-50 data-[state=active]:to-blue-50 data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm dark:data-[state=active]:from-cyan-950/35 dark:data-[state=active]:to-blue-950/35 dark:data-[state=active]:text-cyan-300 whitespace-nowrap transition-all border border-transparent data-[state=active]:border-cyan-200/70 dark:data-[state=active]:border-cyan-900/50"
                >
                  <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-data-[state=active]:scale-105" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="hidden min-[1920px]:flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 px-2 py-1">
              <Radio className="h-3 w-3 text-slate-500" />
              {connection.getStatusText()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 px-2 py-1">
              <Mic className="h-3 w-3 text-slate-500" />
              {voice.vozHabilitada ? 'Voz on' : 'Voz off'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 px-2 py-1">
              <Brain className="h-3 w-3 text-slate-500" />
              {memory.memoriaAtiva ? 'Memoria ativa' : 'Memoria pendente'}
            </span>
            <span className="inline-flex max-w-[16rem] items-center gap-1 rounded-md border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 px-2 py-1">
              <UserRound className="h-3 w-3 shrink-0 text-slate-500" />
              <span className="truncate">{clienteNome}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isVisibleTab(currentMeta.next) && (
              <button
                type="button"
                onClick={() => setActiveTab(currentMeta.next as AITabId)}
                className="h-8 px-2.5 rounded-md text-[11px] font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors whitespace-nowrap"
                title={`Ir para ${getTabLabel(currentMeta.next as AITabId)}`}
              >
                {getTabShortLabel(currentMeta.next as AITabId)}
              </button>
            )}
            {isVisibleTab(currentMeta.secondary) && (
              <button
                type="button"
                onClick={() => setActiveTab(currentMeta.secondary as AITabId)}
                className="hidden sm:inline-flex h-8 px-2.5 rounded-md text-[11px] font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
                title={`Ir para ${getTabLabel(currentMeta.secondary as AITabId)}`}
              >
                {getTabShortLabel(currentMeta.secondary as AITabId)}
              </button>
            )}
          </div>
        </div>
      </div>

      <TabsContent value="chat" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
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

      <TabsContent value="central" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <AICentralTab onOpenTab={(tab) => setActiveTab(tab)} />
      </TabsContent>

      <TabsContent value="diagnostico" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
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

      <TabsContent value="checkin" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-hidden">
          <WizardCheckinIA
            onCheckinCompleto={() => {
              showToast('Check-in concluido!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="agendamento" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-hidden">
          <AgendamentoTab
            showToast={showToast}
            clienteSelecionado={clienteSelecionado}
            handoffContext={agendamentoHandoff}
          />
        </div>
      </TabsContent>

      {isAdmin && (
        <TabsContent value="admin" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-hidden">
          <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 h-full overflow-y-auto">
            <AIAdminDashboard isOpen={true} onClose={() => setActiveTab('chat')} className="border-0 shadow-none" />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AIPageTabs;
