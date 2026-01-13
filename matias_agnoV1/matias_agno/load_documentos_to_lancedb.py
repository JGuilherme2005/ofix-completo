"""
Script para carregar todos os arquivos Markdown convertidos para o LanceDB Remote
"""
import os
from pathlib import Path
import lancedb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
from dotenv import load_dotenv

load_dotenv()

# Configurações LanceDB
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_URI = os.getenv("LANCEDB_URI")
LANCEDB_REGION = "us-east-1"

# Diretórios
DOCUMENTOS_MD_DIR = Path(__file__).parent / "documentos_md"
TABLE_NAME = "conhecimento_oficina_v5_completo"

# Estatísticas
stats = {
    'total_arquivos': 0,
    'total_chunks': 0,
    'sucesso': 0,
    'erro': 0
}

def chunk_text(text, max_chars=2000, overlap=200):
    """Divide texto em chunks menores para embedding"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + max_chars
        chunk = text[start:end]
        
        # Tentar quebrar em parágrafo
        if end < len(text):
            last_newline = chunk.rfind('\n\n')
            if last_newline > overlap:
                end = start + last_newline
                chunk = text[start:end]
        
        chunks.append(chunk.strip())
        start = end - overlap
    
    return chunks

def load_markdown_files():
    """Carrega todos os arquivos .md e prepara dados"""
    all_data = []
    embedder = FastEmbedEmbedder()
    
    print("\n🔍 Procurando arquivos Markdown...")
    
    for root, dirs, files in os.walk(DOCUMENTOS_MD_DIR):
        for file in files:
            if not file.endswith('.md'):
                continue
            
            file_path = Path(root) / file
            relative_path = file_path.relative_to(DOCUMENTOS_MD_DIR)
            categoria = str(relative_path.parts[0]) if len(relative_path.parts) > 1 else 'root'
            
            stats['total_arquivos'] += 1
            
            try:
                print(f"  📄 Processando: {relative_path}...", end='', flush=True)
                
                # Ler conteúdo
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Dividir em chunks
                chunks = chunk_text(content)
                
                # Criar embeddings e documentos
                for i, chunk in enumerate(chunks):
                    if len(chunk.strip()) < 50:  # Pular chunks muito pequenos
                        continue
                    
                    # Gerar embedding
                    vector = embedder.get_embedding(chunk)
                    
                    # Adicionar documento
                    all_data.append({
                        'vector': vector,
                        'text': chunk,
                        'metadata': str({
                            'source': str(relative_path),
                            'categoria': categoria,
                            'arquivo': file,
                            'chunk': i,
                            'total_chunks': len(chunks)
                        })
                    })
                    
                    stats['total_chunks'] += 1
                
                print(f" ✅ {len(chunks)} chunks")
                stats['sucesso'] += 1
                
            except Exception as e:
                print(f" ❌ ERRO: {str(e)[:50]}")
                stats['erro'] += 1
    
    return all_data

def main():
    print("="*80)
    print("🚀 CARREGANDO DOCUMENTOS NO LANCEDB REMOTE")
    print("="*80)
    
    # Conectar ao LanceDB
    print("\n🔌 Conectando ao LanceDB Remote...")
    db = lancedb.connect(
        uri=LANCEDB_URI,
        api_key=LANCEDB_API_KEY,
        region=LANCEDB_REGION
    )
    print("✅ Conectado!")
    
    # Carregar documentos
    print(f"\n📚 Carregando documentos de: {DOCUMENTOS_MD_DIR}")
    all_data = load_markdown_files()
    
    if not all_data:
        print("\n⚠️  Nenhum documento encontrado!")
        return
    
    print(f"\n📊 ESTATÍSTICAS:")
    print(f"  Arquivos processados: {stats['total_arquivos']}")
    print(f"  Chunks gerados: {stats['total_chunks']}")
    print(f"  Sucessos: {stats['sucesso']}")
    print(f"  Erros: {stats['erro']}")
    
    # Criar/substituir tabela
    print(f"\n💾 Criando tabela: {TABLE_NAME}...")
    try:
        # Apagar tabela antiga se existir
        try:
            db.drop_table(TABLE_NAME)
            print("  🗑️  Tabela antiga removida")
        except:
            pass
        
        # Criar nova tabela
        table = db.create_table(TABLE_NAME, data=all_data)
        print(f"✅ Tabela criada com {len(all_data)} documentos!")
        
        # Estatísticas por categoria
        print(f"\n📁 DOCUMENTOS POR CATEGORIA:")
        categorias = {}
        for doc in all_data:
            metadata = eval(doc['metadata'])
            cat = metadata.get('categoria', 'unknown')
            categorias[cat] = categorias.get(cat, 0) + 1
        
        for cat, count in sorted(categorias.items()):
            print(f"  {cat}: {count} chunks")
        
        print("\n" + "="*80)
        print("✅ CARGA CONCLUÍDA COM SUCESSO!")
        print("="*80)
        print(f"\n🎯 Use a tabela '{TABLE_NAME}' na sua API")
        
    except Exception as e:
        print(f"\n❌ ERRO ao criar tabela: {e}")

if __name__ == "__main__":
    main()
