import os
from dotenv import load_dotenv
from matias_agno.workflows.diagnostic_workflow import get_diagnostic_workflow

# Carregar variáveis de ambiente
load_dotenv()

def test_diagnostic_workflow():
    print("🚀 Iniciando teste do Workflow de Diagnóstico...")
    
    try:
        # Criar workflow
        print("🔄 Criando diagnostic workflow...")
        workflow = get_diagnostic_workflow()
        
        print(f"✅ Workflow criado: {workflow.name}")
        print(f"📝 Steps: {len(workflow.steps)}")
        for step in workflow.steps:
            print(f"   - {step.name}")
        
        # Teste com sintoma vago
        user_input = "Meu carro está fazendo um barulho estranho no motor"
        print(f"\n🔍 Testando com entrada: '{user_input}'")
        print("-" * 60)
        
        # Executar workflow (stream=False para simplificar)
        response = workflow.run(user_input, stream=False)
        
        print("\n📋 RESULTADO DO WORKFLOW:")
        print("=" * 60)
        print(response.content)
        print("=" * 60)
        
        print("\n✅ Teste concluído!")

    except Exception as e:
        print(f"\n❌ ERRO durante o teste: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_diagnostic_workflow()
