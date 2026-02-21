/**
 * AIPageTabs — Sistema de abas para a página de IA
 * Organiza: Chat | Diagnóstico | Check-in | Agendamento | Admin
 */
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  MessageCircle,
  Wrench,
  ClipboardCheck,
  CalendarDays,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AITabId, VoiceControlState, ConnectionStatusState, MemoryManagerState } from '../../types/ai.types';

import ChatTab from './ChatTab';
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
  { id: 'chat', label: 'Chat IA', shortLabel: 'Chat', icon: MessageCircle },
  { id: 'diagnostico', label: 'Diagnóstico', shortLabel: 'Diag.', icon: Wrench },
  { id: 'checkin', label: 'Check-in', shortLabel: 'Check', icon: ClipboardCheck },
  { id: 'agendamento', label: 'Agendamento', shortLabel: 'Agenda', icon: CalendarDays },
  { id: 'admin', label: 'Admin IA', shortLabel: 'Admin', icon: Settings, adminOnly: true },
];

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

  const visibleTabs = TAB_CONFIG.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AITabId)} className="flex-1 min-h-0 flex flex-col">
      {/* Tab list com scroll horizontal em mobile */}
      <TabsList className="w-full justify-start gap-0.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-1 mb-3 overflow-x-auto scrollbar-none flex-shrink-0">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-950/40 dark:data-[state=active]:text-blue-300 whitespace-nowrap transition-all"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tab contents */}
      <TabsContent value="chat" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
        <ChatTab
          user={user}
          showToast={showToast}
          voice={voice}
          memory={memory}
          connection={connection}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
          onNavigateToTab={(tab: string) => setActiveTab(tab as AITabId)}
        />
      </TabsContent>

      <TabsContent value="diagnostico" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 p-4 overflow-y-auto h-full">
          <DiagnosticPanel
            isVisible={true}
            vehicleData={null}
            onDiagnosisComplete={() => {
              showToast('Diagnóstico concluído!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="checkin" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 overflow-y-auto h-full">
          <WizardCheckinIA
            onCheckinCompleto={() => {
              showToast('Check-in concluído!', 'success');
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="agendamento" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
        <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 ring-1 ring-slate-200/40 dark:ring-slate-800/40 overflow-y-auto h-full">
          <AgendamentoTab
            showToast={showToast}
            clienteSelecionado={clienteSelecionado}
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
