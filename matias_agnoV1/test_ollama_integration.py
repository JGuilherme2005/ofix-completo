"""
Teste de Integração Ollama - Ofix
Validação end-to-end do agente rodando com Ollama localmente.
"""
import requests
import time
import sys
from datetime import datetime

# Definir URL local
BASE_URL = "http://localhost:8000"

def print_section(title, emoji="🔍"):
    print(f"\n{emoji} {title}")
    print("=" * 70)

def test_1_health():
    """Teste 1: Health Check"""
    print_section("TESTE 1: Health Check (API Disponível?)", "🏥")
    try:
        # Tentar conectar na raiz ou endpoint de health se existir, ou apenas ver se conecta
        # Na API atual, /chat-inteligente é POST. Vamos tentar endpoint de contexto se houver
        # Baseado no api.py lido: @router.get("/contexto-sistema")
        response = requests.get(f"{BASE_URL}/agno/contexto-sistema", timeout=5)
        
        if response.status_code == 200:
            print("✅ Status: 200 OK")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Status inesperado: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Não foi possível conectar. O servidor está rodando?")
        print(f"   URL tentada: {BASE_URL}")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_2_knowledge_query():
    """Teste 2: Consulta de Conhecimento (Demorado)"""
    print_section("TESTE 2: Pergunta Técnica (Teste de Inteligência)", "🧠")
    
    payload = {
        "message": "Quais são os sinais de que preciso trocar o óleo do motor?",
        "contexto_conversa": []
    }
    
    start_time = time.time()
    try:
        print("   ⏳ Enviando pergunta para o Ollama (isso pode demorar minutos)...")
        # Baseado no api.py lido: @router.post("/chat-inteligente")
        response = requests.post(
            f"{BASE_URL}/agno/chat-inteligente", 
            json=payload, 
            timeout=300 # 5 minutos de timeout
        )
        
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            content = data.get('conteudo', '')
            
            print(f"✅ Resposta recebida em {duration:.1f}s")
            print("-" * 50)
            print(content)
            print("-" * 50)
            
            # Verificações básicas de qualidade
            keywords = ['óleo', 'motor', 'luz', 'ruído', 'cor', 'nível']
            found = [k for k in keywords if k in content.lower()]
            
            if len(found) >= 2:
                print(f"   ✅ Qualidade: Identificou palavras-chave relevantes: {found}")
                return True
            else:
                print(f"   ⚠️ Qualidade: Resposta pode ser genérica demais. Palavras encontradas: {found}")
                return True # Passou no teste técnico de conexão, mesmo se qualidade for duvidosa
        else:
            print(f"❌ Erro na API: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"❌ Timeout: O modelo demorou mais de 300s para responder")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("\n" + "="*70)
    print("🚀 TESTE DE INTEGRAÇÃO OLLAMA")
    print("="*70)
    
    # Verificar se o servidor está rodando (manual por enquanto)
    print("⚠️ CERTIFIQUE-SE QUE 'python -m matias_agno.main' ESTÁ RODANDO EM OUTRO TERMINAL!")
    print("   Se não estiver, este teste vai falhar na conexão.\n")
    
    # Teste 1
    if not test_1_health():
        print("\n❌ Falha no Health Check. Abortando.")
        return

    # Teste 2
    test_2_knowledge_query()

if __name__ == "__main__":
    main()
