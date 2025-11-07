# 🐳 Docker - Guía de Uso

Esta guía te ayudará a levantar todo el proyecto usando Docker.

## 📋 Requisitos Previos

- **Docker Desktop** instalado en Windows
- **Docker Compose** (viene incluido con Docker Desktop)

### Descargar Docker Desktop

👉 https://www.docker.com/products/docker-desktop/

---

## 🚀 Inicio Rápido

### 1. Levantar Todo el Proyecto

```bash
docker-compose up
```

O en segundo plano (detached mode):

```bash
docker-compose up -d
```

### 2. Acceder a las Aplicaciones

Una vez que los contenedores estén corriendo:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación React |
| **Backend API** | http://localhost:8000 | API FastAPI |
| **Swagger Docs** | http://localhost:8000/docs | Documentación interactiva |
| **ReDoc** | http://localhost:8000/redoc | Documentación alternativa |
| **MySQL** | localhost:3306 | Base de datos |

---

## 🛠️ Comandos Útiles

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f db
```

### Detener los Contenedores

```bash
# Detener sin eliminar
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar TODO (incluye volúmenes de BD)
docker-compose down -v
```

### Reconstruir Imágenes

```bash
# Reconstruir todo
docker-compose build

# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up --build
```

### Ver Estado de Contenedores

```bash
docker-compose ps
```

### Ejecutar Comandos en Contenedores

```bash
# Acceder al bash del backend
docker-compose exec backend bash

# Acceder al bash del frontend
docker-compose exec frontend sh

# Ejecutar comando Python en backend
docker-compose exec backend python -c "print('Hello')"

# Acceder a MySQL
docker-compose exec db mysql -u minimarket_user -p minimarket_db
# Password: minimarket_pass
```

---

## 🗄️ Base de Datos MySQL

### Credenciales

```
Host: localhost
Port: 3306
Database: minimarket_db
User: minimarket_user
Password: minimarket_pass
Root Password: rootpassword
```

### Conectarse desde el Host

```bash
mysql -h 127.0.0.1 -P 3306 -u minimarket_user -p minimarket_db
# Ingresar password: minimarket_pass
```

### Conectarse desde Otro Contenedor

Desde el contenedor `backend`, la URL es:
```
mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db
```

---

## 📦 Estructura de Contenedores

```
┌─────────────────────────────────────────┐
│         minimarket_network              │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  │
│  │ frontend │  │ backend  │  │  db  │  │
│  │  :5173   │  │  :8000   │  │ :3306│  │
│  └────┬─────┘  └────┬─────┘  └───┬──┘  │
│       │             │             │     │
│       └─────────────┴─────────────┘     │
└─────────────────────────────────────────┘
         │             │             │
    localhost:5173  :8000       :3306
```

---

## 🔧 Variables de Entorno

### Backend (Ya configuradas en docker-compose.yml)

```env
DATABASE_URL=mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db
SECRET_KEY=your-super-secret-key-change-in-production-123456
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

## 🔄 Hot Reload (Desarrollo)

Ambos contenedores están configurados con **hot reload**:

✅ **Frontend**: Los cambios en `frontend/src` se reflejan automáticamente
✅ **Backend**: Los cambios en `backend/app` reinician el servidor automáticamente

---

## 🐛 Troubleshooting

### Puerto ya en uso

Si el puerto 3306, 5173 u 8000 ya está en uso:

**Opción 1: Detener el servicio local**
```bash
# Detener MySQL local (si tienes XAMPP)
# Detener Vite dev server local
```

**Opción 2: Cambiar puerto en docker-compose.yml**
```yaml
# Cambiar "8000:8000" a "8001:8000" por ejemplo
ports:
  - "8001:8000"  # Host:Container
```

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Limpiar Todo (Reset completo)

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Eliminar volúmenes huérfanos
docker volume prune

# Levantar de nuevo
docker-compose up --build
```

### Base de datos no se conecta

```bash
# Verificar que el contenedor de BD esté healthy
docker-compose ps

# Esperar a que MySQL esté listo
docker-compose logs db | grep "ready for connections"
```

---

## 📝 Workflow de Desarrollo

### Primera vez

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd web-mini-market-Universitario

# 2. Levantar con Docker
docker-compose up --build

# 3. Acceder a:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8000/docs
```

### Día a día

```bash
# Levantar en segundo plano
docker-compose up -d

# Ver logs si algo falla
docker-compose logs -f

# Al terminar
docker-compose down
```

### Cuando alguien actualiza requirements.txt o package.json

```bash
# Reconstruir imágenes
docker-compose build

# O directamente
docker-compose up --build
```

---

## 🚢 Producción

Para producción, necesitarás:

1. **Cambiar SECRET_KEY** en docker-compose.yml
2. **Usar build optimizado** para frontend:
   ```dockerfile
   # En frontend/Dockerfile
   RUN npm run build
   CMD ["npm", "run", "preview"]
   ```
3. **Configurar Nginx** como reverse proxy
4. **Usar docker-compose.prod.yml** separado
5. **Configurar SSL/HTTPS**
6. **Variables de entorno desde archivo .env**

---

## ✅ Checklist para el Equipo

- [ ] Docker Desktop instalado y corriendo
- [ ] Repositorio clonado
- [ ] `docker-compose up` ejecutado exitosamente
- [ ] Frontend accesible en http://localhost:5173
- [ ] Backend accesible en http://localhost:8000/docs
- [ ] MySQL conectado y funcionando
- [ ] Hot reload funcionando en ambos servicios

---

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker Guide](https://fastapi.tiangolo.com/deployment/docker/)
- [Vite Docker Guide](https://vitejs.dev/guide/)

---

## 🆘 Ayuda

Si tienes problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica que Docker Desktop esté corriendo
3. Asegúrate de tener los puertos libres
4. Prueba reconstruir: `docker-compose build --no-cache`
5. Contacta al equipo en el canal de desarrollo

---

**¡Listo para desarrollar! 🚀**
