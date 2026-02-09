# Variáveis de Ambiente para Render
# Copie e cole essas variáveis no Render Dashboard -> Environment Variables

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxx
LANCEDB_URI=db://ofx-rbf7i6
LANCEDB_TABLE=conhecimento_oficina_v5_completo
LANCEDB_SEARCH_TYPE=hybrid
# Optional (strict mode): if true, the service fails to start when knowledge is not configured.
# LANCEDB_REQUIRED=true
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
HOST=0.0.0.0

# Opcional (manter apenas se você usar)
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AGNO_MONITORING_KEY=ag-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AGNO_TELEMETRY=false
