# Backend - FastAPI

Backend API para el proyecto Web Mini Market Universitario.

## 📋 Requisitos

- Python 3.8 o superior
- pip

## 🚀 Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
```

2. Activar entorno virtual:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## ▶️ Ejecutar el servidor

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en: http://localhost:8000

Documentación interactiva: http://localhost:8000/docs

## 📁 Estructura

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # Punto de entrada FastAPI
│   ├── config.py         # Configuración (Pydantic Settings)
│   ├── schemas/          # 🆕 Schemas Pydantic (validación)
│   │   ├── __init__.py
│   │   ├── product.py    # Schemas de productos
│   │   ├── cart.py       # Schemas del carrito
│   │   ├── user.py       # Schemas de usuarios
│   │   └── README.md     # Documentación de schemas
│   ├── models/           # Modelos de base de datos (SQLAlchemy)
│   │   ├── __init__.py
│   │   ├── product.py
│   │   └── user.py
│   ├── routes/           # Endpoints de la API
│   │   ├── __init__.py
│   │   ├── examples.py   # 🆕 Ejemplos de uso de schemas
│   │   ├── products.py
│   │   ├── cart.py
│   │   └── auth.py
│   ├── services/         # Lógica de negocio
│   │   └── __init__.py
│   └── database.py       # Conexión a base de datos
├── requirements.txt      # Dependencias Python
├── .env.example         # 🆕 Ejemplo de configuración
├── .gitignore
└── README.md
```

## 🔌 Endpoints (Planificados)

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Detalle de producto
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/items` - Agregar al carrito
- `DELETE /api/cart/items/{id}` - Eliminar del carrito

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## 🗄️ Base de Datos

Por defecto se puede usar SQLite para desarrollo:
- Archivo: `app.db`
- Para producción se recomienda PostgreSQL o MySQL

## 🔐 Seguridad

- CORS configurado para localhost:5173 (frontend)
- Autenticación JWT (por implementar)
- Validación de datos con Pydantic

## 📦 Dependencias Principales

- `fastapi` - Framework web
- `uvicorn[standard]` - Servidor ASGI
- `pydantic` - Validación de datos (schemas)
- `pydantic-settings` - Gestión de configuración
- `sqlalchemy` - ORM para base de datos (opcional)
- `python-jose[cryptography]` - JWT para autenticación (opcional)
- `passlib[bcrypt]` - Hash de contraseñas (opcional)

## 🔍 Schemas vs Models

| Concepto | Schemas (Pydantic) | Models (SQLAlchemy) |
|----------|-------------------|---------------------|
| **Ubicación** | `app/schemas/` | `app/models/` |
| **Propósito** | Validación y serialización | Mapeo a tablas de BD |
| **Tecnología** | Pydantic BaseModel | SQLAlchemy Base |
| **Uso** | Request/Response de API | Persistencia en BD |
| **Ejemplo** | `ProductCreate`, `ProductResponse` | `Product` (tabla) |
