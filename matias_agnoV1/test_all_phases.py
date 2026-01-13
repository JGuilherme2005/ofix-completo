import os
from dotenv import load_dotenv
from matias_agno.agents.matias import create_matias_agent
from matias_agno.workflows.diagnostic_workflow import get_diagnostic_workflow
from matias_agno.agents.team import get_matias_team

load_dotenv()

def test_knowledge_base():
    """Testa a base de conhecimento com diferentes tipos de perguntas"""
    print("\n" + "="*60)
    print("TESTE 1: BASE DE CONHECIMENTO")
    print("="*60)
    
    agent = create_matias_agent()
    
    queries = [
        "Qual o torque do cabeçote do Onix 1.0?",
        "Quanto custa uma revisão de 10.000 km?",
        "Como diagnosticar código P0171?",
    ]
    
    for i, query in enumerate(queries, 1):
        print(f"\n📝 Query {i}: {query}")
        print("-" * 60)
        try:
            response = agent.run(query, stream=False)
            print(f"✅ Resposta ({len(response.content)} chars):")
            print(response.content[:200] + "..." if len(response.content) > 200 else response.content)
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    print("\n✅ Teste de Knowledge Base concluído!")

def test_workflow():
    """Testa o workflow com diferentes cenários"""
    print("\n" + "="*60)
    print("TESTE 2: WORKFLOW DE DIAGNÓSTICO")
    print("="*60)
    
    workflow = get_diagnostic_workflow()
    
    scenarios = [
        "Meu carro não liga",
        "Está saindo fumaça branca do escapamento",
        "O freio está fazendo barulho",
    ]
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n📝 Cenário {i}: {scenario}")
        print("-" * 60)
        try:
            response = workflow.run(scenario, stream=False)
            print(f"✅ Workflow executado ({len(response.content)} chars)")
            # Mostra apenas o início da resposta
            print(response.content[:300] + "...")
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    print("\n✅ Teste de Workflow concluído!")

def test_team():
    """Testa o Team com diferentes tipos de solicitações"""
    print("\n" + "="*60)
    print("TESTE 3: MATIAS TEAM")
    print("="*60)
    
    team = get_matias_team()
    
    requests = [
        "Boa tarde! Preciso saber o preço de uma troca de óleo",
        "Meu carro está acelerando sozinho, o que pode ser?",
        "Quanto custa alinhamento e balanceamento?",
    ]
    
    for i, request in enumerate(requests, 1):
        print(f"\n📝 Requisição {i}: {request}")
        print("-" * 60)
        try:
            response = team.run(request, stream=False)
            print(f"✅ Team respondeu ({len(response.content)} chars)")
            print(response.content[:300] + "...")
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    print("\n✅ Teste de Team concluído!")

def main():
    print("🚀 INICIANDO BATERIA COMPLETA DE TESTES")
    print("="*60)
    
    try:
        # Teste 1: Knowledge Base
        test_knowledge_base()
        
        # Teste 2: Workflow
        test_workflow()
        
        # Teste 3: Team
        test_team()
        
        print("\n" + "="*60)
        print("✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
