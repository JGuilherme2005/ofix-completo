try:
    from agno.models.ollama import Ollama
    print("Ollama import successful")
except ImportError as e:
    print(f"Ollama import failed: {e}")
