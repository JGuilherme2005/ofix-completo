try:
    from agno.os.interfaces.agui import AGUI
    print("agno.os.interfaces.agui.AGUI found")
except ImportError as e:
    print(f"agno.os.interfaces.agui.AGUI NOT found: {e}")

try:
    from agno.os import AgentOS
    print("agno.os.AgentOS found")
except ImportError as e:
    print(f"agno.os.AgentOS NOT found: {e}")
