"""
Schemas para Carrito de Compras

Define la estructura de datos para el carrito:
- Items del carrito
- Operaciones de agregar/actualizar/eliminar
- Respuestas del carrito completo
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class CartItemBase(BaseModel):
    """
    Schema base para un item del carrito
    """
    product_id: int = Field(..., gt=0, description="ID del producto")
    quantity: int = Field(
        ..., 
        ge=1, 
        description="Cantidad del producto (mínimo 1)",
        examples=[2]
    )


class CartItemCreate(CartItemBase):
    """
    Schema para agregar un item al carrito
    """
    pass


class CartItemUpdate(BaseModel):
    """
    Schema para actualizar cantidad de un item
    """
    quantity: int = Field(
        ..., 
        ge=1,
        description="Nueva cantidad del producto"
    )


class CartItemResponse(CartItemBase):
    """
    Schema para respuesta de un item del carrito
    Incluye información del producto
    """
    id: int = Field(..., description="ID del item en el carrito")
    product_title: str = Field(..., description="Nombre del producto")
    product_price: float = Field(..., description="Precio unitario del producto")
    product_image: Optional[str] = Field(None, description="URL de la imagen")
    subtotal: float = Field(..., description="Subtotal (precio × cantidad)")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "product_id": 5,
                "product_title": "Laptop Dell XPS",
                "product_price": 999.99,
                "product_image": "https://example.com/laptop.jpg",
                "quantity": 2,
                "subtotal": 1999.98
            }
        }


class CartResponse(BaseModel):
    """
    Schema para respuesta del carrito completo
    """
    user_id: int = Field(..., description="ID del usuario")
    items: List[CartItemResponse] = Field(..., description="Items en el carrito")
    total_items: int = Field(..., description="Cantidad total de items")
    subtotal: float = Field(..., description="Suma de todos los items")
    tax: float = Field(default=0.0, description="Impuestos")
    shipping: float = Field(default=0.0, description="Costo de envío")
    total: float = Field(..., description="Total a pagar (subtotal + tax + shipping)")
    created_at: datetime = Field(..., description="Fecha de creación del carrito")
    updated_at: datetime = Field(..., description="Última actualización")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "items": [
                    {
                        "id": 1,
                        "product_id": 5,
                        "product_title": "Laptop Dell XPS",
                        "product_price": 999.99,
                        "quantity": 1,
                        "subtotal": 999.99
                    },
                    {
                        "id": 2,
                        "product_id": 8,
                        "product_title": "Mouse Logitech",
                        "product_price": 29.99,
                        "quantity": 2,
                        "subtotal": 59.98
                    }
                ],
                "total_items": 3,
                "subtotal": 1059.97,
                "tax": 84.80,
                "shipping": 15.00,
                "total": 1159.77,
                "created_at": "2025-11-05T10:00:00",
                "updated_at": "2025-11-05T15:30:00"
            }
        }


class CartClearResponse(BaseModel):
    """
    Schema para respuesta al vaciar el carrito
    """
    message: str = Field(..., examples=["Carrito vaciado exitosamente"])
    items_removed: int = Field(..., description="Cantidad de items eliminados")
