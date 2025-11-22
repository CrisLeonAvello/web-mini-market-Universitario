"""
💰 Rutas de Ventas y Transacciones

Endpoints para gestión de ventas, proceso de compra y seguimiento de pedidos.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from decimal import Decimal

from app.database import get_db
from app.models.usuario import Usuario
from app.models.producto import Producto, EstadoProducto
from app.models.venta import Venta, EstadoVenta
from app.models.perfil_usuario import PerfilUsuario
from app.models.valoracion import Valoracion
from app.auth import get_current_user
from app.schemas.venta import VentaCreate, VentaResponse, VentaDetalle

router = APIRouter()


# ============================================================================
# 🛒 CREAR VENTA (Proceso de Compra)
# ============================================================================

@router.post(
    "/",
    response_model=VentaDetalle,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva venta",
    description="Procesar compra de un producto"
)
async def crear_venta(
    venta_data: VentaCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nueva venta/compra"""
    
    # Validar producto
    producto = db.query(Producto).filter(
        Producto.id_producto == venta_data.producto_id
    ).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar que no sea su propio producto
    if producto.vendedor_id == current_user.id_usuario:
        raise HTTPException(
            status_code=400, 
            detail="No puedes comprar tus propios productos"
        )
    
    # Verificar disponibilidad
    if producto.estado_producto != EstadoProducto.DISPONIBLE:
        raise HTTPException(
            status_code=400, 
            detail=f"Producto no disponible (estado: {producto.estado_producto.value})"
        )
    
    # Verificar stock
    if producto.stock < venta_data.cantidad:
        raise HTTPException(
            status_code=400, 
            detail=f"Stock insuficiente (disponible: {producto.stock})"
        )
    
    # Calcular precio total
    precio_total = Decimal(producto.precio) * venta_data.cantidad
    comision = precio_total * Decimal("0.10")  # 10% de comisión
    
    # Crear venta
    nueva_venta = Venta(
        producto_id=venta_data.producto_id,
        comprador_id=current_user.id_usuario,
        vendedor_id=producto.vendedor_id,
        cantidad=venta_data.cantidad,
        precio_total=precio_total,
        comision_plataforma=comision,
        estado_venta=EstadoVenta.PENDIENTE,
        metodo_pago=venta_data.metodo_pago,
        direccion_envio=venta_data.direccion_envio or "",
        notas_comprador=venta_data.notas_comprador
    )
    
    db.add(nueva_venta)
    
    # Actualizar stock del producto
    producto.stock -= venta_data.cantidad
    
    # Si stock llega a 0, marcar como vendido
    if producto.stock == 0:
        producto.estado_producto = EstadoProducto.VENDIDO
    
    db.commit()
    db.refresh(nueva_venta)
    
    return nueva_venta


# ============================================================================
# 📋 DETALLE DE VENTA
# ============================================================================

@router.get(
    "/{venta_id}",
    response_model=VentaDetalle,
    summary="Ver detalle de venta",
    description="Obtener información detallada de una venta"
)
async def detalle_venta(
    venta_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver detalle de una venta"""
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Verificar que sea el comprador o el vendedor
    if venta.comprador_id != current_user.id_usuario and venta.vendedor_id != current_user.id_usuario and not current_user.is_admin:
        raise HTTPException(
            status_code=403, 
            detail="No tienes permiso para ver esta venta"
        )
    
    return venta


# ============================================================================
# 📦 ACTUALIZAR ESTADO DE VENTA
# ============================================================================

@router.patch(
    "/{venta_id}/pagar",
    summary="Marcar como pagado",
    description="Confirmar pago de la venta (comprador)"
)
async def marcar_pagado(
    venta_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar venta como pagada"""
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Solo el comprador puede marcar como pagado
    if venta.comprador_id != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="Solo el comprador puede confirmar el pago")
    
    if venta.estado_venta != EstadoVenta.PENDIENTE:
        raise HTTPException(status_code=400, detail="La venta no está en estado pendiente")
    
    venta.estado_venta = EstadoVenta.PAGADO
    db.commit()
    
    return {"mensaje": "Pago confirmado", "estado": venta.estado_venta.value}


@router.patch(
    "/{venta_id}/enviar",
    summary="Marcar como enviado",
    description="Confirmar envío del producto (vendedor)"
)
async def marcar_enviado(
    venta_id: int,
    numero_seguimiento: Optional[str] = None,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar venta como enviada"""
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Solo el vendedor puede marcar como enviado
    if venta.vendedor_id != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="Solo el vendedor puede confirmar el envío")
    
    if venta.estado_venta != EstadoVenta.PAGADO:
        raise HTTPException(status_code=400, detail="La venta debe estar pagada primero")
    
    venta.estado_venta = EstadoVenta.ENVIADO
    venta.fecha_envio = datetime.utcnow()
    
    if numero_seguimiento:
        venta.numero_seguimiento = numero_seguimiento
    
    db.commit()
    
    return {
        "mensaje": "Envío confirmado", 
        "estado": venta.estado_venta.value,
        "fecha_envio": venta.fecha_envio.isoformat()
    }


@router.patch(
    "/{venta_id}/completar",
    summary="Completar venta",
    description="Marcar venta como completada (comprador al recibir)"
)
async def completar_venta(
    venta_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Completar venta"""
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Solo el comprador puede completar
    if venta.comprador_id != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="Solo el comprador puede completar la venta")
    
    if venta.estado_venta != EstadoVenta.ENVIADO:
        raise HTTPException(status_code=400, detail="La venta debe estar enviada primero")
    
    venta.estado_venta = EstadoVenta.COMPLETADO
    venta.fecha_completado = datetime.utcnow()
    
    # Actualizar contador de ventas del vendedor
    perfil_vendedor = db.query(PerfilUsuario).filter(
        PerfilUsuario.usuario_id == venta.vendedor_id
    ).first()
    
    if perfil_vendedor:
        perfil_vendedor.total_ventas += 1
    
    db.commit()
    
    return {
        "mensaje": "Venta completada exitosamente", 
        "estado": venta.estado_venta.value,
        "fecha_completado": venta.fecha_completado.isoformat()
    }


@router.patch(
    "/{venta_id}/cancelar",
    summary="Cancelar venta",
    description="Cancelar una venta (comprador o vendedor antes de envío)"
)
async def cancelar_venta(
    venta_id: int,
    motivo: Optional[str] = None,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancelar venta"""
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Verificar que sea comprador o vendedor
    if venta.comprador_id != current_user.id_usuario and venta.vendedor_id != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No tienes permiso para cancelar esta venta")
    
    # Solo se puede cancelar antes de enviarse
    if venta.estado_venta in [EstadoVenta.ENVIADO, EstadoVenta.COMPLETADO]:
        raise HTTPException(status_code=400, detail="No se puede cancelar una venta ya enviada o completada")
    
    venta.estado_venta = EstadoVenta.CANCELADO
    
    # Devolver stock al producto
    producto = db.query(Producto).filter(Producto.id_producto == venta.producto_id).first()
    if producto:
        producto.stock += venta.cantidad
        if producto.estado_producto == EstadoProducto.VENDIDO:
            producto.estado_producto = EstadoProducto.DISPONIBLE
    
    db.commit()
    
    return {
        "mensaje": "Venta cancelada exitosamente", 
        "estado": venta.estado_venta.value,
        "motivo": motivo
    }


# ============================================================================
# 📊 ESTADÍSTICAS DE VENTAS
# ============================================================================

@router.get(
    "/estadisticas/resumen",
    summary="Resumen de ventas",
    description="Estadísticas generales de ventas del usuario"
)
async def estadisticas_ventas(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Estadísticas de ventas"""
    
    # Como vendedor
    ventas = db.query(Venta).filter(
        Venta.vendedor_id == current_user.id_usuario
    ).all()
    
    # Como comprador
    compras = db.query(Venta).filter(
        Venta.comprador_id == current_user.id_usuario
    ).all()
    
    # Calcular estadísticas de ventas
    ventas_completadas = [v for v in ventas if v.estado_venta == EstadoVenta.COMPLETADO]
    ingresos_totales = sum([float(v.precio_total) for v in ventas_completadas])
    comisiones = sum([float(v.comision_plataforma) for v in ventas_completadas])
    
    # Calcular estadísticas de compras
    compras_completadas = [c for c in compras if c.estado_venta == EstadoVenta.COMPLETADO]
    gastos_totales = sum([float(c.precio_total) for c in compras_completadas])
    
    return {
        "como_vendedor": {
            "total_ventas": len(ventas),
            "completadas": len(ventas_completadas),
            "pendientes": len([v for v in ventas if v.estado_venta == EstadoVenta.PENDIENTE]),
            "en_proceso": len([v for v in ventas if v.estado_venta in [EstadoVenta.PAGADO, EstadoVenta.ENVIADO]]),
            "ingresos_brutos": ingresos_totales,
            "comisiones_plataforma": comisiones,
            "ganancia_neta": ingresos_totales - comisiones
        },
        "como_comprador": {
            "total_compras": len(compras),
            "completadas": len(compras_completadas),
            "pendientes": len([c for c in compras if c.estado_venta == EstadoVenta.PENDIENTE]),
            "en_proceso": len([c for c in compras if c.estado_venta in [EstadoVenta.PAGADO, EstadoVenta.ENVIADO]]),
            "gasto_total": gastos_totales
        }
    }
