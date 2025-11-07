"""
Modelo ORM para Producto

Mapea la tabla 'productos' de la base de datos.
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Producto(Base):
    """
    Modelo de Producto (mapea a tabla 'productos')
    
    Relaciones:
    - productos (1) → items_carrito (N)
    """
    __tablename__ = "productos"
    
    # Clave primaria
    id_producto = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Información básica
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    
    # Precio y stock
    precio = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    
    # Categorización
    categoria = Column(String(100), nullable=False, index=True)
    
    # Multimedia
    imagen = Column(Text, nullable=True)
    
    # Calificaciones (normalizadas)
    rating_rate = Column(Numeric(3, 2), nullable=True)
    rating_count = Column(Integer, default=0, nullable=True)
    
    # Control
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Constraints a nivel de tabla
    __table_args__ = (
        CheckConstraint('precio > 0', name='ck_productos_precio_positivo'),
        CheckConstraint('stock >= 0', name='ck_productos_stock_no_negativo'),
        CheckConstraint(
            'rating_rate IS NULL OR (rating_rate >= 0 AND rating_rate <= 5)',
            name='ck_productos_rating_range'
        ),
        CheckConstraint('rating_count >= 0', name='ck_productos_rating_count_no_negativo'),
    )
    
    # Relaciones ORM
    items_carrito = relationship(
        "ItemCarrito",
        back_populates="producto",
        lazy="dynamic"
    )
    
    def __repr__(self):
        return f"<Producto(id={self.id_producto}, titulo='{self.titulo}', precio={self.precio})>"
    
    @property
    def rating(self):
        """Propiedad que retorna rating como dict (compatible con schema Pydantic)"""
        if self.rating_rate is not None:
            return {
                "rate": float(self.rating_rate),
                "count": self.rating_count or 0
            }
        return None
