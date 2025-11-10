"""
Schemas - Modelos Pydantic para validación y serialización

Los schemas definen la estructura de datos para:
- Request: Datos que recibe la API
- Response: Datos que devuelve la API
- Validación automática de tipos y valores
"""

from .product import (
    ProductBase,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductList
)

from .cart import (
    CartItemBase,
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse,
    CartResponse
)

from .user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserLogin
)

from .user import (
    Token,
    TokenData
)

__all__ = [
    # Product schemas
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductList",
    # Cart schemas
    "CartItemBase",
    "CartItemCreate",
    "CartItemUpdate",
    "CartItemResponse",
    "CartResponse",
    # User schemas
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserLogin",
    "Token",
    "TokenData",
]
