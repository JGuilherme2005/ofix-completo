import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface ActionsCardProps {
  onLimparHistorico: () => void;
}

export default function ActionsCard({ onLimparHistorico }: ActionsCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-200/65 bg-gradient-to-b from-white/90 to-cyan-50/55 p-4 shadow-[0_14px_32px_-22px_rgba(14,116,144,0.55)] ring-1 ring-cyan-200/35 backdrop-blur-sm dark:border-cyan-900/35 dark:from-slate-900/72 dark:to-cyan-950/24 dark:ring-cyan-900/30">
      <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Acoes rapidas</div>
      <div className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="justify-start gap-2 border-rose-200/80 bg-rose-50/85 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/28 dark:text-rose-300 dark:hover:bg-rose-950/45"
            >
              <Trash2 className="h-4 w-4" />
              Limpar conversa
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md border-cyan-200/70 bg-white/95 ring-1 ring-cyan-200/45 dark:border-cyan-900/45 dark:bg-slate-950/92 dark:ring-cyan-900/35">
            <AlertDialogHeader>
              <AlertDialogTitle>Limpar conversa com o Matias?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acao remove o historico local da conversa atual. Voce pode iniciar uma nova conversa em seguida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={onLimparHistorico}
                className="bg-rose-600 text-white hover:bg-rose-500"
              >
                Limpar agora
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="text-xs text-slate-500 dark:text-slate-400">Dica: pressione ESC para parar gravacao ou fala.</div>
      </div>
    </div>
  );
}
