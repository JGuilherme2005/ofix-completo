// @ts-nocheck
/**
 * AgendamentoTab — Wizard de agendamento funcional em 3 etapas
 * Integra com agendamentos.service.js para disponibilidade, criação e cancelamento
 */
import { useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
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
} from 'lucide-react';
import { useAgendamento } from '../../hooks/ai/useAgendamento';
import type { AgendamentoHandoff } from '../../types/ai.types';

const TIPO_INFO = {
  urgente: { label: 'Urgente', desc: 'Mesmo dia', icon: '🔴', color: 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800' },
  normal: { label: 'Normal', desc: 'Até 3 dias', icon: '🟡', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800' },
  programado: { label: 'Programado', desc: 'Preventiva/Revisão', icon: '🟢', color: 'border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800' },
  especial: { label: 'Especial', desc: 'Serviço complexo', icon: '🔵', color: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800' },
};

interface AgendamentoTabProps {
  showToast: (msg: string, type?: string) => void;
  clienteSelecionado?: Record<string, unknown> | null;
  handoffContext?: AgendamentoHandoff | null;
}

const AgendamentoTab = ({ showToast, clienteSelecionado, handoffContext }: AgendamentoTabProps) => {
  const agendamento = useAgendamento({ showToast, clienteSelecionado });

  // Carregar agendamentos na montagem
  useEffect(() => {
    agendamento.carregarAgendamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quando selecionar data, buscar horários
  useEffect(() => {
    if (agendamento.formData.dataAgendamento && agendamento.etapa === 'data') {
      agendamento.verificarHorarios(agendamento.formData.dataAgendamento, agendamento.formData.tipo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendamento.formData.dataAgendamento, agendamento.formData.tipo]);

  // Pre-preencher cliente quando disponível
  useEffect(() => {
    if (clienteSelecionado) {
      agendamento.updateForm({
        clienteId: clienteSelecionado?.id,
        clienteNome: clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome,
        veiculoId: clienteSelecionado?.veiculoId,
        veiculoInfo: clienteSelecionado?.veiculoInfo || clienteSelecionado?.veiculo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteSelecionado]);

  // Handoff vindo do chat: preenche cliente e observacoes automaticamente.
  useEffect(() => {
    if (!handoffContext) return;
    agendamento.updateForm({
      clienteId: handoffContext.clienteId ?? agendamento.formData.clienteId,
      clienteNome: handoffContext.clienteNome ?? agendamento.formData.clienteNome,
      veiculoId: handoffContext.veiculoId ?? agendamento.formData.veiculoId,
      veiculoInfo: handoffContext.veiculoInfo ?? agendamento.formData.veiculoInfo,
      observacoes: handoffContext.observacoes ?? agendamento.formData.observacoes,
    });
    if (agendamento.etapa === 'tipo') {
      agendamento.avancarEtapa();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoffContext]);

  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);

  const clienteNome = clienteSelecionado?.nomeCompleto || clienteSelecionado?.nome || agendamento.formData.clienteNome;

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {/* Header com progresso */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Agendar Serviço</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {agendamento.etapa === 'tipo' && 'Etapa 1/3 — Tipo de serviço'}
            {agendamento.etapa === 'data' && 'Etapa 2/3 — Data e horário'}
            {agendamento.etapa === 'confirmacao' && 'Etapa 3/3 — Confirmação'}
          </p>
        </div>
        {/* Progress bar */}
        <div className="ml-auto flex items-center gap-1.5">
          {['tipo', 'data', 'confirmacao'].map((step, i) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= ['tipo', 'data', 'confirmacao'].indexOf(agendamento.etapa)
                  ? 'w-8 bg-blue-500'
                  : 'w-4 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Cliente ativo badge */}
      {clienteNome && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Cliente: {clienteNome}
          </span>
        </div>
      )}

      {handoffContext?.origem === 'chat' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Dados recebidos do chat. Revise e confirme o agendamento.
        </div>
      )}

      {/* Erro / Sucesso */}
      {agendamento.erro && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {agendamento.erro}
        </div>
      )}
      {agendamento.sucesso && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {agendamento.sucesso}
        </div>
      )}

      {/* ════════════════════ ETAPA 1: TIPO ════════════════════ */}
      {agendamento.etapa === 'tipo' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tipo de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(TIPO_INFO).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => agendamento.updateForm({ tipo: key })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    agendamento.formData.tipo === key
                      ? `${info.color} ring-2 ring-blue-400 shadow-sm`
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{info.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{info.desc}</div>
                    </div>
                    {agendamento.formData.tipo === key && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Observações */}
            <div className="pt-2">
              <Label htmlFor="ag-obs" className="text-sm">Observações (opcional)</Label>
              <Textarea
                id="ag-obs"
                value={agendamento.formData.observacoes}
                onChange={(e) => agendamento.updateForm({ observacoes: e.target.value })}
                placeholder="Descreva o problema ou serviço desejado..."
                rows={2}
                className="mt-1"
              />
            </div>

            <Button onClick={agendamento.avancarEtapa} className="w-full gap-2">
              Próximo: Escolher Data <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════ ETAPA 2: DATA E HORÁRIO ════════════════════ */}
      {agendamento.etapa === 'data' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Data e Horário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Data */}
            <div>
              <Label htmlFor="ag-data">Data do Agendamento</Label>
              <Input
                id="ag-data"
                type="date"
                min={hoje}
                value={agendamento.formData.dataAgendamento}
                onChange={(e) => agendamento.updateForm({ dataAgendamento: e.target.value, horaAgendamento: '' })}
                className="mt-1"
              />
            </div>

            {/* Horários disponíveis */}
            {agendamento.loading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Verificando disponibilidade...</span>
              </div>
            ) : agendamento.formData.dataAgendamento && agendamento.horarios.length > 0 ? (
              <div>
                <Label className="mb-2 block">Horários Disponíveis</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {agendamento.horarios.map((h) => (
                    <button
                      key={h.hora}
                      disabled={!h.disponivel}
                      onClick={() => agendamento.updateForm({ horaAgendamento: h.hora })}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${
                        agendamento.formData.horaAgendamento === h.hora
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : h.disponivel
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through'
                      }`}
                    >
                      {h.hora}
                    </button>
                  ))}
                </div>
              </div>
            ) : agendamento.formData.dataAgendamento ? (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                Nenhum horário disponível para esta data.
              </div>
            ) : null}

            {/* Navegação */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={agendamento.voltarEtapa} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                onClick={agendamento.avancarEtapa}
                disabled={!agendamento.formData.dataAgendamento || !agendamento.formData.horaAgendamento}
                className="flex-1 gap-2"
              >
                Confirmar <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════ ETAPA 3: CONFIRMAÇÃO ════════════════════ */}
      {agendamento.etapa === 'confirmacao' && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Confirmar Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{TIPO_INFO[agendamento.formData.tipo]?.icon}</span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {TIPO_INFO[agendamento.formData.tipo]?.label}
                  </div>
                  <div className="text-xs text-slate-500">{TIPO_INFO[agendamento.formData.tipo]?.desc}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 opacity-60" />
                  <span>
                    {new Date(agendamento.formData.dataAgendamento + 'T12:00').toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 opacity-60" />
                  <span>{agendamento.formData.horaAgendamento}</span>
                </div>
              </div>

              {clienteNome && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 opacity-60" />
                  <span>{clienteNome}</span>
                </div>
              )}

              {agendamento.formData.observacoes && (
                <div className="text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  📝 {agendamento.formData.observacoes}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={agendamento.voltarEtapa} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                onClick={agendamento.confirmarAgendamento}
                disabled={agendamento.loading}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                {agendamento.loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Agendando...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Confirmar Agendamento</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ════════════════════ AGENDAMENTOS PRÓXIMOS ════════════════════ */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Próximos Agendamentos
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={agendamento.carregarAgendamentos}
              disabled={agendamento.loadingAgendamentos}
              className="h-8 px-2"
            >
              <RefreshCw className={`w-4 h-4 ${agendamento.loadingAgendamentos ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {agendamento.loadingAgendamentos ? (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          ) : agendamento.agendamentos.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum agendamento nos próximos 7 dias</p>
            </div>
          ) : (
            <div className="space-y-2">
              {agendamento.agendamentos.slice(0, 5).map((ag) => (
                <div
                  key={ag.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">{TIPO_INFO[ag.tipo]?.icon || '📅'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {ag.clienteNome || `OS #${ag.servicoId}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(ag.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        {' · '}
                        {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        ag.status === 'confirmado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        ag.status === 'cancelado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {ag.status}
                    </Badge>
                    {ag.status === 'confirmado' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Cancelar"
                        onClick={() => agendamento.cancelar(ag.id, 'Cancelado pelo usuário')}
                      >
                        <XCircle className="w-4 h-4" />
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
};

export default AgendamentoTab;
