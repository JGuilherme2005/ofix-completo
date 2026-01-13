# deploy.ps1 - Script de deploy para Render (Windows)

Write-Host "🚀 Preparando deploy para Render..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "main.py")) {
    Write-Host "❌ Erro: Execute este script na pasta matias_agno" -ForegroundColor Red
    exit 1
}

# Verificar se git está inicializado
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
}

# Adicionar arquivos
Write-Host "📋 Adicionando arquivos..." -ForegroundColor Blue
git add .

# Commit
$commitMessage = Read-Host "Digite a mensagem do commit"
Write-Host "💾 Fazendo commit..." -ForegroundColor Blue
git commit -m $commitMessage

# Verificar se remote existe
try {
    git remote get-url origin 2>$null
} catch {
    Write-Host "🔗 Configurando remote..." -ForegroundColor Yellow
    $repoUrl = Read-Host "Digite a URL do seu repositório GitHub"
    git remote add origin $repoUrl
}

# Push
Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "✅ Deploy preparado!" -ForegroundColor Green
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse https://render.com" -ForegroundColor White
Write-Host "2. Clique em 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Conecte seu repositório GitHub" -ForegroundColor White
Write-Host "4. Use as configurações do DEPLOY_RENDER.md" -ForegroundColor White