# Matias AI com Agno

Este projeto implementa o assistente automotivo Matias AI usando o framework Agno, com base de conhecimento RAG, testes automatizados e integração com LLMs open-source.

## Estrutura
- `docs/` - Documentos de conhecimento para RAG
- `Matias.md` - Guia do agente (prompt de sistema)
- `tools/knowledge_base.py` - Ferramenta de consulta à base de conhecimento
- `main.py` - Definição do agente principal
- `tests/` - Testes automatizados para validação do agente

## Como usar
1. Instale as dependências: `pip install -r requirements.txt`
2. Configure o `.env` com seu HF_TOKEN
3. Inicialize o projeto Agno: `agno init`
4. Execute os testes: `agno test`
5. Rode o agente localmente: `agno host`
6. Faça deploy no Agno OS para produção

## Ciclo de desenvolvimento
- Adicione conhecimento em `docs/`
- Crie/edite testes em `tests/`
- Valide localmente
- Faça deploy e monitore via Agno OS
