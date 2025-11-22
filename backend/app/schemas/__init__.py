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

from .perfil import (
    PerfilUsuarioBase,
    PerfilUsuarioCreate,
    PerfilUsuarioUpdate,
    PerfilUsuarioResponse
)

from .venta import (
    VentaBase,
    VentaCreate,
    VentaUpdate,
    VentaResponse,
    VentaDetalle,
    EstadoVentaEnum
)

from .valoracion import (
    ValoracionBase,
    ValoracionCreate,
    ValoracionResponse,
    ValoracionDetalle,
    TipoEvaluacionEnum
)

from .favorito import (
    FavoritoCreate,
    FavoritoResponse,
    FavoritoDetalle
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
    # Perfil schemas
    "PerfilUsuarioBase",
    "PerfilUsuarioCreate",
    "PerfilUsuarioUpdate",
    "PerfilUsuarioResponse",
    # Venta schemas
    "VentaBase",
    "VentaCreate",
    "VentaUpdate",
    "VentaResponse",
    "VentaDetalle",
    "EstadoVentaEnum",
    # Valoracion schemas
    "ValoracionBase",
    "ValoracionCreate",
    "ValoracionResponse",
    "ValoracionDetalle",
    "TipoEvaluacionEnum",
    # Favorito schemas
    "FavoritoCreate",
    "FavoritoResponse",
    "FavoritoDetalle",
]
