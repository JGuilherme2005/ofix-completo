import os
import lancedb
from dotenv import load_dotenv

load_dotenv()

LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_REGION = "us-east-1"
TABLE_NAME = "conhecimento_oficina_v5_completo"

print(f"🔍 Procurando por 'precos_servicos.md' na tabela {TABLE_NAME}...")

db = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region=LANCEDB_REGION)
table = db.open_table(TABLE_NAME)

# Buscar todos os docs que mencionam "precos_servicos" no metadata
results = table.to_pandas()

print(f"📊 Total de documentos na tabela: {len(results)}")

# Procurar por precos_servicos.md
precos_docs = results[results['metadata'].str.contains('precos_servicos', case=False, na=False)]

if len(precos_docs) > 0:
    print(f"\n✅ Encontrado! {len(precos_docs)} documento(s) com 'precos_servicos' no metadata")
    for idx, row in precos_docs.iterrows():
        print(f"\n📄 Documento:")
        print(f"   Metadata: {row['metadata'][:200]}")
        print(f"   Texto (preview): {row['text'][:300]}...")
else:
    print("\n❌ NÃO ENCONTRADO - 'precos_servicos.md' não está na tabela!")
    print("\n🔍 Procurando por documentos que mencionam 'Troca de Óleo' no texto...")
    
    # Buscar no texto
    preco_texto = results[results['text'].str.contains('Troca de Óleo', case=False, na=False)]
    print(f"   Encontrados {len(preco_texto)} documentos mencionando 'Troca de Óleo'")
    
    if len(preco_texto) > 0:
        print("\n   Primeiros 3 documentos:")
        for idx, row in preco_texto.head(3).iterrows():
            import ast
            try:
                meta = ast.literal_eval(row['metadata'])
                filename = meta.get('filename', 'N/A')
            except:
                filename = 'N/A'
            print(f"   - {filename}")