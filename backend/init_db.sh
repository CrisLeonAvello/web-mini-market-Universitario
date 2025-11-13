#!/bin/bash
set -e

echo "🚀 Iniciando configuración de base de datos..."

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que MySQL esté listo..."
sleep 10

# Ejecutar migraciones de Alembic
echo "📊 Ejecutando migraciones de Alembic..."
alembic upgrade head

# Verificar si ya existen productos en la base de datos
echo "🔍 Verificando si la base de datos tiene datos..."
PRODUCT_COUNT=$(python -c "
from app.database import SessionLocal
from app.models.producto import Producto

db = SessionLocal()
count = db.query(Producto).count()
db.close()
print(count)
")

if [ "$PRODUCT_COUNT" -eq "0" ]; then
    echo "📦 Base de datos vacía. Cargando datos iniciales..."
    python seed_data.py
    echo "✅ Datos cargados correctamente"
else
    echo "✅ La base de datos ya contiene $PRODUCT_COUNT productos"
fi

echo "🎉 Inicialización completada. Iniciando servidor..."

# Iniciar el servidor FastAPI
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
