import { useState, useEffect } from 'react';

/**
 * Controle do painel lateral (desktop fixo / mobile drawer).
 * Persiste preferencia no localStorage.
 */
export function useSidePanel() {
  const [painelFixoDesktop, setPainelFixoDesktop] = useState<boolean>(() => {
    try {
      return localStorage.getItem('matias_panel_pinned') !== '0';
    } catch {
      return true;
    }
  });

  const [painelDrawerOpen, setPainelDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('matias_panel_pinned', painelFixoDesktop ? '1' : '0');
    } catch {
      // ignore storage failures
    }
  }, [painelFixoDesktop]);

  return {
    painelFixoDesktop,
    setPainelFixoDesktop,
    painelDrawerOpen,
    setPainelDrawerOpen,
  };
}
