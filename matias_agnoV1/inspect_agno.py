import agno
import pkgutil

print(f"Agno path: {agno.__path__}")
print("Submodules:")
for loader, module_name, is_pkg in pkgutil.walk_packages(agno.__path__):
    print(module_name)
