from agno.os import AgentOS
import inspect

methods = [m for m in dir(AgentOS) if not m.startswith('_')]
print(f"AgentOS methods: {methods}")
