#!/bin/bash
# deploy.sh - Script de deploy para Render

echo "🚀 Preparando deploy para Render..."

# Verificar se estamos no diretório correto
if [ ! -f "main.py" ]; then
    echo "❌ Erro: Execute este script na pasta matias_agno"
    exit 1
fi

# Verificar se git está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório Git..."
    git init
fi

# Adicionar arquivos
echo "📋 Adicionando arquivos..."
git add .

# Commit
echo "💾 Fazendo commit..."
read -p "Digite a mensagem do commit: " commit_message
git commit -m "$commit_message"

# Verificar se remote existe
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Configurando remote..."
    read -p "Digite a URL do seu repositório GitHub: " repo_url
    git remote add origin "$repo_url"
fi

# Push
echo "🚀 Enviando para GitHub..."
git push -u origin main

echo "✅ Deploy preparado!"
echo "📝 Próximos passos:"
echo "1. Acesse https://render.com"
echo "2. Clique em 'New +' → 'Web Service'"
echo "3. Conecte seu repositório GitHub"
echo "4. Use as configurações do DEPLOY_RENDER.md"