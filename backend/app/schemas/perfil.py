"""
Schemas Pydantic para Perfil de Usuario
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PerfilUsuarioBase(BaseModel):
    """Schema base para perfil de usuario"""
    telefono: Optional[str] = None
    direccion_completa: Optional[str] = None
    ciudad: Optional[str] = None
    region: Optional[str] = None
    codigo_postal: Optional[str] = None
    biografia: Optional[str] = None
    es_vendedor: bool = True


class PerfilUsuarioCreate(PerfilUsuarioBase):
    """Schema para crear perfil de usuario"""
    foto_perfil: Optional[str] = None
    fecha_nacimiento: Optional[datetime] = None


class PerfilUsuarioUpdate(BaseModel):
    """Schema para actualizar perfil de usuario"""
    foto_perfil: Optional[str] = None
    telefono: Optional[str] = None
    direccion_completa: Optional[str] = None
    ciudad: Optional[str] = None
    region: Optional[str] = None
    codigo_postal: Optional[str] = None
    biografia: Optional[str] = None
    es_vendedor: Optional[bool] = None
    fecha_nacimiento: Optional[datetime] = None


class PerfilUsuarioResponse(PerfilUsuarioBase):
    """Schema para respuesta de perfil de usuario"""
    id_perfil: int
    usuario_id: int
    foto_perfil: Optional[str] = None
    calificacion_vendedor: Optional[float] = 0.0
    total_ventas: int = 0
    fecha_nacimiento: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
