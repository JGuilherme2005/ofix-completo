"""
API personalizada para integração com o frontend Ofix.
Expõe endpoints compatíveis com o contrato esperado pelo useChatAPI.js
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Modelos de request/response
class ChatRequest(BaseModel):
    message: str
    contexto_conversa: List[Dict[str, Any]] = []
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    tipo: str = "texto"
    conteudo: str
    timestamp: Optional[str] = None
    confidence: Optional[float] = None

class ContextoResponse(BaseModel):
    status: str = "online"
    versao: str = "1.0.0"
    modelo: str = "Groq Llama 3.3 70B"

class HistoricoResponse(BaseModel):
    mensagens: List[Dict[str, Any]] = []

# Router
router = APIRouter(prefix="/agno", tags=["ofix"])

# Referência para o agente (será injetada no main.py)
_agent = None

def set_agent(agent):
    """Configura o agente para uso nas rotas"""
    global _agent
    _agent = agent

@router.post("/chat-inteligente", response_model=ChatResponse)
async def chat_inteligente(request: ChatRequest):
    """
    Endpoint principal de conversação.
    Compatível com o frontend Ofix (useChatAPI.js)
    """
    if not _agent:
        raise HTTPException(status_code=500, detail="Agente não inicializado")
    
    try:
        logger.info(f"Recebida mensagem: {request.message[:50]}...")
        
        # Executar o agente
        response = _agent.run(
            request.message,
            session_id=request.session_id,
            user_id=request.user_id
        )
        
        # Formatar resposta no formato esperado pelo frontend
        return ChatResponse(
            tipo="texto",
            conteudo=response.content,
            timestamp=None,  # Poderia adicionar se necessário
            confidence=None  # Poderia calcular baseado no contexto
        )
    
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contexto-sistema", response_model=ContextoResponse)
async def contexto_sistema():
    """
    Retorna status e informações do sistema.
    Usado pelo frontend para verificar conectividade.
    """
    return ContextoResponse(
        status="online",
        versao="1.0.0",
        modelo="Groq Llama 3.3 70B" if _agent else "Não inicializado"
    )

@router.get("/historico-conversa", response_model=HistoricoResponse)
async def historico_conversa(usuario_id: str = "default"):
    """
    Retorna histórico de conversas.
    Nota: Implementação básica. O Agno gerencia memória internamente.
    """
    # Por enquanto, retornamos vazio
    # O Agno gerencia a memória automaticamente via db
    return HistoricoResponse(mensagens=[])
