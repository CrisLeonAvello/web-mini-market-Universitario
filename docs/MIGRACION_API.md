# 📦 Migración de API Externa a Backend Propio

## 🎯 Objetivo

Migrar el proyecto del uso de FakeStore API (externa) a un backend propio desarrollado con FastAPI + SQLAlchemy + PostgreSQL/SQLite.

---

## ✅ Cambios Realizados

### 1. **Eliminación de Dependencias Externas**

#### Archivos Eliminados:
```
frontend/src/services/
├── ❌ fakeStoreApi.js          (API externa)
├── ❌ apiExamples.js            (Ejemplos de API externa)
└── ❌ apiConfig.js              (Configuración obsoleta)

frontend/src/components/
├── ❌ ApiTestComponent.jsx      (Componente de prueba)
├── ❌ ApiDirectTest.jsx         (Test directo)
├── ❌ ApiFetchTest.jsx          (Test de fetch)
├── ❌ ApiUrlDemo.jsx            (Demo de URLs)
├── ❌ DebugInfo.jsx             (Info de debug)
├── ❌ DebugProducts.jsx         (Debug de productos)
└── ❌ SimpleApiTest.jsx         (Test simple)
```

### 2. **Nuevo Servicio de API**

#### Archivo Creado: `frontend/src/services/api.js`

**Características:**
- ✅ Integración completa con FastAPI backend
- ✅ Métodos para productos, carrito, autenticación
- ✅ Función de transformación para compatibilidad con frontend existente
- ✅ Manejo de errores centralizado
- ✅ Configuración de URL base desde variables de entorno

**Endpoints Disponibles:**

##### Productos
```javascript
- getAllProducts(params)      // GET /api/productos
- getProductById(id)          // GET /api/productos/{id}
- getProductsByCategory(cat)  // GET /api/productos?categoria={cat}
- getCategories()             // GET /api/productos/categorias
- searchProducts(query)       // GET /api/productos/buscar?q={query}
```

##### Carrito
```javascript
- getCart()                   // GET /api/carrito
- addToCart(productoId, cant) // POST /api/carrito/items
- updateCartItem(itemId, cant)// PUT /api/carrito/items/{id}
- removeFromCart(itemId)      // DELETE /api/carrito/items/{id}
- clearCart()                 // DELETE /api/carrito
```

##### Autenticación
```javascript
- login(email, password)      // POST /api/auth/login
- register(userData)          // POST /api/auth/register
- logout()                    // POST /api/auth/logout
```

### 3. **Actualización de Contextos**

#### `ProductsContext.jsx`
```javascript
// ANTES
import { getTransformedProducts } from '../services/fakeStoreApi';

// DESPUÉS
import { getTransformedProducts } from '../services';
```

**Cambios en logs:**
- ✅ "Cargando productos desde backend API..." (antes: "FakeStore API")
- ✅ Misma estructura de datos, sin breaking changes

### 4. **Reorganización de Documentación**

#### Archivos Movidos a `docs/`:
```
docs/
├── SETUP_GUIDE.md              (Guía de instalación completa)
├── QUICKSTART.md               (Inicio rápido en 5 minutos)
├── DIAGRAMA_ER.md              (Diagrama entidad-relación)
├── DESARROLLO_CHECKLIST.md    (Lista de tareas)
├── DATABASE_README.md          (Documentación de BD)
├── DOCKER_README.md            (Documentación Docker)
├── DOCKER_QUICKSTART.md        (Inicio rápido Docker)
└── MIGRACION_API.md            (Este archivo)
```

#### Archivos Eliminados:
```
❌ backend/README.md
❌ backend/app/schemas/README.md
❌ frontend/src/services/README.md
```

---

## 🚀 Próximos Pasos

### Backend - Endpoints Necesarios

Crear los siguientes archivos en el backend:

#### 1. `backend/app/routes/productos.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.producto import Producto
from ..schemas.product import ProductResponse

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/", response_model=List[ProductResponse])
async def get_productos(
    categoria: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Producto).filter(Producto.is_active == True)
    
    if categoria:
        query = query.filter(Producto.categoria == categoria)
    
    productos = query.offset(skip).limit(limit).all()
    return productos

@router.get("/{producto_id}", response_model=ProductResponse)
async def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(
        Producto.id_producto == producto_id,
        Producto.is_active == True
    ).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return producto

@router.get("/categorias", response_model=List[str])
async def get_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Producto.categoria).distinct().all()
    return [cat[0] for cat in categorias if cat[0]]

@router.get("/buscar", response_model=List[ProductResponse])
async def buscar_productos(q: str, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(
        Producto.is_active == True,
        Producto.titulo.contains(q) | Producto.descripcion.contains(q)
    ).all()
    return productos
```

#### 2. `backend/app/routes/carrito.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.carrito import Carrito
from ..models.item_carrito import ItemCarrito
from ..schemas.cart import CartResponse, AddItemRequest

router = APIRouter(prefix="/carrito", tags=["carrito"])

@router.get("/", response_model=CartResponse)
async def get_carrito(
    usuario_id: int = 1,  # TODO: Obtener de JWT token
    db: Session = Depends(get_db)
):
    carrito = db.query(Carrito).filter(
        Carrito.usuario_id == usuario_id,
        Carrito.estado == 'activo'
    ).first()
    
    if not carrito:
        # Crear carrito nuevo
        carrito = Carrito(usuario_id=usuario_id)
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    
    return carrito

@router.post("/items")
async def add_item(
    item: AddItemRequest,
    usuario_id: int = 1,  # TODO: Obtener de JWT token
    db: Session = Depends(get_db)
):
    # Implementar lógica de agregar item al carrito
    pass

@router.put("/items/{item_id}")
async def update_item(item_id: int, cantidad: int, db: Session = Depends(get_db)):
    # Implementar lógica de actualizar cantidad
    pass

@router.delete("/items/{item_id}")
async def remove_item(item_id: int, db: Session = Depends(get_db)):
    # Implementar lógica de eliminar item
    pass

@router.delete("/")
async def clear_carrito(usuario_id: int = 1, db: Session = Depends(get_db)):
    # Implementar lógica de vaciar carrito
    pass
```

#### 3. Actualizar `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import productos, carrito

app = FastAPI(title="Mini Market API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(productos.router, prefix="/api")
app.include_router(carrito.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Mini Market API v1.0"}
```

---

## 🔧 Configuración de Variables de Entorno

### Frontend: `.env`
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend: `.env`
```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📝 Checklist de Implementación

### Backend
- [ ] Crear `routes/productos.py` con CRUD completo
- [ ] Crear `routes/carrito.py` con gestión de carrito
- [ ] Crear `routes/auth.py` con JWT authentication
- [ ] Actualizar `main.py` con los nuevos routers
- [ ] Agregar middleware CORS
- [ ] Implementar manejo de errores global
- [ ] Agregar validación de datos con Pydantic schemas
- [ ] Documentar endpoints en Swagger

### Frontend
- [x] Crear `services/api.js` ✅
- [x] Actualizar `ProductsContext.jsx` ✅
- [x] Actualizar `services/index.js` ✅
- [ ] Crear `contexts/AuthContext.jsx` para autenticación
- [ ] Actualizar `CartContext.jsx` para usar nuevo API
- [ ] Agregar manejo de tokens JWT
- [ ] Implementar interceptors para autenticación
- [ ] Agregar página de login/registro

### Testing
- [ ] Probar endpoints de productos en Swagger
- [ ] Probar flujo completo de carrito
- [ ] Probar autenticación y autorización
- [ ] Verificar CORS en frontend
- [ ] Testing de integración E2E

---

## 🎨 Estructura de Datos

### Producto (Backend → Frontend)

**Backend Response:**
```json
{
  "id_producto": 1,
  "titulo": "Laptop HP",
  "descripcion": "...",
  "precio": 899.99,
  "categoria": "Tecnología",
  "imagen": "https://...",
  "stock": 15,
  "rating_rate": 4.5,
  "rating_count": 120,
  "is_active": true
}
```

**Frontend (Transformado):**
```javascript
{
  id: 1,
  title: "Laptop HP",
  name: "Laptop HP",
  price: 899.99,
  description: "...",
  category: "Tecnología",
  image: "https://...",
  stock: 15,
  rating: {
    rate: 4.5,
    count: 120
  },
  featured: false,
  tags: ["Tecnología"]
}
```

---

## 🐛 Problemas Conocidos

### 1. Autenticación
**Problema:** El frontend actualmente no maneja autenticación.
**Solución:** Implementar AuthContext con JWT tokens.

### 2. CORS
**Problema:** Posibles errores CORS en desarrollo.
**Solución:** Ya configurado en backend con `allow_origins=["http://localhost:5173"]`.

### 3. Imágenes de Productos
**Problema:** Las URLs de imágenes están hardcodeadas.
**Solución:** Implementar upload de imágenes o usar CDN.

---

## 📚 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [React Context API](https://react.dev/reference/react/useContext)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✨ Ventajas de la Nueva Arquitectura

✅ **Control Total:** Gestión completa de datos y lógica de negocio
✅ **Seguridad:** Autenticación JWT, validación de datos
✅ **Escalabilidad:** Base de datos relacional con índices optimizados
✅ **Mantenibilidad:** Código bien estructurado y documentado
✅ **Performance:** Caché, queries optimizadas, relaciones eficientes
✅ **Offline Support:** Posibilidad de trabajar con datos locales
✅ **Customización:** Funcionalidades específicas del negocio

---

**Última actualización:** Diciembre 2024
**Autor:** Equipo de Desarrollo Mini Market
