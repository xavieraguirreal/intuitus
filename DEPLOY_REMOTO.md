# Instrucciones de Deploy Remoto - Intuitus

## 🎯 Objetivo

Desplegar Intuitus en un servidor remoto (VPS) para desarrollo/staging antes del deploy final en Vercel.

---

## 📋 Requisitos Previos

### En el Servidor Remoto:
- Node.js 18+ instalado
- npm 9+ instalado
- PM2 para gestión de procesos (recomendado)
- Puerto disponible (ej: 3001)

### Verificar versiones SSH:
```bash
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 9.0.0
```

---

## 🚀 Opción 1: Deploy Manual vía FileZilla + SSH

### Paso 1: Subir archivos con FileZilla

**Archivos/Carpetas a subir:**
```
E:\appIntuitus\  →  /home/verumax/intuitus/

Incluir:
✓ app/
✓ components/
✓ lib/
✓ hooks/
✓ types/
✓ public/
✓ package.json
✓ package-lock.json
✓ next.config.js
✓ tailwind.config.js
✓ tsconfig.json
✓ postcss.config.js
✓ .eslintrc.json

NO subir:
✗ node_modules/ (se instala en el servidor)
✗ .next/ (se genera con build)
✗ .env.local (crear en servidor)
✗ .git/ (opcional, mejor usar git clone)
```

**Configuración FileZilla:**
```
Host: vps-5361869-x.ferozo.com (o la IP del VPS)
Protocol: SFTP
Port: 22
User: verumax
Password: [tu password]
```

### Paso 2: Conectar vía SSH e instalar

```bash
# Conectar al servidor
ssh verumax@vps-5361869-x.ferozo.com

# Ir al directorio
cd /home/verumax/intuitus

# Crear archivo .env.local
nano .env.local
```

**Contenido del .env.local (en servidor):**
```bash
NEXT_PUBLIC_APP_NAME=Intuitus
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://intuitus.verumax.com

NEXT_PUBLIC_MAX_PROJECTS=5
NEXT_PUBLIC_MAX_VIDEO_DURATION=1800
NEXT_PUBLIC_MAX_VIDEO_SIZE_MB=500

NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_FLUXUM_INTEGRATION=false
```

**Instalar dependencias:**
```bash
npm install --production
```

**Build del proyecto:**
```bash
npm run build
```

### Paso 3: Configurar PM2 (recomendado)

```bash
# Instalar PM2 globalmente (si no está)
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "intuitus" -- start

# Verificar estado
pm2 status

# Ver logs
pm2 logs intuitus

# Configurar para que arranque al reiniciar servidor
pm2 startup
pm2 save
```

**Comandos útiles PM2:**
```bash
pm2 restart intuitus    # Reiniciar
pm2 stop intuitus       # Detener
pm2 delete intuitus     # Eliminar proceso
pm2 monit              # Monitor en tiempo real
```

---

## 🔄 Opción 2: Deploy con Git (Recomendado)

### Paso 1: Crear repositorio remoto

**Opción A: GitHub**
```bash
# En tu máquina local
cd E:\appIntuitus

# Crear repo en GitHub: https://github.com/nuevo-repo
git remote add origin https://github.com/tu-usuario/intuitus.git
git push -u origin master
```

**Opción B: Git Bare en el mismo VPS**
```bash
# En el servidor (SSH)
mkdir -p /home/verumax/git/intuitus.git
cd /home/verumax/git/intuitus.git
git init --bare

# En tu máquina local
cd E:\appIntuitus
git remote add production verumax@vps-5361869-x:/home/verumax/git/intuitus.git
git push production master
```

### Paso 2: Clonar en el servidor

```bash
# SSH en el servidor
ssh verumax@vps-5361869-x.ferozo.com

# Clonar desde GitHub
cd /home/verumax
git clone https://github.com/tu-usuario/intuitus.git

# O desde el bare repo local
git clone /home/verumax/git/intuitus.git

# Entrar al directorio
cd intuitus

# Crear .env.local (como se indicó arriba)
nano .env.local

# Instalar y build
npm install
npm run build

# Iniciar con PM2
pm2 start npm --name "intuitus" -- start
```

### Paso 3: Script de actualización automática

```bash
# Crear script de deploy
nano /home/verumax/intuitus/deploy.sh
```

**Contenido de deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Iniciando deploy de Intuitus..."

# Ir al directorio
cd /home/verumax/intuitus

# Pull de cambios
echo "📥 Descargando cambios..."
git pull origin master

# Instalar dependencias si hay cambios
echo "📦 Instalando dependencias..."
npm install

# Build
echo "🔨 Compilando..."
npm run build

# Reiniciar PM2
echo "♻️  Reiniciando aplicación..."
pm2 restart intuitus

echo "✅ Deploy completado!"
pm2 status
```

**Hacer el script ejecutable:**
```bash
chmod +x /home/verumax/intuitus/deploy.sh

# Ejecutar deploy
./deploy.sh
```

---

## 🌐 Opción 3: Nginx como Proxy Reverso

Si quieres que Intuitus corra en un dominio/subdominio (ej: `intuitus.verumax.com`):

### Configurar Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/intuitus
```

**Contenido:**
```nginx
server {
    listen 80;
    server_name intuitus.verumax.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # IMPORTANTE: Headers para FFmpeg.wasm
        add_header Cross-Origin-Opener-Policy same-origin;
        add_header Cross-Origin-Embedder-Policy require-corp;
    }
}
```

**Activar sitio:**
```bash
sudo ln -s /etc/nginx/sites-available/intuitus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL con Let's Encrypt (Opcional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d intuitus.verumax.com
```

---

## 🔧 Troubleshooting

### Problema: Puerto 3000 ocupado
```bash
# Cambiar puerto en package.json
"scripts": {
  "start": "next start -p 3001"
}

# O variable de entorno
PORT=3001 npm start
```

### Problema: Memoria insuficiente al build
```bash
# Aumentar memoria de Node.js
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Problema: Permisos
```bash
# Dar permisos correctos
sudo chown -R verumax:verumax /home/verumax/intuitus
chmod -R 755 /home/verumax/intuitus
```

---

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
pm2 logs intuitus --lines 100
```

### Métricas de rendimiento
```bash
pm2 monit
```

### Reiniciar si se crashea
```bash
# PM2 hace esto automáticamente, pero puedes configurar:
pm2 start npm --name "intuitus" -- start --max-restarts 10
```

---

## 🎯 Resumen de Comandos Rápidos

### Deploy inicial:
```bash
ssh verumax@vps-5361869-x.ferozo.com
cd /home/verumax/intuitus
npm install
npm run build
pm2 start npm --name "intuitus" -- start
pm2 save
```

### Actualización:
```bash
ssh verumax@vps-5361869-x.ferozo.com
cd /home/verumax/intuitus
git pull
npm install
npm run build
pm2 restart intuitus
```

### Ver estado:
```bash
ssh verumax@vps-5361869-x.ferozo.com
pm2 status
pm2 logs intuitus
```

---

## ⚠️ Notas Importantes

1. **Intuitus NO necesita PHP:** Es una app Node.js pura
2. **No usar Apache:** Next.js tiene su propio servidor
3. **Puerto default:** 3000 (cambiar si está ocupado)
4. **Memoria:** Mínimo 1GB RAM libre para build
5. **Node.js CLI:** Usar `/opt/node-18/bin/node` si existe versión custom en Ferozo

---

## 📞 Soporte

Si algo falla, verificar:
1. `pm2 logs intuitus` para ver errores
2. `netstat -tlnp | grep 3000` para ver si el puerto está libre
3. `df -h` para verificar espacio en disco
4. `free -m` para verificar RAM disponible

---

**Última actualización:** 2026-02-10
