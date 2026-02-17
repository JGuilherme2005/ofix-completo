import os

import lancedb
from agno.tools import tool
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder

# Reuse the same env vars as knowledge/base.py
_LANCEDB_URI = os.getenv("LANCEDB_URI", "db://ofx-rbf7i6").strip()
_LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY", "").strip()
_LANCEDB_TABLE = os.getenv("LANCEDB_TABLE", "conhecimento_oficina_v5_completo").strip()


def _get_lancedb_connection():
    """Open a LanceDB connection (cloud or local)."""
    kwargs = {"uri": _LANCEDB_URI}
    if _LANCEDB_API_KEY:
        kwargs["api_key"] = _LANCEDB_API_KEY
    return lancedb.connect(**kwargs)

@tool
def buscar_conhecimento(query: str) -> str:
    """
    Busca informações técnicas na base de conhecimento da oficina.
    Use esta ferramenta SEMPRE que o cliente fizer perguntas sobre:
    - Diagnósticos automotivos
    - Preços de serviços
    - Procedimentos técnicos
    - Peças e componentes
    - Legislação e normas
    
    Args:
        query: Termo ou pergunta para buscar na base de conhecimento
        
    Returns:
        Informações relevantes encontradas nos documentos da oficina
    """
    try:
        db_lance = _get_lancedb_connection()
        table = db_lance.open_table(_LANCEDB_TABLE)
        
        # --- BUSCA HÍBRIDA (Vetorial + Palavra-chave) ---
        # Tenta usar busca híbrida para melhor precisão (requer índice FTS)
        # Se falhar (ex: índice não existe), faz fallback para vetorial
        
        embedder = FastEmbedEmbedder()
        query_vector = embedder.get_embedding(query)
        
        # Busca vetorial robusta (Hybrid search requer setup complexo de embedding function no remoto)
        results = table.search(query_vector).limit(10).to_list()
        
        # Formatar resultados
        if not results:
            return "Nenhuma informação encontrada na base de conhecimento."
        
        import ast
        knowledge_text = "📚 INFORMAÇÕES DA BASE DE CONHECIMENTO:\n\n"
        for i, result in enumerate(results, 1):
            text = result.get("text", "")
            
            # Parsear metadados que estão como string
            metadata_str = result.get("metadata", "{}")
            try:
                metadata = ast.literal_eval(metadata_str) if isinstance(metadata_str, str) else metadata_str
            except:
                metadata = {}
                
            source = metadata.get("source", "Desconhecido")
            category = metadata.get("category", "N/A")
            
            knowledge_text += f"{i}. 📁 {source}\n"
            knowledge_text += f"   🏷️  Categoria: {category}\n"
            knowledge_text += f"   📝 {text[:400]}...\n\n"
        
        return knowledge_text
    
    except Exception as e:
        return f"⚠️ Erro ao buscar conhecimento: {str(e)}"
