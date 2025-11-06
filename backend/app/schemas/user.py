"""
Schemas para Usuarios

Define la estructura de datos para usuarios:
- Registro y autenticación
- Perfil de usuario
- Validación de credenciales
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """
    Schema base de usuario con campos comunes
    """
    email: EmailStr = Field(
        ...,
        description="Email del usuario (debe ser válido)",
        examples=["usuario@example.com"]
    )
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        pattern="^[a-zA-Z0-9_-]+$",
        description="Nombre de usuario (solo letras, números, guiones y guión bajo)",
        examples=["juan_perez"]
    )
    full_name: Optional[str] = Field(
        None,
        max_length=100,
        description="Nombre completo del usuario",
        examples=["Juan Pérez"]
    )


class UserCreate(UserBase):
    """
    Schema para registrar un nuevo usuario
    Incluye el campo de contraseña
    """
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Contraseña (mínimo 8 caracteres)",
        examples=["SecureP@ssw0rd"]
    )


class UserUpdate(BaseModel):
    """
    Schema para actualizar información del usuario
    Todos los campos son opcionales
    """
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=8)


class UserResponse(UserBase):
    """
    Schema para respuesta de usuario
    NO incluye la contraseña por seguridad
    """
    id: int = Field(..., description="ID único del usuario")
    is_active: bool = Field(default=True, description="Estado de la cuenta")
    is_admin: bool = Field(default=False, description="¿Es administrador?")
    created_at: datetime = Field(..., description="Fecha de registro")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "juan@example.com",
                "username": "juan_perez",
                "full_name": "Juan Pérez",
                "is_active": True,
                "is_admin": False,
                "created_at": "2025-11-05T10:30:00"
            }
        }


class UserLogin(BaseModel):
    """
    Schema para login de usuario
    """
    username: str = Field(
        ...,
        description="Nombre de usuario o email",
        examples=["juan_perez"]
    )
    password: str = Field(
        ...,
        description="Contraseña del usuario"
    )


class Token(BaseModel):
    """
    Schema para respuesta de autenticación JWT
    """
    access_token: str = Field(..., description="Token de acceso JWT")
    token_type: str = Field(default="bearer", description="Tipo de token")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }


class TokenData(BaseModel):
    """
    Schema para datos contenidos en el token JWT
    """
    username: Optional[str] = None
    user_id: Optional[int] = None
