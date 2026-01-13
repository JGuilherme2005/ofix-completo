# config.py - Configurações para diferentes ambientes
import os
from typing import Optional

class Settings:
    # Ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # API Keys
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    # Database
    SUPABASE_DB_URL: Optional[str] = os.getenv("SUPABASE_DB_URL")
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")  # Heroku Postgres
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Validação
    def validate(self):
        """Valida configurações essenciais"""
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY é obrigatório")
        
        # Em produção, precisa de pelo menos uma conexão de banco
        if self.ENVIRONMENT == "production":
            if not (self.SUPABASE_DB_URL or self.DATABASE_URL):
                print("⚠️  Warning: Nenhuma URL de banco configurada. Usando fallback local.")
    
    @property
    def db_url(self) -> Optional[str]:
        """Retorna a URL do banco prioritizando DATABASE_URL (Heroku)"""
        return self.DATABASE_URL or self.SUPABASE_DB_URL

settings = Settings()