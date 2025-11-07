"""
Modelo ORM para ItemCarrito

Mapea la tabla 'items_carrito' de la base de datos.
"""

from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, CheckConstraint, UniqueConstraint, event
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class ItemCarrito(Base):
    """
    Modelo de ItemCarrito (mapea a tabla 'items_carrito')
    
    Relaciones:
    - carritos (1) ← items_carrito (N)
    - productos (1) ← items_carrito (N)
    """
    __tablename__ = "items_carrito"
    
    # Clave primaria
    id_item = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys
    carrito_id = Column(
        Integer,
        ForeignKey('carritos.id_carrito', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False,
        index=True
    )
    
    producto_id = Column(
        Integer,
        ForeignKey('productos.id_producto', ondelete='RESTRICT', onupdate='CASCADE'),
        nullable=False,
        index=True
    )
    
    # Datos del item
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('cantidad >= 1', name='ck_items_cantidad_positiva'),
        CheckConstraint('precio_unitario >= 0', name='ck_items_precio_no_negativo'),
        CheckConstraint('subtotal >= 0', name='ck_items_subtotal_no_negativo'),
        # Unicidad: no permitir duplicados (mismo producto en mismo carrito)
        UniqueConstraint('carrito_id', 'producto_id', name='ux_items_carrito_producto'),
    )
    
    # Relaciones ORM
    carrito = relationship(
        "Carrito",
        back_populates="items"
    )
    
    producto = relationship(
        "Producto",
        back_populates="items_carrito"
    )
    
    def __repr__(self):
        return f"<ItemCarrito(id={self.id_item}, producto_id={self.producto_id}, cantidad={self.cantidad})>"
    
    def calcular_subtotal(self):
        """Calcula y actualiza el subtotal (precio_unitario × cantidad)"""
        self.subtotal = self.precio_unitario * self.cantidad
        return self.subtotal


# Event listener: calcular subtotal automáticamente antes de insertar/actualizar
@event.listens_for(ItemCarrito, 'before_insert')
@event.listens_for(ItemCarrito, 'before_update')
def calcular_subtotal_automatico(mapper, connection, target):
    """
    Trigger de SQLAlchemy que calcula subtotal automáticamente.
    Equivalente al trigger SQL 'tr_items_calcular_subtotal'.
    """
    target.subtotal = target.precio_unitario * target.cantidad
