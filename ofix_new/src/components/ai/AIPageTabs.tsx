import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  Sparkles,
  MessageCircle,
  Wrench,
  ClipboardCheck,
  CalendarDays,
  Settings,
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
    title: 'Central de Orquestracao',
    description: 'Comece por aqui para decidir o melhor fluxo antes de executar.',
    tip: 'Dica: use esta aba para evitar abrir fluxos em ordem errada.',
    next: 'chat',
    secondary: 'agendamento',
  },
  chat: {
    title: 'Conversa Operacional',
    description: 'Conduza intencoes por linguagem natural e dispare fluxos estruturados.',
    tip: 'Use o chat para descobrir, e tabs para executar com seguranca.',
    next: 'agendamento',
    secondary: 'checkin',
  },
  diagnostico: {
    title: 'Analise Tecnica',
    description: 'Estruture sintomas e hipoteses para acelerar atendimento.',
    tip: 'Finalize com check-in ou agendamento para transformar analise em acao.',
    next: 'checkin',
    secondary: 'agendamento',
  },
  checkin: {
    title: 'Coleta Estruturada',
    description: 'Formalize informacoes do cliente e veiculo antes da execucao.',
    tip: 'Com check-in concluido, agende para garantir continuidade operacional.',
    next: 'agendamento',
    secondary: 'chat',
  },
  agendamento: {
    title: 'Fechamento de Agenda',
    description: 'Confirme data, horario e disponibilidade com previsibilidade.',
    tip: 'Se faltarem dados, volte ao chat para completar contexto.',
    next: 'chat',
    secondary: 'checkin',
  },
  admin: {
    title: 'Governanca da IA',
    description: 'Acompanhe configuracao, uso e operacao administrativa.',
    tip: 'Valide indicadores aqui e ajuste fluxos nas abas operacionais.',
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
  const [activeTab, setActiveTab] = useState<AITabId>('central');
  const [agendamentoHandoff, setAgendamentoHandoff] = useState<AgendamentoHandoff | null>(null);

  const visibleTabs = TAB_CONFIG.filter(tab => !tab.adminOnly || isAdmin);

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

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AITabId)} className="flex-1 min-h-0 flex flex-col">
      <TabsList className="w-full justify-start gap-1 bg-white/85 dark:bg-slate-900/75 border border-slate-200/70 dark:border-slate-800/70 rounded-xl p-1.5 mb-3 overflow-x-auto scrollbar-none flex-shrink-0 sticky top-0 z-20 backdrop-blur">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="group gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:from-blue-950/40 dark:data-[state=active]:to-indigo-950/30 dark:data-[state=active]:text-blue-300 whitespace-nowrap transition-all border border-transparent data-[state=active]:border-blue-200/70 dark:data-[state=active]:border-blue-900/50"
            >
              <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-data-[state=active]:scale-105" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="mb-3 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/65 p-3 ring-1 ring-slate-200/30 dark:ring-slate-800/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Fluxo atual</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentMeta.title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{currentMeta.description}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1.5">{currentMeta.tip}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isVisibleTab(currentMeta.next) && (
              <button
                type="button"
                onClick={() => setActiveTab(currentMeta.next as AITabId)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Ir para {getTabLabel(currentMeta.next as AITabId)}
              </button>
            )}
            {isVisibleTab(currentMeta.secondary) && (
              <button
                type="button"
                onClick={() => setActiveTab(currentMeta.secondary as AITabId)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
              >
                Abrir {getTabLabel(currentMeta.secondary as AITabId)}
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

      <TabsContent value="central" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
        <AICentralTab
          onOpenTab={(tab) => setActiveTab(tab)}
          connection={connection}
          voice={voice}
          memory={memory}
        />
      </TabsContent>

      <TabsContent value="diagnostico" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 p-4 overflow-y-auto h-full">
          <DiagnosticPanel
            isVisible={true}
            vehicleData={null}
            onDiagnosisComplete={() => {
              showToast('Diagnostico concluido!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="checkin" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 overflow-y-auto h-full">
          <WizardCheckinIA
            onCheckinCompleto={() => {
              showToast('Check-in concluido!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="agendamento" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 overflow-y-auto h-full">
          <AgendamentoTab
            showToast={showToast}
            clienteSelecionado={clienteSelecionado}
            handoffContext={agendamentoHandoff}
          />
        </div>
      </TabsContent>

      {isAdmin && (
        <TabsContent value="admin" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
          <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 overflow-y-auto h-full">
            <AIAdminDashboard isOpen={true} onClose={() => setActiveTab('chat')} className="border-0 shadow-none" />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AIPageTabs;
