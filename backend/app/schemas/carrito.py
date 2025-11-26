"""
Schemas de Pydantic para Carrito de Compras
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from decimal import Decimal


# ==================== ITEM CARRITO ====================
class ItemCarritoCreate(BaseModel):
    """Schema para crear un item en el carrito"""
    producto_id: int = Field(..., gt=0, description="ID del producto")
    cantidad: int = Field(default=1, gt=0, le=100, description="Cantidad a agregar")


class ItemCarritoUpdate(BaseModel):
    """Schema para actualizar cantidad de un item"""
    cantidad: int = Field(..., gt=0, le=100, description="Nueva cantidad")


class ProductoEnCarrito(BaseModel):
    """Información básica del producto en el carrito"""
    id_producto: int
    titulo: str
    descripcion: Optional[str]
    precio: float
    stock: int
    categoria: str
    imagen: Optional[str]
    
    class Config:
        from_attributes = True


class ItemCarritoResponse(BaseModel):
    """Schema para respuesta de item en carrito"""
    id_item: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: float
    producto: ProductoEnCarrito
    
    class Config:
        from_attributes = True


# ==================== CARRITO ====================
class CarritoResponse(BaseModel):
    """Schema para respuesta del carrito completo"""
    id_carrito: int
    usuario_id: int
    items: List[ItemCarritoResponse]
    subtotal: float
    impuesto: float
    envio: float
    total: float
    total_items: int
    total_productos: int
    
    class Config:
        from_attributes = True


# ==================== CHECKOUT ====================
class CheckoutRequest(BaseModel):
    """Schema para solicitud de checkout"""
    direccion_envio: str = Field(..., min_length=10, max_length=500, description="Dirección de envío completa")
    metodo_pago: str = Field(..., description="Método de pago (tarjeta, efectivo, transferencia)")
    notas: Optional[str] = Field(None, max_length=500, description="Notas adicionales para el pedido")
    
    @validator('metodo_pago')
    def validar_metodo_pago(cls, v):
        metodos_validos = ['tarjeta', 'efectivo', 'transferencia', 'paypal']
        if v.lower() not in metodos_validos:
            raise ValueError(f'Método de pago debe ser uno de: {", ".join(metodos_validos)}')
        return v.lower()


class CheckoutResponse(BaseModel):
    """Schema para respuesta de checkout exitoso"""
    mensaje: str
    numero_orden: str
    total_ventas: int
    subtotal: float
    impuesto: float
    envio: float
    total: float
    ventas_ids: List[int]
    
    class Config:
        from_attributes = True
