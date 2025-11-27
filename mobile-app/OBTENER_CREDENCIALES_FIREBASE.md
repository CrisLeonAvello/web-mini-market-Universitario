# 🚀 Guía Rápida: Obtener Credenciales de Firebase

Ya tienes Google OAuth configurado en tu proyecto web. Ahora vamos a crear el proyecto de Firebase y obtener las credenciales.

## 📝 Paso a Paso (5 minutos)

### 1️⃣ Ir a Firebase Console
- Abre: https://console.firebase.google.com/
- Inicia sesión con la **misma cuenta de Google** que usas para el proyecto web

### 2️⃣ Crear Proyecto
1. Clic en "Agregar proyecto" o "Add project"
2. Nombre: `StudiMarket` o `studimarket-app`
3. Google Analytics: Puedes habilitarlo (opcional)
4. Clic en "Crear proyecto"
5. Espera a que termine (1-2 minutos)

### 3️⃣ Agregar App Web
1. En la página principal del proyecto, busca "Comienza agregando Firebase a tu app"
2. Clic en el ícono Web `</>`
3. Apodo de la app: `StudiMarket Mobile`
4. Firebase Hosting: NO lo marques
5. Clic en "Registrar app"

### 4️⃣ Copiar Configuración
Te aparecerá algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxx",
  authDomain: "studimarket-xxxxx.firebaseapp.com",
  projectId: "studimarket-xxxxx",
  storageBucket: "studimarket-xxxxx.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijk123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 5️⃣ Pegar en .env
Copia esos valores y pégalos en tu archivo `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC-xxxxxxxxxxxxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=studimarket-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=studimarket-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=studimarket-xxxxx.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijk123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 6️⃣ Habilitar Authentication
1. En el menú lateral, ve a **Build** > **Authentication**
2. Clic en "Get started"
3. En "Sign-in method", habilita:
   - ✅ **Email/Password**: Clic en "Email/Password" > Enable > Save
   - ✅ **Google**: Clic en "Google" > Enable
     - Email de soporte: Tu email
     - Clic en Save

### 7️⃣ Crear Firestore Database
1. En el menú lateral, ve a **Build** > **Firestore Database**
2. Clic en "Create database"
3. Selecciona modo:
   - **Test mode** (recomendado para empezar)
   - Location: `us-central1` o la más cercana a Chile (`southamerica-east1`)
4. Clic en "Enable"

### 8️⃣ (Opcional) Configurar Storage
1. En el menú lateral, ve a **Build** > **Storage**
2. Clic en "Get started"
3. Start in test mode
4. Clic en "Next" y "Done"

## ✅ Verificar que todo funciona

1. Guarda el archivo `.env` con tus credenciales
2. En la terminal:
   ```bash
   npm start
   ```
3. Abre la app en el navegador (presiona `w`)
4. Intenta registrarte con un email de prueba
5. Verifica en Firebase Console > Authentication > Users que el usuario se creó

## 🔗 Reutilizar Google OAuth del Proyecto Web

Tu Google OAuth Client ID ya está configurado:
```
994535848772-q0da4vlbl4spirmksdt1es2l1tuf2hbn.apps.googleusercontent.com
```

Este mismo Client ID funcionará para:
- ✅ Web (frontend)
- ✅ Mobile (esta app)
- ✅ Firebase Google Sign-In

Solo necesitas asegurarte de que en Firebase Console > Authentication > Google Sign-in
uses el mismo proyecto OAuth.

## 📱 Dominios Autorizados

En Firebase Console > Authentication > Settings > Authorized domains, asegúrate de tener:
- ✅ localhost
- ✅ Tu dominio de producción (si lo tienes)

## 🎯 Resultado Final

Después de seguir estos pasos, tendrás:
1. ✅ Proyecto de Firebase creado
2. ✅ Credenciales copiadas en `.env`
3. ✅ Authentication habilitado (Email + Google)
4. ✅ Firestore Database creado
5. ✅ Storage habilitado (opcional)
6. ✅ App lista para autenticación

## ⏱️ Tiempo estimado: 5-10 minutos

---

¿Algún problema? Revisa:
- Que estés en la misma cuenta de Google
- Que hayas copiado correctamente las credenciales
- Que el proyecto esté activo en Firebase Console
