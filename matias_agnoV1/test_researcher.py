import os
from dotenv import load_dotenv
from matias_agno.agents.researcher import get_researcher_agent

load_dotenv()

def test_researcher():
    print("🚀 Iniciando teste do Agente Pesquisador...")
    
    try:
        # Criar agente
        print("🔄 Criando Researcher Agent...")
        agent = get_researcher_agent()
        
        # Teste com algo que provavelmente não está na base interna (ex: recall recente ou problema específico)
        query = "Quais os principais problemas crônicos do motor THP da Peugeot/Citroen?"
        print(f"\n🔍 Pesquisando na Web: '{query}'")
        print("-" * 60)
        
        # Executar agente
        response = agent.run(query, stream=False)
        
        print("\n📋 RESULTADO DA PESQUISA:")
        print("=" * 60)
        print(response.content)
        print("=" * 60)
        
        print("\n✅ Teste concluído!")

    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_researcher()
