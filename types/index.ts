// Tipos centrales de Intuitus

export interface Project {
  id: string;
  name: string;
  script: string;
  logo?: string; // base64
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  videoBlob?: Blob;
  thumbnail?: string; // base64
  cuts: Cut[];
  duration: number; // segundos
  createdAt: Date;
  updatedAt: Date;
}

export interface Cut {
  id: string;
  startTime: number; // segundos
  endTime: number; // segundos
  type: 'trim' | 'split';
}

export interface TeleprompterSettings {
  fontSize: number; // 16-32px
  speed: number; // palabras por minuto (120-200)
  isPlaying: boolean;
}

export interface MediaDevices {
  videoInputs: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
  selectedVideoId?: string;
  selectedAudioId?: string;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  chunks: Blob[];
}

export interface ExportOptions {
  format: 'mp4' | 'webm';
  quality: 'high' | 'medium' | 'low';
  resolution: '1080p' | '720p' | '480p';
  filename: string;
}

export type AppView = 'home' | 'setup' | 'record' | 'editor';

export interface AppState {
  currentView: AppView;
  currentProject: Project | null;
  projects: Project[];
}
