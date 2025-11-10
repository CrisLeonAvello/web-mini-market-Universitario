# 📚 Documentación de la API - StudiMarket

## 🎯 Resumen de Funcionalidades Implementadas

### ✅ Sistema de Autenticación JWT Completo
- **Registro de usuarios** con validación de email y contraseña
- **Login seguro** con tokens JWT
- **Verificación de sesiones** automática
- **Persistencia de usuario** entre recargas de página
- **Hash de contraseñas** con bcrypt

### ✅ Gestión de Productos Real
- **Base de datos MySQL** con 10 productos preinstalados
- **Precios en CLP** (Pesos Chilenos) sin formato de comas
- **Filtros avanzados** por categoría, precio y búsqueda
- **Paginación** de resultados
- **Stock y disponibilidad** en tiempo real

### ✅ Interfaz de Usuario Moderna
- **Navegación tipo Amazon** con login en página separada
- **Tema espacial** con animaciones CSS
- **Responsive design** para móviles y desktop
- **Landing page** con productos destacados
- **Carrito de compras** funcional

## 🔗 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

#### `POST /api/auth/register`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "Juan Pérez"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "is_active": true,
  "created_at": "2025-11-09T20:30:00"
}
```

#### `POST /api/auth/login`
Inicia sesión y devuelve un token JWT.

**Request Body:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### `GET /api/auth/me`
Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@admin.com",
  "name": "Administrador",
  "is_active": true,
  "created_at": "2025-11-09T20:30:00"
}
```

### 🛍️ Productos (`/api/productos`)

#### `GET /api/productos`
Lista productos con filtros opcionales.

**Query Parameters:**
- `page` (int): Número de página (default: 1)
- `page_size` (int): Productos por página (default: 10, max: 100)
- `category` (string): Filtrar por categoría
- `search` (string): Buscar en título y descripción
- `min_price` (float): Precio mínimo en CLP
- `max_price` (float): Precio máximo en CLP

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "title": "Laptop Dell XPS 15",
      "name": "Laptop Dell XPS 15",
      "price": 1299990,
      "description": "Laptop de alta gama con procesador Intel i7...",
      "category": "Electrónica",
      "image": "https://...",
      "stock": 5,
      "rating": {
        "rate": 4.5,
        "count": 120
      }
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

#### `GET /api/productos/{id}`
Obtiene detalles de un producto específico.

**Path Parameters:**
- `id` (int): ID del producto

**Response:**
```json
{
  "id": 1,
  "title": "Laptop Dell XPS 15",
  "name": "Laptop Dell XPS 15",
  "price": 1299990,
  "description": "Laptop de alta gama con procesador Intel i7, 16GB RAM, 512GB SSD",
  "category": "Electrónica",
  "image": "https://...",
  "stock": 5,
  "rating": {
    "rate": 4.5,
    "count": 120
  }
}
```

## 💾 Base de Datos

### Tablas Principales

#### `usuarios`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_usuario | INT | PK, Auto-increment |
| email | VARCHAR(255) | Email único |
| password_hash | VARCHAR(255) | Hash bcrypt |
| nombre | VARCHAR(100) | Nombre del usuario |
| apellido | VARCHAR(100) | Apellido del usuario |
| is_active | BOOLEAN | Estado de la cuenta |
| is_admin | BOOLEAN | Permisos de admin |
| created_at | DATETIME | Fecha de creación |

#### `productos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_producto | INT | PK, Auto-increment |
| titulo | VARCHAR(200) | Nombre del producto |
| descripcion | TEXT | Descripción completa |
| precio | DECIMAL(10,2) | Precio en CLP |
| stock | INT | Cantidad disponible |
| categoria | VARCHAR(100) | Categoría del producto |
| imagen | TEXT | URL de la imagen |
| rating_rate | DECIMAL(3,2) | Calificación promedio |
| rating_count | INT | Número de reseñas |
| is_active | BOOLEAN | Producto activo |
| created_at | DATETIME | Fecha de creación |

## 🔑 Cuentas de Prueba

### Administrador
```
Email: admin@admin.com
Password: admin123
Permisos: Administrador completo
```

### Usuario de Prueba
```
Email: test@user.com
Password: test123
Permisos: Cliente regular
```

## 💰 Productos Disponibles

| ID | Producto | Precio (CLP) | Categoría | Stock |
|----|----------|--------------|-----------|-------|
| 1 | Laptop Dell XPS 15 | 1,299,990 | Electrónica | 5 |
| 2 | Mouse Logitech G502 | 59,990 | Electrónica | 15 |
| 3 | Auriculares Sony WH-1000XM4 | 349,990 | Electrónica | 8 |
| 4 | Pendrive SanDisk 64GB | 12,990 | Electrónica | 20 |
| 5 | Cuaderno Universitario | 2,990 | Papelería | 50 |
| 6 | Set de Bolígrafos BIC | 4,990 | Papelería | 30 |
| 7 | Mochila Escolar | 34,990 | Accesorios | 12 |
| 8 | Café Nescafé 200g | 8,990 | Alimentación | 25 |
| 9 | Galletas Oreo | 3,490 | Alimentación | 40 |
| 10 | Agua Mineral 500ml | 1,290 | Bebidas | 100 |

## 🧪 Ejemplos de Uso

### Ejemplo 1: Registro y Login Completo

```bash
# 1. Registrar usuario
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@estudiante.com",
    "password": "estudiante123",
    "name": "Estudiante Nuevo"
  }'

# 2. Hacer login
TOKEN=$(curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@estudiante.com",
    "password": "estudiante123"
  }' | jq -r '.access_token')

# 3. Obtener perfil
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Ejemplo 2: Búsqueda de Productos

```bash
# Buscar productos de electrónica entre $50,000 y $500,000
curl -X GET "http://localhost:8000/api/productos?category=Electrónica&min_price=50000&max_price=500000"

# Buscar productos que contengan "laptop"
curl -X GET "http://localhost:8000/api/productos?search=laptop"

# Obtener productos paginados (página 2, 5 productos por página)
curl -X GET "http://localhost:8000/api/productos?page=2&page_size=5"
```

### Ejemplo 3: Frontend Integration

```javascript
// Registro de usuario desde frontend
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Error en registro');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Login y almacenar token
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    localStorage.setItem('authToken', data.access_token);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener productos con autenticación
const getProducts = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:8000/api/productos', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

#### Backend
```env
DATABASE_URL=mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Frontend
```env
VITE_API_URL=http://localhost:8000/api
```

### Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: minimarket_db
      MYSQL_USER: minimarket_user
      MYSQL_PASSWORD: minimarket_pass
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8000/api
    depends_on:
      - backend
```

## 🚀 Deployment

### Comandos Útiles

```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs
docker logs minimarket_backend
docker logs minimarket_frontend
docker logs minimarket_db

# Reiniciar servicios
docker-compose restart backend

# Acceder a MySQL
docker exec -it minimarket_db mysql -u root -p
```

## 📝 Notas de Implementación

### Seguridad
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración (30 minutos)
- ✅ Validación de entrada con Pydantic
- ✅ CORS configurado para desarrollo

### Performance
- ✅ Paginación en listado de productos
- ✅ Filtros en base de datos (no en memoria)
- ✅ Índices en campos frecuentemente consultados
- ✅ Lazy loading de relaciones

### Experiencia de Usuario
- ✅ Navegación intuitiva tipo Amazon
- ✅ Feedback visual en formularios
- ✅ Persistencia de sesión
- ✅ Manejo de errores amigable

---

📚 **Documentación completa en Swagger:** http://localhost:8000/docs