'use client';

import { useState, useEffect } from 'react';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ScriptEditor({ value, onChange }: ScriptEditorProps) {
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    estimatedTime: 0, // en segundos
  });

  useEffect(() => {
    // Calcular estadísticas del guion
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    const characters = value.length;

    // Estimación: 150 palabras por minuto (velocidad promedio de lectura)
    const estimatedTime = words > 0 ? Math.ceil((words / 150) * 60) : 0;

    setStats({ words, characters, estimatedTime });
  }, [value]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Guion del Video
        </label>
        <p className="text-sm text-gray-500">
          Escribe o pega el texto que leerás en el teleprompter
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe aquí tu guion...

Ejemplo:
Hola, bienvenidos a este tutorial sobre...
En este video aprenderemos a..."
        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-sans text-base leading-relaxed"
        spellCheck
      />

      {/* Estadísticas */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-6 w-full">
          {/* Palabras */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.words}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Palabras
            </div>
          </div>

          {/* Caracteres */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.characters}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Caracteres
            </div>
          </div>

          {/* Tiempo estimado */}
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-500">
              {formatTime(stats.estimatedTime)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Tiempo estimado
            </div>
          </div>
        </div>
      </div>

      {/* Ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              💡 Consejos para tu guion:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Escribe con naturalidad, como si hablaras con alguien</li>
              <li>• Usa párrafos cortos para facilitar la lectura</li>
              <li>• Marca pausas importantes con saltos de línea</li>
              <li>• Velocidad recomendada: 120-150 palabras por minuto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
