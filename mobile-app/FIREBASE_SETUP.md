# Configuración de Firebase - StudiMarket Mobile App

Esta guía te ayudará a configurar Firebase en la aplicación móvil de StudiMarket.

## 📋 Prerrequisitos

- Cuenta de Firebase/Google Cloud
- Proyecto creado en Firebase Console
- Node.js y npm instalados

## 🔥 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: `studimarket-app` (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Clic en "Crear proyecto"

## 📱 Paso 2: Configurar Aplicaciones

### Para Web

1. En la consola de Firebase, ve a Project Settings (⚙️)
2. En "Your apps", clic en el ícono Web (`</>`)
3. Nombre de la app: `StudiMarket Web`
4. **Copia la configuración** que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "studimarket-app.firebaseapp.com",
  projectId: "studimarket-app",
  storageBucket: "studimarket-app.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Para Android (Opcional)

1. En la consola, agrega una app Android
2. Package name: `com.studimarket.app`
3. Descarga el archivo `google-services.json`
4. Colócalo en `mobile-app/android/app/`

### Para iOS (Opcional)

1. En la consola, agrega una app iOS
2. Bundle ID: `com.studimarket.app`
3. Descarga el archivo `GoogleService-Info.plist`
4. Colócalo en `mobile-app/ios/`

## 🔧 Paso 3: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con tu configuración de Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔐 Paso 4: Habilitar Autenticación

1. En Firebase Console, ve a **Authentication**
2. Clic en "Get started"
3. En "Sign-in method", habilita:
   - ✅ **Email/Password** (Native provider)
   - ✅ **Google** (opcional, para login con Google)

### Configurar Google Sign-In (Opcional)

1. Habilita Google como proveedor
2. Configura el email de soporte del proyecto
3. Para Android: Agrega tu SHA-1 fingerprint
4. Para iOS: Agrega tu Bundle ID

## 💾 Paso 5: Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Clic en "Create database"
3. Selecciona modo:
   - **Test mode** (desarrollo): Acceso abierto temporalmente
   - **Production mode** (recomendado): Con reglas de seguridad

4. Selecciona la ubicación del servidor (ej: `us-central1`)

### Reglas de Seguridad Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo a usuarios autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Productos: lectura pública, escritura autenticada
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Otros documentos solo para usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Paso 6: Configurar Storage (Opcional)

1. En Firebase Console, ve a **Storage**
2. Clic en "Get started"
3. Acepta las reglas de seguridad por defecto
4. Selecciona la ubicación del bucket

### Reglas de Storage Recomendadas

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ✅ Paso 7: Verificar Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia la aplicación:
```bash
npm start
```

3. Prueba el registro de usuario:
   - Abre la app en Expo Go
   - Ve a "Registrarse"
   - Crea una cuenta de prueba
   - Verifica en Firebase Console > Authentication que el usuario se creó

4. Prueba el login:
   - Usa las credenciales creadas
   - Verifica que puedas acceder a la app

## 🔍 Verificar en Firebase Console

### Authentication
- Ve a Authentication > Users
- Deberías ver los usuarios registrados
- Email, UID, Created date

### Firestore
- Ve a Firestore Database
- Colección `users` con documentos por cada usuario
- Campos: uid, email, nombre, createdAt, etc.

## 🌐 Integración con Backend

La app móvil usa una **autenticación dual**:

1. **Firebase**: Gestiona la autenticación, sesiones y tokens
2. **Backend (FastAPI)**: Gestiona datos de productos, carrito, órdenes

### Flujo de Autenticación

```
Usuario → Firebase Auth → Token ID
       ↓
Backend (FastAPI) → Valida Token → JWT Backend
       ↓
App Mobile → Usa ambos tokens
```

## 📝 Estructura de Datos en Firestore

### Colección: `users`
```javascript
{
  uid: "abc123...",
  email: "user@example.com",
  nombre: "Juan Pérez",
  displayName: "Juan Pérez",
  photoURL: "https://...",
  createdAt: "2025-11-26T...",
  updatedAt: "2025-11-26T...",
  lastLogin: "2025-11-26T...",
  provider: "email" | "google"
}
```

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Limpiar caché
npx expo start --clear

# Ver logs de Firebase
# (en la consola de Firebase, sección Crashlytics/Performance)
```

## 🚨 Troubleshooting

### Error: "Firebase app named '[DEFAULT]' already exists"
- Asegúrate de inicializar Firebase solo una vez
- Verifica que no haya múltiples llamadas a `initializeApp()`

### Error: "API key not valid"
- Verifica que la API key sea correcta en `.env`
- Asegúrate de que el proyecto esté activo en Firebase Console

### Error: "Permission denied" en Firestore
- Revisa las reglas de seguridad en Firebase Console
- Asegúrate de que el usuario esté autenticado

### Error al iniciar sesión
- Verifica que Email/Password esté habilitado en Authentication
- Revisa los logs en Firebase Console > Authentication > Users
- Verifica que el backend esté corriendo

## 📚 Recursos

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Nunca subas a GitHub:
- Archivo `.env` con credenciales reales
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)
- API keys de producción

✅ **Buenas prácticas**:
- Usa `.env` para desarrollo local
- Usa variables de entorno de Expo para producción
- Habilita reglas de seguridad en Firestore y Storage
- Usa dominios autorizados en Firebase Console
- Habilita autenticación de dos factores en tu cuenta de Firebase

---

¿Necesitas ayuda? Abre un issue en el repositorio.
