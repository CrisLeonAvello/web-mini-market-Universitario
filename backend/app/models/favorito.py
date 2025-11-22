"""
Modelo ORM para Favorito/Wishlist

Mapea la tabla 'favoritos' de la base de datos.
"""

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Favorito(Base):
    """
    Modelo de Favorito (mapea a tabla 'favoritos')
    
    Relaciones:
    - favoritos (N) → usuarios (1)
    - favoritos (N) → productos (1)
    """
    __tablename__ = "favoritos"
    
    # Clave primaria
    id_favorito = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Relaciones
    usuario_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey('productos.id_producto', ondelete='CASCADE'), nullable=False, index=True)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Constraints: Un usuario no puede tener el mismo producto dos veces en favoritos
    __table_args__ = (
        UniqueConstraint('usuario_id', 'producto_id', name='uq_usuario_producto'),
    )
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="favoritos")
    producto = relationship("Producto", back_populates="favoritos")
