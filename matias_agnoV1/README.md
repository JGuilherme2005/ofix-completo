# 🚗 Matias AI - Assistente Automotivo Inteligente

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![Agno](https://img.shields.io/badge/Agno-2.0.11-green.svg)](https://agno.dev)
[![Hugging Face](https://img.shields.io/badge/HF-Qwen2.5--7B-orange.svg)](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
[![Deploy](https://img.shields.io/badge/Deploy-Render-purple.svg)](https://matias-agno-assistant.onrender.com)

**Assistente AI especializado em oficina automotiva com sistema de memória persistente e base de conhecimento RAG de 624 documentos técnicos.**

---

## 📋 Visão Geral

**Matias** é um agente conversacional avançado desenvolvido com **AgentOS (Agno Framework)** que combina:

- 🤖 **LLM Open-Source**: Qwen/Qwen2.5-7B-Instruct (Hugging Face)
- 🧠 **Memória Persistente**: SQLite com histórico de conversas por usuário
- 📚 **RAG (Retrieval-Augmented Generation)**: 624 chunks de conhecimento técnico
- 🔍 **Busca Vetorial**: LanceDB Remote com embeddings FastEmbed
- 🚀 **Deploy em Produção**: Render.com com auto-scaling

---

## 🎯 Funcionalidades Principais

### 1. **Sistema de Memória Contextual**
```python
# O Matias lembra de conversas anteriores
Usuário: "Meu carro é um Gol 2015 1.6 preto, placa ABC-1234"
Matias: "✅ Entendido! Vou lembrar dessas informações."

# Próxima conversa (mesmo usuário)
Usuário: "Qual modelo é meu carro?"
Matias: "Seu Volkswagen Gol 2015 1.6, cor preta, placa ABC-1234"
```

**Tecnologia:**
- `SqliteDb` com `enable_user_memories=True`
- Rastreamento por `user_id` e `session_id`
- Histórico das últimas 5 conversas (`num_history_runs=5`)

### 2. **Base de Conhecimento RAG**

**624 documentos processados** divididos em 5 categorias:

| Categoria | Documentos | Exemplos |
|-----------|------------|----------|
| 🔧 **Técnico** | 217 chunks | Manuais de serviço, códigos de falha, procedimentos |
| 💼 **Gestão** | 197 chunks | Orçamentos, agendamentos, financeiro |
| 🔩 **Peças** | 111 chunks | Catálogos, fornecedores, estoque |
| 🛠️ **Serviços** | 42 chunks | Revisões, manutenção preventiva |
| 📜 **Legislação** | 57 chunks | Normas CONTRAN, inspeção veicular |

**Pipeline RAG:**
1. Query do usuário → Embedding (FastEmbed BAAI/bge-small-en-v1.5)
2. Busca vetorial → LanceDB Remote (`db://ofx-rbf7i6`)
3. Top-3 documentos similares → Contexto para LLM
4. Resposta fundamentada com citações de fonte

**Exemplo:**
```
Usuário: "Quanto custa troca de pastilha de freio?"
Matias busca em: precos_servicos.md
Resposta: "💰 Pastilhas de freio dianteiras: R$ 180-250 (mão de obra inclusa)"
```

### 3. **Integração com Backend OFIX**

**Arquitetura Multi-Agente:**

```mermaid
Frontend (Vercel) → Backend OFIX (Node.js) → Matias Agno (Python)
                         ↓                          ↓
                    PostgreSQL DB            LanceDB Remote + SQLite
```

**Endpoints:**
- `POST /agents/matias/runs` - Criar conversa
- `GET /memories?user_id=X` - Buscar memórias
- `DELETE /memories?user_id=X` - Limpar histórico (LGPD)
- `GET /health` - Status do sistema

**Circuit Breaker:** Proteção contra rate limits (429) com fallback local.

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

```yaml
Framework: AgentOS (Agno 2.0.11)
LLM: Qwen/Qwen2.5-7B-Instruct (Hugging Face Inference API)
Embeddings: FastEmbed (BAAI/bge-small-en-v1.5-onnx-Q, 384D)
Vector DB: LanceDB Remote (v0.25.3)
Memory: SQLite (tmp/matias_memory.db)
API: FastAPI + Uvicorn
Deploy: Render.com (PORT=10000)
Python: 3.12+
```

### Estrutura do Projeto

```
matias_agnoV1/
├── matias_agno/                    # Código principal
│   ├── agent_with_memory.py       # 🟢 Agente em produção (memória ativa)
│   ├── agent.py                   # 🔴 Versão sem memória (deprecated)
│   ├── config.py                  # Configurações centralizadas
│   ├── requirements.txt           # Dependências Python
│   ├── Dockerfile                 # Container Docker
│   ├── render.yaml                # Deploy Render
│   │
│   ├── conhecimento_oficina/      # 📚 Base RAG - Categoria 1 (Técnico)
│   │   ├── ar_condicionado.md
│   │   ├── sistema_motor.md
│   │   ├── precos_servicos.md
│   │   └── ... (12 arquivos)
│   │
│   ├── documentos_md/             # 📚 Base RAG - Categorias 2-5
│   │   ├── 1_tecnico/             # Manuais técnicos (217 chunks)
│   │   ├── 2_gestao/              # Gestão e processos (197 chunks)
│   │   ├── 3_pecas/               # Catálogo de peças (111 chunks)
│   │   ├── 4_servicos/            # Procedimentos (42 chunks)
│   │   └── 5_legislacao/          # Normas e leis (57 chunks)
│   │
│   └── __pycache__/
│
├── tests/                         # 🧪 Testes automatizados
│   ├── test_final_completo.py     # Suite com 6 testes
│   ├── test_memoria_render_v2.py
│   └── test_knowledge_detailed.py
│
├── docs/                          # 📖 Documentação
│   ├── QUICK_START.md             # Guia de início rápido
│   ├── GUIA_AGENTOS_AVANCADO.md   # Recursos avançados
│   └── REVIEW_AGNO_ROUTES.md      # Análise do backend
│
├── .env.example                   # Template de variáveis
├── .gitignore
└── README.md                      # 👈 Este arquivo
```

### Fluxo de Execução

```python
# 1. Usuário envia mensagem
POST /agents/matias/runs
{
  "message": "Qual o torque da roda do Gol?",
  "user_id": "user_123",
  "session_id": "session_456"
}

# 2. Matias classifica a intenção
MessageClassifier → "CONSULTA_TECNICA" → Usar tool buscar_conhecimento()

# 3. RAG Pipeline
query = "torque roda Gol"
embedding = FastEmbedEmbedder.get_embedding(query)  # 384 dimensões
results = lancedb.search(embedding).limit(3)        # Top-3 similares

# 4. LLM gera resposta com contexto
HuggingFace(Qwen2.5-7B).generate(
  system_prompt=INSTRUCTIONS,
  user_message=query,
  context=results  # Documentos recuperados do RAG
)

# 5. Salvar memória
SqliteDb.save_memory(
  user_id="user_123",
  content="Usuário perguntou sobre torque de rodas do Gol"
)

# 6. Retornar resposta
{
  "response": "🔧 Torque de aperto: 120 Nm (fonte: tabela_torques.txt)",
  "session_id": "session_456",
  "memory_updated": true
}
```

---

## 🚀 Instalação e Uso

### Pré-requisitos

```bash
# Python 3.12+
python --version

# Git
git --version
```

### 1. Clonar Repositório

```bash
git clone https://github.com/PedroVictor26/matias_agnoV1.git
cd matias_agnoV1
```

### 2. Criar Ambiente Virtual

```bash
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalar Dependências

```bash
cd matias_agno
pip install -r requirements.txt
```

### 4. Configurar Variáveis de Ambiente

Crie `.env` na raiz de `matias_agno/`:

```bash
# LLM (Hugging Face)
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vector Database (LanceDB Remote)
LANCEDB_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_URI=db://ofx-rbf7i6

# Servidor (Render usa PORT=10000)
PORT=8001

# Debug (opcional)
DEBUG=false
```

### 5. Testar Localmente

```bash
# Executar agente
python agent_with_memory.py

# Em outro terminal, testar endpoint
curl http://localhost:8001/health
```

### 6. Executar Testes

```bash
# Voltar para raiz do projeto
cd ..

# Teste completo (6 cenários)
python test_final_completo.py

# Resultado esperado:
# ✅ 1/6 Health Check: PASS
# ✅ 2/6 Agent Config: PASS (Memory active)
# ✅ 3/6 Create Memory: PASS
# ✅ 4/6 Verify Memory: PASS
# ✅ 5/6 Knowledge Base: PASS (805 tokens)
# ✅ 6/6 Context Maintenance: PASS
```

---

## 🌐 Deploy em Produção

### Render.com (Configuração Atual)

**Variáveis de Ambiente no Render:**

```bash
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_URI=db://ofx-rbf7i6
PORT=10000  # Render exige porta 10000
PYTHON_VERSION=3.12.0
```

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
python agent_with_memory.py
```

**URL de Produção:**
```
https://matias-agno-assistant.onrender.com
```

### Docker (Alternativa)

```bash
# Build
docker build -t matias-agno .

# Run
docker run -p 8001:8001 --env-file .env matias-agno
```

---

## 📊 Métricas de Performance

### Testes de Produção (17/11/2025)

| Métrica | Valor | Status |
|---------|-------|--------|
| Taxa de Sucesso | 100% (6/6 testes) | ✅ |
| Recall de Memória | 100% | ✅ |
| Latência Média (RAG) | 3-5s | ⚠️ LanceDB Remote |
| Tokens por Resposta | 700-900 | ✅ |
| Uptime (Render) | 99.2% | ✅ |
| Cold Start | ~50s (primeira req) | ⚠️ Free Tier |

### Base de Conhecimento

```
Total: 624 chunks processados
├── 1_tecnico/      217 chunks (34.8%)
├── 2_gestao/       197 chunks (31.6%)
├── 3_pecas/        111 chunks (17.8%)
├── 4_servicos/      42 chunks (6.7%)
└── 5_legislacao/    57 chunks (9.1%)

Fontes: 65 arquivos originais (PDF, DOCX, TXT)
Conversão: MarkItDown (Microsoft) → 100% sucesso
Embeddings: BAAI/bge-small-en-v1.5 (384 dimensões)
Storage: LanceDB Remote (us-east-1)
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Memória Contextual

```python
# Conversa 1
User: "Meu carro está fazendo um barulho no freio"
Matias: "Que tipo de barulho você está ouvindo? Chiado, rangido ou batida?"

User: "Um chiado quando freio"
Matias: "Chiado no freio geralmente indica pastilhas gastas ou disco 
        empenado. Qual o modelo do seu carro?"

User: "É um Gol 2015"
Matias: "✅ Vou lembrar: Gol 2015 com chiado no freio."

# Conversa 2 (próximo dia, mesmo usuário)
User: "Quanto custa consertar o problema que te falei?"
Matias: "Você mencionou chiado no freio do seu Gol 2015. 
        💰 Troca de pastilhas: R$ 180-250 (dianteiras)
        🔧 Retífica de disco: R$ 120-180 (por disco)"
```

### Exemplo 2: Busca RAG com Citação

```python
User: "Qual o torque de aperto das rodas do Civic?"
Matias: [buscar_conhecimento("torque rodas Civic")]

# RAG encontra em tabela_torques.txt:
# "Honda Civic 2020-2024: 108 Nm (11 kgfm)"

Matias: "🔧 **Torque de Aperto - Honda Civic**
        
        📊 Especificação: 108 Nm (11 kgfm)
        ⚠️ Use torquímetro calibrado
        🔄 Aperto em cruz (padrão estrela)
        
        📁 Fonte: tabela_torques.txt"
```

### Exemplo 3: Integração com Backend

```javascript
// Frontend envia para Backend OFIX
fetch('/api/agno/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: "Agendar revisão",
    user_id: "user_27ff6aaf",
    session_id: "session_1763032167330"
  })
});

// Backend classifica e roteia
if (MessageClassifier.classify(message) === 'AGENDAMENTO') {
  // Processa localmente (rápido)
  return AgendamentoLocal.processar(message);
} else {
  // Envia para Matias Agno (inteligente)
  return fetch('https://matias-agno-assistant.onrender.com/agents/matias/runs', {
    method: 'POST',
    body: formData
  });
}
```

---

## 🛠️ Roadmap

### ✅ Concluído (Novembro 2025)
- [x] Sistema de memória persistente (SQLite)
- [x] Base de conhecimento RAG (624 docs)
- [x] Deploy em produção (Render)
- [x] Integração com backend OFIX
- [x] Testes automatizados (6/6 passing)
- [x] Circuit breaker para rate limits

### 🚧 Em Desenvolvimento
- [ ] Cache de respostas (reduzir custos API)
- [ ] Modelo local fallback (Ollama)
- [ ] Métricas Prometheus/Grafana
- [ ] Refatoração backend (remover código duplicado)

### 📋 Planejado (Dezembro 2025)
- [ ] UI de gerenciamento de memórias
- [ ] Export de conversas (CSV/JSON)
- [ ] Multi-língua (EN, ES)
- [ ] Integração WhatsApp Business

---

## 🤝 Contribuindo

### Reportar Bugs

Abra uma issue em: https://github.com/PedroVictor26/matias_agnoV1/issues

**Template:**
```markdown
**Descrição:** [Descreva o bug]
**Reprodução:** [Passos para reproduzir]
**Esperado:** [Comportamento esperado]
**Logs:** [Cole logs relevantes]
**Ambiente:** [OS, Python version, etc]
```

### Pull Requests

1. Fork o repositório
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona X'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra PR com descrição detalhada

---

## 📄 Licença

**Propriedade Privada** - © 2025 OFIX  
Uso comercial restrito. Entre em contato para licenciamento.

---

## 👥 Autores

**Desenvolvedor Principal:** Pedro Victor  
**GitHub:** [@PedroVictor26](https://github.com/PedroVictor26)  
**Email:** [contato em desenvolvimento]

**Agradecimentos:**
- [Agno Framework](https://agno.dev) - Framework de agentes
- [Hugging Face](https://huggingface.co) - Modelos LLM
- [LanceDB](https://lancedb.com) - Vector database
- [MarkItDown](https://github.com/microsoft/markitdown) - Conversão de documentos

---

## 🔗 Links Úteis

- 📚 [Documentação Agno](https://docs.agno.dev)
- 🤖 [Qwen2.5-7B Model Card](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
- 🔍 [LanceDB Docs](https://lancedb.github.io/lancedb/)
- 🚀 [Deploy em Render](https://render.com/docs)
- 📖 [QUICK_START.md](./QUICK_START.md) - Guia de início rápido
- 🔧 [GUIA_AGENTOS_AVANCADO.md](./GUIA_AGENTOS_AVANCADO.md) - Recursos avançados

---

## 📞 Suporte

**Issues GitHub:** https://github.com/PedroVictor26/matias_agnoV1/issues  
**Status do Sistema:** https://matias-agno-assistant.onrender.com/health  
**Documentação:** [Wiki do Projeto](https://github.com/PedroVictor26/matias_agnoV1/wiki)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/PedroVictor26/matias_agnoV1?style=social)](https://github.com/PedroVictor26/matias_agnoV1)

Feito com ❤️ e ☕ por [Pedro Victor](https://github.com/PedroVictor26)

</div>
