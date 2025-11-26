# 📱 Guía EAS Build - StudiMarket Mobile App

## ✅ Configuración Completada

### 1. **Archivos Creados**
- ✅ `eas.json` - Configuración de builds (development, preview, production)
- ✅ `app.json` - Actualizado con package names y bundle IDs
- ✅ EAS CLI instalado globalmente

### 2. **Configuración de Build Profiles**

**Development** - Para testing interno:
- APK para Android
- Desarrollo con hot reload
- Distribución interna

**Preview** - Para compartir con testers:
- APK para Android (más rápido que AAB)
- Distribución interna
- Sin publicar en stores

**Production** - Para publicar:
- APK para Android
- IPA para iOS
- Listo para stores

---

## 🚀 Paso a Paso: Generar APK con EAS

### **Paso 1: Login en Expo** 🔑

```bash
cd mobile-app
eas login
```

Si no tienes cuenta:
```bash
eas register
```

**Datos a ingresar:**
- Email
- Contraseña
- Username (cambia "tu-usuario-expo" en app.json por este username)

### **Paso 2: Configurar el Proyecto** ⚙️

```bash
eas build:configure
```

Esto verificará:
- ✅ `eas.json` existe
- ✅ `app.json` tiene configuración correcta
- ✅ Credenciales de la cuenta

### **Paso 3: Build Preview (APK Rápido)** 📦

```bash
eas build --platform android --profile preview
```

**¿Qué sucede?**
1. Sube tu código a Expo servers
2. Compila la app en la nube
3. Genera APK descargable
4. Te da un link de descarga

**Tiempo:** ~15-20 minutos

**Output:**
```
✔ Build finished
📱 Install app: https://expo.dev/artifacts/[id]
```

### **Paso 4: Descargar e Instalar** 📲

**Opción 1 - Desde el celular:**
1. Abre el link en tu móvil Android
2. Descarga el APK
3. Instala (habilita "Instalar de fuentes desconocidas")

**Opción 2 - Desde PC:**
1. Descarga el APK del link
2. Transfiere a tu móvil (USB, email, Drive)
3. Abre el archivo en el móvil
4. Instala

### **Paso 5: Build Production (Opcional)** 🏭

Para versión final optimizada:

```bash
eas build --platform android --profile production
```

Diferencias:
- Más optimizado (minificado)
- Más pequeño
- Listo para Google Play Store
- Tarda más tiempo (~25-30 min)

---

## 📋 Comandos EAS Útiles

```bash
# Ver estado de builds
eas build:list

# Ver detalles de un build específico
eas build:view [BUILD_ID]

# Cancelar build en progreso
eas build:cancel [BUILD_ID]

# Build para iOS (requiere Mac o cuenta developer)
eas build --platform ios --profile preview

# Build para ambas plataformas
eas build --platform all --profile preview

# Ver logs en tiempo real
eas build --platform android --profile preview --local

# Limpiar cache
eas build:clear-cache
```

---

## 🔧 Troubleshooting

### Error: "Not logged in"
```bash
eas logout
eas login
```

### Error: "Invalid credentials"
```bash
eas credentials
# Selecciona Android → Generate new keystore
```

### Error: "Build failed"
- Verifica que `app.json` tenga `"name"` y `"slug"` correctos
- Verifica que `package.json` tenga todas las dependencias
- Revisa logs: `eas build:view [BUILD_ID]`

### Error: "Package name already exists"
Cambia en `app.json`:
```json
"android": {
  "package": "com.tuempresa.studimarket"
}
```

### Build muy lento
- Es normal: 15-30 minutos
- Usa `--profile preview` para más rápido
- No uses `--local` (requiere Android Studio)

---

## 📊 Diferencias: Development vs Preview vs Production

| Feature | Development | Preview | Production |
|---------|-------------|---------|------------|
| **Tamaño** | Grande | Mediano | Pequeño |
| **Tiempo** | ~10 min | ~15 min | ~25 min |
| **Hot Reload** | ✅ Sí | ❌ No | ❌ No |
| **Optimizado** | ❌ No | ⚠️ Parcial | ✅ Sí |
| **Para Testing** | ✅ Dev | ✅ QA | ❌ No |
| **Para Store** | ❌ No | ❌ No | ✅ Sí |

---

## 🎯 Recomendación para tu Deadline (Mañana 10 AM)

### **Usa Preview Build**

```bash
cd mobile-app
eas login
eas build --platform android --profile preview
```

**Por qué:**
- ✅ Más rápido que production
- ✅ APK instalable directamente
- ✅ Suficiente para demostración
- ✅ No requiere Google Play Store
- ✅ Funciona offline una vez instalado

**Timeline:**
- Login: 2 min
- Build: 15-20 min
- Descarga: 2 min
- Instalación: 1 min
- **Total: ~25 minutos**

---

## 📲 Compartir APK con Otros

Después del build, tienes 3 opciones:

### **1. Link directo de Expo**
```
https://expo.dev/artifacts/[build-id]
```
- Expira en 30 días
- Requiere internet para descargar
- Más fácil de compartir

### **2. Subir a Google Drive**
- Descarga el APK
- Sube a Drive
- Comparte el link

### **3. QR Code**
EAS genera un QR que puedes escanear para descargar directamente

---

## 🆚 EAS Build vs Expo Go

| Feature | Expo Go | EAS Build |
|---------|---------|-----------|
| **Instalación** | Desde Play Store | APK custom |
| **Custom Native** | ❌ Limitado | ✅ Total |
| **Offline** | ❌ Requiere Expo Go | ✅ Standalone |
| **Icon Propio** | ❌ No | ✅ Sí |
| **Producción** | ❌ No | ✅ Sí |
| **Para Demo** | ⚠️ Aceptable | ✅ Profesional |

---

## 🎨 Personalización Pre-Build

Antes de hacer `eas build`, asegúrate de:

### 1. **Iconos y Splash Screen**
```bash
# Verifica que existan
ls assets/icon.png          # 1024x1024
ls assets/adaptive-icon.png # 1024x1024
ls assets/splash-icon.png   # 2048x2048
```

### 2. **Nombre de la App**
En `app.json`:
```json
{
  "expo": {
    "name": "StudiMarket",  // ← Nombre que aparece en el móvil
    "slug": "studimarket"    // ← URL en Expo
  }
}
```

### 3. **Package Name**
En `app.json`:
```json
{
  "android": {
    "package": "com.estudiantes.studimarket"  // ← Único en Play Store
  }
}
```

### 4. **Versión**
En `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",  // ← Versión visible
  },
  "android": {
    "versionCode": 1     // ← Número interno (incrementa en updates)
  }
}
```

---

## 📝 Actualizar `app.json` con tu Username

**IMPORTANTE:** Después del login, actualiza:

```json
{
  "expo": {
    "owner": "tu-username-expo",  // ← Reemplaza con tu username real
    "slug": "studimarket"
  }
}
```

Ejemplo:
```json
{
  "expo": {
    "owner": "juanperez",
    "slug": "studimarket"
  }
}
```

---

## ✅ Checklist Pre-Build

- [ ] EAS CLI instalado: `eas --version`
- [ ] Login exitoso: `eas whoami`
- [ ] `app.json` actualizado con tu username
- [ ] Assets existen (icon, splash)
- [ ] Backend corriendo (si la app lo necesita)
- [ ] `eas.json` configurado
- [ ] Internet estable (build en la nube)

---

## 🚀 Comando Final para tu Presentación

```bash
# 1. Login
cd mobile-app
eas login

# 2. Build
eas build --platform android --profile preview

# 3. Esperar (~15-20 min)
# Verás progreso en terminal y email

# 4. Descargar APK del link que te da

# 5. Instalar en tu móvil Android

# 6. ¡Listo para presentar! 🎉
```

---

## 🎉 Ventajas de tu App con EAS Build

- ✅ App standalone (no necesita Expo Go)
- ✅ Icon propio (StudiMarket logo)
- ✅ Splash screen personalizado
- ✅ Se instala como app nativa
- ✅ Funciona offline (una vez instalada)
- ✅ Profesional para presentación
- ✅ Puedes compartir APK fácilmente

---

## 📞 Soporte

Si algo falla:
1. Revisa logs: `eas build:list`
2. Docs oficiales: https://docs.expo.dev/build/setup/
3. Foro: https://forums.expo.dev/

---

**¡Listo para generar tu APK! Ejecuta los comandos y en 25 minutos tendrás tu app instalable. 🚀**

**Siguiente paso:** `eas login` y luego `eas build --platform android --profile preview`
