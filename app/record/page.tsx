'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useMediaPermissions } from '@/hooks/useMediaPermissions';
import Teleprompter from '@/components/teleprompter/Teleprompter';
import PermissionsRequest from '@/components/recording/PermissionsRequest';
import VideoPreview from '@/components/recording/VideoPreview';

export default function RecordPage() {
  const { setCurrentView, currentProject } = useAppStore();
  const router = useRouter();
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  // Hook de permisos a nivel de página (no se desmonta)
  const { permissionState, error, stream, requestPermissions, retry } = useMediaPermissions({
    video: true,
    audio: true,
  });

  useEffect(() => {
    setCurrentView('record');
  }, [setCurrentView]);

  // Redirigir si no hay proyecto activo
  useEffect(() => {
    if (!currentProject) {
      router.push('/setup');
    }
  }, [currentProject, router]);

  if (!currentProject) {
    return null; // El useEffect redirigirá
  }

  const handleStartTeleprompter = () => {
    setShowTeleprompter(true);
  };

  const handleCloseTeleprompter = () => {
    setShowTeleprompter(false);
  };

  const handleTeleprompterComplete = () => {
    console.log('Teleprompter completado');
    // Aquí se podría detener la grabación automáticamente
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header del proyecto */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentProject.name}
                </h1>
                <p className="text-gray-400 text-sm">
                  Creado el {new Date(currentProject.createdAt).toLocaleDateString()}
                </p>
              </div>

              {currentProject.logo && (
                <div className="ml-6">
                  <img
                    src={currentProject.logo}
                    alt="Logo"
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Área principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Preview de cámara */}
            <div className="lg:col-span-2">
              {permissionState !== 'granted' || !stream ? (
                /* Solicitud de permisos */
                <PermissionsRequest
                  permissionState={permissionState}
                  error={error}
                  onRequestPermissions={requestPermissions}
                  onRetry={retry}
                  videoEnabled={true}
                  audioEnabled={true}
                />
              ) : (
                /* Preview de video */
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <VideoPreview stream={stream} className="w-full aspect-video" />

                {/* Controles de grabación (placeholder) */}
                <div className="p-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Grabar
                      </span>
                    </button>
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Pausar
                    </button>
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Detener
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Controles de grabación (Tarea #6)
                  </p>
                </div>
              </div>
              )}
            </div>

            {/* Columna derecha: Controles y guion */}
            <div className="lg:col-span-1 space-y-6">
              {/* Teleprompter */}
              <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Teleprompter
                </h3>

                <div className="bg-gray-900 rounded p-4 mb-4">
                  <p className="text-gray-300 text-sm line-clamp-6">
                    {currentProject.script}
                  </p>
                </div>

                <button
                  onClick={handleStartTeleprompter}
                  className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Abrir Teleprompter
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  El teleprompter se abrirá en pantalla completa
                </p>
              </div>

              {/* Información del guion */}
              <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Información del Guion
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Palabras:</span>
                    <span className="text-white font-medium">
                      {currentProject.script.trim().split(/\s+/).filter(Boolean).length}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Duración estimada:</span>
                    <span className="text-white font-medium">
                      {(() => {
                        const words = currentProject.script.trim().split(/\s+/).filter(Boolean)
                          .length;
                        const seconds = words > 0 ? Math.ceil((words / 150) * 60) : 0;
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                      })()}
                    </span>
                  </div>

                  {currentProject.logoPosition && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Posición logo:</span>
                      <span className="text-white font-medium text-sm">
                        {
                          {
                            'top-left': 'Superior izq.',
                            'top-right': 'Superior der.',
                            'bottom-left': 'Inferior izq.',
                            'bottom-right': 'Inferior der.',
                          }[currentProject.logoPosition]
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teleprompter overlay */}
      {showTeleprompter && (
        <>
          <Teleprompter
            script={currentProject.script}
            isVisible={showTeleprompter}
            onComplete={handleTeleprompterComplete}
          />

          {/* Botón para cerrar teleprompter */}
          <button
            onClick={handleCloseTeleprompter}
            className="fixed top-4 left-4 z-[60] px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cerrar Teleprompter
          </button>
        </>
      )}
    </>
  );
}
