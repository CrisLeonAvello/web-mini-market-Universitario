# 🎓 StudiMarket - Mini Market Universitario

## 📖 Descripción
Sistema completo de e-commerce universitario con autenticación JWT, gestión de productos y carrito de compras. Desarrollado con React + FastAPI + MySQL.

## 🚀 Características Principales

### 🔐 Autenticación Completa
- ✅ Registro de usuarios con validación
- ✅ Login/logout con JWT tokens
- ✅ Verificación de sesiones
- ✅ Roles de usuario (admin/cliente)
- ✅ Persistencia de sesión

### 🛍️ Gestión de Productos
- ✅ Catálogo completo con 10 productos
- ✅ Precios en CLP (Pesos Chilenos) sin comas
- ✅ Filtros por categoría y precio
- ✅ Búsqueda en tiempo real
- ✅ Paginación de resultados

### 🎨 Interfaz de Usuario
- ✅ Tema espacial con animaciones
- ✅ Navegación tipo Amazon (login en página separada)
- ✅ Landing page con productos destacados
- ✅ Responsive design
- ✅ Carrito de compras funcional

### 🗄️ Base de Datos
- ✅ MySQL 8.0 con Docker
- ✅ 10 productos preinstalados
- ✅ Usuarios con contraseñas hasheadas
- ✅ Migraciones con Alembic

## 📁 Estructura del Proyecto

```
web-mini-market-Universitario/
├── frontend/                    # Aplicación React + Vite
│   ├── src/
│   │   ├── components/         # Componentes de UI
│   │   │   ├── Cart.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ...
│   │   ├── contexts/           # Context API
│   │   │   ├── CartContext.jsx
│   │   │   ├── ProductsContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── services/           # Servicios API
│   │   │   ├── apiConfig.js
│   │   │   └── fakeStoreApi.js
│   │   └── main.jsx            # Punto de entrada
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # Punto de entrada FastAPI
│   │   ├── config.py           # Configuración
│   │   ├── models/             # Modelos de datos (Pydantic/SQLAlchemy)
│   │   │   └── __init__.py
│   │   ├── routes/             # Endpoints de la API
│   │   │   └── __init__.py
│   │   └── services/           # Lógica de negocio
│   │       └── __init__.py
│   ├── requirements.txt        # Dependencias Python
│   ├── .env.example           # Ejemplo de configuración
│   ├── .gitignore
│   └── README.md
│
├── docs/                        # Documentación del proyecto
│   ├── DOCUMENTACION_DESARROLLO_CRIS.txt
│   ├── promps_Maxi.txt
│   └── PROMPT_LORE.txt
│
├── .gitignore                   # Ignorar archivos en Git
└── README.md                    # Este archivo
```

## 🚀 Inicio Rápido

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

### Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Editar .env con tu configuración

# Ejecutar servidor
uvicorn app.main:app --reload
```

El backend estará disponible en: http://localhost:8000

Documentación interactiva (Swagger): http://localhost:8000/docs

## 🛠️ Tecnologías

### Frontend
- **React 18.2** - Biblioteca de UI
- **Vite 5.0** - Build tool y dev server
- **Context API** - Manejo de estado
- **CSS3** - Estilos y animaciones

### Backend (Planificado)
- **FastAPI** - Framework web Python
- **Uvicorn** - Servidor ASGI
- **SQLAlchemy** - ORM (opcional)
- **Pydantic** - Validación de datos

## 📝 Funcionalidades

### Frontend (Implementado)
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Lista de deseos (Wishlist)
- ✅ Filtros y búsqueda
- ✅ Modal de detalles de productos
- ✅ Proceso de checkout
- ✅ Animaciones y transiciones CSS
- ✅ Responsive design

### Backend (Estructura base creada)
- ✅ Estructura de proyecto FastAPI
- ✅ Configuración CORS
- ✅ Endpoints de health check
- ✅ Documentación automática (Swagger/ReDoc)
- 🚧 Endpoints de productos (por implementar)
- 🚧 Endpoints de carrito (por implementar)
- 🚧 Autenticación y autorización (por implementar)
- 🚧 Base de datos y modelos (por implementar)
- 🚧 Validación de datos con Pydantic (por implementar)

## 🐳 Docker (Recomendado para Equipos)

### Opción 1: Con Docker (Más Fácil) ⭐

**Requisitos:** Solo Docker Desktop instalado

```bash
# Levantar todo el proyecto (Frontend + Backend + MySQL)
docker-compose up

# O en segundo plano
docker-compose up -d
```

**Acceder a:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- MySQL: localhost:3306

📖 **Guía completa:** Ver [DOCKER_README.md](DOCKER_README.md)

### Opción 2: Sin Docker (Manual)

Ver secciones de Frontend y Backend arriba.

## 👥 Contribuidores

- Equipo de desarrollo web-mini-market-Universitario

## 📄 Licencia

Este proyecto es de uso educativo.
