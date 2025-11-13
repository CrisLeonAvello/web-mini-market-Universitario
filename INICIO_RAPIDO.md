# 🚀 Guía de Inicio Rápido - StudiMarket

## 📋 Prerequisitos

- Docker Desktop instalado y en ejecución
- Git (para clonar el repositorio)

## 🔧 Configuración Inicial en tu Portátil

### 1️⃣ Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd web-mini-market-Universitario
```

### 2️⃣ Iniciar Docker Desktop

Asegúrate de que Docker Desktop esté corriendo antes de continuar.

### 3️⃣ Levantar los Contenedores

```bash
docker-compose up -d --build
```

**¿Qué hace este comando?**
- `-d`: Ejecuta en segundo plano
- `--build`: Reconstruye las imágenes (importante la primera vez)

### 4️⃣ Verificar que Todo Esté Funcionando

Espera unos 30 segundos y luego verifica los logs:

```bash
docker-compose logs backend
```

Deberías ver mensajes como:
```
✅ La base de datos ya contiene 10 productos
🎉 Inicialización completada. Iniciando servidor...
```

### 5️⃣ Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8000/api
- **Documentación API**: http://localhost:8000/docs

## 🔄 Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Detener los contenedores
```bash
docker-compose down
```

### Reiniciar todo (útil si algo falla)
```bash
docker-compose down
docker-compose up -d --build
```

### Limpiar todo y empezar de cero
```bash
docker-compose down -v
docker-compose up -d --build
```
**⚠️ Advertencia**: `-v` elimina los volúmenes (la base de datos), pero se recreará automáticamente.

## ✨ Características Automáticas

Cuando levantes el proyecto en tu portátil, **automáticamente**:

1. ✅ Se crea la base de datos MySQL
2. ✅ Se ejecutan las migraciones de Alembic (tablas)
3. ✅ Se cargan 10 productos de ejemplo
4. ✅ El frontend se conecta al backend
5. ✅ Hot reload activado (los cambios se ven automáticamente)

## 🐛 Solución de Problemas

### El backend no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Reintentar
docker-compose restart backend
```

### La base de datos está vacía
```bash
# Ejecutar seed manualmente
docker-compose exec backend python seed_data.py
```

### El frontend no carga
```bash
# Verificar que el backend esté listo primero
docker-compose logs backend

# Reiniciar frontend
docker-compose restart frontend
```

### Puerto 3306, 8000 o 5173 ya está en uso
Detén el proceso que esté usando ese puerto o cambia el puerto en `docker-compose.yml`.

## 📦 Productos Pre-cargados

El sistema incluye 10 productos de ejemplo en 3 categorías:
- 📱 **Electrónicos**: Laptop, Mouse, Auriculares, Teclado
- 📚 **Librería**: Cuaderno, Lápices, Mochila
- 🍎 **Alimentos**: Galletas, Jugo, Chocolate

## 🎨 Tema Visual

El proyecto usa un **tema espacial** con:
- Gradientes morado (#8a2be2) y naranja (#ff6b35)
- Animaciones de órbita
- Efectos glassmorphism
- Diseño responsive

---

**¿Necesitas ayuda?** Revisa los logs con `docker-compose logs -f`
