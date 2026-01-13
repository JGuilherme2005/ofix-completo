import inspect
try:
    from agno.os.routers import session
    print("Session router module found.")
    for name, obj in inspect.getmembers(session):
        if hasattr(obj, "methods"): # APIRoute-like
             print(f"Route in module: {name}")
except ImportError:
    print("agno.os.routers.session not found.")

from agno.os.routers import router
print(f"\nMain OS Router keys: {dir(router)}")
