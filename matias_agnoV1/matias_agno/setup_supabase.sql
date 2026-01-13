-- Habilitar extensão pgvector para busca vetorial
CREATE EXTENSION IF NOT EXISTS vector;

-- Verificar se a extensão foi instalada
SELECT * FROM pg_extension WHERE extname = 'vector';