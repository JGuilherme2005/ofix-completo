import os
import sys

# Adicionar o diretório atual ao sys.path para importação correta
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from matias_agno.main import agent_os

if __name__ == "__main__":
    print("🚀 Iniciando Agno OS...")
    print("👉 Acesse: https://os.agno.com")
    print("⚠️  Se der erro 404, limpe a URL (remova ?session=...) ou clique em 'New Chat'.")
    # Inicia o servidor do Agno OS
    # Isso deve carregar a interface se configurada ou o servidor API
    agent_os.serve(app="matias_agno.main:app")
