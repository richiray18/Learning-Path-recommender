import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mentora Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Database
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/mentora_db",
        description="PostgreSQL Connection URL"
    )
    
    # Security / JWT
    JWT_SECRET_KEY: str = Field(
        default="mentora_super_secret_jwt_key_change_in_production_987654321",
        description="Secret key for JWT generation"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # AI / Gemini
    GEMINI_API_KEY: str = Field(
        default="",
        description="Google Gemini API Key"
    )
    
    # CORS
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        description="Comma-separated CORS origins"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
