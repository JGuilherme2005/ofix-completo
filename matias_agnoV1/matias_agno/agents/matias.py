import os

from agno.agent import Agent
from agno.models.groq import Groq
from agno.models.huggingface import HuggingFace

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.storage.memory import get_memory_storage
from matias_agno.tools.simulate import simulate_vehicle_scenario

INSTRUCTIONS = """Voce e o Matias, assistente tecnico especializado em oficina automotiva.

INSTRUCOES:
- Seja tecnico mas didatico.
- Use a base de conhecimento quando estiver configurada (diagnosticos, precos, procedimentos e especificacoes).
- Se a base de conhecimento nao estiver configurada, responda com conhecimento geral e sinalize quando algo pode variar por veiculo/ano/motor.
- Se a busca retornar a informacao tecnica solicitada (ex: torques, especificacoes), responda diretamente e alerte que pode variar.
- Use a ferramenta simulate_vehicle_scenario quando detectar perguntas hipoteticas/preditivas (\"e se...\", \"o que acontece se...\", \"qual o risco de...\", etc).
- Pergunte sobre modelo e ano apenas se for crucial e nao estiver nos documentos encontrados.
- Lembre informacoes anteriores do cliente (historico de conversas) quando relevante.

Sempre termine perguntando se o cliente precisa de mais informacoes."""

PUBLIC_INSTRUCTIONS = """Voce e o Matias, assistente tecnico de oficina automotiva (modo publico).

REGRAS IMPORTANTES (PUBLICO):
- Responda apenas duvidas gerais e orientacoes tecnicas genericas.
- Nao solicite, nao armazene e nao repita dados pessoais/sensiveis (CPF, telefone, endereco, etc).
- Nao invente dados da oficina (endereco, horarios, status de OS, precos internos). Se nao souber, diga que nao tem essa informacao.
- Se o usuario pedir status de OS/orcamento, explique que e necessario validacao (ex: Numero da OS + Placa do veiculo ou 4 ultimos digitos do telefone) e oriente a usar o canal oficial/autenticado.
- Nao execute acoes no sistema (sem criar/alterar OS, agendamentos, clientes, pecas). Apenas orientar.

Sempre termine perguntando se o cliente precisa de mais informacoes."""


def _select_model():
    groq_api_key = (os.getenv("GROQ_API_KEY") or "").strip()
    if groq_api_key:
        # Groq uses GROQ_API_KEY from env by default.
        model_id = (os.getenv("GROQ_MODEL_ID") or "llama-3.3-70b-versatile").strip()
        return Groq(id=model_id)

    hf_token = (os.getenv("HF_TOKEN") or "").strip()
    if not hf_token:
        # Do not crash the service on missing credentials; return a clear error on run instead.
        print("[matias] Missing GROQ_API_KEY and HF_TOKEN; model calls will fail until one is configured.")

    return HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token)


def create_matias_agent():
    # Knowledge Base (optional)
    knowledge_base = get_knowledge_base()
    knowledge_enabled = knowledge_base is not None

    return Agent(
        id="matias",
        name="Matias",
        role="Assistente Tecnico de Oficina Automotiva",
        instructions=INSTRUCTIONS,
        model=_select_model(),
        knowledge=knowledge_base,
        search_knowledge=knowledge_enabled,
        tools=[simulate_vehicle_scenario],
        markdown=True,
        debug_mode=False,
        description="Assistente especializado em oficina automotiva com base de conhecimento (quando configurada)",
        add_dependencies_to_context=True,
        db=get_memory_storage(),
        enable_user_memories=True,
        enable_session_summaries=True,
        add_history_to_context=True,
        num_history_runs=5,
    )


def create_matias_public_agent():
    # Public agent: no DB-backed memory and no internal knowledge base until we have a dedicated public KB.
    return Agent(
        id="matias-public",
        name="Matias Public",
        role="Assistente Tecnico de Oficina Automotiva (Publico)",
        instructions=PUBLIC_INSTRUCTIONS,
        model=_select_model(),
        knowledge=None,
        search_knowledge=False,
        tools=[simulate_vehicle_scenario],
        markdown=True,
        debug_mode=False,
        description="Assistente publico (somente leitura, sem memoria persistente)",
        db=None,
        enable_user_memories=False,
        enable_session_summaries=False,
        add_history_to_context=False,
        num_history_runs=0,
    )
