// Constantes de la aplicación

export const APP_CONFIG = {
  NAME: 'Intuitus',
  VERSION: '1.0.0',
  MAX_PROJECTS: 5,
  MAX_VIDEO_DURATION: 1800, // 30 minutos
  MAX_VIDEO_SIZE_MB: 500,
} as const;

export const TELEPROMPTER_DEFAULTS = {
  FONT_SIZE: 24, // px
  SPEED: 150, // palabras por minuto
  WIDTH: 350, // px
  MIN_FONT_SIZE: 16,
  MAX_FONT_SIZE: 32,
  MIN_SPEED: 120,
  MAX_SPEED: 200,
} as const;

export const VIDEO_CONFIG = {
  DEFAULT_WIDTH: 1920,
  DEFAULT_HEIGHT: 1080,
  FRAME_RATE: 30,
  VIDEO_BITRATE: 2_500_000, // 2.5 Mbps
  AUDIO_BITRATE: 128_000, // 128 kbps
  MIME_TYPE: 'video/webm;codecs=vp9,opus',
} as const;

export const LOGO_CONFIG = {
  MAX_SIZE_MB: 2,
  MAX_WIDTH: 300,
  MAX_HEIGHT: 300,
  POSITIONS: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const,
} as const;

export const EXPORT_PRESETS = {
  high: {
    bitrate: 2_500_000,
    resolution: '1080p',
  },
  medium: {
    bitrate: 1_500_000,
    resolution: '720p',
  },
  low: {
    bitrate: 800_000,
    resolution: '480p',
  },
} as const;

export const KEYBOARD_SHORTCUTS = {
  SPACE: 'Space',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  PLUS: '+',
  MINUS: '-',
  ESCAPE: 'Escape',
} as const;
