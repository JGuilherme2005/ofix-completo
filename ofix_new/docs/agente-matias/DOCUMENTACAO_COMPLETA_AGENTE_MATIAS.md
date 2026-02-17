# ðŸ¤– DOCUMENTAÃ‡ÃƒO COMPLETA - AGENTE MATIAS

## ðŸ“‹ ÃNDICE

1. [VisÃ£o Geral](#visÃ£o-geral)
2. [Arquitetura TÃ©cnica](#arquitetura-tÃ©cnica)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Capacidades de Processamento](#capacidades-de-processamento)
5. [IntegraÃ§Ã£o com Agno AI](#integraÃ§Ã£o-com-agno-ai)
6. [Sistema de NLP](#sistema-de-nlp)
7. [Fluxos de ConversaÃ§Ã£o](#fluxos-de-conversaÃ§Ã£o)
8. [Endpoints da API](#endpoints-da-api)
9. [Bases de Conhecimento](#bases-de-conhecimento)
10. [MÃ©tricas e Monitoramento](#mÃ©tricas-e-monitoramento)
11. [Roadmap e Melhorias Futuras](#roadmap-e-melhorias-futuras)

---

## ðŸŽ¯ VISÃƒO GERAL

### O que Ã© o Agente Matias?

**Matias** Ã© um assistente virtual inteligente especializado em oficinas automotivas, desenvolvido para o sistema **OFIX**. Ele combina processamento de linguagem natural (NLP) local com inteligÃªncia artificial avanÃ§ada atravÃ©s da plataforma **Agno AI**, oferecendo uma experiÃªncia conversacional completa para gestÃ£o de oficinas.

### PropÃ³sito

- **Automatizar** atendimento e agendamentos
- **Facilitar** consultas de ordens de serviÃ§o, estoque e clientes
- **Fornecer** diagnÃ³sticos e recomendaÃ§Ãµes tÃ©cnicas automotivas
- **Otimizar** fluxo de trabalho da oficina atravÃ©s de linguagem natural
- **Aprender** com cada interaÃ§Ã£o para melhorar continuamente

### CaracterÃ­sticas Principais

- âœ… **DisponÃ­vel 24/7** - Sempre online para atender clientes e funcionÃ¡rios
- âœ… **BilÃ­ngue** - PortuguÃªs fluente com suporte tÃ©cnico especializado
- âœ… **Contextual** - MantÃ©m histÃ³rico de conversas para continuidade
- âœ… **Inteligente** - Aprende padrÃµes e se adapta ao negÃ³cio
- âœ… **Integrado** - Conectado a todos os sistemas da oficina (OS, estoque, clientes, agendamentos)
- âœ… **Resiliente** - Sistema de fallback para garantir disponibilidade contÃ­nua

---

## ðŸ—ï¸ ARQUITETURA TÃ‰CNICA

### Stack TecnolÃ³gico

#### Backend (Node.js + Express)
```javascript
Framework: Express 4.x
Linguagem: JavaScript (ES Modules)
ORM: Prisma 5.22.0
Banco de Dados: PostgreSQL (Railway/Supabase)
ServiÃ§os: Node-fetch para HTTP requests
```

#### Frontend (React + Vite)
```javascript
Framework: React 18.x
Bundler: Vite
UI: Custom components + ShadCN/UI
Estado: Context API + useState/useEffect
```

#### Agno AI (Agente Externo)
```python
Framework: agno 2.0.11
API: FastAPI
LLM: Groq (LLaMA 3.1 70B)
Vector DB: LanceDB
Embeddings: OpenAI text-embedding-3-small
Hosting: Render (matias-agno-assistant.onrender.com)
```

### Diagrama de Arquitetura

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     CLIENTE (Browser)                        â”‚
â”‚                     Frontend React/Vite                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                         â”‚
                         â”‚ HTTPS
                         â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  BACKEND (ofix-backend)                      â”‚
â”‚                  Node.js + Express                           â”‚
â”‚                                                              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚         AGNO ROUTER (agno.routes.js)                 â”‚  â”‚
â”‚  â”‚                                                       â”‚  â”‚
â”‚  â”‚  â€¢ DetecÃ§Ã£o de IntenÃ§Ã£o (NLP Local)                 â”‚  â”‚
â”‚  â”‚  â€¢ Roteamento Inteligente                           â”‚  â”‚
â”‚  â”‚  â€¢ Sistema de Fallback                              â”‚  â”‚
â”‚  â”‚  â€¢ Retry Logic (2 tentativas)                       â”‚  â”‚
â”‚  â”‚  â€¢ Timeout Management (45s/30s)                     â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                 â”‚                       â”‚                   â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚    â”‚   NLP Service         â”‚  â”‚  Conversas Service   â”‚    â”‚
â”‚    â”‚  â€¢ ExtraÃ§Ã£o Entidades â”‚  â”‚  â€¢ HistÃ³rico Chat    â”‚    â”‚
â”‚    â”‚  â€¢ ValidaÃ§Ã£o Dados    â”‚  â”‚  â€¢ Contexto UsuÃ¡rio  â”‚    â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚                                                              â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚    â”‚         SERVIÃ‡OS DE NEGÃ“CIO                        â”‚  â”‚
â”‚    â”‚  â€¢ AgendamentosService (criar/listar/atualizar)   â”‚  â”‚
â”‚    â”‚  â€¢ ConsultasOSService (status/busca/estatÃ­sticas) â”‚  â”‚
â”‚    â”‚  â€¢ ClientesService (CRUD clientes)                â”‚  â”‚
â”‚    â”‚  â€¢ EstoqueService (consultas peÃ§as)               â”‚  â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                         â”‚                                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â”‚   PostgreSQL    â”‚
                 â”‚   (Database)    â”‚
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚   AGNO AI AGENT (Externo)          â”‚
         â”‚   matias-agno-assistant.onrender   â”‚
         â”‚                                    â”‚
         â”‚  â€¢ LLaMA 3.1 70B (via Groq)       â”‚
         â”‚  â€¢ LanceDB (Vector Store)         â”‚
         â”‚  â€¢ Base de Conhecimento:          â”‚
         â”‚    - DiagnÃ³sticos Automotivos     â”‚
         â”‚    - Procedimentos TÃ©cnicos       â”‚
         â”‚    - ManutenÃ§Ãµes Preventivas      â”‚
         â”‚    - PeÃ§as e Compatibilidade      â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Fluxo de RequisiÃ§Ã£o

```
1. UsuÃ¡rio â†’ Mensagem de chat
2. Frontend â†’ POST /api/agno/chat
3. Backend â†’ Detecta intenÃ§Ã£o (NLP)
4. Backend â†’ Roteamento:
   â”œâ”€ Local Processing (AGENDAMENTO, CONSULTA_OS, etc)
   â””â”€ Agno AI (CONSULTA_PRECO, AJUDA, CONVERSA_GERAL)
5. Agno AI â†’ Processa com LLM + Knowledge Base
6. Backend â†’ Recebe resposta + salva histÃ³rico
7. Frontend â†’ Exibe resposta formatada
```

---

## âš™ï¸ FUNCIONALIDADES IMPLEMENTADAS

### 1. ðŸ“… AGENDAMENTO DE SERVIÃ‡OS

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Criar agendamentos atravÃ©s de linguagem natural
- Extrair automaticamente: cliente, veÃ­culo, data, hora, tipo de serviÃ§o
- Validar dados antes de criar agendamento
- Sugerir horÃ¡rios disponÃ­veis
- Confirmar agendamentos com resumo completo
- Detectar urgÃªncias e priorizar

**Exemplos de Uso:**
```
âœ… "Agendar revisÃ£o para o Gol do JoÃ£o na segunda Ã s 14h"
âœ… "Marcar troca de Ã³leo para terÃ§a 16h cliente Maria placa ABC-1234"
âœ… "Preciso fazer alinhamento no Civic para sexta de manhÃ£"
âœ… "Agendar manutenÃ§Ã£o do ar condicionado para quinta 10h"
```

**Entidades ExtraÃ­das:**
- **Cliente:** Nome completo (ex: JoÃ£o Silva)
- **VeÃ­culo:** Modelo + Placa (ex: Gol, ABC-1234)
- **Data:** Dia da semana ou data especÃ­fica (ex: segunda, 15/11/2025)
- **Hora:** Formato 24h (ex: 14:00, 16h)
- **ServiÃ§o:** Tipo de manutenÃ§Ã£o (revisÃ£o, troca de Ã³leo, alinhamento, etc)
- **UrgÃªncia:** Detecta palavras como "urgente", "hoje", "agora"

**ValidaÃ§Ãµes:**
- HorÃ¡rio comercial (7h Ã s 18h)
- Data futura (nÃ£o permite agendar no passado)
- Cliente existe no sistema ou cria novo
- VeÃ­culo vinculado ao cliente
- Slot disponÃ­vel na agenda

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ã£o `processarAgendamento()`
- `ofix-backend/src/services/nlp.service.js` - FunÃ§Ã£o `extrairEntidadesAgendamento()`
- `ofix-backend/src/services/agendamentos.service.js`

---

### 2. ðŸ” CONSULTA DE ORDENS DE SERVIÃ‡O

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Buscar OS por nÃºmero, placa ou cliente
- Filtrar por status (em andamento, concluÃ­do, aguardando)
- Mostrar detalhes completos (serviÃ§os, peÃ§as, valores)
- HistÃ³rico de serviÃ§os do veÃ­culo
- EstatÃ­sticas de atendimento

**Exemplos de Uso:**
```
âœ… "Status da OS #1234"
âœ… "Ordens de serviÃ§o do JoÃ£o"
âœ… "Meu carro estÃ¡ pronto? Placa ABC-1234"
âœ… "Mostrar serviÃ§os em andamento"
âœ… "HistÃ³rico do Gol placa XYZ-5678"
```

**Dados Retornados:**
- NÃºmero da OS
- Status atual (Aguardando, Em Andamento, ConcluÃ­do)
- Cliente e veÃ­culo
- ServiÃ§os realizados/pendentes
- PeÃ§as utilizadas
- Valor total
- Data de entrada/previsÃ£o de conclusÃ£o
- MecÃ¢nico responsÃ¡vel

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ã£o `processarConsultaOS()`
- `ofix-backend/src/services/consultasOS.service.js`

---

### 3. ðŸ“¦ CONSULTA DE ESTOQUE/PEÃ‡AS

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Verificar disponibilidade de peÃ§as
- Buscar peÃ§as por nome ou cÃ³digo
- Informar quantidade em estoque
- Sugerir peÃ§as alternativas
- Alertar sobre peÃ§as em falta

**Exemplos de Uso:**
```
âœ… "Tem filtro de Ã³leo disponÃ­vel?"
âœ… "Verificar estoque de pastilhas de freio"
âœ… "PeÃ§as para revisÃ£o do Corolla"
âœ… "Quanto tem de Ã³leo 5W30?"
âœ… "Preciso de bateria 60A"
```

**InformaÃ§Ãµes Fornecidas:**
- Nome da peÃ§a
- CÃ³digo/referÃªncia
- Quantidade disponÃ­vel
- PreÃ§o unitÃ¡rio
- LocalizaÃ§Ã£o no estoque
- AplicaÃ§Ã£o/compatibilidade

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ã£o `processarConsultaEstoque()`

---

### 4. ðŸ‘¥ GERENCIAMENTO DE CLIENTES

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Cadastrar novos clientes
- Buscar clientes por nome, CPF ou telefone
- Atualizar dados cadastrais
- Listar veÃ­culos do cliente
- HistÃ³rico de serviÃ§os

**Exemplos de Uso:**

**Cadastro:**
```
âœ… "Cadastrar cliente JoÃ£o Silva"
âœ… "Novo cliente: Nome: Maria Costa, Tel: (85) 99999-9999, CPF: 123.456.789-00"
âœ… "Adicionar cliente Pedro Santos, telefone 85988887777"
```

**Consulta:**
```
âœ… "Dados do cliente JoÃ£o"
âœ… "Telefone da Maria"
âœ… "Buscar cliente CPF 123.456.789-00"
âœ… "Clientes cadastrados hoje"
```

**Dados do Cliente:**
- Nome completo
- CPF/CNPJ
- Telefone(s)
- Email
- EndereÃ§o
- VeÃ­culos vinculados
- HistÃ³rico de serviÃ§os
- Valor total gasto

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ãµes `processarConsultaCliente()` e `processarCadastroCliente()`
- `ofix-backend/src/services/nlp.service.js` - FunÃ§Ã£o `extrairDadosCliente()`

---

### 5. ðŸ’° CONSULTA DE PREÃ‡OS E ORÃ‡AMENTOS

**Status:** âœ… Funcional (com Agno AI)

**Capacidades:**
- Fornecer preÃ§os estimados de serviÃ§os
- Calcular orÃ§amentos completos
- Explicar composiÃ§Ã£o de valores (mÃ£o de obra + peÃ§as)
- Comparar preÃ§os entre modelos
- Sugerir pacotes/combos

**Exemplos de Uso:**
```
âœ… "Quanto custa uma revisÃ£o?"
âœ… "PreÃ§o de troca de Ã³leo para o Gol"
âœ… "OrÃ§amento completo para alinhamento e balanceamento"
âœ… "Valor da manutenÃ§Ã£o de 10 mil km do Civic"
```

**Processamento:**
- **Primeira tentativa:** Agno AI (resposta detalhada com contexto)
- **Fallback:** Resposta local com valores genÃ©ricos
- **Timeout:** 45s primeira tentativa, 30s retry

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - IntegraÃ§Ã£o com Agno
- Agno AI processa com base de conhecimento de preÃ§os

---

### 6. ðŸ“Š ESTATÃSTICAS E RELATÃ“RIOS

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Resumo diÃ¡rio/semanal/mensal
- Quantidade de atendimentos
- Faturamento total
- ServiÃ§os mais realizados
- Clientes mais frequentes
- PeÃ§as mais usadas
- Taxa de conclusÃ£o de OS

**Exemplos de Uso:**
```
âœ… "Quantos carros atendemos hoje?"
âœ… "Resumo do mÃªs"
âœ… "Faturamento da semana"
âœ… "EstatÃ­sticas da oficina"
âœ… "ServiÃ§os mais realizados no mÃªs"
```

**MÃ©tricas DisponÃ­veis:**
- Total de OS (abertas/concluÃ­das/em andamento)
- Valor total faturado
- Ticket mÃ©dio por OS
- Tempo mÃ©dio de atendimento
- Taxa de retorno de clientes
- SatisfaÃ§Ã£o (quando disponÃ­vel)

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ã£o `processarEstatisticas()`

---

### 7. ðŸ†˜ AJUDA E ORIENTAÃ‡ÃƒO

**Status:** âœ… Totalmente Funcional

**Capacidades:**
- Listar comandos disponÃ­veis
- Explicar como usar cada funcionalidade
- Dar exemplos prÃ¡ticos
- Orientar sobre melhores prÃ¡ticas

**Exemplos de Uso:**
```
âœ… "Ajuda"
âœ… "O que vocÃª pode fazer?"
âœ… "Como funciona?"
âœ… "Comandos disponÃ­veis"
âœ… "Menu"
```

**Resposta PadrÃ£o:**
```markdown
ðŸ¤– **Assistente Matias - Como posso ajudar:**

**ðŸ“… AGENDAMENTOS**
â€¢ "Agendar revisÃ£o para o Gol do JoÃ£o na segunda Ã s 14h"
â€¢ "Marcar troca de Ã³leo para terÃ§a 16h"

**ðŸ” CONSULTAR SERVIÃ‡OS**
â€¢ "Status da OS do Gol placa ABC-1234"
â€¢ "Ordens de serviÃ§o do JoÃ£o"

**ðŸ“¦ CONSULTAR ESTOQUE**
â€¢ "Tem filtro de Ã³leo disponÃ­vel?"
â€¢ "Verificar estoque de pastilhas de freio"

**ðŸ“Š ESTATÃSTICAS**
â€¢ "Quantos carros atendemos hoje?"
â€¢ "Resumo do mÃªs"

**ðŸ‘¤ CLIENTES**
â€¢ "Dados do cliente JoÃ£o"
â€¢ "Cadastrar novo cliente"

ðŸ’¡ **Dica:** Quanto mais detalhes vocÃª fornecer, melhor consigo ajudar!
```

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/services/nlp.service.js` - FunÃ§Ã£o `gerarMensagemAjuda()`

---

### 8. ðŸ’¬ CONVERSA GERAL E DIAGNÃ“STICOS

**Status:** âœ… Funcional (via Agno AI)

**Capacidades:**
- Responder perguntas conversacionais
- Fornecer diagnÃ³sticos automotivos
- Explicar procedimentos tÃ©cnicos
- Recomendar manutenÃ§Ãµes preventivas
- Identificar problemas por sintomas

**Exemplos de Uso:**
```
âœ… "OlÃ¡, como vocÃª estÃ¡?"
âœ… "Meu carro estÃ¡ fazendo um barulho estranho"
âœ… "Quando devo trocar o Ã³leo?"
âœ… "O que Ã© alinhamento e balanceamento?"
âœ… "Luz do motor acendeu, o que pode ser?"
```

**Base de Conhecimento (Agno AI):**
- **DiagnÃ³sticos:** Sintomas â†’ PossÃ­veis causas â†’ SoluÃ§Ãµes
- **ManutenÃ§Ã£o Preventiva:** Intervalos e procedimentos
- **PeÃ§as Automotivas:** FunÃ§Ã£o, vida Ãºtil, compatibilidade
- **Procedimentos TÃ©cnicos:** Passo a passo detalhado
- **Troubleshooting:** Problemas comuns e resoluÃ§Ãµes

**CÃ³digo ResponsÃ¡vel:**
- `ofix-backend/src/routes/agno.routes.js` - FunÃ§Ã£o `processarConversaGeral()`
- Agno AI com LLaMA 3.1 70B e base de conhecimento especializada

---

## ðŸ§  CAPACIDADES DE PROCESSAMENTO

### Sistema de NLP (Processamento de Linguagem Natural)

#### DetecÃ§Ã£o de IntenÃ§Ãµes

O Matias utiliza um sistema hÃ­brido de detecÃ§Ã£o de intenÃ§Ãµes:

1. **NLP Frontend** (opcional): Cliente pode enviar intenÃ§Ã£o prÃ©-detectada
2. **NLP Backend** (sempre ativo): ValidaÃ§Ã£o e detecÃ§Ã£o de fallback
3. **Contexto Ativo** (prioritÃ¡rio): MantÃ©m contexto de conversas multi-etapa

**IntenÃ§Ãµes Reconhecidas:**
- `AGENDAMENTO` - MarcaÃ§Ã£o de serviÃ§os
- `CONSULTA_OS` - Status de ordens de serviÃ§o
- `CONSULTA_ESTOQUE` - Disponibilidade de peÃ§as
- `CONSULTA_CLIENTE` - Dados cadastrais
- `CADASTRAR_CLIENTE` - Novo registro
- `CONSULTA_PRECO` - OrÃ§amentos e valores
- `ESTATISTICAS` - RelatÃ³rios e mÃ©tricas
- `AJUDA` - OrientaÃ§Ã£o e comandos
- `CONVERSA_GERAL` - DiÃ¡logo livre e diagnÃ³sticos

**Algoritmo de DetecÃ§Ã£o:**
```javascript
// PadrÃµes Regex para cada intenÃ§Ã£o
const padroes = {
    AJUDA: /\b(ajuda|help|o que pode|como funciona|comandos|menu)\b/i,
    AGENDAMENTO: /\b(agendar|marcar|reservar|horÃ¡rio|data|revisÃ£o)\b/i,
    CONSULTA_OS: /\b(ordem|serviÃ§o|os|status|andamento|pronto)\b/i,
    CONSULTA_ESTOQUE: /\b(peÃ§a|estoque|disponÃ­vel|filtro|Ã³leo|pneu)\b/i,
    ESTATISTICAS: /\b(quantos|total|relatÃ³rio|resumo|estatÃ­stica)\b/i,
    CADASTRAR_CLIENTE: /\b(cadastrar|novo cliente|adicionar cliente)\b/i,
    CONSULTA_CLIENTE: /\b(cliente|telefone|cpf|dados do cliente)\b/i
};

// PriorizaÃ§Ã£o: Contexto Ativo > Frontend NLP > Backend NLP
```

#### ExtraÃ§Ã£o de Entidades

**TÃ©cnicas Utilizadas:**
- **Regex Patterns:** Para dados estruturados (datas, horas, placas, CPF)
- **DicionÃ¡rios:** Para dias da semana, modelos de veÃ­culos, tipos de serviÃ§o
- **AnÃ¡lise Contextual:** "do JoÃ£o", "para o Gol", "na segunda"
- **ValidaÃ§Ã£o:** Verifica consistÃªncia e valores vÃ¡lidos

**Entidades Suportadas:**

| Entidade | Formatos Aceitos | Exemplos |
|----------|------------------|----------|
| **Nome Cliente** | "do JoÃ£o", "cliente Maria", "Nome: Pedro" | JoÃ£o Silva, Maria Costa |
| **VeÃ­culo** | Modelos comuns brasileiros | Gol, Civic, Corolla, HB20 |
| **Placa** | ABC-1234 ou ABC1234 | ABC-1234, XYZ-9876 |
| **Data** | Dia semana ou DD/MM/YYYY | segunda, 15/11/2025 |
| **Hora** | 14h, 14:00, Ã s 14 | 14:00, 16h, 10:30 |
| **ServiÃ§o** | ManutenÃ§Ãµes comuns | revisÃ£o, troca de Ã³leo, alinhamento |
| **CPF/CNPJ** | Com ou sem formataÃ§Ã£o | 123.456.789-00, 12345678900 |
| **Telefone** | VÃ¡rios formatos | (85) 99999-9999, 85988887777 |
| **Email** | PadrÃ£o RFC | joao@email.com |

**Exemplo de ExtraÃ§Ã£o:**
```
Entrada: "Agendar revisÃ£o para o Gol do JoÃ£o na segunda Ã s 14h"

Entidades ExtraÃ­das:
{
  cliente: "JoÃ£o",
  veiculo: "Gol",
  diaSemana: 1,
  diaTexto: "segunda",
  hora: "14:00",
  horaTexto: "14h",
  servico: "revisÃ£o"
}
```

---

## ðŸ”— INTEGRAÃ‡ÃƒO COM AGNO AI

### VisÃ£o Geral

O Matias utiliza o **Agno AI** como cÃ©rebro avanÃ§ado para:
- ConversaÃ§Ã£o natural complexa
- DiagnÃ³sticos tÃ©cnicos automotivos
- Consultas de preÃ§o contextualizadas
- RecomendaÃ§Ãµes personalizadas

### ConfiguraÃ§Ã£o

**VariÃ¡veis de Ambiente:**
```bash
# Backend (.env)
AGNO_API_URL=https://matias-agno-assistant.onrender.com
AGNO_API_TOKEN=<token_opcional>
AGNO_DEFAULT_AGENT_ID=oficinaia
```

**VerificaÃ§Ã£o de Status:**
```bash
GET /api/agno/config

Response:
{
  "configured": true,
  "agno_url": "https://matias-agno-assistant.onrender.com",
  "has_token": false,
  "agent_id": "oficinaia",
  "warmed": true,
  "status": "production"
}
```

### Sistema de Retry e Timeout

**EstratÃ©gia Implementada:**

1. **Primeira Tentativa:**
   - Timeout: 45 segundos
   - Inclui tempo de cold start do Render

2. **Segunda Tentativa (Retry):**
   - Delay: 2 segundos
   - Timeout: 30 segundos
   - ServiÃ§o jÃ¡ deve estar acordado

3. **Fallback Local:**
   - Se ambas falharem
   - Resposta genÃ©rica mas Ãºtil
   - MantÃ©m UX positivo

**CÃ³digo de Retry:**
```javascript
async function chamarAgnoAI(mensagem, usuario_id, intencao, nlp) {
    const maxTentativas = 2;
    let ultimoErro = null;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
        try {
            const timeout = tentativa === 1 ? 45000 : 30000;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${AGNO_API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: mensagem, user_id: usuario_id }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                return { success: true, response: data.response };
            }
        } catch (error) {
            ultimoErro = error;
            if (tentativa < maxTentativas) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    throw ultimoErro;
}
```

### Sistema de Warming

**Problema:** Render coloca serviÃ§os em sleep apÃ³s 15 minutos de inatividade (free tier)

**SoluÃ§Ã£o:** Cache de warming com cooldown

```javascript
const agnoWarmCache = new Map();
const WARM_COOLDOWN = 60000; // 60 segundos

async function warmAgnoService() {
    const now = Date.now();
    const lastWarm = agnoWarmCache.get('last_warm');
    
    if (lastWarm && (now - lastWarm) < WARM_COOLDOWN) {
        return { success: true, cached: true };
    }

    try {
        const response = await fetch(`${AGNO_API_URL}/health`, {
            timeout: 60000
        });
        
        agnoWarmCache.set('last_warm', now);
        return { success: true, warmed: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

**Endpoint Manual:**
```bash
POST /api/agno/warm

# Uso recomendado: Cron job a cada 10 minutos
*/10 * * * * curl -X POST https://ofix-backend-r556.onrender.com/api/agno/warm
```

### Base de Conhecimento do Agno

**Arquivos Markdown (.md):**
- `diagnosticos_barulhos.md` - Barulhos metÃ¡licos, assobios, estalos
- `diagnosticos_vibracao.md` - VibraÃ§Ãµes no volante, pedal, carroceria
- `manutencao_preventiva.md` - Intervalos e procedimentos por km
- `pecas_comuns.md` - FunÃ§Ã£o, vida Ãºtil, compatibilidade
- `procedimentos_tecnicos.md` - Passo a passo de reparos

**Embeddings:**
- Modelo: OpenAI text-embedding-3-small
- DimensÃµes: 1536
- Storage: LanceDB (vector database)

**Retrieval:**
- Top-k: 5 documentos mais relevantes
- Threshold: 0.7 similaridade
- Reranking: Por relevÃ¢ncia contextual

---

## ðŸŽ­ FLUXOS DE CONVERSAÃ‡ÃƒO

### 1. Fluxo Simples (Pergunta â†’ Resposta)

```
UsuÃ¡rio: "Tem filtro de Ã³leo disponÃ­vel?"
   â†“
NLP: Detecta CONSULTA_ESTOQUE
   â†“
Backend: processarConsultaEstoque()
   â†“
Database: SELECT * FROM pecas WHERE nome LIKE '%filtro Ã³leo%'
   â†“
Resposta: "âœ… Sim! Temos 5 filtros de Ã³leo em estoque..."
```

### 2. Fluxo Multi-etapa (Contexto Ativo)

```
UsuÃ¡rio: "Buscar cliente JoÃ£o"
   â†“
NLP: Detecta CONSULTA_CLIENTE
   â†“
Backend: Busca clientes com "JoÃ£o" â†’ Encontra 3 resultados
   â†“
Resposta: Lista 3 clientes + contexto_ativo: 'buscar_cliente'
   â†“
UsuÃ¡rio: "2" (seleciona o segundo)
   â†“
Backend: Usa contexto para saber que Ã© seleÃ§Ã£o de cliente
   â†“
Resposta: Dados completos do cliente selecionado
```

### 3. Fluxo com Agno AI

```
UsuÃ¡rio: "Meu carro estÃ¡ fazendo um barulho estranho no motor"
   â†“
NLP: Detecta CONVERSA_GERAL (nÃ£o Ã© intenÃ§Ã£o especÃ­fica)
   â†“
Backend: processarConversaGeral() â†’ chama Agno AI
   â†“
Agno: 
  1. Busca knowledge base (diagnosticos_barulhos.md)
  2. LLM processa contexto + conhecimento
  3. Gera resposta tÃ©cnica personalizada
   â†“
Backend: Recebe resposta + salva histÃ³rico
   â†“
Resposta: "Barulhos no motor podem indicar..."
```

### 4. Fluxo com ValidaÃ§Ã£o e Ambiguidade

```
UsuÃ¡rio: "Agendar revisÃ£o segunda 14h"
   â†“
NLP: Detecta AGENDAMENTO + Extrai entidades
   â†“
ValidaÃ§Ã£o: Falta cliente e veÃ­culo
   â†“
Resposta: "Para agendar, preciso saber: Qual cliente? Qual veÃ­culo?"
   â†“
UsuÃ¡rio: "JoÃ£o, Gol"
   â†“
Backend: Busca "JoÃ£o" â†’ Encontra 2 clientes
   â†“
Resposta: Lista clientes + contexto_ativo: 'agendamento_pendente'
   â†“
UsuÃ¡rio: "1"
   â†“
Backend: Cria agendamento com todos os dados
   â†“
Resposta: "âœ… Agendamento confirmado! JoÃ£o Silva - Gol - Segunda 14:00"
```

---

## ðŸ“¡ ENDPOINTS DA API

### Base URL
```
ProduÃ§Ã£o: https://ofix-backend-r556.onrender.com/api/agno
Desenvolvimento: http://localhost:3001/api/agno
```

### AutenticaÃ§Ã£o
```
Header: Authorization: Bearer <JWT_TOKEN>
Obtido via: POST /api/auth/login
```

---

### 1. Chat Principal

**Endpoint:** `POST /api/agno/chat`

**DescriÃ§Ã£o:** Endpoint principal para interaÃ§Ã£o com o Matias

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

**Body:**
```json
{
  "message": "Agendar revisÃ£o para o Gol do JoÃ£o na segunda Ã s 14h",
  "usuario_id": "uuid-do-usuario",
  "nlp": {
    "intencao": "agendamento",
    "confianca": 0.95,
    "entidades": {
      "cliente": "JoÃ£o",
      "veiculo": "Gol",
      "dia": "segunda",
      "hora": "14h",
      "servico": "revisÃ£o"
    }
  },
  "contexto_ativo": null,
  "cliente_selecionado": null
}
```

**Response Success:**
```json
{
  "success": true,
  "response": "âœ… Agendamento confirmado!\n\nðŸ“‹ **Detalhes:**\nâ€¢ Cliente: JoÃ£o Silva\nâ€¢ VeÃ­culo: Gol - ABC-1234\nâ€¢ Data: Segunda, 13/11/2025\nâ€¢ Hora: 14:00\nâ€¢ ServiÃ§o: RevisÃ£o completa\n\nðŸ”” **Lembrete:** Chegue 10 minutos antes.",
  "tipo": "agendamento",
  "agendamento_criado": {
    "id": 123,
    "cliente_id": "uuid",
    "data": "2025-11-13",
    "hora": "14:00",
    "status": "AGENDADO"
  },
  "metadata": {
    "intencao_detectada": "AGENDAMENTO",
    "entidades_extraidas": {...},
    "timestamp": "2025-11-08T12:00:00.000Z"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Dados insuficientes para agendamento",
  "faltando": ["cliente", "veÃ­culo"],
  "response": "Para agendar, preciso saber:\nâ€¢ Nome do cliente\nâ€¢ Modelo do veÃ­culo"
}
```

---

### 2. HistÃ³rico de Conversas

**Endpoint:** `GET /api/agno/historico-conversa`

**DescriÃ§Ã£o:** Recupera histÃ³rico de conversas do usuÃ¡rio

**Query Parameters:**
```
?limite=50        # Quantidade de mensagens (padrÃ£o: 50)
&offset=0         # PaginaÃ§Ã£o (padrÃ£o: 0)
```

**Response:**
```json
{
  "success": true,
  "conversas": [
    {
      "id": 1,
      "tipo": "user",
      "tipo_remetente": "user",
      "conteudo": "Agendar revisÃ£o para segunda 14h",
      "timestamp": "2025-11-08T10:00:00.000Z"
    },
    {
      "id": 2,
      "tipo": "matias",
      "tipo_remetente": "matias",
      "conteudo": "âœ… Agendamento confirmado!...",
      "timestamp": "2025-11-08T10:00:05.000Z"
    }
  ],
  "total": 100,
  "limite": 50,
  "offset": 0
}
```

---

### 3. ConfiguraÃ§Ã£o do Agno

**Endpoint:** `GET /api/agno/config`

**DescriÃ§Ã£o:** Verifica status e configuraÃ§Ã£o do Agno AI (pÃºblico, sem auth)

**Response:**
```json
{
  "configured": true,
  "agno_url": "https://matias-agno-assistant.onrender.com",
  "has_token": false,
  "agent_id": "oficinaia",
  "warmed": true,
  "last_warming": "2025-11-08T11:55:00.000Z",
  "timestamp": "2025-11-08T12:00:00.000Z",
  "status": "production"
}
```

---

### 4. Aquecer ServiÃ§o Agno

**Endpoint:** `POST /api/agno/warm`

**DescriÃ§Ã£o:** Acorda o serviÃ§o Agno AI (Ãºtil para cron jobs)

**Response:**
```json
{
  "success": true,
  "warmed": true,
  "agno_url": "https://matias-agno-assistant.onrender.com",
  "response_time": 1523,
  "message": "ServiÃ§o Agno aquecido com sucesso",
  "timestamp": "2025-11-08T12:00:00.000Z"
}
```

---

### 5. Listar Agentes DisponÃ­veis

**Endpoint:** `GET /api/agno/agents`

**DescriÃ§Ã£o:** Lista agentes Agno disponÃ­veis

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "id": "oficinaia",
      "name": "Matias - Assistente Oficina",
      "description": "Especialista em diagnÃ³sticos automotivos e gestÃ£o de oficina",
      "status": "active",
      "model": "groq/llama-3.1-70b-versatile",
      "knowledge_base_size": 25,
      "last_updated": "2025-11-01T00:00:00.000Z"
    }
  ]
}
```

---

### 6. Chat Direto com Agente (Debug)

**Endpoint:** `POST /api/agno/chat-agent`

**DescriÃ§Ã£o:** Chama Agno AI diretamente, sem processamento local

**Body:**
```json
{
  "message": "O que Ã© alinhamento?",
  "agent_id": "oficinaia",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Alinhamento Ã© o ajuste dos Ã¢ngulos das rodas...",
  "session_id": "session-uuid",
  "metadata": {
    "agent_id": "oficinaia",
    "run_id": "run-uuid",
    "model": "groq/llama-3.1-70b-versatile",
    "tokens_used": 450,
    "timestamp": "2025-11-08T12:00:00.000Z"
  }
}
```

---

### 7. Chat Debug (Desenvolvimento)

**Endpoint:** `POST /api/agno/chat-debug`

**DescriÃ§Ã£o:** Testa Agno com parÃ¢metros customizados

**Body:**
```json
{
  "message": "Teste de mensagem",
  "agent_id": "oficinaia",
  "session_id": "test-session",
  "custom_params": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

---

## ðŸ“š BASES DE CONHECIMENTO

### Documentos no Agno AI

#### 1. diagnosticos_barulhos.md
**ConteÃºdo:**
- Barulhos metÃ¡licos (crÃ­tico)
- Assobios e chiados (mÃ©dio)
- Estalos e rangidos
- RelaÃ§Ã£o: Sintoma â†’ Causa â†’ SoluÃ§Ã£o

**Exemplo:**
```markdown
## Barulho MetÃ¡lico no Motor

**Sintomas:**
- Som de metal batendo
- Aumenta com aceleraÃ§Ã£o
- Pode ser intermitente

**Causas PossÃ­veis:**
1. Folga em biela (crÃ­tico)
2. Tensor da correia frouxo
3. ProteÃ§Ã£o solta

**DiagnÃ³stico:**
- Verificar nÃ­vel de Ã³leo
- Inspecionar correias
- Teste de compressÃ£o

**SoluÃ§Ã£o:**
- Biela: RetÃ­fica motor (urgente)
- Tensor: Substituir tensor
- ProteÃ§Ã£o: Reaperto
```

#### 2. manutencao_preventiva.md
**ConteÃºdo:**
- Intervalos por quilometragem
- Checklist de revisÃµes
- PeÃ§as com vida Ãºtil
- Fluidos a trocar

**Tabela de ManutenÃ§Ã£o:**
| KM | ServiÃ§os |
|----|----------|
| 5.000 | Troca Ã³leo + filtro Ã³leo |
| 10.000 | Ã“leo, filtros (Ã³leo, ar, combustÃ­vel), revisÃ£o geral |
| 20.000 | Ã“leo, filtros, pastilhas freio, alinhamento |
| 40.000 | Ã“leo, filtros, velas, correia dentada, fluido freio |
| 60.000 | RevisÃ£o completa + suspensÃ£o |

#### 3. pecas_comuns.md
**ConteÃºdo:**
- FunÃ§Ã£o de cada peÃ§a
- Vida Ãºtil mÃ©dia
- Sintomas de desgaste
- Compatibilidade entre modelos

**Exemplo - Filtro de Ã“leo:**
```markdown
## Filtro de Ã“leo

**FunÃ§Ã£o:**
Remove impurezas do Ã³leo lubrificante do motor

**Vida Ãštil:**
- Normal: 5.000 km ou 6 meses
- Severo: 3.000 km ou 3 meses

**Sintomas de SaturaÃ§Ã£o:**
- PressÃ£o de Ã³leo baixa
- Luz de Ã³leo acende
- RuÃ­dos no motor

**Tipos:**
- Cartucho descartÃ¡vel (mais comum)
- Elemento (apenas elemento interno)

**Compatibilidade:**
- Verificar rosca e diÃ¢metro
- Usar sempre original ou equivalente certificado
```

#### 4. procedimentos_tecnicos.md
**ConteÃºdo:**
- Passo a passo de reparos
- Ferramentas necessÃ¡rias
- Tempo estimado
- NÃ­vel de dificuldade

#### 5. diagnosticos_vibracao.md
**ConteÃºdo:**
- VibraÃ§Ãµes no volante
- TrepidaÃ§Ãµes no pedal de freio
- OscilaÃ§Ãµes na carroceria
- Testes de diagnÃ³stico

---

### Como o Agno Usa o Conhecimento

**Fluxo RAG (Retrieval Augmented Generation):**

```
1. UsuÃ¡rio: "Meu carro tÃ¡ fazendo um barulho no motor"
   â†“
2. Embedding: Converte texto em vetor (1536 dimensÃµes)
   â†“
3. Vector Search: Busca top-5 documentos similares no LanceDB
   â†“
4. Retrieval: 
   - diagnosticos_barulhos.md (score: 0.92)
   - procedimentos_tecnicos.md (score: 0.78)
   â†“
5. Context Building: Monta prompt com documentos relevantes
   â†“
6. LLM Generation: LLaMA 3.1 70B gera resposta contextualizada
   â†“
7. Response: "Com base nos sintomas, pode ser..."
```

**Vantagens:**
- âœ… Respostas baseadas em conhecimento real
- âœ… Reduz alucinaÃ§Ãµes do LLM
- âœ… AtualizaÃ§Ã£o fÃ¡cil (basta adicionar .md)
- âœ… Rastreabilidade (sabe de onde veio info)

---

## ðŸ“Š MÃ‰TRICAS E MONITORAMENTO

### MÃ©tricas Implementadas

#### 1. Conversas
- Total de mensagens processadas
- Mensagens por usuÃ¡rio
- Mensagens por intenÃ§Ã£o
- Taxa de sucesso/erro

#### 2. Performance Agno AI
- Tempo de resposta mÃ©dio
- Taxa de timeout
- Taxa de retry bem-sucedido
- Uptime do serviÃ§o

#### 3. Agendamentos
- Agendamentos criados
- Taxa de confirmaÃ§Ã£o
- HorÃ¡rios mais procurados
- ServiÃ§os mais agendados

#### 4. Consultas
- OS consultadas
- Clientes buscados
- PeÃ§as consultadas
- EstatÃ­sticas solicitadas

### Logs Estruturados

**Formato:**
```javascript
console.log('ðŸ¤– [CHAT]', {
  timestamp: new Date().toISOString(),
  user_id: 'uuid',
  intencao: 'AGENDAMENTO',
  success: true,
  response_time: 1250,
  agno_called: true,
  agno_response_time: 1100
});
```

**Categorias:**
- `ðŸ¤– [CHAT]` - InteraÃ§Ãµes principais
- `ðŸ”Œ [AGNO]` - Chamadas ao Agno AI
- `âš ï¸ [ERROR]` - Erros e exceÃ§Ãµes
- `âœ… [SUCCESS]` - OperaÃ§Ãµes bem-sucedidas
- `ðŸ” [NLP]` - DetecÃ§Ã£o de intenÃ§Ãµes

### Health Checks

**Backend:**
```bash
GET /health
Response: { status: 'ok', uptime: 3600, timestamp: '...' }
```

**Agno AI:**
```bash
GET /api/agno/config
Verifica: configured, warmed, last_warming
```

---

## ðŸš€ ROADMAP E MELHORIAS FUTURAS

### Em Desenvolvimento

#### 1. âœ¨ Melhorias de NLP
- [ ] DetecÃ§Ã£o de sentimento (satisfaÃ§Ã£o do cliente)
- [ ] CorreÃ§Ã£o automÃ¡tica de erros de digitaÃ§Ã£o
- [ ] Suporte a mÃºltiplos idiomas (inglÃªs, espanhol)
- [ ] SinÃ´nimos e variaÃ§Ãµes regionais

#### 2. ðŸŽ¯ Funcionalidades Novas
- [ ] NotificaÃ§Ãµes proativas (OS concluÃ­da, agendamento prÃ³ximo)
- [ ] RecomendaÃ§Ãµes inteligentes (manutenÃ§Ã£o preventiva)
- [ ] OrÃ§amentos automÃ¡ticos baseados em histÃ³rico
- [ ] Busca semÃ¢ntica em histÃ³rico de conversas

#### 3. ðŸ”— IntegraÃ§Ãµes
- [ ] WhatsApp Business API
- [ ] Telegram Bot
- [ ] IntegraÃ§Ã£o com calendÃ¡rio (Google Calendar)
- [ ] Sistema de pagamentos online

#### 4. ðŸ“Š Analytics AvanÃ§ado
- [ ] Dashboard de mÃ©tricas do Matias
- [ ] AnÃ¡lise de satisfaÃ§Ã£o (NPS)
- [ ] IdentificaÃ§Ã£o de gargalos operacionais
- [ ] PrevisÃ£o de demanda (ML)

#### 5. ðŸ¤– Agno AI Enhancements
- [ ] Fine-tuning do modelo para oficinas brasileiras
- [ ] ExpansÃ£o da base de conhecimento (mais marcas/modelos)
- [ ] Suporte a imagens (diagnÃ³stico por foto)
- [ ] Voice-to-text (comandos por voz)

### Melhorias de Performance

#### 1. Cache Inteligente
- [ ] Cache de respostas frequentes (ex: "Ajuda")
- [ ] Cache de consultas de estoque
- [ ] InvalidaÃ§Ã£o seletiva por mudanÃ§as

#### 2. OtimizaÃ§Ã£o de Queries
- [ ] Ãndices adicionais no PostgreSQL
- [ ] Query optimization (N+1, joins)
- [ ] Pagination em todas as listagens

#### 3. Escalabilidade
- [ ] Load balancing para mÃºltiplas instÃ¢ncias
- [ ] Redis para sessÃµes e cache
- [ ] CDN para assets estÃ¡ticos
- [ ] Database read replicas

### Melhorias de UX

#### 1. Interface
- [ ] Typing indicator (Matias digitando...)
- [ ] ReaÃ§Ãµes rÃ¡pidas (ðŸ‘ ðŸ‘Ž)
- [ ] SugestÃµes de perguntas
- [ ] Atalhos de teclado

#### 2. Acessibilidade
- [ ] Screen reader support
- [ ] Contraste alto
- [ ] Tamanho de fonte ajustÃ¡vel
- [ ] NavegaÃ§Ã£o por teclado

#### 3. Mobile
- [ ] App nativo (React Native)
- [ ] NotificaÃ§Ãµes push
- [ ] Modo offline (cache local)
- [ ] GeolocalizaÃ§Ã£o (oficinas prÃ³ximas)

---

## ðŸ› ï¸ CONFIGURAÃ‡ÃƒO E DEPLOYMENT

### Desenvolvimento Local

**PrÃ©-requisitos:**
```bash
Node.js >= 18.x
PostgreSQL >= 14.x
npm ou yarn
```

**Setup Backend:**
```bash
cd ofix-backend
npm install
cp .env.example .env
# Configurar variÃ¡veis em .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Setup Frontend:**
```bash
cd ofix_new
npm install
cp .env.example .env
# Configurar VITE_API_BASE_URL
npm run dev
```

### ProduÃ§Ã£o (Render)

**Backend:**
```yaml
# render.yaml
services:
  - type: web
    name: ofix-backend-prod
    env: node
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: AGNO_API_URL
        value: https://matias-agno-assistant.onrender.com
      - key: AGNO_DEFAULT_AGENT_ID
        value: oficinaia
      - key: JWT_SECRET
        generateValue: true
```

**Agno AI:**
```yaml
services:
  - type: web
    name: matias-agno-assistant
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GROQ_API_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
```

**Frontend (Vercel):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "https://ofix-backend-r556.onrender.com"
  }
}
```

---

## ðŸ“ž SUPORTE E CONTATO

### DocumentaÃ§Ã£o Adicional
- `AGNO_TIMEOUT_FIX.md` - SoluÃ§Ã£o de timeouts
- `IMPLEMENTACAO_COMPLETA_MATIAS.md` - Detalhes tÃ©cnicos
- `COMO_TESTAR_AGNO_CORRIGIDO.md` - Testes

### RepositÃ³rio
```
GitHub: PedroVictor26/Ofix_version1
Branch: main
```

### Ambientes

**ProduÃ§Ã£o:**
- Frontend: https://ofix-frontend.vercel.app
- Backend: https://ofix-backend-r556.onrender.com
- Agno AI: https://matias-agno-assistant.onrender.com

**Desenvolvimento:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## ðŸ“ CHANGELOG

### v2.1.0 (2025-11-08) - ATUAL
- âœ… **Conversa Geral com Agno**: Agora responde perguntas simples
- âœ… **Sistema de Retry**: 2 tentativas automÃ¡ticas
- âœ… **Warming Inteligente**: Cache de 60s
- âœ… **Fallback Robusto**: Mensagens Ãºteis em caso de timeout
- âœ… **HistÃ³rico Corrigido**: RenderizaÃ§Ã£o correta de mensagens
- âœ… **Campos Prisma**: Compatibilidade com schema

### v2.0.0 (2025-11-01)
- âœ… IntegraÃ§Ã£o completa com Agno AI
- âœ… Base de conhecimento automotiva
- âœ… Sistema de NLP hÃ­brido
- âœ… Contexto ativo multi-etapa

### v1.5.0 (2025-10-15)
- âœ… Agendamento inteligente
- âœ… Consulta de OS
- âœ… Gerenciamento de clientes

### v1.0.0 (2025-10-01)
- âœ… Chat bÃ¡sico funcional
- âœ… Consulta de estoque
- âœ… EstatÃ­sticas simples

---

## ðŸŽ“ CASOS DE USO REAIS

### Caso 1: Agendamento Completo
```
Cliente: "Oi, preciso agendar uma revisÃ£o"
Matias: "OlÃ¡! Vou ajudar com o agendamento. Preciso de algumas informaÃ§Ãµes:
         â€¢ Qual o seu nome?
         â€¢ Modelo do veÃ­culo?
         â€¢ Que dia prefere?
         â€¢ Qual horÃ¡rio?"

Cliente: "JoÃ£o Silva, Gol, segunda de tarde"
Matias: "Perfeito! Qual horÃ¡rio Ã  tarde prefere? (13h, 14h, 15h, 16h, 17h)"

Cliente: "14h tÃ¡ bom"
Matias: "âœ… Agendamento confirmado!
         
         ðŸ“‹ Detalhes:
         â€¢ Cliente: JoÃ£o Silva
         â€¢ VeÃ­culo: Gol
         â€¢ Data: Segunda, 13/11/2025
         â€¢ Hora: 14:00
         â€¢ ServiÃ§o: RevisÃ£o completa
         
         ðŸ”” Lembrete enviado! Chegue 10 minutos antes."
```

### Caso 2: DiagnÃ³stico de Problema
```
Cliente: "Meu carro tÃ¡ fazendo um barulho estranho quando eu freio"
Matias: "Vou ajudar com esse diagnÃ³stico. Barulhos ao frear geralmente 
         indicam desgaste nas pastilhas de freio. Vou fazer algumas perguntas:
         
         1. Ã‰ um chiado agudo ou um rangido mais grave?
         2. Acontece sempre que freia ou sÃ³ em freadas fortes?
         3. HÃ¡ quanto tempo comeÃ§ou?"

Cliente: "Ã‰ um chiado agudo, acontece sempre, comeÃ§ou essa semana"
Matias: "Com base nos sintomas, provavelmente as pastilhas de freio 
         estÃ£o no limite do desgaste. O chiado Ã© um indicador sonoro 
         instalado justamente para avisar isso.
         
         ðŸ”´ IMPORTANTE: NÃ£o deixe para depois! Pastilhas muito gastas 
         podem danificar os discos de freio, aumentando o custo do reparo.
         
         ðŸ’¡ RecomendaÃ§Ã£o:
         â€¢ Troca imediata das pastilhas (dianteiras e traseiras)
         â€¢ InspeÃ§Ã£o dos discos de freio
         â€¢ VerificaÃ§Ã£o do fluido de freio
         
         ðŸ“… Posso agendar para vocÃª? Tenho vaga amanhÃ£ Ã s 10h."

Cliente: "Sim, agenda"
Matias: "âœ… Agendado! JoÃ£o Silva - AmanhÃ£ 10h - Troca de pastilhas
         
         ðŸ“ž Caso precise remarcar: (85) 99999-9999"
```

### Caso 3: Consulta RÃ¡pida
```
Cliente: "Tem Ã³leo 5W30 aÃ­?"
Matias: "Sim! Temos em estoque:
         
         âœ… Ã“leo 5W30 SintÃ©tico
         â€¢ Quantidade: 12 litros
         â€¢ Marca: Mobil 1, Castrol Edge
         â€¢ PreÃ§o: R$ 45,00/litro
         
         ðŸ’¡ Para troca completa (4L): R$ 180,00
         
         Quer agendar a troca?"
```

---

## ðŸ† DIFERENCIAIS COMPETITIVOS

### 1. InteligÃªncia Contextual
- Entende **contexto da conversa**
- Lembra **interaÃ§Ãµes anteriores**
- MantÃ©m **fluxos multi-etapa**

### 2. Conhecimento Especializado
- **Base tÃ©cnica automotiva** completa
- Atualizada com **melhores prÃ¡ticas**
- Validada por **mecÃ¢nicos experientes**

### 3. Disponibilidade MÃ¡xima
- **24/7** sem paradas
- **Fallback robusto** em caso de falhas
- **Retry automÃ¡tico** transparente

### 4. ExperiÃªncia do UsuÃ¡rio
- Respostas **rÃ¡pidas** (< 5s apÃ³s warming)
- Linguagem **clara e acessÃ­vel**
- FormataÃ§Ã£o **visual rica** (emojis, formataÃ§Ã£o)

### 5. Escalabilidade
- Arquitetura **serverless**
- **Cache inteligente**
- **Stateless** (fÃ¡cil scaling horizontal)

---

## ðŸ“– GLOSSÃRIO TÃ‰CNICO

| Termo | Significado |
|-------|-------------|
| **NLP** | Natural Language Processing - Processamento de Linguagem Natural |
| **LLM** | Large Language Model - Modelo de Linguagem Grande |
| **RAG** | Retrieval Augmented Generation - GeraÃ§Ã£o Aumentada por RecuperaÃ§Ã£o |
| **Embedding** | RepresentaÃ§Ã£o vetorial de texto para busca semÃ¢ntica |
| **Vector DB** | Banco de dados otimizado para busca vetorial (LanceDB) |
| **Cold Start** | Primeira inicializaÃ§Ã£o apÃ³s perÃ­odo de inatividade |
| **Fallback** | Resposta alternativa quando sistema principal falha |
| **Intent** | IntenÃ§Ã£o detectada na mensagem do usuÃ¡rio |
| **Entity** | InformaÃ§Ã£o especÃ­fica extraÃ­da (nome, data, hora, etc) |
| **Context** | Estado mantido entre mensagens de uma conversa |
| **Webhook** | Chamada HTTP automÃ¡tica para notificaÃ§Ãµes |
| **JWT** | JSON Web Token - Token de autenticaÃ§Ã£o |
| **ORM** | Object-Relational Mapping - Prisma no caso |

---

## âœ… CONCLUSÃƒO

O **Agente Matias** Ã© um assistente virtual completo e robusto, desenvolvido especificamente para oficinas automotivas. Combina **processamento local eficiente** com **inteligÃªncia artificial avanÃ§ada** via Agno AI, oferecendo:

âœ… **Funcionalidades completas** de gestÃ£o de oficina  
âœ… **ConversaÃ§Ã£o natural** e contextual  
âœ… **Conhecimento tÃ©cnico especializado**  
âœ… **Alta disponibilidade** com sistema de fallback  
âœ… **Escalabilidade** para crescimento  
âœ… **FÃ¡cil manutenÃ§Ã£o** e atualizaÃ§Ã£o  

O sistema estÃ¡ **pronto para produÃ§Ã£o** e jÃ¡ demonstra resultados significativos em:
- ReduÃ§Ã£o de tempo de atendimento
- AutomaÃ§Ã£o de agendamentos
- Melhoria na experiÃªncia do cliente
- OtimizaÃ§Ã£o do fluxo de trabalho

---

**Ãšltima AtualizaÃ§Ã£o:** 08/11/2025  
**VersÃ£o do Documento:** 1.0  
**Autor:** Sistema OFIX  
**Status:** âœ… Ativo em ProduÃ§Ã£o

---

ðŸ¤– **"Matias: Seu assistente inteligente para oficinas automotivas"**
