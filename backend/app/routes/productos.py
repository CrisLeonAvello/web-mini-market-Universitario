"""
🛍️ Rutas de Productos

Este módulo maneja todas las operaciones relacionadas con productos:
- Listado con filtros y paginación
- Búsqueda por categoría y precio
- Detalles de productos individuales
- Gestión de stock e inventario
- Publicación y edición de productos (vendedores)
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.producto import Producto, EstadoProducto, CondicionProducto
from app.models.usuario import Usuario
from app.schemas.product import ProductResponse, ProductList
from app.auth import get_current_user

router = APIRouter()


@router.get(
    "/", 
    response_model=dict,
    summary="Listar todos los productos",
    description="""
    ## 🛍️ Catálogo de Productos
    
    Obtiene una lista paginada de productos con filtros avanzados.
    
    ### 🔍 Filtros Disponibles:
    - **Categoría**: Filtrar por tipo de producto
    - **Precio**: Rango de precios mínimo y máximo
    - **Búsqueda**: Buscar en título y descripción
    - **Paginación**: Control de páginas y cantidad
    
    ### 💰 Precios:
    Todos los precios están en **CLP (Pesos Chilenos)** sin formato de comas.
    
    ### 📱 Ejemplo de Uso:
    ```
    GET /productos?category=Electrónica&min_price=50000&max_price=1000000
    ```
    """,
    responses={
        200: {
            "description": "Lista de productos",
            "content": {
                "application/json": {
                    "example": {
                        "products": [
                            {
                                "id": 1,
                                "title": "Laptop Dell XPS 15",
                                "price": 1299990,
                                "category": "Electrónica",
                                "description": "Laptop de alta gama...",
                                "stock": 5,
                                "rating": {"rate": 4.5, "count": 120}
                            }
                        ],
                        "total": 10,
                        "page": 1,
                        "page_size": 10,
                        "total_pages": 1
                    }
                }
            }
        }
    }
)
@router.get("", response_model=dict)  # Sin barra final
async def list_products(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(10, ge=1, le=100, description="Productos por página"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Buscar en título y descripción"),
    min_price: Optional[float] = Query(None, ge=0, description="Precio mínimo"),
    max_price: Optional[float] = Query(None, ge=0, description="Precio máximo"),
    db: Session = Depends(get_db)
):
    """
    Listar productos con paginación y filtros
    
    - **page**: Número de página (default: 1)
    - **page_size**: Productos por página (default: 10, max: 100)
    - **category**: Filtrar por categoría (opcional)
    - **search**: Buscar en título y descripción (opcional)
    - **min_price**: Filtro de precio mínimo (opcional)
    - **max_price**: Filtro de precio máximo (opcional)
    """
    # Consulta base - solo productos disponibles
    query = db.query(Producto).filter(
        Producto.is_active == True,
        Producto.estado_producto == EstadoProducto.DISPONIBLE,
        Producto.stock > 0
    )
    
    # Aplicar filtros
    if category:
        query = query.filter(Producto.categoria.ilike(f"%{category}%"))
    
    if search:
        query = query.filter(
            (Producto.titulo.ilike(f"%{search}%")) |
            (Producto.descripcion.ilike(f"%{search}%"))
        )
    
    if min_price is not None:
        query = query.filter(Producto.precio >= min_price)
    
    if max_price is not None:
        query = query.filter(Producto.precio <= max_price)
    
    # Contar total
    total = query.count()
    
    # Aplicar paginación
    offset = (page - 1) * page_size
    productos = query.offset(offset).limit(page_size).all()
    
    # Convertir a formato esperado por el frontend
    products_data = []
    for producto in productos:
        product_dict = {
            "id": producto.id_producto,
            "title": producto.titulo,
            "name": producto.titulo,  # Alias para compatibilidad
            "price": float(producto.precio),
            "description": producto.descripcion or "",
            "category": producto.categoria,
            "image": producto.imagen if producto.imagen and producto.imagen.startswith('http') else "https://via.placeholder.com/300x300?text=Producto",
            "stock": producto.stock,
            "rating": {
                "rate": float(producto.rating_rate) if producto.rating_rate else 0.0,
                "count": producto.rating_count or 0
            },
            "featured": False,
            "tags": [producto.categoria],
            "created_at": producto.created_at.isoformat() if producto.created_at else None,
            "updated_at": producto.updated_at.isoformat() if producto.updated_at else None
        }
        products_data.append(product_dict)
    
    # Calcular páginas totales
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "products": products_data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get(
    "/{product_id}", 
    response_model=dict,
    summary="Obtener producto por ID",
    description="""
    ## 🔍 Detalle de Producto
    
    Obtiene información detallada de un producto específico por su ID.
    
    ### 📋 Información Incluida:
    - Título y descripción completa
    - Precio en CLP (sin comas)
    - Stock disponible
    - Categoría del producto
    - Calificaciones y reseñas
    - Imágenes del producto
    
    ### ❌ Errores:
    - **404**: Producto no encontrado o inactivo
    """,
    responses={
        200: {
            "description": "Detalles del producto",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "title": "Laptop Dell XPS 15",
                        "price": 1299990,
                        "category": "Electrónica",
                        "description": "Laptop de alta gama con procesador Intel i7...",
                        "stock": 5,
                        "image": "https://example.com/laptop.jpg",
                        "rating": {
                            "rate": 4.5,
                            "count": 120
                        }
                    }
                }
            }
        },
        404: {
            "description": "Producto no encontrado",
            "content": {
                "application/json": {
                    "example": {"detail": "Producto con ID 999 no encontrado"}
                }
            }
        }
    }
)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener un producto por ID
    
    - **product_id**: ID del producto
    - **Retorna**: Datos del producto
    - **Error 404**: Si el producto no existe
    """
    producto = db.query(Producto).filter(
        Producto.id_producto == product_id,
        Producto.is_active == True
    ).first()
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con ID {product_id} no encontrado"
        )
    
    return {
        "id": producto.id_producto,
        "title": producto.titulo,
        "name": producto.titulo,
        "price": float(producto.precio),
        "description": producto.descripcion or "",
        "category": producto.categoria,
        "image": producto.imagen if producto.imagen and producto.imagen.startswith('http') else "https://via.placeholder.com/300x300?text=Producto",
        "stock": producto.stock,
        "rating": {
            "rate": float(producto.rating_rate) if producto.rating_rate else 0.0,
            "count": producto.rating_count or 0
        },
        "featured": False,
        "tags": [producto.categoria],
        "created_at": producto.created_at.isoformat() if producto.created_at else None,
        "updated_at": producto.updated_at.isoformat() if producto.updated_at else None
    }


@router.get("/categorias/list")
async def get_categories(db: Session = Depends(get_db)):
    """
    Obtener todas las categorías disponibles
    """
    categorias = db.query(Producto.categoria).filter(
        Producto.is_active == True
    ).distinct().all()
    
    categories_list = [cat[0] for cat in categorias if cat[0]]
    
    return {
        "categories": sorted(categories_list)
    }


# ============================================================================
# 🆕 NUEVOS ENDPOINTS - GESTIÓN DE PRODUCTOS POR VENDEDORES
# ============================================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Publicar nuevo producto",
    description="Crear un nuevo producto para vender. Requiere autenticación."
)
async def crear_producto(
    titulo: str,
    descripcion: str,
    precio: int,
    stock: int,
    categoria: str,
    imagen: Optional[str] = None,
    condicion: str = "nuevo",
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Publicar un nuevo producto
    - Requiere autenticación
    - El vendedor_id se asigna automáticamente
    """
    # Validar condición
    try:
        condicion_enum = CondicionProducto(condicion.upper())
    except ValueError:
        condicion_enum = CondicionProducto.NUEVO
    
    nuevo_producto = Producto(
        titulo=titulo,
        descripcion=descripcion,
        precio=precio,
        stock=stock,
        categoria=categoria,
        imagen=imagen,
        vendedor_id=current_user.id_usuario,
        estado_producto=EstadoProducto.DISPONIBLE,
        condicion=condicion_enum,
        is_active=True
    )
    
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    
    return {
        "id": nuevo_producto.id_producto,
        "title": nuevo_producto.titulo,
        "price": nuevo_producto.precio,
        "stock": nuevo_producto.stock,
        "categoria": nuevo_producto.categoria,
        "vendedor_id": nuevo_producto.vendedor_id,
        "estado": nuevo_producto.estado_producto.value,
        "message": "Producto publicado exitosamente"
    }


@router.put(
    "/{product_id}",
    summary="Editar producto",
    description="Editar un producto existente. Solo el vendedor owner o admin pueden editar."
)
async def editar_producto(
    product_id: int,
    titulo: Optional[str] = None,
    descripcion: Optional[str] = None,
    precio: Optional[int] = None,
    stock: Optional[int] = None,
    categoria: Optional[str] = None,
    imagen: Optional[str] = None,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Editar producto existente
    - Solo el vendedor owner o admin pueden editar
    """
    producto = db.query(Producto).filter(Producto.id_producto == product_id).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar permisos
    if producto.vendedor_id != current_user.id_usuario and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para editar este producto"
        )
    
    # Actualizar campos
    if titulo is not None:
        producto.titulo = titulo
    if descripcion is not None:
        producto.descripcion = descripcion
    if precio is not None:
        producto.precio = precio
    if stock is not None:
        producto.stock = stock
    if categoria is not None:
        producto.categoria = categoria
    if imagen is not None:
        producto.imagen = imagen
    
    db.commit()
    db.refresh(producto)
    
    return {
        "id": producto.id_producto,
        "title": producto.titulo,
        "price": producto.precio,
        "message": "Producto actualizado exitosamente"
    }


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar producto",
    description="Eliminar (desactivar) un producto. Solo el vendedor owner o admin."
)
async def eliminar_producto(
    product_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Eliminar producto (marca como inactivo)
    - Solo el vendedor owner o admin
    """
    producto = db.query(Producto).filter(Producto.id_producto == product_id).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar permisos
    if producto.vendedor_id != current_user.id_usuario and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este producto"
        )
    
    # Marcar como inactivo en lugar de eliminar físicamente
    producto.is_active = False
    producto.estado_producto = EstadoProducto.ELIMINADO
    
    db.commit()
    
    return None


@router.patch(
    "/{product_id}/pausar",
    summary="Pausar/Reactivar producto",
    description="Pausar o reactivar un producto. Solo el vendedor owner."
)
async def pausar_producto(
    product_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Pausar o reactivar un producto
    - Solo el vendedor owner
    """
    producto = db.query(Producto).filter(Producto.id_producto == product_id).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar permisos
    if producto.vendedor_id != current_user.id_usuario:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para pausar este producto"
        )
    
    # Toggle estado
    if producto.estado_producto == EstadoProducto.DISPONIBLE:
        producto.estado_producto = EstadoProducto.PAUSADO
        mensaje = "Producto pausado"
    else:
        producto.estado_producto = EstadoProducto.DISPONIBLE
        mensaje = "Producto reactivado"
    
    db.commit()
    
    return {
        "id": producto.id_producto,
        "estado": producto.estado_producto.value,
        "message": mensaje
    }


@router.get(
    "/vendedor/{vendedor_id}",
    summary="Productos de un vendedor",
    description="Obtener todos los productos de un vendedor específico (público)"
)
async def productos_vendedor(
    vendedor_id: int,
    db: Session = Depends(get_db)
):
    """
    Ver productos de un vendedor específico
    - Público (sin autenticación)
    - Solo muestra productos disponibles
    """
    productos = db.query(Producto).filter(
        Producto.vendedor_id == vendedor_id,
        Producto.is_active == True,
        Producto.estado_producto == EstadoProducto.DISPONIBLE
    ).all()
    
    products_data = []
    for producto in productos:
        product_dict = {
            "id": producto.id_producto,
            "title": producto.titulo,
            "price": float(producto.precio),
            "stock": producto.stock,
            "categoria": producto.categoria,
            "imagen": producto.imagen,
            "condicion": producto.condicion.value
        }
        products_data.append(product_dict)
    
    return {
        "vendedor_id": vendedor_id,
        "total": len(products_data),
        "productos": products_data
    }