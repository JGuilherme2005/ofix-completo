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


def _select_model():
    groq_api_key = (os.getenv("GROQ_API_KEY") or "").strip()
    if groq_api_key:
        # Groq uses GROQ_API_KEY from env by default.
        model_id = (os.getenv("GROQ_MODEL_ID") or "llama-3.3-70b-versatile").strip()
        return Groq(id=model_id)

    hf_token = (os.getenv("HF_TOKEN") or "").strip()
    if hf_token:
        return HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token)

    raise ValueError("Missing LLM credentials: set GROQ_API_KEY or HF_TOKEN")


def create_matias_agent():
    # Knowledge Base (optional)
    knowledge_base = get_knowledge_base()
    knowledge_enabled = knowledge_base is not None

    return Agent(
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
        db=get_memory_storage(),
        enable_user_memories=True,
        enable_session_summaries=True,
        add_history_to_context=True,
        num_history_runs=5,
    )

