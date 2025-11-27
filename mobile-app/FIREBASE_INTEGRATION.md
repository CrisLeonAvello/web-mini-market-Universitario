# 🔥 Integración de Firebase - StudiMarket Mobile

Se ha completado la integración de Firebase en la aplicación móvil de StudiMarket.

## ✅ Componentes Instalados

### Dependencias NPM
```json
{
  "firebase": "^latest",
  "@react-native-firebase/app": "^latest",
  "@react-native-firebase/auth": "^latest",
  "@react-native-firebase/firestore": "^latest"
}
```

## 📁 Archivos Creados

### 1. Configuración de Firebase
- `src/config/firebase.ts` - Inicialización de Firebase con Auth, Firestore y Storage
- `.env.example` - Plantilla de variables de entorno
- `FIREBASE_SETUP.md` - Guía completa de configuración

### 2. Servicios de Autenticación
- `src/services/firebaseAuthService.ts` - Servicio completo de Firebase Auth:
  - ✅ Registro con email/password
  - ✅ Login con email/password
  - ✅ Login con Google (preparado)
  - ✅ Logout
  - ✅ Recuperación de contraseña
  - ✅ Observador de estado de autenticación
  - ✅ Integración dual con backend FastAPI

### 3. Context Actualizado
- `src/contexts/AuthContext.tsx` - Actualizado para usar Firebase Auth:
  - Autenticación dual (Firebase + Backend)
  - Observador de cambios en tiempo real
  - Persistencia con AsyncStorage
  - Sincronización automática

## 🔄 Flujo de Autenticación

### Registro de Usuario
```
1. Usuario ingresa datos
2. Firebase crea cuenta con email/password
3. Se guarda perfil en Firestore (users/{uid})
4. Backend registra usuario en MySQL
5. Auto-login en ambos sistemas
6. Token JWT almacenado
```

### Login
```
1. Usuario ingresa credenciales
2. Firebase valida y autentica
3. Backend valida y genera JWT
4. Tokens almacenados en AsyncStorage
5. Estado sincronizado en ambos sistemas
```

### Logout
```
1. Cierra sesión en Firebase
2. Limpia tokens del backend
3. Limpia AsyncStorage
4. Redirige a login
```

## 🗄️ Estructura de Datos

### Firestore - Colección `users`
```typescript
{
  uid: string,              // Firebase UID
  email: string,
  nombre: string,
  displayName: string,
  photoURL: string | null,
  createdAt: ISO string,
  updatedAt: ISO string,
  lastLogin: ISO string,
  provider: 'email' | 'google'
}
```

### Backend MySQL - Tabla `usuarios`
```sql
id_usuario INT PRIMARY KEY
email VARCHAR(255)
nombre VARCHAR(255)
password_hash VARCHAR(255)
created_at TIMESTAMP
```

## 🔧 Configuración Requerida

### 1. Crear Proyecto en Firebase
1. Ve a https://console.firebase.google.com/
2. Crea un proyecto llamado `studimarket-app`
3. Habilita Authentication → Email/Password
4. Crea base de datos Firestore
5. (Opcional) Habilita Storage para imágenes

### 2. Obtener Credenciales
En Project Settings > Your apps > Web app:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "studimarket-app.firebaseapp.com",
  projectId: "studimarket-app",
  storageBucket: "studimarket-app.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}
```

### 3. Configurar Variables de Entorno
Crea archivo `.env` basado en `.env.example`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

## 🚀 Uso en la Aplicación

### En los Screens
```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { login, loading } = useAuth();
  
  const handleLogin = async () => {
    try {
      // Autentica con Firebase Y backend automáticamente
      await login(email, password);
      // Usuario autenticado en ambos sistemas
    } catch (error) {
      console.error(error);
    }
  };
}
```

### Acceso a Firebase directamente
```typescript
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Obtener datos del usuario desde Firestore
const userDoc = await getDoc(doc(db, 'users', userId));
const userData = userDoc.data();
```

## 🔐 Reglas de Seguridad

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
                       && request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✨ Funcionalidades Implementadas

### ✅ Autenticación
- [x] Registro con email/password
- [x] Login con email/password
- [x] Logout
- [x] Persistencia de sesión
- [x] Observador de cambios en tiempo real
- [x] Integración dual con backend
- [ ] Login con Google (preparado, requiere configuración)
- [ ] Recuperación de contraseña (implementado, requiere pruebas)

### ✅ Almacenamiento
- [x] Datos de usuario en Firestore
- [x] Tokens en AsyncStorage
- [x] Sincronización automática

### 🔜 Por Implementar
- [ ] Subida de imágenes a Firebase Storage
- [ ] Notificaciones push con FCM
- [ ] Analytics de Firebase
- [ ] Crashlytics

## 🧪 Testing

### Probar Registro
```typescript
Email: test@example.com
Password: test123456
Nombre: Usuario Test
```

Verificar en:
1. Firebase Console → Authentication → Users
2. Firebase Console → Firestore → users collection
3. Backend → MySQL → usuarios table

### Probar Login
```typescript
Email: admin@minimarket.com
Password: admin123
```

## 📚 Documentación

- `FIREBASE_SETUP.md` - Guía paso a paso de configuración
- Código comentado en `firebaseAuthService.ts`
- Ejemplos de uso en `AuthContext.tsx`

## 🔗 Enlaces Útiles

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)

## ⚠️ Notas Importantes

1. **Nunca subir a Git**:
   - Archivo `.env` con credenciales reales
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)

2. **Seguridad**:
   - Configura reglas de Firestore en producción
   - Habilita dominios autorizados en Firebase Console
   - Usa variables de entorno para credenciales

3. **Producción**:
   - Cambia reglas de Firestore de test mode a production mode
   - Configura límites de uso en Firebase Console
   - Habilita App Check para seguridad adicional

---

✅ **La integración de Firebase está completa y lista para usar.**

Para comenzar a usar Firebase:
1. Lee `FIREBASE_SETUP.md`
2. Crea tu proyecto en Firebase Console
3. Copia las credenciales a `.env`
4. Prueba el registro y login
