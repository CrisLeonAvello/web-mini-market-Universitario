"""
FastAPI - Web Mini Market Universitario Backend

Este es el punto de entrada principal de la API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Web Mini Market API",
    description="API para el e-commerce universitario",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS
origins = [
    "http://localhost:5173",  # Frontend Vite
    "http://localhost:3000",  # Frontend alternativo
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

# Aquí se importarán los routers cuando se creen
# from app.routes import products, cart, auth
# app.include_router(products.router, prefix="/api/products", tags=["products"])
# app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
# app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
