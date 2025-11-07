"""
Modelo ORM para Carrito

Mapea la tabla 'carritos' de la base de datos.
"""

from sqlalchemy import Column, Integer, Numeric, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Carrito(Base):
    """
    Modelo de Carrito (mapea a tabla 'carritos')
    
    Relaciones:
    - usuarios (1) ← carritos (N)
    - carritos (1) → items_carrito (N)
    """
    __tablename__ = "carritos"
    
    # Clave primaria
    id_carrito = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign key a usuarios
    usuario_id = Column(
        Integer,
        ForeignKey('usuarios.id_usuario', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False,
        index=True
    )
    
    # Costos adicionales
    impuesto = Column(Numeric(10, 2), default=0.00, nullable=False)
    envio = Column(Numeric(10, 2), default=0.00, nullable=False)
    
    # Control
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relaciones ORM
    usuario = relationship(
        "Usuario",
        back_populates="carritos"
    )
    
    items = relationship(
        "ItemCarrito",
        back_populates="carrito",
        cascade="all, delete-orphan",  # Borrar carrito → borrar items
        lazy="dynamic"  # Cargar items on-demand
    )
    
    # Índice único: un usuario solo puede tener un carrito activo
    __table_args__ = (
        Index(
            'ux_carritos_usuario_activo',
            'usuario_id',
            unique=True,
            postgresql_where=(is_active == True)  # Índice parcial (solo para PostgreSQL)
        ),
    )
    
    def __repr__(self):
        return f"<Carrito(id={self.id_carrito}, usuario_id={self.usuario_id}, activo={self.is_active})>"
    
    @property
    def subtotal(self):
        """Calcula el subtotal sumando todos los items"""
        return sum(item.subtotal for item in self.items)
    
    @property
    def total(self):
        """Calcula el total (subtotal + impuesto + envío)"""
        from decimal import Decimal
        subtotal_decimal = Decimal(str(self.subtotal))
        impuesto_decimal = Decimal(str(self.impuesto))
        envio_decimal = Decimal(str(self.envio))
        return float(subtotal_decimal + impuesto_decimal + envio_decimal)
    
    @property
    def total_items(self):
        """Cuenta cuántos items tiene el carrito"""
        return self.items.count()
    
    @property
    def total_productos(self):
        """Suma la cantidad total de productos (considerando cantidades)"""
        return sum(item.cantidad for item in self.items)
