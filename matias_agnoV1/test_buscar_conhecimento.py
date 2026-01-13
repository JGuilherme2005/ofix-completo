"""
Script para testar a ferramenta buscar_conhecimento diretamente
"""
import os
import sys
from dotenv import load_dotenv

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

load_dotenv()

# Importar a ferramenta
from matias_agno.tools.search import buscar_conhecimento

def test_search():
    # Importar diretamente a função de busca sem o decorador
    from matias_agno.knowledge.base import get_lancedb_connection, TABLE_NAME
    from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
    import ast
    
    db_lance = get_lancedb_connection()
    table = db_lance.open_table(TABLE_NAME)
    embedder = FastEmbedEmbedder()
    
    # Abrir arquivo para salvar resultados
    with open("resultados_busca.txt", "w", encoding="utf-8") as f:
        queries = [
            "preço troca de óleo",
            "quanto custa troca de óleo"
        ]
        
        for query in queries:
            header = f"\n{'='*80}\nQuery: {query}\n{'='*80}\n"
            print(header)
            f.write(header)
            
            try:
                query_vector = embedder.get_embedding(query)
                results = table.search(query_vector).limit(10).to_list()
                
                if not results:
                    msg = "❌ Nenhum resultado encontrado\n"
                    print(msg)
                    f.write(msg)
                    continue
                    
                msg = f"✅ Encontrados {len(results)} resultados:\n\n"
                print(msg)
                f.write(msg)
                
                for i, result in enumerate(results, 1):
                    text = result.get("text", "")
                    metadata_str = result.get("metadata", "{}")
                    try:
                        metadata = ast.literal_eval(metadata_str) if isinstance(metadata_str, str) else metadata_str
                    except:
                        metadata = {}
                        
                    source = metadata.get("source", "Desconhecido")
                    filename = metadata.get("filename", "N/A")
                    
                    result_text = f"\n{i}. Arquivo: {filename}\n   Fonte: {source}\n   Conteúdo: {text}\n{'-'*80}\n"
                    print(f"{i}. {filename}")
                    f.write(result_text)
            except Exception as e:
                error_msg = f"❌ Erro: {e}\n"
                print(error_msg)
                f.write(error_msg)
                import traceback
                traceback.print_exc()
                f.write(traceback.format_exc())
    
    print("\n✅ Resultados salvos em 'resultados_busca.txt'")

if __name__ == "__main__":
    test_search()
