# 🚀 Plano de Implementação Avançado - Matias AI
## Baseado na Análise Técnica Profunda

**Versão:** 2.1 (Atualizado com Progresso Real)  
**Data:** 23/11/2025  
**Status:** 🟡 Em Execução (Fase 1 Concluída, Fase 2 Iniciada)  
**Prazo Estimado:** 10 semanas restantes  

---

## 🎯 RESUMO EXECUTIVO

### Mudanças Críticas Baseadas no Contexto Real

**Análise de contexto revelou 3 prioridades P1 (CRÍTICAS):**

1. **🚨 PRECISÃO EM DADOS CRÍTICOS (SEGURANÇA)**
   - **Problema:** Torque errado = acidente fatal
   - **Dados:** 111 chunks de Peças + tabelas de especificação
   - **Solução:** Indexação row-level + validação 100% por SME
   - **Prazo:** Semanas 2-6 (INÍCIO IMEDIATO)

2. **⚖️ COMPLIANCE LEGAL (MULTA/INTERDIÇÃO)**
   - **Problema:** 57 chunks de Legislação podem estar desatualizados
   - **Risco:** NR-12 desatualizada = interdição da oficina
   - **Solução:** Auditoria trimestral + versionamento de docs
   - **Prazo:** Semana 12 + monitoramento contínuo

3. **⚡ LATÊNCIA EM QUERIES COMPLEXAS (UX)**
   - **Problema:** 3-5s afeta diagnósticos (60% usuários abandonam)
   - **Contexto:** Cache 52.8% já ajuda queries simples
   - **Solução:** Reranking + busca híbrida para RAG complexo
   - **Prazo:** Semanas 4-7

### Decisões Estratégicas Validadas

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| **Priorização** | Precisão > Latência > Custo | Segurança não é negociável |
| **Arquitetura** | Fases em paralelo (1+2) | Reduzir tempo total de 12→10 semanas |
| **Orçamento** | Investir em qualidade (Reranking) | ROI: evitar 1 acidente = incalculável |
| **Validação** | Ground Truth 100% em dados críticos | Zero tolerância para erro em torques |
| **Compliance** | Auditoria trimestral automatizada | Evitar multas >R$10k |

### Métricas de Sucesso Ajustadas

| Métrica | Baseline | Meta | Critério P1 |
|---------|----------|------|-------------|
| **Precisão Dados Críticos** | ~70% | **100%** | ✅ OBRIGATÓRIO |
| **Atualização Legislação** | Manual | Automática (90 dias) | ✅ OBRIGATÓRIO |
| **Latência RAG Complexo** | 3-5s | <2s | 🟠 IMPORTANTE |
| **Cache Hit Rate** | 52.8% | >70% | 🟡 DESEJÁVEL |

---

## 📊 Análise de Contexto Atual

### Situação Atual (Baseline)
```yaml
Performance:
  - Latência RAG: 3-5s (LanceDB Remote)
  - Cold Start: ~50s (Render Free Tier)
  - Taxa de Sucesso: 100% (6/6 testes)
  - Uptime: 99.2%

Base de Conhecimento:
  - Total: 624 chunks
  - Categorias: 5 (Técnico, Gestão, Peças, Serviços, Legislação)
  - Fontes: 65 arquivos (PDF, DOCX, TXT)
  - Estratégia: Busca vetorial pura (LanceDB)

Custos Mensais (Estimado):
  - Hugging Face API: $0 (Free Tier - 1000 req/dia)
  - LanceDB Remote: $0 (tier gratuito)
  - Render: $0 (Free Tier)
  - TOTAL: $0/mês ⚠️ Limitado por rate limits
```

### Problemas Identificados (CRÍTICOS)

| ID | Problema | Impacto | Urgência |
|----|----------|---------|----------|
| P1 | **Latência 3-5s** | 60% usuários abandonam >3s | 🔴 ALTA |
| P2 | **Rate Limit 429** | Sistema indisponível 5 min | 🔴 CRÍTICA |
| P3 | **Cold Start 50s** | Primeira requisição falha | 🟠 MÉDIA |
| P4 | **Sem Reranking** | "Lost in the Middle" (30% erros) | 🟠 ALTA |
| P5 | **Busca Vetorial Pura** | Termos técnicos exatos falham | 🟠 ALTA |
| P6 | **Dados Tabulares** | Especificações cortadas | 🟡 MÉDIA |
| P7 | **Sem Cache** | Queries repetidas custam API | 🟡 MÉDIA |

---

## 🎯 Objetivos SMART

### Objetivo Principal
**Transformar o Matias em um assistente automotivo de nível industrial com latência <2s, precisão >95% e custo <$50/mês**

### KPIs Alvo (3 meses)

| Métrica | Atual | Meta | Melhoria |
|---------|-------|------|----------|
| Latência Média | 3-5s | <2s | 🎯 -60% |
| Cold Start | 50s | <10s | 🎯 -80% |
| Precisão RAG | ~70% | >95% | 🎯 +25% |
| Custo Mensal | $0 | <$50 | ⚠️ Investir |
| Hit Rate Top-3 | 65% | >90% | 🎯 +25% |
| Uptime | 99.2% | 99.9% | 🎯 +0.7% |

---

## 📋 Roadmap Estratégico (12 Semanas)

### 🔴 FASE 1: Estabilização e Quick Wins (Semanas 1-3) - EM PARALELO
**Objetivo:** Resolver rate limits e implementar cache (ROI imediato)
**Status:** 🟡 Executar em paralelo com Fase 2 (Precisão RAG)
**Justificativa:** Cache (52.8% hit rate) já funciona, focar em estabilidade enquanto trabalha na precisão crítica

#### Semana 1: Correções Críticas
```bash
# ✅ Tarefa 1.1: Implementar Cache de Respostas [CONCLUÍDO]
Status: ✅ Implementado com Redis Cloud
Resultados:
  - Cache Hit: ~132ms
  - Cache Miss: ~4-8s
  - Economia: ~70% requisições repetidas

# ✅ Tarefa 1.2: Circuit Breaker Inteligente [PARCIAL]
Status: 🟡 Fallback implementado no RedisService
Pendente: Lógica de exponential backoff completa

# ✅ Tarefa 1.3: Warm-up Inteligente [CONCLUÍDO]
Status: ✅ Implementado em agno.routes.js
```

**Entregável:** Sistema estável com Redis Cache L1 e Warm-up ativo.

---

#### 🚀 Feature Adicional: Simulação de Estado Veicular (Realizado)
**Status:** ✅ Implementado (Phase 2.2)
**Descrição:** Engine de simulação física para cenários "E se?"
- Modelos Pydantic imutáveis (`VehicleState`)
- Regras de física (P0171, Troca de Óleo, Cold Start)
- Tool `simulate_vehicle_scenario` integrada ao Matias


---

#### Semana 2: Otimização de Custos
```bash
# ✅ Tarefa 2.1: Migrar para Hugging Face Pro
Decisão Estratégica:
  - Custo: $9/mês (requests ilimitados)
  - ROI: Elimina circuit breaker, aumenta disponibilidade
  - Alternativa: Ollama local (requer GPU)

# ✅ Tarefa 2.2: Otimizar Chunking Strategy
Tecnologia: LangChain RecursiveCharacterTextSplitter
Objetivo:
  - Reduzir chunks de 624 → ~400 (maior qualidade)
  - Chunk size: 800 tokens (atual: variável)
  - Overlap: 100 tokens (manter contexto)

Código:
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\n## ", "\n### ", "\n\n", "\n", " ", ""]
)

# ✅ Tarefa 2.3: Implementar Logging Estruturado
Adicionar métricas:
  - Latência por endpoint
  - Cache hit rate
  - Tokens consumidos por query
  - Documentos recuperados vs usados
```

**Entregável:** Custo controlado (<$20/mês), métricas de observabilidade

---

#### Semana 3: Testes e Baseline
```bash
# ✅ Tarefa 3.1: Criar Suite de Testes RAG
Arquivo: tests/test_rag_quality.py
Cenários:
  - 20 queries reais de produção
  - Ground truth manual (respostas corretas)
  - Métricas: Precision, Recall, F1-Score

# ✅ Tarefa 3.2: Benchmark de Performance
Ferramentas: Locust ou Apache Bench
Cenários:
  - 10 usuários simultâneos
  - 100 queries/minuto
  - Medir: P50, P95, P99 latências

# ✅ Tarefa 3.3: Documentar Baseline
Criar relatório com:
  - Hit Rate atual (Top-3 documentos)
  - Latências por categoria de query
  - Tipos de falha mais comuns
```

**Entregável:** Métricas baseline documentadas, ambiente de testes

---

### 🔴 FASE 2: PRECISÃO RAG CRÍTICA (Semanas 2-6) - **PRIORIDADE MÁXIMA**
**Objetivo:** Eliminar falhas em dados tabulares + busca híbrida + reranking
**Status:** 🔴 INÍCIO IMEDIATO (paralelo com Fase 1)
**Justificativa:** Torque errado = risco de segurança catastrófico. Compliance legal (NR-12) = multa/interdição

#### Semana 4: Busca Híbrida (Semantic + BM25) + Validação de Tabelas
```bash
# ✅ Tarefa 4.1: Implementar FTS Index no LanceDB
Tecnologia: LanceDB Full-Text Search (BM25)
Código:
import lancedb

# Criar índice FTS
table = db.open_table("conhecimento_oficina_v5_completo")
table.create_fts_index("text", replace=True)

# Busca híbrida
results = table.search(
    query="torque roda Gol",
    query_type="hybrid"  # Combina vetorial + BM25
).limit(10).to_list()

# ✅ Tarefa 4.2: Ajustar Pesos Semantic vs Lexical
Testar combinações:
  - 70% semantic / 30% BM25 (padrão)
  - 50% semantic / 50% BM25 (dados técnicos)
  - 80% semantic / 20% BM25 (conversação)

# ✅ Tarefa 4.3: Atualizar Tool buscar_conhecimento()
Modificar: matias_agno/agent_with_memory.py
def buscar_conhecimento(query: str, mode: str = "hybrid") -> str:
    table = db_lance.open_table(TABLE_NAME)
    
    if mode == "hybrid":
        results = table.search(query, query_type="hybrid").limit(10)
    elif mode == "semantic":
        results = table.search(embedding).limit(10)
    else:  # lexical
        results = table.search(query, query_type="fts").limit(10)
    
    # ... processar resultados
```

**Impacto Esperado:**
- ✅ +20% recall para termos técnicos exatos
- ✅ Melhor performance em códigos de peça (PN)

---

#### Semana 5: Reranking (Mitigar Lost in the Middle)
```bash
# ✅ Tarefa 5.1: Implementar RRF Reranker
Tecnologia: LanceDB RRFReranker (Reciprocal Rank Fusion)
Código:
from lancedb.rerankers import RRFReranker

reranker = RRFReranker(k=60)  # Parâmetro de fusão

results = table.search(query, query_type="hybrid") \
    .rerank(reranker=reranker) \
    .limit(3) \
    .to_list()

# ✅ Tarefa 5.2: Testar Cross-Encoder Reranker (Cohere)
Alternativa premium:
from lancedb.rerankers import CohereReranker

reranker = CohereReranker(api_key=COHERE_KEY)
results = table.search(query, query_type="hybrid") \
    .rerank(reranker=reranker) \
    .limit(3)

Custo: $1 por 1000 reranks (Cohere)
ROI: +30% precisão vs RRF (gratuito)

# ✅ Tarefa 5.3: Comparar Estratégias de Reranking
Benchmarks:
  1. Sem reranking (baseline)
  2. RRF (gratuito)
  3. LinearCombination (gratuito)
  4. Cohere (pago - $1/1k)
  5. Cross-Encoder local (BGE-reranker)

Métrica: Hit Rate @ Top-3
```

**Decisão:** Escolher reranker baseado em custo-benefício

---

#### Semana 2-3: 🚨 TABELAS CRÍTICAS (SEGURANÇA) - **INÍCIO IMEDIATO**
```bash
# ✅ Tarefa 2.1: Auditoria de Tabelas de Especificação Crítica
Objetivo: Identificar TODAS as tabelas com impacto em segurança
Escopo:
  - Tabelas de Torque (porcas, parafusos, velas)
  - Calibrações (pressão de pneus, folgas de válvula)
  - Especificações de fluidos (óleo, freio, arrefecimento)
  - Códigos de erro (DTCs) com ações corretivas

Método:
  1. Extrair TODAS as tabelas com Camelot/Tabula
  2. SME audita cada linha (precisão 100% requerida)
  3. Marcar criticidade: HIGH, MEDIUM, LOW
  
Output: tabelas_criticas.json
[
  {
    "fonte": "tabela_torques.txt",
    "veiculo": "Gol 2015",
    "especificacao": "Torque roda dianteira",
    "valor": "120 Nm",
    "criticidade": "HIGH",
    "consequencia_erro": "Roda solta, acidente fatal"
  }
]

# ✅ Tarefa 2.2: Indexação Row-Level com Validação
Tecnologia: Python + Pandas + LanceDB
Estratégia:
  1. Cada LINHA da tabela = 1 chunk independente
  2. Contexto enriquecido (veículo + categoria)
  3. Validação cruzada: embeddings similares → erro de extração

Código:
import pandas as pd
from lancedb import connect

# Extrair tabela crítica
df = pd.read_csv("tabela_torques.csv")

# Processar LINHA POR LINHA
chunks = []
for _, row in df.iterrows():
    chunk = {
        "text": f"Torque de aperto {row['componente']} do {row['veiculo']}: {row['valor']} Nm",
        "metadata": {
            "veiculo": row['veiculo'],
            "componente": row['componente'],
            "valor_numerico": float(row['valor'].replace(' Nm', '')),
            "criticidade": "HIGH",
            "categoria": "especificacao_tecnica",
            "fonte": "tabela_torques.txt",
            "validado_por": "SME",
            "data_validacao": "2025-11-17"
        }
    }
    chunks.append(chunk)

# Indexar no LanceDB
db = connect("db://ofx-rbf7i6")
table = db.open_table("conhecimento_oficina_v5_completo")
table.add(chunks)

# ✅ Tarefa 2.3: Conversão de Tabelas para Sintaxe Plana
Problema: LLMs têm dificuldade com Markdown tables
Solução: Converter para lista com sintaxe natural

# ANTES (Markdown - difícil para LLM):
| Veículo | Componente | Torque |
|---------|------------|--------|
| Gol 2015 | Roda dianteira | 120 Nm |
| Civic 2020 | Roda dianteira | 108 Nm |

# DEPOIS (Sintaxe plana - fácil para LLM):
ESPECIFICAÇÃO DE TORQUE - RODAS DIANTEIRAS

Volkswagen Gol 2015:
- Componente: Roda dianteira
- Torque de aperto: 120 Nm (12 kgfm)
- Ferramenta: Torquímetro calibrado
- Sequência: Aperto em cruz (padrão estrela)
- CRITICIDADE: ALTA - Torque incorreto pode causar soltura da roda

Honda Civic 2020:
- Componente: Roda dianteira
- Torque de aperto: 108 Nm (11 kgfm)
- Ferramenta: Torquímetro calibrado
- Sequência: Aperto em cruz (padrão estrela)
- CRITICIDADE: ALTA - Torque incorreto pode causar soltura da roda

# ✅ Tarefa 6.2: Enriquecimento de Metadados
Adicionar campos:
  - modelo_veiculo: "Gol", "Civic"
  - ano: "2015-2020"
  - categoria_servico: "freios", "motor"
  - criticidade: "alta", "media", "baixa"

Filtros na busca:
results = table.search(query) \
    .where("modelo_veiculo = 'Gol'") \
    .where("ano >= 2015")

# ✅ Tarefa 6.3: LUE (Vida Útil Esperada) Preditiva
Objetivo: Manutenção proativa
Adicionar metadados:
  - lue_km: 60000  # Pastilhas de freio
  - lue_meses: 24
  - sintomas_desgaste: ["chiado", "vibração"]

Lógica no agente:
if km_atual > (ultima_troca_km + lue_km * 0.8):
    return "⚠️ Preventivo: Pastilhas com 80% da vida útil"
```

**Entregável:** Busca precisa em tabelas, recomendações preditivas

#### 🧪 Semana 6-7: Validação com Ground Truth (Precisão 100%)
```bash
# ✅ Tarefa 6.4: Criar Dataset de Ground Truth
Objetivo: Validar que o RAG retorna especificações exatas
Método:
  1. SME cria 50 perguntas críticas com respostas corretas
  2. Executar RAG para cada pergunta
  3. Comparar resposta do agente vs Ground Truth
  4. Métrica de sucesso: 100% de precisão em valores numéricos

Exemplo de Ground Truth:
ground_truth_critico.json
[
  {
    "id": 1,
    "pergunta": "Qual o torque de aperto da roda do Gol 2015?",
    "resposta_esperada": "120 Nm",
    "categoria": "especificacao_critica",
    "fonte": "tabela_torques.txt",
    "validado_por": "SME Mecânico",
    "impacto_erro": "FATAL - Roda pode soltar"
  },
  {
    "id": 2,
    "pergunta": "Pressão de pneu Civic 2020 traseiro?",
    "resposta_esperada": "32 PSI (2.2 bar)",
    "categoria": "especificacao_critica",
    "fonte": "manual_civic_2020.md",
    "validado_por": "SME Mecânico",
    "impacto_erro": "MÉDIO - Desgaste irregular"
  }
]

# ✅ Tarefa 6.5: Script de Validação Automática
Arquivo: tests/test_ground_truth_critico.py

import json
import re
from agent_with_memory import matias

def extract_numeric_value(text):
    """Extrai valor numérico da resposta do agente"""
    match = re.search(r'(\d+(?:\.\d+)?)\s*(Nm|PSI|bar|kg|mm)', text)
    if match:
        return f"{match.group(1)} {match.group(2)}"
    return None

# Carregar Ground Truth
with open("ground_truth_critico.json") as f:
    ground_truth = json.load(f)

# Testar TODAS as perguntas críticas
resultados = []
for item in ground_truth:
    # Executar agente
    resposta_agente = matias.run(item["pergunta"]).content
    
    # Extrair valor numérico
    valor_agente = extract_numeric_value(resposta_agente)
    valor_esperado = item["resposta_esperada"]
    
    # Comparar
    precisao_exata = (valor_agente == valor_esperado)
    
    resultado = {
        "id": item["id"],
        "pergunta": item["pergunta"],
        "esperado": valor_esperado,
        "obtido": valor_agente,
        "correto": precisao_exata,
        "impacto_erro": item["impacto_erro"]
    }
    resultados.append(resultado)
    
    # Log de erro crítico
    if not precisao_exata and item["impacto_erro"] == "FATAL":
        print(f"🚨 ERRO CRÍTICO: {item['pergunta']}")
        print(f"   Esperado: {valor_esperado}")
        print(f"   Obtido: {valor_agente}")
        print(f"   Impacto: {item['impacto_erro']}")

# Calcular taxa de precisão
total = len(resultados)
corretos = sum(1 for r in resultados if r["correto"])
precisao = (corretos / total) * 100

print(f"\n📊 RESULTADOS DE VALIDAÇÃO:")
print(f"   Total: {total} perguntas críticas")
print(f"   Corretas: {corretos}")
print(f"   Precisão: {precisao:.1f}%")

# CRITÉRIO DE SUCESSO: 100% de precisão
assert precisao == 100.0, f"❌ FALHA: Precisão {precisao}% < 100% requerido"
print("✅ VALIDAÇÃO APROVADA: Precisão 100% em dados críticos")

# ✅ Tarefa 6.6: Integração com CI/CD
Adicionar ao GitHub Actions:
name: Validação Ground Truth Crítico
on: [push, pull_request]
jobs:
  test-critical-precision:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run Critical Ground Truth Test
        run: python tests/test_ground_truth_critico.py
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
          LANCEDB_API_KEY: ${{ secrets.LANCEDB_API_KEY }}
```

**Critério de Go-Live:** Precisão 100% em 50 perguntas críticas validadas por SME

---

### 🟢 FASE 3: Raciocínio Avançado e Multi-Agente (Semanas 8-10)
**Objetivo:** ReAct, self-correction, agentes especializados

#### Semana 8: ReAct e Self-Ask
```bash
# ✅ Tarefa 8.1: Implementar ReAct Loop
Modificar INSTRUCTIONS do agente:
REACT_PROMPT = """
Para cada pergunta, siga o ciclo ReAct:

1. THOUGHT: Pense sobre o problema
   - O que o usuário realmente quer?
   - Que informações preciso buscar?
   
2. ACTION: Execute uma ação
   - buscar_conhecimento("torque Gol 2015")
   - consultar_preco("pastilha freio")
   
3. OBSERVATION: Analise o resultado
   - Os documentos recuperados respondem a pergunta?
   - Falta alguma informação?
   
4. REPEAT ou ANSWER:
   - Se incompleto: volte ao THOUGHT
   - Se completo: responda com citação de fonte

EXEMPLO:
User: "Quanto custa troca de pastilha do Gol?"

THOUGHT: Preciso de preço de serviço + peça para Gol
ACTION: buscar_conhecimento("preço troca pastilha freio Gol")
OBSERVATION: Encontrado preço R$ 180-250 (fonte: precos_servicos.md)
ANSWER: "💰 Troca de pastilha do Gol: R$ 180-250 (mão de obra inclusa)"
"""

# ✅ Tarefa 8.2: Self-Ask Decomposition
Para queries complexas, quebrar em sub-perguntas:

User: "Meu Gol 2015 tá fazendo barulho no freio, quanto custa consertar?"

DECOMPOSE:
  Q1: Que tipo de barulho indica problema no freio?
  Q2: Qual a causa mais comum para esse sintoma?
  Q3: Quanto custa o reparo da causa identificada?
  Q4: Existem soluções alternativas mais baratas?

SYNTHESIZE: Resposta completa baseada nas 4 sub-respostas

# ✅ Tarefa 8.3: LLM-as-a-Judge (Auto-Correção)
Após gerar resposta, avaliar qualidade:
def avaliar_resposta(pergunta, resposta, documentos):
    judge_prompt = f"""
    Avalie se a resposta está correta e completa:
    
    Pergunta: {pergunta}
    Resposta: {resposta}
    Documentos: {documentos}
    
    Critérios:
    1. RELEVANCIA: Resposta está relacionada à pergunta?
    2. COMPLETUDE: Todas as informações necessárias foram incluídas?
    3. CITACAO: As fontes foram mencionadas?
    4. PRECISAO: Números/especificações estão corretos?
    
    Retorne: APROVADA ou REESCREVER (com motivo)
    """
    
    veredicto = llm(judge_prompt)
    
    if "REESCREVER" in veredicto:
        # Refazer busca com query refinada
        return refazer_busca(motivo=veredicto)
    else:
        return resposta
```

**Entregável:** Agente com raciocínio explícito, auto-correção

---

#### Semana 9-10: Multi-Agente Especializado
```bash
# ✅ Tarefa 9.1: Criar Agentes Especializados
Arquitetura:
  - Matias (Coordenador) - Roteamento inteligente
  - AgentePecas - Catálogo, preços, estoque
  - AgenteDiagnostico - Sintomas, códigos de erro
  - AgenteAgendamento - Calendário, disponibilidade

Código (Agno Framework):
from agno.agent import Agent
from agno.models.huggingface import HuggingFace

# Agente Peças (especializado)
agente_pecas = Agent(
    name="AgentePecas",
    role="Especialista em Peças Automotivas",
    instructions="""
    Você é especialista em:
    - Identificar peças por código PN
    - Consultar preços e disponibilidade
    - Sugerir peças alternativas compatíveis
    """,
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct"),
    tools=[buscar_catalogo_pecas, consultar_estoque],
    db=db_memory
)

# Matias (coordenador)
matias = Agent(
    name="Matias",
    team=[agente_pecas, agente_diagnostico],
    instructions="""
    Você coordena agentes especializados:
    - Para perguntas sobre peças → AgentePecas
    - Para diagnósticos → AgenteDiagnostico
    """,
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct")
)

# ✅ Tarefa 9.2: Implementar Handoff entre Agentes
Lógica de roteamento:
def rotear_query(query: str):
    if "preço" in query or "peça" in query or "PN" in query:
        return agente_pecas.run(query)
    elif "barulho" in query or "problema" in query:
        return agente_diagnostico.run(query)
    else:
        return matias.run(query)  # Coordenador geral
```

**Entregável:** Sistema multi-agente com especialização por domínio

---

### 🔵 FASE 4: Dados Multimodais e Governança (Semanas 11-12)
**Objetivo:** Processar diagramas, auditoria, compliance

#### Semana 11: Multi-Vector RAG (Diagramas)
```bash
# ✅ Tarefa 11.1: Extrair Imagens de PDFs
Tecnologia: PyMuPDF (fitz)
import fitz  # PyMuPDF

doc = fitz.open("manual_eletrico.pdf")
for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images()
    
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        
        # Salvar imagem
        with open(f"diagrama_{page_num}_{img_index}.png", "wb") as f:
            f.write(image_bytes)

# ✅ Tarefa 11.2: Gerar Descrições com LLM Multimodal
Tecnologia: GPT-4 Vision ou LLaVA (local)
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Descreva este diagrama elétrico em detalhes, listando todos os componentes e números de peça visíveis."},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_base64}"}}
        ]
    }]
)

descricao = response.choices[0].message.content

# ✅ Tarefa 11.3: Indexar Descrições + Vetores de Imagem
Estratégia Multi-Vector:
  1. Gerar embedding da descrição textual
  2. Gerar embedding visual da imagem (CLIP)
  3. Armazenar ambos no LanceDB
  
Busca:
  - Query textual → recupera por descrição
  - Query visual → recupera por similaridade de imagem
```

**Custo:** GPT-4 Vision: $0.01 por imagem (65 imagens ≈ $0.65)

---

#### Semana 12: 🚨 COMPLIANCE LEGAL (PRIORIDADE P1)
```bash
# ✅ Tarefa 12.1: Auditoria Urgente de Documentos Legais
Objetivo: Evitar multas e interdição por legislação desatualizada
Escopo Crítico: 57 chunks de Legislação

DOCUMENTOS CRÍTICOS A AUDITAR:
1. NR-12 (Segurança no Trabalho em Máquinas)
2. NR-10 (Segurança em Instalações Elétricas)
3. CONTRAN Resolução 761/2019 (Inspeção Veicular)
4. NBR 14040 (Gestão de Resíduos)

Processo de Auditoria:
  1. Verificar versão atual em fonte oficial (gov.br)
  2. Comparar com versão no sistema (hash SHA-256)
  3. Identificar mudanças críticas
  4. SME Legal valida impacto para oficina
  5. Atualizar docs + reindexar LanceDB

# Script de Auditoria
import hashlib
import requests
from datetime import datetime

# URLs oficiais
FONTES_OFICIAIS = {
    "NR-12": "https://www.gov.br/trabalho-e-previdencia/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/normas-regulamentadoras/nr-12.pdf",
    "NR-10": "https://www.gov.br/trabalho-e-previdencia/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/normas-regulamentadoras/nr-10.pdf",
    "CONTRAN_761": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes/resolucao7612019.pdf"
}

def verificar_atualizacao(doc_name, url_oficial):
    # Baixar versão oficial
    response = requests.get(url_oficial)
    hash_oficial = hashlib.sha256(response.content).hexdigest()
    
    # Comparar com versão local
    with open(f"5_legislacao/{doc_name}.pdf", "rb") as f:
        hash_local = hashlib.sha256(f.read()).hexdigest()
    
    if hash_oficial != hash_local:
        print(f"🚨 {doc_name} DESATUALIZADO!")
        print(f"   Hash oficial: {hash_oficial[:16]}...")
        print(f"   Hash local:   {hash_local[:16]}...")
        return False
    else:
        print(f"✅ {doc_name} atualizado")
        return True

# Executar auditoria
for doc, url in FONTES_OFICIAIS.items():
    verificar_atualizacao(doc, url)

# ✅ Tarefa 12.2: Versionamento de Documentos Legais
Estrutura:
conhecimento_oficina/
├── 5_legislacao/
│   ├── NR-12_v2024-11.md  # Versão Nov/2024
│   ├── NR-12_v2023-08.md  # Versão anterior (backup)
│   ├── NR-10_v2023-06.md
│   ├── CONTRAN_761_v2019.md
│   └── changelog_legislacao.md  # Log de mudanças

Metadados Expandidos:
{
  "source": "NR-12",
  "version": "2024-11",
  "valid_from": "2024-11-01",
  "valid_until": null,  # null = vigente
  "criticality": "HIGH",
  "audit_hash": "sha256:abc123...",
  "fonte_oficial": "gov.br/trabalho",
  "data_verificacao": "2025-11-17",
  "mudancas_criticas": [
    "Item 12.5.2: Nova exigência de proteção em prensas"
  ],
  "impacto_oficina": "Adicionar proteções em elevadores hidráulicos"
}

# ✅ Tarefa 12.3: Sistema de Alerta de Expiração
Objetivo: Notificar quando documentos legais precisam revisão

Código: scripts/monitor_legislacao.py
import json
from datetime import datetime, timedelta

# Carregar metadados
with open("legislacao_metadata.json") as f:
    docs = json.load(f)

# Verificar expiração
PRAZO_REVISAO = 90  # dias
hoje = datetime.now()

for doc in docs:
    ultima_verificacao = datetime.fromisoformat(doc["data_verificacao"])
    dias_desde_verificacao = (hoje - ultima_verificacao).days
    
    if dias_desde_verificacao > PRAZO_REVISAO:
        print(f"⚠️ {doc['source']} precisa auditoria!")
        print(f"   Última verificação: {dias_desde_verificacao} dias atrás")
        print(f"   Ação: Verificar em {doc['fonte_oficial']}")
        
        # Enviar alerta (email/Slack)
        enviar_alerta(doc)

# Agendar verificação trimestral
# Cron: 0 0 1 */3 * python scripts/monitor_legislacao.py

# ✅ Tarefa 12.2: Auditoria de Respostas
Salvar logs estruturados:
{
  "timestamp": "2025-11-17T10:30:00Z",
  "user_id": "user_123",
  "query": "Qual NR rege inspeção veicular?",
  "response": "NR-10 e CONTRAN Resolução 761/2019",
  "documents_used": [
    {"source": "NR-10_v2023-06.md", "relevance": 0.92},
    {"source": "CONTRAN_v2024.md", "relevance": 0.88}
  ],
  "response_validated": true,
  "validator": "LLM-as-a-Judge"
}

# ✅ Tarefa 12.3: Compliance LGPD - Memórias
Implementar:
  - Endpoint DELETE /memories/:userId (já existe)
  - Exportação de dados: GET /memories/:userId/export
  - Anonimização: Remover CPF/telefone dos logs
  - Consent tracking: Usuário aceita armazenar histórico
```

**Entregável:** Sistema auditável, compliant com LGPD

---

## 💰 Orçamento Estimado

### Custos Mensais Projetados

| Item | Opção Free | Opção Premium | Recomendado |
|------|-----------|---------------|-------------|
| **LLM Inference** | | | |
| Hugging Face Free | $0 | - | 🟡 Fase 1-2 |
| Hugging Face Pro | - | $9/mês | ✅ Fase 3+ |
| Ollama Local (GPU) | $0 (requer hardware) | - | 🔵 Alternativa |
| **Reranking** | | | |
| RRF (LanceDB) | $0 | - | ✅ Fase 2 |
| Cohere Rerank | - | ~$10/mês | 🟡 Se precisão crítica |
| **Vector DB** | | | |
| LanceDB Free | $0 | - | ✅ Atual |
| LanceDB Pro | - | $20/mês | 🔵 Fase 4 (escala) |
| **Multimodal** | | | |
| GPT-4 Vision (setup) | - | $0.65 (uma vez) | ✅ Fase 4 |
| LLaVA Local | $0 | - | 🔵 Alternativa |
| **Hosting** | | | |
| Render Free | $0 | - | 🟡 Atual |
| Render Starter | - | $7/mês | ✅ Fase 2+ |
| **Cache/Redis** | | | |
| node-cache (local) | $0 | - | ✅ Fase 1 |
| Redis Cloud | - | $5/mês | 🔵 Fase 3 (opcional) |
| **TOTAL MENSAL** | **$0** | **$51/mês** | **~$25/mês** |

### Custos Únicos (One-Time)

| Item | Custo | Quando |
|------|-------|--------|
| GPT-4 Vision (65 imagens) | $0.65 | Semana 11 |
| Consultoria Agno (opcional) | $0-500 | - |
| **TOTAL SETUP** | **<$1** | - |

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Rate limit persistente | 🟠 Média | 🔴 Alto | Cache + HF Pro ($9/mês) |
| Reranking não melhorar precisão | 🟡 Baixa | 🟠 Médio | Testar 3 estratégias (RRF, Linear, Cohere) |
| Custo >$50/mês | 🟢 Baixa | 🟡 Baixo | Monitorar uso, cache agressivo |
| Latência não reduzir | 🟡 Baixa | 🟠 Médio | Paralelizar busca híbrida, GPU local |
| Dados tabulares não extraírem | 🟠 Média | 🟠 Médio | Camelot + validação manual |

---

## 📈 Métricas de Acompanhamento

### Dashboard Semanal (Google Sheets ou Grafana)

```yaml
Performance:
  - Latência P50, P95, P99
  - Cache Hit Rate
  - Uptime (%)
  
Qualidade RAG:
  - Hit Rate @ Top-3
  - Precision, Recall, F1
  - % respostas com citação de fonte
  
Custos:
  - $ gasto em APIs
  - Requests por dia
  - $/query médio
  
Uso:
  - Usuários ativos
  - Queries por dia
  - Categorias de query mais comuns
```

---

## 🎓 Treinamento e Documentação

### Semana 13: Handoff e Manutenção
```bash
# Documentação a criar:
1. RUNBOOK.md - Troubleshooting comum
2. API_DOCS.md - Endpoints e schemas
3. RAG_TUNING.md - Como ajustar pesos híbridos
4. MEMORY_MANAGEMENT.md - LGPD compliance

# Treinamento:
- 2h: Arquitetura RAG avançado
- 1h: Debugging com logs estruturados
- 1h: Adicionar novos documentos
- 30min: Monitoramento e alertas
```

---

## ✅ Checklist de Go-Live

### Pré-Produção
- [ ] Cache implementado (Hit Rate >50%)
- [ ] Busca híbrida funcionando
- [ ] Reranking ativo (RRF ou melhor)
- [ ] Dados tabulares indexados
- [ ] Testes E2E passando (>95%)
- [ ] Métricas de observabilidade
- [ ] Documentação completa
- [ ] Backup de base de conhecimento

### Produção
- [ ] Migrado para Render Starter ($7/mês)
- [ ] HF Pro ativo ($9/mês)
- [ ] Circuit breaker testado
- [ ] Alertas configurados (PagerDuty/email)
- [ ] Logs LGPD-compliant
- [ ] Rollback plan documentado

---

## ✅ Decisões Validadas pelo Cliente

### Respostas Estratégicas Confirmadas:

#### 1. **Recursos e Tempo**
- ✅ **Prazo:** 3 meses (90 dias) - 12 semanas
- ✅ **Equipe:** 1 Engenheiro de IA dedicado + SMEs (especialistas de domínio)
- ✅ **Orçamento:** Investir em **qualidade** (Reranking + Infraestrutura), não apenas redução de custos

#### 2. **Contexto de Uso Real**
- ✅ **Cache Hit Rate:** 52.8% (queries repetitivas)
- ✅ **Rate Limit:** 36% bloqueados (indica alto uso)
- ✅ **Latência atual:** 3-5s **afeta UX** em queries complexas (diagnósticos)
- ✅ **Cold Start:** 50s ocorre após inatividade (Render Free Tier)

#### 3. **Dados e Qualidade**
- ✅ **Atualização:** Documentos mudam **mensalmente/trimestralmente**
- ✅ **Falhas conhecidas:** 
  - Dados tabulares (torques, especificações)
  - Diagnósticos complexos (códigos P0300)
  - Diagramas visuais não processados
- ✅ **Tabelas críticas:** Torques, calibrações, folgas (precisão 100% necessária)

#### 4. **Prioridades Validadas (Ordem de Importância)**

| Prioridade | Objetivo | Justificativa | Fase |
|------------|----------|---------------|------|
| **🔴 P1 - CRÍTICA** | **Aumentar Precisão RAG** | Segurança e credibilidade (torque errado = catastrófico) | Fase 2 |
| **🔴 P1 - CRÍTICA** | **Compliance Legal** | NR-12 desatualizada = multa/interdição | Fase 4 |
| **🟠 P2 - ALTA** | **Reduzir Latência** | UX (3-5s → <2s) para queries complexas | Fase 2-3 |
| **🟡 P3 - MÉDIA** | **Reduzir Custos** | Cache 52.8% já ajuda, Ollama local em andamento | Fase 1 |
| **🟢 P4 - BAIXA** | **Multimodal** | Diagramas melhoram precisão mas não são bloqueantes | Fase 4 |

### 🎯 Decisão Final: Reordenar Fases por Prioridade

**NOVA ORDEM:**
1. **Fase 1:** Quick Wins (Cache, Custos) - Mantém estabilidade ✅
2. **Fase 2:** **PRECISÃO RAG CRÍTICA** (Tabelas + Reranking) - **PRIORIDADE MÁXIMA** 🔴
3. **Fase 3:** Raciocínio Avançado (ReAct, Multi-Agente)
4. **Fase 4:** Compliance + Multimodal (Governança LGPD + Diagramas)

### Próximos Passos Imediatos:
1. ✅ Criar branch `feature/precisao-rag-critica`
2. ✅ Começar **Fase 2 em paralelo com Fase 1** (foco em tabelas críticas)
3. ✅ Setup de métricas de precisão (Ground Truth para torques/especificações)
4. ✅ Auditar 57 chunks de Legislação (NR-12, NR-10, CONTRAN)

---

## 📞 Contatos e Suporte

**Desenvolvedor:** Pedro Victor  
**Email:** [A definir]  
**Repositório:** https://github.com/PedroVictor26/matias_agnoV1  

**Referências Técnicas:**
- [LanceDB Hybrid Search](https://lancedb.github.io/lancedb/hybrid_search/)
- [Agno Multi-Agent](https://docs.agno.dev/multi-agent)
- [HuggingFace RAG](https://huggingface.co/docs/transformers/model_doc/rag)

---

**Status:** 🟡 Aguardando validação do cliente  
**Última Atualização:** 17/11/2025  
**Versão:** 1.0
