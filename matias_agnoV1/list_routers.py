import agno.os.routers
import pkgutil

print("Submodules in agno.os.routers:")
for loader, module_name, is_pkg in pkgutil.walk_packages(agno.os.routers.__path__):
    print(module_name)
