## 🔑 Variáveis de Ambiente para o Render

Copie e cole estas variáveis no Render:

### Obrigatórias:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ENVIRONMENT=production
PORT=10000
```

### Opcionais (para melhor performance):
```
DEBUG=false
HOST=0.0.0.0
SUPABASE_DB_URL=postgresql://user:password@host:5432/database
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_URI=db://ofx-rbf7i6
LANCEDB_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_TABLE=conhecimento_oficina_v5_completo
LANCEDB_SEARCH_TYPE=hybrid
AGNO_TELEMETRY=false
```

⚠️ **IMPORTANTE**: 
- O Render usa a porta 10000 automaticamente
- Se o Supabase não funcionar, o sistema usará SQLite local automaticamente
- O GROQ_API_KEY é obrigatório para funcionamento
