"""
Modelo ORM para Valoración

Mapea la tabla 'valoraciones' de la base de datos.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class TipoEvaluacion(str, enum.Enum):
    """Tipos de evaluación"""
    VENDEDOR = "vendedor"
    COMPRADOR = "comprador"


class Valoracion(Base):
    """
    Modelo de Valoración (mapea a tabla 'valoraciones')
    
    Relaciones:
    - valoraciones (N) → ventas (1)
    - valoraciones (N) → usuarios (1) [evaluador]
    - valoraciones (N) → usuarios (1) [evaluado]
    """
    __tablename__ = "valoraciones"
    
    # Clave primaria
    id_valoracion = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Relaciones
    venta_id = Column(Integer, ForeignKey('ventas.id_venta', ondelete='CASCADE'), nullable=False, index=True)
    evaluador_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), nullable=False, index=True)
    evaluado_id = Column(Integer, ForeignKey('usuarios.id_usuario', ondelete='CASCADE'), nullable=False, index=True)
    
    # Información de la valoración
    tipo_evaluacion = Column(SQLEnum(TipoEvaluacion), nullable=False)
    calificacion = Column(Integer, nullable=False)  # 1-5
    comentario = Column(Text, nullable=True)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Constraints
    __table_args__ = (
        CheckConstraint('calificacion >= 1 AND calificacion <= 5', name='ck_valoracion_rango'),
    )
    
    # Relaciones
    venta = relationship("Venta", back_populates="valoraciones")
    evaluador = relationship("Usuario", foreign_keys=[evaluador_id], back_populates="valoraciones_dadas")
    evaluado = relationship("Usuario", foreign_keys=[evaluado_id], back_populates="valoraciones_recibidas")
