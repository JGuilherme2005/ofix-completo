from agno.agent import Agent
from agno.models.huggingface import HuggingFace
from agno.team import Team
from agno.db.sqlite import SqliteDb
import os

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.tools.simulate import simulate_vehicle_scenario

# Token do HuggingFace
hf_token = os.getenv("HF_TOKEN", "").strip()

# Agente Especialista em Diagnóstico Técnico
diagnostic_agent = Agent(
    name="Especialista em Diagnóstico",
    role="Engenheiro mecânico especializado em diagnósticos automotivos",
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token),
    knowledge=get_knowledge_base(),
    search_knowledge=True,
    tools=[simulate_vehicle_scenario],
    instructions="""Você é um engenheiro mecânico especializado em diagnóstico automotivo.

REGRAS CRÍTICAS:
- Seja DIRETO e CONCISO (máximo 3-4 parágrafos)
- Use linguagem simples e acessível
- NÃO use tags HTML ou XML
- NÃO crie listas enormes de procedimentos
- Foque no problema ATUAL do cliente

Foco em:
- Identificar a causa mais provável do problema
- Sugerir 2-3 ações práticas PRIORITÁRIAS
- Indicar nível de urgência (baixo/médio/alto)

NÃO fale sobre preços ou atendimento.""",
    markdown=True,
)

# Agente Especialista em Peças e Orçamentos
parts_agent = Agent(
    name="Especialista em Peças e Preços",
    role="Especialista em orçamento e gestão de peças automotivas",
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token),
    knowledge=get_knowledge_base(),
    search_knowledge=True,
    instructions="""Você é um especialista em peças e orçamentos automotivos.

REGRAS CRÍTICAS:
- Seja DIRETO e OBJETIVO (máximo 2-3 parágrafos)
- NÃO use tags HTML ou XML
- Sempre forneça valores aproximados quando possível
- Se faltar informação, peça de forma clara e breve

Foco em:
- Preços de peças (original vs. paralela)
- Custo estimado de mão de obra
- Orçamento total aproximado

NÃO faça diagnósticos técnicos.""",
    markdown=True,
)

# Agente Recepcionista (Atendimento ao Cliente)
receptionist_agent = Agent(
    name="Recepcionista",
    role="Atendente cordial especializado em comunicação com clientes",
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token),
    instructions="""Você é o recepcionista amigável da oficina.

REGRAS CRÍTICAS:
- Seja CORDIAL e BREVE (máximo 2-3 linhas)
- NÃO use tags HTML ou XML
- Use emojis de forma moderada (1-2 por mensagem)
- Fale de forma natural e acolhedora

Foco em:
- Saudação calorosa e profissional
- Coletar informações essenciais (veículo, problema)
- Tranquilizar o cliente

NÃO diagnostique nem dê preços. Delegue para especialistas.""",
    markdown=True,
)

# Criar Team
matias_team = Team(
    name="Equipe Matias",
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token),
    db=SqliteDb(db_file="tmp/team_sessions.db"),
    members=[receptionist_agent, diagnostic_agent, parts_agent],
    share_member_interactions=True,  # Agentes podem ver respostas uns dos outros
    instructions=[
        "Você coordena uma equipe de especialistas automotivos.",
        "1º: Use o Recepcionista para saudações e coleta inicial",
        "2º: Use o Especialista em Diagnóstico para problemas técnicos",
        "3º: Use o Especialista em Peças para orçamentos",
        "",
        "REGRAS DE FORMATAÇÃO:",
        "- NÃO inclua tags HTML como <tool_response>",
        "- Sintetize as respostas em 3-5 parágrafos curtos",
        "- Use markdown simples: **negrito**, listas com -",
        "- Seja direto e objetivo com o cliente",
    ],
    show_members_responses=False,  # Sintetizar tudo em UMA resposta completa
    markdown=True,
)

def get_matias_team():
    """Retorna o Team configurado do Matias"""
    return matias_team
