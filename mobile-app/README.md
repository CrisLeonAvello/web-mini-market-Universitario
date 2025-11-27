# 📱 StudiMarket - Aplicación Móvil

Aplicación móvil de e-commerce universitaria desarrollada con React Native y Expo.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución en Desarrollo](#ejecución-en-desarrollo)
- [Build con EAS](#build-con-eas)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

- **Node.js** (v18 o superior)
  ```bash
  node --version  # Verificar versión
  ```

- **npm** o **yarn**
  ```bash
  npm --version
  ```

- **Expo CLI**
  ```bash
  npm install -g expo-cli
  ```

- **Git**
  ```bash
  git --version
  ```

### Para iOS (Solo macOS)

- **Xcode** (última versión desde App Store)
- **CocoaPods**
  ```bash
  sudo gem install cocoapods
  ```

### Para Android

- **Android Studio** con:
  - Android SDK (API 33+)
  - Android Emulator
  - Android SDK Platform-Tools

### Cuenta Expo (Para Build EAS)

- Crear cuenta gratuita en [expo.dev](https://expo.dev)
- Instalar EAS CLI:
  ```bash
  npm install -g eas-cli
  ```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/CrisLeonAvello/web-mini-market-Universitario.git
cd web-mini-market-Universitario/mobile-app
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

### 3. Verificar Instalación

```bash
npx expo --version
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en el directorio `mobile-app/`:

```bash
# API Backend
EXPO_PUBLIC_API_URL=http://localhost:8000/api

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=994535848772-q0da4vlbl4spirmksdt1es2l1tuf2hbn.apps.googleusercontent.com
```

#### Obtener Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Ve a **Configuración del proyecto** → **Tus apps**
4. Agrega una **app web** (icono `</>`)
5. Copia las credenciales del objeto `firebaseConfig`
6. Pégalas en el archivo `.env`

**Guía detallada:** Ver `OBTENER_CREDENCIALES_FIREBASE.md`

### 2. Configurar Firebase Authentication

En Firebase Console:

1. Ve a **Authentication** → **Sign-in method**
2. Habilita **Email/Password**
3. Habilita **Google**
   - Usa el Client ID: `994535848772-q0da4vlbl4spirmksdt1es2l1tuf2hbn.apps.googleusercontent.com`
   - Agrega dominios autorizados: `localhost`, `exp://localhost:8081`

### 3. Configurar Firestore

1. Ve a **Firestore Database** → **Crear base de datos**
2. Selecciona **Modo de prueba** (para desarrollo)
3. Elige ubicación: `us-central1` o `southamerica-east1`

### 4. Iniciar Backend (Requerido)

Asegúrate de que el backend esté corriendo:

```bash
# Desde la raíz del proyecto
cd ..
docker-compose up -d

# Verificar que esté corriendo
curl http://localhost:8000/api/productos
```

---

## 🚀 Ejecución en Desarrollo

### Método 1: Expo Go (Recomendado para Desarrollo)

#### 1. Iniciar Metro Bundler

```bash
npx expo start
```

O con caché limpia:

```bash
npx expo start --clear
```

#### 2. Abrir en Dispositivo/Emulador

**Opciones disponibles:**

- Presiona `a` → Abrir en Android emulator
- Presiona `i` → Abrir en iOS simulator (solo macOS)
- Presiona `w` → Abrir en navegador web
- Escanea el **QR code** con la app Expo Go:
  - iOS: Cámara nativa
  - Android: App Expo Go

**Descargar Expo Go:**
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Método 2: Development Build

Para funcionalidades que no soporta Expo Go:

```bash
# Android
npx expo run:android

# iOS (solo macOS)
npx expo run:ios
```

### Scripts Disponibles

```bash
# Iniciar desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web

# Limpiar caché y reiniciar
npx expo start --clear
```

---

## 📲 Build con EAS (Expo Application Services)

EAS Build permite crear builds nativos para iOS y Android en la nube.

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login en Expo

```bash
eas login
```

Ingresa tus credenciales de Expo.

### 3. Configurar Proyecto EAS

```bash
eas build:configure
```

Este comando crea el archivo `eas.json` con la configuración de builds.

### 4. Configuración Personalizada

El archivo `eas.json` se ve así:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 5. Crear Build

#### Build de Desarrollo (APK para Android)

```bash
# Android APK (rápido, para testing interno)
eas build --platform android --profile preview

# iOS Simulator build
eas build --platform ios --profile development
```

#### Build de Producción

```bash
# Android (AAB para Play Store)
eas build --platform android --profile production

# iOS (para App Store)
eas build --platform ios --profile production

# Ambas plataformas simultáneamente
eas build --platform all --profile production
```

### 6. Monitorear Build

El proceso de build puede tardar 10-30 minutos. Puedes:

- Ver el progreso en la terminal
- Monitorear en el dashboard web: `https://expo.dev/accounts/[tu-usuario]/projects/StudiMarket/builds`
- Cerrar la terminal y revisar después con: `eas build:list`

### 7. Descargar Build

Una vez completado:

- **Android**: `.apk` o `.aab`
- **iOS**: `.ipa` o Simulator build

Comandos útiles:

```bash
# Listar todos los builds
eas build:list

# Ver detalles de un build específico
eas build:view [BUILD_ID]

# Descargar archivo
# El link de descarga aparecerá en la terminal y en el dashboard
```

### 8. Instalar APK en Android

**Opción 1: Manualmente**
1. Descarga el APK desde el link proporcionado
2. Transfiere el archivo a tu dispositivo Android
3. Abre el archivo con el Explorador de Archivos
4. Permite instalación de fuentes desconocidas si es necesario
5. Instala la app

**Opción 2: Usando ADB**
```bash
# Conecta tu dispositivo por USB con depuración USB habilitada
adb devices

# Instala el APK
adb install ruta/al/archivo.apk
```

### 9. Submit a Stores (Producción)

#### Android - Google Play Store

```bash
eas submit --platform android --profile production
```

**Requisitos:**
- Cuenta de Google Play Console ($25 pago único)
- App creada en Play Console
- Service account JSON key configurado

#### iOS - App Store

```bash
eas submit --platform ios --profile production
```

**Requisitos:**
- Apple Developer Account ($99/año)
- App creada en App Store Connect
- Certificados y provisioning profiles

### 10. Actualizar la App

Para crear una nueva versión:

```bash
# 1. Actualizar versión en app.json
# "version": "1.0.1"

# 2. Crear nuevo build
eas build --platform android --profile production

# 3. Submit automáticamente
eas submit --platform android --latest
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Linting y Formateo

```bash
# Verificar código
npm run lint

# Fix automático
npm run lint:fix

# Formatear código
npm run format
```

---

## 📁 Estructura del Proyecto

```
mobile-app/
├── app.json                    # Configuración de Expo
├── App.tsx                     # Punto de entrada
├── package.json                # Dependencias
├── tsconfig.json               # Configuración TypeScript
├── .env                        # Variables de entorno (no versionar)
├── .env.example                # Template de variables
├── eas.json                    # Configuración EAS Build
│
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── ProductCard.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── screens/                # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SellerDashboardScreen.tsx
│   │   ├── CreateProductScreen.tsx
│   │   ├── OrderHistoryScreen.tsx
│   │   └── WishlistScreen.tsx
│   │
│   ├── navigation/             # Configuración de navegación
│   │   └── AppNavigator.tsx
│   │
│   ├── contexts/               # Context API para estado global
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   │
│   ├── services/               # Lógica de negocio y API calls
│   │   ├── api.ts              # Cliente Axios configurado
│   │   ├── authService.ts      # Backend authentication
│   │   ├── firebaseAuthService.ts # Firebase authentication
│   │   ├── cartService.ts      # Carrito de compras
│   │   ├── orderService.ts     # Órdenes y ventas
│   │   ├── productService.ts   # Productos
│   │   ├── wishlistService.ts  # Favoritos
│   │   └── storageService.ts   # AsyncStorage wrapper
│   │
│   ├── config/                 # Configuraciones
│   │   ├── firebase.ts         # Firebase setup
│   │   └── config.ts           # Constantes y endpoints
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                  # Funciones utilitarias
│   │   └── helpers.ts
│   │
│   └── assets/                 # Imágenes, fuentes, etc.
│       └── icon.png
│
└── __tests__/                  # Tests
    └── components/
```

---

## 🛠️ Tecnologías

### Core

- **React Native** 0.81.5 - Framework móvil multiplataforma
- **Expo SDK** ~54.0.25 - Toolchain y servicios
- **TypeScript** - Tipado estático y mejor DX
- **React Navigation** v6 - Sistema de navegación

### State Management

- **React Context API** - Estado global compartido
- **AsyncStorage** - Persistencia local de datos

### Backend & Authentication

- **Firebase** (Web SDK)
  - Authentication (Email/Password + Google OAuth)
  - Firestore (Base de datos NoSQL para perfiles)
  - Cloud Storage (Almacenamiento de imágenes)
- **Axios** - Cliente HTTP para API REST
- **JWT** - Tokens de autorización para backend

### UI/UX

- **Expo Linear Gradient** - Degradados y efectos visuales
- **Expo Vector Icons** - Iconografía completa (Ionicons)
- **React Native Gesture Handler** - Gestos táctiles
- **React Native Reanimated** - Animaciones fluidas

### Development Tools

- **EAS Build** - Builds en la nube
- **Expo Go** - Testing rápido sin compilar
- **ESLint** - Linting y calidad de código
- **Prettier** - Formateo consistente

---

## 🔥 Características Principales

### Autenticación

- ✅ Registro con email/password
- ✅ Login con email/password  
- ✅ Login con Google OAuth
- ✅ Persistencia de sesión automática
- ✅ Dual authentication (Firebase + Backend JWT)
- ✅ Recuperación de contraseña

### Funcionalidades de Usuario

- ✅ Catálogo de productos con búsqueda
- ✅ Filtros por categoría y precio
- ✅ Detalle completo de producto
- ✅ Carrito de compras persistente
- ✅ Lista de favoritos/wishlist
- ✅ Perfil de usuario editable
- ✅ Historial de compras
- ✅ Sistema de notificaciones

### Funcionalidades de Vendedor

- ✅ Dashboard de vendedor
- ✅ Crear y publicar productos
- ✅ Editar productos existentes
- ✅ Gestión de inventario (stock)
- ✅ Historial de ventas
- ✅ Actualización de estado de órdenes

### UI/UX

- ✅ Dark mode elegante
- ✅ Diseño moderno con gradientes
- ✅ Animaciones fluidas y naturales
- ✅ Navegación intuitiva
- ✅ Feedback visual (loading, errors, success)
- ✅ Responsive para diferentes tamaños de pantalla

---

## 🐛 Troubleshooting

### Problema: "Unable to resolve firebase/auth"

**Causa:** Firebase no está instalado o está en el directorio incorrecto.

**Solución:**
```bash
cd mobile-app
npm install firebase
npx expo start --clear
```

### Problema: Backend no responde (ERR_EMPTY_RESPONSE)

**Causa:** El contenedor de Docker no está corriendo o faltan dependencias.

**Solución:**
```bash
cd ..
docker-compose down
docker-compose up -d --build backend
docker-compose logs -f backend
```

### Problema: "Bundler cache is empty"

**Causa:** Caché de Metro bundler corrupta.

**Solución:**
```bash
npx expo start --clear
```

### Problema: Android Emulator no inicia

**Solución:**
```bash
# Verificar emuladores disponibles
emulator -list-avds

# Iniciar emulador específico
emulator -avd Pixel_5_API_33

# O desde Android Studio:
# Tools → Device Manager → Play button
```

### Problema: iOS Simulator no funciona (macOS)

**Solución:**
```bash
# Abrir Xcode y verificar simuladores instalados
open -a Simulator

# Reinstalar pods si es necesario
cd ios
pod install
cd ..
```

### Problema: EAS Build falla

**Soluciones comunes:**

```bash
# 1. Verificar configuración
eas build:configure

# 2. Limpiar caché de EAS
eas build:clear

# 3. Ver logs detallados con build local
eas build --platform android --profile preview --local

# 4. Verificar que app.json tenga toda la info requerida
```

### Problema: Variables de entorno no cargan

**Solución:**
```bash
# 1. Verificar que .env existe y tiene el formato correcto
# 2. Reiniciar Metro bundler
npx expo start --clear

# 3. Verificar que las variables empiecen con EXPO_PUBLIC_
# Ejemplo: EXPO_PUBLIC_API_URL (✓) vs API_URL (✗)
```

### Problema: Error 401 Unauthorized en API

**Causa:** Token JWT expirado o inválido.

**Solución:**
```bash
# La app debería manejar esto automáticamente
# Si persiste, cerrar sesión y volver a iniciar:
# 1. Abrir app
# 2. Ir a Perfil
# 3. Cerrar Sesión
# 4. Volver a iniciar sesión
```

---

## 📚 Documentación Adicional

### Recursos Externos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Documentación del Proyecto

Consulta estos archivos para más información:

- `FIREBASE_SETUP.md` - Configuración completa paso a paso de Firebase
- `FIREBASE_INTEGRATION.md` - Integración técnica detallada con código
- `OBTENER_CREDENCIALES_FIREBASE.md` - Guía rápida para obtener credenciales
- `BACKEND_INTEGRATION.md` - Integración con backend FastAPI

---

## 🚀 Roadmap

### Próximas Características

- [ ] Sistema de chat entre compradores y vendedores
- [ ] Notificaciones push (Firebase Cloud Messaging)
- [ ] Pasarela de pagos (WebPay, MercadoPago)
- [ ] Sistema de calificaciones y reviews
- [ ] Geolocalización para entregas
- [ ] Modo offline con sincronización
- [ ] Deep linking para compartir productos
- [ ] Analytics y métricas de uso

---

## 👥 Equipo de Desarrollo

**StudiMarket** - Plataforma de E-Commerce Universitaria

Desarrollado como proyecto académico para demostrar integración de tecnologías modernas.

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico universitario.

---

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:

1. ✅ Revisa la sección de [Troubleshooting](#troubleshooting)
2. 📖 Consulta la documentación en la carpeta `docs/`
3. 🐳 Verifica que el backend esté corriendo: `docker-compose ps`
4. 🔑 Asegúrate de que las variables de entorno estén configuradas en `.env`
5. 🧹 Limpia caché y reinicia: `npx expo start --clear`
6. 🔍 Revisa los logs del backend: `docker-compose logs -f backend`

### Comandos de Diagnóstico Rápido

```bash
# Verificar versiones
node --version
npm --version
npx expo --version

# Estado del backend
docker-compose ps
curl http://localhost:8000/api/productos

# Limpiar todo y empezar de cero
rm -rf node_modules
npm install
npx expo start --clear
```

---

**¡Feliz desarrollo! 🚀📱**

*Última actualización: Noviembre 2025*
