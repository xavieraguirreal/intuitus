'use client';

import { useState } from 'react';
import { useScriptLibrary } from '@/hooks/useScriptLibrary';
import { SavedScript } from '@/lib/db';

interface ScriptLibraryProps {
  onLoadScript: (contenido: string, nombre: string) => void;
  onClose: () => void;
}

export default function ScriptLibrary({ onLoadScript, onClose }: ScriptLibraryProps) {
  const { scripts, loading, error, remove, duplicate } = useScriptLibrary();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLoad = (script: SavedScript) => {
    onLoadScript(script.contenido, script.nombre);
    onClose();
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Seguro que deseas eliminar "${nombre}"?`)) {
      setDeletingId(id);
      try {
        await remove(id);
      } catch (err) {
        console.error('Error deleting script:', err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicate(id);
    } catch (err) {
      console.error('Error duplicating script:', err);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Mis Guiones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="text-gray-400 mt-4">Cargando guiones...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!loading && scripts.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-24 w-24 text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-lg">No tienes guiones guardados</p>
              <p className="text-gray-500 text-sm mt-2">Crea un proyecto y guarda tu guion para verlo aquí</p>
            </div>
          )}

          {!loading && scripts.length > 0 && (
            <div className="space-y-3">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{script.nombre}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>{script.palabras} palabras</span>
                        <span>~{formatDuration(script.duracionEstimada)} min</span>
                        <span>Editado: {formatDate(script.fechaModificacion)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview del contenido */}
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {script.contenido}
                  </p>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(script)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Usar
                    </button>

                    <button
                      onClick={() => handleDuplicate(script.id)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Duplicar
                    </button>

                    <button
                      onClick={() => handleDelete(script.id, script.nombre)}
                      disabled={deletingId === script.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {deletingId === script.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
