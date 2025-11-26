# StudiMarket Mobile

Aplicación móvil de marketplace estudiantil desarrollada con React Native y Expo.

##  Inicio Rápido

\\\ash
# Instalar dependencias
npm install

# Iniciar en Android
npx expo start --android

# Iniciar en iOS
npx expo start --ios

# Iniciar en web
npx expo start --web
\\\

##  Estructura

- src/services - Servicios API
- src/contexts - Context Providers
- src/screens - Pantallas de la app
- src/components - Componentes reutilizables
- src/navigation - Configuración de navegación
- src/types - Definiciones de TypeScript
- src/constants - Constantes y configuración

##  Configuración

Backend API: http://10.0.2.2:8000/api (Android Emulator)

Para dispositivo físico, cambia la IP en src/constants/config.ts

##  Funcionalidades

- Autenticación de usuarios
- Listado de productos
- Carrito de compras
- Publicar productos
- Gestionar ventas
- Perfil de usuario
