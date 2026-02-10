# Intuitus - Grabador Tutorial Profesional

Aplicación web para crear videos educativos con teleprompter inteligente y edición simple.

## 🎯 Características del MVP

- **Teleprompter Inteligente:** Scroll suave, ajustable, diseñado para mirada natural
- **Grabación Profesional:** Webcam + logo overlay, calidad HD
- **Edición Simple:** Cortar inicio/fin, remover segmentos
- **Exportación MP4:** Video listo para publicar
- **100% Privado:** Todo el procesamiento es local, nada se sube a servidores

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router)
- **UI:** Tailwind CSS
- **Estado:** Zustand
- **Grabación:** MediaRecorder API
- **Edición:** FFmpeg.wasm
- **Storage:** IndexedDB (Dexie.js)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start
```

## 🌐 Deploy

Este proyecto está optimizado para deploy en **Vercel**:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📁 Estructura del Proyecto

```
E:\appIntuitus\
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── setup/             # Vista de configuración
│   ├── record/            # Vista de grabación
│   └── editor/            # Vista de edición
├── components/            # Componentes React
│   ├── home/             # Componentes del home
│   ├── setup/            # Componentes de setup
│   ├── teleprompter/     # Teleprompter
│   ├── record/           # Componentes de grabación
│   ├── editor/           # Componentes del editor
│   └── shared/           # Componentes compartidos
├── lib/                   # Librerías y utilidades
│   ├── store.ts          # Zustand store
│   ├── videoComposer.ts  # Compositor de video
│   ├── ffmpeg.ts         # Wrapper de FFmpeg
│   └── storage.ts        # IndexedDB wrapper
├── hooks/                 # Custom hooks
├── types/                 # Tipos TypeScript
├── public/               # Assets estáticos
└── docs/                 # Documentación

```

## 🛠️ Requisitos del Sistema

- Node.js 18+
- Navegador moderno (Chrome 94+, Edge 94+, Firefox 105+)
- Cámara web y micrófono
- 2GB RAM mínimo (4GB recomendado)

## 📝 Variables de Entorno

Ver `.env.local` para configuración local.

## 🤝 Contribuciones

Este proyecto es parte del ecosistema **Verumax**.

## 📄 Licencia

Propietario - Verumax © 2026

## 🔗 Links

- **Verumax:** https://verumax.com
- **Fluxum:** (plataforma de videos - integración futura)
- **Academicus:** (LMS - integración futura)

---

**Estado:** 🚧 MVP en desarrollo

**Próximas fases:**
- Fase 2: Integración con Fluxum
- Fase 3: Subtítulos automáticos
- Fase 4: Eye tracking inteligente
