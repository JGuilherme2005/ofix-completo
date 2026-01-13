from agno.os.routers.session import session
import os

print(f"File: {session.__file__}")
with open(session.__file__, 'r') as f:
    print(f.read())
