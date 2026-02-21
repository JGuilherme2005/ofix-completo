import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  XCircle,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  Loader2,
  User,
  MessageSquareText,
  Wand2,
} from 'lucide-react';
import { useAgendamento } from '../../hooks/ai/useAgendamento';
import type { AgendamentoHandoff, AgendamentoFormData, TipoAgendamento } from '../../types/ai.types';

const TIPO_INFO: Record<TipoAgendamento, { label: string; desc: string; icon: string; color: string }> = {
  urgente: {
    label: 'Urgente',
    desc: 'Mesmo dia',
    icon: '!',
    color: 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800',
  },
  normal: {
    label: 'Normal',
    desc: 'Ate 3 dias',
    icon: 'N',
    color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800',
  },
  programado: {
    label: 'Programado',
    desc: 'Preventiva/Revisao',
    icon: 'P',
    color: 'border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800',
  },
  especial: {
    label: 'Especial',
    desc: 'Servico complexo',
    icon: 'E',
    color: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800',
  },
};

interface AgendamentoTabProps {
  showToast: (msg: string, type?: string) => void;
  clienteSelecionado?: Record<string, unknown> | null;
  handoffContext?: AgendamentoHandoff | null;
}

const toInputDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseComandoLivre = (text: string): Partial<AgendamentoFormData> => {
  const raw = text.trim();
  const lower = raw.toLowerCase();
  const patch: Partial<AgendamentoFormData> = { observacoes: raw };

  if (/urgente|hoje|agora|imediat|o quanto antes/.test(lower)) patch.tipo = 'urgente';
  else if (/revis|prevent|programad|retorno/.test(lower)) patch.tipo = 'programado';
  else if (/cambio|eletric|motor completo|retifica|complex/.test(lower)) patch.tipo = 'especial';
  else patch.tipo = 'normal';

  if (/amanh/.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    patch.dataAgendamento = toInputDate(d);
  } else if (/depois de amanh/.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    patch.dataAgendamento = toInputDate(d);
  } else {
    const dateMatch = lower.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (dateMatch) {
      const day = Number(dateMatch[1]);
      const month = Number(dateMatch[2]);
      const year = dateMatch[3]
        ? Number(dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3])
        : new Date().getFullYear();
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        patch.dataAgendamento = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
  }

  const hourMatch = lower.match(/\b(\d{1,2})(?:[:h](\d{2}))?\s*(?:h|horas?)?\b/);
  if (hourMatch) {
    const hour = Number(hourMatch[1]);
    const minute = hourMatch[2] ? Number(hourMatch[2]) : 0;
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      patch.horaAgendamento = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }

  return patch;
};

export default function AgendamentoTab({ showToast, clienteSelecionado, handoffContext }: AgendamentoTabProps) {
  const {
    etapa,
    formData,
    horarios,
    agendamentos,
    loading,
    loadingAgendamentos,
    erro,
    sucesso,
    verificarHorarios,
    carregarAgendamentos,
    confirmarAgendamento,
    cancelar,
    avancarEtapa,
    voltarEtapa,
    updateForm,
  } = useAgendamento({ showToast, clienteSelecionado });

  const [comandoLivre, setComandoLivre] = useState('');
  const handoffAplicadoRef = useRef<string | null>(null);

  const clienteId = clienteSelecionado?.id as string | number | undefined;
  const clienteNomeSelecionado = (clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome) as string | undefined;
  const veiculoIdSelecionado = clienteSelecionado?.veiculoId as string | number | undefined;
  const veiculoInfoSelecionado = (clienteSelecionado?.veiculoInfo || clienteSelecionado?.veiculo) as string | undefined;

  useEffect(() => {
    void carregarAgendamentos();
  }, [carregarAgendamentos]);

  useEffect(() => {
    if (formData.dataAgendamento && etapa === 'data') {
      void verificarHorarios(formData.dataAgendamento, formData.tipo);
    }
  }, [etapa, formData.dataAgendamento, formData.tipo, verificarHorarios]);

  useEffect(() => {
    if (!clienteId && !clienteNomeSelecionado && !veiculoIdSelecionado && !veiculoInfoSelecionado) return;
    updateForm({
      clienteId,
      clienteNome: clienteNomeSelecionado,
      veiculoId: veiculoIdSelecionado,
      veiculoInfo: veiculoInfoSelecionado,
    });
  }, [clienteId, clienteNomeSelecionado, veiculoIdSelecionado, veiculoInfoSelecionado, updateForm]);

  useEffect(() => {
    if (!handoffContext) return;
    const chaveHandoff = JSON.stringify(handoffContext);
    if (handoffAplicadoRef.current === chaveHandoff) return;

    const patch: Partial<AgendamentoFormData> = {};
    if (handoffContext.clienteId !== undefined) patch.clienteId = handoffContext.clienteId;
    if (handoffContext.clienteNome !== undefined) patch.clienteNome = handoffContext.clienteNome;
    if (handoffContext.veiculoId !== undefined) patch.veiculoId = handoffContext.veiculoId;
    if (handoffContext.veiculoInfo !== undefined) patch.veiculoInfo = handoffContext.veiculoInfo;
    if (handoffContext.observacoes !== undefined) patch.observacoes = handoffContext.observacoes;

    if (Object.keys(patch).length > 0) updateForm(patch);
    if (handoffContext.origem === 'chat' && etapa === 'tipo') {
      avancarEtapa();
    }

    handoffAplicadoRef.current = chaveHandoff;
  }, [handoffContext, etapa, updateForm, avancarEtapa]);

  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);
  const clienteNome =
    (clienteSelecionado?.nomeCompleto as string | undefined) ||
    (clienteSelecionado?.nome as string | undefined) ||
    formData.clienteNome;

  const aplicarComandoLivre = () => {
    const valor = comandoLivre.trim();
    if (!valor) {
      showToast('Descreva o pedido para interpretar o agendamento.', 'warning');
      return;
    }

    const patch = parseComandoLivre(valor);
    const mergedObservacoes = formData.observacoes
      ? `${formData.observacoes}\n${valor}`
      : valor;

    updateForm({ ...patch, observacoes: mergedObservacoes });

    if (patch.dataAgendamento) {
      void verificarHorarios(patch.dataAgendamento, (patch.tipo || formData.tipo) as TipoAgendamento);
    }

    if (etapa === 'tipo') {
      avancarEtapa();
    }

    showToast('Pedido interpretado. Revise os dados e confirme o horario.', 'success');
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Agendar servico</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {etapa === 'tipo' && 'Etapa 1/3 - Tipo de servico'}
            {etapa === 'data' && 'Etapa 2/3 - Data e horario'}
            {etapa === 'confirmacao' && 'Etapa 3/3 - Confirmacao'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {(['tipo', 'data', 'confirmacao'] as const).map((step, i) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= ['tipo', 'data', 'confirmacao'].indexOf(etapa)
                  ? 'w-8 bg-blue-500'
                  : 'w-4 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquareText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Agendamento conversacional
          </CardTitle>
          <CardDescription>
            Escreva como voce falaria no chat (ex: "troca de oleo amanha as 14h para Joao").
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={comandoLivre}
            onChange={(e) => setComandoLivre(e.target.value)}
            rows={2}
            placeholder="Ex: Revisao completa dia 25/02 as 10h, cliente Maria, veiculo HB20"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={aplicarComandoLivre} className="gap-2">
              <Wand2 className="h-4 w-4" />
              Interpretar pedido
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setComandoLivre('Troca de oleo amanha as 14h')}
            >
              Exemplo rapido
            </Button>
          </div>
        </CardContent>
      </Card>

      {clienteNome && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950/30">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Cliente: {clienteNome}</span>
        </div>
      )}

      {handoffContext?.origem === 'chat' && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Dados recebidos do chat. Revise e confirme o agendamento.
        </div>
      )}

      {erro && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {sucesso}
        </div>
      )}

      {etapa === 'tipo' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              Tipo de atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.entries(TIPO_INFO) as Array<[TipoAgendamento, (typeof TIPO_INFO)[TipoAgendamento]]>).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateForm({ tipo: key })}
                  className={`rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                    formData.tipo === key
                      ? `${info.color} ring-2 ring-blue-400 shadow-sm`
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                      {info.icon}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{info.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{info.desc}</div>
                    </div>
                    {formData.tipo === key && <CheckCircle2 className="ml-auto h-5 w-5 text-blue-500" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Label htmlFor="ag-obs" className="text-sm">
                Observacoes (opcional)
              </Label>
              <Textarea
                id="ag-obs"
                value={formData.observacoes}
                onChange={(e) => updateForm({ observacoes: e.target.value })}
                placeholder="Descreva o problema ou servico desejado..."
                rows={2}
                className="mt-1"
              />
            </div>

            <Button onClick={avancarEtapa} className="w-full gap-2">
              Proximo: Escolher data <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {etapa === 'data' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5" />
              Data e horario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ag-data">Data do agendamento</Label>
              <Input
                id="ag-data"
                type="date"
                min={hoje}
                value={formData.dataAgendamento}
                onChange={(e) => updateForm({ dataAgendamento: e.target.value, horaAgendamento: '' })}
                className="mt-1"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Verificando disponibilidade...</span>
              </div>
            ) : formData.dataAgendamento && horarios.length > 0 ? (
              <div>
                <Label className="mb-2 block">Horarios disponiveis</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {horarios.map((h) => (
                    <button
                      key={h.hora}
                      type="button"
                      disabled={!h.disponivel}
                      onClick={() => updateForm({ horaAgendamento: h.hora })}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        formData.horaAgendamento === h.hora
                          ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                          : h.disponivel
                            ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700'
                            : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600'
                      }`}
                    >
                      {h.hora}
                    </button>
                  ))}
                </div>
              </div>
            ) : formData.dataAgendamento ? (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Nenhum horario disponivel para esta data.
              </div>
            ) : null}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={voltarEtapa} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={avancarEtapa}
                disabled={!formData.dataAgendamento || !formData.horaAgendamento}
                className="flex-1 gap-2"
              >
                Confirmar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {etapa === 'confirmacao' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Confirmar agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                  {TIPO_INFO[formData.tipo]?.icon}
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{TIPO_INFO[formData.tipo]?.label}</div>
                  <div className="text-xs text-slate-500">{TIPO_INFO[formData.tipo]?.desc}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 opacity-60" />
                  <span>
                    {new Date(`${formData.dataAgendamento}T12:00`).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 opacity-60" />
                  <span>{formData.horaAgendamento}</span>
                </div>
              </div>

              {clienteNome && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4 opacity-60" />
                  <span>{clienteNome}</span>
                </div>
              )}

              {formData.observacoes && (
                <div className="mt-2 border-t border-slate-200 pt-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {formData.observacoes}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={voltarEtapa} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={confirmarAgendamento}
                disabled={loading}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Confirmar agendamento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5" />
              Proximos agendamentos
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={carregarAgendamentos}
              disabled={loadingAgendamentos}
              className="h-8 px-2"
            >
              <RefreshCw className={`h-4 w-4 ${loadingAgendamentos ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingAgendamentos ? (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              <CalendarDays className="mx-auto mb-2 h-10 w-10 opacity-40" />
              <p className="text-sm">Nenhum agendamento nos proximos 7 dias</p>
            </div>
          ) : (
            <div className="space-y-2">
              {agendamentos.slice(0, 5).map((ag) => (
                <div
                  key={ag.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                      {TIPO_INFO[ag.tipo]?.icon || 'A'}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {ag.clienteNome || `OS #${ag.servicoId}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(ag.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        {' - '}
                        {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        ag.status === 'confirmado'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : ag.status === 'cancelado'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {ag.status}
                    </Badge>
                    {ag.status === 'confirmado' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        title="Cancelar"
                        onClick={() => cancelar(ag.id, 'Cancelado pelo usuario')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
