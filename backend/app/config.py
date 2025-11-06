"""
Configuración de la aplicación
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Configuración de la aplicación
    """
    # API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Web Mini Market API"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # Database (MySQL para Docker, SQLite para desarrollo local)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./app.db"  # Fallback a SQLite si no está en Docker
    )
    
    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-here-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
