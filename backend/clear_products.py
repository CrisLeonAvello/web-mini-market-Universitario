"""
Script para limpiar/eliminar todos los productos de la base de datos

Este script elimina:
- Todos los productos
- Items de carrito relacionados
- Valoraciones de productos
- Favoritos de productos
- Ventas relacionadas (opcional)
"""

from app.database import SessionLocal
from app.models import Producto, ItemCarrito, Valoracion, Favorito, Venta
from sqlalchemy import text


def clear_products(db, include_sales=False):
    """
    Eliminar todos los productos y datos relacionados
    
    Args:
        db: Sesión de base de datos
        include_sales: Si True, también elimina las ventas
    """
    print("\n🗑️  Iniciando limpieza de productos...\n")
    
    try:
        # 1. Eliminar items de carrito (dependen de productos)
        items_count = db.query(ItemCarrito).count()
        if items_count > 0:
            db.query(ItemCarrito).delete()
            print(f"   ✅ {items_count} items de carrito eliminados")
        
        # 2. Eliminar valoraciones de productos
        valoraciones_count = db.query(Valoracion).filter(
            Valoracion.tipo_evaluacion == "producto"
        ).count()
        if valoraciones_count > 0:
            db.query(Valoracion).filter(
                Valoracion.tipo_evaluacion == "producto"
            ).delete()
            print(f"   ✅ {valoraciones_count} valoraciones eliminadas")
        
        # 3. Eliminar favoritos
        favoritos_count = db.query(Favorito).count()
        if favoritos_count > 0:
            db.query(Favorito).delete()
            print(f"   ✅ {favoritos_count} favoritos eliminados")
        
        # 4. Eliminar ventas (opcional)
        if include_sales:
            ventas_count = db.query(Venta).count()
            if ventas_count > 0:
                db.query(Venta).delete()
                print(f"   ✅ {ventas_count} ventas eliminadas")
        
        # 5. Eliminar todos los productos
        productos_count = db.query(Producto).count()
        if productos_count > 0:
            db.query(Producto).delete()
            print(f"   ✅ {productos_count} productos eliminados")
        
        # Confirmar cambios
        db.commit()
        
        print("\n✨ Limpieza completada exitosamente!")
        print("\n📊 Estado final:")
        print(f"   - Productos: {db.query(Producto).count()}")
        print(f"   - Items de carrito: {db.query(ItemCarrito).count()}")
        print(f"   - Valoraciones de productos: {db.query(Valoracion).filter(Valoracion.tipo_evaluacion == 'producto').count()}")
        print(f"   - Favoritos: {db.query(Favorito).count()}")
        
        if include_sales:
            print(f"   - Ventas: {db.query(Venta).count()}")
        
        print("\n💡 Para agregar productos nuevamente, ejecuta:")
        print("   python seed_data.py")
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
    print("🗑️  LIMPIEZA DE PRODUCTOS - StudiMarket")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # Mostrar estado actual
        print("\n📊 Estado actual de la base de datos:")
        productos_count = db.query(Producto).count()
        items_count = db.query(ItemCarrito).count()
        valoraciones_count = db.query(Valoracion).filter(
            Valoracion.tipo_evaluacion == "producto"
        ).count()
        favoritos_count = db.query(Favorito).count()
        ventas_count = db.query(Venta).count()
        
        print(f"   - Productos: {productos_count}")
        print(f"   - Items de carrito: {items_count}")
        print(f"   - Valoraciones de productos: {valoraciones_count}")
        print(f"   - Favoritos: {favoritos_count}")
        print(f"   - Ventas: {ventas_count}")
        
        if productos_count == 0:
            print("\n✨ No hay productos para eliminar.")
            return
        
        # Preguntar confirmación
        print("\n⚠️  ADVERTENCIA:")
        print("   Esta acción eliminará TODOS los productos y datos relacionados.")
        print("   Esta operación NO se puede deshacer.")
        
        respuesta = input("\n¿Desea continuar? (s/n): ").lower().strip()
        
        if respuesta in ['s', 'si', 'sí', 'yes', 'y']:
            # Preguntar si eliminar ventas también
            respuesta_ventas = input("\n¿Desea eliminar también las ventas? (s/n): ").lower().strip()
            include_sales = respuesta_ventas in ['s', 'si', 'sí', 'yes', 'y']
            
            clear_products(db, include_sales)
        else:
            print("\n❌ Operación cancelada por el usuario.")
        
    except KeyboardInterrupt:
        print("\n\n❌ Operación cancelada por el usuario (Ctrl+C)")
        db.rollback()
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
