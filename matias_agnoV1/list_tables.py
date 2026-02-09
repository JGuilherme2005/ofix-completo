import os
from dotenv import load_dotenv
import lancedb

load_dotenv()

LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_REGION = "us-east-1"

db = lancedb.connect(
    uri=LANCEDB_URI,
    api_key=LANCEDB_API_KEY,
    region=LANCEDB_REGION
)

print("📊 Listando todas as tabelas no LanceDB:\n")
tables = db.table_names()

for table_name in tables:
    try:
        table = db.open_table(table_name)
        count = table.count_rows()
        print(f"✅ {table_name}: {count} documentos")
    except Exception as e:
        print(f"❌ {table_name}: Erro - {e}")
