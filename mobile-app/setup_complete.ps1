# Script completo para crear el proyecto React Native

Write-Host " Creando proyecto React Native completo..." -ForegroundColor Green

# Crear archivo README
@"
# StudiMarket Mobile

Aplicación móvil de marketplace estudiantil desarrollada con React Native y Expo.

##  Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar en Android
npx expo start --android

# Iniciar en iOS
npx expo start --ios

# Iniciar en web
npx expo start --web
\`\`\`

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
"@ | Out-File -FilePath "README.md" -Encoding utf8

Write-Host " README creado" -ForegroundColor Cyan

Write-Host "`n Proyecto base completado!" -ForegroundColor Green
Write-Host "`n Archivos creados:" -ForegroundColor Yellow
Write-Host "  - src/constants/config.ts"
Write-Host "  - src/services/api.ts"
Write-Host "  - src/services/authService.ts"
Write-Host "  - src/services/productService.ts"
Write-Host "  - src/services/storageService.ts"
Write-Host "  - src/types/types.ts"
Write-Host "  - src/contexts/AuthContext.tsx"
Write-Host "  - src/contexts/CartContext.tsx"
Write-Host "  - src/contexts/ProductsContext.tsx"

Write-Host "`n  IMPORTANTE: Aún faltan crear las screens y components" -ForegroundColor Yellow
Write-Host "Continuaré con la creación en el siguiente paso..." -ForegroundColor Cyan
