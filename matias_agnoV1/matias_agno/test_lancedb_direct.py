import lancedb
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações LanceDB
LANCEDB_API_KEY = "sk_5Z3CCATFO5ELBPAQ2CNF5ZFMTZTDN2IHPNYKQLC3YFQ54AXPDOXA===="
LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_REGION = "us-east-1"
TABLE_NAME = "conhecimento_oficina_v4"

print("🔍 Testando busca direta na tabela LanceDB...")

try:
    # Conectar ao LanceDB
    db = lancedb.connect(
        uri=LANCEDB_URI,
        api_key=LANCEDB_API_KEY,
        region=LANCEDB_REGION
    )
    print("✅ Conectado ao LanceDB")

    # Abrir tabela
    table = db.open_table(TABLE_NAME)
    print(f"✅ Tabela '{TABLE_NAME}' aberta")

    # Verificar quantos registros tem
    count = table.count_rows()
    print(f"📊 Total de registros na tabela: {count}")

    if count > 0:
        # Mostrar alguns registros (usando head() para tabelas remotas)
        print("\n📋 Amostra de registros:")
        try:
            sample = table.head(3).to_list()
            for i, row in enumerate(sample, 1):
                print(f"{i}. Texto: {row['text'][:100]}...")
                print(f"   Metadata: {row['metadata']}")
                print()
        except:
            print("Não foi possível mostrar amostra (tabela remota)")

        # Testar busca por similaridade
        print("🔍 Testando busca por similaridade...")
        try:
            # Usar um vetor de exemplo para teste
            query_vector = [0.1] * 384  # Mesmo tamanho usado no carregamento
            results = table.search(query_vector).limit(5).to_list()
            print(f"✅ Busca encontrou {len(results)} resultados")
            for i, result in enumerate(results, 1):
                print(f"{i}. Score: {result.get('_distance', 'N/A')}")
                print(f"   Texto: {result['text'][:150]}...")
        except Exception as e:
            print(f"❌ Erro na busca: {e}")
            print(f"   Detalhes: {type(e).__name__}: {e}")

    else:
        print("❌ Tabela está vazia!")

except Exception as e:
    print(f"❌ Erro: {e}")
    import traceback
    traceback.print_exc()