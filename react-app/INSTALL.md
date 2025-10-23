# 📦 Guía de Instalación Rápida - StudiMarket

## ⚡ Inicio Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/CrisLeonAvello/web-mini-market-Universitario.git

# 2. Navegar al proyecto React
cd web-mini-market-Universitario/react-app

# 3. Instalar dependencias
npm install

# 4. Configurar entorno (opcional)
cp .env.example .env

# 5. Iniciar servidor de desarrollo
npm run dev
```

## 🌐 Acceso a la Aplicación

Una vez iniciado el servidor, abrir en el navegador:
- **URL Local**: http://localhost:5173
- **Puerto alternativo**: Si 5173 está ocupado, Vite usará 5174, 5175, etc.

## ✅ Verificación de Funcionamiento

Después de abrir la aplicación, deberías ver:

1. **Pantalla de carga** inicial (1-2 segundos)
2. **Header** con logo "StudiMarket" y botones de carrito/favoritos
3. **Filtros** en la barra lateral izquierda
4. **Grid de productos** cargados desde FakeStore API
5. **Funcionalidad completa**:
   - ✅ Agregar productos al carrito
   - ✅ Agregar productos a favoritos
   - ✅ Ver detalles de productos
   - ✅ Filtrar por categoría, precio, rating
   - ✅ Búsqueda de productos
   - ✅ Proceso de checkout completo

## 🛠️ Solución de Problemas Comunes

### Error: Puerto en uso
```bash
# Matar procesos Node.js
npx kill-port 5173
# o en Windows:
taskkill /F /IM node.exe /T
```

### Error: Dependencias faltantes
```bash
# Limpiar cache e instalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Variables de entorno
```bash
# Verificar que existe .env (opcional)
ls -la .env
# Si no existe, copiar ejemplo:
cp .env.example .env
```

### Problemas de CSS/Estilos
```bash
# Forzar recarga completa en navegador
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- 📱 **Mobile**: 320px - 768px
- 💻 **Tablet**: 768px - 1024px
- 🖥️ **Desktop**: 1024px+

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor desarrollo

# Producción
npm run build        # Compilar para producción
npm run preview      # Preview del build

# Debugging
npm run lint         # Verificar código
```

## 📊 Performance Esperado

### Tiempos de Carga
- **Primer renderizado**: < 2s
- **Carga de productos**: < 3s
- **Navegación**: < 0.5s

### Tamaño de Bundle
- **Desarrollo**: ~2-3MB
- **Producción**: ~500KB gzipped

## 🚀 Funcionalidades Principales

### ✅ Implementadas
- [x] Catálogo de productos (FakeStore API)
- [x] Carrito de compras con persistencia
- [x] Lista de favoritos
- [x] Sistema de filtros avanzado
- [x] Búsqueda de productos
- [x] Proceso de checkout completo
- [x] Responsive design
- [x] Animaciones y transiciones
- [x] Manejo de errores
- [x] Notificaciones de estado

### 🚧 En Desarrollo Futuro
- [ ] Autenticación de usuarios
- [ ] Procesamiento real de pagos
- [ ] Historial de pedidos
- [ ] Reviews y comentarios
- [ ] Comparador de productos

---

**¿Necesitas ayuda?** Revisa el README.md completo para documentación técnica detallada.