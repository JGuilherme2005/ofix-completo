// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import logger from '../../utils/logger';
import { AI_CONFIG } from '../../constants/aiPageConfig';

interface VoiceControlOptions {
  showToast: (msg: string, type?: string) => void;
}

/**
 * Hook que encapsula toda a lógica de voz (STT + TTS).
 */
export function useVoiceControl({ showToast }: VoiceControlOptions) {
  // ── State ──────────────────────────────────
  const [gravando, setGravando] = useState(false);
  const [vozHabilitada, setVozHabilitada] = useState(() => {
    try {
      return localStorage.getItem('matias_voice_enabled') === '1';
    } catch {
      return false;
    }
  });
  const [falando, setFalando] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [modoContinuo, setModoContinuo] = useState(false);
  const [vozesDisponiveis, setVozesDisponiveis] = useState<any[]>([]);
  const [vozSelecionada, setVozSelecionada] = useState<any>(null);
  const [configVoz, setConfigVoz] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });

  // ── Refs ───────────────────────────────────
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);
  /** Ref estável para o callback de transcrição (evita stale closures) */
  const onTranscriptRef = useRef<((text: string, append: boolean) => void) | null>(null);

  // ── Carregar vozes ─────────────────────────
  useEffect(() => {
    const carregarVozes = () => {
      const vozes = window.speechSynthesis.getVoices();
      const vozesPortugues = vozes.filter((v) => v.lang.startsWith('pt'));
      setVozesDisponiveis(vozesPortugues.length > 0 ? vozesPortugues : vozes);
      if (vozesPortugues.length > 0) setVozSelecionada(vozesPortugues[0]);
      else if (vozes.length > 0) setVozSelecionada(vozes[0]);
    };

    carregarVozes();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = carregarVozes;
    }
  }, []);

  // ── Gravação (STT) ─────────────────────────
  const iniciarGravacao = useCallback(() => {
    if (falando) {
      showToast('Aguarde o assistente terminar de falar antes de gravar.', 'warning');
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Reconhecimento de voz não é suportado neste navegador.', 'error');
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setFalando(false);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = modoContinuo;
    recognition.interimResults = modoContinuo;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setGravando(true);

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const confidence = event.results[event.results.length - 1][0].confidence;
      if (confidence < AI_CONFIG.VOICE.MIN_CONFIDENCE) return;
      onTranscriptRef.current?.(transcript, modoContinuo);
    };

    recognition.onerror = (event) => {
      logger.error('Erro no reconhecimento de voz', { error: event.error, context: 'iniciarGravacao' });
      setGravando(false);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        showToast(`Erro no reconhecimento de voz: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
      setGravando(false);
      if (modoContinuo && recognitionRef.current && !falando) {
        setTimeout(() => {
          if (recognitionRef.current && !falando) {
            try { recognitionRef.current.start(); } catch (e) {
              logger.warn('Erro ao reiniciar reconhecimento', { error: e.message });
            }
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      logger.error('Erro ao iniciar reconhecimento', { error: error.message });
      setGravando(false);
      showToast('Erro ao iniciar gravação', 'error');
    }
  }, [falando, modoContinuo, showToast]);

  const pararGravacao = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {
        logger.warn('Erro ao parar reconhecimento', { error: e.message });
      }
      recognitionRef.current = null;
    }
    setGravando(false);
  }, []);

  // ── Fala (TTS) ─────────────────────────────
  const falarTexto = useCallback((texto: string) => {
    if (!vozHabilitada || !('speechSynthesis' in window) || !texto?.trim()) return;

    const estavagravando = gravando;
    if (gravando) pararGravacao();

    try { window.speechSynthesis.cancel(); } catch (e) {
      logger.error('Erro ao cancelar fala anterior', { error: e.message });
    }

    const textoLimpo = texto
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/•/g, '')
      .replace(/💡|🔧|🚗|💼|📊|❌|✅|📋|🏢|🔍|⚠️/g, '')
      .trim();
    if (!textoLimpo) return;

    const utterance = new SpeechSynthesisUtterance(textoLimpo);
    utterance.lang = 'pt-BR';
    utterance.rate = configVoz.rate;
    utterance.pitch = configVoz.pitch;
    utterance.volume = configVoz.volume;
    if (vozSelecionada) utterance.voice = vozSelecionada;

    utterance.onstart = () => {
      setFalando(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) { /* ok */ }
      }
    };

    utterance.onend = () => {
      setFalando(false);
      if (estavagravando && modoContinuo) {
        setTimeout(iniciarGravacao, AI_CONFIG.VOICE.ECHO_PREVENTION_DELAY_MS);
      }
    };

    utterance.onerror = (event) => {
      setFalando(false);
      const errosComuns = ['canceled', 'interrupted', 'not-allowed'];
      if (errosComuns.includes(event.error)) {
        logger.debug('Síntese de voz interrompida', { error: event.error });
      } else {
        logger.warn('Falha na síntese de voz', { error: event.error });
      }
      if (estavagravando && modoContinuo) {
        setTimeout(iniciarGravacao, AI_CONFIG.VOICE.ECHO_PREVENTION_DELAY_MS);
      }
    };

    synthesisRef.current = utterance;
    setTimeout(() => window.speechSynthesis.speak(utterance), AI_CONFIG.VOICE.SPEAK_DELAY_MS);
  }, [vozHabilitada, gravando, pararGravacao, configVoz, vozSelecionada, modoContinuo, iniciarGravacao]);

  const pararFala = useCallback(() => {
    window.speechSynthesis.cancel();
    setFalando(false);
  }, []);

  const alternarVoz = useCallback(() => {
    const proximo = !vozHabilitada;
    setVozHabilitada(proximo);
    try { localStorage.setItem('matias_voice_enabled', proximo ? '1' : '0'); } catch { /* ok */ }
    if (falando) {
      window.speechSynthesis.cancel();
      setFalando(false);
    }
  }, [vozHabilitada, falando]);

  // ── ESC + cleanup ──────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gravando) pararGravacao();
        if (falando) pararFala();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [gravando, falando, pararGravacao, pararFala]);

  // ── Callback para o componente pai injetar handler de transcrição ──
  const setOnTranscript = useCallback((fn: (text: string, append: boolean) => void) => {
    onTranscriptRef.current = fn;
  }, []);

  return {
    // estados
    gravando,
    vozHabilitada,
    falando,
    mostrarConfig,
    setMostrarConfig,
    modoContinuo,
    setModoContinuo,
    vozesDisponiveis,
    vozSelecionada,
    setVozSelecionada,
    configVoz,
    setConfigVoz,
    // ações
    iniciarGravacao,
    pararGravacao,
    falarTexto,
    pararFala,
    alternarVoz,
    setOnTranscript,
  };
}
