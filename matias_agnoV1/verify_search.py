import os
from dotenv import load_dotenv
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
import lancedb
import ast

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_REGION = "us-east-1"
TABLE_NAME = "conhecimento_oficina_v5_completo"  # Tabela atualizada com 713 docs

def verify_search():
    print("🔄 Conectando ao LanceDB...")
    db = lancedb.connect(
        uri=LANCEDB_URI,
        api_key=LANCEDB_API_KEY,
        region=LANCEDB_REGION
    )
    table = db.open_table(TABLE_NAME)
    
    query = "quanto custa troca de óleo"
    print(f"🔍 Buscando por: '{query}'")
    
    embedder = FastEmbedEmbedder()
    query_vector = embedder.get_embedding(query)
    
    try:
        # Tenta busca híbrida (reranking implícito pelo LanceDB)
        # Sintaxe correta pode variar dependendo da versão do client
        print("Tentando busca híbrida...")
        results = table.search(query, query_type="hybrid").limit(5).to_list()
        print(f"✅ Busca híbrida retornou {len(results)} resultados.")
    except Exception as e:
        print(f"❌ Erro na busca híbrida: {e}")
        import traceback
        traceback.print_exc()
        results = []

    if not results:
        print("⚠️ Tentando busca vetorial pura...")
        results = table.search(query_vector).limit(5).to_list()

    print("\n--- RESULTADOS ---")
    for i, result in enumerate(results, 1):
        text = result.get("text", "")
        metadata_str = result.get("metadata", "{}")
        score = result.get("_distance", "N/A")
        
        try:
            metadata = ast.literal_eval(metadata_str) if isinstance(metadata_str, str) else metadata_str
        except:
            metadata = {}
            
        source = metadata.get("source", "Desconhecido")
        filename = metadata.get("filename", "N/A")
        
        print(f"\n{i}. [{filename}] (Distance: {score})")
        print(f"   Fonte: {source}")
        print(f"   Conteúdo: {text[:500]}...")
        print("-" * 80)

if __name__ == "__main__":
    verify_search()
