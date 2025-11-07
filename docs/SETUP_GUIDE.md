# 🚀 Guía de Configuración: SQLAlchemy + Alembic

Esta guía te lleva paso a paso desde la configuración inicial hasta tener la base de datos funcionando con migraciones.

## 📋 Estado Actual del Proyecto

### ✅ FASE 1: Diseño y Configuración Base - COMPLETADO

- ✅ **Diseño de Modelo de Datos**
  - `database_schema.sql` - Schema SQL completo
  - `DIAGRAMA_ER.md` - Diagrama entidad-relación
  - `DATABASE_README.md` - Documentación completa

### ✅ FASE 2: Configuración SQLAlchemy - COMPLETADO

- ✅ **Archivos creados**:
  - `app/database.py` - Configuración de SQLAlchemy
  - `app/models/usuario.py` - Modelo Usuario
  - `app/models/producto.py` - Modelo Producto
  - `app/models/carrito.py` - Modelo Carrito
  - `app/models/item_carrito.py` - Modelo ItemCarrito
  - `app/models/__init__.py` - Exportación de modelos

### ✅ FASE 3: Configuración Alembic - COMPLETADO

- ✅ **Archivos creados**:
  - `alembic.ini` - Configuración de Alembic
  - `alembic/env.py` - Environment de migraciones
  - `alembic/script.py.mako` - Template de migraciones
  - `alembic/versions/` - Directorio para migraciones

---

## 🔧 INSTALACIÓN PASO A PASO

### Paso 1: Crear entorno virtual (recomendado)

```powershell
# Navegar al directorio backend
cd "c:\Users\Fernanda\Desktop\WEB Y MOVIL TALLER III\web-mini-market-Universitario\backend"

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Si da error de permisos, ejecutar primero:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Paso 2: Instalar dependencias

```powershell
# Instalar todas las dependencias
pip install -r requirements.txt

# Verificar instalación
pip list | Select-String -Pattern "sqlalchemy|alembic|pymysql"
```

Deberías ver:
```
alembic                 1.13.0
pymysql                 1.1.0
SQLAlchemy              2.0.23
```

### Paso 3: Configurar variables de entorno

```powershell
# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env y configurar DATABASE_URL
notepad .env
```

**Opciones de DATABASE_URL**:

```bash
# Opción 1: SQLite (desarrollo rápido, sin instalar nada)
DATABASE_URL=sqlite:///./app.db

# Opción 2: MySQL local
DATABASE_URL=mysql+pymysql://root:tu_password@localhost:3306/minimarket_db

# Opción 3: PostgreSQL local
DATABASE_URL=postgresql://usuario:password@localhost:5432/minimarket_db

# Opción 4: MySQL en Docker
DATABASE_URL=mysql+pymysql://root:rootpassword@localhost:3306/minimarket_db
```

### Paso 4: Crear base de datos (solo para MySQL/PostgreSQL)

**Si usas MySQL**:
```powershell
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE minimarket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Si usas PostgreSQL**:
```powershell
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE minimarket_db;
\q
```

**Si usas SQLite**: No necesitas hacer nada, se crea automáticamente.

---

## 🔄 TRABAJAR CON ALEMBIC (Migraciones)

### Crear migración inicial

```powershell
# Generar migración automática desde los modelos ORM
alembic revision --autogenerate -m "Initial migration: usuarios, productos, carritos, items_carrito"
```

Esto crea un archivo en `alembic/versions/` con el código de migración.

### Revisar la migración generada

```powershell
# Listar migraciones
alembic history

# Ver contenido de la última migración
Get-Content alembic\versions\*_initial_migration*.py
```

### Aplicar migraciones (crear tablas en BD)

```powershell
# Aplicar todas las migraciones pendientes
alembic upgrade head

# Verificar estado actual
alembic current
```

### Comandos útiles de Alembic

```powershell
# Ver historial de migraciones
alembic history --verbose

# Ver SQL que se ejecutará (sin aplicar)
alembic upgrade head --sql

# Revertir última migración
alembic downgrade -1

# Revertir todas las migraciones
alembic downgrade base

# Crear migración vacía (para llenado de datos)
alembic revision -m "Seed initial data"
```

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

### 1. Verificar conexión a base de datos

Crea un archivo temporal `test_db.py`:

```python
# test_db.py
from app.database import engine, SessionLocal
from app.models import Usuario, Producto, Carrito, ItemCarrito

# Test 1: Conexión
print("Testing database connection...")
try:
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")

# Test 2: Sesión
print("\nTesting database session...")
try:
    db = SessionLocal()
    print("✅ Database session created successfully!")
    db.close()
except Exception as e:
    print(f"❌ Database session failed: {e}")

# Test 3: Consultar tablas
print("\nTesting table queries...")
try:
    db = SessionLocal()
    usuarios_count = db.query(Usuario).count()
    productos_count = db.query(Producto).count()
    print(f"✅ Tables accessible!")
    print(f"   - Usuarios: {usuarios_count}")
    print(f"   - Productos: {productos_count}")
    db.close()
except Exception as e:
    print(f"❌ Query failed: {e}")
```

Ejecutar:
```powershell
python test_db.py
```

### 2. Crear datos de prueba

Crea `seed_data.py`:

```python
# seed_data.py
from app.database import SessionLocal
from app.models import Usuario, Producto
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    db = SessionLocal()
    
    try:
        # Crear usuario de prueba
        usuario = Usuario(
            email="admin@minimarket.com",
            password_hash=pwd_context.hash("admin123"),
            nombre="Admin",
            apellido="Sistema",
            is_admin=True
        )
        db.add(usuario)
        
        # Crear productos de prueba
        productos = [
            Producto(
                titulo="Laptop Dell XPS 15",
                descripcion="Laptop de alta gama",
                precio=1299.99,
                stock=10,
                categoria="Electrónicos"
            ),
            Producto(
                titulo="Mouse Logitech G502",
                descripcion="Mouse gaming",
                precio=59.99,
                stock=50,
                categoria="Electrónicos"
            ),
            Producto(
                titulo="Cuaderno Universitario",
                descripcion="100 hojas",
                precio=2.99,
                stock=200,
                categoria="Librería"
            )
        ]
        
        for producto in productos:
            db.add(producto)
        
        db.commit()
        print("✅ Datos de prueba creados exitosamente!")
        print(f"   - 1 usuario admin (email: admin@minimarket.com, password: admin123)")
        print(f"   - 3 productos")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
```

Ejecutar:
```powershell
python seed_data.py
```

---

## 📊 FLUJO DE TRABAJO RECOMENDADO

### Desarrollo normal

1. **Modificar modelos** en `app/models/`
2. **Generar migración**: `alembic revision --autogenerate -m "Descripción del cambio"`
3. **Revisar migración** generada en `alembic/versions/`
4. **Aplicar migración**: `alembic upgrade head`
5. **Probar** los cambios

### Ejemplo: Agregar campo a Usuario

```python
# app/models/usuario.py
class Usuario(Base):
    # ... campos existentes ...
    telefono = Column(String(20), nullable=True)  # NUEVO CAMPO
```

```powershell
# Generar migración
alembic revision --autogenerate -m "Add telefono to usuarios"

# Aplicar
alembic upgrade head
```

### Revertir cambios

```powershell
# Ver historial
alembic history

# Revertir última migración
alembic downgrade -1

# Revertir a migración específica
alembic downgrade <revision_id>
```

---

## 🐛 TROUBLESHOOTING

### Error: "No module named 'alembic'"

```powershell
pip install alembic
```

### Error: "No module named 'pymysql'"

```powershell
pip install pymysql
```

### Error: "Access denied for user"

Verificar credenciales en `.env`:
```bash
DATABASE_URL=mysql+pymysql://usuario_correcto:password_correcto@localhost:3306/minimarket_db
```

### Error: "Can't connect to MySQL server"

```powershell
# Verificar que MySQL esté corriendo
Get-Service -Name MySQL*

# Iniciar servicio si está detenido
Start-Service -Name MySQL80  # Ajustar nombre según tu versión
```

### Error: "Target database is not up to date"

```powershell
# Ver estado actual
alembic current

# Aplicar migraciones pendientes
alembic upgrade head
```

### Error: "FAILED: Target database is not up to date"

```powershell
# Marcar base de datos como actualizada (cuidado)
alembic stamp head
```

---

## 🎯 PRÓXIMOS PASOS

Ahora que tienes SQLAlchemy y Alembic configurados:

### 1. Integrar con FastAPI

Actualizar `app/main.py`:

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db, create_tables
from app.models import Producto

app = FastAPI()

# Crear tablas al iniciar (solo para desarrollo)
# En producción, usar Alembic migrations
@app.on_event("startup")
def startup():
    # create_tables()  # Comentar si usas Alembic
    pass

# Ejemplo de endpoint usando la base de datos
@app.get("/productos")
def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(Producto.is_active == True).all()
    return productos
```

### 2. Crear CRUD operations

Crear `app/crud/` con operaciones de base de datos:

```python
# app/crud/producto.py
from sqlalchemy.orm import Session
from app.models import Producto
from app.schemas import ProductCreate

def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Producto).filter(Producto.is_active == True).offset(skip).limit(limit).all()

def create_producto(db: Session, producto: ProductCreate):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto
```

### 3. Implementar autenticación

Ver `app/schemas/user.py` para schemas de login/registro.

### 4. Testing

Crear tests con pytest usando base de datos de prueba.

---

## 📚 RECURSOS ADICIONALES

- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [FastAPI + SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [Database Schema diseñado](DATABASE_README.md)
- [Diagrama ER](DIAGRAMA_ER.md)

---

## ✅ CHECKLIST FINAL

Antes de continuar con desarrollo, verifica:

- [ ] Entorno virtual creado y activado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] `.env` configurado con DATABASE_URL correcto
- [ ] Base de datos creada (MySQL/PostgreSQL) o SQLite funcionando
- [ ] Migración inicial generada (`alembic revision --autogenerate`)
- [ ] Migración aplicada (`alembic upgrade head`)
- [ ] Test de conexión exitoso (`python test_db.py`)
- [ ] Datos de prueba cargados (`python seed_data.py`)

**¡Listo para desarrollar!** 🎉
