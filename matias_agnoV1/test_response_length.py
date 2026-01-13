import requests

url = "http://localhost:8000/chat"
payload = {
    "message": "meu freio esta rangendo",
    "session_id": "test_debug",
    "user_id": "user_debug"
}

response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")
print(f"\n{'='*60}")
print("RESPOSTA COMPLETA:")
print(f"{'='*60}\n")
print(response.json()['response'])
print(f"\n{'='*60}")
print(f"Tamanho: {len(response.json()['response'])} caracteres")
