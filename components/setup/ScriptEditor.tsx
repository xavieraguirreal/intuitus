'use client';

import { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ScriptEditor({ value, onChange }: ScriptEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
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

  // Manejar importación de archivos
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'docx') {
        // Procesar archivo Word con mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        if (result.value) {
          onChange(result.value);
        } else {
          throw new Error('No se pudo extraer texto del documento');
        }
      } else if (fileExtension === 'txt') {
        // Procesar archivo de texto plano
        const text = await file.text();
        onChange(text);
      } else {
        throw new Error('Formato no soportado. Usa archivos .docx o .txt');
      }

      // Limpiar input para permitir reimportar el mismo archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing file:', error);
      setImportError(
        error instanceof Error ? error.message : 'Error al importar el archivo'
      );
    } finally {
      setImporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="flex items-start justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guion del Video
          </label>
          <p className="text-sm text-gray-500">
            Escribe o pega el texto que leerás en el teleprompter
          </p>
        </div>

        {/* Botón de importar */}
        <button
          onClick={handleImportClick}
          disabled={importing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {importing ? 'Importando...' : 'Importar Word/TXT'}
        </button>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.txt"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>

      {/* Mensaje de error de importación */}
      {importError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{importError}</p>
        </div>
      )}

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
