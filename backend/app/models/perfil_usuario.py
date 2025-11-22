"""
Modelo ORM para Perfil de Usuario

Mapea la tabla 'perfiles_usuario' de la base de datos.
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class PerfilUsuario(Base):
    """
    Modelo de Perfil de Usuario (mapea a tabla 'perfiles_usuario')
    
    Relaciones:
    - perfiles_usuario (1) → usuarios (1)
    """
    __tablename__ = "perfiles_usuario"
    
    # Clave primaria
    id_perfil = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Relación con usuario (uno a uno)
    usuario_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), unique=True, nullable=False)
    
    # Información de perfil
    foto_perfil = Column(Text, nullable=True)  # URL de la imagen
    telefono = Column(String(20), nullable=True)
    direccion_completa = Column(Text, nullable=True)
    ciudad = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    codigo_postal = Column(String(20), nullable=True)
    biografia = Column(Text, nullable=True)
    
    # Como vendedor
    es_vendedor = Column(Boolean, default=True, nullable=False)
    calificacion_vendedor = Column(Numeric(3, 2), default=0.0, nullable=True)  # 0.00 a 5.00
    total_ventas = Column(Integer, default=0, nullable=False)
    
    # Fechas
    fecha_nacimiento = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="perfil")
