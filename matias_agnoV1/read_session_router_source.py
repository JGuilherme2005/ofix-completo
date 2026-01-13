import inspect
from agno.os.routers import session
import os

print(f"File: {session.__file__}")
# Read the file content
with open(session.__file__, 'r') as f:
    print(f.read())
