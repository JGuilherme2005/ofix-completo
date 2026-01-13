import os
from dotenv import load_dotenv
from agno.os import AgentOS
from fastapi.middleware.cors import CORSMiddleware

# Carregar variáveis de ambiente ANTES de importar outros módulos
load_dotenv()

from matias_agno.agents.matias import create_matias_agent
from matias_agno.agents.matias_ollama import create_matias_ollama_agent
from matias_agno.api import router as ofix_router, set_agent

# Configuração de Agente
use_ollama = os.getenv("OLLAMA_ENABLED", "false").lower() == "true"

if use_ollama:
    print("🔄 Modo: OLLAMA (Remoto)")
    matias = create_matias_ollama_agent()
else:
    print("🔄 Modo: PREDEFINIDO (HuggingFace)")
    matias = create_matias_agent()

# Configurar AgentOS
agent_os = AgentOS(
    agents=[matias],
    description="OFIX - Assistente AI Especializado em Oficina Automotiva com Memória",
)

# Obter app FastAPI
app = agent_os.get_app()

# Configurar CORS para permitir requisições do frontend Ofix
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:7777",
        "https://os.agno.com",
        "https://app.agno.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adicionar rotas personalizadas para Ofix
set_agent(matias)
app.include_router(ofix_router)

if __name__ == "__main__":
    import uvicorn
    
    # Usar porta do ambiente (Render) ou 8001 local
    port = int(os.getenv("PORT", "8001"))
    
    print("\n" + "="*80)
    print("🚗 MATIAS AI - AgentOS (Refatorado)")
    print("="*80)
    print(f"🌐 Servidor: http://0.0.0.0:{port}")
    print("="*80 + "\n")
    
    # Servir aplicação
    uvicorn.run(app, host="0.0.0.0", port=port)
