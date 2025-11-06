"""
Ejemplo de uso de Schemas en FastAPI

Este archivo muestra cómo usar los schemas en endpoints reales.
Copia y adapta estos ejemplos a tus rutas.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductList,
    CartItemCreate,
    CartResponse,
    UserCreate,
    UserResponse,
    UserLogin,
    Token
)

# ==================== PRODUCTOS ====================

router_products = APIRouter(prefix="/api/products", tags=["Products"])

@router_products.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    """
    Crear un nuevo producto
    
    - **product**: Datos del producto (validados automáticamente por ProductCreate)
    - **Retorna**: ProductResponse con el producto creado
    
    Validaciones automáticas:
    - title: 1-200 caracteres
    - price: Debe ser > 0
    - stock: No puede ser negativo
    """
    # Aquí iría la lógica para guardar en BD
    # Por ahora, simulamos la respuesta
    
    product_data = product.model_dump()
    product_data["id"] = 1  # Simulado
    product_data["created_at"] = "2025-11-05T10:30:00"
    product_data["updated_at"] = None
    product_data["rating"] = {"rate": 0.0, "count": 0}
    
    return product_data


@router_products.get("/", response_model=ProductList)
async def list_products(
    page: int = 1,
    page_size: int = 10,
    category: str = None
):
    """
    Listar productos con paginación
    
    - **page**: Número de página (default: 1)
    - **page_size**: Productos por página (default: 10, max: 100)
    - **category**: Filtrar por categoría (opcional)
    """
    # Aquí iría la lógica para consultar BD
    # Por ahora, retornamos ejemplo
    
    return {
        "products": [],
        "total": 0,
        "page": page,
        "page_size": page_size,
        "total_pages": 0
    }


@router_products.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """
    Obtener un producto por ID
    
    - **product_id**: ID del producto
    - **Retorna**: ProductResponse con los datos del producto
    - **Error 404**: Si el producto no existe
    """
    # Aquí iría la lógica para consultar BD
    # Simulamos que no existe
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Producto con ID {product_id} no encontrado"
    )


@router_products.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductUpdate):
    """
    Actualizar un producto
    
    - **product_id**: ID del producto a actualizar
    - **product**: Campos a actualizar (todos opcionales)
    - **Retorna**: ProductResponse con el producto actualizado
    
    Solo actualiza los campos enviados (partial update)
    """
    # Validar que el producto existe
    # Actualizar solo los campos enviados
    # product.model_dump(exclude_unset=True) → Solo campos enviados
    
    pass


@router_products.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int):
    """
    Eliminar un producto
    
    - **product_id**: ID del producto a eliminar
    - **Retorna**: 204 No Content (sin cuerpo)
    """
    # Aquí iría la lógica para eliminar de BD
    pass


# ==================== CARRITO ====================

router_cart = APIRouter(prefix="/api/cart", tags=["Cart"])

@router_cart.get("/", response_model=CartResponse)
async def get_cart(user_id: int = 1):
    """
    Obtener el carrito del usuario
    
    - **user_id**: ID del usuario (en producción viene del token JWT)
    - **Retorna**: CartResponse con todos los items
    """
    # Aquí iría la lógica para consultar BD
    return {
        "user_id": user_id,
        "items": [],
        "total_items": 0,
        "subtotal": 0.0,
        "tax": 0.0,
        "shipping": 0.0,
        "total": 0.0,
        "created_at": "2025-11-05T10:00:00",
        "updated_at": "2025-11-05T10:00:00"
    }


@router_cart.post("/items", status_code=status.HTTP_201_CREATED)
async def add_to_cart(item: CartItemCreate, user_id: int = 1):
    """
    Agregar un producto al carrito
    
    - **item**: CartItemCreate con product_id y quantity
    - **user_id**: ID del usuario
    
    Validaciones automáticas:
    - product_id: Debe ser > 0
    - quantity: Debe ser >= 1
    """
    # Validar que el producto existe
    # Verificar stock disponible
    # Agregar o actualizar item en el carrito
    
    return {"message": "Producto agregado al carrito"}


@router_cart.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(item_id: int, user_id: int = 1):
    """
    Eliminar un item del carrito
    
    - **item_id**: ID del item en el carrito
    - **user_id**: ID del usuario
    """
    # Validar que el item pertenece al usuario
    # Eliminar de BD
    pass


# ==================== USUARIOS ====================

router_users = APIRouter(prefix="/api/users", tags=["Users"])

@router_users.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """
    Registrar un nuevo usuario
    
    - **user**: UserCreate con email, username, password
    
    Validaciones automáticas:
    - email: Formato válido
    - username: 3-50 caracteres, solo alfanuméricos
    - password: Mínimo 8 caracteres
    """
    # Validar que email y username no existan
    # Hashear contraseña con bcrypt
    # Guardar en BD
    # NO retornar la contraseña (UserResponse la excluye)
    
    pass


@router_users.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Autenticar usuario y generar token JWT
    
    - **credentials**: UserLogin con username y password
    - **Retorna**: Token JWT de acceso
    """
    # Buscar usuario por username o email
    # Verificar contraseña
    # Generar token JWT
    # Retornar token
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas",
        headers={"WWW-Authenticate": "Bearer"}
    )


@router_users.get("/me", response_model=UserResponse)
async def get_current_user():
    """
    Obtener perfil del usuario actual
    
    Requiere autenticación (token JWT en headers)
    """
    # Extraer usuario del token JWT
    # Retornar datos del usuario (sin password)
    pass


# ==================== COMO USAR EN main.py ====================

"""
Para usar estos routers en tu aplicación:

1. En app/main.py, importa y registra los routers:

```python
from app.routes.examples import router_products, router_cart, router_users

app.include_router(router_products)
app.include_router(router_cart)
app.include_router(router_users)
```

2. Levanta el servidor:
```bash
uvicorn app.main:app --reload
```

3. Visita la documentación:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

4. Prueba los endpoints con los schemas automáticamente validados!
"""
