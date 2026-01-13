"""
Teste Final Completo - Sistema de Memória Matias Agno
Validação end-to-end de todas as funcionalidades
"""
import requests
import time
from datetime import datetime

BASE_URL = "https://matias-agno-assistant.onrender.com"

def print_section(title, emoji="🔍"):
    print(f"\n{emoji} {title}")
    print("=" * 70)

def test_1_health():
    """Teste 1: Health Check"""
    print_section("TESTE 1: Health Check", "🏥")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        assert response.status_code == 200
        print("✅ Status: 200 OK")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_2_agent_config():
    """Teste 2: Configuração do Agente"""
    print_section("TESTE 2: Configuração do Agente", "🤖")
    try:
        response = requests.get(f"{BASE_URL}/agents/matias", timeout=10)
        assert response.status_code == 200
        data = response.json()
        
        print("✅ Status: 200 OK")
        print(f"   Nome: {data.get('name')}")
        print(f"   Model: {data.get('model', {}).get('model')}")
        print(f"   Provider: {data.get('model', {}).get('provider')}")
        
        has_memory = data.get('memory') is not None
        has_tools = data.get('tools') is not None
        
        print(f"   Memory: {'✅ Ativa' if has_memory else '❌ Inativa'}")
        print(f"   Tools: {'✅ {}'.format(len(data.get('tools', {}).get('tools', []))) if has_tools else '❌'}")
        
        return has_memory
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_3_create_memory():
    """Teste 3: Criar Memória (Primeira Interação)"""
    print_section("TESTE 3: Criar Memória - Primeira Interação", "💾")
    
    user_id = f"test_user_{int(time.time())}"
    print(f"   User ID: {user_id}")
    
    form_data = {
        "message": "Olá! Meu nome é Pedro e tenho um Volkswagen Gol 2015 1.6 preto. A placa é ABC-1234.",
        "user_id": user_id,
        "stream": "false"
    }
    
    try:
        print("   📤 Enviando primeira mensagem...")
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,
            timeout=120
        )
        
        assert response.status_code == 200
        data = response.json()
        
        print("✅ Status: 200 OK")
        print(f"   Run ID: {data.get('run_id')}")
        print(f"   Session ID: {data.get('session_id')}")
        print(f"   Tokens: {data.get('metrics', {}).get('total_tokens')}")
        print(f"   Resposta: {data.get('content')[:150]}...")
        
        return user_id, data.get('session_id')
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None, None

def test_4_verify_memory(user_id, session_id):
    """Teste 4: Verificar Persistência da Memória"""
    print_section("TESTE 4: Verificar Persistência da Memória", "🧠")
    
    if not user_id or not session_id:
        print("⚠️ Pulando teste - user_id ou session_id não disponíveis")
        return False
    
    print(f"   User ID: {user_id}")
    print(f"   Session ID: {session_id}")
    print("   ⏱️ Aguardando 3s para processamento da memória...")
    time.sleep(3)
    
    form_data = {
        "message": "Qual é o modelo e a cor do meu carro?",
        "user_id": user_id,
        "session_id": session_id,
        "stream": "false"
    }
    
    try:
        print("   📤 Enviando pergunta de teste de memória...")
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,
            timeout=120
        )
        
        assert response.status_code == 200
        data = response.json()
        content = data.get('content', '').lower()
        
        print("✅ Status: 200 OK")
        print(f"   Resposta: {data.get('content')[:200]}...")
        
        # Verificar se lembrou do carro
        has_gol = "gol" in content
        has_2015 = "2015" in content
        has_preto = "preto" in content or "preta" in content
        
        print(f"\n   Verificação de Memória:")
        print(f"   {'✅' if has_gol else '❌'} Mencionou 'Gol'")
        print(f"   {'✅' if has_2015 else '❌'} Mencionou '2015'")
        print(f"   {'✅' if has_preto else '❌'} Mencionou 'preto'")
        
        memory_works = has_gol and has_2015
        
        if memory_works:
            print("\n   🎉 MEMÓRIA FUNCIONANDO PERFEITAMENTE!")
        else:
            print("\n   ⚠️ Memória pode não estar funcionando corretamente")
        
        return memory_works
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_5_knowledge_base():
    """Teste 5: Busca na Base de Conhecimento (LanceDB)"""
    print_section("TESTE 5: Busca na Base de Conhecimento", "📚")
    
    form_data = {
        "message": "Quais são os sintomas de pastilha de freio gasta?",
        "user_id": f"test_kb_{int(time.time())}",
        "stream": "false"
    }
    
    try:
        print("   ⏳ Consultando LanceDB Remote (pode demorar)...")
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            data=form_data,
            timeout=180  # 3 minutos
        )
        
        if response.status_code != 200:
            print(f"⚠️ Status: {response.status_code}")
            print(f"   Response: {response.text[:300]}")
            return False
        
        data = response.json()
        content = data.get('content', '').lower()
        
        print("✅ Status: 200 OK")
        print(f"   Tokens: {data.get('metrics', {}).get('total_tokens')}")
        print(f"   Resposta: {data.get('content')[:300]}...")
        
        # Verificar se usou conhecimento técnico
        has_technical = any(word in content for word in [
            "barulho", "ruído", "desgaste", "freio", "pastilha", 
            "disco", "vibração", "chiado"
        ])
        
        if has_technical:
            print("\n   ✅ Resposta técnica detectada - Base de conhecimento consultada")
        else:
            print("\n   ⚠️ Resposta genérica - Base pode não ter sido consultada")
        
        return has_technical
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_6_context_maintenance():
    """Teste 6: Manutenção de Contexto em Múltiplas Mensagens"""
    print_section("TESTE 6: Contexto em Múltiplas Mensagens", "🔗")
    
    user_id = f"test_context_{int(time.time())}"
    session_id = None
    
    messages = [
        "Meu carro está com barulho ao frear",
        "É um chiado alto",
        "O que pode ser?"
    ]
    
    try:
        for i, msg in enumerate(messages, 1):
            print(f"\n   Mensagem {i}/3: '{msg}'")
            
            form_data = {
                "message": msg,
                "user_id": user_id,
                "stream": "false"
            }
            if session_id:
                form_data["session_id"] = session_id
            
            response = requests.post(
                f"{BASE_URL}/agents/matias/runs",
                data=form_data,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get('session_id')
                print(f"   ✅ Resposta recebida ({len(data.get('content', ''))} chars)")
                
                if i == len(messages):
                    content = data.get('content', '').lower()
                    has_context = any(word in content for word in ["chiado", "freio", "pastilha", "desgaste"])
                    print(f"\n   {'✅' if has_context else '⚠️'} Manteve contexto: {has_context}")
                    return has_context
            else:
                print(f"   ❌ Status: {response.status_code}")
                return False
            
            time.sleep(1)  # Pequena pausa entre mensagens
        
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("\n" + "="*70)
    print("🧪 TESTE FINAL COMPLETO - SISTEMA MATIAS AGNO")
    print("="*70)
    print(f"   Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"   Base URL: {BASE_URL}")
    print("="*70)
    
    results = {}
    
    # Teste 1: Health Check
    results['health'] = test_1_health()
    if not results['health']:
        print("\n❌ ABORTANDO - API não está respondendo")
        return
    
    # Teste 2: Config do Agente
    results['config'] = test_2_agent_config()
    
    # Teste 3: Criar Memória
    user_id, session_id = test_3_create_memory()
    results['create_memory'] = (user_id is not None and session_id is not None)
    
    # Teste 4: Verificar Memória
    results['verify_memory'] = test_4_verify_memory(user_id, session_id)
    
    # Teste 5: Base de Conhecimento
    results['knowledge'] = test_5_knowledge_base()
    
    # Teste 6: Contexto
    results['context'] = test_6_context_maintenance()
    
    # Resumo Final
    print_section("RESUMO FINAL DOS TESTES", "📊")
    
    tests = [
        ("Health Check", results['health']),
        ("Configuração do Agente", results['config']),
        ("Criação de Memória", results['create_memory']),
        ("Persistência de Memória", results['verify_memory']),
        ("Base de Conhecimento", results['knowledge']),
        ("Manutenção de Contexto", results['context'])
    ]
    
    passed = sum(1 for _, result in tests if result)
    total = len(tests)
    
    for name, result in tests:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {name}")
    
    print("=" * 70)
    print(f"   RESULTADO: {passed}/{total} testes passaram ({passed*100//total}%)")
    
    if passed == total:
        print("   🎉 TODOS OS TESTES PASSARAM! Sistema 100% funcional!")
    elif passed >= total * 0.8:
        print("   ✅ Sistema majoritariamente funcional")
    elif passed >= total * 0.5:
        print("   ⚠️ Sistema parcialmente funcional - requer ajustes")
    else:
        print("   ❌ Sistema requer correções significativas")
    
    print("=" * 70)

if __name__ == "__main__":
    main()
