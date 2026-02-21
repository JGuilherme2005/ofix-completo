import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ActionsCardProps {
  onLimparHistorico: () => void;
}

export default function ActionsCard({ onLimparHistorico }: ActionsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-4">
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Ações</div>
      <div className="flex flex-col gap-2">
        <Button onClick={onLimparHistorico} variant="outline" className="justify-start gap-2">
          <Trash2 className="w-4 h-4" />
          Limpar conversa
        </Button>
        <div className="text-xs text-slate-500 dark:text-slate-400">Dica: ESC para parar gravação ou fala.</div>
      </div>
    </div>
  );
}
