import type { ReactNode } from 'react';

/**
 * Centralized types for the AI module.
 */

// Tabs
export type AITabId = 'central' | 'chat' | 'diagnostico' | 'checkin' | 'agendamento' | 'admin';

// Chat messages
export interface ChatMessage {
  id: number;
  tipo:
    | 'usuario'
    | 'agente'
    | 'sistema'
    | 'erro'
    | 'confirmacao'
    | 'pergunta'
    | 'cadastro'
    | 'alerta'
    | 'consulta_cliente'
    | 'sucesso'
    | 'cliente_selecionado';
  conteudo: string;
  timestamp: string;
  metadata?: ChatMessageMetadata;
}

export interface InlineAction {
  type: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface SelectionOption {
  label: string;
  value?: string;
  id?: number;
  subtitle?: string;
  details?: string[];
}

export interface VeiculoExtraido {
  marca?: string;
  modelo?: string;
}

export interface ClienteExtraido {
  id: number;
  label?: string;
  value?: string;
  nomeCompleto?: string;
  telefone?: string;
  veiculos?: VeiculoExtraido[];
}

export interface ChatMessageMetadata {
  contexto?: string;
  actions?: InlineAction[];
  options?: SelectionOption[];
  selectionTitle?: string;
  clientes?: ClienteExtraido[];
  dadosExtraidos?: Record<string, unknown>;
  fonte?: string;
  confidence?: number;
  processed_by?: string;
  processing_time_ms?: number;
  run_id?: string | number;
  cached?: boolean;
  model?: string;
  [key: string]: unknown;
}

// Connection
export type AIConnectionStatus = 'conectado' | 'conectando' | 'desconectado' | 'erro' | 'local';

// Scheduling
export type TipoAgendamento = 'urgente' | 'normal' | 'programado' | 'especial';
export type AgendamentoEtapa = 'tipo' | 'data' | 'confirmacao';

export interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
}

export interface Agendamento {
  id: string | number;
  servicoId?: string | number;
  clienteId?: string | number;
  veiculoId?: string | number;
  clienteNome?: string;
  veiculoInfo?: string;
  dataHora: string;
  tipo: TipoAgendamento;
  status: 'confirmado' | 'cancelado' | 'realizado' | 'pendente' | 'rascunho';
  observacoes?: string;
  criadoPor?: string;
}

export interface AgendamentoFormData {
  tipo: TipoAgendamento;
  dataAgendamento: string;
  horaAgendamento: string;
  clienteId?: string | number;
  clienteNome?: string;
  veiculoId?: string | number;
  veiculoInfo?: string;
  servicoId?: string | number;
  observacoes: string;
}

export interface AgendamentoHandoff {
  origem?: 'chat' | 'tab';
  clienteId?: string | number;
  clienteNome?: string;
  veiculoId?: string | number;
  veiculoInfo?: string;
  observacoes?: string;
}

export interface DisponibilidadeResponse {
  disponivel: boolean;
  horarios: HorarioDisponivel[];
  proximaDataDisponivel?: string;
}

// Diagnostics
export interface DiagnosisResult {
  urgency?: string;
  diagnosis?: string;
  suggestedActions?: string[];
  estimatedCost?: { min: number; max: number };
  confidence?: number;
  [key: string]: unknown;
}

// Upsell
export interface UpsellAnalysis {
  temSugestao: boolean;
  sugestao?: string;
  prioridade?: 'alta' | 'media' | 'baixa';
  valorEstimado?: number;
  justificativa?: string;
}

// Shared tab props
export interface AITabProps {
  user?: { id?: string; nome?: string; role?: string; [key: string]: unknown };
  isAdmin: boolean;
  showToast: (msg: string, type?: string) => void;
  clienteSelecionado?: Record<string, unknown> | null;
  onClienteSelecionado?: (cliente: Record<string, unknown> | null) => void;
  onNavigateToTab?: (tab: AITabId, payload?: Record<string, unknown>) => void;
}

// Voice state
export interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
}

export interface VoiceControlState {
  vozHabilitada: boolean;
  gravando: boolean;
  falando: boolean;
  modoContinuo: boolean;
  mostrarConfig: boolean;
  vozesDisponiveis: SpeechSynthesisVoice[];
  vozSelecionada: SpeechSynthesisVoice | null;
  configVoz: VoiceConfig;
  setMostrarConfig: (v: boolean) => void;
  setVozSelecionada: (v: SpeechSynthesisVoice | null) => void;
  setModoContinuo: (v: boolean) => void;
  setConfigVoz: (v: VoiceConfig) => void;
  setOnTranscript?: (cb: (text: string, append: boolean) => void) => void;
  alternarVoz: () => void;
  pararFala: () => void;
  falarTexto: (text: string) => void;
  iniciarGravacao: () => void;
  pararGravacao: () => void;
}

// Connection state
export interface ConnectionStatusState {
  statusConexao: string;
  podeInteragir: boolean;
  getStatusIcon: () => ReactNode;
  getStatusText: () => string;
  formatarFonteResposta: (metadata?: Record<string, unknown>) => string;
  verificarConexao: (opts?: { warm?: boolean; silent?: boolean }) => Promise<boolean> | void;
  atualizarStatusPorMetadata: (metadata?: Record<string, unknown>) => void;
}

// Memory state
export interface MemoryManagerState {
  memoriaAtiva: boolean;
  memorias: Array<{ memory?: string; content?: string; [key: string]: unknown }>;
  loadingMemorias: boolean;
  mostrarMemorias: boolean;
  setMostrarMemorias: (v: boolean) => void;
  setMemoriaAtiva: (v: boolean) => void;
  carregarMemorias: () => void;
  excluirMemorias: (opts?: { skipConfirm?: boolean }) => Promise<boolean> | void;
}
