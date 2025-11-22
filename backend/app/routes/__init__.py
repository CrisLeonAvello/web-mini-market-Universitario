"""
Rutas y endpoints de la API
"""

from app.routes import auth, productos, users, ventas, valoraciones, favoritos

__all__ = [
    "auth",
    "productos", 
    "users",
    "ventas",
    "valoraciones",
    "favoritos"
]
