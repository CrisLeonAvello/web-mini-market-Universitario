"""
Schemas Pydantic para Favoritos
"""

from pydantic import BaseModel
from datetime import datetime


class FavoritoCreate(BaseModel):
    """Schema para crear favorito"""
    producto_id: int


class FavoritoResponse(BaseModel):
    """Schema para respuesta de favorito"""
    id_favorito: int
    usuario_id: int
    producto_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FavoritoDetalle(FavoritoResponse):
    """Schema detallado con información del producto"""
    producto_titulo: str
    producto_precio: int
    producto_imagen: str
    producto_categoria: str
    vendedor_nombre: str
