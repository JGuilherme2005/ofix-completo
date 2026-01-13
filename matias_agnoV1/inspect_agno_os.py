import agno.os
import pkgutil
import inspect

print(f"agno.os path: {agno.os.__path__}")
print("Submodules in agno.os:")
for loader, module_name, is_pkg in pkgutil.walk_packages(agno.os.__path__):
    print(module_name)
    
print("\nClasses in agno.os:")
for name, obj in inspect.getmembers(agno.os):
    if inspect.isclass(obj):
        print(name)
