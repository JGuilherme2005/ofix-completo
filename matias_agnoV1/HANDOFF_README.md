# 📘 Manual de Handoff - Projeto Matias & Ofix (Integração IA)

Este documento serve como guia técnico para continuar o desenvolvimento do assistente **Matias** (IA da Ofix) e sua integração com o sistema principal.

---

## 🏗️ 1. Visão Geral da Arquitetura

O sistema opera em uma arquitetura híbrida:

1.  **Frontend/Backend Ofix (Node.js/React)**:
    *   Gerencia a interface do usuário (Chat, Dashboard).
    *   Recebe mensagens do usuário e decide se processa localmente ou envia para a IA.
    *   Porta Padrão: `3001` (Backend), `3000` (Frontend).

2.  **Agente Matias (Python/Agno/FastAPI)**:
    *   "Cérebro" da IA. Processa mensagens complexas usando LLMs.
    *   Suporta **Ollama** (local/remoto) e **Agno AI** (nuvem).
    *   Porta Padrão: `8001`.

### 🔄 Fluxo de Comunicação
1.  Usuário envia mensagem no Chat Ofix.
2.  Backend Node recebe em `/routes/agno.routes.js`.
3.  Node envia requisição POST para Python em `http://localhost:8001/agno/chat-inteligente`.
4.  Agente Python (`matias_agno/main.py` -> `agents/matias_ollama.py`) processa usando Ollama.
5.  Resposta é devolvida ao Node e exibida no Chat.

---

## 🚀 2. Como Rodar o Projeto

### Pré-requisitos
*   Python 3.10+
*   Node.js 18+
*   Ollama (rodando localmente ou endereço remoto configurado).

### Passo 1: Iniciar o Agente (Python)
No diretório `matias_agnoV1`:

1.  Configure o `.env` (se necessário):
    ```ini
    OLLAMA_ENABLED=true
    OLLAMA_BASE_URL=https://seu-ollama-url.com (ou http://localhost:11434)
    PORT=8001
    ```
2.  Inicie o servidor:
    ```bash
    python -m matias_agno.main
    ```
    *Deverá aparecer: `✅ Servidor rodando na porta 8001`.*

### Passo 2: Iniciar o Backend Ofix (Node.js)
No diretório `ofix-backend`:

1.  Certifique-se que o `.env` aponta para o agente local:
    ```ini
    AGNO_API_URL=http://localhost:8001
    ```
2.  Rode o servidor:
    ```bash
    npm run dev
    ```

---

## 📂 3. Arquivos Principais

### No Repositório `matias_agnoV1` (Python)

*   **`matias_agno/agents/matias_ollama.py`**:
    *   Definição principal do agente. Configura o modelo (Ollama), instruções (Prompt) e ferramentas.
    *   **Ponto de atenção**: Se quiser mudar o comportamento da IA, edite as `instructions` aqui.

*   **`matias_agno/api.py`**:
    *   Define os endpoints da API (`/agno/chat-inteligente`).
    *   Define o contrato de dados (`ChatRequest`, `ChatResponse`).

*   **`matias_agno/main.py`**:
    *   Entrypoint. Decide se carrega o agente HuggingFace ou Ollama baseado no `.env`.
    *   Configura CORS (importante para o Frontend acessar).

### No Repositório `OfixNovo` (Node.js)

*   **`ofix-backend/src/routes/agno.routes.js`**:
    *   Gerencia o roteamento de mensagens.
    *   Rota `/chat` (Node) -> chama `/agno/chat-inteligente` (Python).
    *   Implementa fallback (se Python cair, responde localmente).

---

## 🛠️ 4. Estado Atual e Últimas Alterações (Dez/2025)

*   **✅ Integração Ollama Remoto**: O sistema está configurado para usar um servidor Ollama externo via Ngrok (ou local).
*   **✅ Correção de Portas**: Padronizamos a comunicação na porta `8001` para evitar conflitos com outros serviços.
*   **✅ API Schema**: Atualizamos o `matias_agno/api.py` para aceitar `session_id` e `user_id`, permitindo memória persistente por usuário.

---

## ❓ 5. Troubleshooting (Solução de Problemas)

### Erro: "429 Too Many Requests" ou "Connection Failed"
*   **Causa**: O Backend Node está tentando conectar na porta errada (8000) ou o servidor Python não está rodando.
*   **Solução**: Verifique se `matias_agno/main.py` está rodando e se `AGNO_API_URL` no Node é `http://localhost:8001`.

### Erro: "404 Not Found" ao acessar `/sessions/...` (No Agno OS UI)
*   **Causa**: Interface UI tentando acessar uma sessão antiga no banco de dados SQLite.
*   **Solução**: Limpe a URL do navegador (remova `?session=...`) ou clique em "New Chat".

### IA Respondendo "Não tenho acesso a essa informação"
*   **Causa**: Prompt do sistema muito restritivo ou falta de Knowledge Base.
*   **Solução**: Edite `matias_agno/agents/matias_ollama.py` e adicione instruções/conhecimento.

---

## ☁️ 6. Deploy no Render

O projeto está configurado para deploy via Docker ou Python nativo no **Render.com**.

### Configuração do Serviço (Web Service)
*   **Build Command**: `pip install -r matias_agno/requirements.txt`
*   **Start Command**: `python -m matias_agno.main`
*   **Porta**: O Render injeta a variável `PORT` automaticamente. O código já está preparado para ler isso.

### Variáveis de Ambiente (Environment Variables) no Render:
Para funcionar com o **Ollama Remoto** (via Ngrok ou IP público), você deve configurar:

| Variável | Valor Exemplo | Descrição |
| :--- | :--- | :--- |
| `OLLAMA_ENABLED` | `true` | Ativa o agente Ollama em vez do HuggingFace |
| `OLLAMA_BASE_URL` | `https://seu-ollama.ngrok-free.app` | URL pública do seu servidor Ollama |
| `SUPABASE_DB_URL` | `postgresql://...` | (Opcional) Para persistência no Supabase |

> **⚠️ Atenção:** Se o Render não conseguir acessar seu Ollama (ex: se estiver no localhost sem túnel), o agente falhará ao iniciar. Garanta que a URL do Ollama seja acessível publicamente.

---

## 🔮 7. Próximos Passos Sugeridos

1.  **Melhorar a Memória**: Atualmente usa SQLite/Postgres. Verificar se a persistência de longo prazo está ideal para múltiplos usuários.
2.  **Tools Customizadas**: Adicionar ferramentas Python para o agente consultar o banco de dados do Ofix diretamente (via Prisma ou SQL), permitindo que ele responda "Quanto faturamos hoje?" com dados reais.
3.  **Interface de Admin**: Criar uma tela no Ofix para configurar o Prompt do Matias sem precisar mexer no código.

---
*Gerado por Agente Antigravity - 18/12/2025*
