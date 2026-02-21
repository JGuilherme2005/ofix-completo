import { MessageCircle, Wrench, ClipboardCheck, CalendarDays, Sparkles, Brain, Mic, Radio } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { AITabId, VoiceControlState, ConnectionStatusState, MemoryManagerState } from '../../types/ai.types';

interface AICentralTabProps {
  onOpenTab: (tab: AITabId) => void;
  connection: ConnectionStatusState;
  voice: VoiceControlState;
  memory: MemoryManagerState;
}

const FLOW_CARDS: Array<{
  id: Exclude<AITabId, 'admin' | 'central'>;
  title: string;
  description: string;
  icon: typeof MessageCircle;
  action: string;
  tone: string;
}> = [
  {
    id: 'chat',
    title: 'Conversa Inteligente',
    description: 'Use linguagem natural para consultar clientes, OS, pecas e acionar fluxos.',
    icon: MessageCircle,
    action: 'Abrir chat',
    tone: 'from-blue-500/20 to-cyan-500/10 border-blue-200 dark:border-blue-900/40',
  },
  {
    id: 'diagnostico',
    title: 'Diagnostico IA',
    description: 'Estruture sintomas, gere hipoteses e priorize o atendimento tecnico.',
    icon: Wrench,
    action: 'Iniciar diagnostico',
    tone: 'from-indigo-500/20 to-violet-500/10 border-indigo-200 dark:border-indigo-900/40',
  },
  {
    id: 'checkin',
    title: 'Check-in Guiado',
    description: 'Fluxo guiado de coleta para evitar perda de contexto no recebimento.',
    icon: ClipboardCheck,
    action: 'Comecar check-in',
    tone: 'from-emerald-500/20 to-green-500/10 border-emerald-200 dark:border-emerald-900/40',
  },
  {
    id: 'agendamento',
    title: 'Agendamento Operacional',
    description: 'Confirme horario, disponibilidade e registro com menos retrabalho.',
    icon: CalendarDays,
    action: 'Abrir agenda',
    tone: 'from-amber-500/20 to-orange-500/10 border-amber-200 dark:border-amber-900/40',
  },
];

export default function AICentralTab({ onOpenTab, connection, voice, memory }: AICentralTabProps) {
  return (
    <div className="h-full overflow-y-auto px-1 pb-1">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        <Card className="overflow-hidden border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              Central da IA
            </CardTitle>
            <CardDescription>
              Escolha o fluxo ideal para cada tarefa da oficina.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FLOW_CARDS.map((flow) => {
              const Icon = flow.icon;
              return (
                <div
                  key={flow.id}
                  className={`rounded-xl border bg-gradient-to-br ${flow.tone} p-4 flex flex-col gap-3`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/80 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{flow.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{flow.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="justify-start" onClick={() => onOpenTab(flow.id)}>
                    {flow.action}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Estado do assistente</CardTitle>
            <CardDescription>Telemetria rapida para operacao no dia a dia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" />
                Conexao
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{connection.getStatusText()}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" />
                Voz
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {voice.vozHabilitada ? 'Habilitada' : 'Desabilitada'}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5" />
                Memoria
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {memory.memoriaAtiva ? `Ativa (${memory.memorias.length} itens)` : 'Aguardando ativacao'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

