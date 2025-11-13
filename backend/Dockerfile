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

# Dar permisos de ejecución al script de inicialización
RUN chmod +x init_db.sh

# Exponer puerto de FastAPI
EXPOSE 8000

# Usar el script de inicialización que ejecuta migraciones y seed
CMD ["./init_db.sh"]
