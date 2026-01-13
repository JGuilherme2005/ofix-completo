#!/usr/bin/env python3
"""
Script de teste para validar sistema de memória no Render
"""

import requests
import json
import time

# URL do serviço no Render
BASE_URL = "https://matias-agno-assistant.onrender.com"

def teste_health():
    """Teste 1: Health Check"""
    print("\n" + "="*80)
    print("🔍 TESTE 1: Health Check")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Status: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def teste_primeira_conversa():
    """Teste 2: Primeira conversa (criar memória)"""
    print("\n" + "="*80)
    print("🧠 TESTE 2: Primeira Conversa - Criar Memória")
    print("="*80)
    
    # Testar múltiplos formatos
    formatos = [
        # Formato 1: String simples
        {"message": "Oi Matias! Meu carro é um Gol 2015 1.6", "user_id": "teste_pedro_123"},
        # Formato 2: Com stream
        {"message": "Oi Matias! Meu carro é um Gol 2015 1.6", "user_id": "teste_pedro_123", "stream": False},
        # Formato 3: Objeto message
        {"message": {"role": "user", "content": "Oi Matias! Meu carro é um Gol 2015 1.6"}, "user_id": "teste_pedro_123"},
    ]
    
    for idx, payload in enumerate(formatos, 1):
        print(f"\n📤 Tentativa {idx}/3 - Enviando: {json.dumps(payload, indent=2)}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/agents/matias/runs",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status: {response.status_code} - SUCESSO COM FORMATO {idx}!")
                print(f"🤖 Resposta do Matias:")
                print(f"   {data.get('content', data.get('response', 'Sem resposta'))[:300]}...")
                return True
            else:
                print(f"❌ Status: {response.status_code} - Erro: {response.text[:150]}")
        except Exception as e:
            print(f"❌ Erro na tentativa {idx}: {e}")
    
    print("\n❌ Nenhum formato funcionou")
    return False

def teste_primeira_conversa_OLD():
    """Teste 2 BACKUP"""
    print("\n" + "="*80)
    print("🧠 TESTE 2: Primeira Conversa - Criar Memória")
    print("="*80)
    
    payload = {
        "message": "Oi Matias! Meu carro é um Gol 2015 1.6",
        "user_id": "teste_pedro_123"
    }
    
    print(f"📤 Enviando: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            json=payload,
            timeout=60
        )
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"🤖 Resposta do Matias:")
            print(f"   {data.get('content', data.get('response', 'Sem resposta'))[:300]}...")
            return True
        else:
            print(f"❌ Erro {response.status_code}: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def teste_segunda_conversa():
    """Teste 3: Segunda conversa (validar memória)"""
    print("\n" + "="*80)
    print("🔥 TESTE 3: Segunda Conversa - Validar Memória")
    print("="*80)
    print("⏳ Aguardando 3 segundos para memória ser processada...")
    time.sleep(3)
    
    # Formato AgentOS correto
    payload = {
        "message": {
            "role": "user",
            "content": "Quanto custa trocar os freios?"
        },
        "user_id": "teste_pedro_123",
        "stream": False
    }
    
    print(f"📤 Enviando: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/agents/matias/runs",
            json=payload,
            timeout=60
        )
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            resposta = data.get('content', data.get('response', ''))
            
            print(f"🤖 Resposta do Matias:")
            print(f"   {resposta[:400]}...")
            
            # Verificar se mencionou o Gol 2015
            if "gol" in resposta.lower() or "2015" in resposta.lower():
                print("\n🎉 ✅ SUCESSO! Matias lembrou do Gol 2015!")
                return True
            else:
                print("\n⚠️  ATENÇÃO: Matias não mencionou o Gol 2015")
                print("   Pode ser que precise de mais contexto ou memória não foi salva")
                return False
        else:
            print(f"❌ Erro {response.status_code}: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("🚀 TESTE DO SISTEMA DE MEMÓRIA - MATIAS AI (RENDER)")
    print("="*80)
    print(f"🌐 URL: {BASE_URL}")
    print("="*80)
    
    resultados = []
    
    # Teste 1: Health
    resultados.append(("Health Check", teste_health()))
    
    # Teste 2: Primeira conversa
    resultados.append(("Primeira Conversa", teste_primeira_conversa()))
    
    # Teste 3: Segunda conversa (memória)
    resultados.append(("Validar Memória", teste_segunda_conversa()))
    
    # Resumo
    print("\n" + "="*80)
    print("📊 RESUMO DOS TESTES")
    print("="*80)
    
    for nome, sucesso in resultados:
        status = "✅ PASSOU" if sucesso else "❌ FALHOU"
        print(f"{status} - {nome}")
    
    total = len(resultados)
    passou = sum(1 for _, s in resultados if s)
    
    print(f"\n🎯 Total: {passou}/{total} testes passaram")
    
    if passou == total:
        print("\n🎉🎉🎉 TODOS OS TESTES PASSARAM! SISTEMA FUNCIONANDO! 🎉🎉🎉")
    else:
        print("\n⚠️  Alguns testes falharam. Verifique os logs acima.")

if __name__ == "__main__":
    main()
