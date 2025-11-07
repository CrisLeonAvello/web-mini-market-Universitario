# 🚀 QUICK START - SQLAlchemy + Alembic

## ⚡ Instalación Rápida (5 minutos)

### 1. Activar entorno virtual e instalar

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Configurar base de datos

**Opción más rápida (SQLite)**:
```powershell
# Copiar .env
copy .env.example .env

# El .env ya viene con SQLite configurado por defecto
# DATABASE_URL=sqlite:///./app.db
```

**Opción recomendada (MySQL)**:
```powershell
# Crear BD en MySQL
mysql -u root -p -e "CREATE DATABASE minimarket_db;"

# Editar .env y cambiar DATABASE_URL:
notepad .env
```
```bash
DATABASE_URL=mysql+pymysql://root:TU_PASSWORD@localhost:3306/minimarket_db
```

### 3. Crear tablas con Alembic

```powershell
# Generar migración desde modelos ORM
alembic revision --autogenerate -m "Initial migration"

# Aplicar migración (crea las tablas)
alembic upgrade head
```

### 4. Verificar y poblar datos

```powershell
# Test de conexión
python test_db.py

# Cargar datos de ejemplo
python seed_data.py
```

### 5. Iniciar servidor

```powershell
uvicorn app.main:app --reload
```

---

## 📊 Estado del Proyecto

| Fase | Estado | Progreso |
|------|--------|----------|
| ✅ Diseño de BD | Completado | 100% |
| ✅ SQLAlchemy ORM | Completado | 100% |
| ✅ Alembic Setup | Completado | 100% |
| ⏳ Crear Migración | Pendiente | 0% |
| ⏳ Aplicar Migración | Pendiente | 0% |
| ⏳ Poblar Datos | Pendiente | 0% |

---

## 📁 Archivos Importantes

### Configuración
- `app/database.py` - Conexión SQLAlchemy
- `app/config.py` - Settings (DATABASE_URL)
- `alembic.ini` - Config de Alembic
- `alembic/env.py` - Environment de migraciones

### Modelos ORM
- `app/models/usuario.py`
- `app/models/producto.py`
- `app/models/carrito.py`
- `app/models/item_carrito.py`

### Utilidades
- `test_db.py` - Test de conexión (5 tests)
- `seed_data.py` - Poblar datos iniciales

### Documentación
- `SETUP_GUIDE.md` - Guía completa de instalación
- `DESARROLLO_CHECKLIST.md` - Checklist de progreso
- `DATABASE_README.md` - Documentación de BD
- `DIAGRAMA_ER.md` - Diagrama ER

---

## 🔧 Comandos Útiles

### Alembic (Migraciones)

```powershell
# Crear migración automática
alembic revision --autogenerate -m "Descripción"

# Aplicar todas las migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver historial
alembic history

# Ver estado actual
alembic current

# Ver SQL sin aplicar
alembic upgrade head --sql
```

### Testing

```powershell
# Test completo de BD
python test_db.py

# Poblar datos de ejemplo
python seed_data.py

# FastAPI dev server
uvicorn app.main:app --reload
```

### Base de Datos

```powershell
# MySQL: Ver tablas
mysql -u root -p minimarket_db -e "SHOW TABLES;"

# SQLite: Ver tablas
sqlite3 app.db ".tables"

# PostgreSQL: Ver tablas
psql -U usuario -d minimarket_db -c "\dt"
```

---

## 🎯 Próximos Pasos

1. **Ahora mismo**: Ejecuta los comandos de Quick Start ↑
2. **Después**: Lee `SETUP_GUIDE.md` para detalles
3. **Finalmente**: Integra con FastAPI y crea endpoints

---

## 🐛 Troubleshooting

### Error: "No module named 'alembic'"
```powershell
pip install alembic
```

### Error: "Can't connect to MySQL"
```bash
# Verifica DATABASE_URL en .env
# Asegúrate que MySQL esté corriendo
Get-Service MySQL* | Start-Service
```

### Error: "Target database is not up to date"
```powershell
alembic upgrade head
```

### Error al importar modelos
```powershell
# Verifica que estés en el directorio backend
cd backend
# Activa el venv
.\venv\Scripts\Activate.ps1
```

---

## 📚 Documentación Completa

- 📘 **Instalación detallada**: `SETUP_GUIDE.md`
- 📗 **Progreso y checklist**: `DESARROLLO_CHECKLIST.md`
- 📙 **Diseño de BD**: `DATABASE_README.md`
- 📕 **Diagrama ER**: `DIAGRAMA_ER.md`

---

## ✅ Checklist Rápido

- [ ] Crear venv e instalar dependencias
- [ ] Configurar `.env` con DATABASE_URL
- [ ] Crear base de datos (MySQL/PostgreSQL)
- [ ] `alembic revision --autogenerate`
- [ ] `alembic upgrade head`
- [ ] `python test_db.py`
- [ ] `python seed_data.py`
- [ ] `uvicorn app.main:app --reload`

---

**¿Listo para empezar?** ↑ Sigue el Quick Start

**¿Necesitas más detalles?** → Lee `SETUP_GUIDE.md`
