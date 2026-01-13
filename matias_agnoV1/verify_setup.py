import os
import sys
from dotenv import load_dotenv

# Adicionar o diretório atual ao path para importar o pacote matias_agno
sys.path.append(os.getcwd())

load_dotenv()

def verify_supabase():
    print("\n🔍 Verificando conexão com Supabase...")
    try:
        from matias_agno.storage.memory import get_memory_storage
        storage = get_memory_storage()
        # Tenta criar a tabela se não existir (o Agno faz isso automaticamente ao instanciar)
        print(f"✅ Storage inicializado: {type(storage).__name__}")
        if "PostgresDb" in type(storage).__name__:
            print("   Conectado ao PostgreSQL/Supabase com sucesso!")
        else:
            print("   ⚠️ Usando SQLite (Supabase não configurado ou falhou).")
    except Exception as e:
        print(f"❌ Erro ao conectar no Supabase: {e}")

def verify_lancedb_and_create_fts():
    print("\n🔍 Verificando LanceDB e criando índice FTS...")
    try:
        from matias_agno.knowledge.base import get_lancedb_connection, TABLE_NAME
        db = get_lancedb_connection()
        
        if TABLE_NAME not in db.table_names():
            print(f"❌ Tabela '{TABLE_NAME}' não encontrada no LanceDB!")
            return

        table = db.open_table(TABLE_NAME)
        print(f"✅ Tabela '{TABLE_NAME}' aberta. Registros: {table.count_rows()}")
        
        # Criar índice FTS
        print("⏳ Criando/Atualizando índice FTS (Full Text Search)...")
        try:
            table.create_fts_index("text", replace=True)
            print("✅ Índice FTS criado com sucesso!")
        except Exception as e:
            print(f"⚠️ Erro ao criar índice FTS (pode já existir ou erro de dependência): {e}")
            print("   Dica: Instale 'tantivy' se necessário: pip install tantivy")

    except Exception as e:
        print(f"❌ Erro no LanceDB: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando verificação do Matias Agno...")
    verify_supabase()
    verify_lancedb_and_create_fts()
    print("\n🏁 Verificação concluída.")
