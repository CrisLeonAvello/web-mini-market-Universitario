# 🚀 Inicio Rápido con Docker

## ⚡ Comandos Esenciales

```bash
# 1️⃣ Levantar todo el proyecto
docker-compose up

# 2️⃣ Acceder a:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8000/docs
# - MySQL: localhost:3306

# 3️⃣ Detener todo
docker-compose down
```

## 📖 Documentación Completa

Ver **[DOCKER_README.md](DOCKER_README.md)** para guía detallada.

## 🎯 Configuración del Proyecto

### Servicios Incluidos

✅ **Frontend** (React + Vite) - Puerto 5173  
✅ **Backend** (FastAPI) - Puerto 8000  
✅ **MySQL** - Puerto 3306

### Credenciales MySQL

```
Database: minimarket_db
User: minimarket_user
Password: minimarket_pass
Root Password: rootpassword
```

## 🔄 Hot Reload

Los cambios en el código se reflejan automáticamente:
- Frontend: Edita archivos en `frontend/src/`
- Backend: Edita archivos en `backend/app/`

## 🆘 Problemas Comunes

### Puerto ocupado
```bash
# Detener servicios locales (XAMPP, etc.)
# O cambiar puertos en docker-compose.yml
```

### Reconstruir desde cero
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Ver logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

**¿Primera vez con Docker?** Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/) 🐳
