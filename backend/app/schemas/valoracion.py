"""
Schemas Pydantic para Valoraciones
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class TipoEvaluacionEnum(str, Enum):
    """Tipos de evaluación"""
    VENDEDOR = "vendedor"
    COMPRADOR = "comprador"


class ValoracionBase(BaseModel):
    """Schema base para valoración"""
    calificacion: int = Field(ge=1, le=5, description="Calificación de 1 a 5")
    comentario: Optional[str] = None


class ValoracionCreate(ValoracionBase):
    """Schema para crear valoración"""
    venta_id: int
    evaluado_id: int
    tipo_evaluacion: TipoEvaluacionEnum


class ValoracionResponse(ValoracionBase):
    """Schema para respuesta de valoración"""
    id_valoracion: int
    venta_id: int
    evaluador_id: int
    evaluado_id: int
    tipo_evaluacion: TipoEvaluacionEnum
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ValoracionDetalle(ValoracionResponse):
    """Schema detallado con información del evaluador"""
    evaluador_nombre: str
    evaluador_foto: Optional[str] = None
    producto_titulo: str
