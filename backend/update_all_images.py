"""
Script para actualizar las imágenes de TODOS los productos
"""

from app.database import SessionLocal
from app.models.producto import Producto

def update_images():
    db = SessionLocal()
    
    # Mapeo de títulos a imágenes
    images_map = {
        "Laptop Dell XPS 15": "https://via.placeholder.com/400x400/1a1a2e/ffffff?text=Laptop+Dell",
        "Mouse Logitech G502": "https://via.placeholder.com/400x400/1a1a2e/8a2be2?text=Mouse+Gaming",
        "Auriculares Sony WH-1000XM4": "https://via.placeholder.com/400x400/1a1a2e/ff6b35?text=Auriculares",
        "Pendrive SanDisk 64GB": "https://via.placeholder.com/400x400/1a1a2e/00bfff?text=Pendrive",
        "Cuaderno Universitario": "https://via.placeholder.com/400x400/1a1a2e/32cd32?text=Cuaderno",
        "Set de Bolígrafos BIC": "https://via.placeholder.com/400x400/1a1a2e/ffd700?text=Boligrafos",
        "Mochila Escolar": "https://via.placeholder.com/400x400/1a1a2e/ff1493?text=Mochila",
        "Café Nescafé 200g": "https://via.placeholder.com/400x400/1a1a2e/8b4513?text=Cafe",
        "Galletas Oreo": "https://via.placeholder.com/400x400/1a1a2e/000000?text=Galletas",
        "Agua Mineral 500ml": "https://via.placeholder.com/400x400/1a1a2e/00bfff?text=Agua",
    }
    
    print("🖼️  Actualizando imágenes de productos...")
    updated = 0
    
    for titulo, imagen in images_map.items():
        producto = db.query(Producto).filter(Producto.titulo == titulo).first()
        if producto:
            producto.imagen = imagen
            updated += 1
            print(f"   ✅ {titulo}")
    
    db.commit()
    db.close()
    
    print(f"\n✅ {updated} productos actualizados!")

if __name__ == "__main__":
    update_images()
