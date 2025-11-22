"""
Schemas Pydantic para Ventas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class EstadoVentaEnum(str, Enum):
    """Estados de venta"""
    PENDIENTE = "pendiente"
    PAGADO = "pagado"
    ENVIADO = "enviado"
    COMPLETADO = "completado"
    CANCELADO = "cancelado"


class VentaBase(BaseModel):
    """Schema base para venta"""
    cantidad: int = Field(gt=0, description="Cantidad de productos")
    precio_unitario: float = Field(gt=0, description="Precio por unidad")
    metodo_pago: Optional[str] = None


class VentaCreate(VentaBase):
    """Schema para crear venta"""
    producto_id: int
    # comprador_id y vendedor_id se obtienen del contexto


class VentaUpdate(BaseModel):
    """Schema para actualizar venta"""
    estado_venta: Optional[EstadoVentaEnum] = None
    fecha_entrega_real: Optional[datetime] = None
    calificacion_comprador: Optional[int] = Field(None, ge=1, le=5)


class VentaResponse(VentaBase):
    """Schema para respuesta de venta"""
    id_venta: int
    comprador_id: int
    vendedor_id: int
    producto_id: int
    precio_total: float
    comision_plataforma: float
    estado_venta: EstadoVentaEnum
    fecha_venta: datetime
    fecha_entrega_estimada: Optional[datetime] = None
    fecha_entrega_real: Optional[datetime] = None
    calificacion_comprador: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VentaDetalle(VentaResponse):
    """Schema detallado con información de comprador, vendedor y producto"""
    comprador_nombre: str
    comprador_email: str
    vendedor_nombre: str
    vendedor_email: str
    producto_titulo: str
    producto_imagen: Optional[str] = None
