"""
FastAPI - Web Mini Market Universitario Backend

Este es el punto de entrada principal de la API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="🎓 StudiMarket API",
    description="""
## 🚀 API del Mini Market Universitario

### 📖 Descripción
API REST completa para una plataforma de e-commerce universitario con autenticación JWT, gestión de productos y carrito de compras.

### 🔧 Características Principales
- **Autenticación JWT** con registro y login
- **Gestión de Productos** con base de datos MySQL
- **Carrito de Compras** funcional
- **Sistema de Usuarios** con roles (admin/cliente)
- **Precios en CLP** (Pesos Chilenos)

### 🔐 Autenticación
Para usar endpoints protegidos:
1. Registra una cuenta en `/auth/register`
2. Inicia sesión en `/auth/login`
3. Usa el token JWT en el header: `Authorization: Bearer <token>`

### 👤 Cuentas de Prueba
- **Admin**: `admin@admin.com` / `admin123`
- **Usuario Test**: `test@user.com` / `test123`

### 🛠️ Tecnologías
- **FastAPI** con Python 3.11
- **MySQL 8.0** para persistencia
- **JWT** para autenticación
- **SQLAlchemy** como ORM
- **Docker** para contenedorización
    """,
    version="1.0.0",
    contact={
        "name": "Equipo StudiMarket",
        "url": "https://github.com/CrisLeonAvello/web-mini-market-Universitario",
    },
    license_info={
        "name": "MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS
# En desarrollo, permitir cualquier origen para comunicación entre contenedores
origins = [
    "http://localhost:5173",  # Frontend desde host
    "http://localhost:3000",  # Frontend alternativo
    "http://127.0.0.1:5173",
    "http://frontend:5173",   # Frontend desde contenedor Docker
    "*",                      # Permitir cualquier origen en desarrollo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Permitir todos los orígenes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas básicas
@app.get("/")
async def root():
    """
    Endpoint raíz de la API
    """
    return {
        "message": "Web Mini Market API",
        "version": "0.1.0",
        "docs": "/docs",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

# Importar routers
from app.routes.examples import router_cart, router_users
from app.routes.productos import router as router_productos_real
from app.routes.auth import router as router_auth

# 🔐 Autenticación JWT
app.include_router(
    router_auth, 
    prefix="/api/auth", 
    tags=["🔐 Autenticación"],
    responses={
        401: {"description": "No autorizado"},
        422: {"description": "Error de validación"}
    }
)

# 🛍️ Productos (Español)
app.include_router(
    router_productos_real, 
    prefix="/api/productos", 
    tags=["🛍️ Productos (ES)"],
    responses={
        404: {"description": "Producto no encontrado"},
        422: {"description": "Error de validación"}
    }
)

# 🛍️ Products (English)
app.include_router(
    router_productos_real, 
    prefix="/api/products", 
    tags=["🛍️ Products (EN)"],
    responses={
        404: {"description": "Product not found"},
        422: {"description": "Validation error"}
    }
)

# 🛒 Carrito de Compras (Ejemplos)
app.include_router(
    router_cart, 
    prefix="/api/carrito", 
    tags=["🛒 Carrito (Ejemplos)"],
    responses={
        404: {"description": "Carrito no encontrado"}
    }
)

app.include_router(
    router_cart, 
    prefix="/api/cart", 
    tags=["🛒 Cart (Examples)"],
    responses={
        404: {"description": "Cart not found"}
    }
)

# 👥 Usuarios (Ejemplos)
app.include_router(
    router_users, 
    prefix="/api/usuarios", 
    tags=["👥 Usuarios (Ejemplos)"],
    responses={
        404: {"description": "Usuario no encontrado"}
    }
)

app.include_router(
    router_users, 
    prefix="/api/users", 
    tags=["👥 Users (Examples)"],
    responses={
        404: {"description": "User not found"}
    }
)
