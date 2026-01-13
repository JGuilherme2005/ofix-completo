from ollama import Client
try:
    client = Client(host='https://holly-unlame-nonmetaphorically.ngrok-free.dev')
    print("Client created successfully")
    response = client.list()
    print("Models found:", [m['name'] for m in response['models']])
except Exception as e:
    print(f"Error: {e}")
