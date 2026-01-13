import requests

url = "https://holly-unlame-nonmetaphorically.ngrok-free.dev/api/tags"

try:
    print(f"Testando conexão com {url}...")
    response = requests.get(url, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Erro ao conectar: {e}")
