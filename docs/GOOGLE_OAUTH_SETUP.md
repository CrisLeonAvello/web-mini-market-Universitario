# 🔐 Configuración de Google OAuth para StudiMarket

## 📋 Índice
1. [Crear Proyecto en Google Cloud](#1-crear-proyecto-en-google-cloud)
2. [Configurar OAuth Consent Screen](#2-configurar-oauth-consent-screen)
3. [Crear Credenciales OAuth](#3-crear-credenciales-oauth)
4. [Configurar Backend](#4-configurar-backend)
5. [Configurar Frontend/Mobile](#5-configurar-frontendmobile)
6. [Probar la Integración](#6-probar-la-integración)

---

## 1. Crear Proyecto en Google Cloud

### Paso 1.1: Acceder a Google Cloud Console
1. Ve a: https://console.cloud.google.com/  
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto:
   - Clic en el selector de proyectos (arriba a la izquier  da)
   - Clic en "Nuevo proyecto"
   - Nombre: `StudiMarket`
   - Clic en "Crear"

### Paso 1.2: Habilitar Google+ API
1. En el menú lateral: **APIs y servicios** > **Biblioteca**
2. Buscar: `Google+ API`
3. Clic en **Habilitar**

---

## 2. Configurar OAuth Consent Screen

### Paso 2.1: Configuración Básica
1. Ve a: **APIs y servicios** > **Pantalla de consentimiento de OAuth**
2. Selecciona: **Externo** (para cualquier usuario con cuenta de Google)
3. Clic en **Crear**

### Paso 2.2: Información de la Aplicación
```
Nombre de la aplicación: StudiMarket
Correo de asistencia: tu-email@ejemplo.com
Logotipo de la aplicación: (Opcional) Sube el logo
Dominio de la aplicación:
  - Dominio autorizado: tu-dominio.com (cuando lo tengas)
Correo del desarrollador: tu-email@ejemplo.com
```

### Paso 2.3: Ámbitos (Scopes)
Agregar estos scopes:
- `email`
- `profile`
- `openid`

### Paso 2.4: Usuarios de Prueba (Modo desarrollo)
Agrega emails de prueba:
```
- tu-email@gmail.com
- otro-email@gmail.com
```

---

## 3. Crear Credenciales OAuth

### Paso 3.1: Crear ID de Cliente
1. Ve a: **APIs y servicios** > **Credenciales**
2. Clic en **+ CREAR CREDENCIALES**
3. Selecciona: **ID de cliente de OAuth 2.0**

### Paso 3.2: Configurar para Web (Frontend)
```
Tipo de aplicación: Aplicación web
Nombre: StudiMarket Web Client

Orígenes autorizados de JavaScript:
  - http://localhost:5173
  - http://localhost:3000
  - https://tu-dominio.com (producción)

URIs de redirección autorizadas:
  - http://localhost:5173/auth/callback
  - https://tu-dominio.com/auth/callback
```

### Paso 3.3: Configurar para Android (Mobile App)
```
Tipo de aplicación: Android
Nombre: StudiMarket Android

Nombre del paquete: com.studimarket.app
SHA-1: (Obtener con: keytool -list -v -keystore ~/.android/debug.keystore)
```

### Paso 3.4: Guardar Credenciales
Al crear las credenciales, obtendrás:
```
Client ID: 123456789-abcdefg.apps.googleusercontent.com
Client Secret: GOCSPX-abc123xyz
```

**⚠️ IMPORTANTE**: Guarda estas credenciales de forma segura.

---

## 4. Configurar Backend

### Paso 4.1: Instalar Dependencias
```bash
cd backend
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### Paso 4.2: Configurar Variables de Entorno
Crea/edita el archivo `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
```

### Paso 4.3: Verificar Endpoint
El backend ya tiene el endpoint configurado:
```
POST /api/auth/google
Body: { "id_token": "token-de-google" }
```

---

## 5. Configurar Frontend/Mobile

### 5.1 Frontend Web (React)

#### Instalar Dependencias
```bash
cd frontend
npm install @react-oauth/google
```

#### Configurar en main.jsx o index.jsx
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "123456789-abcdefg.apps.googleusercontent.com";

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
```

#### Agregar Botón de Google Login
```jsx
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        })
      });
      
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      // Redirigir al usuario
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}
```

### 5.2 Mobile App (React Native + Expo)

#### Instalar Dependencias
```bash
cd mobile-app
npx expo install expo-auth-session expo-crypto
npm install @react-native-google-signin/google-signin
```

#### Configurar en app.json
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.studimarket.app"
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

#### Implementar Google Sign-In
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configurar al inicio de la app
GoogleSignin.configure({
  webClientId: '123456789-abcdefg.apps.googleusercontent.com',
  offlineAccess: true,
});

// En el componente de login
const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    // Enviar idToken al backend
    const response = await fetch('http://localhost:8000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_token: userInfo.idToken
      })
    });
    
    const data = await response.json();
    // Guardar token y redirigir
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 6. Probar la Integración

### Paso 6.1: Verificar Backend
```bash
# Iniciar backend
cd backend
uvicorn app.main:app --reload

# Probar endpoint (con Postman o curl)
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"id_token": "token-de-prueba"}'
```

### Paso 6.2: Probar Frontend Web
1. Iniciar frontend: `npm run dev`
2. Abrir: `http://localhost:5173`
3. Clic en "Iniciar sesión con Google"
4. Seleccionar cuenta de Google
5. Verificar que recibe el token JWT

### Paso 6.3: Probar Mobile App
1. Iniciar expo: `npx expo start`
2. Escanear QR con Expo Go
3. Probar login con Google
4. Verificar autenticación

---

## 🔧 Solución de Problemas

### Error: "Token inválido"
- ✅ Verifica que `GOOGLE_CLIENT_ID` sea correcto
- ✅ Verifica que el token no haya expirado
- ✅ Confirma que el email esté en "Usuarios de prueba" (modo desarrollo)

### Error: "redirect_uri_mismatch"
- ✅ Verifica que la URI de redirección esté en la lista autorizada
- ✅ Asegúrate de incluir el protocolo (`http://` o `https://`)
- ✅ No uses espacios ni caracteres especiales

### Error: "Access blocked"
- ✅ Verifica que la OAuth Consent Screen esté publicada
- ✅ Agrega tu email a "Usuarios de prueba"
- ✅ Espera unos minutos después de hacer cambios

### Error de CORS
- ✅ Verifica que el origen esté en `BACKEND_CORS_ORIGINS`
- ✅ Reinicia el servidor backend después de cambios

---

## 📚 Referencias

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [FastAPI Authentication](https://fastapi.tiangolo.com/tutorial/security/)

---

## ✅ Checklist Final

Backend:
- [ ] Dependencias instaladas (`google-auth`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Endpoint `/api/auth/google` funcionando
- [ ] CORS configurado correctamente

Frontend Web:
- [ ] `@react-oauth/google` instalado
- [ ] `GoogleOAuthProvider` configurado
- [ ] Botón de Google Login implementado
- [ ] Manejo de respuesta y token

Mobile App:
- [ ] `@react-native-google-signin/google-signin` instalado
- [ ] `app.json` configurado
- [ ] Google Sign-In inicializado
- [ ] Flujo de autenticación completo

Google Cloud:
- [ ] Proyecto creado
- [ ] OAuth Consent Screen configurado
- [ ] Credenciales creadas (Web + Android)
- [ ] Usuarios de prueba agregados

---

**🎉 ¡Listo!** Tu aplicación ahora soporta autenticación con Google OAuth.
