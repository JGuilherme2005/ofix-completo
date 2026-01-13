import requests
import json

# Fazer uma requisição especial para debug
response = requests.get("https://matias-agno-assistant.onrender.com/status")
print("Status da API:", response.json())

# Tentar carregar de novo com timeout maior
print("\nTentando carregar conhecimento...")
try:
    response = requests.post(
        "https://matias-agno-assistant.onrender.com/load_knowledge",
        timeout=300
    )
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Erro:", e)
