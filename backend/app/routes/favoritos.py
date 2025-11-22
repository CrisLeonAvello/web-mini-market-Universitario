"""
❤️ Rutas de Favoritos (Wishlist)

Endpoints para gestión de productos favoritos de cada usuario.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.models.usuario import Usuario
from app.models.producto import Producto, EstadoProducto
from app.models.favorito import Favorito
from app.auth import get_current_user
from app.schemas.favorito import (
    FavoritoCreate,
    FavoritoResponse
)

router = APIRouter()


# ============================================================================
# ❤️ AGREGAR A FAVORITOS
# ============================================================================

@router.post(
    "/",
    response_model=FavoritoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Agregar a favoritos",
    description="Añadir un producto a la lista de favoritos"
)
async def agregar_favorito(
    favorito_data: FavoritoCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Agregar producto a favoritos"""
    
    # Verificar que el producto existe
    producto = db.query(Producto).filter(
        Producto.id_producto == favorito_data.producto_id
    ).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # No puedes agregar tus propios productos a favoritos
    if producto.vendedor_id == current_user.id_usuario:
        raise HTTPException(
            status_code=400,
            detail="No puedes agregar tus propios productos a favoritos"
        )
    
    # Verificar si ya está en favoritos
    favorito_existente = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario,
        Favorito.producto_id == favorito_data.producto_id
    ).first()
    
    if favorito_existente:
        raise HTTPException(
            status_code=400,
            detail="Este producto ya está en tus favoritos"
        )
    
    # Crear favorito
    nuevo_favorito = Favorito(
        usuario_id=current_user.id_usuario,
        producto_id=favorito_data.producto_id
    )
    
    try:
        db.add(nuevo_favorito)
        db.commit()
        db.refresh(nuevo_favorito)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error al agregar a favoritos"
        )
    
    return nuevo_favorito


# ============================================================================
# 📋 VER MIS FAVORITOS
# ============================================================================

@router.get(
    "/me",
    summary="Mis favoritos",
    description="Ver todos mis productos favoritos"
)
async def mis_favoritos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver lista de favoritos del usuario"""
    
    favoritos = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario
    ).order_by(Favorito.created_at.desc()).all()
    
    favoritos_data = []
    for fav in favoritos:
        producto = fav.producto
        
        # Información del vendedor
        vendedor_nombre = "Usuario"
        calificacion_vendedor = 0.0
        if producto.vendedor and producto.vendedor.perfil:
            vendedor_nombre = producto.vendedor.nombre_completo or "Usuario"
            calificacion_vendedor = float(producto.vendedor.perfil.calificacion_vendedor) if producto.vendedor.perfil.calificacion_vendedor else 0.0
        
        fav_dict = {
            "favorito_id": fav.id_favorito,
            "fecha_agregado": fav.created_at.isoformat(),
            "producto": {
                "id": producto.id_producto,
                "titulo": producto.titulo,
                "descripcion": producto.descripcion,
                "precio": float(producto.precio),
                "stock": producto.stock,
                "categoria": producto.categoria,
                "imagen": producto.imagen,
                "estado": producto.estado_producto.value,
                "condicion": producto.condicion.value,
                "disponible": producto.estado_producto == EstadoProducto.DISPONIBLE and producto.stock > 0,
                "vendedor": {
                    "id": producto.vendedor_id,
                    "nombre": vendedor_nombre,
                    "calificacion": calificacion_vendedor
                }
            }
        }
        favoritos_data.append(fav_dict)
    
    return {
        "total": len(favoritos),
        "favoritos": favoritos_data
    }


# ============================================================================
# 🔍 VERIFICAR SI PRODUCTO ESTÁ EN FAVORITOS
# ============================================================================

@router.get(
    "/check/{producto_id}",
    summary="Verificar si está en favoritos",
    description="Comprobar si un producto específico está en favoritos"
)
async def verificar_favorito(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verificar si un producto está en favoritos"""
    
    favorito = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario,
        Favorito.producto_id == producto_id
    ).first()
    
    return {
        "producto_id": producto_id,
        "es_favorito": favorito is not None,
        "favorito_id": favorito.id_favorito if favorito else None
    }


# ============================================================================
# 🗑️ ELIMINAR DE FAVORITOS
# ============================================================================

@router.delete(
    "/{favorito_id}",
    summary="Eliminar de favoritos",
    description="Quitar un producto de la lista de favoritos"
)
async def eliminar_favorito(
    favorito_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar producto de favoritos"""
    
    favorito = db.query(Favorito).filter(
        Favorito.id_favorito == favorito_id
    ).first()
    
    if not favorito:
        raise HTTPException(status_code=404, detail="Favorito no encontrado")
    
    # Verificar que sea del usuario actual
    if favorito.usuario_id != current_user.id_usuario:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este favorito"
        )
    
    db.delete(favorito)
    db.commit()
    
    return {"mensaje": "Producto eliminado de favoritos exitosamente"}


@router.delete(
    "/producto/{producto_id}",
    summary="Eliminar favorito por producto",
    description="Quitar un producto de favoritos usando su ID"
)
async def eliminar_favorito_por_producto(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar favorito usando el ID del producto"""
    
    favorito = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario,
        Favorito.producto_id == producto_id
    ).first()
    
    if not favorito:
        raise HTTPException(
            status_code=404,
            detail="Este producto no está en tus favoritos"
        )
    
    db.delete(favorito)
    db.commit()
    
    return {"mensaje": "Producto eliminado de favoritos exitosamente"}


# ============================================================================
# 🔄 TOGGLE FAVORITO
# ============================================================================

@router.post(
    "/toggle/{producto_id}",
    summary="Toggle favorito",
    description="Agregar o quitar de favoritos según estado actual"
)
async def toggle_favorito(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Agregar o quitar de favoritos (toggle)"""
    
    # Verificar que el producto existe
    producto = db.query(Producto).filter(
        Producto.id_producto == producto_id
    ).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # No puedes agregar tus propios productos
    if producto.vendedor_id == current_user.id_usuario:
        raise HTTPException(
            status_code=400,
            detail="No puedes agregar tus propios productos a favoritos"
        )
    
    # Buscar si ya existe
    favorito = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario,
        Favorito.producto_id == producto_id
    ).first()
    
    if favorito:
        # Ya está en favoritos, eliminar
        db.delete(favorito)
        db.commit()
        return {
            "mensaje": "Producto eliminado de favoritos",
            "accion": "eliminado",
            "es_favorito": False
        }
    else:
        # No está en favoritos, agregar
        nuevo_favorito = Favorito(
            usuario_id=current_user.id_usuario,
            producto_id=producto_id
        )
        db.add(nuevo_favorito)
        db.commit()
        db.refresh(nuevo_favorito)
        return {
            "mensaje": "Producto agregado a favoritos",
            "accion": "agregado",
            "es_favorito": True,
            "favorito_id": nuevo_favorito.id_favorito
        }


# ============================================================================
# 📊 ESTADÍSTICAS DE FAVORITOS
# ============================================================================

@router.get(
    "/estadisticas/productos-populares",
    summary="Productos más favoritos",
    description="Ver los productos con más favoritos"
)
async def productos_populares(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Ver productos más agregados a favoritos"""
    
    # Contar favoritos por producto
    from sqlalchemy import func, desc
    
    productos_populares = db.query(
        Producto.id_producto,
        Producto.titulo,
        Producto.precio,
        Producto.imagen,
        Producto.categoria,
        func.count(Favorito.id_favorito).label('total_favoritos')
    ).join(
        Favorito, Producto.id_producto == Favorito.producto_id
    ).filter(
        Producto.estado_producto == EstadoProducto.DISPONIBLE,
        Producto.is_active == True
    ).group_by(
        Producto.id_producto
    ).order_by(
        desc('total_favoritos')
    ).limit(limit).all()
    
    productos_data = [
        {
            "producto_id": p[0],
            "titulo": p[1],
            "precio": float(p[2]),
            "imagen": p[3],
            "categoria": p[4],
            "total_favoritos": p[5]
        }
        for p in productos_populares
    ]
    
    return {
        "total": len(productos_data),
        "productos": productos_data
    }


@router.get(
    "/me/estadisticas",
    summary="Mis estadísticas de favoritos",
    description="Estadísticas de mis productos favoritos"
)
async def mis_estadisticas_favoritos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Estadísticas de favoritos del usuario"""
    
    favoritos = db.query(Favorito).filter(
        Favorito.usuario_id == current_user.id_usuario
    ).all()
    
    # Contar por categoría
    categorias = {}
    disponibles = 0
    no_disponibles = 0
    
    for fav in favoritos:
        producto = fav.producto
        categoria = producto.categoria
        
        if categoria not in categorias:
            categorias[categoria] = 0
        categorias[categoria] += 1
        
        if producto.estado_producto == EstadoProducto.DISPONIBLE and producto.stock > 0:
            disponibles += 1
        else:
            no_disponibles += 1
    
    return {
        "total_favoritos": len(favoritos),
        "disponibles": disponibles,
        "no_disponibles": no_disponibles,
        "por_categoria": categorias
    }
