"""
⭐ Rutas de Valoraciones y Calificaciones

Endpoints para gestión de ratings y reseñas entre compradores y vendedores.
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database import get_db
from app.models.usuario import Usuario
from app.models.venta import Venta, EstadoVenta
from app.models.valoracion import Valoracion, TipoEvaluacion
from app.models.perfil_usuario import PerfilUsuario
from app.auth import get_current_user
from app.schemas.valoracion import (
    ValoracionCreate,
    ValoracionResponse,
    ValoracionDetalle
)

router = APIRouter()


# ============================================================================
# ⭐ CREAR VALORACIÓN
# ============================================================================

@router.post(
    "/",
    response_model=ValoracionDetalle,
    status_code=status.HTTP_201_CREATED,
    summary="Crear valoración",
    description="Calificar a un usuario después de una venta completada"
)
async def crear_valoracion(
    valoracion_data: ValoracionCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nueva valoración"""
    
    # Validar venta
    venta = db.query(Venta).filter(Venta.id_venta == valoracion_data.venta_id).first()
    
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Solo se puede valorar si la venta está completada
    if venta.estado_venta != EstadoVenta.COMPLETADO:
        raise HTTPException(
            status_code=400, 
            detail="Solo se pueden valorar ventas completadas"
        )
    
    # Determinar quién está valorando a quién
    if current_user.id_usuario == venta.comprador_id:
        # Comprador valora al vendedor
        evaluado_id = venta.vendedor_id
        tipo_evaluacion = TipoEvaluacion.COMPRADOR_A_VENDEDOR
    elif current_user.id_usuario == venta.vendedor_id:
        # Vendedor valora al comprador
        evaluado_id = venta.comprador_id
        tipo_evaluacion = TipoEvaluacion.VENDEDOR_A_COMPRADOR
    else:
        raise HTTPException(
            status_code=403, 
            detail="Solo el comprador o vendedor pueden valorar esta transacción"
        )
    
    # Verificar que no haya valorado ya
    valoracion_existente = db.query(Valoracion).filter(
        Valoracion.venta_id == valoracion_data.venta_id,
        Valoracion.evaluador_id == current_user.id_usuario
    ).first()
    
    if valoracion_existente:
        raise HTTPException(
            status_code=400, 
            detail="Ya has valorado esta transacción"
        )
    
    # Crear valoración
    nueva_valoracion = Valoracion(
        venta_id=valoracion_data.venta_id,
        evaluador_id=current_user.id_usuario,
        evaluado_id=evaluado_id,
        calificacion=valoracion_data.calificacion,
        comentario=valoracion_data.comentario,
        tipo_evaluacion=tipo_evaluacion
    )
    
    db.add(nueva_valoracion)
    db.commit()
    db.refresh(nueva_valoracion)
    
    # Actualizar calificación promedio del evaluado (si es vendedor)
    if tipo_evaluacion == TipoEvaluacion.COMPRADOR_A_VENDEDOR:
        perfil = db.query(PerfilUsuario).filter(
            PerfilUsuario.usuario_id == evaluado_id
        ).first()
        
        if perfil:
            # Calcular nuevo promedio
            valoraciones = db.query(Valoracion).filter(
                Valoracion.evaluado_id == evaluado_id,
                Valoracion.tipo_evaluacion == TipoEvaluacion.COMPRADOR_A_VENDEDOR
            ).all()
            
            promedio = sum([v.calificacion for v in valoraciones]) / len(valoraciones)
            perfil.calificacion_vendedor = promedio
            db.commit()
    
    return nueva_valoracion


# ============================================================================
# 📋 VER VALORACIONES
# ============================================================================

@router.get(
    "/usuario/{usuario_id}",
    summary="Ver valoraciones de un usuario",
    description="Obtener todas las valoraciones recibidas por un usuario"
)
async def valoraciones_usuario(
    usuario_id: int,
    tipo: Optional[str] = Query(None, description="Filtrar por tipo: vendedor o comprador"),
    db: Session = Depends(get_db)
):
    """Ver valoraciones de un usuario"""
    
    # Verificar que el usuario existe
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Construir query
    query = db.query(Valoracion).filter(Valoracion.evaluado_id == usuario_id)
    
    # Filtrar por tipo
    if tipo == "vendedor":
        query = query.filter(Valoracion.tipo_evaluacion == TipoEvaluacion.COMPRADOR_A_VENDEDOR)
    elif tipo == "comprador":
        query = query.filter(Valoracion.tipo_evaluacion == TipoEvaluacion.VENDEDOR_A_COMPRADOR)
    
    valoraciones = query.order_by(Valoracion.created_at.desc()).all()
    
    # Calcular estadísticas
    if valoraciones:
        suma = sum([v.calificacion for v in valoraciones])
        promedio = suma / len(valoraciones)
        
        distribucion = {
            "5_estrellas": len([v for v in valoraciones if v.calificacion == 5]),
            "4_estrellas": len([v for v in valoraciones if v.calificacion == 4]),
            "3_estrellas": len([v for v in valoraciones if v.calificacion == 3]),
            "2_estrellas": len([v for v in valoraciones if v.calificacion == 2]),
            "1_estrella": len([v for v in valoraciones if v.calificacion == 1])
        }
    else:
        promedio = 0.0
        distribucion = {
            "5_estrellas": 0,
            "4_estrellas": 0,
            "3_estrellas": 0,
            "2_estrellas": 0,
            "1_estrella": 0
        }
    
    valoraciones_data = []
    for val in valoraciones:
        val_dict = {
            "id": val.id_valoracion,
            "evaluador_id": val.evaluador_id,
            "evaluador_nombre": val.evaluador.nombre_completo or "Usuario",
            "calificacion": val.calificacion,
            "comentario": val.comentario,
            "tipo": val.tipo_evaluacion.value,
            "fecha": val.created_at.isoformat(),
            "venta_id": val.venta_id
        }
        valoraciones_data.append(val_dict)
    
    return {
        "usuario_id": usuario_id,
        "usuario_nombre": usuario.nombre_completo or "Usuario",
        "total": len(valoraciones),
        "promedio": round(promedio, 2),
        "distribucion": distribucion,
        "valoraciones": valoraciones_data
    }


@router.get(
    "/venta/{venta_id}",
    summary="Ver valoraciones de una venta",
    description="Obtener las valoraciones asociadas a una venta específica"
)
async def valoraciones_venta(
    venta_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver valoraciones de una venta"""
    
    # Validar venta
    venta = db.query(Venta).filter(Venta.id_venta == venta_id).first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Verificar permiso (solo comprador, vendedor o admin)
    if venta.comprador_id != current_user.id_usuario and venta.vendedor_id != current_user.id_usuario and not current_user.is_admin:
        raise HTTPException(
            status_code=403, 
            detail="No tienes permiso para ver las valoraciones de esta venta"
        )
    
    valoraciones = db.query(Valoracion).filter(
        Valoracion.venta_id == venta_id
    ).all()
    
    valoraciones_data = []
    for val in valoraciones:
        val_dict = {
            "id": val.id_valoracion,
            "evaluador_id": val.evaluador_id,
            "evaluador_nombre": val.evaluador.nombre_completo or "Usuario",
            "evaluado_id": val.evaluado_id,
            "evaluado_nombre": val.evaluado.nombre_completo or "Usuario",
            "calificacion": val.calificacion,
            "comentario": val.comentario,
            "tipo": val.tipo_evaluacion.value,
            "fecha": val.created_at.isoformat()
        }
        valoraciones_data.append(val_dict)
    
    return {
        "venta_id": venta_id,
        "total": len(valoraciones),
        "valoraciones": valoraciones_data,
        "puede_valorar": {
            "como_comprador": venta.comprador_id == current_user.id_usuario and not any(
                v.evaluador_id == current_user.id_usuario for v in valoraciones
            ),
            "como_vendedor": venta.vendedor_id == current_user.id_usuario and not any(
                v.evaluador_id == current_user.id_usuario for v in valoraciones
            )
        }
    }


# ============================================================================
# 📝 MIS VALORACIONES
# ============================================================================

@router.get(
    "/me/dadas",
    summary="Valoraciones que he dado",
    description="Ver todas las valoraciones que he hecho"
)
async def mis_valoraciones_dadas(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver valoraciones que he dado"""
    valoraciones = db.query(Valoracion).filter(
        Valoracion.evaluador_id == current_user.id_usuario
    ).order_by(Valoracion.created_at.desc()).all()
    
    valoraciones_data = []
    for val in valoraciones:
        val_dict = {
            "id": val.id_valoracion,
            "evaluado_id": val.evaluado_id,
            "evaluado_nombre": val.evaluado.nombre_completo or "Usuario",
            "calificacion": val.calificacion,
            "comentario": val.comentario,
            "tipo": val.tipo_evaluacion.value,
            "fecha": val.created_at.isoformat(),
            "venta_id": val.venta_id
        }
        valoraciones_data.append(val_dict)
    
    return {
        "total": len(valoraciones),
        "valoraciones": valoraciones_data
    }


@router.get(
    "/me/recibidas",
    summary="Valoraciones que he recibido",
    description="Ver todas las valoraciones que me han dado"
)
async def mis_valoraciones_recibidas(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ver valoraciones que he recibido"""
    valoraciones = db.query(Valoracion).filter(
        Valoracion.evaluado_id == current_user.id_usuario
    ).order_by(Valoracion.created_at.desc()).all()
    
    if valoraciones:
        promedio = sum([v.calificacion for v in valoraciones]) / len(valoraciones)
    else:
        promedio = 0.0
    
    valoraciones_data = []
    for val in valoraciones:
        val_dict = {
            "id": val.id_valoracion,
            "evaluador_id": val.evaluador_id,
            "evaluador_nombre": val.evaluador.nombre_completo or "Usuario",
            "calificacion": val.calificacion,
            "comentario": val.comentario,
            "tipo": val.tipo_evaluacion.value,
            "fecha": val.created_at.isoformat(),
            "venta_id": val.venta_id
        }
        valoraciones_data.append(val_dict)
    
    return {
        "total": len(valoraciones),
        "promedio": round(promedio, 2),
        "valoraciones": valoraciones_data
    }


# ============================================================================
# 🗑️ ELIMINAR VALORACIÓN
# ============================================================================

@router.delete(
    "/{valoracion_id}",
    summary="Eliminar valoración",
    description="Eliminar una valoración propia"
)
async def eliminar_valoracion(
    valoracion_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar una valoración"""
    valoracion = db.query(Valoracion).filter(
        Valoracion.id_valoracion == valoracion_id
    ).first()
    
    if not valoracion:
        raise HTTPException(status_code=404, detail="Valoración no encontrada")
    
    # Solo el evaluador o admin puede eliminar
    if valoracion.evaluador_id != current_user.id_usuario and not current_user.is_admin:
        raise HTTPException(
            status_code=403, 
            detail="No tienes permiso para eliminar esta valoración"
        )
    
    evaluado_id = valoracion.evaluado_id
    tipo = valoracion.tipo_evaluacion
    
    db.delete(valoracion)
    db.commit()
    
    # Recalcular promedio del evaluado (si era valoración de vendedor)
    if tipo == TipoEvaluacion.COMPRADOR_A_VENDEDOR:
        perfil = db.query(PerfilUsuario).filter(
            PerfilUsuario.usuario_id == evaluado_id
        ).first()
        
        if perfil:
            valoraciones_restantes = db.query(Valoracion).filter(
                Valoracion.evaluado_id == evaluado_id,
                Valoracion.tipo_evaluacion == TipoEvaluacion.COMPRADOR_A_VENDEDOR
            ).all()
            
            if valoraciones_restantes:
                promedio = sum([v.calificacion for v in valoraciones_restantes]) / len(valoraciones_restantes)
                perfil.calificacion_vendedor = promedio
            else:
                perfil.calificacion_vendedor = 0.0
            
            db.commit()
    
    return {"mensaje": "Valoración eliminada exitosamente"}


# ============================================================================
# 📊 ESTADÍSTICAS DE VALORACIONES
# ============================================================================

@router.get(
    "/estadisticas/globales",
    summary="Estadísticas globales de valoraciones",
    description="Estadísticas generales del sistema de valoraciones"
)
async def estadisticas_globales(
    db: Session = Depends(get_db)
):
    """Estadísticas globales de valoraciones"""
    
    total_valoraciones = db.query(Valoracion).count()
    
    promedio_global = db.query(func.avg(Valoracion.calificacion)).scalar() or 0.0
    
    # Top vendedores
    top_vendedores = db.query(
        PerfilUsuario.usuario_id,
        Usuario.nombre_completo,
        PerfilUsuario.calificacion_vendedor,
        PerfilUsuario.total_ventas
    ).join(Usuario).filter(
        PerfilUsuario.es_vendedor == True,
        PerfilUsuario.total_ventas > 0
    ).order_by(
        PerfilUsuario.calificacion_vendedor.desc()
    ).limit(10).all()
    
    top_vendedores_data = [
        {
            "usuario_id": v[0],
            "nombre": v[1] or "Usuario",
            "calificacion": float(v[2]) if v[2] else 0.0,
            "total_ventas": v[3]
        }
        for v in top_vendedores
    ]
    
    return {
        "total_valoraciones": total_valoraciones,
        "promedio_global": round(float(promedio_global), 2),
        "top_vendedores": top_vendedores_data
    }
