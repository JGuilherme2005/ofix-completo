try:
    import ddgs
    print("✅ import ddgs successful")
except ImportError as e:
    print(f"❌ import ddgs failed: {e}")

try:
    import duckduckgo_search
    print("✅ import duckduckgo_search successful")
    print(f"Version: {duckduckgo_search.__version__}")
except ImportError as e:
    print(f"❌ import duckduckgo_search failed: {e}")
