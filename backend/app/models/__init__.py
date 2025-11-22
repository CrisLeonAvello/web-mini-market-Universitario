"""
Modelos de datos ORM (SQLAlchemy)

Importar todos los modelos aquí para que Alembic los detecte automáticamente.
"""

from .usuario import Usuario
from .producto import Producto, EstadoProducto, CondicionProducto
from .carrito import Carrito
from .item_carrito import ItemCarrito
from .perfil_usuario import PerfilUsuario
from .venta import Venta, EstadoVenta
from .valoracion import Valoracion, TipoEvaluacion
from .favorito import Favorito

# Exportar todos los modelos
__all__ = [
    "Usuario",
    "Producto",
    "EstadoProducto",
    "CondicionProducto",
    "Carrito",
    "ItemCarrito",
    "PerfilUsuario",
    "Venta",
    "EstadoVenta",
    "Valoracion",
    "TipoEvaluacion",
    "Favorito",
]
