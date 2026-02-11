'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useMediaPermissions } from '@/hooks/useMediaPermissions';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
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

  // Hook de grabación
  const {
    recordingState,
    recordedBlob,
    error: recordingError,
    formattedDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
  } = useMediaRecorder(stream);

  useEffect(() => {
    setCurrentView('record');
  }, [setCurrentView]);

  // Debug: Log cuando cambia formattedDuration
  useEffect(() => {
    console.log('Duration changed:', formattedDuration);
  }, [formattedDuration]);

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
    // Detener grabación automáticamente si está grabando
    if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const handleStartRecordingWithTeleprompter = () => {
    startRecording();
    // Abrir teleprompter automáticamente al iniciar grabación
    setTimeout(() => {
      setShowTeleprompter(true);
    }, 500); // Pequeño delay para mejor UX
  };

  const handleNewRecording = () => {
    reset(); // Limpiar grabación anterior
    setTimeout(() => {
      startRecording(); // Iniciar nueva grabación
    }, 100); // Pequeño delay para asegurar que el reset se complete
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

                  {/* Controles de grabación */}
                  <div className="p-6 border-t border-gray-700">
                    {/* Timer de grabación */}
                    {recordingState !== 'idle' && (
                      <div className="mb-4 text-center">
                        <div className="inline-flex items-center bg-gray-900 rounded-lg px-6 py-3">
                          {recordingState === 'recording' && (
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                          )}
                          <span className="text-2xl font-mono text-white font-bold">
                            {formattedDuration}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Botones de control */}
                    <div className="flex flex-col items-center gap-4">
                      {recordingState === 'idle' && (
                        <>
                          <div className="flex gap-3">
                            <button
                              onClick={handleStartRecordingWithTeleprompter}
                              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center"
                            >
                              <span className="w-4 h-4 bg-white rounded-full mr-3"></span>
                              Grabar con Teleprompter
                            </button>
                            <button
                              onClick={startRecording}
                              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center"
                            >
                              <span className="w-4 h-4 bg-white rounded-full mr-3"></span>
                              Grabar sin Teleprompter
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            Recomendado: Usar teleprompter para leer tu guion mientras grabas
                          </p>
                        </>
                      )}

                      {recordingState === 'recording' && (
                        <>
                          <div className="flex gap-3">
                            <button
                              onClick={pauseRecording}
                              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Pausar
                            </button>
                            <button
                              onClick={() => setShowTeleprompter(!showTeleprompter)}
                              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                                showTeleprompter
                                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                              }`}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              {showTeleprompter ? 'Ocultar' : 'Mostrar'} Teleprompter
                            </button>
                            <button
                              onClick={stopRecording}
                              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Detener
                            </button>
                          </div>
                        </>
                      )}

                      {recordingState === 'paused' && (
                        <>
                          <div className="flex gap-3">
                            <button
                              onClick={resumeRecording}
                              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Reanudar
                            </button>
                            <button
                              onClick={() => setShowTeleprompter(!showTeleprompter)}
                              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                                showTeleprompter
                                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                              }`}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              {showTeleprompter ? 'Ocultar' : 'Mostrar'} Teleprompter
                            </button>
                            <button
                              onClick={stopRecording}
                              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Detener
                            </button>
                          </div>
                        </>
                      )}

                      {recordingState === 'stopped' && recordedBlob && (
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-green-400 font-semibold">
                            ✓ Grabación completada ({formattedDuration})
                          </p>
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                // TODO: Guardar en proyecto e ir a editor
                                console.log('Recorded blob:', recordedBlob);
                              }}
                              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                            >
                              Ir a Editor
                            </button>
                            <button
                              onClick={handleNewRecording}
                              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                            >
                              Nueva Grabación
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Error de grabación */}
                    {recordingError && (
                      <div className="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-3">
                        <p className="text-sm text-red-300 text-center">{recordingError}</p>
                      </div>
                    )}
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
            onClose={handleCloseTeleprompter}
          />

          {/* Indicador de grabación en teleprompter */}
          {(recordingState === 'recording' || recordingState === 'paused') && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-gray-900/95 rounded-lg px-6 py-3 shadow-lg border border-gray-700">
              <div className="flex items-center gap-3">
                {recordingState === 'recording' && (
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
                {recordingState === 'paused' && (
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                )}
                <span className="text-white font-mono text-xl font-bold">{formattedDuration}</span>
                <span className="text-gray-400 text-sm">
                  {recordingState === 'recording' ? 'Grabando' : 'Pausado'}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
