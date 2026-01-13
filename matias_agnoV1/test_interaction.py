import os
import sys
from dotenv import load_dotenv

# Adicionar diretório atual ao path
sys.path.append(os.getcwd())

# Forçar encoding UTF-8 para evitar erros no Windows/Postgres
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["PGCLIENTENCODING"] = "utf-8"

load_dotenv() # Carrega do root
# load_dotenv("matias_agno/.env", override=True) # Desativado para usar o root .env

key = os.getenv("GROQ_API_KEY")
print(f"🔑 Debug Key: {key[:5]}..." if key else "🔑 Debug Key: None")

from matias_agno.agents.matias import create_matias_agent

def test_interaction():
    print("🚀 Inicializando Matias Agno...")
    matias = create_matias_agent()
    
    print("\n" + "="*50)
    print("🧪 TESTE 1: RAG & BUSCA HÍBRIDA")
    print("="*50)
    query_tecnica = "Qual o torque de aperto da roda do Gol?"
    print(f"👤 Usuário: {query_tecnica}")
    print("🤖 Matias: (Pensando...)")
    response = matias.run(query_tecnica)
    print(f"📝 Resposta:\n{response.content}\n")
    
    print("\n" + "="*50)
    print("🧪 TESTE 2: MEMÓRIA (SUPABASE)")
    print("="*50)
    
    # 1. Guardar informação
    info_pessoal = "Meu nome é Pedro e sou dono da oficina Ofix."
    print(f"👤 Usuário: {info_pessoal}")
    matias.run(info_pessoal)
    print("🤖 Matias: (Memória atualizada)")
    
    # 2. Recuperar informação
    pergunta_memoria = "Quem sou eu e qual minha oficina?"
    print(f"👤 Usuário: {pergunta_memoria}")
    response_memoria = matias.run(pergunta_memoria)
    print(f"📝 Resposta:\n{response_memoria.content}\n")

if __name__ == "__main__":
    test_interaction()
