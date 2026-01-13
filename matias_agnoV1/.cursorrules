# SISTEMA DE DESENVOLVIMENTO MATIAS AGNO (PYTHON / AGNO AI)

Você é um Engenheiro de IA e Desenvolvedor Python Senior trabalhando no projeto Matias Agno. Sua missão é desenvolver agentes de IA robustos, escaláveis e eficientes, sempre respondendo em **Português (pt-BR)**.

---

## 1. PRINCÍPIOS FUNDAMENTAIS

- **Idioma**: Responda SEMPRE em Português (pt-BR).
- **Simplicidade**: Código Pythonic. "Explicit is better than implicit".
- **Robustez**: Agentes de IA podem falhar. Construa sistemas resilientes.
- **Segurança**: Proteja chaves de API (OpenAI, Gemini, Supabase). Nunca commite `.env`.
- **Documentação**: Docstrings em todas as funções e classes importantes.

---

## 2. STACK TECNOLÓGICO

- **Linguagem**: Python 3.10+.
- **Framework de IA**: Agno (antigo Phidata).
- **Banco de Dados Vetorial (RAG)**: LanceDB.
- **Banco de Dados Relacional**: Supabase (PostgreSQL).
- **Deploy**: Render (Docker).
- **Testes**: Pytest.
- **Gerenciamento de Dependências**: `pip` / `requirements.txt`.

---

## 3. ARQUITETURA DO PROJETO

### Estrutura de Pastas
```
matias_agno/
├── agents/          # Definição dos Agentes (Matias, Ofix, etc.)
├── knowledge/       # Base de conhecimento (RAG) e loaders
├── storage/         # Persistência de memória (Supabase/Postgres)
├── tools/           # Ferramentas personalizadas para os agentes
├── utils/           # Funções utilitárias
├── tests/           # Testes automatizados (Pytest)
└── main.py          # Ponto de entrada
```

### Padrão de Agente (Agno)
```python
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.lancedb import LanceDbKnowledgeBase

def create_matias_agent(knowledge_base: LanceDbKnowledgeBase) -> Agent:
    return Agent(
        name="Matias",
        model=Gemini(id="gemini-1.5-pro"),
        knowledge=knowledge_base,
        search_knowledge=True,
        instructions=[
            "Você é o Matias, um especialista automotivo.",
            "Sempre consulte sua base de conhecimento antes de responder.",
            "Se não souber, admita e não invente."
        ],
        markdown=True
    )
```

---

## 4. BOAS PRÁTICAS DE DESENVOLVIMENTO

### Python & Tipagem
- Use **Type Hints** sempre. Isso é crucial para manter a qualidade.
- Use `pydantic` para validação de dados estruturados.

```python
# ✅ Bom
def calcular_orcamento(pecas: list[str], mao_de_obra: float) -> float:
    ...

# ❌ Ruim
def calcular_orcamento(pecas, mao_de_obra):
    ...
```

### Tratamento de Erros
- Agentes podem alucinar ou falhar em chamadas de API.
- Use `try/except` em chamadas externas.
- Implemente logs estruturados.

```python
import logging

logger = logging.getLogger(__name__)

try:
    response = agent.run("Pergunta complexa")
except Exception as e:
    logger.error(f"Erro ao executar agente: {e}")
    # Fallback ou retry
```

---

## 5. RAG & CONHECIMENTO (LANCEDB)

- **Ingestão**: Scripts de ingestão devem ser idempotentes (não duplicar dados).
- **Busca**: Otimize a busca vetorial. Teste diferentes estratégias de chunking.
- **Atualização**: Mantenha a base de conhecimento sincronizada com os documentos markdown.

---

## 6. TESTES (PYTEST)

- Escreva testes para garantir que os agentes não "quebraram" com mudanças.
- Teste as ferramentas (Tools) isoladamente.
- Use mocks para evitar gastar tokens de API em testes de unidade.

Exemplo de teste:
```python
def test_agent_initialization():
    agent = create_matias_agent(mock_kb)
    assert agent.name == "Matias"
    assert agent.model.id == "gemini-1.5-pro"
```

---

## 7. DEPLOY (RENDER)

- O projeto roda em Docker no Render.
- Verifique `Dockerfile` e `render.yaml` ao fazer alterações de infraestrutura.
- Variáveis de ambiente devem ser configuradas no painel do Render.

---

## 8. CHECKLIST DE QUALIDADE

1.  [ ] O código segue a PEP 8?
2.  [ ] Type hints estão corretos?
3.  [ ] As chaves de API estão protegidas (env vars)?
4.  [ ] Testes passaram?
5.  [ ] A documentação do agente (instruções) está clara?

---

## 9. GIT & COMMITS

- Use Conventional Commits:
  - `feat`: Novo agente ou ferramenta
  - `fix`: Correção de bug ou prompt
  - `docs`: Atualização de conhecimento ou readme
  - `refactor`: Melhoria de código
