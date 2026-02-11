'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      setAlwaysOnTop: (flag: boolean) => Promise<void>;
      setOpacity: (opacity: number) => Promise<void>;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      onAlwaysOnTopChanged: (callback: (value: boolean) => void) => void;
      onOpacityChanged: (callback: (value: number) => void) => void;
    };
  }
}

export default function TitleBar() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Detectar si estamos en Electron
    if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
      setIsElectron(true);

      // Listeners
      window.electronAPI.onAlwaysOnTopChanged((value) => {
        setAlwaysOnTop(value);
      });

      window.electronAPI.onOpacityChanged((value) => {
        setOpacity(Math.round(value * 100));
      });
    }
  }, []);

  if (!isElectron) return null;

  const handleAlwaysOnTopToggle = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);
    await window.electronAPI?.setAlwaysOnTop(newValue);
  };

  const handleOpacityChange = async (value: number) => {
    setOpacity(value);
    await window.electronAPI?.setOpacity(value / 100);
  };

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-[100] electron-drag">
      {/* Logo y título */}
      <div className="flex items-center gap-3">
        <span className="text-lg">📖</span>
        <span className="text-white font-semibold text-sm">Intuitus Teleprompter</span>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4 electron-no-drag">
        {/* Always on top */}
        <button
          onClick={handleAlwaysOnTopToggle}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            alwaysOnTop
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Ctrl+Shift+T"
        >
          📌 {alwaysOnTop ? 'Siempre encima' : 'Normal'}
        </button>

        {/* Opacidad */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Opacidad:</span>
          <input
            type="range"
            min="40"
            max="100"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            title="Ctrl+Shift+O"
          />
          <span className="text-xs text-white w-8">{opacity}%</span>
        </div>

        {/* Botones de ventana */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
            title="Minimizar"
          >
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v2H3z" />
            </svg>
          </button>

          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded transition-colors"
            title="Cerrar (Ctrl+Shift+Q)"
          >
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
