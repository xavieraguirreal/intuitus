# Instalación de Node.js en VPS

## 🔍 Paso 1: Identificar Sistema Operativo

Ejecuta esto en SSH para saber qué sistema operativo tienes:

```bash
cat /etc/os-release
```

---

## 📦 Opción A: Ubuntu/Debian (más común en VPS)

### Instalar Node.js 18 LTS (Recomendado)

```bash
# Actualizar repositorios
sudo apt update

# Instalar curl si no está
sudo apt install -y curl

# Descargar e instalar NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js y npm
sudo apt install -y nodejs

# Verificar instalación
node --version   # Debe mostrar v18.x.x
npm --version    # Debe mostrar v9.x.x o superior
```

### Si no tienes permisos sudo:

```bash
# Instalar Node.js usando NVM (Node Version Manager) - SIN SUDO
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar terminal
source ~/.bashrc

# Instalar Node.js 18
nvm install 18

# Usar Node.js 18
nvm use 18

# Hacer 18 la versión por defecto
nvm alias default 18

# Verificar
node --version
npm --version
```

---

## 📦 Opción B: CentOS/RHEL/AlmaLinux

```bash
# Instalar Node.js 18
sudo yum install -y curl
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar
node --version
npm --version
```

### Sin sudo (usando NVM):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

---

## 📦 Opción C: Usando Binarios Precompilados (Funciona en cualquier Linux)

Si no puedes usar ninguna de las opciones anteriores:

```bash
# Ir a tu directorio home
cd ~

# Descargar Node.js 18 (64-bit)
wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.xz

# Descomprimir
tar -xf node-v18.19.0-linux-x64.tar.xz

# Mover a una ubicación permanente
mkdir -p ~/nodejs
mv node-v18.19.0-linux-x64/* ~/nodejs/

# Agregar al PATH (editar .bashrc)
echo 'export PATH=$HOME/nodejs/bin:$PATH' >> ~/.bashrc

# Recargar configuración
source ~/.bashrc

# Verificar
node --version
npm --version
```

---

## 🎯 Opción D: Si el servidor tiene cPanel/Plesk

Algunos VPS de Ferozo tienen cPanel. Si es tu caso:

1. Entrar a cPanel
2. Buscar "Select Node.js Version" o "Node.js Selector"
3. Seleccionar Node.js 18+
4. Guardar

Luego en SSH:
```bash
source /home/verumax/nodevenv/intuitus/18/bin/activate
```

---

## ✅ Después de Instalar Node.js

```bash
# Verificar que funciona
node --version
npm --version

# Instalar PM2 globalmente
npm install -g pm2

# Si no tienes permisos para -g, usar:
npm install pm2
# Y luego usar: ./node_modules/.bin/pm2

# Continuar con deploy de Intuitus
cd /home/verumax
git clone https://github.com/TU-USUARIO/intuitus.git
cd intuitus
npm install
npm run build
pm2 start npm --name "intuitus" -- start
```

---

## ⚠️ Troubleshooting

### Error: "permission denied"
```bash
# Opción 1: Usar NVM (sin sudo)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
```

### Error: "wget: command not found"
```bash
# Usar curl en lugar de wget
curl -O https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.xz
```

### Error: "sudo: command not found"
```bash
# Usar NVM (Opción sin sudo arriba)
# O contactar a Ferozo para que instalen Node.js
```

### Node.js instalado pero comando no encontrado
```bash
# Verificar que está en el PATH
which node

# Si no aparece, agregar manualmente:
echo 'export PATH=/ruta/a/nodejs/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 🔧 Configuración Específica de Ferozo

Si Ferozo tiene Node.js instalado en ruta custom:

```bash
# Buscar Node.js
find /opt -name node 2>/dev/null
find /usr/local -name node 2>/dev/null

# Si encuentras algo como /opt/node-18/bin/node
# Crear alias
echo 'alias node="/opt/node-18/bin/node"' >> ~/.bashrc
echo 'alias npm="/opt/node-18/bin/npm"' >> ~/.bashrc
source ~/.bashrc
```

---

## 📞 Contactar a Ferozo

Si nada funciona, abre un ticket:

**Asunto:** Solicitud de instalación de Node.js 18+

**Mensaje:**
```
Hola,

Necesito Node.js versión 18 o superior instalado en mi VPS
(vps-5361869-x) para correr una aplicación Next.js.

¿Pueden instalarlo o indicarme la ruta si ya está disponible?

Usuario: verumax
VPS: vps-5361869-x

Gracias!
```

---

## 🚀 Método Recomendado: NVM (Más Simple)

**Ejecuta estos comandos en orden:**

```bash
# 1. Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Recargar terminal
source ~/.bashrc

# 3. Instalar Node.js 18
nvm install 18

# 4. Verificar
node --version
npm --version

# 5. Listo! Ahora puedes continuar con el deploy
```

---

**Última actualización:** 2026-02-10
