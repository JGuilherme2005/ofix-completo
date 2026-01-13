import os

env_path = 'matias_agno/.env'

try:
    # Try reading as UTF-16 (PowerShell default)
    with open(env_path, 'r', encoding='utf-16') as f:
        content = f.read()
    print("Read as UTF-16")
    
    # Save back as UTF-8
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Converted to UTF-8")

except UnicodeError:
    print("Not UTF-16, checking for null bytes...")
    # If not UTF-16, maybe it's mixed or has null bytes
    with open(env_path, 'rb') as f:
        binary = f.read()
    
    clean_text = binary.replace(b'\x00', b'').decode('utf-8', errors='ignore')
    
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(clean_text)
    print("Removed null bytes and saved as UTF-8")
except Exception as e:
    print(f"Error: {e}")
