## 🔑 Variáveis de Ambiente para o Render

Copie e cole estas variáveis no Render:

### Obrigatórias:
```
GROQ_API_KEY=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
ENVIRONMENT=production
PORT=10000
```

### Opcionais (para melhor performance):
```
DEBUG=false
HOST=0.0.0.0
SUPABASE_DB_URL=postgresql://postgres:SsTrMNRQNOd7LuCI@db.lazgkhqdsvsrdbslzgoh.supabase.co:5432/postgres
HF_TOKEN=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
AGNO_TELEMETRY=false
```

⚠️ **IMPORTANTE**: 
- O Render usa a porta 10000 automaticamente
- Se o Supabase não funcionar, o sistema usará SQLite local automaticamente
- O GROQ_API_KEY é obrigatório para funcionamento