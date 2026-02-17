// @ts-nocheck
import { useState, useEffect } from 'react';

/**
 * Hook para controle do painel lateral (desktop fixo / mobile drawer).
 * Persiste preferência no localStorage.
 */
export function useSidePanel() {
  const [painelFixoDesktop, setPainelFixoDesktop] = useState(() => {
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
      // ignore (modo privado / storage bloqueado)
    }
  }, [painelFixoDesktop]);

  return {
    painelFixoDesktop,
    setPainelFixoDesktop,
    painelDrawerOpen,
    setPainelDrawerOpen,
  };
}
