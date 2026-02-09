#!/usr/bin/env python3
"""
test_memory_system.py - Testa o sistema de memória do Matias
"""

from agno.agent import Agent
from agno.models.huggingface import HuggingFace
from agno.db.sqlite import SqliteDb
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
from agno.tools import tool
import lancedb
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações
HF_TOKEN = os.getenv("HF_TOKEN")
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY")
LANCEDB_URI = os.getenv("LANCEDB_URI", "db://ofx-rbf7i6")
TABLE_NAME = "conhecimento_oficina_v5_completo"

print("\n" + "="*80)
print("🧪 TESTE DO SISTEMA DE MEMÓRIA - MATIAS AI")
print("="*80 + "\n")

# Conectar databases
db_lance = lancedb.connect(uri=LANCEDB_URI, api_key=LANCEDB_API_KEY, region="us-east-1")
db_memory = SqliteDb(db_file="tmp/matias_memory.db")

# Tool de busca
@tool
def buscar_conhecimento(query: str) -> str:
    """Busca informações na base de conhecimento"""
    try:
        table = db_lance.open_table(TABLE_NAME)
        embedder = FastEmbedEmbedder()
        query_vector = embedder.get_embedding(query)
        results = table.search(query_vector).limit(2).to_list()
        
        if not results:
            return "Nenhuma informação encontrada."
        
        knowledge_text = "📚 Informações encontradas:\n"
        for i, result in enumerate(results, 1):
            text = result.get("text", "")[:200]
            knowledge_text += f"{i}. {text}...\n"
        
        return knowledge_text
    except Exception as e:
        return f"Erro: {str(e)}"

# Instruções
INSTRUCTIONS = """Você é o Matias, assistente de oficina.

IMPORTANTE SOBRE MEMÓRIA:
- SEMPRE lembre informações que o cliente já compartilhou
- Se o cliente já mencionou o veículo, NÃO pergunte novamente
- Faça referência a conversas anteriores
- Personalize recomendações baseadas no histórico

Use buscar_conhecimento para informações técnicas."""

# Criar agente com memória
matias = Agent(
    name="Matias",
    role="Assistente de Oficina",
    instructions=INSTRUCTIONS,
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=HF_TOKEN),
    tools=[buscar_conhecimento],
    db=db_memory,
    enable_user_memories=True,
    enable_session_summaries=True,
    add_history_to_context=True,
    num_history_runs=5,
    markdown=True,
)

# =============================================================================
# TESTE 1: Primeira Conversa - Cliente Informa o Veículo
# =============================================================================
print("📝 TESTE 1: Primeira Conversa")
print("-" * 80)

response1 = matias.run(
    "Oi Matias! Meu carro é um Gol 2015 1.6",
    user_id="cliente_joao",
    session_id="sessao_001",
    stream=False
)

print("👤 Cliente: Oi Matias! Meu carro é um Gol 2015 1.6")
print(f"🤖 Matias: {response1.content}\n")

# =============================================================================
# TESTE 2: Mesma Sessão - Matias Deve Lembrar
# =============================================================================
print("📝 TESTE 2: Continuando a Mesma Sessão")
print("-" * 80)

response2 = matias.run(
    "Quanto custa troca de pastilhas de freio?",
    user_id="cliente_joao",
    session_id="sessao_001",
    stream=False
)

print("👤 Cliente: Quanto custa troca de pastilhas de freio?")
print(f"🤖 Matias: {response2.content}\n")

# Verificar se mencionou "Gol 2015" na resposta (deve lembrar!)
if "gol" in response2.content.lower() or "2015" in response2.content:
    print("✅ SUCESSO: Matias lembrou do veículo!\n")
else:
    print("⚠️  ATENÇÃO: Matias não mencionou o veículo específico\n")

# =============================================================================
# TESTE 3: Nova Sessão (dias depois) - Deve Lembrar do Usuário
# =============================================================================
print("📝 TESTE 3: Nova Sessão (Dias Depois)")
print("-" * 80)

response3 = matias.run(
    "Oi Matias, tudo bem? Preciso fazer alinhamento",
    user_id="cliente_joao",  # MESMO usuário
    session_id="sessao_002",  # NOVA sessão
    stream=False
)

print("👤 Cliente: Oi Matias, tudo bem? Preciso fazer alinhamento")
print(f"🤖 Matias: {response3.content}\n")

# Verificar se lembrou do veículo
if "gol" in response3.content.lower() or "2015" in response3.content:
    print("✅ SUCESSO: Matias lembrou do veículo entre sessões!\n")
else:
    print("⚠️  ATENÇÃO: Matias não usou memória entre sessões\n")

# =============================================================================
# ANÁLISE DE MEMÓRIA
# =============================================================================
print("="*80)
print("📊 ANÁLISE DE MEMÓRIA")
print("="*80 + "\n")

# Obter memórias do usuário
memories = db_memory.get_user_memories(user_id="cliente_joao")
print(f"🧠 Total de memórias armazenadas: {len(memories)}")

if memories:
    print("\n📝 Memórias Registradas:")
    for i, memory in enumerate(memories, 1):
        print(f"\n{i}. {memory.memory}")
        print(f"   ⏰ Atualizada em: {memory.updated_at}")
else:
    print("⚠️  Nenhuma memória encontrada")

# Obter sessões
from agno.db.base import SessionType
sessions = db_memory.get_sessions(
    user_id="cliente_joao",
    session_type=SessionType.AGENT
)

print(f"\n💬 Total de sessões: {len(sessions)}")
for i, session in enumerate(sessions, 1):
    print(f"\n{i}. Session ID: {session.session_id}")
    if session.summary:
        summary_text = str(session.summary)
        print(f"   📄 Resumo: {summary_text[:100]}...")
    print(f"   ⏰ Criada em: {session.created_at}")

print("\n" + "="*80)
print("✅ TESTE CONCLUÍDO")
print("="*80 + "\n")

print("💡 PRÓXIMOS PASSOS:")
print("1. Rode agent_with_memory.py na porta 8001")
print("2. Acesse https://os.agno.com/ e conecte")
print("3. Teste conversas com diferentes user_id")
print("4. Veja as memórias na interface do AgentOS")
