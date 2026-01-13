import requests
import json

# URL da API
base_url = "https://matias-agno-assistant.onrender.com"

print("🚗 TESTE COMPLETO DO ASSISTENTE MATIAS")
print("="*60)

# Teste 1: Status da base de conhecimento
print("\n🔍 TESTE 1: Status da base de conhecimento remota")
try:
    response = requests.get(f"{base_url}/remote_status")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result.get('status')}")
        print(f"📊 Base: {result.get('database')}")
        print(f"📝 Tabela: {result.get('table_name')}")
        print(f"🔍 Teste de busca: {result.get('test_search_results')} resultados")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
except Exception as e:
    print(f"❌ Erro: {e}")

# Teste 2: Busca direta na base
print("\n🔍 TESTE 2: Busca direta por 'freio'")
try:
    response = requests.get(f"{base_url}/test_knowledge", params={"query": "freio"})
    if response.status_code == 200:
        result = response.json()
        count = result.get("results_count", 0)
        print(f"✅ Encontrados: {count} resultados")
        if result.get("results") and len(result["results"]) > 0:
            first_result = result["results"][0]["content"]
            print(f"📄 Primeiro resultado: {first_result[:100]}...")
        else:
            print("❌ Nenhum conteúdo encontrado")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
except Exception as e:
    print(f"❌ Erro: {e}")

# Teste 3: Chat com pergunta sobre freios
print("\n🤖 TESTE 3: Chat - Pergunta sobre pastilhas de freio")
try:
    chat_data = {
        "message": "Quanto custa para trocar as pastilhas de freio? E quais são os sintomas de pastilhas gastas?"
    }
    response = requests.post(f"{base_url}/chat", json=chat_data)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result.get('status')}")
        print(f"🤖 Resposta: {result.get('response')[:300]}...")
        
        # Verificar se usou a base de conhecimento
        response_text = result.get('response', '').lower()
        indicators = ['base', 'conhecimento', 'encontrei', 'documentos', 'busca']
        used_knowledge = any(ind in response_text for ind in indicators)
        print(f"📚 Usou base de conhecimento: {'✅ SIM' if used_knowledge else '❌ NÃO'}")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
except Exception as e:
    print(f"❌ Erro: {e}")

# Teste 4: Chat com pergunta sobre alinhamento
print("\n🤖 TESTE 4: Chat - Pergunta sobre alinhamento e balanceamento")
try:
    chat_data = {
        "message": "Meu carro está puxando para a direita. Pode ser problema de alinhamento? Qual o preço?"
    }
    response = requests.post(f"{base_url}/chat", json=chat_data)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result.get('status')}")
        print(f"🤖 Resposta: {result.get('response')[:300]}...")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
except Exception as e:
    print(f"❌ Erro: {e}")

# Teste 5: Chat com pergunta específica sobre códigos de erro
print("\n🤖 TESTE 5: Chat - Pergunta sobre código de erro CAN")
try:
    chat_data = {
        "message": "O que significa o código de erro P0300? Como resolver?"
    }
    response = requests.post(f"{base_url}/chat", json=chat_data)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result.get('status')}")
        print(f"🤖 Resposta: {result.get('response')[:300]}...")
    else:
        print(f"❌ Erro HTTP: {response.status_code}")
except Exception as e:
    print(f"❌ Erro: {e}")

print("\n" + "="*60)
print("🎯 TESTE CONCLUÍDO!")