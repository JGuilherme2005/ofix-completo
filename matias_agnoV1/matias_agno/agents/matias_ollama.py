"""
matias_ollama.py — Ollama variant of the Matias agent.

M3-AI-04: Re-uses INSTRUCTIONS / PUBLIC_INSTRUCTIONS from matias.py
(single source of truth). Fixed public agent using wrong prompt.
"""

import os
from agno.agent import Agent
from agno.models.ollama import Ollama

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.tools.simulate import simulate_vehicle_scenario
from matias_agno.storage.memory import get_memory_storage

# ── Single source of truth for prompts (M3-AI-01) ────────────────────────────
from matias_agno.agents.matias import INSTRUCTIONS, PUBLIC_INSTRUCTIONS, _pi_guardrail

from ollama import Client as OllamaClient

def create_matias_ollama_agent():
    # Inicializar Knowledge Base Unificada
    knowledge_base = get_knowledge_base()
    knowledge_enabled = knowledge_base is not None
    
    # Configurar cliente com host remoto (via variável de ambiente ou default hardcoded)
    ollama_host = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_client = OllamaClient(host=ollama_host)
    
    return Agent(
        id="matias",
        name="Matias (Ollama)",
        role="Assistente Técnico de Oficina Automotiva",
        instructions=INSTRUCTIONS,
        model=Ollama(
            id="qwen2.5:7b",
            client=ollama_client,
            options={
                "temperature": 0.3,      # Mais focado, menos criativo (evita alucinação)
                "repeat_penalty": 1.1,   # Evita repetição de frases
                "top_p": 0.9,
                "stop": ["<|im_end|>", "<|im_start|>", "<|endoftext|>"] # Stop tokens essenciais para Qwen
            }
        ),
        # Knowledge Base Nativa
        knowledge=knowledge_base,
        search_knowledge=knowledge_enabled,  # Habilita busca automatica apenas quando configurada
        
        tools=[simulate_vehicle_scenario],
        # M3-AI-03: PromptInjectionGuardrail blocks jailbreak/injection attempts.
        pre_hooks=[_pi_guardrail] if _pi_guardrail else [],
        markdown=True,
        debug_mode=False,
        description="Assistente especializado em oficina automotiva rodando via Ollama Remoto",
        add_dependencies_to_context=True,
        
        # Sistema de Memória (Restaurado com tabela v3)
        # O argumento correto para essa versão é 'db' (conforme código original)
        # A tabela v3 no memory.py resolverá o conflito de schema
        db=get_memory_storage(),
        add_history_to_context=True,
        num_history_runs=5,
    )


def create_matias_ollama_public_agent():
    """Public agent (Ollama): no memory, no knowledge, read-only orientation."""
    ollama_host = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_client = OllamaClient(host=ollama_host)

    return Agent(
        id="matias-public",
        name="Matias Public (Ollama)",
        role="Assistente Tecnico de Oficina Automotiva (Publico)",
        instructions=PUBLIC_INSTRUCTIONS,
        model=Ollama(
            id="qwen2.5:7b",
            client=ollama_client,
            options={
                "temperature": 0.3,
                "repeat_penalty": 1.1,
                "top_p": 0.9,
                "stop": ["<|im_end|>", "<|im_start|>", "<|endoftext|>"],
            },
        ),
        knowledge=None,
        search_knowledge=False,
        tools=[simulate_vehicle_scenario],
        # M3-AI-03: PromptInjectionGuardrail — also on public Ollama agent.
        pre_hooks=[_pi_guardrail] if _pi_guardrail else [],
        markdown=True,
        debug_mode=False,
        description="Assistente publico (somente leitura, sem memoria persistente, sem tenant)",
        # Public: completely stateless — no DB, no memory, no history.
        add_dependencies_to_context=False,
        db=None,
        enable_user_memories=False,
        enable_session_summaries=False,
        add_history_to_context=False,
        num_history_runs=0,
    )
