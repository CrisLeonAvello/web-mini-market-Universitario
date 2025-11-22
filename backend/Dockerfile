# Dockerfile para Backend FastAPI

FROM python:3.11-slim

# Evitar prompts interactivos durante la instalación
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema necesarias para MySQL
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Instalar cliente MySQL para Python
RUN pip install --no-cache-dir pymysql cryptography

# Copiar código fuente
COPY . .

# Exponer puerto de FastAPI
EXPOSE 8000

# Script de inicialización inline para evitar problemas de line endings
CMD ["sh", "-c", "\
    echo '🚀 Iniciando configuración de base de datos...' && \
    echo '⏳ Esperando a que MySQL esté listo...' && \
    sleep 10 && \
    echo '📊 Ejecutando migraciones de Alembic...' && \
    alembic upgrade head && \
    echo '🔍 Verificando datos existentes...' && \
    python -c 'from app.database import SessionLocal; from app.models.producto import Producto; db = SessionLocal(); count = db.query(Producto).count(); db.close(); exit(0 if count > 0 else 1)' || python seed_data.py && \
    echo '🎉 Inicialización completada. Iniciando servidor...' && \
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\
    "]
