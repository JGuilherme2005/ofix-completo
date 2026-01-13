from agno.agent import Agent
from agno.models.huggingface import HuggingFace
from agno.tools.duckduckgo import DuckDuckGoTools
import os

# Token do HuggingFace
hf_token = os.getenv("HF_TOKEN", "").strip()

def get_researcher_agent():
    """Retorna o Agente Pesquisador configurado"""
    return Agent(
        name="Pesquisador Automotivo",
        role="Especialista em pesquisa técnica avançada na web",
        model=HuggingFace(
            id="Qwen/Qwen2.5-7B-Instruct",
            api_key=hf_token
        ),
        tools=[DuckDuckGoTools()],
        instructions="""Você é um pesquisador técnico automotivo de elite.

Sua missão é encontrar informações que NÃO estão nos manuais internos:
- Boletins técnicos recentes (TSBs)
- Recalls de montadoras
- Problemas crônicos relatados em fóruns especializados
- Novas tecnologias e procedimentos

Ao pesquisar:
1. Use termos técnicos precisos
2. Verifique a credibilidade das fontes
3. Sintetize a informação citando a fonte (URL)

Se não encontrar nada confiável, diga claramente.""",
        markdown=True,
    )
