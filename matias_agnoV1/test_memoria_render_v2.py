import requests
import time

BASE_URL = "https://matias-agno-assistant.onrender.com"

def test_health():
    """Testa o health check"""
    print("\n🏥 TESTE 1: Health Check")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_agent_config():
    """Testa informações do agente"""
    print("\n🤖 TESTE 2: Configuração do Agente Matias")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/agents/matias", timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Nome: {data.get('name')}")
            print(f"Model: {data.get('model', {}).get('model')}")
            print(f"Memory: {'✅' if data.get('memory') else '❌'}")
            print(f"Knowledge: {'✅' if data.get('knowledge') else '❌'}")
        else:
            print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_chat_with_memory(user_id="teste_pedro_123", session_id=None):
    """Testa chat com memória usando FORM-DATA (formato correto!)"""
    print("\n💬 TESTE 3: Chat com Memória (FORM-DATA)")
    print("=" * 60)
    
    # FORM-DATA ao invés de JSON!
    form_data = {
        "message": "Oi Matias! Meu carro é um Gol 2015 1.6",
        "user_id": user_id,
        "stream": "false"
    }
    if session_id:
        form_data["session_id"] = session_id
    
    print(f"Form Data: {form_data}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,  # data= ao invés de json=
            timeout=120  # Aumentei timeout para 2 minutos
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:1000]}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"\n✅ SUCESSO!")
                print(f"Run ID: {data.get('run_id')}")
                print(f"Session ID: {data.get('session_id')}")
                print(f"Content (primeiros 200 chars): {str(data.get('content'))[:200]}")
                return data.get('run_id'), data.get('session_id')
            except:
                print(f"Response não é JSON: {response.text}")
                return None, None
        return None, None
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None, None

def test_memory_persistence(user_id="teste_pedro_123", session_id=None):
    """Testa se a memória persiste em uma segunda mensagem"""
    print("\n🧠 TESTE 4: Verificar Persistência da Memória")
    print("=" * 60)
    
    form_data = {
        "message": "Qual modelo é meu carro mesmo?",
        "user_id": user_id,
        "stream": "false"
    }
    if session_id:
        form_data["session_id"] = session_id
    
    print(f"Form Data: {form_data}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,
            timeout=120
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                content = str(data.get('content', ''))
                print(f"Response Content: {content[:500]}")
                
                # Verificar se menciona "Gol 2015"
                if "Gol" in content and "2015" in content:
                    print("\n✅ MEMÓRIA FUNCIONANDO! Agente lembrou do carro.")
                    return True
                else:
                    print("\n⚠️ Agente não mencionou o carro. Memória pode não estar funcionando.")
                    return False
            except:
                print(f"Response não é JSON: {response.text}")
                return False
        else:
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_knowledge_query():
    """Testa se o agente consegue buscar conhecimento da base"""
    print("\n📚 TESTE 5: Busca de Conhecimento (LanceDB)")
    print("=" * 60)
    
    form_data = {
        "message": "Quanto custa uma troca de óleo?",
        "user_id": "teste_knowledge_001",
        "stream": "false"
    }
    
    print("⏳ Aguardando resposta (pode demorar devido ao LanceDB Remote)...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,
            timeout=180  # 3 minutos para LanceDB Remote
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                content = str(data.get('content', ''))
                print(f"Response Content: {content[:500]}")
                
                # Verificar se mencionou preço ou valores
                if any(word in content.lower() for word in ["r$", "reais", "preço", "custo", "valor"]):
                    print("\n✅ CONHECIMENTO ACESSADO! Agente usou base de dados.")
                    return True
                else:
                    print("\n⚠️ Resposta não mencionou valores. Base pode não ter sido consultada.")
                    return False
            except:
                print(f"Response não é JSON: {response.text}")
                return False
        else:
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 TESTE DE MEMÓRIA E CONHECIMENTO - MATIAS AGNO")
    print("="*60)
    
    # Teste 1: Health Check
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ Health check falhou. Abortando testes.")
        exit(1)
    
    # Teste 2: Config do agente
    config_ok = test_agent_config()
    
    # Teste 3: Primeira mensagem com contexto (criar memória)
    run_id, session_id = test_chat_with_memory()
    
    if session_id:
        print(f"\n📌 Session ID capturado: {session_id}")
        time.sleep(3)  # Aguardar processamento da memória
        
        # Teste 4: Segunda mensagem para verificar memória
        memory_ok = test_memory_persistence(user_id="teste_pedro_123", session_id=session_id)
    else:
        print("\n⚠️ Não foi possível obter session_id. Pulando teste de persistência.")
        memory_ok = False
    
    # Teste 5: Busca de conhecimento
    time.sleep(2)
    knowledge_ok = test_knowledge_query()
    
    print("\n" + "="*60)
    print("📊 RESUMO DOS TESTES")
    print("="*60)
    print(f"✅ Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"✅ Config Agente: {'PASS' if config_ok else 'FAIL'}")
    print(f"✅ Chat Básico: {'PASS' if run_id else 'FAIL'}")
    if session_id:
        print(f"✅ Persistência Memória: {'PASS' if memory_ok else 'FAIL'}")
    print(f"✅ Busca Conhecimento: {'PASS' if knowledge_ok else 'FAIL'}")
    print("="*60)
