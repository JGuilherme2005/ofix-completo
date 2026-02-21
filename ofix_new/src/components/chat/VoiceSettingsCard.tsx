import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Mic2 } from 'lucide-react';

interface VoiceSettingsCardProps {
  mostrarConfig: boolean;
  setMostrarConfig: (v: boolean) => void;
  vozesDisponiveis: SpeechSynthesisVoice[];
  vozSelecionada: SpeechSynthesisVoice | null;
  setVozSelecionada: (v: SpeechSynthesisVoice | null) => void;
  modoContinuo: boolean;
  setModoContinuo: (v: boolean) => void;
  configVoz: { rate: number; pitch: number; volume: number };
  setConfigVoz: (v: { rate: number; pitch: number; volume: number }) => void;
  onTestarVoz: () => void;
}

export default function VoiceSettingsCard({
  mostrarConfig,
  setMostrarConfig,
  vozesDisponiveis,
  vozSelecionada,
  setVozSelecionada,
  modoContinuo,
  setModoContinuo,
  configVoz,
  setConfigVoz,
  onTestarVoz,
}: VoiceSettingsCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200/65 bg-gradient-to-b from-white/90 to-cyan-50/55 shadow-[0_14px_32px_-22px_rgba(14,116,144,0.55)] ring-1 ring-cyan-200/35 backdrop-blur-sm dark:border-cyan-900/35 dark:from-slate-900/72 dark:to-cyan-950/24 dark:ring-cyan-900/30">
      <button
        type="button"
        onClick={() => setMostrarConfig(!mostrarConfig)}
        aria-expanded={mostrarConfig}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-cyan-100/45 dark:hover:bg-cyan-950/25 transition-colors"
      >
        <div className="min-w-0 text-left">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Mic2 className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
            Voz do Matias
          </div>
          <div className="truncate text-xs text-slate-600 dark:text-slate-400">
            {vozSelecionada?.name ? `Voz ativa: ${vozSelecionada.name}` : 'Selecione uma voz'}
          </div>
        </div>
        {mostrarConfig ? (
          <ChevronUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        )}
      </button>

      {mostrarConfig && (
        <div className="border-t border-cyan-200/55 p-4 pt-3 dark:border-cyan-900/35">
          <div className="mb-3">
            <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">Voz do assistente</label>
            <select
              value={vozSelecionada?.name || ''}
              onChange={(e) => {
                const voz = vozesDisponiveis.find((item) => item.name === e.target.value) || null;
                setVozSelecionada(voz);
              }}
              className="w-full rounded-xl border border-cyan-200/75 bg-white/90 px-3 py-2 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/35 dark:border-cyan-900/40 dark:bg-slate-950/35 dark:text-slate-100 dark:focus:ring-cyan-900/35"
            >
              {vozesDisponiveis.map((voz) => (
                <option key={voz.name} value={voz.name}>
                  {voz.name} ({voz.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-cyan-200/60 bg-white/70 px-3 py-2 dark:border-cyan-900/35 dark:bg-slate-950/28">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Modo continuo</label>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Reconhecimento de voz sem parar</p>
            </div>
            <button
              type="button"
              onClick={() => setModoContinuo(!modoContinuo)}
              role="switch"
              aria-checked={modoContinuo}
              aria-label="Modo continuo"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                modoContinuo ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  modoContinuo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="voiceRate" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Velocidade: {configVoz.rate.toFixed(1)}x
              </label>
              <input
                id="voiceRate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={configVoz.rate}
                onChange={(e) => setConfigVoz({ ...configVoz, rate: Number.parseFloat(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100 dark:bg-cyan-950/35"
              />
            </div>
            <div>
              <label htmlFor="voicePitch" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Tom: {configVoz.pitch.toFixed(1)}
              </label>
              <input
                id="voicePitch"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={configVoz.pitch}
                onChange={(e) => setConfigVoz({ ...configVoz, pitch: Number.parseFloat(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100 dark:bg-cyan-950/35"
              />
            </div>
            <div>
              <label htmlFor="voiceVolume" className="mb-1 block text-xs text-slate-600 dark:text-slate-300">
                Volume: {Math.round(configVoz.volume * 100)}%
              </label>
              <input
                id="voiceVolume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={configVoz.volume}
                onChange={(e) => setConfigVoz({ ...configVoz, volume: Number.parseFloat(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100 dark:bg-cyan-950/35"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-cyan-200/55 pt-3 dark:border-cyan-900/35">
            <Button onClick={onTestarVoz} variant="outline" size="sm" className="w-full border-cyan-300/80 bg-white/80 hover:bg-white dark:border-cyan-900/45 dark:bg-slate-900/55 dark:hover:bg-slate-900">
              Testar voz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
