import os
from agno.knowledge import Knowledge
from agno.vectordb.lancedb import LanceDb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder

# Configurações
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY", "sk_5Z3CCATFO5ELBPAQ2CNF5ZFMTZTDN2IHPNYKQLC3YFQ54AXPDOXA====")
LANCEDB_URI = os.getenv("LANCEDB_URI", "db://ofx-rbf7i6")
TABLE_NAME = "conhecimento_oficina_v5_completo"

def get_knowledge_base():
    """
    Retorna a Base de Conhecimento Unificada do Agno.
    Usa LanceDB (Cloud) como VectorDB.
    """
    
    # Configuração do Vector DB (LanceDB Cloud)
    vector_db = LanceDb(
        table_name=TABLE_NAME,
        uri=LANCEDB_URI,
        api_key=LANCEDB_API_KEY,
        search_type="hybrid", # Habilita busca híbrida (Vetorial + Texto)
        embedder=FastEmbedEmbedder(), # Usa FastEmbed (padrão do projeto)
    )

    # Criação do Knowledge Unificado
    # O Agno gerencia automaticamente a conexão e a busca
    knowledge = Knowledge(
        vector_db=vector_db,
        # Opcional: Se quisermos usar contents_db separado no futuro, adicionamos aqui.
        # Por enquanto, o LanceDB já guarda o conteúdo no campo 'content' ou 'text'.
    )
    
    return knowledge
