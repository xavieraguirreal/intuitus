# Instrucciones de Actualización del Servidor

## 🔄 Actualizar Intuitus en Producción

Ejecuta estos comandos en SSH cada vez que haya cambios:

```bash
# Conectar al servidor
ssh verumax@vps-5361869-x.ferozo.com

# Ir al directorio
cd /home/verumax/public_html/intuitus

# Pull de cambios
git pull origin master

# Instalar nuevas dependencias (si las hay)
npm install

# IMPORTANTE: Arreglar permisos inmediatamente después de npm install
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin

# Build del proyecto
npm run build

# Reiniciar PM2
pm2 restart intuitus

# Ver logs
pm2 logs intuitus --lines 20
```

## 🔧 Si hay error "Permiso denegado" en npm run build

```bash
# Solución rápida: reinstalar node_modules
rm -rf /home/verumax/public_html/intuitus/node_modules
rm -f /home/verumax/public_html/intuitus/package-lock.json

# Reinstalar y arreglar permisos
npm install
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin

# Build
npm run build

# Reiniciar PM2
pm2 restart intuitus
```

## ✅ Verificar que funciona

### 1. Página principal
Abre en el navegador:
```
http://intuitus.verumax.com
```

Deberías ver:
- ✅ Barra de navegación superior
- ✅ Breadcrumb con iconos (🏠 ⚙️ 🎬 ✂️)
- ✅ Botón "Crear Nuevo Proyecto"
- ✅ Navegación funcional entre vistas

### 2. Probar el Sistema de Permisos (Tarea #5)

1. Ve a `/setup` y crea un nuevo proyecto con un guion
2. Clic en "Continuar a Grabación"
3. En la página `/record`, deberías ver:
   - ✅ Card de "Permisos Requeridos" con icono de cámara
   - ✅ Lista de permisos: Cámara y Micrófono
   - ✅ Botón "Solicitar Permisos"
4. Clic en "Solicitar Permisos"
5. El navegador mostrará un popup pidiendo permisos
6. **Si aceptas:**
   - ✅ Verás el preview de tu cámara en tiempo real
   - ✅ La imagen debe estar "espejada" (efecto mirror)
   - ✅ Controles de grabación aparecen debajo (deshabilitados por ahora)
7. **Si rechazas:**
   - ✅ Mensaje de error claro
   - ✅ Botón "Reintentar"
   - ✅ Sección de ayuda explicando cómo habilitar permisos manualmente

### 3. Probar el Grabador de Video (Tarea #6 - NUEVO)

**Con los permisos concedidos y el preview de cámara activo:**

1. Clic en **"Iniciar Grabación"** (botón rojo)
2. Verificar que:
   - ✅ Timer comienza a contar (0:00, 0:01, 0:02...)
   - ✅ Punto rojo parpadeante junto al timer
   - ✅ Aparecen botones "Pausar" y "Detener"
3. Hablar frente a la cámara por 5-10 segundos
4. Probar **"Pausar"**:
   - ✅ Timer se detiene
   - ✅ Aparece botón "Reanudar"
5. Clic en **"Reanudar"**:
   - ✅ Timer continúa desde donde se pausó
6. Clic en **"Detener"**:
   - ✅ Mensaje "✓ Grabación completada (X:XX)"
   - ✅ Aparecen botones "Ir a Editor" y "Nueva Grabación"
7. Abrir consola del navegador (F12):
   - ✅ Debería mostrar "Recording started with mimeType: video/webm..."
   - ✅ Al detener: "Recording stopped"
   - ✅ Ver objeto Blob con el video grabado

### 4. Probar el Teleprompter (Tarea #4)

1. Ve a `/setup` (clic en ⚙️ Configurar)
2. Escribe un guion de ejemplo:
   ```
   Hola, bienvenidos a este tutorial.
   En este video aprenderemos a usar el teleprompter.
   Podemos controlar la velocidad con las flechas.
   Y el tamaño de fuente con + y -.
   ```
3. Opcional: Sube un logo
4. Clic en "Continuar a Grabación"
5. En la página `/record`, clic en "Abrir Teleprompter"
6. **Probar controles de teclado:**
   - `Espacio` - Play/Pausa (el texto debe auto-scrollear)
   - `↑` - Aumentar velocidad (WPM)
   - `↓` - Disminuir velocidad
   - `+` - Aumentar tamaño de fuente
   - `-` - Disminuir tamaño de fuente
   - `Ctrl+R` - Reiniciar desde el inicio
7. Verificar que:
   - ✅ Fondo negro con texto amarillo (alta legibilidad)
   - ✅ Columna estrecha (350px) centrada
   - ✅ Línea de lectura horizontal visible
   - ✅ Auto-scroll suave
   - ✅ Botón "Cerrar Teleprompter" en esquina superior izquierda funciona

## 🐛 Si algo falla

```bash
# Ver logs detallados
pm2 logs intuitus

# Ver logs de Apache
tail -50 /opt/apache/logs/intuitus-error.log

# Reiniciar todo
pm2 restart intuitus
systemctl reload httpd
```

## 📋 Comandos rápidos

```bash
# Ver estado
pm2 status

# Reiniciar
pm2 restart intuitus

# Ver logs en tiempo real
pm2 logs intuitus
```
