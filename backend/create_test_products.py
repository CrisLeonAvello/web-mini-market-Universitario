"""
Script para agregar productos de prueba a la base de datos
"""
from app.database import SessionLocal
from app.models.usuario import Usuario
from app.models.producto import Producto
from datetime import datetime
import random

# Productos de prueba para diferentes categorías
PRODUCTOS_PRUEBA = [
    # Electrónica
    {
        "titulo": "Laptop HP 15.6\" Core i5",
        "descripcion": "Laptop HP con procesador Intel Core i5, 8GB RAM, 256GB SSD. Perfecta para estudiantes y trabajo remoto.",
        "precio": 599.99,
        "stock": 15,
        "categoria": "electronica",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
    },
    {
        "titulo": "Mouse Inalámbrico Logitech",
        "descripcion": "Mouse ergonómico inalámbrico con receptor USB. Batería de larga duración.",
        "precio": 24.99,
        "stock": 50,
        "categoria": "electronica",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"
    },
    {
        "titulo": "Audífonos Bluetooth JBL",
        "descripcion": "Audífonos inalámbricos con cancelación de ruido, 30 horas de batería.",
        "precio": 89.99,
        "stock": 30,
        "categoria": "electronica",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
    },
    {
        "titulo": "Teclado Mecánico RGB",
        "descripcion": "Teclado gaming mecánico con iluminación RGB personalizable.",
        "precio": 79.99,
        "stock": 20,
        "categoria": "electronica",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400"
    },
    
    # Ropa
    {
        "titulo": "Camiseta Universitaria Oficial",
        "descripcion": "Camiseta 100% algodón con logo de la universidad. Disponible en varios colores.",
        "precio": 19.99,
        "stock": 100,
        "categoria": "ropa",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
        "titulo": "Sudadera con Capucha",
        "descripcion": "Sudadera cómoda con capucha y bolsillo frontal. Ideal para el campus.",
        "precio": 39.99,
        "stock": 60,
        "categoria": "ropa",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
    },
    {
        "titulo": "Jeans Slim Fit",
        "descripcion": "Jeans de mezclilla resistente, corte moderno slim fit.",
        "precio": 49.99,
        "stock": 40,
        "categoria": "ropa",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
    },
    {
        "titulo": "Zapatillas Deportivas",
        "descripcion": "Zapatillas cómodas para correr o uso casual. Varios colores disponibles.",
        "precio": 69.99,
        "stock": 35,
        "categoria": "ropa",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
    },
    
    # Libros
    {
        "titulo": "Cálculo Diferencial e Integral",
        "descripcion": "Libro de texto universitario. Incluye ejercicios resueltos y práctica.",
        "precio": 45.00,
        "stock": 25,
        "categoria": "libros",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
    },
    {
        "titulo": "Introducción a la Programación en Python",
        "descripcion": "Guía completa para aprender Python desde cero. Incluye proyectos prácticos.",
        "precio": 35.00,
        "stock": 30,
        "categoria": "libros",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400"
    },
    {
        "titulo": "Física Universitaria - Sears",
        "descripcion": "Texto clásico de física. 14va edición. Excelente estado.",
        "precio": 55.00,
        "stock": 15,
        "categoria": "libros",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"
    },
    
    # Útiles
    {
        "titulo": "Mochila para Laptop 17\"",
        "descripcion": "Mochila resistente con compartimento acolchado para laptop. Múltiples bolsillos.",
        "precio": 44.99,
        "stock": 40,
        "categoria": "utiles",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
        "titulo": "Set de Bolígrafos Gel",
        "descripcion": "Pack de 12 bolígrafos de gel en colores variados. Ideales para apuntes.",
        "precio": 12.99,
        "stock": 80,
        "categoria": "utiles",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1590893198933-e6e8a08c6b54?w=400"
    },
    {
        "titulo": "Cuaderno Universitario 200 Hojas",
        "descripcion": "Cuaderno espiral con hojas cuadriculadas. Tapa dura resistente.",
        "precio": 8.99,
        "stock": 120,
        "categoria": "utiles",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400"
    },
    {
        "titulo": "Calculadora Científica Casio",
        "descripcion": "Calculadora científica con 240 funciones. Ideal para matemáticas e ingeniería.",
        "precio": 29.99,
        "stock": 45,
        "categoria": "utiles",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1611312449412-6cefac5dc94e?w=400"
    },
    
    # Comida/Snacks
    {
        "titulo": "Caja de Granola Bars (24 unidades)",
        "descripcion": "Barras de granola con miel y almendras. Perfectas para snack entre clases.",
        "precio": 18.99,
        "stock": 50,
        "categoria": "comida",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400"
    },
    {
        "titulo": "Café Instantáneo Premium (200g)",
        "descripcion": "Café colombiano instantáneo. Frasco de 200g, rinde aproximadamente 100 tazas.",
        "precio": 15.99,
        "stock": 60,
        "categoria": "comida",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400"
    },
    {
        "titulo": "Mix de Frutos Secos (500g)",
        "descripcion": "Mezcla de almendras, nueces, pasas y arándanos. Snack saludable y energético.",
        "precio": 12.99,
        "stock": 70,
        "categoria": "comida",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400"
    },
    
    # Deportes
    {
        "titulo": "Botella de Agua Deportiva 1L",
        "descripcion": "Botella reutilizable libre de BPA con marcador de tiempo. Ideal para el gimnasio.",
        "precio": 16.99,
        "stock": 55,
        "categoria": "deportes",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"
    },
    {
        "titulo": "Colchoneta de Yoga",
        "descripcion": "Colchoneta antideslizante de 6mm de grosor. Incluye correa de transporte.",
        "precio": 34.99,
        "stock": 30,
        "categoria": "deportes",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
    },
    {
        "titulo": "Set de Pesas Ajustables 20kg",
        "descripcion": "Juego de pesas con discos intercambiables. Total 20kg (2x10kg).",
        "precio": 89.99,
        "stock": 20,
        "categoria": "deportes",
        "estado_producto": "DISPONIBLE",
        "imagen": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"
    }
]


def create_test_products():
    """Crear productos de prueba en la base de datos"""
    db = SessionLocal()
    
    try:
        # Verificar si ya existen productos
        existing_count = db.query(Producto).count()
        if existing_count > 0:
            print(f"⚠️  Ya existen {existing_count} productos en la base de datos.")
            respuesta = input("¿Deseas eliminarlos y crear nuevos? (s/n): ")
            if respuesta.lower() != 's':
                print("❌ Operación cancelada.")
                return
            
            # Eliminar productos existentes
            db.query(Producto).delete()
            db.commit()
            print("🗑️  Productos anteriores eliminados.")
        
        # Obtener el primer usuario (o crear uno de prueba)
        vendedor = db.query(Usuario).first()
        
        if not vendedor:
            print("⚠️  No hay usuarios en la base de datos. Creando usuario de prueba...")
            from app.auth import get_password_hash
            vendedor = Usuario(
                email="vendedor@test.com",
                password_hash=get_password_hash("password123"),
                nombre="Vendedor",
                apellido="Test",
                is_active=True,
                is_admin=False
            )
            db.add(vendedor)
            db.commit()
            db.refresh(vendedor)
            print(f"✅ Usuario de prueba creado: {vendedor.email}")
        
        # Crear productos
        productos_creados = []
        print(f"\n🛍️  Creando {len(PRODUCTOS_PRUEBA)} productos de prueba...")
        
        for producto_data in PRODUCTOS_PRUEBA:
            producto = Producto(
                vendedor_id=vendedor.id_usuario,
                **producto_data
            )
            db.add(producto)
            productos_creados.append(producto)
        
        db.commit()
        
        print(f"\n✅ {len(productos_creados)} productos creados exitosamente!")
        print("\n📦 Productos por categoría:")
        
        # Agrupar por categoría
        categorias = {}
        for p in productos_creados:
            if p.categoria not in categorias:
                categorias[p.categoria] = []
            categorias[p.categoria].append(p)
        
        for categoria, productos in categorias.items():
            print(f"\n  📁 {categoria.upper()}: {len(productos)} productos")
            for p in productos:
                print(f"     • {p.titulo} - ${p.precio} ({p.stock} en stock)")
        
        print(f"\n💰 Valor total del inventario: ${sum(p.precio * p.stock for p in productos_creados):.2f}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear productos: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("  CREAR PRODUCTOS DE PRUEBA - StudiMarket")
    print("=" * 60)
    create_test_products()
    print("\n" + "=" * 60)
    print("  ✅ PROCESO COMPLETADO")
    print("=" * 60)
