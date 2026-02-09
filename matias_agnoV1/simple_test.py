import os
import lancedb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
from dotenv import load_dotenv
import ast

load_dotenv()

LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_REGION = "us-east-1"
TABLE_NAME = "conhecimento_oficina_v5_completo"

print("Testando buscas por precos...")

db = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region=LANCEDB_REGION)
table = db.open_table(TABLE_NAME)
embedder = FastEmbedEmbedder()

query = "tabela precos servicos oficina"
print(f"\nQuery: {query}")

query_vector = embedder.get_embedding(query)
results = table.search(query_vector).limit(20).to_list()

print(f"Total resultados: {len(results)}\n")

found = False
for i, result in enumerate(results, 1):
    metadata_str = result.get('metadata', '{}')
    try:
        metadata = ast.literal_eval(metadata_str)
    except:
        metadata = {}
    
    filename = metadata.get('filename', 'N/A')
    
    if 'precos' in filename.lower():
        print(f">>> ENCONTRADO NA POSICAO {i}: {filename}")
        found = True
        break
    
    if i <= 5:
        print(f"{i}. {filename}")

if not found:
    print("\n>>> NAO ENCONTRADO nos top 20")