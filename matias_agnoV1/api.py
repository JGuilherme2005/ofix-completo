from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from matias_agno.agents.matias import create_matias_agent
import uvicorn
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

app = FastAPI(title="Matias Agno API", version="1.0")

# Modelo de requisição
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    user_id: str = "anonymous"

# Instância do Matias Agent (carregada uma vez)
try:
    matias = create_matias_agent()
    print("✅ Matias Agent carregado com sucesso!")
except Exception as e:
    print(f"❌ Erro ao carregar Matias Agent: {e}")
    matias = None

@app.get("/health")
def health_check():
    return {"status": "ok", "agent_loaded": matias is not None}

@app.post("/chat")
def chat(request: ChatRequest):
    if not matias:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    try:
        # Executar o agente com a mensagem do usuário
        response = matias.run(request.message, stream=False)
        
        return {
            "response": response.content,
            "session_id": request.session_id
        }
    except Exception as e:
        print(f"Erro no processamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
