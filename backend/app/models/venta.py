"""
Modelo ORM para Venta

Mapea la tabla 'ventas' de la base de datos.
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class EstadoVenta(str, enum.Enum):
    """Estados posibles de una venta"""
    PENDIENTE = "pendiente"
    PAGADO = "pagado"
    ENVIADO = "enviado"
    COMPLETADO = "completado"
    CANCELADO = "cancelado"


class Venta(Base):
    """
    Modelo de Venta (mapea a tabla 'ventas')
    
    Relaciones:
    - ventas (N) → usuarios (1) [comprador]
    - ventas (N) → usuarios (1) [vendedor]
    - ventas (N) → productos (1)
    - ventas (1) → valoraciones (N)
    """
    __tablename__ = "ventas"
    
    # Clave primaria
    id_venta = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Relaciones
    comprador_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), nullable=False, index=True)
    vendedor_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey('productos.id_producto', ondelete='CASCADE'), nullable=False, index=True)
    
    # Información de la venta
    cantidad = Column(Integer, default=1, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    precio_total = Column(Numeric(10, 2), nullable=False)
    comision_plataforma = Column(Numeric(10, 2), default=0.0, nullable=False)
    
    # Estado y método
    estado_venta = Column(SQLEnum(EstadoVenta), default=EstadoVenta.PENDIENTE, nullable=False, index=True)
    metodo_pago = Column(String(50), nullable=True)  # "tarjeta", "transferencia", etc.
    
    # Fechas
    fecha_venta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_entrega_estimada = Column(DateTime, nullable=True)
    fecha_entrega_real = Column(DateTime, nullable=True)
    
    # Calificación
    calificacion_comprador = Column(Integer, nullable=True)  # 1-5, dada por el vendedor al comprador
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    comprador = relationship("Usuario", foreign_keys=[comprador_id], back_populates="compras")
    vendedor = relationship("Usuario", foreign_keys=[vendedor_id], back_populates="ventas")
    producto = relationship("Producto", back_populates="ventas")
    valoraciones = relationship("Valoracion", back_populates="venta", cascade="all, delete-orphan")
