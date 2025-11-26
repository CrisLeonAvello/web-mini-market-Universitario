# 🧪 Guía de Pruebas - SellScreen

## 📱 Estado del Sistema

### ✅ Backend
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:8000
- **Container**: minimarket_backend
- **Base de datos**: minimarket_db (corriendo)

### ✅ Expo Dev Server
- **Estado**: ✅ Listo
- **Metro Bundler**: http://localhost:8081
- **LAN**: exp://10.168.118.127:8081
- **QR Code**: Disponible en terminal

---

## 📋 Checklist de Pruebas

### 1. Abrir la App 📱

#### Opción A: Dispositivo Físico (Recomendado)
1. Instala **Expo Go** desde:
   - 🍎 **iOS**: App Store
   - 🤖 **Android**: Google Play Store

2. Abre Expo Go y escanea el QR code del terminal

3. La app debería cargar automáticamente

#### Opción B: Emulador Android
```powershell
# Presiona 'a' en el terminal de Expo
# O ejecuta:
npx expo start --android
```

#### Opción C: Web (limitado, sin cámara)
```powershell
# Presiona 'w' en el terminal de Expo
# O ejecuta:
npx expo start --web
```

---

### 2. Navegar a SellScreen 🧭

1. **Iniciar sesión** (si no lo has hecho):
   - Usuario: `test@test.com`
   - Contraseña: `123456`

2. **Ir a la pantalla de vender**:
   - Opción A: Toca el tab "Vender" en la barra inferior
   - Opción B: Desde Perfil → Mis Ventas → Botón "+" (arriba derecha)

---

### 3. Probar Upload de Imagen 📷

#### Test 1: Desde Galería
```
1. Toca el área de imagen (placeholder grande)
2. Selecciona "Galería" en el Alert
3. Elige una imagen de tu dispositivo
4. Verifica:
   ✓ Preview se muestra correctamente
   ✓ Loading spinner aparece brevemente
   ✓ No hay errores en consola
   ✓ Botón "Cambiar imagen" aparece
```

#### Test 2: Desde Cámara (solo dispositivo físico)
```
1. Toca "Cambiar imagen" (si ya hay una)
2. Selecciona "Cámara" en el Alert
3. Autoriza permisos (primera vez)
4. Toma una foto
5. Verifica:
   ✓ Preview se muestra correctamente
   ✓ Compresión funciona (sin lag)
   ✓ Calidad aceptable
```

#### Test 3: Validación de Permisos
```
Si niegas permisos:
✓ Alert de "Permiso denegado" aparece
✓ App no crashea
✓ Puedes intentar de nuevo
```

---

### 4. Completar Formulario ✍️

#### Test 4: Campos Obligatorios
```
1. Deja título vacío
2. Toca "Publicar"
3. Verifica:
   ✓ Banner rojo de error aparece
   ✓ Mensaje: "El título es obligatorio"
```

```
4. Llena título: "Laptop Test"
5. Precio: 0 o vacío
6. Toca "Publicar"
7. Verifica:
   ✓ Error: "El precio debe ser mayor a 0"
```

```
8. Llena precio: 500000
9. Stock: -1
10. Toca "Publicar"
11. Verifica:
    ✓ Error: "El stock no puede ser negativo"
```

#### Test 5: Categorías
```
1. Scroll horizontal de categorías
2. Selecciona: "Electrónicos"
3. Verifica:
   ✓ Chip se pone morado
   ✓ Texto se pone blanco
   ✓ Solo una activa a la vez
```

```
4. Prueba todas las categorías:
   - Electrónicos
   - Librería
   - Alimentos
   - Ropa
   - Hogar
   - Deportes
   - Juguetes
   - Otros
```

#### Test 6: Condición
```
1. Toca cada botón de condición:
   - Nuevo
   - Usado
   - Reacondicionado
2. Verifica:
   ✓ Botón activo se pone morado
   ✓ Solo uno activo a la vez
```

#### Test 7: Textarea Descripción
```
1. Escribe descripción larga (200+ caracteres)
2. Verifica:
   ✓ Scroll funciona
   ✓ TextAlignVertical: top (texto empieza arriba)
   ✓ Keyboard no tapa el campo
```

---

### 5. Publicar Producto 🚀

#### Test 8: Publicación Exitosa
```
Formulario completo:
- Título: "Laptop Dell XPS 15"
- Descripción: "Laptop en excelente estado, 16GB RAM, 512GB SSD"
- Precio: 850000
- Stock: 1
- Categoría: Electrónicos
- Condición: Usado
- Imagen: (seleccionada)

1. Toca "Publicar"
2. Verifica:
   ✓ Loading spinner en botón
   ✓ Botón disabled durante carga
   ✓ Alert de éxito aparece
   ✓ Opciones: "Ver mis productos" / "Publicar otro"
```

#### Test 9: Navegación Post-Publicación
```
Después del Alert de éxito:

Opción A: "Ver mis productos"
✓ Navega a MySalesScreen
✓ Producto aparece en la lista
✓ Imagen se muestra

Opción B: "Publicar otro"
✓ Formulario se limpia
✓ Campos vacíos
✓ Imagen preview desaparece
✓ Listo para nuevo producto
```

#### Test 10: Botón Limpiar
```
1. Llena formulario parcialmente
2. Toca "Limpiar"
3. Verifica:
   ✓ Todos los campos se vacían
   ✓ Imagen se borra
   ✓ Categoría vuelve a "Electrónicos"
   ✓ Condición vuelve a "Nuevo"
```

---

### 6. Verificar Backend 🔍

#### Test 11: Endpoint POST /productos/
```powershell
# Verificar en logs del backend:
docker logs minimarket_backend --tail 20

# Buscar línea similar a:
INFO:     POST /productos/ 200 OK
```

#### Test 12: Base de Datos
```powershell
# Conectar a MySQL:
docker exec -it minimarket_db mysql -u root -p1234 -D minimarket

# Verificar producto:
mysql> SELECT id, titulo, precio, stock, categoria, condicion FROM productos ORDER BY id DESC LIMIT 1;
```

Deberías ver:
```
+----+-------------------+--------+-------+--------------+-----------+
| id | titulo            | precio | stock | categoria    | condicion |
+----+-------------------+--------+-------+--------------+-----------+
| XX | Laptop Dell XPS15 | 850000 | 1     | Electrónicos | usado     |
+----+-------------------+--------+-------+--------------+-----------+
```

#### Test 13: Imagen en Base64
```mysql
# Verificar que imagen se guardó:
mysql> SELECT LENGTH(imagen) as img_size FROM productos WHERE titulo LIKE '%Laptop%' ORDER BY id DESC LIMIT 1;

# Debería devolver tamaño en bytes (ej: 45000 para ~45KB)
# Si es NULL o 0, la imagen no se guardó
```

---

### 7. Pruebas de UX/UI 🎨

#### Test 14: KeyboardAvoidingView (iOS)
```
1. Dispositivo iOS
2. Toca campo "Descripción"
3. Verifica:
   ✓ Teclado aparece
   ✓ Campo no queda tapado
   ✓ ScrollView ajusta automáticamente
```

#### Test 15: ScrollView
```
1. Scroll hacia abajo
2. Verifica:
   ✓ Header con gradiente se queda arriba (fixed)
   ✓ Formulario scrollea suavemente
   ✓ Todos los elementos accesibles
```

#### Test 16: Loading States
```
Durante publicación:
✓ Botón "Publicar" muestra spinner
✓ Color no cambia (sigue morado)
✓ Texto desaparece, solo spinner
✓ Botón disabled (no se puede tocar)
```

#### Test 17: Mensajes de Error
```
1. Error de validación
2. Verifica:
   ✓ Banner rojo aparece arriba
   ✓ Icono de warning (⚠️)
   ✓ Mensaje claro y específico
   ✓ No desaparece automáticamente
```

---

## 🐛 Errores Comunes y Soluciones

### Error 1: "Cannot read property 'createProduct'"
**Causa**: productService no está exportado correctamente
**Solución**: Ya corregido en `productService.ts`

### Error 2: "Network request failed"
**Causa**: Backend no está corriendo o IP incorrecta
**Solución**:
```powershell
# Verificar backend:
docker ps | Select-String "backend"

# Ver logs:
docker logs minimarket_backend
```

### Error 3: "Imagen muy grande"
**Causa**: Compresión no funcionó
**Solución**: Ya implementada con resize a 1200px + compress 0.7

### Error 4: "Expo Go crashes al tomar foto"
**Causa**: Permisos no configurados
**Solución**: Ya agregados en `app.json`

### Error 5: "Port 8081 already in use"
**Solución**:
```powershell
# Matar proceso:
$processId = (Get-NetTCPConnection -LocalPort 8081).OwningProcess
Stop-Process -Id $processId -Force

# Reiniciar Expo:
npx expo start --clear
```

---

## 📊 Resultados Esperados

### ✅ Todos los tests pasan:
- [ ] Upload de imagen funciona (galería)
- [ ] Upload de imagen funciona (cámara)
- [ ] Compresión automática
- [ ] Validaciones de campos
- [ ] Categorías seleccionables
- [ ] Condiciones seleccionables
- [ ] Publicación exitosa
- [ ] Navegación post-publicación
- [ ] Botón limpiar funciona
- [ ] Backend recibe datos
- [ ] Base de datos guarda producto
- [ ] Imagen en Base64 guardada
- [ ] KeyboardAvoidingView funciona
- [ ] ScrollView suave
- [ ] Loading states correctos
- [ ] Mensajes de error claros

### 📸 Screenshots Recomendados:
1. SellScreen vacío (inicial)
2. Selector de imagen (Alert)
3. Preview de imagen
4. Formulario completo
5. Validación de error
6. Loading spinner
7. Alert de éxito
8. MySalesScreen con producto nuevo

---

## 🎯 Siguiente Paso

Una vez confirmado que todo funciona:
1. Tomar screenshots
2. Documentar bugs encontrados
3. Continuar con **ProductDetailScreen** o **UserProfile completo**

---

**Fecha de pruebas**: 26 de noviembre de 2025
**Versión**: 1.0.0
**Expo SDK**: 54
**Backend**: FastAPI + MySQL
