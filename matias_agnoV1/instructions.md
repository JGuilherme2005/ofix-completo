# Plano de Automação - Documentos RAG com Gemini CLI

## 📁 Estrutura do Projeto

```
matias-ai/
├── rag-documents/
│   ├── diagnosticos/
│   ├── manutencao/
│   ├── precos/
│   ├── codigos-erro/
│   ├── agendamento/
│   └── orientacoes-gerais/
├── scripts/
│   ├── generate-docs.sh
│   ├── prompts/
│   │   ├── base-template.txt
│   │   ├── diagnostico-template.txt
│   │   ├── manutencao-template.txt
│   │   └── precos-template.txt
│   └── config/
│       ├── topics.json
│       └── gemini-config.json
└── tools/
    ├── validate-docs.py
    └── merge-docs.py
```

## 🚀 Configuração Inicial

### 1. Instalação do Gemini CLI
```bash
# Instalar Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud auth login

# Configurar projeto
gcloud config set project YOUR_PROJECT_ID
gcloud services enable aiplatform.googleapis.com
```

### 2. Estrutura de Tópicos (topics.json)
```json
{
  "diagnosticos": [
    {
      "titulo": "Diagnóstico de Barulhos no Motor",
      "categoria": "motor",
      "prioridade": 1,
      "palavras_chave": ["barulho motor", "ruído motor", "batida motor"]
    },
    {
      "titulo": "Problemas de Partida",
      "categoria": "partida",
      "prioridade": 1,
      "palavras_chave": ["carro não pega", "motor não liga", "partida difícil"]
    }
  ],
  "codigos_erro": [
    {
      "titulo": "Códigos P0XXX - Powertrain",
      "categoria": "obd2",
      "prioridade": 1,
      "range": "P0000-P0999"
    }
  ],
  "manutencao": [
    {
      "titulo": "Manutenção 10.000km",
      "categoria": "preventiva",
      "prioridade": 2,
      "intervalo": "10000km"
    }
  ]
}
```

## 📝 Sistema de Templates

### Template Base (base-template.txt)
```
Você é um especialista automotivo criando documentação técnica para um sistema RAG.

REGRAS OBRIGATÓRIAS:
- Use linguagem clara e objetiva
- Inclua sempre seção de "Palavras-chave" com termos que clientes usam
- Forneça preços em faixa (mín-máx) em Reais
- Classifique urgência: 🔴 CRÍTICA | 🟡 MÉDIA | 🟢 BAIXA
- Use tabelas quando possível
- Inclua consequências de não fazer o serviço

ESTRUTURA OBRIGATÓRIA:
# [TÍTULO]

## Palavras-chave
[Lista de termos que clientes podem usar]

## Sintomas Relatados pelo Cliente
[Como o cliente descreve o problema]

## Diagnóstico Técnico
[Como identificar o problema]

## Soluções e Custos
[Tabela com serviços, peças e valores]

## Nível de Urgência
[Classificação com emoji]

## Consequências de Não Fazer
[O que acontece se ignorar]

## Dicas de Prevenção
[Como evitar o problema]

## Agendamento Recomendado
[Quando e como agendar]

TÓPICO: {TOPIC}
CATEGORIA: {CATEGORY}
CONTEXTO ADICIONAL: {CONTEXT}
```

### Template para Diagnósticos (diagnostico-template.txt)
```
{BASE_TEMPLATE}

INSTRUÇÕES ESPECÍFICAS PARA DIAGNÓSTICOS:
- Foque em sintomas que o cliente percebe (barulhos, vibrações, cheiros)
- Inclua testes simples que o cliente pode fazer
- Diferencie problemas similares
- Mencione ferramentas necessárias para diagnóstico

SINTOMAS COMUNS A INCLUIR:
- Barulhos (tipo, momento que ocorre)
- Vibrações (localização, intensidade)
- Mudanças de comportamento do veículo
- Indicadores no painel
```

## 🤖 Scripts de Automação

### Script Principal (generate-docs.sh)
```bash
#!/bin/bash

# Configurações
GEMINI_MODEL="gemini-1.5-pro"
MAX_TOKENS=4000
TEMPERATURE=0.3

# Função para gerar documento
generate_document() {
    local topic="$1"
    local category="$2"
    local template="$3"
    local output_path="$4"
    
    echo "Gerando documento: $topic"
    
    # Preparar prompt
    prompt=$(cat "scripts/prompts/$template" | \
             sed "s/{TOPIC}/$topic/g" | \
             sed "s/{CATEGORY}/$category/g")
    
    # Chamar Gemini CLI
    gcloud ai endpoints predict \
        --endpoint-id="YOUR_ENDPOINT_ID" \
        --input-file=<(echo "$prompt") \
        --model="$GEMINI_MODEL" \
        --max-tokens="$MAX_TOKENS" \
        --temperature="$TEMPERATURE" > "$output_path"
    
    echo "✅ Documento salvo em: $output_path"
}

# Ler tópicos do JSON
topics=$(jq -r '.diagnosticos[] | @base64' scripts/config/topics.json)

# Gerar documentos de diagnóstico
for topic in $topics; do
    data=$(echo "$topic" | base64 --decode | jq -r .)
    titulo=$(echo "$data" | jq -r '.titulo')
    categoria=$(echo "$data" | jq -r '.categoria')
    
    # Sanitizar nome do arquivo
    filename=$(echo "$titulo" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
    output_path="rag-documents/diagnosticos/${filename}.md"
    
    generate_document "$titulo" "$categoria" "diagnostico-template.txt" "$output_path"
    
    sleep 2 # Evitar rate limiting
done

echo "🎉 Geração de documentos concluída!"
```

### Script para Códigos OBD2 (generate-obd2.sh)
```bash
#!/bin/bash

# Lista de códigos OBD2 mais comuns
codes=("P0171" "P0174" "P0300" "P0301" "P0302" "P0420" "P0430" "P0128")

for code in "${codes[@]}"; do
    prompt="Crie documentação completa para o código OBD2 $code seguindo o template base. 
    Inclua:
    - Significado técnico
    - Sintomas que o cliente percebe
    - Possíveis causas
    - Testes de diagnóstico
    - Custos de reparo
    - Urgência do problema"
    
    filename="rag-documents/codigos-erro/codigo-${code}.md"
    
    gcloud ai endpoints predict \
        --endpoint-id="YOUR_ENDPOINT_ID" \
        --input-file=<(echo "$prompt") > "$filename"
    
    echo "✅ Código $code documentado"
    sleep 2
done
```

## 🔧 Ferramentas de Validação

### Validador de Documentos (validate-docs.py)
```python
import os
import re
import json
from pathlib import Path

def validate_document(file_path):
    """Valida se o documento segue a estrutura esperada"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_sections = [
        "# ",  # Título
        "## Palavras-chave",
        "## Sintomas Relatados",
        "## Diagnóstico Técnico",
        "## Soluções e Custos",
        "## Nível de Urgência",
        "## Consequências"
    ]
    
    missing_sections = []
    for section in required_sections:
        if section not in content:
            missing_sections.append(section)
    
    return {
        "valid": len(missing_sections) == 0,
        "missing": missing_sections,
        "word_count": len(content.split()),
        "has_prices": bool(re.search(r'R\$\s*\d+', content)),
        "has_urgency": bool(re.search(r'[🔴🟡🟢]', content))
    }

def validate_all_docs():
    """Valida todos os documentos RAG"""
    rag_dir = Path("rag-documents")
    results = {}
    
    for file_path in rag_dir.rglob("*.md"):
        results[str(file_path)] = validate_document(file_path)
    
    return results

if __name__ == "__main__":
    results = validate_all_docs()
    
    valid_count = sum(1 for r in results.values() if r["valid"])
    total_count = len(results)
    
    print(f"📊 Validação: {valid_count}/{total_count} documentos válidos")
    
    for file_path, result in results.items():
        if not result["valid"]:
            print(f"❌ {file_path}: {result['missing']}")
```

## ⚙️ Pipeline de Execução

### 1. Preparação
```bash
# Criar estrutura de pastas
mkdir -p rag-documents/{diagnosticos,manutencao,precos,codigos-erro,agendamento,orientacoes-gerais}
mkdir -p scripts/{prompts,config}
mkdir -p tools

# Configurar permissões
chmod +x scripts/*.sh
```

### 2. Execução Sequencial
```bash
# 1. Gerar documentos de diagnóstico
./scripts/generate-docs.sh

# 2. Gerar códigos OBD2
./scripts/generate-obd2.sh

# 3. Validar documentos
python tools/validate-docs.py

# 4. Revisar e corrigir se necessário
```

### 3. Automatização Completa (Makefile)
```makefile
.PHONY: all generate validate clean

all: generate validate

generate:
	@echo "🚀 Gerando documentos RAG..."
	./scripts/generate-docs.sh
	./scripts/generate-obd2.sh

validate:
	@echo "🔍 Validando documentos..."
	python tools/validate-docs.py

clean:
	@echo "🧹 Limpando documentos gerados..."
	find rag-documents -name "*.md" -delete

setup:
	@echo "⚙️ Configurando ambiente..."
	pip install -r requirements.txt
	chmod +x scripts/*.sh
```

## 📈 Métricas e Monitoramento

### Acompanhar Progresso
- Total de documentos gerados
- Documentos válidos vs inválidos
- Cobertura por categoria
- Custo de tokens utilizados
- Tempo de geração

### Dashboard Simples
```bash
echo "📊 Status do Projeto RAG"
echo "========================"
echo "Diagnósticos: $(ls rag-documents/diagnosticos/*.md 2>/dev/null | wc -l) documentos"
echo "Códigos OBD2: $(ls rag-documents/codigos-erro/*.md 2>/dev/null | wc -l) documentos"
echo "Manutenção: $(ls rag-documents/manutencao/*.md 2>/dev/null | wc -l) documentos"
echo "Total: $(find rag-documents -name "*.md" | wc -l) documentos"
```

## 🔄 Iteração e Melhoria

1. **Teste inicial** com 5-10 documentos
2. **Validação manual** da qualidade
3. **Ajuste de prompts** baseado nos resultados
4. **Geração em lote** após aprovação
5. **Integração contínua** para novos tópicos

Este plano permite gerar centenas de documentos estruturados automaticamente, mantendo qualidade e consistência para alimentar seu sistema RAG do Matias AI!