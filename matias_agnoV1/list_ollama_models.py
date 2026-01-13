import requests

base_url = "https://holly-unlame-nonmetaphorically.ngrok-free.dev"
try:
    response = requests.get(f"{base_url}/api/tags")
    if response.status_code == 200:
        models = response.json()
        print("Available models:")
        for model in models['models']:
            print(f"- {model['name']}")
    else:
        print(f"Failed to list models. Status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error connecting to Ollama: {e}")
