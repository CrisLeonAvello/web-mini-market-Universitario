"""
Script para poblar la base de datos con datos iniciales

Crea:
- 2 usuarios (1 admin, 1 cliente)
- 10 productos de ejemplo en diferentes categorías
- 1 carrito de prueba con items
"""

from app.database import SessionLocal
from app.models import Usuario, Producto, Carrito, ItemCarrito
from app.models.perfil_usuario import PerfilUsuario
from app.models.producto import EstadoProducto, CondicionProducto
from app.models.venta import Venta, EstadoVenta
from app.models.valoracion import Valoracion, TipoEvaluacion
from app.models.favorito import Favorito
import bcrypt
from decimal import Decimal
from datetime import datetime, timedelta


def hash_password(password: str) -> str:
    """Helper para hashear contraseñas de forma segura con bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def seed_usuarios(db):
    """Crear usuarios de prueba"""
    print("📝 Creando usuarios...")
    
    usuarios_data = [
        {
            "email": "admin@minimarket.com",
            "password": "admin123",
            "nombre": "Admin",
            "apellido": "Sistema",
            "is_admin": True
        },
        {
            "email": "cliente@test.com",
            "password": "cliente123",
            "nombre": "Juan",
            "apellido": "Pérez",
            "is_admin": False
        },
        {
            "email": "vendedor1@test.com",
            "password": "vendedor123",
            "nombre": "María",
            "apellido": "González",
            "is_admin": False
        },
        {
            "email": "vendedor2@test.com",
            "password": "vendedor123",
            "nombre": "Carlos",
            "apellido": "Rodríguez",
            "is_admin": False
        },
    ]
    
    usuarios_creados = []
    for data in usuarios_data:
        existing = db.query(Usuario).filter(Usuario.email == data["email"]).first()
        if not existing:
            usuario = Usuario(
                email=data["email"],
                password_hash=hash_password(data["password"]),
                nombre=data["nombre"],
                apellido=data["apellido"],
                is_admin=data["is_admin"],
                is_active=True
            )
            db.add(usuario)
            db.flush()  # Para obtener el ID
            usuarios_creados.append(usuario)
            print(f"   ✅ Usuario creado: {usuario.email}")
        else:
            usuarios_creados.append(existing)
            print(f"   ⚠️  Usuario ya existe: {existing.email}")
    
    db.commit()
    return usuarios_creados


def seed_productos(db, usuarios):
    """Crear productos de prueba con vendedores asignados"""
    print("\n📦 Creando productos...")
    
    # Obtener vendedores
    vendedor1 = next((u for u in usuarios if u.email == "vendedor1@test.com"), None)
    vendedor2 = next((u for u in usuarios if u.email == "vendedor2@test.com"), None)
    admin = next((u for u in usuarios if u.email == "admin@minimarket.com"), None)
    
    productos_data = [
        # Electrónicos - Vendedor 1
        {
            "titulo": "Laptop Dell XPS 15",
            "descripcion": "Laptop de alta gama con procesador Intel i7, 16GB RAM, 512GB SSD",
            "precio": 1299990,
            "stock": 10,
            "categoria": "Electrónicos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/ffffff?text=Laptop+Dell",
            "vendedor_id": vendedor1.id_usuario if vendedor1 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Mouse Logitech G502",
            "descripcion": "Mouse gaming con sensor óptico de alta precisión, 11 botones programables",
            "precio": 59990,
            "stock": 50,
            "categoria": "Electrónicos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/8a2be2?text=Mouse+Gaming",
            "vendedor_id": vendedor1.id_usuario if vendedor1 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Auriculares Sony WH-1000XM4",
            "descripcion": "Auriculares con cancelación de ruido líder en la industria",
            "precio": 349990,
            "stock": 25,
            "categoria": "Electrónicos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/ff6b35?text=Auriculares",
            "vendedor_id": vendedor2.id_usuario if vendedor2 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.USADO
        },
        {
            "titulo": "Pendrive SanDisk 64GB",
            "descripcion": "Memoria USB 3.0 de alta velocidad",
            "precio": 12990,
            "stock": 80,
            "categoria": "Electrónicos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/00bfff?text=Pendrive",
            "vendedor_id": vendedor1.id_usuario if vendedor1 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        
        # Librería - Vendedor 2
        {
            "titulo": "Cuaderno Universitario",
            "descripcion": "Cuaderno espiral de 100 hojas, tamaño carta",
            "precio": 2990,
            "stock": 200,
            "categoria": "Librería",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/32cd32?text=Cuaderno",
            "vendedor_id": vendedor2.id_usuario if vendedor2 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Set de Bolígrafos BIC",
            "descripcion": "Pack de 10 bolígrafos de colores variados",
            "precio": 4990,
            "stock": 150,
            "categoria": "Librería",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/ffd700?text=Boligrafos",
            "vendedor_id": vendedor2.id_usuario if vendedor2 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Mochila Escolar",
            "descripcion": "Mochila con compartimento para laptop de 15 pulgadas",
            "precio": 34990,
            "stock": 40,
            "categoria": "Librería",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/ff1493?text=Mochila",
            "vendedor_id": vendedor1.id_usuario if vendedor1 else admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.REACONDICIONADO
        },
        
        # Alimentos - Admin
        {
            "titulo": "Café Nescafé 200g",
            "descripcion": "Café instantáneo clásico",
            "precio": 8990,
            "stock": 100,
            "categoria": "Alimentos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/8b4513?text=Cafe",
            "vendedor_id": admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Galletas Oreo",
            "descripcion": "Paquete de galletas Oreo original 432g",
            "precio": 3490,
            "stock": 120,
            "categoria": "Alimentos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/000000?text=Galletas",
            "vendedor_id": admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
        {
            "titulo": "Agua Mineral 500ml",
            "descripcion": "Botella de agua mineral natural",
            "precio": 1290,
            "stock": 300,
            "categoria": "Alimentos",
            "imagen": "https://via.placeholder.com/400x400/1a1a2e/00bfff?text=Agua",
            "vendedor_id": admin.id_usuario,
            "estado_producto": EstadoProducto.DISPONIBLE,
            "condicion": CondicionProducto.NUEVO
        },
    ]
    
    productos_creados = []
    for data in productos_data:
        existing = db.query(Producto).filter(Producto.titulo == data["titulo"]).first()
        if not existing:
            producto = Producto(**data)
            db.add(producto)
            db.flush()
            productos_creados.append(producto)
            print(f"   ✅ Producto creado: {producto.titulo}")
        else:
            # Actualizar vendedor_id y otros campos si no los tiene
            if not existing.vendedor_id:
                existing.vendedor_id = data["vendedor_id"]
                existing.estado_producto = data["estado_producto"]
                existing.condicion = data["condicion"]
            # Actualizar imagen si no la tiene
            if not existing.imagen and "imagen" in data:
                existing.imagen = data["imagen"]
                print(f"   🖼️  Imagen actualizada: {existing.titulo}")
            productos_creados.append(existing)
            print(f"   ⚠️  Producto ya existe: {existing.titulo}")
    
    db.commit()
    return productos_creados


def seed_perfiles(db, usuarios):
    """Crear perfiles de usuario"""
    print("\n👤 Creando perfiles de usuario...")
    
    perfiles_data = [
        {
            "email": "vendedor1@test.com",
            "telefono": "+56912345678",
            "ciudad": "Santiago",
            "direccion_completa": "Av. Libertador Bernardo O'Higgins 1234, Santiago",
            "biografia": "Vendedor de tecnología con 5 años de experiencia. Productos de calidad garantizada.",
            "es_vendedor": True
        },
        {
            "email": "vendedor2@test.com",
            "telefono": "+56987654321",
            "ciudad": "Valparaíso",
            "direccion_completa": "Calle Esmeralda 567, Valparaíso",
            "biografia": "Especialista en útiles escolares y artículos de librería.",
            "es_vendedor": True
        },
        {
            "email": "cliente@test.com",
            "telefono": "+56911111111",
            "ciudad": "Concepción",
            "direccion_completa": "Calle Barros Arana 890, Concepción",
            "es_vendedor": False
        }
    ]
    
    for data in perfiles_data:
        usuario = next((u for u in usuarios if u.email == data["email"]), None)
        if not usuario:
            continue
        
        existing = db.query(PerfilUsuario).filter(
            PerfilUsuario.usuario_id == usuario.id_usuario
        ).first()
        
        if not existing:
            perfil = PerfilUsuario(
                usuario_id=usuario.id_usuario,
                telefono=data.get("telefono"),
                ciudad=data.get("ciudad"),
                direccion_completa=data.get("direccion_completa"),
                biografia=data.get("biografia"),
                es_vendedor=data.get("es_vendedor", False),
                calificacion_vendedor=0.0,
                total_ventas=0
            )
            db.add(perfil)
            print(f"   ✅ Perfil creado para: {usuario.email}")
        else:
            print(f"   ⚠️  Perfil ya existe para: {usuario.email}")
    
    db.commit()


def seed_ventas(db, usuarios, productos):
    """Crear ventas de ejemplo"""
    print("\n💰 Creando ventas de ejemplo...")
    
    # Obtener usuarios
    cliente = next((u for u in usuarios if u.email == "cliente@test.com"), None)
    vendedor1 = next((u for u in usuarios if u.email == "vendedor1@test.com"), None)
    vendedor2 = next((u for u in usuarios if u.email == "vendedor2@test.com"), None)
    
    if not (cliente and vendedor1 and vendedor2):
        print("   ⚠️  Usuarios no encontrados, saltando ventas")
        return []
    
    # Obtener productos
    mouse = next((p for p in productos if "Mouse" in p.titulo), None)
    cuaderno = next((p for p in productos if "Cuaderno" in p.titulo), None)
    
    ventas_data = []
    
    # Venta completada 1
    if mouse and vendedor1:
        venta1 = Venta(
            producto_id=mouse.id_producto,
            comprador_id=cliente.id_usuario,
            vendedor_id=vendedor1.id_usuario,
            cantidad=1,
            precio_unitario=Decimal(mouse.precio),
            precio_total=Decimal(mouse.precio),
            comision_plataforma=Decimal(mouse.precio) * Decimal("0.10"),
            estado_venta=EstadoVenta.COMPLETADO,
            metodo_pago="Tarjeta de Crédito",
            fecha_venta=datetime.now() - timedelta(days=15),
            fecha_entrega_real=datetime.now() - timedelta(days=10)
        )
        ventas_data.append(venta1)
    
    # Venta en tránsito
    if cuaderno and vendedor2:
        venta2 = Venta(
            producto_id=cuaderno.id_producto,
            comprador_id=cliente.id_usuario,
            vendedor_id=vendedor2.id_usuario,
            cantidad=5,
            precio_unitario=Decimal(cuaderno.precio),
            precio_total=Decimal(cuaderno.precio) * 5,
            comision_plataforma=Decimal(cuaderno.precio) * 5 * Decimal("0.10"),
            estado_venta=EstadoVenta.ENVIADO,
            metodo_pago="PayPal",
            fecha_venta=datetime.now() - timedelta(days=3),
            fecha_entrega_estimada=datetime.now() + timedelta(days=5)
        )
        ventas_data.append(venta2)
    
    ventas_creadas = []
    for venta in ventas_data:
        db.add(venta)
        db.flush()
        ventas_creadas.append(venta)
        print(f"   ✅ Venta creada: {venta.estado_venta.value}")
    
    # Actualizar contador de ventas para vendedores
    if ventas_creadas:
        for venta in ventas_creadas:
            if venta.estado_venta == EstadoVenta.COMPLETADO:
                perfil = db.query(PerfilUsuario).filter(
                    PerfilUsuario.usuario_id == venta.vendedor_id
                ).first()
                if perfil:
                    perfil.total_ventas += 1
    
    db.commit()
    return ventas_creadas


def seed_valoraciones(db, ventas):
    """Crear valoraciones de ejemplo"""
    print("\n⭐ Creando valoraciones...")
    
    if not ventas:
        print("   ⚠️  No hay ventas, saltando valoraciones")
        return
    
    # Solo valorar ventas completadas
    ventas_completadas = [v for v in ventas if v.estado_venta == EstadoVenta.COMPLETADO]
    
    for venta in ventas_completadas:
        # Comprador valora al vendedor
        valoracion = Valoracion(
            venta_id=venta.id_venta,
            evaluador_id=venta.comprador_id,
            evaluado_id=venta.vendedor_id,
            calificacion=5,
            comentario="Excelente vendedor, producto llegó en perfectas condiciones.",
            tipo_evaluacion=TipoEvaluacion.VENDEDOR
        )
        db.add(valoracion)
        print(f"   ✅ Valoración creada: Comprador → Vendedor (5 estrellas)")
        
        # Vendedor valora al comprador
        valoracion2 = Valoracion(
            venta_id=venta.id_venta,
            evaluador_id=venta.vendedor_id,
            evaluado_id=venta.comprador_id,
            calificacion=5,
            comentario="Excelente comprador, pago rápido y comunicación fluida.",
            tipo_evaluacion=TipoEvaluacion.COMPRADOR
        )
        db.add(valoracion2)
        print(f"   ✅ Valoración creada: Vendedor → Comprador (5 estrellas)")
    
    db.flush()
    
    # Actualizar calificación promedio de vendedores
    valoraciones = db.query(Valoracion).filter(
        Valoracion.tipo_evaluacion == TipoEvaluacion.VENDEDOR
    ).all()
    
    vendedores_ids = set([v.evaluado_id for v in valoraciones])
    for vendedor_id in vendedores_ids:
        vals = [v for v in valoraciones if v.evaluado_id == vendedor_id]
        promedio = sum([v.calificacion for v in vals]) / len(vals)
        
        perfil = db.query(PerfilUsuario).filter(
            PerfilUsuario.usuario_id == vendedor_id
        ).first()
        if perfil:
            perfil.calificacion_vendedor = Decimal(promedio)
    
    db.commit()


def seed_favoritos(db, usuarios, productos):
    """Crear favoritos de ejemplo"""
    print("\n❤️  Creando favoritos...")
    
    cliente = next((u for u in usuarios if u.email == "cliente@test.com"), None)
    if not cliente:
        print("   ⚠️  Cliente no encontrado, saltando favoritos")
        return
    
    # Agregar algunos productos a favoritos
    productos_favoritos = [p for p in productos if p.categoria in ["Electrónicos", "Librería"]][:4]
    
    for producto in productos_favoritos:
        # No agregar sus propios productos
        if producto.vendedor_id == cliente.id_usuario:
            continue
        
        existing = db.query(Favorito).filter(
            Favorito.usuario_id == cliente.id_usuario,
            Favorito.producto_id == producto.id_producto
        ).first()
        
        if not existing:
            favorito = Favorito(
                usuario_id=cliente.id_usuario,
                producto_id=producto.id_producto
            )
            db.add(favorito)
            print(f"   ✅ Favorito agregado: {producto.titulo}")
    
    db.commit()


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
        usuarios = seed_usuarios(db)
        productos = seed_productos(db, usuarios)
        seed_perfiles(db, usuarios)
        ventas = seed_ventas(db, usuarios, productos)
        seed_valoraciones(db, ventas)
        seed_favoritos(db, usuarios, productos)
        seed_carrito_ejemplo(db)
        
        print("\n" + "=" * 60)
        print("✅ DATABASE SEEDED SUCCESSFULLY!")
        print("=" * 60)
        
        print("\n📊 Resumen:")
        usuarios_count = db.query(Usuario).count()
        productos_count = db.query(Producto).count()
        perfiles_count = db.query(PerfilUsuario).count()
        ventas_count = db.query(Venta).count()
        valoraciones_count = db.query(Valoracion).count()
        favoritos_count = db.query(Favorito).count()
        carritos_count = db.query(Carrito).count()
        items_count = db.query(ItemCarrito).count()
        
        print(f"   - Usuarios: {usuarios_count}")
        print(f"   - Perfiles: {perfiles_count}")
        print(f"   - Productos: {productos_count}")
        print(f"   - Ventas: {ventas_count}")
        print(f"   - Valoraciones: {valoraciones_count}")
        print(f"   - Favoritos: {favoritos_count}")
        print(f"   - Carritos: {carritos_count}")
        print(f"   - Items: {items_count}")
        
        print("\n🔐 Credenciales de prueba:")
        print("   Admin:")
        print("      Email: admin@minimarket.com")
        print("      Password: admin123")
        print("\n   Cliente:")
        print("      Email: cliente@test.com")
        print("      Password: cliente123")
        print("\n   Vendedor 1:")
        print("      Email: vendedor1@test.com")
        print("      Password: vendedor123")
        print("\n   Vendedor 2:")
        print("      Email: vendedor2@test.com")
        print("      Password: vendedor123")
        
        print("\n🚀 Siguiente paso:")
        print("   uvicorn app.main:app --reload")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR durante el seeding:")
        print(f"   {e}")
        import traceback
        traceback.print_exc()
        print("\n💡 Posibles causas:")
        print("   1. Las tablas no existen (ejecutar: alembic upgrade head)")
        print("   2. Violación de constraints (datos duplicados)")
        print("   3. Problema de conexión a la base de datos")
        db.rollback()
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
