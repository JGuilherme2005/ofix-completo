import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Add current directory to sys.path
sys.path.append(os.getcwd())

from matias_agno.main import app

print("Registered Routes:")
for route in app.routes:
    methods = getattr(route, "methods", "None")
    print(f"{methods} {route.path}")
