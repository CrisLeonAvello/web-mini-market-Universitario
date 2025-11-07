# Base de Datos - Mini Market Universitario

## 📋 Descripción

Base de datos relacional PostgreSQL normalizada para un sistema de e-commerce de mini market universitario. Incluye gestión de usuarios, productos, carritos de compra y relaciones entre entidades.

## 🗂️ Estructura de Entidades

### Entidades Principales

1. **usuarios** - Gestión de cuentas (clientes y administradores)
2. **productos** - Catálogo de productos disponibles
3. **carritos** - Carritos de compra (activos e históricos)
4. **items_carrito** - Líneas individuales dentro de cada carrito
5. **categorias** - Catálogo normalizado de categorías (opcional)

## 🔗 Diagrama de Relaciones

```
Usuario (1) ──────< Carrito (N)
                       │
                       │ (1)
                       │
                       ├───< ItemCarrito (N) >──── (N) Producto (1)
```

### Cardinalidades

- **Usuario → Carrito**: 1:N (un usuario puede tener múltiples carritos históricos)
- **Carrito → ItemCarrito**: 1:N (un carrito contiene múltiples líneas/items)
- **Producto → ItemCarrito**: 1:N (un producto puede estar en muchos carritos)

## 🚀 Instalación

### Requisitos Previos

- PostgreSQL 14 o superior
- Cliente psql o herramienta de administración (pgAdmin, DBeaver, etc.)

### Pasos de Instalación

1. **Crear la base de datos**:
```bash
psql -U postgres
CREATE DATABASE minimarket_universitario;
\c minimarket_universitario
```

2. **Ejecutar el schema**:
```bash
psql -U postgres -d minimarket_universitario -f database_schema.sql
```

3. **Verificar instalación**:
```sql
-- Ver todas las tablas
\dt

-- Ver estructura de una tabla
\d usuarios

-- Consultar datos de ejemplo
SELECT * FROM usuarios;
SELECT * FROM productos;
```

## 📊 Decisiones de Diseño

### 1. Normalización

✅ **Primera Forma Normal (1FN)**
- Todos los atributos son atómicos
- No hay grupos repetidos

✅ **Segunda Forma Normal (2FN)**
- Cada atributo no-clave depende completamente de la clave primaria
- No hay dependencias parciales

✅ **Tercera Forma Normal (3FN)**
- No hay dependencias transitivas
- `categorias` normalizada en tabla separada
- `nombre_completo` es campo calculado (no almacenado redundantemente)

### 2. Integridad Referencial

| Relación | ON DELETE | ON UPDATE | Justificación |
|----------|-----------|-----------|---------------|
| `usuarios → carritos` | CASCADE | CASCADE | Si borras usuario, borrar sus carritos |
| `carritos → items_carrito` | CASCADE | CASCADE | Si borras carrito, borrar sus items |
| `productos → items_carrito` | RESTRICT | CASCADE | No permitir borrar productos en uso |

### 3. Restricciones (Constraints)

#### Restricciones de Dominio
- `precio > 0` - precios deben ser positivos
- `stock >= 0` - stock no puede ser negativo
- `cantidad >= 1` - cantidad mínima en carrito: 1
- `rating_rate BETWEEN 0 AND 5` - calificación entre 0 y 5
- `email` - formato válido con regex
- `password_hash` - longitud mínima 60 caracteres (bcrypt)

#### Restricciones de Unicidad
- `email UNIQUE` - no duplicar emails
- `(carrito_id, producto_id) UNIQUE` - no duplicar productos en mismo carrito
- `(usuario_id) UNIQUE WHERE is_active = TRUE` - solo un carrito activo por usuario

#### Restricciones Calculadas
- `subtotal = precio_unitario × cantidad` - coherencia de cálculo

### 4. Índices Creados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_precio ON productos(precio);

-- Foreign keys (performance en JOINs)
CREATE INDEX idx_carritos_usuario ON carritos(usuario_id);
CREATE INDEX idx_items_carrito ON items_carrito(carrito_id);
CREATE INDEX idx_items_producto ON items_carrito(producto_id);

-- Índices parciales (solo registros activos)
CREATE INDEX idx_usuarios_active ON usuarios(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_productos_active ON productos(is_active) WHERE is_active = TRUE;

-- Full-text search
CREATE INDEX idx_productos_titulo_busqueda 
    ON productos USING gin(to_tsvector('spanish', titulo));

-- Índice único compuesto
CREATE UNIQUE INDEX ux_carritos_usuario_activo 
    ON carritos(usuario_id) WHERE is_active = TRUE;
```

### 5. Triggers Implementados

#### Auto-actualización de `updated_at`
```sql
CREATE TRIGGER tr_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();
```

#### Cálculo automático de subtotal
```sql
CREATE TRIGGER tr_items_calcular_subtotal
    BEFORE INSERT OR UPDATE OF cantidad, precio_unitario ON items_carrito
    FOR EACH ROW
    EXECUTE FUNCTION calcular_subtotal_item();
```

#### Validación de stock disponible
```sql
CREATE TRIGGER tr_items_validar_stock
    BEFORE INSERT OR UPDATE OF cantidad ON items_carrito
    FOR EACH ROW
    EXECUTE FUNCTION validar_stock_disponible();
```

## 📝 Campos Importantes

### Usuario
- `password_hash`: Hash bcrypt, **nunca** almacenar contraseñas en texto plano
- `nombre_completo`: Campo calculado automáticamente desde `nombre` + `apellido`
- `is_active`: Para desactivar cuentas sin borrarlas (soft-delete)
- `is_admin`: Control de roles y permisos

### Producto
- `rating_rate`: Promedio de calificación (0.00 a 5.00)
- `rating_count`: Cantidad de calificaciones recibidas
- `is_active`: Soft-delete para productos descontinuados
- `stock`: Inventario disponible (validado en triggers)

### Carrito
- `is_active`: TRUE = carrito actual, FALSE = convertido a pedido
- `impuesto` y `envio`: Costos adicionales al subtotal
- **Restricción**: Solo un carrito activo por usuario

### ItemCarrito
- `precio_unitario`: Precio al momento de agregar (snapshot histórico)
- `subtotal`: Calculado automáticamente por trigger
- **Restricción**: No duplicar producto en mismo carrito

## 🔍 Consultas Útiles

### 1. Obtener carrito activo de un usuario

```sql
SELECT * FROM vista_carritos_detallados 
WHERE usuario_id = 1 AND carrito_activo = TRUE;
```

### 2. Calcular total de un carrito

```sql
SELECT 
    id_carrito,
    total_items,
    total_productos,
    subtotal,
    impuesto,
    envio,
    total
FROM vista_carritos_resumen 
WHERE id_carrito = 1;
```

### 3. Productos con bajo stock

```sql
SELECT id_producto, titulo, stock, categoria
FROM productos
WHERE stock < 10 AND is_active = TRUE
ORDER BY stock ASC;
```

### 4. Top productos más valorados

```sql
SELECT id_producto, titulo, precio, rating_rate, rating_count
FROM productos
WHERE is_active = TRUE AND rating_count > 0
ORDER BY rating_rate DESC, rating_count DESC
LIMIT 10;
```

### 5. Buscar productos por texto

```sql
SELECT id_producto, titulo, precio, categoria
FROM productos
WHERE to_tsvector('spanish', titulo) @@ to_tsquery('spanish', 'laptop | mouse')
  AND is_active = TRUE;
```

### 6. Agregar producto al carrito

```sql
-- Primero obtener o crear carrito activo
INSERT INTO carritos (usuario_id)
VALUES (1)
ON CONFLICT DO NOTHING;

-- Luego agregar item (precio_unitario desde tabla productos)
INSERT INTO items_carrito (carrito_id, producto_id, cantidad, precio_unitario)
SELECT 
    c.id_carrito,
    5, -- id del producto
    2, -- cantidad
    p.precio
FROM carritos c
CROSS JOIN productos p
WHERE c.usuario_id = 1 
  AND c.is_active = TRUE
  AND p.id_producto = 5
ON CONFLICT (carrito_id, producto_id) 
DO UPDATE SET 
    cantidad = items_carrito.cantidad + EXCLUDED.cantidad,
    updated_at = NOW();
```

## 🛡️ Seguridad

### Contraseñas
- **NUNCA** almacenar contraseñas en texto plano
- Usar bcrypt con salt rounds >= 12
- Ejemplo en Python:
```python
import bcrypt
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12))
```

### Validación de Email
- Constraint con regex para formato básico
- Validación adicional en capa de aplicación recomendada

### Soft-Delete
- Usar `is_active = FALSE` en lugar de DELETE físico
- Preserva integridad referencial e histórico

### Auditoría
- `created_at` y `updated_at` en todas las tablas principales
- Considerar tabla de audit_log para operaciones críticas

## 🚧 Limitaciones Actuales

1. **Autenticación**: No incluye gestión de tokens JWT (manejar en backend)
2. **Pedidos**: No hay tabla `pedidos` para snapshot de carritos completados
3. **Pagos**: No hay integración con pasarelas de pago
4. **Reviews**: Calificaciones agregadas, no hay tabla de reviews individuales
5. **Imágenes**: URLs simples, no hay almacenamiento de múltiples imágenes

## 📈 Próximos Pasos Recomendados

### 1. Tabla de Pedidos
```sql
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    carrito_id INTEGER REFERENCES carritos(id_carrito),
    subtotal NUMERIC(12,2) NOT NULL,
    impuesto NUMERIC(10,2) NOT NULL,
    envio NUMERIC(10,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. Tabla de Reviews
```sql
CREATE TABLE calificaciones_productos (
    id_calificacion SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id_producto),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(producto_id, usuario_id)
);
```

### 3. Migraciones con Alembic
```bash
pip install alembic psycopg2-binary
alembic init migrations
# Configurar alembic.ini y crear migrations desde models
```

### 4. Audit Log
```sql
CREATE TABLE audit_log (
    id_log SERIAL PRIMARY KEY,
    tabla VARCHAR(100) NOT NULL,
    operacion VARCHAR(20) NOT NULL,
    usuario_id INTEGER,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🔧 Mantenimiento

### Backup
```bash
# Backup completo
pg_dump -U postgres minimarket_universitario > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U postgres minimarket_universitario < backup_20251106.sql
```

### Vacuum y Analyze
```sql
-- Optimizar tablas
VACUUM ANALYZE usuarios;
VACUUM ANALYZE productos;
VACUUM ANALYZE carritos;
VACUUM ANALYZE items_carrito;
```

### Estadísticas
```sql
-- Ver uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Ver tamaño de tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 📞 Soporte

Para dudas sobre el diseño de la base de datos:
1. Revisar comentarios en el SQL (`COMMENT ON TABLE ...`)
2. Consultar constraints y triggers en el schema
3. Revisar las vistas predefinidas (`vista_carritos_*`)

---

**Versión**: 1.0.0  
**Fecha**: 6 de noviembre de 2025  
**Motor**: PostgreSQL 14+
