"""
Script para inicializar la base de datos SQLite con las tablas necesarias
"""
from app.database import engine, Base
from app.models.usuario import Usuario
from app.models.producto import Producto
from app.models.favorito import Favorito
from app.models.venta import Venta

def init_db():
    """Crear todas las tablas en la base de datos"""
    print("🔧 Creando tablas en la base de datos...")
    
    # Esto creará todas las tablas definidas en los modelos
    Base.metadata.create_all(bind=engine)
    
    print("✅ Tablas creadas exitosamente!")
    print("\nTablas disponibles:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")

if __name__ == "__main__":
    init_db()
