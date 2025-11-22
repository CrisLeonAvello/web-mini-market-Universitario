"""
👤 Rutas de Usuario y Perfil

Endpoints para gestión de perfiles de usuario, historial de compras/ventas,
y gestión de productos del vendedor.
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.usuario import Usuario
from app.models.producto import Producto, EstadoProducto
from app.models.perfil_usuario import PerfilUsuario
from app.models.venta import Venta, EstadoVenta
from app.models.valoracion import Valoracion
from app.auth import get_current_user
from app.schemas.perfil import (
    PerfilUsuarioCreate,
    PerfilUsuarioUpdate,
    PerfilUsuarioResponse
)
from app.schemas.venta import VentaResponse, VentaDetalle
from app.schemas.valoracion import ValoracionResponse, ValoracionDetalle

router = APIRouter()


# ============================================================================
# 📋 PERFIL DE USUARIO
# ============================================================================

@router.get(
    "/me/profile",
    response_model=PerfilUsuarioResponse,
    summary="Ver mi perfil",
    description="Obtener el perfil del usuario autenticado"
)
async def get_mi_perfil(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver perfil del usuario actual"""
    perfil = db.query(PerfilUsuario).filter(
        PerfilUsuario.usuario_id == current_user.id_usuario
    ).first()
    
    if not perfil:
        # Crear perfil si no existe
        perfil = PerfilUsuario(
            usuario_id=current_user.id_usuario,
            es_vendedor=True,
            calificacion_vendedor=0.0,
            total_ventas=0
        )
        db.add(perfil)
        db.commit()
        db.refresh(perfil)
    
    return perfil


@router.put(
    "/me/profile",
    response_model=PerfilUsuarioResponse,
    summary="Actualizar mi perfil",
    description="Actualizar información del perfil"
)
async def actualizar_mi_perfil(
    perfil_data: PerfilUsuarioUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar perfil del usuario"""
    perfil = db.query(PerfilUsuario).filter(
        PerfilUsuario.usuario_id == current_user.id_usuario
    ).first()
    
    if not perfil:
        perfil = PerfilUsuario(usuario_id=current_user.id_usuario)
        db.add(perfil)
    
    # Actualizar campos
    for key, value in perfil_data.dict(exclude_unset=True).items():
        setattr(perfil, key, value)
    
    db.commit()
    db.refresh(perfil)
    
    return perfil


@router.get(
    "/{user_id}/profile",
    summary="Ver perfil público de usuario",
    description="Obtener perfil público de cualquier usuario"
)
async def get_perfil_publico(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Ver perfil público de un usuario"""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    perfil = db.query(PerfilUsuario).filter(
        PerfilUsuario.usuario_id == user_id
    ).first()
    
    if not perfil:
        return {
            "usuario_id": user_id,
            "nombre": usuario.nombre_completo or "Usuario",
            "es_vendedor": False,
            "calificacion_vendedor": 0.0,
            "total_ventas": 0
        }
    
    return {
        "usuario_id": user_id,
        "nombre": usuario.nombre_completo or "Usuario",
        "foto_perfil": perfil.foto_perfil,
        "ciudad": perfil.ciudad,
        "biografia": perfil.biografia,
        "es_vendedor": perfil.es_vendedor,
        "calificacion_vendedor": float(perfil.calificacion_vendedor) if perfil.calificacion_vendedor else 0.0,
        "total_ventas": perfil.total_ventas
    }


# ============================================================================
# 🛍️ MIS PRODUCTOS (Vendedor)
# ============================================================================

@router.get(
    "/me/productos",
    summary="Mis productos publicados",
    description="Ver todos los productos que he publicado (todos los estados)"
)
async def mis_productos(
    estado: Optional[str] = Query(None, description="Filtrar por estado: disponible, pausado, vendido"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver mis productos publicados"""
    query = db.query(Producto).filter(
        Producto.vendedor_id == current_user.id_usuario
    )
    
    if estado:
        try:
            estado_enum = EstadoProducto(estado.upper())
            query = query.filter(Producto.estado_producto == estado_enum)
        except ValueError:
            pass
    
    productos = query.all()
    
    products_data = []
    for producto in productos:
        product_dict = {
            "id": producto.id_producto,
            "title": producto.titulo,
            "price": float(producto.precio),
            "stock": producto.stock,
            "categoria": producto.categoria,
            "imagen": producto.imagen,
            "estado": producto.estado_producto.value,
            "condicion": producto.condicion.value,
            "is_active": producto.is_active,
            "created_at": producto.created_at.isoformat() if producto.created_at else None
        }
        products_data.append(product_dict)
    
    # Estadísticas
    stats = {
        "total": len(productos),
        "disponibles": len([p for p in productos if p.estado_producto == EstadoProducto.DISPONIBLE]),
        "pausados": len([p for p in productos if p.estado_producto == EstadoProducto.PAUSADO]),
        "vendidos": len([p for p in productos if p.estado_producto == EstadoProducto.VENDIDO])
    }
    
    return {
        "productos": products_data,
        "estadisticas": stats
    }


# ============================================================================
# 🛒 HISTORIAL DE COMPRAS
# ============================================================================

@router.get(
    "/me/compras",
    summary="Mi historial de compras",
    description="Ver todas las compras realizadas"
)
async def mis_compras(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver historial de compras"""
    compras = db.query(Venta).filter(
        Venta.comprador_id == current_user.id_usuario
    ).order_by(Venta.fecha_venta.desc()).all()
    
    compras_data = []
    for compra in compras:
        compra_dict = {
            "id_venta": compra.id_venta,
            "producto_id": compra.producto_id,
            "producto_titulo": compra.producto.titulo,
            "vendedor_id": compra.vendedor_id,
            "vendedor_nombre": compra.vendedor.nombre_completo or "Vendedor",
            "cantidad": compra.cantidad,
            "precio_total": float(compra.precio_total),
            "estado": compra.estado_venta.value,
            "fecha_venta": compra.fecha_venta.isoformat(),
            "metodo_pago": compra.metodo_pago
        }
        compras_data.append(compra_dict)
    
    return {
        "total": len(compras),
        "compras": compras_data
    }


# ============================================================================
# 💼 HISTORIAL DE VENTAS (Vendedor)
# ============================================================================

@router.get(
    "/me/ventas",
    summary="Mi historial de ventas",
    description="Ver todas las ventas realizadas como vendedor"
)
async def mis_ventas(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver historial de ventas"""
    ventas = db.query(Venta).filter(
        Venta.vendedor_id == current_user.id_usuario
    ).order_by(Venta.fecha_venta.desc()).all()
    
    ventas_data = []
    total_ingresos = 0.0
    total_comisiones = 0.0
    
    for venta in ventas:
        venta_dict = {
            "id_venta": venta.id_venta,
            "producto_id": venta.producto_id,
            "producto_titulo": venta.producto.titulo,
            "comprador_id": venta.comprador_id,
            "comprador_nombre": venta.comprador.nombre_completo or "Comprador",
            "cantidad": venta.cantidad,
            "precio_total": float(venta.precio_total),
            "comision": float(venta.comision_plataforma),
            "ganancia_neta": float(venta.precio_total - venta.comision_plataforma),
            "estado": venta.estado_venta.value,
            "fecha_venta": venta.fecha_venta.isoformat()
        }
        ventas_data.append(venta_dict)
        
        if venta.estado_venta == EstadoVenta.COMPLETADO:
            total_ingresos += float(venta.precio_total)
            total_comisiones += float(venta.comision_plataforma)
    
    ganancia_neta = total_ingresos - total_comisiones
    
    return {
        "total_ventas": len(ventas),
        "ventas": ventas_data,
        "estadisticas": {
            "ingresos_brutos": total_ingresos,
            "comisiones_plataforma": total_comisiones,
            "ganancia_neta": ganancia_neta
        }
    }


# ============================================================================
# ⭐ VALORACIONES
# ============================================================================

@router.get(
    "/me/valoraciones",
    summary="Mis valoraciones recibidas",
    description="Ver valoraciones que he recibido"
)
async def mis_valoraciones(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver valoraciones recibidas"""
    valoraciones = db.query(Valoracion).filter(
        Valoracion.evaluado_id == current_user.id_usuario
    ).order_by(Valoracion.created_at.desc()).all()
    
    valoraciones_data = []
    suma_calificaciones = 0
    
    for val in valoraciones:
        val_dict = {
            "id": val.id_valoracion,
            "evaluador_nombre": val.evaluador.nombre_completo or "Usuario",
            "calificacion": val.calificacion,
            "comentario": val.comentario,
            "tipo": val.tipo_evaluacion.value,
            "fecha": val.created_at.isoformat()
        }
        valoraciones_data.append(val_dict)
        suma_calificaciones += val.calificacion
    
    promedio = suma_calificaciones / len(valoraciones) if valoraciones else 0.0
    
    return {
        "total": len(valoraciones),
        "promedio": round(promedio, 2),
        "valoraciones": valoraciones_data
    }


# ============================================================================
# 📊 ESTADÍSTICAS DE VENDEDOR
# ============================================================================

@router.get(
    "/me/estadisticas",
    summary="Mis estadísticas como vendedor",
    description="Estadísticas detalladas de ventas y productos"
)
async def mis_estadisticas(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Estadísticas del vendedor"""
    # Productos
    total_productos = db.query(Producto).filter(
        Producto.vendedor_id == current_user.id_usuario
    ).count()
    
    productos_activos = db.query(Producto).filter(
        Producto.vendedor_id == current_user.id_usuario,
        Producto.estado_producto == EstadoProducto.DISPONIBLE
    ).count()
    
    # Ventas
    total_ventas = db.query(Venta).filter(
        Venta.vendedor_id == current_user.id_usuario,
        Venta.estado_venta == EstadoVenta.COMPLETADO
    ).count()
    
    ingresos = db.query(func.sum(Venta.precio_total)).filter(
        Venta.vendedor_id == current_user.id_usuario,
        Venta.estado_venta == EstadoVenta.COMPLETADO
    ).scalar() or 0.0
    
    # Valoraciones
    valoraciones = db.query(Valoracion).filter(
        Valoracion.evaluado_id == current_user.id_usuario
    ).all()
    
    promedio_rating = sum([v.calificacion for v in valoraciones]) / len(valoraciones) if valoraciones else 0.0
    
    return {
        "productos": {
            "total": total_productos,
            "activos": productos_activos
        },
        "ventas": {
            "total": total_ventas,
            "ingresos_totales": float(ingresos)
        },
        "reputacion": {
            "calificacion_promedio": round(promedio_rating, 2),
            "total_valoraciones": len(valoraciones)
        }
    }
