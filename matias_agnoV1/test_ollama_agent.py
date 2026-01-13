from matias_agno.agents.matias_ollama import create_matias_ollama_agent

print("Inicializando Matias com Ollama Remoto...")
agent = create_matias_ollama_agent()

print("\n--- Teste de Conexão e Resposta ---")
agent.print_response("Olá! Quem é você e o que você faz?", stream=True)
