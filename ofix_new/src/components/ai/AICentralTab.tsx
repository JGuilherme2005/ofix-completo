import { MessageCircle, Wrench, ClipboardCheck, CalendarDays, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { AITabId } from '../../types/ai.types';

interface AICentralTabProps {
  onOpenTab: (tab: AITabId) => void;
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
    title: 'Chat Operacional',
    description: 'Converse e direcione o fluxo sem trocar de tela.',
    icon: MessageCircle,
    action: 'Abrir chat',
    tone: 'from-cyan-500/15 to-blue-500/10 border-cyan-200 dark:border-cyan-900/40',
  },
  {
    id: 'diagnostico',
    title: 'Diagnostico',
    description: 'Estruture sintomas e gere hipoteses tecnicas rapidamente.',
    icon: Wrench,
    action: 'Iniciar diagnostico',
    tone: 'from-indigo-500/15 to-blue-500/10 border-indigo-200 dark:border-indigo-900/40',
  },
  {
    id: 'checkin',
    title: 'Check-in Guiado',
    description: 'Colete dados certos antes de abrir OS e executar servico.',
    icon: ClipboardCheck,
    action: 'Comecar check-in',
    tone: 'from-emerald-500/15 to-cyan-500/10 border-emerald-200 dark:border-emerald-900/40',
  },
  {
    id: 'agendamento',
    title: 'Agendamento',
    description: 'Feche horario com previsibilidade e menos retrabalho.',
    icon: CalendarDays,
    action: 'Abrir agenda',
    tone: 'from-amber-500/15 to-orange-500/10 border-amber-200 dark:border-amber-900/40',
  },
];

export default function AICentralTab({ onOpenTab }: AICentralTabProps) {
  return (
    <div className="h-full overflow-y-auto px-1 pb-1">
      <Card className="overflow-hidden border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-300" />
            Central IA
          </CardTitle>
          <CardDescription>
            Atalhos rapidos para os fluxos que realmente importam na rotina da oficina.
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
                  <div className="w-9 h-9 rounded-lg bg-white/85 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center">
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
    </div>
  );
}
