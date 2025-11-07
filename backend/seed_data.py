"""
Script para poblar la base de datos con datos iniciales

Crea:
- 2 usuarios (1 admin, 1 cliente)
- 10 productos de ejemplo en diferentes categorías
- 1 carrito de prueba con items
"""

from app.database import SessionLocal
from app.models import Usuario, Producto, Carrito, ItemCarrito
import bcrypt
from decimal import Decimal


def hash_password(password: str) -> str:
    """Helper para hashear contraseñas de forma segura con bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def seed_usuarios(db):
    """Crear usuarios de prueba"""
    print("📝 Creando usuarios...")
    
    usuarios = [
        Usuario(
            email="admin@minimarket.com",
            password_hash=hash_password("admin123"),
            nombre="Admin",
            apellido="Sistema",
            is_admin=True,
            is_active=True
        ),
        Usuario(
            email="cliente@test.com",
            password_hash=hash_password("cliente123"),
            nombre="Juan",
            apellido="Pérez",
            is_admin=False,
            is_active=True
        ),
    ]
    
    for usuario in usuarios:
        # Verificar si ya existe
        existing = db.query(Usuario).filter(Usuario.email == usuario.email).first()
        if not existing:
            db.add(usuario)
            print(f"   ✅ Usuario creado: {usuario.email}")
        else:
            print(f"   ⚠️  Usuario ya existe: {usuario.email}")
    
    db.commit()
    return usuarios


def seed_productos(db):
    """Crear productos de prueba"""
    print("\n📦 Creando productos...")
    
    productos = [
        # Electrónicos
        Producto(
            titulo="Laptop Dell XPS 15",
            descripcion="Laptop de alta gama con procesador Intel i7, 16GB RAM, 512GB SSD",
            precio=Decimal("1299.99"),
            stock=10,
            categoria="Electrónicos",
            imagen="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-nt-blue-gallery-4.psd",
            rating_rate=Decimal("4.5"),
            rating_count=89
        ),
        Producto(
            titulo="Mouse Logitech G502",
            descripcion="Mouse gaming con sensor óptico de alta precisión, 11 botones programables",
            precio=Decimal("59.99"),
            stock=50,
            categoria="Electrónicos",
            imagen="https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png",
            rating_rate=Decimal("4.7"),
            rating_count=234
        ),
        Producto(
            titulo="Auriculares Sony WH-1000XM4",
            descripcion="Auriculares con cancelación de ruido líder en la industria",
            precio=Decimal("349.99"),
            stock=25,
            categoria="Electrónicos",
            rating_rate=Decimal("4.8"),
            rating_count=456
        ),
        Producto(
            titulo="Pendrive SanDisk 64GB",
            descripcion="Memoria USB 3.0 de alta velocidad",
            precio=Decimal("12.99"),
            stock=80,
            categoria="Electrónicos",
            rating_rate=Decimal("4.3"),
            rating_count=156
        ),
        
        # Librería
        Producto(
            titulo="Cuaderno Universitario",
            descripcion="Cuaderno espiral de 100 hojas, tamaño carta",
            precio=Decimal("2.99"),
            stock=200,
            categoria="Librería",
            rating_rate=Decimal("4.2"),
            rating_count=45
        ),
        Producto(
            titulo="Set de Bolígrafos BIC",
            descripcion="Pack de 10 bolígrafos de colores variados",
            precio=Decimal("4.99"),
            stock=150,
            categoria="Librería",
            rating_rate=Decimal("4.0"),
            rating_count=78
        ),
        Producto(
            titulo="Mochila Escolar",
            descripcion="Mochila con compartimento para laptop de 15 pulgadas",
            precio=Decimal("34.99"),
            stock=40,
            categoria="Librería",
            rating_rate=Decimal("4.4"),
            rating_count=92
        ),
        
        # Alimentos
        Producto(
            titulo="Café Nescafé 200g",
            descripcion="Café instantáneo clásico",
            precio=Decimal("8.99"),
            stock=100,
            categoria="Alimentos",
            rating_rate=Decimal("4.1"),
            rating_count=203
        ),
        Producto(
            titulo="Galletas Oreo",
            descripcion="Paquete de galletas Oreo original 432g",
            precio=Decimal("3.49"),
            stock=120,
            categoria="Alimentos",
            rating_rate=Decimal("4.6"),
            rating_count=178
        ),
        Producto(
            titulo="Agua Mineral 500ml",
            descripcion="Botella de agua mineral natural",
            precio=Decimal("1.29"),
            stock=300,
            categoria="Alimentos",
            rating_rate=Decimal("4.0"),
            rating_count=67
        ),
    ]
    
    for producto in productos:
        # Verificar si ya existe (por título)
        existing = db.query(Producto).filter(Producto.titulo == producto.titulo).first()
        if not existing:
            db.add(producto)
            print(f"   ✅ Producto creado: {producto.titulo}")
        else:
            print(f"   ⚠️  Producto ya existe: {producto.titulo}")
    
    db.commit()
    return productos


def seed_carrito_ejemplo(db):
    """Crear un carrito de ejemplo con items"""
    print("\n🛒 Creando carrito de ejemplo...")
    
    # Obtener cliente
    cliente = db.query(Usuario).filter(Usuario.email == "cliente@test.com").first()
    if not cliente:
        print("   ⚠️  Cliente no encontrado, saltando creación de carrito")
        return
    
    # Verificar si ya tiene carrito activo
    carrito_existente = db.query(Carrito).filter(
        Carrito.usuario_id == cliente.id_usuario,
        Carrito.is_active == True
    ).first()
    
    if carrito_existente:
        print(f"   ⚠️  Cliente ya tiene carrito activo (ID: {carrito_existente.id_carrito})")
        return
    
    # Crear carrito
    carrito = Carrito(
        usuario_id=cliente.id_usuario,
        impuesto=Decimal("15.00"),
        envio=Decimal("10.00"),
        is_active=True
    )
    db.add(carrito)
    db.commit()
    db.refresh(carrito)
    
    print(f"   ✅ Carrito creado (ID: {carrito.id_carrito})")
    
    # Agregar items al carrito
    productos_para_carrito = [
        ("Laptop Dell XPS 15", 1),
        ("Mouse Logitech G502", 2),
        ("Cuaderno Universitario", 3),
    ]
    
    for titulo_producto, cantidad in productos_para_carrito:
        producto = db.query(Producto).filter(Producto.titulo == titulo_producto).first()
        if producto:
            item = ItemCarrito(
                carrito_id=carrito.id_carrito,
                producto_id=producto.id_producto,
                cantidad=cantidad,
                precio_unitario=producto.precio,
                # subtotal se calcula automáticamente por el trigger
            )
            db.add(item)
            print(f"   ✅ Item agregado: {cantidad}x {producto.titulo}")
    
    db.commit()
    
    # Mostrar resumen del carrito
    db.refresh(carrito)
    print(f"\n   📊 Resumen del carrito:")
    print(f"      - Total items: {carrito.total_items}")
    print(f"      - Total productos: {carrito.total_productos}")
    print(f"      - Subtotal: ${carrito.subtotal:.2f}")
    print(f"      - Impuesto: ${carrito.impuesto:.2f}")
    print(f"      - Envío: ${carrito.envio:.2f}")
    print(f"      - TOTAL: ${carrito.total:.2f}")


def main():
    """Ejecutar seed de toda la base de datos"""
    print("\n" + "=" * 60)
    print("🌱 SEEDING DATABASE")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # Seed en orden (respetando FKs)
        seed_usuarios(db)
        seed_productos(db)
        seed_carrito_ejemplo(db)
        
        print("\n" + "=" * 60)
        print("✅ DATABASE SEEDED SUCCESSFULLY!")
        print("=" * 60)
        
        print("\n📊 Resumen:")
        usuarios_count = db.query(Usuario).count()
        productos_count = db.query(Producto).count()
        carritos_count = db.query(Carrito).count()
        items_count = db.query(ItemCarrito).count()
        
        print(f"   - Usuarios: {usuarios_count}")
        print(f"   - Productos: {productos_count}")
        print(f"   - Carritos: {carritos_count}")
        print(f"   - Items: {items_count}")
        
        print("\n🔐 Credenciales de prueba:")
        print("   Admin:")
        print("      Email: admin@minimarket.com")
        print("      Password: admin123")
        print("\n   Cliente:")
        print("      Email: cliente@test.com")
        print("      Password: cliente123")
        
        print("\n🚀 Siguiente paso:")
        print("   uvicorn app.main:app --reload")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR durante el seeding:")
        print(f"   {e}")
        print("\n💡 Posibles causas:")
        print("   1. Las tablas no existen (ejecutar: alembic upgrade head)")
        print("   2. Violación de constraints (datos duplicados)")
        print("   3. Problema de conexión a la base de datos")
        db.rollback()
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
