import os
from dotenv import load_dotenv
from agno.os import AgentOS
from fastapi.middleware.cors import CORSMiddleware

# Carregar variáveis de ambiente ANTES de importar outros módulos
load_dotenv()

from matias_agno.agents.matias import create_matias_agent, create_matias_public_agent
from matias_agno.agents.matias_ollama import create_matias_ollama_agent, create_matias_ollama_public_agent
from matias_agno.api import router as ofix_router, set_agent

# Configuração de Agente
use_ollama = os.getenv("OLLAMA_ENABLED", "false").lower() == "true"

# Hardening: AgentOS becomes publicly accessible when OS_SECURITY_KEY is missing.
# Fail fast unless explicitly allowed for local development.
allow_insecure = os.getenv("ALLOW_INSECURE_AGENTOS", "false").lower() == "true"
os_security_key = (os.getenv("OS_SECURITY_KEY") or "").strip()
if not os_security_key:
    if allow_insecure:
        print("[security] WARNING: OS_SECURITY_KEY not set; AgentOS auth is DISABLED (ALLOW_INSECURE_AGENTOS=true).")
    else:
        raise RuntimeError(
            "OS_SECURITY_KEY is required to run AgentOS securely. "
            "Set OS_SECURITY_KEY (recommended) or set ALLOW_INSECURE_AGENTOS=true only for local development."
        )

if use_ollama:
    print("🔄 Modo: OLLAMA (Remoto)")
    matias = create_matias_ollama_agent()
    matias_public = create_matias_ollama_public_agent()
else:
    print("🔄 Modo: PREDEFINIDO (HuggingFace)")
    matias = create_matias_agent()
    matias_public = create_matias_public_agent()

# Configurar AgentOS
agent_os = AgentOS(
    agents=[matias, matias_public],
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
