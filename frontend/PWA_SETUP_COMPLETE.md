# 📱 Guía PWA - StudiMarket

## ✅ Configuración Completada

### 1. **Vite PWA Plugin** - Configurado
- ✅ Service Worker con Workbox
- ✅ Manifest.json generado automáticamente
- ✅ Cache de assets (imágenes, fuentes, CSS, JS)
- ✅ Cache de API con NetworkFirst
- ✅ Actualización automática

### 2. **Archivos Creados**
- ✅ `vite.config.js` - Configuración PWA completa
- ✅ `index.html` - Meta tags PWA + SEO
- ✅ `main.jsx` - Registro del Service Worker
- ✅ `public/logo.svg` - Logo base
- ✅ `public/generate-icons.html` - Generador de iconos
- ✅ `public/robots.txt` - SEO

### 3. **Generar Iconos PWA** 🎨

**Paso 1:** Inicia el servidor de desarrollo
```bash
cd frontend
npm run dev
```

**Paso 2:** Abre el generador de iconos
```
http://localhost:5173/generate-icons.html
```

**Paso 3:** 
1. Click en "✨ Generar Todos los Iconos"
2. Click en "📥 Descargar Todos"
3. Guarda todos los PNG en `frontend/public/`

**Iconos que se generan:**
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`
- `maskable-icon-512x512.png`
- `apple-touch-icon.png`
- `favicon-32x32.png`
- `favicon-16x16.png`

### 4. **Probar la PWA** 🧪

**En desarrollo:**
```bash
cd frontend
npm run dev
```
Abre Chrome/Edge → `http://localhost:5173` → Verás el icono de instalar en la barra de direcciones

**En producción:**
```bash
npm run build
npm run preview
```

### 5. **Instalar en Móvil** 📲

**Android (Chrome/Edge):**
1. Abre la app en el navegador
2. Menú (⋮) → "Instalar app" o "Agregar a inicio"
3. ¡Listo! La app aparece como nativa

**iOS (Safari):**
1. Abre la app en Safari
2. Botón Compartir → "Agregar a pantalla de inicio"
3. La app aparece en el home

### 6. **Características PWA Activas** ✨

- ✅ **Offline Ready** - Funciona sin conexión
- ✅ **Instalable** - Se instala como app nativa
- ✅ **Fast** - Cache de assets para carga rápida
- ✅ **Responsive** - Adapta a todos los dispositivos
- ✅ **Auto-update** - Actualización automática de versiones
- ✅ **App Shell** - Carga instantánea
- ✅ **SEO Optimized** - Meta tags completos

### 7. **Service Worker Cache Strategy**

**NetworkFirst** (API):
- Intenta red primero
- Si falla, usa cache
- Timeout: 10 segundos
- Cache por 5 minutos

**CacheFirst** (Imágenes):
- Cache primero
- Cache por 30 días
- Máximo 200 imágenes

**CacheFirst** (Fuentes):
- Cache permanente
- Cache por 1 año

### 8. **Build para Producción** 🚀

```bash
cd frontend
npm run build
```

Esto genera:
- `dist/` - Archivos optimizados
- `dist/manifest.webmanifest` - Manifest PWA
- `dist/sw.js` - Service Worker
- `dist/workbox-*.js` - Workbox runtime

### 9. **Verificar PWA** ✅

**Chrome DevTools:**
1. F12 → Application tab
2. Manifest → Ver manifest.json
3. Service Workers → Ver estado
4. Storage → Ver cache
5. Lighthouse → Auditoría PWA (debe dar 100/100)

### 10. **Deploy** 🌐

La PWA está lista para:
- Firebase Hosting
- Vercel
- Netlify
- GitHub Pages
- Cualquier hosting estático

**Firebase Deploy:**
```bash
firebase login
firebase init hosting
firebase deploy
```

## 🎉 ¡PWA Completa!

Tu frontend ahora es una **Progressive Web App** instalable y funciona offline.

**Siguiente paso:** Generar los iconos siguiendo el Paso 3 de esta guía.
