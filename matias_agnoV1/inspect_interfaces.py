import agno.os.interfaces
import pkgutil

print(f"agno.os.interfaces path: {agno.os.interfaces.__path__}")
print("Submodules in agno.os.interfaces:")
for loader, module_name, is_pkg in pkgutil.walk_packages(agno.os.interfaces.__path__):
    print(module_name)
