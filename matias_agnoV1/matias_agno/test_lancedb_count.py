import lancedb
from dotenv import load_dotenv
import os

load_dotenv()

LANCEDB_API_KEY = os.getenv('LANCEDB_API_KEY')
LANCEDB_URI = os.getenv('LANCEDB_URI', 'db://ofx-rbf7i6')

print('Conectando ao LanceDB...')
db = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region='us-east-1')

print('Abrindo tabela conhecimento_oficina_v4...')
table = db.open_table('conhecimento_oficina_v4')

print('Contando registros...')
count = table.count_rows()
print(f'✅ Total de registros na tabela: {count}')

if count > 0:
    print('\nPrimeiros 3 registros:')
    results = table.to_pandas().head(3)
    for idx, row in results.iterrows():
        print(f'\n--- Registro {idx+1} ---')
        text = str(row.get('text', ''))
        print(f'Text (primeiros 100 chars): {text[:100]}...')
        print(f'Metadata: {row.get("metadata", "")}')
else:
    print('❌ Tabela está vazia!')
