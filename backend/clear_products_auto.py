"""
Script para limpiar/eliminar todos los productos de la base de datos (modo automático)

Este script elimina:
- Todos los productos
- Items de carrito relacionados
- Valoraciones de productos
- Favoritos de productos
"""

from app.database import SessionLocal
from app.models import Producto, ItemCarrito, Valoracion, Favorito, Venta


def clear_products_auto(db):
    """
    Eliminar todos los productos y datos relacionados automáticamente
    
    Args:
        db: Sesión de base de datos
    """
    print("\n🗑️  Iniciando limpieza de productos...\n")
    
    try:
        # Mostrar estado actual
        print("📊 Estado actual:")
        productos_count = db.query(Producto).count()
        items_count = db.query(ItemCarrito).count()
        valoraciones_count = db.query(Valoracion).filter(
            Valoracion.tipo_evaluacion == "producto"
        ).count()
        favoritos_count = db.query(Favorito).count()
        
        print(f"   - Productos: {productos_count}")
        print(f"   - Items de carrito: {items_count}")
        print(f"   - Valoraciones: {valoraciones_count}")
        print(f"   - Favoritos: {favoritos_count}")
        
        if productos_count == 0:
            print("\n✨ No hay productos para eliminar.")
            return
        
        print("\n🗑️  Eliminando datos...")
        
        # 1. Eliminar items de carrito (dependen de productos)
        if items_count > 0:
            db.query(ItemCarrito).delete()
            print(f"   ✅ {items_count} items de carrito eliminados")
        
        # 2. Eliminar valoraciones de productos
        if valoraciones_count > 0:
            db.query(Valoracion).filter(
                Valoracion.tipo_evaluacion == "producto"
            ).delete()
            print(f"   ✅ {valoraciones_count} valoraciones eliminadas")
        
        # 3. Eliminar favoritos
        if favoritos_count > 0:
            db.query(Favorito).delete()
            print(f"   ✅ {favoritos_count} favoritos eliminados")
        
        # 4. Eliminar todos los productos
        if productos_count > 0:
            db.query(Producto).delete()
            print(f"   ✅ {productos_count} productos eliminados")
        
        # Confirmar cambios
        db.commit()
        
        print("\n✨ Limpieza completada exitosamente!")
        print("\n📊 Estado final:")
        print(f"   - Productos: {db.query(Producto).count()}")
        print(f"   - Items de carrito: {db.query(ItemCarrito).count()}")
        print(f"   - Valoraciones: {db.query(Valoracion).filter(Valoracion.tipo_evaluacion == 'producto').count()}")
        print(f"   - Favoritos: {db.query(Favorito).count()}")
        print()
        
    except Exception as e:
        print(f"\n❌ ERROR durante la limpieza:")
        print(f"   {e}")
        import traceback
        traceback.print_exc()
        db.rollback()


def main():
    """Función principal"""
    print("=" * 60)
    print("🗑️  LIMPIEZA AUTOMÁTICA DE PRODUCTOS")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        clear_products_auto(db)
    except Exception as e:
        print(f"\n❌ ERROR:")
        print(f"   {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()
    
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
