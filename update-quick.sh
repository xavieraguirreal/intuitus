#!/bin/bash

# Script de actualización rápida para Intuitus
# Usa este cuando NO haya cambios en package.json
# Ejecutar: bash update-quick.sh

echo "⚡ Iniciando actualización rápida de Intuitus..."
echo ""

# 1. Pull de cambios
echo "📥 1/4 - Descargando cambios de Git..."
git pull origin main
echo "✓ Cambios descargados"
echo ""

# 2. Arreglar permisos
echo "🔐 2/4 - Arreglando permisos..."
chown -R verumax:verumax /home/verumax/public_html/intuitus
chmod -R +x /home/verumax/public_html/intuitus/node_modules/.bin
echo "✓ Permisos corregidos"
echo ""

# 3. Build del proyecto
echo "🏗️  3/4 - Compilando proyecto..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Build exitoso"
else
    echo "❌ Error en el build - Ejecuta update-server.sh en su lugar"
    exit 1
fi
echo ""

# 4. Reiniciar PM2
echo "🔄 4/4 - Reiniciando aplicación..."
pm2 restart intuitus
echo "✓ Aplicación reiniciada"
echo ""

echo "✅ ¡Actualización rápida completada!"
echo "🌐 https://intuitus.verumax.com"
echo ""
echo "💡 Si tuviste problemas, ejecuta: bash update-server.sh"
