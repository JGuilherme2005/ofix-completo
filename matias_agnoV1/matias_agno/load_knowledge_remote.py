# load_knowledge_remote.py - Carrega conhecimento no LanceDB remoto UMA VEZ
import os
import asyncio
from dotenv import load_dotenv
import lancedb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
import sqlite3

# Carregar variáveis de ambiente
load_dotenv()

# Configurar para evitar problemas
os.environ['TQDM_DISABLE'] = '1'
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'

print("🔄 Configurando carregamento remoto da base de conhecimento...")

# Configuração LanceDB remoto
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_URI = "db://ofx-rbf7i6"
LANCEDB_REGION = "us-east-1"

print("🔄 Conectando ao LanceDB remoto...")

try:
    # Conectar ao LanceDB Cloud com região
    db = lancedb.connect(
        uri=LANCEDB_URI,
        api_key=LANCEDB_API_KEY,
        region=LANCEDB_REGION
    )
    print("✅ Conectado ao LanceDB Cloud")
    
    # IMPORTANTE: Usar a mesma tabela que o agente (v5_completo)
    table_name = "conhecimento_oficina_v5_completo"
    
    # Verificar se tabela existe
    try:
        table = db.open_table(table_name)
        print(f"✅ Tabela '{table_name}' encontrada com {table.count_rows()} documentos")
    except:
        # Criar tabela se não existir
        print(f"🔄 Criando tabela '{table_name}'...")
        
        # Dados de exemplo para criar schema
        sample_data = [
            {
                "vector": [0.1] * 384,  # FastEmbed usa 384 dimensões
                "text": "Exemplo de texto automotivo",
                "metadata": "{'source': 'test'}"
            }
        ]
        
        table = db.create_table(table_name, data=sample_data)
        print(f"✅ Tabela '{table_name}' criada")
    
    # Wrapper para compatibilidade com agno
    class LanceDBRemoteWrapper:
        def __init__(self, db_connection, table_name):
            self.db = db_connection
            self.table_name = table_name
            self.table = db_connection.open_table(table_name)
            self.embedder = FastEmbedEmbedder()
        
        def add(self, documents):
            """Adiciona documentos à tabela"""
            processed_docs = []
            for doc in documents:
                # Gerar embedding
                if hasattr(doc, 'page_content'):
                    text = doc.page_content
                    metadata = str(doc.metadata) if hasattr(doc, 'metadata') else '{}'
                else:
                    text = str(doc)
                    metadata = '{}'
                
                # Obter embedding usando o método correto do FastEmbedEmbedder
                try:
                    # FastEmbedEmbedder do agno usa get_embedding
                    vector = self.embedder.get_embedding(text)
                    if not vector:
                        vector = [0.0] * 384  # Fallback
                except Exception as e:
                    print(f"Erro ao gerar embedding: {e}")
                    vector = [0.0] * 384  # Fallback
                
                processed_docs.append({
                    "vector": vector,
                    "text": text,
                    "metadata": metadata
                })
            
            self.table.add(processed_docs)
            return len(processed_docs)
        
        def search(self, query, limit=10):
            """Busca na tabela"""
            try:
                # Gerar embedding da query usando método correto
                query_vector = self.embedder.get_embedding(query)
                if not query_vector:
                    return []
            except Exception as e:
                print(f"Erro ao gerar embedding da query: {e}")
                return []
            
            # Buscar
            results = self.table.search(query_vector).limit(limit).to_list()
            return results
        
        def create_index(self):
            """Cria um índice FTS na tabela para busca híbrida."""
            print("Simulando criação de índice FTS (LanceDB gerencia isso internamente ou via schema).")
            pass

    # Inicializar LanceDB remoto
    vector_db = LanceDBRemoteWrapper(db, table_name)
    print("✅ LanceDB remoto configurado")

    # Configurar SQLite local para metadados/conteúdo completo
    contents_db_path = "./tmp/knowledge_contents.db"
    os.makedirs("./tmp", exist_ok=True)
    
    class SimpleSQLiteDB:
        def __init__(self, db_path):
            self.db_path = db_path
            self.init_db()
        
        def init_db(self):
            conn = sqlite3.connect(self.db_path)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS contents (
                    id TEXT PRIMARY KEY,
                    content TEXT,
                    meta TEXT
                )
            """)
            conn.commit()
            conn.close()
        
        def upsert_knowledge_content(self, *args, **kwargs):
            try:
                if len(args) >= 2:
                    content_id = args[0]
                    content = args[1]
                    meta = args[2] if len(args) > 2 else kwargs.get('meta', None)
                else:
                    content_id = kwargs.get('content_id', 'unknown')
                    content = kwargs.get('content', '')
                    meta = kwargs.get('meta', None)
                
                conn = sqlite3.connect(self.db_path)
                conn.execute("""
                    INSERT OR REPLACE INTO contents (id, content, meta) 
                    VALUES (?, ?, ?)
                """, (str(content_id), str(content), str(meta) if meta else None))
                conn.commit()
                conn.close()
                return True
            except Exception as e:
                print(f"Erro ao inserir conteúdo: {e}")
                return False
        
        def get_knowledge_content(self, content_id):
            try:
                conn = sqlite3.connect(self.db_path)
                cursor = conn.execute("SELECT content, meta FROM contents WHERE id = ?", (content_id,))
                result = cursor.fetchone()
                conn.close()
                return result if result else None
            except Exception as e:
                print(f"Erro ao buscar conteúdo: {e}")
                return None
    
    contents_db = SimpleSQLiteDB(contents_db_path)
    
    # Knowledge com LanceDB remoto customizado
    class SimpleKnowledge:
        def __init__(self, vector_db, contents_db):
            self.vector_db = vector_db
            self.contents_db = contents_db
            self.name = "Base de Conhecimento da Oficina Remota"
        
        async def add_content_async(self, path, reader=None):
            """Carrega conteúdo de uma pasta"""
            import os
            from pathlib import Path
            
            documents = []
            
            if os.path.isdir(path):
                # Processar todos os arquivos .md na pasta
                for file_path in Path(path).glob("**/*.md"):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        # Criar documento
                        doc = {
                            'page_content': content,
                            'metadata': {
                                'source': str(file_path),
                                'filename': file_path.name
                            }
                        }
                        documents.append(doc)
                        
                    except Exception as e:
                        print(f"Erro ao ler {file_path}: {e}")
                        continue
            
            # Adicionar ao vector DB
            if documents:
                count = self.vector_db.add(documents)
                print(f"Adicionados {count} documentos de {path}")
                return count
            return 0
        
        def search(self, query, max_results=10):
            """Busca na base de conhecimento"""
            return self.vector_db.search(query, limit=max_results)
    
    knowledge = SimpleKnowledge(vector_db, contents_db)
    print("✅ Knowledge configurado com LanceDB remoto")
    
except Exception as e:
    print(f"❌ Erro ao configurar LanceDB remoto: {e}")
    exit(1)

# Carregamento dos documentos
async def load_documents():
    print("=== INICIANDO CARREGAMENTO REMOTO DE CONHECIMENTO ===")
    
    # PASTA ÚNICA COM TODO O CONHECIMENTO
    knowledge_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "conhecimento_completo")
    )
    
    if os.path.exists(knowledge_path):
        print(f"📁 Carregando de: {knowledge_path}")
        try:
            await knowledge.add_content_async(path=knowledge_path)
            count = table.count_rows()
            print(f"✅ Carregamento concluído! Total de documentos na tabela: {count}")
        except Exception as e:
            print(f"❌ Erro ao carregar documentos: {e}")
            return
    else:
        print(f"❌ Pasta não encontrada: {knowledge_path}")
        return
    
    print("=== CARREGAMENTO REMOTO CONCLUÍDO ===")

    # Criar índice FTS para busca híbrida
    print("\n🔄 Otimizando base para Busca Híbrida...")
    try:
        knowledge.vector_db.create_index()
    except Exception as e:
        print(f"⚠️ Aviso ao criar índice (pode já existir ou não ser suportado): {e}")
    
    # Teste da busca
    print("\n🔍 Testando busca remota...")
    try:
        results = knowledge.search("freio")
        print(f"✅ Busca funcionando! Encontrados {len(results)} resultados")
        if results:
            first_result = results[0]
            content = getattr(first_result, 'content', None) or getattr(first_result, 'text', str(first_result))
            print(f"Primeiro resultado: {content[:100]}...")
    except Exception as e:
        print(f"❌ Erro no teste de busca: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando carregamento da base de conhecimento remota...")
    print("⚠️ Execute este script APENAS UMA VEZ para carregar os documentos!")
    
    # Confirmar execução
    confirm = input("Deseja prosseguir com o carregamento? (y/N): ")
    if confirm.lower() in ['y', 'yes', 's', 'sim']:
        asyncio.run(load_documents())
        print("\n✅ Carregamento concluído!")
        print("💡 Agora você pode atualizar o main.py para usar apenas o modo remoto")
    else:
        print("❌ Carregamento cancelado")