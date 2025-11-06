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

# Comando para desarrollo con hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
