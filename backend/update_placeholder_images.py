"""
Script para actualizar las URLs de imágenes placeholder
"""
from app.database import SessionLocal
from app.models.producto import Producto

def update_placeholder_images():
    db = SessionLocal()
    try:
        # Buscar productos con imágenes de via.placeholder
        productos = db.query(Producto).filter(
            Producto.imagen.like('%via.placeholder%')
        ).all()
        
        print(f'Encontrados {len(productos)} productos con placeholder')
        
        for producto in productos:
            # Cambiar a placehold.co que es más confiable
            # O usar una imagen por defecto
            producto.imagen = f'https://placehold.co/400x400/7c3aed/ffffff/png?text={producto.titulo[:15].replace(" ", "+")}'
            print(f'Actualizado: {producto.titulo}')
        
        db.commit()
        print(f'✅ {len(productos)} productos actualizados correctamente')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    update_placeholder_images()
