# 🚀 Scripts de Despliegue - Intuitus

Estos scripts automatizan la actualización del servidor en producción.

## 📋 Scripts Disponibles

### 1. `update-server.sh` - Actualización Completa
**Cuándo usar:** Siempre que haya problemas de permisos o cambios en dependencias.

```bash
cd /home/verumax/public_html/intuitus
bash update-server.sh
```

**Qué hace:**
- ✅ Pull de Git
- ✅ Elimina y reinstala node_modules completo
- ✅ Arregla permisos
- ✅ Build del proyecto
- ✅ Reinicia PM2
- ✅ Muestra logs

**Tiempo:** ~3-5 minutos (por reinstalar node_modules)

---

### 2. `update-quick.sh` - Actualización Rápida
**Cuándo usar:** Para actualizaciones normales de código (sin cambios en package.json).

```bash
cd /home/verumax/public_html/intuitus
bash update-quick.sh
```

**Qué hace:**
- ✅ Pull de Git
- ✅ Arregla permisos
- ✅ Build del proyecto
- ✅ Reinicia PM2

**Tiempo:** ~30 segundos

---

## 🔄 Workflow Recomendado

### Primera vez o con errores:
```bash
bash update-server.sh
```

### Actualizaciones regulares:
```bash
bash update-quick.sh
```

Si `update-quick.sh` falla con error de permisos, ejecuta `update-server.sh`.

---

## ⚙️ Configuración Inicial

**Primera vez que uses los scripts:**

```bash
# Conectar al servidor
ssh verumax@vps-5361869-x.ferozo.com

# Ir al directorio
cd /home/verumax/public_html/intuitus

# Dar permisos de ejecución a los scripts
chmod +x update-server.sh
chmod +x update-quick.sh

# Listo, ahora podés ejecutarlos
bash update-server.sh
```

---

## 📝 Comandos Útiles Post-Deploy

```bash
# Ver logs en tiempo real
pm2 logs intuitus

# Ver estado de la app
pm2 status

# Reiniciar manualmente
pm2 restart intuitus

# Ver logs de Apache (si hay errores)
tail -50 /opt/apache/logs/intuitus-error.log
```

---

## 🐛 Solución de Problemas

### Error: "Permiso denegado" al ejecutar script
```bash
chmod +x update-server.sh
chmod +x update-quick.sh
```

### Error durante npm install
```bash
# Limpiar cache de npm
npm cache clean --force

# Intentar de nuevo
bash update-server.sh
```

### Error: "sh: next: Permiso denegado" después del script
Esto no debería pasar si usas los scripts, pero si ocurre:
```bash
# Arreglar permisos manualmente
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin
npm run build
pm2 restart intuitus
```

---

## 📊 Comparación de Scripts

| Característica | update-server.sh | update-quick.sh |
|----------------|------------------|-----------------|
| Reinstala node_modules | ✅ Sí | ❌ No |
| Tiempo de ejecución | ~3-5 min | ~30 seg |
| Arregla permisos | ✅ Sí | ✅ Sí |
| Muestra logs | ✅ Sí | ❌ No |
| Para usar cuando | Problemas/Primera vez | Actualizaciones normales |

---

## 🔐 Nota sobre Permisos

Los scripts siempre ejecutan:
```bash
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin
```

Esto es **necesario** porque npm install se ejecuta como root pero PM2 corre como usuario `verumax`.
