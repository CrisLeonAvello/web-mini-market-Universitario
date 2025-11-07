"""
Configuración de la base de datos con SQLAlchemy

Este módulo maneja:
- Conexión a la base de datos (MySQL/PostgreSQL/SQLite)
- Creación de la sesión de base de datos
- Base declarativa para los modelos ORM
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Crear engine de SQLAlchemy
# El engine maneja la conexión pool y la comunicación con la BD
engine = create_engine(
    settings.DATABASE_URL,
    # Opciones para SQLite (comentar si usas MySQL/PostgreSQL)
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    # Pool de conexiones (para producción con MySQL/PostgreSQL)
    pool_pre_ping=True,  # Verifica conexiones antes de usarlas
    echo=False  # True para debug SQL (muestra queries en consola)
)

# Crear SessionLocal class
# Cada instancia será una sesión de base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base declarativa para los modelos ORM
# Todos los modelos heredarán de esta clase
Base = declarative_base()


# Dependency para obtener sesión de BD en FastAPI
def get_db():
    """
    Dependency que proporciona una sesión de base de datos.
    
    Uso en rutas:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    
    La sesión se cierra automáticamente después de la request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Función para crear todas las tablas (útil para desarrollo)
def create_tables():
    """
    Crea todas las tablas en la base de datos.
    
    IMPORTANTE: En producción, usar Alembic migrations en lugar de esto.
    Esta función es útil solo para desarrollo y testing rápido.
    """
    Base.metadata.create_all(bind=engine)


# Función para eliminar todas las tablas (útil para testing)
def drop_tables():
    """
    Elimina todas las tablas de la base de datos.
    
    CUIDADO: Esta función borra TODOS los datos.
    Usar solo en desarrollo/testing.
    """
    Base.metadata.drop_all(bind=engine)
