import os
from agno.agent import Agent
from agno.models.ollama import Ollama

from matias_agno.knowledge.base import get_knowledge_base
from matias_agno.tools.simulate import simulate_vehicle_scenario
from matias_agno.storage.memory import get_memory_storage

# Instruções do agente (Mesmas do Matias original)
INSTRUCTIONS = """Você é o Matias, assistente técnico especializado em oficina automotiva.

INSTRUÇÕES:
- Seja técnico mas didático
- Use sua base de conhecimento SEMPRE que o cliente perguntar sobre diagnósticos, preços ou procedimentos
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

from ollama import Client as OllamaClient

def create_matias_ollama_agent():
    # Inicializar Knowledge Base Unificada
    knowledge_base = get_knowledge_base()
    
    # Configurar cliente com host remoto (via variável de ambiente ou default hardcoded)
    ollama_host = os.getenv("OLLAMA_BASE_URL", "https://holly-unlame-nonmetaphorically.ngrok-free.dev")
    ollama_client = OllamaClient(host=ollama_host)

    return Agent(
        name="Matias (Ollama)",
        role="Assistente Técnico de Oficina Automotiva",
        instructions=INSTRUCTIONS,
        model=Ollama(
            id="qwen2.5:7b",
            client=ollama_client
        ),
        # Knowledge Base Nativa
        knowledge=knowledge_base,
        search_knowledge=True, # Habilita busca automática
        
        tools=[simulate_vehicle_scenario],
        markdown=True,
        debug_mode=False,
        description="Assistente especializado em oficina automotiva rodando via Ollama Remoto",
        
        # Sistema de Memória
        db=get_memory_storage(),
        enable_user_memories=True,
        enable_session_summaries=True,
        add_history_to_context=True,
        num_history_runs=5,
    )
