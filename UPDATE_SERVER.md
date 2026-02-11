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

### 2. Probar el Teleprompter (Tarea #4)

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
