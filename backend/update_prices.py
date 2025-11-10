"""
Script para actualizar precios a CLP con valores realistas
"""

import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.producto import Producto
from app.database import Base

# Configuración de la base de datos (usar la configuración del contenedor)
DATABASE_URL = "mysql+pymysql://root:rootpassword@db:3306/minimarket_db"

# Precios en CLP (pesos chilenos) - valores enteros sin comas
PRECIOS_CLP = {
    1: 1299990,  # Laptop Dell XPS 15
    2: 59990,    # Mouse Logitech G502
    3: 349990,   # Auriculares Sony WH-1000XM4
    4: 12990,    # Pendrive SanDisk 64GB
    5: 2990,     # Cuaderno Universitario
    6: 4990,     # Set de Bolígrafos BIC
    7: 34990,    # Mochila Escolar
    8: 8990,     # Café Nescafé 200g
    9: 3490,     # Galletas Oreo
    10: 1290     # Agua Mineral 500ml
}

def update_prices():
    """Actualizar precios a CLP"""
    try:
        # Crear conexión
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Crear sesión
        db = SessionLocal()
        
        # Actualizar cada producto
        for product_id, new_price in PRECIOS_CLP.items():
            product = db.query(Producto).filter(Producto.id_producto == product_id).first()
            if product:
                product.precio = new_price
                print(f"Actualizado producto {product_id}: {product.titulo} -> ${new_price} CLP")
            else:
                print(f"Producto {product_id} no encontrado")
        
        # Guardar cambios
        db.commit()
        print("✅ Precios actualizados exitosamente a CLP")
        
        # Cerrar sesión
        db.close()
        
    except Exception as e:
        print(f"❌ Error al actualizar precios: {e}")

if __name__ == "__main__":
    update_prices()