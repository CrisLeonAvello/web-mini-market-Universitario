#!/usr/bin/env python3
"""
Script para actualizar las URLs de imágenes de productos con mejores imágenes
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy import create_engine, text
from app.config import settings

def update_product_images():
    """Actualiza las URLs de imágenes de los productos con imágenes funcionales"""
    
    # Conexión a la base de datos
    database_url = settings.DATABASE_URL
    engine = create_engine(database_url)
    
    # Nuevas URLs de imágenes (usando Unsplash que es más confiable)
    image_updates = [
        {
            'id': 1,
            'image': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 2, 
            'image': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 3,
            'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 4,
            'image': 'https://images.unsplash.com/photo-1558618047-b70dd0b35852?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 5,
            'image': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 6,
            'image': 'https://images.unsplash.com/photo-1606521334935-12c50c7e753e?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 7,
            'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 8,
            'image': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 9,
            'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&crop=center'
        },
        {
            'id': 10,
            'image': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&crop=center'
        }
    ]
    
    try:
        with engine.connect() as connection:
            print("🔄 Actualizando URLs de imágenes...")
            
            for update in image_updates:
                query = text("""
                    UPDATE productos 
                    SET imagen = :image 
                    WHERE id_producto = :id
                """)
                
                connection.execute(query, {
                    'id': update['id'],
                    'image': update['image']
                })
                print(f"✅ Actualizada imagen para producto ID {update['id']}")
            
            connection.commit()
            print("🎉 ¡Todas las imágenes han sido actualizadas exitosamente!")
            
    except Exception as e:
        print(f"❌ Error actualizando imágenes: {e}")
        raise

if __name__ == "__main__":
    update_product_images()