// @ts-nocheck
import { Volume2 } from 'lucide-react';

interface VoiceStatusBannerProps {
  gravando: boolean;
  falando: boolean;
  modoContinuo: boolean;
}

export default function VoiceStatusBanner({ gravando, falando, modoContinuo }: VoiceStatusBannerProps) {
  if (!gravando && !falando) return null;

  return (
    <div className={`px-4 py-2 border-t ${gravando ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/40' : 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/40'}`} role="status" aria-live="assertive">
      <div className="flex items-center justify-center gap-2">
        {gravando ? (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700 dark:text-red-200">🎤 Gravando... Fale agora</span>
            {modoContinuo && <span className="text-xs text-red-600 dark:text-red-200/80">(Modo contínuo)</span>}
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-200">🔊 Matias está falando...</span>
          </>
        )}
      </div>
    </div>
  );
}
