FROM python:3.10-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY matias_agno/requirements.txt requirements.txt

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fonte
COPY . .

# Expor portas (Render usa variável PORT, mas documentamos aqui)
EXPOSE 7777

# Comando de inicialização
CMD ["python", "serve_agno.py"]
