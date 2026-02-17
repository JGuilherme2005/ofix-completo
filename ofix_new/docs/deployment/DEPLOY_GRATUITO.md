# ðŸš€ DEPLOY GRATUITO - PROJETO OFIX

## ðŸ“‹ STATUS ATUAL
- âœ… **Backend**: Render (`https://ofix-backend-r556.onrender.com`)
- ðŸ”„ **Frontend**: Vamos deployar agora!
- ðŸ’° **Custo**: R$ 0,00 (Totalmente gratuito)

---

## ðŸŽ¯ ESCOLHA SUA OPÃ‡ÃƒO DE DEPLOY

### ðŸ¥‡ **OPÃ‡ÃƒO 1: NETLIFY (RECOMENDADA)**

**Por que Netlify?**
- âœ… Mais fÃ¡cil de configurar
- âœ… Deploy automÃ¡tico do GitHub
- âœ… SSL gratuito
- âœ… CDN global
- âœ… 100GB bandwidth/mÃªs grÃ¡tis

**Como deployar:**

1. **Acesse [netlify.com](https://netlify.com)**
2. **FaÃ§a login com GitHub**
3. **Clique "New site from Git"**
4. **Selecione seu repositÃ³rio OFIX**
5. **Configure:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. **Adicione variÃ¡veis de ambiente:**
   ```
   VITE_API_BASE_URL = https://ofix-backend-r556.onrender.com
   ```
7. **Deploy!**

---

### ðŸ¥ˆ **OPÃ‡ÃƒO 2: VERCEL**

**Como deployar:**

1. **Acesse [vercel.com](https://vercel.com)**
2. **FaÃ§a login com GitHub**
3. **Clique "New Project"**
4. **Selecione seu repositÃ³rio**
5. **Framework: Vite**
6. **Adicione env vars:**
   ```
   VITE_API_BASE_URL = https://ofix-backend-r556.onrender.com
   ```

---

### ðŸ¥‰ **OPÃ‡ÃƒO 3: RENDER (FRONTEND)**

**Se quiser tudo na mesma plataforma:**

1. **Acesse [render.com](https://render.com)**
2. **Create New > Static Site**
3. **Conecte GitHub**
4. **Configure:**
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

---

## âš™ï¸ CONFIGURAÃ‡Ã•ES IMPORTANTES

### **Arquivos criados para deploy:**

1. **netlify.toml** (Para Netlify)
2. **vercel.json** (Para Vercel)
3. **render.yaml** (Para Render)

### **VariÃ¡veis de ambiente necessÃ¡rias:**
```env
VITE_API_BASE_URL=https://ofix-backend-r556.onrender.com
```

---

## ðŸš€ PASSO A PASSO COMPLETO

### **1. Commit suas alteraÃ§Ãµes:**
```bash
git add .
git commit -m "feat: configuraÃ§Ã£o para deploy de produÃ§Ã£o"
git push origin main
```

### **2. Escolha uma plataforma acima**

### **3. Configure as variÃ¡veis de ambiente**

### **4. Deploy automÃ¡tico serÃ¡ feito!**

---

## ðŸ”§ CONFIGURAÃ‡ÃƒO DO BACKEND (RENDER)

**Se seu backend ainda nÃ£o estÃ¡ rodando, aqui estÃ£o as configuraÃ§Ãµes:**

### **Backend Settings (Render):**
```
Environment: Node
Build Command: npm install
Start Command: npm start
```

### **Environment Variables:**
```env
NODE_ENV=production
DATABASE_URL=sua-database-url
CORS_ORIGIN=https://seu-frontend.netlify.app
```

---

## ðŸŒ URLS FINAIS

ApÃ³s o deploy, vocÃª terÃ¡:

- **Frontend**: `https://seu-projeto.netlify.app`
- **Backend**: `https://ofix-backend-r556.onrender.com`
- **Custo Total**: **R$ 0,00**

---

## ðŸ†˜ TROUBLESHOOTING

### **Erro CORS:**
No backend, adicione sua URL do frontend:
```javascript
app.use(cors({
  origin: ['https://seu-frontend.netlify.app']
}));
```

### **Erro 404 em rotas:**
Adicione `_redirects` para Netlify:
```
/*    /index.html   200
```

### **Build falha:**
```bash
# Teste local primeiro
npm run build
npm run preview
```

---

## ðŸ“ž PRÃ“XIMOS PASSOS

1. **Escolha Netlify (recomendado)**
2. **Siga o passo a passo**
3. **Em 5 minutos estarÃ¡ no ar!**

**ðŸŽ‰ Seu OFIX ficarÃ¡ disponÃ­vel 24/7 gratuitamente!**