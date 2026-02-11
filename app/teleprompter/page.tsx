'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useScriptLibrary } from '@/hooks/useScriptLibrary';
import Teleprompter from '@/components/teleprompter/Teleprompter';
import ScriptLibrary from '@/components/scripts/ScriptLibrary';
import MarkersHelp from '@/components/setup/MarkersHelp';
import mammoth from 'mammoth';

export default function TeleprompterStandalonePage() {
  const router = useRouter();
  const { save: saveScript } = useScriptLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [script, setScript] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Estadísticas del guion
  const [stats, setStats] = useState({
    words: 0,
    estimatedTime: 0,
  });

  useEffect(() => {
    const words = script.trim().split(/\s+/).filter(Boolean).length;
    const estimatedTime = words > 0 ? Math.ceil((words / 150) * 60) : 0;
    setStats({ words, estimatedTime });
  }, [script]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Guardar guion
  const handleSaveScript = async () => {
    if (!script.trim()) {
      alert('Escribe un guion antes de guardar');
      return;
    }

    const nombre = prompt('Nombre del guion:', scriptName || `Guion ${new Date().toLocaleDateString()}`);
    if (!nombre) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await saveScript(nombre, script);
      setScriptName(nombre);
      setSaveMessage('✓ Guion guardado correctamente');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving script:', error);
      alert('Error al guardar el guion');
    } finally {
      setSaving(false);
    }
  };

  // Cargar guion desde biblioteca
  const handleLoadScript = (contenido: string, nombre: string) => {
    setScript(contenido);
    setScriptName(nombre);
  };

  // Importar archivo
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        if (result.value) {
          setScript(result.value);
        } else {
          throw new Error('No se pudo extraer texto del documento');
        }
      } else if (fileExtension === 'txt') {
        const text = await file.text();
        setScript(text);
      } else {
        throw new Error('Formato no soportado. Usa archivos .docx o .txt');
      }

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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              📖 Teleprompter
            </h1>
            <p className="text-gray-400">
              Usa el teleprompter sin necesidad de grabar. Ideal para videollamadas, presentaciones en vivo, etc.
            </p>
          </div>

          {/* Contenedor principal */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
            {/* Botones superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setShowLibrary(true)}
                className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
                Cargar Guion
              </button>

              <button
                onClick={handleSaveScript}
                disabled={!script.trim() || saving}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {importing ? 'Importando...' : 'Importar'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>

            {/* Mensajes */}
            {saveMessage && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 mb-4">
                <p className="text-green-300 text-sm font-medium text-center">{saveMessage}</p>
              </div>
            )}

            {importError && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{importError}</p>
              </div>
            )}

            {scriptName && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4">
                <p className="text-blue-300 text-sm">
                  <span className="font-semibold">Guion actual:</span> {scriptName}
                </p>
              </div>
            )}

            {/* Editor de guion */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tu Guion
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Escribe o pega tu guion aquí...

Ejemplo:
Hola, bienvenidos a esta presentación.
[PAUSA 2s]
Hoy vamos a hablar sobre un tema importante.
[SONREÍR]"
                className="w-full h-64 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-sans text-base leading-relaxed"
                spellCheck
              />
            </div>

            {/* Estadísticas */}
            <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4 mb-6">
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {stats.words}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Palabras
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">
                    {formatTime(stats.estimatedTime)}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Tiempo estimado
                  </div>
                </div>
              </div>

              <MarkersHelp />
            </div>

            {/* Botón iniciar */}
            <button
              onClick={() => setShowTeleprompter(true)}
              disabled={!script.trim()}
              className="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              {script.trim() ? 'Iniciar Teleprompter' : 'Escribe un guion para comenzar'}
            </button>

            {/* Botón volver */}
            <button
              onClick={() => router.push('/')}
              className="w-full mt-4 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {/* Teleprompter overlay */}
      {showTeleprompter && (
        <Teleprompter
          script={script}
          isVisible={showTeleprompter}
          onClose={() => setShowTeleprompter(false)}
        />
      )}

      {/* Modal de biblioteca */}
      {showLibrary && (
        <ScriptLibrary
          onLoadScript={handleLoadScript}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </>
  );
}
