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

### 3. Probar Integración Teleprompter + Grabador (Tarea #7 - NUEVO)

**Con los permisos concedidos:**

1. Verificar que aparecen **DOS botones** de inicio:
   - ✅ "Grabar con Teleprompter" (rojo, recomendado)
   - ✅ "Grabar sin Teleprompter" (gris)
2. Clic en **"Grabar con Teleprompter"**:
   - ✅ Inicia grabación (timer empieza a contar)
   - ✅ El teleprompter se abre automáticamente después de 0.5 segundos
   - ✅ En el teleprompter se ve: timer de grabación arriba al centro
3. **Durante la grabación con teleprompter abierto:**
   - ✅ Presionar `Espacio` para pausar/reanudar el scroll del teleprompter
   - ✅ Usar `↑/↓` para ajustar velocidad
   - ✅ Debe verse un mensaje abajo: "Usa el botón 'Ocultar Teleprompter' abajo para cerrar"
4. **Cerrar el overlay** (sin detener grabación):
   - ✅ Scroll hacia abajo hasta ver los controles
   - ✅ Clic en "Ocultar Teleprompter" (botón amarillo)
   - ✅ La grabación sigue (timer continúa)
5. **Re-abrir teleprompter durante grabación:**
   - ✅ Clic en "Mostrar Teleprompter"
   - ✅ El teleprompter se abre de nuevo
6. **Al terminar de leer:**
   - ✅ El scroll del teleprompter llega al final automáticamente
   - ✅ La grabación se detiene automáticamente
   - ✅ Mensaje: "✓ Grabación completada (X:XX)"

### 4. Probar el Grabador de Video (Tarea #6)

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

### 5. Probar Biblioteca de Guiones (Tarea #18 - NUEVO)

1. Ve a `/setup` (Configurar)
2. Verificar que aparecen **DOS botones nuevos** arriba del editor:
   - ✅ "Cargar Guion Guardado" (azul)
   - ✅ "Guardar Guion" (verde, deshabilitado si no hay texto)

**Prueba: Guardar un guion**
1. Escribe un guion de prueba:
   ```
   Hola, este es mi primer guion guardado.
   Voy a probarlo en el teleprompter.
   ```
2. Clic en **"Guardar Guion"**
3. Se abre un prompt pidiendo nombre
4. Escribe: "Mi primer guion"
5. Verificar que:
   - ✅ Aparece mensaje verde: "✓ Guion guardado correctamente"
   - ✅ Debajo aparece: "Guion actual: Mi primer guion"

**Prueba: Cargar biblioteca**
1. Clic en **"Cargar Guion Guardado"**
2. Se abre modal "Mis Guiones"
3. Verificar que aparece el guion guardado con:
   - ✅ Nombre: "Mi primer guion"
   - ✅ Metadata: "X palabras · ~X:XX min"
   - ✅ Fecha: "Hoy"
   - ✅ Preview del contenido
   - ✅ Botones: "Usar", "Duplicar", "Eliminar"

**Prueba: Duplicar guion**
1. Clic en **"Duplicar"**
2. Se crea una copia con nombre "(copia)"
3. Verificar que aparecen **DOS guiones** en la lista

**Prueba: Cargar guion**
1. Borra el contenido del editor
2. Clic en **"Usar"** en uno de los guiones
3. Verificar que:
   - ✅ Se cierra el modal
   - ✅ El editor se llena con el contenido del guion
   - ✅ Aparece "Guion actual: [nombre]"

**Prueba: Eliminar guion**
1. Clic en **"Eliminar"** en una de las copias
2. Aparece confirmación: "¿Seguro que deseas eliminar...?"
3. Confirmar
4. Verificar que:
   - ✅ El guion desaparece de la lista
   - ✅ No afecta el editor si ese guion estaba cargado

**Prueba: IndexedDB persistencia**
1. Guarda 2-3 guiones
2. **Recarga la página** (F5)
3. Abre "Cargar Guion Guardado"
4. Verificar que:
   - ✅ Los guiones siguen ahí (datos persistentes)
   - ✅ Ordenados por fecha de modificación

**Prueba: Estado vacío**
1. Elimina todos los guiones
2. Abre "Cargar Guion Guardado"
3. Verificar que aparece:
   - ✅ Icono de documento vacío
   - ✅ "No tienes guiones guardados"
   - ✅ Mensaje de ayuda

**Consola del navegador (F12):**
- No debería haber errores de IndexedDB
- Opcional: Ver en Application → IndexedDB → IntuitusBD → guiones

### 6. Probar Importación de Archivos Word/TXT (Tarea #19 - NUEVO)

**Preparación:** Crea estos archivos de prueba en tu computadora:

**archivo_prueba.txt** (en Bloc de notas):
```
Este es un guion de prueba importado desde archivo de texto.
Tiene varias líneas.
Y funciona perfectamente.
```

**guion_word.docx** (en Microsoft Word):
```
Hola, este es un guion importado desde Word.

Puedo tener:
- Múltiples párrafos
- Texto con formato (que se convertirá a texto plano)
- Y será fácil de editar
```

**Prueba 1: Importar archivo .txt**
1. Ve a `/setup` (Configurar)
2. Verificar que aparece botón **"Importar Word/TXT"** (azul, arriba a la derecha)
3. Clic en **"Importar Word/TXT"**
4. Selecciona `archivo_prueba.txt`
5. Verificar que:
   - ✅ El contenido se carga instantáneamente en el textarea
   - ✅ El contador de palabras/tiempo se actualiza
   - ✅ Puedes editar el texto normalmente

**Prueba 2: Importar archivo .docx (Word)**
1. Borra el contenido del editor
2. Clic en **"Importar Word/TXT"**
3. Selecciona `guion_word.docx`
4. Verificar que:
   - ✅ Aparece "Importando..." brevemente
   - ✅ El texto se extrae como texto plano (sin formato)
   - ✅ Los saltos de línea se respetan
   - ✅ No hay caracteres raros o códigos de formato

**Prueba 3: Archivo no soportado**
1. Intenta importar un archivo .pdf o .jpg
2. Verificar que:
   - ✅ Aparece mensaje de error rojo
   - ✅ Dice: "Formato no soportado. Usa archivos .docx o .txt"
   - ✅ El editor no se modifica

**Prueba 4: Importar + Guardar**
1. Importa un archivo Word
2. Edita el texto si quieres
3. Clic en **"Guardar Guion"**
4. Dale un nombre: "Guion importado desde Word"
5. Verificar que:
   - ✅ Se guarda correctamente en la biblioteca
   - ✅ Puedes cargarlo de nuevo más tarde

**Prueba 5: Re-importar**
1. Importa un archivo .txt
2. Sin guardarlo, importa otro archivo diferente
3. Verificar que:
   - ✅ El segundo archivo reemplaza el primero
   - ✅ No hay confirmación (se reemplaza directamente)

**Consola del navegador (F12):**
- No debería haber errores de mammoth
- Si hay error, verificar que el archivo Word no esté corrupto

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
