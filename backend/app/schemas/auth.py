"""
📋 Esquemas Pydantic para Autenticación

Define los modelos de datos para:
- Registro de usuarios
- Login/logout
- Respuestas de la API
- Tokens JWT
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    """Esquema base para usuarios"""
    email: EmailStr = Field(
        ..., 
        description="Correo electrónico único del usuario",
        example="usuario@example.com"
    )
    name: str = Field(
        ..., 
        min_length=2, 
        max_length=100,
        description="Nombre completo del usuario",
        example="Juan Pérez"
    )

class UserCreate(UserBase):
    """Esquema para crear un nuevo usuario"""
    password: str = Field(
        ..., 
        min_length=6, 
        max_length=100,
        description="Contraseña (mínimo 6 caracteres)",
        example="mipassword123"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "nuevo@usuario.com",
                "name": "Nuevo Usuario",
                "password": "password123"
            }
        }

class UserLogin(BaseModel):
    """Esquema para iniciar sesión"""
    email: EmailStr = Field(
        ..., 
        description="Correo electrónico registrado",
        example="admin@admin.com"
    )
    password: str = Field(
        ..., 
        description="Contraseña del usuario",
        example="admin123"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@admin.com",
                "password": "admin123"
            }
        }

class UserResponse(UserBase):
    """Esquema de respuesta con información del usuario"""
    id: int = Field(
        ..., 
        description="ID único del usuario"
    )
    is_active: bool = Field(
        ..., 
        description="Estado de activación de la cuenta"
    )
    created_at: str = Field(
        ..., 
        description="Fecha de creación de la cuenta (ISO 8601)"
    )
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "usuario@example.com",
                "name": "Juan Pérez",
                "is_active": True,
                "created_at": "2025-11-09T20:30:00"
            }
        }

class Token(BaseModel):
    """Esquema de respuesta para tokens JWT"""
    access_token: str = Field(
        ..., 
        description="Token JWT para autenticación"
    )
    token_type: str = Field(
        default="bearer", 
        description="Tipo de token (siempre 'bearer')"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }

class TokenData(BaseModel):
    """Esquema interno para datos del token"""
    email: Optional[str] = None