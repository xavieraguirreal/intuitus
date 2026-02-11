#!/bin/bash

# Script de actualización automática para Intuitus
# Ejecutar en el servidor: bash update-server.sh

echo "🔄 Iniciando actualización de Intuitus..."
echo ""

# 1. Pull de cambios
echo "📥 1/6 - Descargando cambios de Git..."
git pull origin main
echo "✓ Cambios descargados"
echo ""

# 2. Eliminar node_modules
echo "🗑️  2/6 - Eliminando node_modules antiguos..."
rm -rf /home/verumax/public_html/intuitus/node_modules
rm -f /home/verumax/public_html/intuitus/package-lock.json
echo "✓ node_modules eliminados"
echo ""

# 3. Reinstalar dependencias
echo "📦 3/6 - Reinstalando dependencias (esto puede tardar 2-3 minutos)..."
npm install
echo "✓ Dependencias instaladas"
echo ""

# 4. Arreglar permisos
echo "🔐 4/6 - Arreglando permisos..."
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin
echo "✓ Permisos corregidos"
echo ""

# 5. Build del proyecto
echo "🏗️  5/6 - Compilando proyecto..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Build exitoso"
else
    echo "❌ Error en el build"
    exit 1
fi
echo ""

# 6. Reiniciar PM2
echo "🔄 6/6 - Reiniciando aplicación..."
pm2 restart intuitus
echo "✓ Aplicación reiniciada"
echo ""

# Mostrar logs
echo "📋 Mostrando logs recientes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 logs intuitus --lines 20 --nostream
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ ¡Actualización completada!"
echo "🌐 La aplicación está disponible en: https://intuitus.verumax.com"
echo ""
echo "Para ver logs en tiempo real: pm2 logs intuitus"
echo "Para ver estado: pm2 status"
