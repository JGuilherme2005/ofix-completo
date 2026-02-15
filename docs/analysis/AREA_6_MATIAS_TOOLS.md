# AREA 6 - Matias Tools & Permissions

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `matias_agnoV1/matias_agno/tools/` (inventario de tools), classificacao Leitura (Safe) vs Escrita (Dangerous), e se existe confirmacao humana para side-effects.

---

## Inventario de tools (codigo)

Arquivos em `matias_agnoV1/matias_agno/tools/`:
- `simulate.py` -> `simulate_vehicle_scenario(...)` (**@tool**)
- `search.py` -> `buscar_conhecimento(...)` (**@tool**)
- `__init__.py` vazio

Tools atualmente anexadas ao agente Matias (em producao):
- `matias_agnoV1/matias_agno/agents/matias.py` -> `tools=[simulate_vehicle_scenario]`
- `matias_agnoV1/matias_agno/agents/matias_ollama.py` -> `tools=[simulate_vehicle_scenario]`

Conclusao: **hoje o Matias tem acesso somente a 1 tool (simulate_vehicle_scenario)**. A tool `buscar_conhecimento` existe no repo, mas **nao esta plugada** no agente principal.

---

## Classificacao (Safe vs Dangerous)

### [PY-TOOLS-SIM-01] `simulate_vehicle_scenario` (Simulacao preditiva)
- **Severidade:** P3 (melhoria/robustez)
- **Arquivo/Local:** `matias_agnoV1/matias_agno/tools/simulate.py:13`
- **Tipo:** Leitura / Safe (sem efeitos colaterais externos)
- **O que faz:** executa funcoes puras em memoria (`matias_agnoV1/matias_agno/simulation/rules.py`) para retornar avaliacao de risco e recomendacoes.
- **Permissoes/risco:** nao faz IO (sem DB, sem HTTP, sem FS). Mesmo com “alucinacao funcional”, nao consegue alterar dados do OFIX.
- **Confirmacao humana:** **nao aplicavel** (nao ha escrita/side-effect).
- **Observacoes:** validacao basica existe (exige parametros por scenario). Sugestao futura: validar faixas (ex: `days >= 0`, `months_overdue >= 0`) para evitar outputs nonsense.

### [PY-TOOLS-SEARCH-01] `buscar_conhecimento` (Busca na base)
- **Severidade:** P2
- **Arquivo/Local:** `matias_agnoV1/matias_agno/tools/search.py:5`
- **Tipo:** Leitura / Safe (somente leitura da base)
- **O que faz:** pretende buscar conteudo na base (LanceDB) via embedding e search.
- **Permissoes/risco:** seria somente leitura, mas:
  - introduce dependencia de rede/credenciais (LanceDB cloud)
  - aumenta superficie de prompt-injection via conteudo retornado (RAG injection) se nao houver guardrails
- **Confirmacao humana:** **nao aplicavel** (sem escrita). Para publico, recomendavel limitar consultas e sanitizar logs.
- **Problema funcional (bug):** o arquivo importa `get_lancedb_connection` e `TABLE_NAME` de `matias_agno.knowledge.base`, mas esses simbolos **nao existem** no `base.py` atual. Se essa tool for habilitada, vai falhar em runtime.
- **Correcao proposta:** ou (a) remover a tool se o agente ja usa `Knowledge + search_knowledge`, ou (b) reescrever a tool para usar o stack atual (`get_knowledge_base()` / LanceDb configurado por env) com tratamento de erro consistente.

---

## Tools de escrita / “alucinacao funcional”

### [PY-TOOLS-WRITE-01] Nenhuma tool Dangerous (escrita) esta presente hoje
- **Severidade:** P3
- **Diagnostico:** nao existem tools custom que criem/editem OS, agendamento, cliente, etc. Entao o Matias (Python) **nao consegue mutar** o banco do OFIX via tools.
- **Risco residual:** baixo para “alucinacao funcional” via tools. O risco de escrita hoje esta concentrado no **backend Node** (fluxos locais de acao) e no **sistema de memoria** (ver abaixo).

### [PY-MEM-WRITE-01] Side-effect importante: Memoria/Summary sao “escrita automatica” controlada pela IA
- **Severidade:** P1
- **Arquivo/Local:** `matias_agnoV1/matias_agno/agents/matias.py:33` (flags de memoria) + `matias_agnoV1/matias_agno/storage/memory.py`
- **Diagnostico:** mesmo sem tools Dangerous, o agente esta configurado com memoria/summaries (persistencia em Postgres quando configurado). Isso e uma forma de **escrita automatica** no storage (controlada pelo comportamento do modelo).
- **Risco:** o modelo pode:
  - armazenar PII sem intencao (chat publico)
  - armazenar “fatos” incorretos (memoria falsa) e usá-los depois
- **Confirmacao humana:** nao existe no codigo atual.
- **Correcao proposta:** para o rollout:
  - agente publico: memoria OFF (ou TTL/limite curto)
  - agente autenticado: memoria ON com politica de retencao + endpoint/job de limpeza (LGPD)

---

## Recomendacoes de hardening (para quando criarmos tools de escrita)

### [PY-TOOLS-POLICY-01] Padrao de permissao/confirmacao para futuras tools Dangerous
- **Severidade:** P2
- **Diagnostico:** nao ha framework de confirmacao humana (HITL) definido. Se no futuro for criado tool de escrita (ex: “criar agendamento”, “alterar OS”), a IA executara sozinha por padrao.
- **Correcao proposta:** definir um padrao antes de adicionar tools Dangerous:
  - Tools de escrita exigem `role` + `oficina_id` + `confirmacao` (ex: “codigo enviado por WhatsApp” ou “confirmar no painel”)
  - Preferir executar escrita no Node (camada de autorizacao/tenant) e manter Python read-only
  - Se a escrita ficar no Python, implementar “tool approval” (o run pausa e o backend decide aprovar/rejeitar) e log/audit por oficina.

