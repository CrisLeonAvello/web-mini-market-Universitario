"""
Rutas del API para Carrito de Compras y Checkout
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal

from app.database import get_db
from app.auth import get_current_user
from app.models.usuario import Usuario
from app.models.carrito import Carrito
from app.models.item_carrito import ItemCarrito
from app.models.producto import Producto
from app.models.venta import Venta
from app.schemas.carrito import (
    CarritoResponse,
    ItemCarritoCreate,
    ItemCarritoUpdate,
    ItemCarritoResponse,
    CheckoutRequest,
    CheckoutResponse
)

router = APIRouter()


# ==================== GET CARRITO ====================
@router.get("/", response_model=CarritoResponse)
async def obtener_carrito(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtener el carrito activo del usuario actual
    """
    # Buscar carrito (activo o inactivo)
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id_usuario
    ).first()
    
    if not carrito:
        # Crear carrito nuevo si no existe
        carrito = Carrito(
            usuario_id=current_user.id_usuario,
            impuesto=Decimal("0.00"),
            envio=Decimal("0.00"),
            is_active=True
        )
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    elif not carrito.is_active:
        # Reactivar carrito inactivo
        carrito.is_active = True
        db.commit()
    
    # Obtener items con productos
    items = db.query(ItemCarrito).filter(
        ItemCarrito.carrito_id == carrito.id_carrito
    ).all()
    
    # Calcular totales (convertir todo a float para evitar errores de tipo)
    subtotal = float(sum(item.subtotal for item in items))
    impuesto = float(carrito.impuesto)
    envio = float(carrito.envio)
    total = subtotal + impuesto + envio
    
    return CarritoResponse(
        id_carrito=carrito.id_carrito,
        usuario_id=carrito.usuario_id,
        items=[
            ItemCarritoResponse(
                id_item=item.id_item,
                producto_id=item.producto_id,
                cantidad=item.cantidad,
                precio_unitario=float(item.precio_unitario),
                subtotal=item.subtotal,
                producto=item.producto
            )
            for item in items
        ],
        subtotal=subtotal,
        impuesto=impuesto,
        envio=envio,
        total=total,
        total_items=len(items),
        total_productos=sum(item.cantidad for item in items)
    )


# ==================== AGREGAR AL CARRITO ====================
@router.post("/items", status_code=status.HTTP_201_CREATED, response_model=ItemCarritoResponse)
async def agregar_al_carrito(
    item_data: ItemCarritoCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Agregar un producto al carrito o actualizar cantidad si ya existe
    """
    # Verificar que el producto existe y está disponible
    producto = db.query(Producto).filter(
        Producto.id_producto == item_data.producto_id,
        Producto.is_active == True
    ).first()
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado o no disponible"
        )
    
    # Verificar stock
    if producto.stock < item_data.cantidad:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"
        )
    
    # Buscar o crear carrito activo
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id_usuario,
        Carrito.is_active == True
    ).first()
    
    if not carrito:
        carrito = Carrito(
            usuario_id=current_user.id_usuario,
            impuesto=Decimal("0.00"),
            envio=Decimal("5.99"),  # Envío estándar
            is_active=True
        )
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    
    # Verificar si el producto ya está en el carrito
    item_existente = db.query(ItemCarrito).filter(
        ItemCarrito.carrito_id == carrito.id_carrito,
        ItemCarrito.producto_id == item_data.producto_id
    ).first()
    
    if item_existente:
        # Actualizar cantidad
        nueva_cantidad = item_existente.cantidad + item_data.cantidad
        if nueva_cantidad > producto.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"
            )
        item_existente.cantidad = nueva_cantidad
        db.commit()
        db.refresh(item_existente)
        return ItemCarritoResponse(
            id_item=item_existente.id_item,
            producto_id=item_existente.producto_id,
            cantidad=item_existente.cantidad,
            precio_unitario=float(item_existente.precio_unitario),
            subtotal=item_existente.subtotal,
            producto=item_existente.producto
        )
    else:
        # Crear nuevo item
        nuevo_item = ItemCarrito(
            carrito_id=carrito.id_carrito,
            producto_id=item_data.producto_id,
            cantidad=item_data.cantidad,
            precio_unitario=producto.precio
        )
        db.add(nuevo_item)
        db.commit()
        db.refresh(nuevo_item)
        return ItemCarritoResponse(
            id_item=nuevo_item.id_item,
            producto_id=nuevo_item.producto_id,
            cantidad=nuevo_item.cantidad,
            precio_unitario=float(nuevo_item.precio_unitario),
            subtotal=nuevo_item.subtotal,
            producto=nuevo_item.producto
        )


# ==================== ACTUALIZAR CANTIDAD ====================
@router.put("/items/{item_id}", response_model=ItemCarritoResponse)
async def actualizar_item_carrito(
    item_id: int,
    item_data: ItemCarritoUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Actualizar la cantidad de un item en el carrito
    """
    # Buscar item
    item = db.query(ItemCarrito).join(Carrito).filter(
        ItemCarrito.id_item == item_id,
        Carrito.usuario_id == current_user.id_usuario,
        Carrito.is_active == True
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item no encontrado en tu carrito"
        )
    
    # Verificar stock
    producto = item.producto
    if item_data.cantidad > producto.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"
        )
    
    # Actualizar cantidad
    item.cantidad = item_data.cantidad
    db.commit()
    db.refresh(item)
    
    return ItemCarritoResponse(
        id_item=item.id_item,
        producto_id=item.producto_id,
        cantidad=item.cantidad,
        precio_unitario=float(item.precio_unitario),
        subtotal=item.subtotal,
        producto=item.producto
    )


# ==================== ELIMINAR ITEM ====================
@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_item_carrito(
    item_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Eliminar un item del carrito
    """
    # Buscar item
    item = db.query(ItemCarrito).join(Carrito).filter(
        ItemCarrito.id_item == item_id,
        Carrito.usuario_id == current_user.id_usuario,
        Carrito.is_active == True
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item no encontrado en tu carrito"
        )
    
    db.delete(item)
    db.commit()
    return None


# ==================== VACIAR CARRITO ====================
@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def vaciar_carrito(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Vaciar todo el carrito
    """
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id_usuario,
        Carrito.is_active == True
    ).first()
    
    if carrito:
        # Eliminar todos los items
        db.query(ItemCarrito).filter(
            ItemCarrito.carrito_id == carrito.id_carrito
        ).delete()
        db.commit()
    
    return None


# ==================== CHECKOUT ====================
@router.post("/checkout", response_model=CheckoutResponse)
async def realizar_checkout(
    checkout_data: CheckoutRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Procesar el checkout y crear las ventas
    """
    print(f"🛒 CHECKOUT - Usuario: {current_user.email} (ID: {current_user.id_usuario})")
    print(f"📦 Datos de checkout: {checkout_data.dict()}")
    
    # Buscar carrito activo
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == current_user.id_usuario,
        Carrito.is_active == True
    ).first()
    
    print(f"🛒 Carrito encontrado: {carrito.id_carrito if carrito else 'None'}")
    
    if not carrito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tienes un carrito activo"
        )
    
    # Obtener items
    print(f"📋 Obteniendo items del carrito {carrito.id_carrito}...")
    items = db.query(ItemCarrito).filter(
        ItemCarrito.carrito_id == carrito.id_carrito
    ).all()
    print(f"📦 Items encontrados: {len(items)}")
    
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tu carrito está vacío"
        )
    
    # Crear ventas y verificar stock
    ventas_creadas = []
    try:
        print(f"🔄 Procesando {len(items)} items...")
        for i, item in enumerate(items):
            print(f"  Item {i+1}: Producto ID {item.producto_id}, Cantidad {item.cantidad}")
            
            try:
                producto = item.producto
                print(f"  ✅ Producto cargado: {producto.titulo if producto else 'None'}")
            except Exception as e:
                print(f"  ❌ Error al cargar producto: {str(e)}")
                raise
            
            # Verificar stock
            print(f"  📊 Stock disponible: {producto.stock}")
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuficiente para {producto.titulo}. Solo hay {producto.stock} unidades"
                )
            
            # Crear venta
            print(f"  💰 Creando venta...")
            print(f"    Comprador: {current_user.id_usuario}")
            print(f"    Vendedor: {producto.vendedor_id}")
            print(f"    Precio unitario: {item.precio_unitario}")
            print(f"    Precio total: {item.subtotal}")
            
            try:
                venta = Venta(
                    comprador_id=current_user.id_usuario,
                    vendedor_id=producto.vendedor_id,
                    producto_id=producto.id_producto,
                    cantidad=item.cantidad,
                    precio_unitario=Decimal(str(item.precio_unitario)),  # ← AGREGADO
                    precio_total=Decimal(str(item.subtotal)),
                    estado_venta="PENDIENTE",
                    metodo_pago=checkout_data.metodo_pago
                )
                print(f"  ✅ Venta creada exitosamente")
            except Exception as e:
                print(f"  ❌ Error al crear venta: {str(e)}")
                raise
            db.add(venta)
            ventas_creadas.append(venta)
            
            # Reducir stock
            producto.stock -= item.cantidad
            
            # Si se agota, cambiar estado
            if producto.stock == 0:
                producto.estado_producto = "VENDIDO"
        
        # Eliminar items del carrito
        for item in items:
            db.delete(item)
        
        # Desactivar carrito
        carrito.is_active = False
        
        db.commit()
        
        # Calcular totales
        subtotal = sum(float(venta.precio_total) for venta in ventas_creadas)
        impuesto = float(carrito.impuesto)
        envio = float(carrito.envio)
        total = subtotal + impuesto + envio
        
        return CheckoutResponse(
            mensaje="Compra realizada exitosamente",
            numero_orden=f"ORD-{ventas_creadas[0].id_venta}",
            total_ventas=len(ventas_creadas),
            subtotal=subtotal,
            impuesto=impuesto,
            envio=envio,
            total=total,
            ventas_ids=[venta.id_venta for venta in ventas_creadas]
        )
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la compra: {str(e)}"
        )
