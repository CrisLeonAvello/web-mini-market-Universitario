# Dockerfile para Frontend React + Vite

FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando para desarrollo (con hot reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
