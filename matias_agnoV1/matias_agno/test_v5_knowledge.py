#!/usr/bin/env python3
"""
Script para testar a nova base de conhecimento v5
Executa múltiplas queries em diferentes categorias
"""

import requests
import json
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:8000"

def test_query(query, category):
    """Testa uma query específica"""
    print(f"\n{'='*80}")
    print(f"📋 CATEGORIA: {category}")
    print(f"🔍 QUERY: {query}")
    print(f"{'='*80}")
    
    try:
        response = requests.get(
            f"{BASE_URL}/test_knowledge",
            params={"query": query},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            
            print(f"✅ Status: {response.status_code}")
            print(f"📊 Documentos encontrados: {len(results)}")
            
            if results:
                print(f"\n📄 TOP 5 RESULTADOS:")
                for i, doc in enumerate(results[:5], 1):
                    metadata = doc.get("metadata", {})
                    source = metadata.get("source", "Desconhecido")
                    category_doc = metadata.get("category", "N/A")
                    
                    # Pega primeiras 100 chars do texto
                    text = doc.get("text", "")[:100].replace("\n", " ")
                    
                    print(f"\n  {i}. 📁 {source}")
                    print(f"     🏷️  Categoria: {category_doc}")
                    print(f"     📝 Texto: {text}...")
            else:
                print(f"⚠️  Nenhum documento encontrado!")
        else:
            print(f"❌ Erro: Status {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"❌ ERRO: {str(e)}")

def main():
    """Executa todos os testes"""
    print(f"\n{'#'*80}")
    print(f"# 🧪 TESTE DA BASE DE CONHECIMENTO V5")
    print(f"# 🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*80}")
    
    # Testa endpoint de health
    print(f"\n{'='*80}")
    print(f"🏥 TESTANDO HEALTH ENDPOINT")
    print(f"{'='*80}")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"✅ API Online - Status: {r.status_code}")
        print(f"📄 Response: {r.json()}")
    except Exception as e:
        print(f"❌ API Offline - Erro: {str(e)}")
        return
    
    # Queries de teste por categoria
    test_cases = [
        # 1. TÉCNICO
        ("quanto custa troca de oleo", "1_tecnico"),
        ("pedal de freio mole", "1_tecnico"),
        ("alinhamento e balanceamento", "1_tecnico"),
        
        # 2. GESTÃO
        ("como atrair clientes para oficina", "2_gestao"),
        ("gestão de estoque autopeças", "2_gestao"),
        
        # 3. PEÇAS
        ("peças falsificadas como identificar", "3_pecas"),
        ("fornecedores de autopeças", "3_pecas"),
        
        # 4. SERVIÇOS
        ("serviços express oficina", "4_servicos"),
        ("tabela de preços serviços", "4_servicos"),
        
        # 5. LEGISLAÇÃO
        ("CDC direitos consumidor oficinas", "5_legislacao"),
        ("segurança do trabalho oficina", "5_legislacao"),
    ]
    
    # Executa todos os testes
    for query, category in test_cases:
        test_query(query, category)
    
    # Resumo final
    print(f"\n{'#'*80}")
    print(f"# ✅ TESTES CONCLUÍDOS")
    print(f"# Total de queries testadas: {len(test_cases)}")
    print(f"{'#'*80}\n")

if __name__ == "__main__":
    main()
