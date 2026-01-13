import os
from dotenv import load_dotenv
from matias_agno.agents.team import get_matias_team

load_dotenv()

def test_matias_team():
    print("🚀 Iniciando teste do Matias Team...")
    
    try:
        # Criar team
        print("🔄 Criando Matias Team...")
        team = get_matias_team()
        
        print(f"✅ Team criado: {team.name}")
        print(f"👥 Membros: {len(team.members)}")
        for member in team.members:
            print(f"   - {member.name}")
        
        # Teste com pergunta que requer múltiplos especialistas
        user_input = "Meu Onix 2016 está com a luz do motor acesa. Quanto custa pra resolver?"
        print(f"\n🔍 Testando com: '{user_input}'")
        print("-" * 60)
        
        # Executar team
        response = team.run(user_input, stream=False)
        
        print("\n📋 RESPOSTA DO TEAM:")
        print("=" * 60)
        print(response.content)
        print("=" * 60)
        
        print("\n✅ Teste concluído!")

    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_matias_team()
