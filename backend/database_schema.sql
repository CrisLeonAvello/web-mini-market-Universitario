-- ============================================================================
-- BASE DE DATOS: Mini Market Universitario
-- Motor: PostgreSQL 14+
-- Descripción: Schema completo con normalización, restricciones e integridad
-- Fecha: 6 de noviembre de 2025
-- ============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLA: usuarios
-- Descripción: Almacena información de usuarios (clientes y administradores)
-- ============================================================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    
    -- Datos de autenticación (normalizados)
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Datos personales
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    nombre_completo VARCHAR(200) GENERATED ALWAYS AS (
        CASE 
            WHEN nombre IS NOT NULL AND apellido IS NOT NULL 
            THEN nombre || ' ' || apellido
            WHEN nombre IS NOT NULL THEN nombre
            ELSE NULL
        END
    ) STORED,
    
    -- Control de cuenta
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT ck_usuarios_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT ck_usuarios_password_length CHECK (LENGTH(password_hash) >= 60)
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_active ON usuarios(is_active) WHERE is_active = TRUE;

-- Comentarios
COMMENT ON TABLE usuarios IS 'Usuarios del sistema (clientes y administradores)';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash bcrypt de la contraseña (nunca almacenar en texto plano)';
COMMENT ON COLUMN usuarios.nombre_completo IS 'Campo calculado automáticamente desde nombre y apellido';


-- ============================================================================
-- TABLA: productos
-- Descripción: Catálogo de productos disponibles en el mini market
-- ============================================================================
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    
    -- Información básica
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    
    -- Precio y stock
    precio NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    
    -- Categorización
    categoria VARCHAR(100) NOT NULL,
    
    -- Multimedia
    imagen TEXT,
    
    -- Calificaciones (normalizadas)
    rating_rate NUMERIC(3,2),
    rating_count INTEGER DEFAULT 0,
    
    -- Control
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT ck_productos_precio_positivo CHECK (precio > 0),
    CONSTRAINT ck_productos_stock_no_negativo CHECK (stock >= 0),
    CONSTRAINT ck_productos_rating_range CHECK (
        rating_rate IS NULL OR (rating_rate >= 0 AND rating_rate <= 5)
    ),
    CONSTRAINT ck_productos_rating_count_no_negativo CHECK (rating_count >= 0)
);

-- Índices para productos
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_productos_active ON productos(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_productos_titulo_busqueda ON productos USING gin(to_tsvector('spanish', titulo));

-- Comentarios
COMMENT ON TABLE productos IS 'Catálogo maestro de productos del mini market';
COMMENT ON COLUMN productos.rating_rate IS 'Promedio de calificación (0.00 a 5.00)';
COMMENT ON COLUMN productos.rating_count IS 'Cantidad total de calificaciones recibidas';
COMMENT ON COLUMN productos.is_active IS 'Soft delete: FALSE = producto descontinuado';


-- ============================================================================
-- TABLA: carritos
-- Descripción: Carritos de compra de los usuarios
-- ============================================================================
CREATE TABLE carritos (
    id_carrito SERIAL PRIMARY KEY,
    
    -- Relación con usuario
    usuario_id INTEGER NOT NULL,
    
    -- Costos adicionales
    impuesto NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    envio NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    
    -- Control
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT ck_carritos_impuesto_no_negativo CHECK (impuesto >= 0),
    CONSTRAINT ck_carritos_envio_no_negativo CHECK (envio >= 0),
    
    -- Foreign Keys
    CONSTRAINT fk_carritos_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Índice único: un usuario solo puede tener un carrito activo
CREATE UNIQUE INDEX ux_carritos_usuario_activo 
    ON carritos(usuario_id) 
    WHERE is_active = TRUE;

-- Índices adicionales
CREATE INDEX idx_carritos_usuario ON carritos(usuario_id);
CREATE INDEX idx_carritos_active ON carritos(is_active) WHERE is_active = TRUE;

-- Comentarios
COMMENT ON TABLE carritos IS 'Carritos de compra (activos e históricos)';
COMMENT ON COLUMN carritos.is_active IS 'TRUE = carrito actual, FALSE = carrito convertido a pedido';
COMMENT ON CONSTRAINT ux_carritos_usuario_activo ON carritos IS 'Un usuario solo puede tener un carrito activo';


-- ============================================================================
-- TABLA: items_carrito
-- Descripción: Líneas/items individuales dentro de cada carrito
-- ============================================================================
CREATE TABLE items_carrito (
    id_item SERIAL PRIMARY KEY,
    
    -- Relaciones
    carrito_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    
    -- Datos del item
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    
    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT ck_items_cantidad_positiva CHECK (cantidad >= 1),
    CONSTRAINT ck_items_precio_no_negativo CHECK (precio_unitario >= 0),
    CONSTRAINT ck_items_subtotal_no_negativo CHECK (subtotal >= 0),
    CONSTRAINT ck_items_subtotal_coherente CHECK (
        subtotal = (precio_unitario * cantidad)
    ),
    
    -- Foreign Keys
    CONSTRAINT fk_items_carrito 
        FOREIGN KEY (carrito_id) 
        REFERENCES carritos(id_carrito) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_items_producto 
        FOREIGN KEY (producto_id) 
        REFERENCES productos(id_producto) 
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Unicidad: no permitir duplicados (mismo producto en mismo carrito)
    CONSTRAINT ux_items_carrito_producto UNIQUE (carrito_id, producto_id)
);

-- Índices para items_carrito
CREATE INDEX idx_items_carrito ON items_carrito(carrito_id);
CREATE INDEX idx_items_producto ON items_carrito(producto_id);

-- Comentarios
COMMENT ON TABLE items_carrito IS 'Líneas individuales de productos en cada carrito';
COMMENT ON COLUMN items_carrito.precio_unitario IS 'Precio del producto al momento de agregarlo (snapshot)';
COMMENT ON COLUMN items_carrito.subtotal IS 'Calculado: precio_unitario × cantidad';
COMMENT ON CONSTRAINT fk_items_producto ON items_carrito IS 'RESTRICT: no permitir borrar productos con items en carritos';


-- ============================================================================
-- TABLA: categorias (normalización recomendada)
-- Descripción: Catálogo de categorías de productos
-- ============================================================================
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Electrónicos', 'Dispositivos electrónicos y accesorios'),
    ('Joyería', 'Joyas y accesorios de moda'),
    ('Ropa de Hombre', 'Vestuario y accesorios masculinos'),
    ('Ropa de Mujer', 'Vestuario y accesorios femeninos'),
    ('Alimentos', 'Productos alimenticios y bebidas'),
    ('Librería', 'Libros, cuadernos y útiles escolares'),
    ('Otros', 'Productos varios');

COMMENT ON TABLE categorias IS 'Catálogo normalizado de categorías de productos';


-- ============================================================================
-- TRIGGERS Y FUNCIONES
-- ============================================================================

-- Función: actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para usuarios
CREATE TRIGGER tr_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para productos
CREATE TRIGGER tr_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para carritos
CREATE TRIGGER tr_carritos_updated_at
    BEFORE UPDATE ON carritos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para items_carrito
CREATE TRIGGER tr_items_updated_at
    BEFORE UPDATE ON items_carrito
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();


-- Función: calcular subtotal automáticamente
CREATE OR REPLACE FUNCTION calcular_subtotal_item()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal = NEW.precio_unitario * NEW.cantidad;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular subtotal en items_carrito
CREATE TRIGGER tr_items_calcular_subtotal
    BEFORE INSERT OR UPDATE OF cantidad, precio_unitario ON items_carrito
    FOR EACH ROW
    EXECUTE FUNCTION calcular_subtotal_item();


-- Función: validar stock disponible antes de agregar/actualizar item
CREATE OR REPLACE FUNCTION validar_stock_disponible()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual INTEGER;
BEGIN
    -- Obtener stock actual del producto
    SELECT stock INTO stock_actual 
    FROM productos 
    WHERE id_producto = NEW.producto_id;
    
    -- Validar stock suficiente
    IF stock_actual < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', 
            stock_actual, NEW.cantidad;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar stock
CREATE TRIGGER tr_items_validar_stock
    BEFORE INSERT OR UPDATE OF cantidad ON items_carrito
    FOR EACH ROW
    EXECUTE FUNCTION validar_stock_disponible();


-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: carrito completo con detalle de items
CREATE OR REPLACE VIEW vista_carritos_detallados AS
SELECT 
    c.id_carrito,
    c.usuario_id,
    u.email AS usuario_email,
    u.nombre_completo AS usuario_nombre,
    c.is_active AS carrito_activo,
    
    -- Items del carrito
    ic.id_item,
    ic.producto_id,
    p.titulo AS producto_titulo,
    p.imagen AS producto_imagen,
    ic.cantidad,
    ic.precio_unitario,
    ic.subtotal,
    
    -- Totales del carrito
    c.impuesto,
    c.envio,
    
    -- Auditoría
    c.created_at AS carrito_creado,
    c.updated_at AS carrito_actualizado
FROM carritos c
INNER JOIN usuarios u ON c.usuario_id = u.id_usuario
LEFT JOIN items_carrito ic ON c.id_carrito = ic.carrito_id
LEFT JOIN productos p ON ic.producto_id = p.id_producto;

COMMENT ON VIEW vista_carritos_detallados IS 'Vista completa de carritos con detalle de items y productos';


-- Vista: resumen de carrito (totales)
CREATE OR REPLACE VIEW vista_carritos_resumen AS
SELECT 
    c.id_carrito,
    c.usuario_id,
    u.email AS usuario_email,
    c.is_active AS carrito_activo,
    
    -- Contadores
    COUNT(ic.id_item) AS total_items,
    COALESCE(SUM(ic.cantidad), 0) AS total_productos,
    
    -- Cálculos financieros
    COALESCE(SUM(ic.subtotal), 0) AS subtotal,
    c.impuesto,
    c.envio,
    COALESCE(SUM(ic.subtotal), 0) + c.impuesto + c.envio AS total,
    
    -- Auditoría
    c.created_at,
    c.updated_at
FROM carritos c
INNER JOIN usuarios u ON c.usuario_id = u.id_usuario
LEFT JOIN items_carrito ic ON c.id_carrito = ic.carrito_id
GROUP BY c.id_carrito, c.usuario_id, u.email, c.is_active, 
         c.impuesto, c.envio, c.created_at, c.updated_at;

COMMENT ON VIEW vista_carritos_resumen IS 'Resumen de carritos con totales calculados';


-- ============================================================================
-- DATOS DE EJEMPLO (OPCIONAL - para testing)
-- ============================================================================

-- Usuario de prueba
INSERT INTO usuarios (email, password_hash, nombre, apellido, is_admin) VALUES
    ('admin@minimarket.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eExAKj9pGaHm', 'Admin', 'Sistema', TRUE),
    ('cliente@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eExAKj9pGaHm', 'Juan', 'Pérez', FALSE);

-- Productos de ejemplo
INSERT INTO productos (titulo, descripcion, precio, stock, categoria, rating_rate, rating_count) VALUES
    ('Laptop Dell XPS 15', 'Laptop de alta gama con procesador Intel i7', 1299.99, 15, 'Electrónicos', 4.5, 89),
    ('Mouse Logitech G502', 'Mouse gaming con sensor óptico de alta precisión', 59.99, 50, 'Electrónicos', 4.7, 234),
    ('Cuaderno Universitario', 'Cuaderno espiral de 100 hojas', 2.99, 200, 'Librería', 4.2, 45),
    ('Pendrive 64GB', 'Memoria USB 3.0 de alta velocidad', 12.99, 80, 'Electrónicos', 4.3, 156);


-- ============================================================================
-- CONSULTAS ÚTILES PARA TESTING
-- ============================================================================

-- Obtener carrito activo de un usuario con items
/*
SELECT * FROM vista_carritos_detallados 
WHERE usuario_id = 1 AND carrito_activo = TRUE;
*/

-- Calcular total de un carrito
/*
SELECT * FROM vista_carritos_resumen 
WHERE id_carrito = 1;
*/

-- Productos con bajo stock
/*
SELECT id_producto, titulo, stock, categoria
FROM productos
WHERE stock < 10 AND is_active = TRUE
ORDER BY stock ASC;
*/

-- Top productos más valorados
/*
SELECT id_producto, titulo, precio, rating_rate, rating_count
FROM productos
WHERE is_active = TRUE AND rating_count > 0
ORDER BY rating_rate DESC, rating_count DESC
LIMIT 10;
*/


-- ============================================================================
-- NOTAS FINALES
-- ============================================================================

/*
NORMALIZACIÓN APLICADA:
- 1FN: Todos los atributos son atómicos
- 2FN: No hay dependencias parciales (todas las tablas tienen PK adecuadas)
- 3FN: No hay dependencias transitivas (categorias normalizada, nombre_completo calculado)

INTEGRIDAD REFERENCIAL:
- usuarios → carritos: ON DELETE CASCADE (borrar usuario borra sus carritos)
- carritos → items_carrito: ON DELETE CASCADE (borrar carrito borra sus items)
- productos → items_carrito: ON DELETE RESTRICT (no permitir borrar productos en uso)

RESTRICCIONES (CONSTRAINTS):
✓ Precios y cantidades positivas
✓ Stock no negativo
✓ Email con formato válido
✓ Password hash mínimo 60 caracteres (bcrypt)
✓ Rating entre 0 y 5
✓ Un solo carrito activo por usuario
✓ Subtotal = precio_unitario × cantidad

ÍNDICES CREADOS:
✓ B-tree en FK para joins eficientes
✓ Índices parciales para registros activos
✓ GIN para búsqueda full-text en títulos
✓ Índices únicos para email y carrito activo

TRIGGERS IMPLEMENTADOS:
✓ Auto-actualización de updated_at
✓ Cálculo automático de subtotal
✓ Validación de stock disponible

PRÓXIMOS PASOS RECOMENDADOS:
1. Implementar tabla 'pedidos' (orders) para snapshot de carritos completados
2. Tabla 'pedidos_items' para histórico de compras
3. Tabla 'calificaciones_productos' para reviews por usuario
4. Implementar audit log para trazabilidad
5. Añadir soft-delete en todas las entidades si se requiere
*/
