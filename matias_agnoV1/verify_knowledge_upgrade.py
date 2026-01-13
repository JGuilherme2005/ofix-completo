import os
from dotenv import load_dotenv
from matias_agno.agents.matias import create_matias_agent

# Carregar variáveis de ambiente
load_dotenv()

def test_knowledge_retrieval():
    print("🚀 Iniciando teste de verificação do Knowledge Upgrade...")
    
    try:
        # Criar agente
        print("🔄 Criando agente Matias...")
        agent = create_matias_agent()
        
        # Verificar se o knowledge foi anexado
        if agent.knowledge:
            print("✅ Knowledge Base anexada com sucesso!")
        else:
            print("❌ ERRO: Knowledge Base não encontrada no agente.")
            return

        # Teste de busca real
        query = "Qual o torque do cabeçote do Onix?"
        print(f"\n🔍 Testando busca: '{query}'")
        
        # Executar agente (usando print_response para ver o output no terminal)
        # stream=False para simplificar o teste
        response = agent.run(query, stream=False)
        
        print("\n📝 Resposta do Agente:")
        print("-" * 50)
        print(response.content)
        print("-" * 50)
        
        # Verificação simples se retornou algo útil
        if response.content and len(response.content) > 50:
             print("\n✅ Teste concluído: O agente respondeu com conteúdo.")
        else:
             print("\n⚠️ Aviso: A resposta foi muito curta ou vazia.")

    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO durante o teste: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_knowledge_retrieval()
