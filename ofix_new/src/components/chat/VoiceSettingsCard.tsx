// @ts-nocheck
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface VoiceSettingsCardProps {
  mostrarConfig: boolean;
  setMostrarConfig: (v: boolean) => void;
  vozesDisponiveis: any[];
  vozSelecionada: any;
  setVozSelecionada: (v: any) => void;
  modoContinuo: boolean;
  setModoContinuo: (v: boolean) => void;
  configVoz: { rate: number; pitch: number; volume: number };
  setConfigVoz: (v: any) => void;
  onTestarVoz: () => void;
}

export default function VoiceSettingsCard({
  mostrarConfig, setMostrarConfig,
  vozesDisponiveis, vozSelecionada, setVozSelecionada,
  modoContinuo, setModoContinuo,
  configVoz, setConfigVoz,
  onTestarVoz,
}: VoiceSettingsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setMostrarConfig(!mostrarConfig)}
        aria-expanded={mostrarConfig}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Configurações de voz</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {vozSelecionada?.name ? `Voz: ${vozSelecionada.name}` : 'Selecione uma voz'}
          </div>
        </div>
        {mostrarConfig ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      </button>

      {mostrarConfig && (
        <div className="p-4 pt-0">
          <div className="mb-4">
            <label className="text-xs text-slate-600 dark:text-slate-300 mb-2 block font-medium">Voz do assistente</label>
            <select
              value={vozSelecionada?.name || ''}
              onChange={(e) => { const voz = vozesDisponiveis.find(v => v.name === e.target.value); setVozSelecionada(voz); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950/30 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {vozesDisponiveis.map((voz) => (
                <option key={voz.name} value={voz.name}>{voz.name} ({voz.lang})</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block">Modo contínuo</label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Reconhecimento de voz sem parar</p>
            </div>
            <button
              type="button"
              onClick={() => setModoContinuo(!modoContinuo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${modoContinuo ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${modoContinuo ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-300 mb-1 block">Velocidade: {configVoz.rate.toFixed(1)}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={configVoz.rate} onChange={(e) => setConfigVoz({ ...configVoz, rate: parseFloat(e.target.value) })} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-300 mb-1 block">Tom: {configVoz.pitch.toFixed(1)}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={configVoz.pitch} onChange={(e) => setConfigVoz({ ...configVoz, pitch: parseFloat(e.target.value) })} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-300 mb-1 block">Volume: {Math.round(configVoz.volume * 100)}%</label>
              <input type="range" min="0" max="1" step="0.1" value={configVoz.volume} onChange={(e) => setConfigVoz({ ...configVoz, volume: parseFloat(e.target.value) })} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <Button onClick={onTestarVoz} variant="outline" size="sm" className="w-full">Testar voz</Button>
          </div>
        </div>
      )}
    </div>
  );
}
