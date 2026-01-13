import lancedb
from dotenv import load_dotenv
import os
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder

load_dotenv()

LANCEDB_API_KEY = os.getenv('LANCEDB_API_KEY', 'sk_5Z3CCATFO5ELBPAQ2CNF5ZFMTZTDN2IHPNYKQLC3YFQ54AXPDOXA====')
LANCEDB_URI = os.getenv('LANCEDB_URI', 'db://ofx-rbf7i6')

print('Conectando ao LanceDB...')
db = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region='us-east-1')

print('Abrindo tabela...')
table = db.open_table('conhecimento_oficina_v4')

print(f'Total de registros: {table.count_rows()}')

print('\nGerando embedding para query "freio"...')
embedder = FastEmbedEmbedder()
query_embeddings = embedder.get_embeddings(["freio"])
query_vector = query_embeddings[0]

print(f'Embedding gerado! Dimensões: {len(query_vector)}')

print('\nBuscando...')
results = table.search(query_vector).limit(3).to_list()

print(f'\n✅ Encontrados {len(results)} resultados:')
for i, result in enumerate(results, 1):
    print(f'\n--- Resultado {i} ---')
    text = result.get('text', '')
    print(f'Text (primeiros 150 chars): {text[:150]}...')
    print(f'Metadata: {result.get("metadata", "")}')
