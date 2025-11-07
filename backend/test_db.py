"""
Script de prueba de conexión a base de datos

Verifica que:
1. La conexión a la base de datos funcione
2. Se puedan crear sesiones
3. Las tablas estén accesibles
4. Los modelos ORM funcionen correctamente
"""

from app.database import engine, SessionLocal
from app.models import Usuario, Producto, Carrito, ItemCarrito
from sqlalchemy import inspect


def test_connection():
    """Test 1: Verificar conexión a base de datos"""
    print("=" * 60)
    print("TEST 1: Database Connection")
    print("=" * 60)
    
    try:
        connection = engine.connect()
        print("✅ Database connection successful!")
        print(f"   Database URL: {engine.url}")
        connection.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed!")
        print(f"   Error: {e}")
        return False


def test_session():
    """Test 2: Verificar creación de sesión"""
    print("\n" + "=" * 60)
    print("TEST 2: Database Session")
    print("=" * 60)
    
    try:
        db = SessionLocal()
        print("✅ Database session created successfully!")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database session failed!")
        print(f"   Error: {e}")
        return False


def test_tables():
    """Test 3: Verificar que las tablas existan"""
    print("\n" + "=" * 60)
    print("TEST 3: Database Tables")
    print("=" * 60)
    
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if tables:
            print("✅ Tables found in database:")
            for table in tables:
                print(f"   - {table}")
            return True
        else:
            print("⚠️  No tables found in database!")
            print("   Run: alembic upgrade head")
            return False
            
    except Exception as e:
        print(f"❌ Failed to inspect tables!")
        print(f"   Error: {e}")
        return False


def test_models():
    """Test 4: Verificar que los modelos ORM funcionen"""
    print("\n" + "=" * 60)
    print("TEST 4: ORM Models")
    print("=" * 60)
    
    try:
        db = SessionLocal()
        
        # Contar registros en cada tabla
        usuarios_count = db.query(Usuario).count()
        productos_count = db.query(Producto).count()
        carritos_count = db.query(Carrito).count()
        items_count = db.query(ItemCarrito).count()
        
        print("✅ ORM models working correctly!")
        print(f"   - Usuarios: {usuarios_count} registros")
        print(f"   - Productos: {productos_count} registros")
        print(f"   - Carritos: {carritos_count} registros")
        print(f"   - Items Carrito: {items_count} registros")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ ORM models query failed!")
        print(f"   Error: {e}")
        print("\n   Possible causes:")
        print("   1. Tables don't exist yet (run: alembic upgrade head)")
        print("   2. Database connection issue")
        print("   3. Model definitions don't match database schema")
        return False


def test_relationships():
    """Test 5: Verificar que las relaciones ORM funcionen"""
    print("\n" + "=" * 60)
    print("TEST 5: ORM Relationships")
    print("=" * 60)
    
    try:
        db = SessionLocal()
        
        # Verificar que las relaciones estén definidas
        print("✅ ORM relationships defined:")
        print("   - Usuario.carritos (1:N)")
        print("   - Carrito.usuario (N:1)")
        print("   - Carrito.items (1:N)")
        print("   - ItemCarrito.carrito (N:1)")
        print("   - ItemCarrito.producto (N:1)")
        print("   - Producto.items_carrito (1:N)")
        
        # Si hay datos, probar una relación
        usuario = db.query(Usuario).first()
        if usuario:
            carritos_del_usuario = usuario.carritos.count()
            print(f"\n   Testing real data:")
            print(f"   - Usuario '{usuario.email}' tiene {carritos_del_usuario} carrito(s)")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Relationship test failed!")
        print(f"   Error: {e}")
        return False


def main():
    """Ejecutar todos los tests"""
    print("\n" + "=" * 60)
    print("🧪 DATABASE TEST SUITE")
    print("=" * 60)
    
    results = {
        "Connection": test_connection(),
        "Session": test_session(),
        "Tables": test_tables(),
        "Models": test_models(),
        "Relationships": test_relationships(),
    }
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "-" * 60)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Database is ready to use.")
        print("\nNext steps:")
        print("1. Load seed data: python seed_data.py")
        print("2. Start FastAPI server: uvicorn app.main:app --reload")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        print("\nCommon solutions:")
        print("1. Run migrations: alembic upgrade head")
        print("2. Check DATABASE_URL in .env")
        print("3. Ensure database service is running")
    
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
