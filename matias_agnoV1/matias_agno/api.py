"""
API personalizada para integração com o frontend Ofix.
Expõe endpoints compatíveis com o contrato esperado pelo useChatAPI.js
"""

import os

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

from matias_agno.storage.cleanup import run_cleanup

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


# ── M3-AI-04: Memory cleanup endpoint (called by Cron Job) ──────────────────

def _verify_cleanup_token(authorization: str | None) -> None:
    """
    Validates the Bearer token against OS_SECURITY_KEY (same key used by
    AgentOS auth).  This ensures only the backend / cron can trigger cleanup.
    """
    expected = (os.getenv("OS_SECURITY_KEY") or "").strip()
    if not expected:
        raise HTTPException(status_code=503, detail="OS_SECURITY_KEY not configured")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.removeprefix("Bearer ").strip()
    if token != expected:
        raise HTTPException(status_code=403, detail="Invalid token")


@router.post("/cleanup-memories")
async def cleanup_memories(
    dry_run: bool = False,
    authorization: Optional[str] = Header(None),
):
    """
    Purge expired Agno sessions & memories based on TTL policy.

    - Authenticated agent rows older than ``AGNO_AUTH_MEMORY_TTL_DAYS`` (default 30)
    - Public agent rows older than ``AGNO_PUBLIC_MEMORY_TTL_HOURS`` (default 1)

    Protected by ``OS_SECURITY_KEY`` Bearer token (same as AgentOS).
    Intended to be called by a Render / Railway Cron Job.

    Query param ``dry_run=true`` counts without deleting.
    """
    _verify_cleanup_token(authorization)

    result = run_cleanup(dry_run=dry_run)

    if not result.ok:
        raise HTTPException(status_code=500, detail=result.to_dict())

    return result.to_dict()
