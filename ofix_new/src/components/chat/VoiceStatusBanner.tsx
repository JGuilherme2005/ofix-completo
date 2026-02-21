import { Mic, Volume2 } from 'lucide-react';

interface VoiceStatusBannerProps {
  gravando: boolean;
  falando: boolean;
  modoContinuo: boolean;
}

export default function VoiceStatusBanner({ gravando, falando, modoContinuo }: VoiceStatusBannerProps) {
  if (!gravando && !falando) return null;

  return (
    <div
      className={`border-t px-4 py-2 ${
        gravando
          ? 'border-rose-200/75 bg-rose-50/90 dark:border-rose-900/40 dark:bg-rose-950/28'
          : 'border-cyan-200/75 bg-cyan-50/90 dark:border-cyan-900/40 dark:bg-cyan-950/28'
      } shrink-0`}
      role="status"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-2">
        {gravando ? (
          <>
            <Mic className="h-4 w-4 animate-pulse text-rose-600 dark:text-rose-300" />
            <span className="text-sm font-medium text-rose-700 dark:text-rose-200">Gravando. Fale agora.</span>
            {modoContinuo && <span className="text-xs text-rose-600/90 dark:text-rose-200/85">(Modo continuo)</span>}
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 animate-pulse text-cyan-600 dark:text-cyan-300" />
            <span className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Matias esta respondendo por voz...</span>
          </>
        )}
      </div>
    </div>
  );
}
