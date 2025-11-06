# Schemas - Modelos Pydantic

Esta carpeta contiene todos los **schemas** (modelos Pydantic) del proyecto.

## 📚 ¿Qué son los Schemas?

Los schemas son modelos de datos que definen:
- **Estructura**: Qué campos tiene un objeto
- **Tipos**: Qué tipo de dato es cada campo
- **Validación**: Reglas que deben cumplir los datos
- **Documentación**: Descripciones y ejemplos para Swagger/ReDoc

## 🗂️ Organización

```
schemas/
├── __init__.py      # Exporta todos los schemas
├── product.py       # Schemas de productos
├── cart.py          # Schemas del carrito
├── user.py          # Schemas de usuarios
└── README.md        # Este archivo
```

## 📝 Tipos de Schemas

### 1. **Base Schemas**
Contienen campos comunes compartidos entre otros schemas.

```python
class ProductBase(BaseModel):
    title: str
    price: float
    category: str
```

### 2. **Create Schemas**
Para crear nuevos recursos (POST requests).

```python
class ProductCreate(ProductBase):
    stock: int = 0
```

### 3. **Update Schemas**
Para actualizar recursos (PUT/PATCH requests). Todos los campos son opcionales.

```python
class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
```

### 4. **Response Schemas**
Para respuestas de la API. Incluyen campos como ID y timestamps.

```python
class ProductResponse(ProductBase):
    id: int
    created_at: datetime
```

## 🎯 Uso en Endpoints

```python
from app.schemas import ProductCreate, ProductResponse

@app.post("/products/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    """
    - `product: ProductCreate` → Valida datos de entrada
    - `response_model=ProductResponse` → Serializa salida
    """
    # FastAPI valida automáticamente
    return created_product
```

## ✅ Validaciones Disponibles

### Strings
```python
name: str = Field(min_length=3, max_length=50)
username: str = Field(pattern="^[a-zA-Z0-9_]+$")
email: EmailStr  # Valida formato de email
url: HttpUrl     # Valida URL
```

### Números
```python
price: float = Field(gt=0)           # Greater than (>)
age: int = Field(ge=18, le=100)      # Greater/Less or equal (>=, <=)
discount: float = Field(ge=0, le=1)  # Entre 0 y 1
```

### Opcionales
```python
description: Optional[str] = None
middle_name: Optional[str] = Field(None, max_length=50)
```

### Listas
```python
tags: List[str] = []
items: List[ProductResponse]
```

## 📖 Documentación Automática

Los schemas generan automáticamente:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Con:
- Descripción de campos
- Tipos de datos
- Ejemplos
- Validaciones

## 🔒 Seguridad

**IMPORTANTE**: Los response schemas NO deben incluir:
- ❌ Contraseñas
- ❌ Tokens de API
- ❌ Datos sensibles

```python
class UserResponse(BaseModel):
    id: int
    email: str
    # ❌ NO incluir: password: str
```

## 🎨 Mejores Prácticas

1. **Un archivo por recurso**: `product.py`, `cart.py`, `user.py`
2. **Nombres descriptivos**: `ProductCreate`, `ProductUpdate`, `ProductResponse`
3. **Documentar campos**: Usar `Field(description="...")`
4. **Ejemplos útiles**: Agregar `examples=["valor"]`
5. **Validaciones estrictas**: Usar Field con validaciones
6. **Reutilizar schemas**: Heredar de schemas base

## 📚 Recursos

- [Pydantic Documentation](https://docs.pydantic.dev/)
- [FastAPI Schema Documentation](https://fastapi.tiangolo.com/tutorial/body/)
- [Field Validation](https://docs.pydantic.dev/latest/concepts/fields/)
