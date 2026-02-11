'use client';

import { useEffect } from 'react';
import { useTeleprompter } from '@/hooks/useTeleprompter';

interface TeleprompterProps {
  script: string;
  isVisible?: boolean;
  onComplete?: () => void;
  onClose?: () => void;
}

export default function Teleprompter({
  script,
  isVisible = true,
  onComplete,
  onClose,
}: TeleprompterProps) {
  const {
    isPlaying,
    speed,
    fontSize,
    containerRef,
    togglePlay,
    increaseSpeed,
    decreaseSpeed,
    increaseFontSize,
    decreaseFontSize,
    reset,
  } = useTeleprompter({ script, onComplete });

  // Cerrar con tecla ESC
  useEffect(() => {
    if (!onClose || !isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="teleprompter-wrapper fixed top-0 left-0 w-full h-full bg-black/90 z-50 flex flex-col">
      {/* Botón de cerrar */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-[60] w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-2xl border-2 border-white/20"
          title="Cerrar Teleprompter (ESC)"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Indicador de lectura central */}
      <div className="reading-line absolute top-1/3 left-0 right-0 h-0.5 bg-yellow-400/40 pointer-events-none z-10" />

      {/* Contenedor de scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Padding superior para centrar texto inicial */}
        <div style={{ height: 'calc(33.33vh - 50px)' }} />

        {/* Contenido del script */}
        <div className="teleprompter-content mx-auto px-6" style={{ maxWidth: '350px' }}>
          <p
            className="text-yellow-300 leading-relaxed whitespace-pre-wrap"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.5',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {script}
          </p>
        </div>

        {/* Padding inferior para poder scrollear hasta el final */}
        <div style={{ height: 'calc(66.67vh - 50px)' }} />
      </div>

      {/* Controles flotantes */}
      <div className="controls-panel absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/95 rounded-lg shadow-2xl p-4 flex items-center gap-6 border border-gray-700">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="play-pause-btn w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all shadow-lg"
          title="Espacio"
        >
          {isPlaying ? (
            <svg className="w-7 h-7 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Velocidad */}
        <div className="speed-controls flex flex-col items-center gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Velocidad</label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseSpeed}
              className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-yellow-400"
              title="Flecha abajo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="text-yellow-300 font-mono text-lg min-w-[70px] text-center">
              {speed} WPM
            </span>
            <button
              onClick={increaseSpeed}
              className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-yellow-400"
              title="Flecha arriba"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tamaño de fuente */}
        <div className="font-controls flex flex-col items-center gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Tamaño</label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseFontSize}
              className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-yellow-400"
              title="Tecla -"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-yellow-300 font-mono text-lg min-w-[50px] text-center">
              {fontSize}
            </span>
            <button
              onClick={increaseFontSize}
              className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-yellow-400"
              title="Tecla +"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          title="Ctrl+R / Cmd+R"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Atajos de teclado (ayuda) */}
      <div className="keyboard-hints absolute top-4 right-4 bg-gray-900/80 rounded-lg p-3 text-xs text-gray-400 space-y-1">
        <p>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-yellow-300">Espacio</kbd> Play/Pausa
        </p>
        <p>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-yellow-300">↑ ↓</kbd> Velocidad
        </p>
        <p>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-yellow-300">+ −</kbd> Tamaño
        </p>
        <p>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-yellow-300">Ctrl+R</kbd> Reiniciar
        </p>
        {onClose && (
          <p>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-yellow-300">ESC</kbd> Cerrar
          </p>
        )}
      </div>
    </div>
  );
}
