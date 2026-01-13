import lancedb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
from dotenv import load_dotenv
import ast

load_dotenv()

LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_API_KEY = "sk_5Z3CCATFO5ELBPAQ2CNF5ZFMTZTDN2IHPNYKQLC3YFQ54AXPDOXA===="
LANCEDB_REGION = "us-east-1"
TABLE_NAME = "conhecimento_oficina_v5_completo"

print(f"🔍 Testando diferentes queries para encontrar precos_servicos.md...\n")

db = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region=LANCEDB_REGION)
table = db.open_table(TABLE_NAME)
embedder = FastEmbedEmbedder()

# Testar várias queries relacionadas a preços
queries = [
    "preços serviços",
    "tabela preços oficina",
    "quanto custa troca óleo",
    "valor serviço mecânico",
    "preço freio pastilha"
]

for query in queries:
    print(f"\n{'='*70}")
    print(f"Query: '{query}'")
    print(f"{'='*70}")
    
    try:
        query_vector = embedder.get_embedding(query)
        results = table.search(query_vector).limit(15).to_list()
        
        print(f"✅ Retornou {len(results)} resultados\n")
        
        # Procurar por precos_servicos nos primeiros 15 resultados
        found_precos = False
        for i, result in enumerate(results, 1):
            metadata_str = result.get('metadata', '{}')
            try:
                metadata = ast.literal_eval(metadata_str) if isinstance(metadata_str, str) else metadata_str
            except:
                metadata = {}
            
            filename = metadata.get('filename', 'N/A')
            source = metadata.get('source', 'Desconhecido')
            
            if 'precos_servicos' in filename.lower() or 'precos_servicos' in source.lower():
                print(f"🎯 ENCONTRADO NA POSIÇÃO {i}!")
                print(f"   Arquivo: {filename}")
                print(f"   Fonte: {source}")
                text = result.get('text', '')
                print(f"   Preview: {text[:200]}...")
                found_precos = True
                break
        
        if not found_precos:
            print("❌ 'precos_servicos.md' NÃO encontrado nos top 15")
            print("\nTop 3 resultados:")
            for i, result in enumerate(results[:3], 1):
                metadata_str = result.get('metadata', '{}')
                try:
                    metadata = ast.literal_eval(metadata_str) if isinstance(metadata_str, str) else metadata_str
                except:
                    metadata = {}
                filename = metadata.get('filename', 'N/A')
                print(f"   {i}. {filename}")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

print("\n" + "="*70)
print("📊 CONCLUSÃO:")
print("="*70)
print("Se 'precos_servicos.md' não apareceu em NENHUMA das queries acima,")
print("o problema pode ser:")
print("1. O arquivo não foi carregado corretamente")
print("2. O embedding do arquivo é muito diferente das queries de preço")
print("3. Documentos maiores têm embeddings 'mais fortes' e dominam os resultados")
