# 🚀 Guia Completo: Maximizando o AgentOS para o Matias

## 📋 Índice
1. [Memory System (Memória de Conversas)](#1-memory-system)
2. [Knowledge Base Avançada](#2-knowledge-base-avançada)
3. [Multi-Agent Teams](#3-multi-agent-teams)
4. [Monitoring & Analytics](#4-monitoring--analytics)
5. [Interfaces Customizadas](#5-interfaces-customizadas)
6. [Production Best Practices](#6-production-best-practices)

---

## 1. Memory System (Memória de Conversas)

### 🎯 Por que usar?
- Lembrar informações de clientes entre conversas
- Personalizar recomendações baseadas em histórico
- Manter contexto de diagnósticos anteriores

### 📝 Implementação Básica

```python
# agent_with_memory.py
from agno.agent import Agent
from agno.models.huggingface import HuggingFace
from agno.db.postgres import PostgresDb
from agno.os import AgentOS

# Configurar banco PostgreSQL com pgvector
db = PostgresDb(
    db_url="postgresql+psycopg://ai:ai@localhost:5532/ai"
)

matias = Agent(
    name="Matias",
    role="Assistente Técnico de Oficina Automotiva",
    instructions=INSTRUCTIONS,
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=HF_TOKEN),
    tools=[buscar_conhecimento],
    
    # 🔥 ATIVAR MEMÓRIA AUTOMÁTICA (Recomendado)
    db=db,
    enable_user_memories=True,  # Memória por usuário
    enable_session_summaries=True,  # Resumos de sessão
    add_history_to_context=True,  # Histórico no contexto
    num_history_runs=5,  # Últimas 5 conversas
)
```

### 🎨 Casos de Uso para Oficina

#### Exemplo 1: Lembrar do Cliente
```python
# Primeira conversa
response = matias.run(
    "Meu carro é um Gol 2015 1.6",
    user_id="cliente_123",
    session_id="sessao_001"
)

# Próxima conversa (dias depois)
response = matias.run(
    "Quanto custa troca de pastilhas?",
    user_id="cliente_123",  # Mesmo cliente
    session_id="sessao_002"  # Nova sessão
)
# Matias vai lembrar: "Para o seu Gol 2015 1.6..."
```

#### Exemplo 2: Histórico de Diagnósticos
```python
matias = Agent(
    ...
    enable_user_memories=True,
    instructions="""
    MEMÓRIA:
    - Sempre lembre do modelo e ano do veículo do cliente
    - Mantenha histórico de problemas reportados
    - Sugira manutenções preventivas baseadas no histórico
    - Se cliente já fez diagnóstico, referencie o problema anterior
    """
)
```

---

## 2. Knowledge Base Avançada

### 🎯 Melhorias para Base de Conhecimento

#### 2.1 Adicionar Metadados Ricos
```python
# load_documentos_advanced.py
def load_markdown_with_metadata(md_file):
    """Carrega com metadados detalhados"""
    chunks = chunk_text(text, max_chars=2000, overlap=200)
    
    for chunk in chunks:
        documents.append({
            "vector": embedder.get_embedding(chunk),
            "text": chunk,
            
            # METADADOS AVANÇADOS
            "source": file_path,
            "category": category,
            "vehicle_model": extract_vehicle_model(chunk),  # Ex: "Gol", "Fox"
            "service_type": extract_service(chunk),  # Ex: "freio", "motor"
            "difficulty": extract_difficulty(chunk),  # "fácil", "médio", "difícil"
            "estimated_time": extract_time(chunk),  # Em minutos
            "price_range": extract_price(chunk),  # R$ min-max
            "tools_required": extract_tools(chunk),  # Lista de ferramentas
        })
```

#### 2.2 Busca Híbrida (Vetorial + Filtros)
```python
@tool
def buscar_conhecimento_avancado(
    query: str,
    vehicle_model: Optional[str] = None,
    service_type: Optional[str] = None,
    max_price: Optional[float] = None
) -> str:
    """Busca com filtros específicos"""
    
    # Busca vetorial
    results = table.search(query_vector).limit(10)
    
    # Filtros adicionais
    if vehicle_model:
        results = [r for r in results if vehicle_model.lower() in r.get("vehicle_model", "").lower()]
    
    if service_type:
        results = [r for r in results if service_type in r.get("service_type", "")]
    
    if max_price:
        results = [r for r in results if parse_price(r.get("price_range", "")) <= max_price]
    
    return format_results(results[:3])
```

---

## 3. Multi-Agent Teams

### 🎯 Por que usar Teams?
- Dividir responsabilidades (diagnóstico, orçamento, agendamento)
- Expertise especializada por área
- Workflow complexo com aprovações

### 📝 Implementação: Team de Oficina

```python
# team_oficina.py
from agno.agent import Agent
from agno.team import Team
from agno.models.huggingface import HuggingFace

# AGENTE 1: Diagnóstico Técnico
diagnostico_agent = Agent(
    name="Tech",
    role="Especialista em Diagnóstico Automotivo",
    instructions="""
    Você é especialista em DIAGNÓSTICO:
    - Analise sintomas e identifique problemas
    - Solicite informações técnicas quando necessário
    - Forneça diagnóstico preciso com causa raiz
    """,
    tools=[buscar_conhecimento],
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=HF_TOKEN),
)

# AGENTE 2: Orçamentista
orcamento_agent = Agent(
    name="Budget",
    role="Especialista em Orçamentos e Preços",
    instructions="""
    Você é especialista em ORÇAMENTOS:
    - Calcule custos detalhados (peças + mão de obra)
    - Considere preços de mercado atualizados
    - Ofereça opções de pagamento
    - Compare preços de diferentes fornecedores
    """,
    tools=[buscar_conhecimento, consultar_precos_api],
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=HF_TOKEN),
)

# AGENTE 3: Atendimento e Agendamento
atendimento_agent = Agent(
    name="Service",
    role="Especialista em Atendimento ao Cliente",
    instructions="""
    Você é especialista em ATENDIMENTO:
    - Agende serviços na agenda da oficina
    - Confirme disponibilidade de peças
    - Envie notificações de status
    - Gerencie expectativas do cliente
    """,
    tools=[agendar_servico, verificar_estoque],
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=HF_TOKEN),
)

# CRIAR TEAM
oficina_team = Team(
    name="Equipe OFIX",
    agents=[diagnostico_agent, orcamento_agent, atendimento_agent],
    description="Team completo para atendimento automotivo",
)

# USAR TEAM NO AGENTOS
agent_os = AgentOS(
    teams=[oficina_team],
    description="OFIX - Sistema Multi-Agente para Oficina"
)
```

### 🎨 Workflow Exemplo
```python
# Cliente: "Meu carro está com barulho no freio"
# 
# 1. DIAGNOSTICO_AGENT analisa e diagnostica
# 2. Passa para ORCAMENTO_AGENT que calcula custos
# 3. ATENDIMENTO_AGENT agenda e confirma
```

---

## 4. Monitoring & Analytics

### 🎯 Métricas Importantes

#### 4.1 Ativar Telemetria
```python
matias = Agent(
    ...
    # Monitoring nativo do AgentOS
    monitoring=True,
    telemetry=True,
)

agent_os = AgentOS(
    agents=[matias],
    # Configurar monitoring key
    os_config={
        "monitoring": {
            "enabled": True,
            "provider": "agno",  # ou "datadog", "prometheus"
        }
    }
)
```

#### 4.2 Custom Metrics
```python
from agno.telemetry import track_event, track_metric

@tool
def buscar_conhecimento(query: str) -> str:
    start_time = time.time()
    
    results = table.search(query_vector).limit(3)
    
    # TRACK METRICS
    track_metric("knowledge_search_time", time.time() - start_time)
    track_metric("knowledge_results_found", len(results))
    track_event("knowledge_search", {
        "query": query,
        "results_count": len(results),
        "category": results[0].get("category") if results else None
    })
    
    return format_results(results)
```

#### 4.3 Acessar Métricas no AgentOS
```
https://os.agno.com/
→ Seu Workspace → Metrics
→ Visualizar:
  - Total de conversas
  - Tempo médio de resposta
  - Queries mais comuns
  - Taxa de sucesso de buscas
  - Custos de API (tokens)
```

---

## 5. Interfaces Customizadas

### 🎯 Interfaces Disponíveis

#### 5.1 AGUI (Interface Web Padrão)
```python
from agno.os.interfaces.agui import AGUI

agent_os = AgentOS(
    agents=[matias],
    interfaces=[
        AGUI(
            agent=matias,
            # Customizações
            title="🚗 OFIX Assistant",
            description="Assistente especializado em oficina automotiva",
            theme="dark",  # ou "light"
            logo_url="https://seu-site.com/logo.png",
        )
    ]
)
```

#### 5.2 A2A (Agent-to-Agent Communication)
```python
from agno.os.interfaces.a2a import A2A

agent_os = AgentOS(
    agents=[matias],
    enable_a2a=True,  # Expõe API para outros agentes
    interfaces=[A2A()]
)

# Outros sistemas podem chamar o Matias via API
# POST /a2a/agents/matias/chat
```

#### 5.3 Custom FastAPI Routes
```python
from fastapi import FastAPI
from agno.os import AgentOS

agent_os = AgentOS(agents=[matias])
app = agent_os.get_app()

# ADICIONAR ROTAS CUSTOMIZADAS
@app.post("/orcamento")
async def criar_orcamento(veiculo: str, servico: str):
    """Endpoint customizado para orçamento rápido"""
    response = matias.run(
        f"Quanto custa {servico} para {veiculo}?",
        stream=False
    )
    return {"orcamento": response.content}

@app.get("/servicos")
async def listar_servicos():
    """Lista serviços disponíveis"""
    return {
        "servicos": [
            "Troca de óleo",
            "Alinhamento e balanceamento",
            "Freios (pastilhas/discos)",
            "Suspensão",
            "Diagnóstico eletrônico"
        ]
    }
```

---

## 6. Production Best Practices

### ✅ Checklist de Deploy

#### 6.1 Performance
```python
# Otimizações de Memória
agent = Agent(
    ...
    # Limitar histórico
    num_history_runs=5,  # Não carregar histórico infinito
    
    # Tool call limits
    tool_call_limit=10,  # Prevenir loops infinitos
    
    # Streaming para UX melhor
    stream=True,
)
```

#### 6.2 Custos
```python
# Usar modelo mais barato para memória
from agno.memory import MemoryManager

memory_manager = MemoryManager(
    db=db,
    model=HuggingFace(id="Qwen/Qwen2.5-1.5B-Instruct")  # Modelo menor
)

matias = Agent(
    model=HuggingFace(id="Qwen/Qwen2.5-7B-Instruct"),  # Modelo principal
    memory_manager=memory_manager,
    enable_agentic_memory=True
)
```

#### 6.3 Segurança
```python
# Adicionar autenticação
from agno.os import AgentOS

agent_os = AgentOS(
    agents=[matias],
    os_config={
        "security": {
            "enabled": True,
            "api_key_required": True,
            "rate_limiting": {
                "enabled": True,
                "max_requests_per_minute": 60
            }
        }
    }
)

# Variável de ambiente
# OS_SECURITY_KEY=your-secret-key-here
```

#### 6.4 Monitoring em Produção
```python
# Configurar alertas
agent_os = AgentOS(
    agents=[matias],
    os_config={
        "monitoring": {
            "alerts": {
                "error_rate_threshold": 0.05,  # 5% de erro
                "response_time_threshold": 5000,  # 5 segundos
                "email_notifications": "admin@oficina.com"
            }
        }
    }
)
```

---

## 🎯 Próximos Passos Recomendados

### Curto Prazo (Esta Semana)
1. ✅ ~~Implementar memory system básico~~
2. ⏳ Adicionar PostgreSQL com pgvector
3. ⏳ Configurar session tracking
4. ⏳ Testar com clientes reais

### Médio Prazo (Este Mês)
1. ⏳ Criar team multi-agente (diagnóstico + orçamento + agendamento)
2. ⏳ Implementar métricas e analytics
3. ⏳ Customizar interface AGUI
4. ⏳ Adicionar API de integração com sistema da oficina

### Longo Prazo (3 Meses)
1. ⏳ Integração com WhatsApp/Telegram
2. ⏳ Sistema de avaliação e feedback
3. ⏳ Dashboard de métricas customizado
4. ⏳ Multi-tenancy (várias oficinas)

---

## 📚 Recursos Adicionais

### Documentação Oficial
- AgentOS: https://docs.agno.com/agent-os
- Memory: https://docs.agno.com/concepts/memory
- Teams: https://docs.agno.com/concepts/teams
- Monitoring: https://docs.agno.com/agent-os/monitoring

### Exemplos Práticos
```bash
# Ver exemplos oficiais
cd matias_agno
mkdir examples
cd examples

# Copiar exemplos do agno
git clone https://github.com/agno-agi/agno-examples
```

### Comunidade
- Discord: https://discord.gg/agno
- GitHub Issues: https://github.com/agno-agi/agno/issues
- Stack Overflow: tag [agno]

---

## 💡 Dica Final

**Comece simples e evolua gradualmente:**
1. Primeiro: Memory básica (enable_user_memories=True)
2. Depois: Adicione teams se necessário
3. Por último: Customize interfaces e monitoring

O AgentOS cresce com seu projeto! 🚀
