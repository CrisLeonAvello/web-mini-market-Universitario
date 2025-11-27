# Documento de Integración - StudiMarket


link repositorio: 
## 1. Arquitectura General del Sistema

### 1.1 Visión General

StudiMarket es una plataforma de e-commerce universitaria desarrollada con arquitectura de microservicios, compuesta por tres componentes principales que se comunican entre sí:

```
┌─────────────────────────────────────────────────────────────────┐
│                         STUDIMAR KET                             │
│                   Plataforma E-Commerce                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
         │   Frontend  │ │Backend │ │  Mobile    │
         │   Web       │ │  API   │ │    App     │
         │  (React)    │ │(FastAPI)│ │(React Ntv) │
         └──────┬──────┘ └───┬────┘ └─────┬──────┘
                │            │            │
                └────────────┼────────────┘
                             │
                    ┌────────▼────────┐
                    │    Firebase     │
                    │   (Auth + DB)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   MySQL 8.0     │
                    │   (Productos,   │
                    │   Órdenes, etc) │
                    └─────────────────┘
```

### 1.2 Componentes del Sistema

#### **Backend API (FastAPI + Python)**
- **Ubicación:** `backend/`
- **Puerto:** 8000
- **Base de datos:** MySQL 8.0
- **Contenedor Docker:** `minimarket_backend`
- **Responsabilidades:**
  - Gestión de productos, categorías y inventario
  - Procesamiento de órdenes y ventas
  - Gestión de carrito de compras
  - Sistema de favoritos/wishlist
  - Autenticación JWT
  - Validación de usuarios con Firebase
  - API RESTful con documentación OpenAPI

**Tecnologías:**
```
- FastAPI 0.104.1
- SQLAlchemy (ORM)
- Alembic (Migraciones)
- Pydantic (Validación)
- JWT (Autenticación)
- Google Auth Library
- Docker + Docker Compose
```

#### **Frontend Web (React + Vite)**
- **Ubicación:** `frontend/`
- **Puerto:** 5173
- **Framework:** React 18.3 + TypeScript
- **Contenedor Docker:** `minimarket_frontend`
- **Responsabilidades:**
  - Interfaz de usuario web responsiva
  - Catálogo de productos con búsqueda y filtros
  - Gestión de perfil de usuario
  - Proceso de compra y ventas
  - Dashboard de vendedor
  - PWA (Progressive Web App)

**Tecnologías:**
```
- React 18.3 + TypeScript
- Vite (Build tool)
- React Router v6
- Firebase Web SDK
- Axios (HTTP client)
- Tailwind CSS + shadcn/ui
- Zustand (State management)
```

#### **Aplicación Móvil (React Native + Expo)**
- **Ubicación:** `mobile-app/`
- **Puerto:** 8081 (Metro bundler)
- **Framework:** React Native 0.81.5 + Expo SDK 54
- **Responsabilidades:**
  - Experiencia móvil nativa para iOS/Android
  - Mismo flujo de autenticación que web
  - Catálogo, carrito y compras móviles
  - Notificaciones push (futuro)
  - Geolocalización (futuro)

**Tecnologías:**
```
- React Native 0.81.5
- Expo SDK ~54.0.25
- Firebase Web SDK (para compatibilidad Expo)
- React Navigation v6
- AsyncStorage
- Expo Vector Icons
- Expo Linear Gradient
```

### 1.3 Arquitectura de Base de Datos

#### **Firebase (Autenticación + Perfil)**
```
Firebase Authentication
├── Email/Password
└── Google OAuth 2.0

Firestore Database
└── users/
    └── {userId}/
        ├── uid: string
        ├── email: string
        ├── displayName: string
        ├── photoURL: string
        ├── phoneNumber?: string
        ├── universidad?: string
        ├── carrera?: string
        ├── role: 'cliente' | 'vendedor'
        ├── createdAt: timestamp
        └── lastLogin: timestamp
```

#### **MySQL (Datos de Negocio)**
```sql
-- Esquema principal
usuarios
├── id (PK)
├── firebase_uid (UNIQUE)
├── email
├── nombre
├── rol (cliente, vendedor, admin)
├── telefono
├── universidad
└── timestamps

productos
├── id (PK)
├── vendedor_id (FK -> usuarios)
├── nombre
├── descripcion
├── precio
├── stock
├── categoria_id (FK -> categorias)
├── imagen_url
└── timestamps

carrito_items
├── id (PK)
├── usuario_id (FK -> usuarios)
├── producto_id (FK -> productos)
├── cantidad
└── timestamps

favoritos
├── id (PK)
├── usuario_id (FK -> usuarios)
├── producto_id (FK -> productos)
└── timestamps

ventas
├── id (PK)
├── comprador_id (FK -> usuarios)
├── vendedor_id (FK -> usuarios)
├── producto_id (FK -> productos)
├── cantidad
├── precio_total
├── estado (pendiente, completado, cancelado)
└── timestamps
```

---

## 2. Flujo de Autenticación Social

### 2.1 Arquitectura de Autenticación Dual

StudiMarket implementa un **sistema de autenticación dual** que combina Firebase Authentication (para gestión de identidad) con JWT tokens del backend (para autorización de API):

```
┌──────────────┐
│   Cliente    │
│ (Web/Mobile) │
└──────┬───────┘
       │
       │ 1. Login Request
       ▼
┌──────────────────┐
│     Firebase     │
│  Authentication  │
└──────┬───────────┘
       │
       │ 2. Firebase Token
       ▼
┌──────────────────┐
│   App Context    │
│  (Auth State)    │
└──────┬───────────┘
       │
       │ 3. Backend Login
       ▼
┌──────────────────┐
│   Backend API    │
│   (FastAPI)      │
└──────┬───────────┘
       │
       │ 4. JWT Token
       ▼
┌──────────────────┐
│  AsyncStorage/   │
│  LocalStorage    │
└──────────────────┘
```

### 2.2 Flujo Detallado: Registro de Usuario

#### **Paso 1: Crear cuenta Firebase**
```typescript
// mobile-app/src/services/firebaseAuthService.ts
async registerWithFirebase(email: string, password: string, userData: any) {
  // 1. Crear usuario en Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth, 
    email, 
    password
  );
  const user = userCredential.user;
  
  // 2. Actualizar perfil de Firebase
  await updateProfile(user, {
    displayName: userData.nombre
  });
  
  // 3. Crear documento en Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: userData.nombre,
    role: userData.rol || 'cliente',
    universidad: userData.universidad,
    createdAt: serverTimestamp()
  });
}
```

#### **Paso 2: Registrar en backend**
```typescript
// 4. Registrar usuario en backend MySQL
const backendResponse = await authService.register({
  email,
  password,
  nombre: userData.nombre,
  rol: userData.rol,
  telefono: userData.telefono,
  universidad: userData.universidad,
  firebase_uid: user.uid  // ¡Importante! Vincula Firebase con MySQL
});
```

#### **Paso 3: Auto-login**
```typescript
// 5. Iniciar sesión automáticamente
const loginResult = await loginWithFirebase(email, password);

// 6. Guardar tokens en AsyncStorage
await storageService.setToken(loginResult.backendToken);
await storageService.setUser(loginResult.user);
```

### 2.3 Flujo Detallado: Login con Email/Password

```
┌─────────────┐
│   Usuario   │
│ Ingresa     │
│ Credenciales│
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 1. Firebase Authentication                           │
│    signInWithEmailAndPassword(email, password)       │
└──────┬───────────────────────────────────────────────┘
       │
       │ ✓ Firebase Token + User Object
       ▼
┌──────────────────────────────────────────────────────┐
│ 2. Backend Validation                                │
│    POST /api/auth/login                              │
│    Body: { email, password }                         │
└──────┬───────────────────────────────────────────────┘
       │
       │ Backend valida credenciales en MySQL
       │ Verifica firebase_uid coincide
       ▼
┌──────────────────────────────────────────────────────┐
│ 3. JWT Token Generation                              │
│    Response: {                                       │
│      access_token: "eyJhbGc...",                     │
│      token_type: "bearer",                           │
│      user: {...}                                     │
│    }                                                 │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 4. Update Firestore                                  │
│    updateDoc(users/{uid}, {                          │
│      lastLogin: serverTimestamp()                    │
│    })                                                │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 5. Store Tokens Locally                              │
│    - AsyncStorage.setItem('token', jwt)              │
│    - AsyncStorage.setItem('user', JSON.stringify)    │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 6. Navigate to Home                                  │
│    AuthContext updates isAuthenticated = true        │
└──────────────────────────────────────────────────────┘
```

### 2.4 Flujo Detallado: Login con Google OAuth

```
┌─────────────┐
│   Usuario   │
│ Click en    │
│ "Google"    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 1. Google OAuth Popup (Web) / Google Sign-In (Mobile)│
│    signInWithPopup(auth, googleProvider)             │
│    - Abre ventana de selección de cuenta Google     │
│    - Usuario autoriza acceso a email y perfil       │
└──────┬───────────────────────────────────────────────┘
       │
       │ Google ID Token + User Info
       ▼
┌──────────────────────────────────────────────────────┐
│ 2. Firebase Authentication                           │
│    Firebase valida el token de Google               │
│    Crea o retorna usuario existente                 │
│    UserCredential {                                  │
│      user: {                                         │
│        uid, email, displayName,                      │
│        photoURL, emailVerified: true                 │
│      }                                               │
│    }                                                 │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 3. Check/Create Firestore Profile                    │
│    const userDoc = await getDoc(doc(db, 'users', uid))│
│    if (!userDoc.exists()) {                          │
│      // Nuevo usuario de Google                     │
│      await setDoc(doc(db, 'users', uid), {           │
│        uid, email, displayName, photoURL,            │
│        role: 'cliente',                              │
│        provider: 'google',                           │
│        createdAt: serverTimestamp()                  │
│      });                                             │
│    } else {                                          │
│      // Usuario existente, actualizar lastLogin     │
│      await updateDoc(userDoc.ref, {                  │
│        lastLogin: serverTimestamp()                  │
│      });                                             │
│    }                                                 │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 4. Backend Registration/Login                        │
│    POST /api/auth/google-login                       │
│    Body: {                                           │
│      firebase_uid: user.uid,                         │
│      email: user.email,                              │
│      nombre: user.displayName,                       │
│      photoURL: user.photoURL                         │
│    }                                                 │
│                                                      │
│    Backend verifica si usuario existe:              │
│    - Si existe: genera JWT                          │
│    - Si no existe: crea usuario + genera JWT        │
└──────┬───────────────────────────────────────────────┘
       │
       │ JWT Token + User Data
       ▼
┌──────────────────────────────────────────────────────┐
│ 5. Store Authentication Data                         │
│    - Firebase Token (automático)                     │
│    - Backend JWT → AsyncStorage/LocalStorage         │
│    - User Profile → AsyncStorage/LocalStorage        │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ 6. AuthContext Updates                               │
│    setUser(userData)                                 │
│    setToken(jwtToken)                                │
│    setIsAuthenticated(true)                          │
│    → Navigation.navigate('Home')                     │
└──────────────────────────────────────────────────────┘
```

#### **Configuración Google OAuth**

**Client ID Web:**
```
994535848772-q0da4vlbl4spirmksdt1es2l1tuf2hbn.apps.googleusercontent.com
```

**URLs autorizadas:**
- http://localhost:5173 (Web frontend)
- http://localhost:8081 (Expo web)
- exp://localhost:8081 (Expo Go)

### 2.5 Persistencia de Sesión

#### **Firebase onAuthStateChanged Observer**
```typescript
// mobile-app/src/contexts/AuthContext.tsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Usuario logueado en Firebase
      const storedToken = await storageService.getToken();
      const storedUser = await storageService.getUser();
      
      if (storedToken && storedUser) {
        // Sesión válida
        setUser(storedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Firebase sí, pero backend no → re-login
        await reAuthenticateWithBackend(firebaseUser);
      }
    } else {
      // No hay usuario → logout
      clearAuthState();
    }
    setLoading(false);
  });
  
  return unsubscribe;
}, []);
```

#### **Validación JWT en Backend**
```python
# backend/app/auth.py
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar las credenciales"
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user
```

---

## 3. Diagrama de Comunicación entre Componentes

### 3.1 Flujo Completo: Desde Login hasta Compra

```
┌───────────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO DE USUARIO                      │
└───────────────────────────────────────────────────────────────────┘

FASE 1: AUTENTICACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│ Mobile   │──(1)─→│ Firebase │──(2)─→│ Backend  │──(3)─→│  MySQL   │
│   App    │       │   Auth   │       │   API    │       │ Database │
└──────────┘       └──────────┘       └──────────┘       └──────────┘
     │                  │                  │                   │
     │ Login Request    │                  │                   │
     │ email/password   │                  │                   │
     │─────────────────→│                  │                   │
     │                  │                  │                   │
     │                  │ Validate         │                   │
     │                  │ Credentials      │                   │
     │                  │──────────┐       │                   │
     │                  │          │       │                   │
     │                  │←─────────┘       │                   │
     │                  │                  │                   │
     │  Firebase Token  │                  │                   │
     │←─────────────────│                  │                   │
     │                  │                  │                   │
     │                  │                  │                   │
     │ POST /api/auth/login                │                   │
     │ {email, password}                   │                   │
     │────────────────────────────────────→│                   │
     │                  │                  │                   │
     │                  │                  │ SELECT * FROM     │
     │                  │                  │ usuarios WHERE    │
     │                  │                  │ email = ?         │
     │                  │                  │──────────────────→│
     │                  │                  │                   │
     │                  │                  │  User Data        │
     │                  │                  │←──────────────────│
     │                  │                  │                   │
     │                  │                  │ Generate JWT      │
     │                  │                  │──────────┐        │
     │                  │                  │          │        │
     │                  │                  │←─────────┘        │
     │                  │                  │                   │
     │  JWT Token + User Data              │                   │
     │←────────────────────────────────────│                   │
     │                  │                  │                   │
     │ Store in         │                  │                   │
     │ AsyncStorage     │                  │                   │
     │──────────┐       │                  │                   │
     │          │       │                  │                   │
     │←─────────┘       │                  │                   │
     │                  │                  │                   │


FASE 2: NAVEGACIÓN Y BÚSQUEDA DE PRODUCTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     │                                     │                   │
     │ GET /api/productos                  │                   │
     │ Headers: {Authorization: Bearer JWT}│                   │
     │────────────────────────────────────→│                   │
     │                                     │                   │
     │                                     │ Verify JWT        │
     │                                     │──────────┐        │
     │                                     │          │        │
     │                                     │←─────────┘        │
     │                                     │                   │
     │                                     │ SELECT * FROM     │
     │                                     │ productos JOIN    │
     │                                     │ usuarios ON ...   │
     │                                     │──────────────────→│
     │                                     │                   │
     │                                     │ Products Data     │
     │                                     │←──────────────────│
     │                                     │                   │
     │  Array de productos                 │                   │
     │←────────────────────────────────────│                   │
     │                                     │                   │
     │ Render ProductList                  │                   │
     │──────────┐                          │                   │
     │          │                          │                   │
     │←─────────┘                          │                   │
     │                                     │                   │


FASE 3: AGREGAR AL CARRITO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     │                                     │                   │
     │ POST /api/carrito                   │                   │
     │ Headers: {Authorization: Bearer JWT}│                   │
     │ Body: {producto_id: 123, cantidad: 2}                   │
     │────────────────────────────────────→│                   │
     │                                     │                   │
     │                                     │ Verify JWT        │
     │                                     │ Extract user_id   │
     │                                     │──────────┐        │
     │                                     │          │        │
     │                                     │←─────────┘        │
     │                                     │                   │
     │                                     │ INSERT INTO       │
     │                                     │ carrito_items     │
     │                                     │ (usuario_id, ...)│
     │                                     │──────────────────→│
     │                                     │                   │
     │                                     │  Success          │
     │                                     │←──────────────────│
     │                                     │                   │
     │  Cart Item Created                  │                   │
     │←────────────────────────────────────│                   │
     │                                     │                   │
     │ Update CartContext                  │                   │
     │ itemCount++                         │                   │
     │──────────┐                          │                   │
     │          │                          │                   │
     │←─────────┘                          │                   │
     │                                     │                   │


FASE 4: PROCESO DE CHECKOUT Y COMPRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     │                                     │                   │
     │ POST /api/carrito/checkout          │                   │
     │ Headers: {Authorization: Bearer JWT}│                   │
     │────────────────────────────────────→│                   │
     │                                     │                   │
     │                                     │ BEGIN TRANSACTION │
     │                                     │──────────────────→│
     │                                     │                   │
     │                                     │ 1. GET cart items │
     │                                     │ 2. CREATE ventas  │
     │                                     │ 3. UPDATE stock   │
     │                                     │ 4. CLEAR carrito  │
     │                                     │──────────────────→│
     │                                     │                   │
     │                                     │  COMMIT           │
     │                                     │←──────────────────│
     │                                     │                   │
     │  Order Created                      │                   │
     │  {venta_id: 456, total: 25000}      │                   │
     │←────────────────────────────────────│                   │
     │                                     │                   │
     │ Navigate to OrderSuccess            │                   │
     │──────────┐                          │                   │
     │          │                          │                   │
     │←─────────┘                          │                   │
     │                                     │                   │


FASE 5: SINCRONIZACIÓN CON FIRESTORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     │                  │                  │                   │
     │ Update user      │                  │                   │
     │ activity         │                  │                   │
     │─────────────────→│                  │                   │
     │                  │                  │                   │
     │                  │ Update Firestore │                   │
     │                  │ users/{uid}/     │                   │
     │                  │ lastActivity     │                   │
     │                  │──────────┐       │                   │
     │                  │          │       │                   │
     │                  │←─────────┘       │                   │
     │                  │                  │                   │
     │  Success         │                  │                   │
     │←─────────────────│                  │                   │
     │                  │                  │                   │
```

### 3.2 Flujo de Datos: Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌────────────────┐              ┌────────────────┐             │
│  │  React Web     │              │ React Native   │             │
│  │  Components    │              │   Screens      │             │
│  └────────┬───────┘              └───────┬────────┘             │
│           │                              │                      │
└───────────┼──────────────────────────────┼──────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│  ┌────────────────┐              ┌────────────────┐             │
│  │    Zustand     │              │  React Context │             │
│  │   (Web Store)  │              │  (AuthContext, │             │
│  │                │              │   CartContext) │             │
│  └────────┬───────┘              └───────┬────────┘             │
│           │                              │                      │
└───────────┼──────────────────────────────┼──────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐      │
│  │  authService   │  │ cartService  │  │ orderService   │      │
│  ├────────────────┤  ├──────────────┤  ├────────────────┤      │
│  │ firebaseAuth   │  │ wishlist     │  │ productService │      │
│  │    Service     │  │   Service    │  │                │      │
│  └────────┬───────┘  └──────┬───────┘  └────────┬───────┘      │
│           │                 │                    │              │
└───────────┼─────────────────┼────────────────────┼──────────────┘
            │                 │                    │
            └─────────────────┼────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       INTEGRATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Axios HTTP Client                       │       │
│  │  • Interceptors (JWT auto-injection)                 │       │
│  │  • Error handling                                    │       │
│  │  • Request/Response transformation                   │       │
│  └─────────────────────┬────────────────────────────────┘       │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌───────────┐ ┌─────────────┐
│   Firebase     │ │  Backend  │ │   MySQL     │
│ Authentication │ │  FastAPI  │ │  Database   │
│   + Firestore  │ │           │ │             │
└────────────────┘ └───────────┘ └─────────────┘
```

### 3.3 Endpoints Principales del Backend

#### **Autenticación**
```
POST   /api/auth/register         # Registro de usuario
POST   /api/auth/login            # Login email/password
POST   /api/auth/google-login     # Login con Google (futuro)
GET    /api/auth/me               # Obtener usuario actual
```

#### **Productos**
```
GET    /api/productos             # Listar productos (con filtros)
GET    /api/productos/:id         # Detalle de producto
POST   /api/productos             # Crear producto (vendedor)
PUT    /api/productos/:id         # Actualizar producto
DELETE /api/productos/:id         # Eliminar producto
GET    /api/categorias            # Listar categorías
```

#### **Carrito**
```
GET    /api/carrito               # Obtener carrito del usuario
POST   /api/carrito               # Agregar item al carrito
PUT    /api/carrito/:id           # Actualizar cantidad
DELETE /api/carrito/:id           # Remover item
POST   /api/carrito/checkout      # Finalizar compra
```

#### **Favoritos**
```
GET    /api/favoritos             # Listar favoritos del usuario
POST   /api/favoritos             # Agregar a favoritos
DELETE /api/favoritos/:id         # Quitar de favoritos
```

#### **Ventas/Órdenes**
```
GET    /api/ventas                # Mis compras (como comprador)
GET    /api/ventas/vendedor       # Mis ventas (como vendedor)
GET    /api/ventas/:id            # Detalle de venta
PUT    /api/ventas/:id/estado     # Actualizar estado de venta
```

---

## 4. Seguridad y Buenas Prácticas

### 4.1 Autenticación y Autorización

- **Firebase Authentication**: Maneja identidad y sesión de usuario
- **JWT Tokens**: Autorización para API backend (expiran en 24 horas)
- **HTTP-only Cookies**: No utilizados (JWT en headers para compatibilidad móvil)
- **CORS**: Configurado para permitir solo orígenes autorizados
- **Password Hashing**: bcrypt en backend (aunque Firebase maneja passwords)

### 4.2 Validación de Datos

- **Frontend**: Validación de formularios con Yup/Zod
- **Backend**: Pydantic schemas para validación estricta
- **Sanitización**: Prevención de XSS e inyección SQL

### 4.3 Manejo de Errores

```typescript
// Ejemplo de error handling consistente
try {
  const response = await apiRequest('/productos', 'GET');
  return response.data;
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expirado → logout
    await logout();
  } else if (error.response?.status === 403) {
    // Sin permisos
    Alert.alert('Error', 'No tienes permisos para esta acción');
  } else {
    // Error genérico
    Alert.alert('Error', error.message || 'Algo salió mal');
  }
  throw error;
}
```

---

## 5. Despliegue y Escalabilidad

### 5.1 Configuración Docker

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql://...
      - FIREBASE_CREDENTIALS=...
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8000
```

### 5.2 Variables de Entorno

**Backend (.env):**
```bash
DATABASE_URL=mysql+pymysql://root:password@db:3306/minimarket
SECRET_KEY=your-secret-key
FIREBASE_PROJECT_ID=studimarket
GOOGLE_APPLICATION_CREDENTIALS=./firebase-adminsdk.json
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=studimarket.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studimarket
```

**Mobile (.env):**
```bash
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_GOOGLE_CLIENT_ID=994535848772-...
```

---

## 6. Conclusiones y Próximos Pasos

### 6.1 Estado Actual

✅ **Completado:**
- Arquitectura de microservicios funcional
- Autenticación dual (Firebase + JWT)
- CRUD completo de productos, carrito, favoritos, ventas
- Frontend web responsivo con PWA
- App móvil con React Native + Expo
- Dockerización completa

### 6.2 Mejoras Futuras

🔄 **En desarrollo:**
- Implementación completa de Google OAuth en backend
- Sistema de notificaciones push
- Pasarela de pagos (WebPay, MercadoPago)
- Chat entre compradores y vendedores
- Sistema de calificaciones y reviews
- Analytics y métricas de negocio

### 6.3 Escalabilidad

**Optimizaciones planeadas:**
- Redis para caché de productos y sesiones
- CDN para imágenes de productos
- Load balancer para múltiples instancias de backend
- Separación de base de datos por servicio (microservicios puros)
- Queue system (RabbitMQ/Celery) para procesos asíncronos

---

**Documento preparado por:** Equipo de Desarrollo StudiMarket  
**Última actualización:** 26 de Noviembre, 2025  
**Versión:** 1.0
