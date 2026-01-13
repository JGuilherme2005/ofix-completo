import requests
import json

# URL da API
base_url = "https://matias-agno-assistant.onrender.com"

print("🔬 TESTES ESPECÍFICOS DA BASE DE CONHECIMENTO")
print("="*60)

# Lista de perguntas específicas baseadas no conteúdo carregado
test_questions = [
    {
        "pergunta": "Quais são os procedimentos para inspeção do sistema de frenagem?",
        "esperado": "procedimentos, inspeção, freio, visual, verificar"
    },
    {
        "pergunta": "Como diagnosticar problemas no sistema elétrico automotivo?", 
        "esperado": "elétrico, diagnóstico, bateria, alternador, sistema"
    },
    {
        "pergunta": "Qual o torque de aperto das rodas do Gol?",
        "esperado": "torque, aperto, gol, rodas, especificação"
    },
    {
        "pergunta": "Como fazer alinhamento de direção?",
        "esperado": "alinhamento, direção, procedimento, geometria"
    },
    {
        "pergunta": "Preços de serviços da oficina para troca de óleo",
        "esperado": "preço, serviço, óleo, troca, valor"
    },
    {
        "pergunta": "Diagnóstico de barulhos no motor",
        "esperado": "barulho, motor, diagnóstico, ruído, problema"
    }
]

total_tests = len(test_questions)
successful_searches = 0

for i, test in enumerate(test_questions, 1):
    print(f"\n🤖 TESTE {i}/{total_tests}: {test['pergunta']}")
    
    try:
        # Testar busca direta primeiro
        print("  🔍 Busca direta na base:")
        response = requests.get(f"{base_url}/test_knowledge", params={"query": test['pergunta']})
        if response.status_code == 200:
            search_result = response.json()
            results_count = search_result.get("results_count", 0)
            print(f"    📊 Resultados encontrados: {results_count}")
            
            if results_count > 0:
                successful_searches += 1
                first_content = search_result["results"][0]["content"][:100]
                print(f"    📄 Conteúdo: {first_content}...")
            else:
                print("    ❌ Nenhum resultado na busca direta")
        
        # Testar chat
        print("  💬 Teste no chat:")
        chat_data = {"message": test['pergunta']}
        response = requests.post(f"{base_url}/chat", json=chat_data)
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get('response', '').lower()
            
            # Verificar se mencionou usar base de conhecimento
            knowledge_indicators = [
                'base de conhecimento', 'documentos', 'encontrei', 'busca', 
                'segundo os dados', 'de acordo com', 'conforme'
            ]
            used_knowledge = any(ind in response_text for ind in knowledge_indicators)
            
            # Verificar se contém termos esperados
            expected_terms = test['esperado'].lower().split(', ')
            has_expected = any(term in response_text for term in expected_terms)
            
            print(f"    📚 Usou base: {'✅' if used_knowledge else '❌'}")
            print(f"    🎯 Tem termos esperados: {'✅' if has_expected else '❌'}")
            print(f"    📝 Resposta: {result.get('response')[:120]}...")
            
        else:
            print(f"    ❌ Erro no chat: {response.status_code}")
            
    except Exception as e:
        print(f"    ❌ Erro: {e}")

print(f"\n{'='*60}")
print(f"📊 RESUMO DOS TESTES:")
print(f"🔍 Buscas bem-sucedidas: {successful_searches}/{total_tests}")
print(f"📈 Taxa de sucesso: {(successful_searches/total_tests)*100:.1f}%")

if successful_searches > 0:
    print("✅ BASE DE CONHECIMENTO FUNCIONANDO!")
else:
    print("❌ PROBLEMA NA BASE DE CONHECIMENTO")

print(f"{'='*60}")

# Teste adicional: verificar se tabela tem dados reais
print("\n🔍 TESTE ADICIONAL: Verificar se tabela tem dados dos documentos")
try:
    # Buscar por termos muito específicos dos documentos carregados
    specific_terms = ["procedimentos frenagem", "sistema eletrico", "torques", "precos servicos"]
    
    for term in specific_terms:
        response = requests.get(f"{base_url}/test_knowledge", params={"query": term})
        if response.status_code == 200:
            result = response.json()
            count = result.get("results_count", 0)
            print(f"  '{term}': {count} resultados")
            
except Exception as e:
    print(f"❌ Erro no teste adicional: {e}")