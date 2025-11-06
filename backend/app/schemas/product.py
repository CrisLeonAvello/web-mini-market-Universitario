"""
Schemas para Productos

Define la estructura de datos para productos del e-commerce:
- Validación de datos de entrada
- Serialización de respuestas
- Documentación automática en Swagger
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    """
    Schema base de producto con campos comunes
    """
    title: str = Field(
        ..., 
        min_length=1, 
        max_length=200,
        description="Nombre del producto",
        examples=["Laptop Dell XPS 15"]
    )
    description: Optional[str] = Field(
        None,
        max_length=2000,
        description="Descripción detallada del producto"
    )
    price: float = Field(
        ..., 
        gt=0,
        description="Precio del producto (debe ser mayor a 0)",
        examples=[999.99]
    )
    category: str = Field(
        ...,
        description="Categoría del producto",
        examples=["electronics", "jewelery", "men's clothing", "women's clothing"]
    )
    image: Optional[HttpUrl] = Field(
        None,
        description="URL de la imagen del producto"
    )


class ProductCreate(ProductBase):
    """
    Schema para crear un nuevo producto
    Hereda todos los campos de ProductBase
    """
    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad en stock (no puede ser negativo)"
    )


class ProductUpdate(BaseModel):
    """
    Schema para actualizar un producto
    Todos los campos son opcionales
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    image: Optional[HttpUrl] = None
    stock: Optional[int] = Field(None, ge=0)


class ProductResponse(ProductBase):
    """
    Schema para respuesta de producto
    Incluye campos adicionales como ID y timestamps
    """
    id: int = Field(..., description="ID único del producto")
    stock: int = Field(..., description="Cantidad disponible en stock")
    rating: Optional[dict] = Field(
        None,
        description="Calificación del producto",
        examples=[{"rate": 4.5, "count": 120}]
    )
    created_at: datetime = Field(..., description="Fecha de creación")
    updated_at: Optional[datetime] = Field(None, description="Fecha de última actualización")
    
    class Config:
        """
        Configuración del schema
        from_attributes: Permite crear el schema desde modelos ORM
        """
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Laptop Dell XPS 15",
                "description": "Laptop de alta gama con procesador Intel i7",
                "price": 1299.99,
                "category": "electronics",
                "image": "https://example.com/laptop.jpg",
                "stock": 15,
                "rating": {"rate": 4.5, "count": 89},
                "created_at": "2025-11-05T10:30:00",
                "updated_at": "2025-11-05T15:45:00"
            }
        }


class ProductList(BaseModel):
    """
    Schema para lista paginada de productos
    """
    products: List[ProductResponse]
    total: int = Field(..., description="Total de productos")
    page: int = Field(default=1, ge=1, description="Página actual")
    page_size: int = Field(default=10, ge=1, le=100, description="Productos por página")
    total_pages: int = Field(..., description="Total de páginas")
    
    class Config:
        json_schema_extra = {
            "example": {
                "products": [
                    {
                        "id": 1,
                        "title": "Producto 1",
                        "price": 29.99,
                        "category": "electronics",
                        "stock": 10,
                        "created_at": "2025-11-05T10:30:00"
                    }
                ],
                "total": 100,
                "page": 1,
                "page_size": 10,
                "total_pages": 10
            }
        }
