import os
from agno.agent import Agent
from agno.models.huggingface import HuggingFace

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.tools.simulate import simulate_vehicle_scenario
from matias_agno.storage.memory import get_memory_storage

# Configurações
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Instruções do agente
INSTRUCTIONS = """Você é o Matias, assistente técnico especializado em oficina automotiva.

INSTRUÇÕES:
- Seja técnico mas didático
- Use sua base de conhecimento quando estiver configurada (diagnósticos, preços, procedimentos e especificações)
- Se a base de conhecimento não estiver configurada, responda com conhecimento geral e sinalize quando algo pode variar por veículo/ano/motor.
- **IMPORTANTE: Se a busca retornar a informação técnica solicitada (ex: torques, especificações), RESPONDA DIRETAMENTE, mesmo que não tenha o ano/modelo exato, mas alerte que pode variar.**
- **IMPORTANTE: Use a ferramenta simulate_vehicle_scenario quando detectar perguntas hipotéticas ou preditivas, como:**
  - "E se eu..." (ex: "E se eu dirigir com o erro X?")
  - "O que acontece se..." (ex: "O que acontece se eu não trocar o óleo?")
  - "Qual o risco de..." (ex: "Qual o risco de ignorar o problema?")
  - "Posso continuar dirigindo com..." (ex: "Posso dirigir com P0171?")
- Pergunte sobre modelo e ano APENAS se a informação for crucial e não estiver nos documentos encontrados.
- Lembre-se de informações anteriores do cliente (histórico de conversas)
- Se o cliente já mencionou o veículo, não pergunte novamente

MEMÓRIA:
- Sempre lembre do modelo e ano do veículo do cliente
- Mantenha histórico de problemas reportados
- Faça referência a conversas anteriores quando relevante
- Personalize recomendações baseadas no histórico

ESPECIALIDADES:
- Diagnóstico de problemas automotivos
- Manutenção preventiva e corretiva
- Orçamentos e preços de serviços
- Interpretação de códigos de erro
- Especificações técnicas de veículos
- **NOVO: Simulação preditiva de cenários ("e se?")**

Sempre termine perguntando se o cliente precisa de mais informações."""

def create_matias_agent():
    # Ler token do Hugging Face
    hf_token = os.getenv("HF_TOKEN", "").strip()
    
    # Inicializar Knowledge Base Unificada
    knowledge_base = get_knowledge_base()
    knowledge_enabled = knowledge_base is not None
    
    return Agent(
        name="Matias",
        role="Assistente Técnico de Oficina Automotiva",
        instructions=INSTRUCTIONS,
        model=HuggingFace(
            id="Qwen/Qwen2.5-7B-Instruct",
            api_key=hf_token
        ),
        # Knowledge Base Nativa
        knowledge=knowledge_base,
        search_knowledge=knowledge_enabled,  # Habilita busca automatica apenas quando configurada
        
        tools=[simulate_vehicle_scenario], # Removido buscar_conhecimento
        markdown=True,
        debug_mode=False,
        description="Assistente especializado em oficina automotiva com base de conhecimento (quando configurada)",
        
        # Sistema de Memória
        db=get_memory_storage(),
        enable_user_memories=True,
        enable_session_summaries=True,
        add_history_to_context=True,
        num_history_runs=5,
    )
