from agno.agent import Agent
from agno.models.huggingface import HuggingFace
from agno.workflow import Workflow
from agno.workflow.step import Step
from agno.db.sqlite import SqliteDb
import os

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.tools.simulate import simulate_vehicle_scenario

# Agente 1: Coletor de Sintomas
symptom_collector = Agent(
    name="Coletor de Sintomas",
    role="Especialista em entrevista diagnóstica automotiva",
    model=HuggingFace(
        id="Qwen/Qwen2.5-7B-Instruct",
        api_key=os.getenv("HF_TOKEN", "").strip()
    ),
    instructions="""Você é um especialista em coleta de sintomas automotivos.

Sua ÚNICA tarefa é fazer perguntas para entender o problema do veículo:
- Que sintoma você percebeu? (barulho, luz, fumaça, etc.)
- Quando acontece? (marcha lenta, aceleração, freio, etc.)
- Já tentou algo para resolver?
- Modelo e ano do veículo (se ainda não informado)

NÃO tente diagnosticar. Apenas colete informações.
Faça UMA pergunta por vez, no máximo 3-4 perguntas.
Encerre com um resumo estruturado dos sintomas.""",
    markdown=True,
)

# Agente 2: Consultor Técnico
tech_consultant = Agent(
    name="Consultor Técnico",
    role="Especialista em diagnóstico técnico com acesso à base de conhecimento",
    model=HuggingFace(
        id="Qwen/Qwen2.5-7B-Instruct",
        api_key=os.getenv("HF_TOKEN", "").strip()
    ),
    knowledge=get_knowledge_base(),
    search_knowledge=True,
    instructions="""Você é um especialista técnico automotivo.

Receba o resumo de sintomas e:
1. Busque informações relevantes na base de conhecimento
2. Liste possíveis causas (do mais provável ao menos provável)
3. Sugira diagnósticos específicos (códigos de erro, testes, etc.)

Seja preciso e técnico. Cite os manuais quando relevante.""",
    markdown=True,
)

# Agente 3: Simulador de Cenários
scenario_simulator = Agent(
    name="Simulador de Cenários",
    role="Especialista em análise de risco e consequências",
    model=HuggingFace(
        id="Qwen/Qwen2.5-7B-Instruct",
        api_key=os.getenv("HF_TOKEN", "").strip()
    ),
    tools=[simulate_vehicle_scenario],
    instructions="""Você é um especialista em análise de cenários automotivos.

Receba o diagnóstico técnico e:
1. Use a ferramenta simulate_vehicle_scenario para avaliar riscos
2. Explique o que acontece se NÃO resolver (curto, médio, longo prazo)
3. Classifique urgência: CRÍTICO, URGENTE, MODERADO, BAIXO

Seja claro e direto sobre os riscos.""",
    markdown=True,
)

# Agente 4: Gerador de Relatório
report_generator = Agent(
    name="Gerador de Relatório",
    role="Especialista em síntese e orçamento",
    model=HuggingFace(
        id="Qwen/Qwen2.5-7B-Instruct",
        api_key=os.getenv("HF_TOKEN", "").strip()
    ),
    instructions="""Você é um especialista em comunicação com cliente.

Compile TUDO que foi descoberto (Sintomas + Diagnóstico + Cenários) e gere:

## 📋 RELATÓRIO DE DIAGNÓSTICO

**Sintomas Relatados:**
- [Liste os sintomas]

**Diagnóstico Técnico:**
- Causa Provável: [...]
- Causas Secundárias: [...]

**Análise de Risco:**
- Urgência: [CRÍTICO/URGENTE/MODERADO/BAIXO]
- O que acontece se não resolver: [...]

**Recomendação:**
- Próximo passo: [...]
- Orçamento estimado: [se disponível]

Seja didático e cordial.""",
    markdown=True,
)

# Criar steps
collect_step = Step(
    name="Coletar Sintomas",
    agent=symptom_collector,
)

diagnose_step = Step(
    name="Consultar Base Técnica",
    agent=tech_consultant,
)

simulate_step = Step(
    name="Simular Cenários",
    agent=scenario_simulator,
)

report_step = Step(
    name="Gerar Relatório Final",
    agent=report_generator,
)

# Criar Workflow
diagnostic_workflow = Workflow(
    name="Workflow de Diagnóstico Automotivo",
    description="Fluxo estruturado para diagnóstico de problemas veiculares",
    db=SqliteDb(
        session_table="diagnostic_workflow_sessions",
        db_file="tmp/diagnostic_workflow.db",
    ),
    steps=[collect_step, diagnose_step, simulate_step, report_step],
)

# Função auxiliar para criar o workflow
def get_diagnostic_workflow():
    return diagnostic_workflow
