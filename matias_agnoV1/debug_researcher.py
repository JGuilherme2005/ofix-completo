import os
import traceback

print("1. Importing os...")
try:
    import os
    print("✅ os imported")
except Exception as e:
    print(f"❌ os import failed: {e}")

print("2. Importing agno.agent...")
try:
    from agno.agent import Agent
    print("✅ Agent imported")
except Exception as e:
    print(f"❌ Agent import failed: {e}")

print("3. Importing agno.models.huggingface...")
try:
    from agno.models.huggingface import HuggingFace
    print("✅ HuggingFace imported")
except Exception as e:
    print(f"❌ HuggingFace import failed: {e}")

print("4. Importing agno.tools.duckduckgo...")
try:
    from agno.tools.duckduckgo import DuckDuckGoTools
    print("✅ DuckDuckGoTools imported")
except Exception as e:
    print(f"❌ DuckDuckGoTools import failed: {e}")

print("5. Initializing DuckDuckGoTools...")
try:
    tools = DuckDuckGoTools()
    print("✅ DuckDuckGoTools initialized")
except Exception as e:
    print(f"❌ DuckDuckGoTools init failed: {e}")
    traceback.print_exc()

print("6. Initializing HuggingFace...")
try:
    hf_token = os.getenv("HF_TOKEN", "").strip()
    model = HuggingFace(id="Qwen/Qwen2.5-7B-Instruct", api_key=hf_token)
    print("✅ HuggingFace initialized")
except Exception as e:
    print(f"❌ HuggingFace init failed: {e}")
    traceback.print_exc()

print("7. Initializing Agent...")
try:
    agent = Agent(
        name="Pesquisador Automotivo",
        model=model,
        tools=[tools],
        instructions="Teste",
    )
    print("✅ Agent initialized")
except Exception as e:
    print(f"❌ Agent init failed: {e}")
    traceback.print_exc()
