import os
from agno.db.postgres import PostgresDb

# Configurações
# O Agno espera uma string de conexão PostgreSQL padrão (psycopg2/sqlalchemy)
DB_URL = os.getenv("SUPABASE_DB_URL")

def get_memory_storage():
    """Retorna a instância de armazenamento persistente (Supabase/Postgres)"""
    if not DB_URL:
        print("⚠️ SUPABASE_DB_URL não definida. Usando memória temporária (SQLite).")
        from agno.db.sqlite import SqliteDb
        return SqliteDb(db_file="tmp/matias_memory.db")
        
    # Configuração correta para Postgres (Supabase)
    if DB_URL:
        # Usamos uma tabela v2 para evitar conflito de schema com versões antigas do Agno
        return PostgresDb(
            db_url=DB_URL,
            table_name="agno_memories_v2"
        )
    
    # Fallback para SQLite local
    from agno.db.sqlite import SqliteDb
    return SqliteDb(db_file="tmp/matias_memory.db")
