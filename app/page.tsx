'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { setCurrentView } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  const handleNewProject = () => {
    router.push('/setup');
  };

  const handleTeleprompter = () => {
    router.push('/teleprompter');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo y Título */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Intuitus
          </h1>
          <p className="text-2xl text-gray-600">
            Grabador Tutorial Profesional
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Crea videos educativos con teleprompter inteligente,
            edición simple y mirada natural. 100% privado.
          </p>
        </div>

        {/* Estado temporal - MVP en desarrollo */}
        <div className="bg-white rounded-2xl shadow-xl p-12 space-y-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              MVP en Desarrollo
            </h2>
            <p className="text-gray-600">
              Estamos construyendo la primera versión de Intuitus.
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-primary-900 mb-2">
              ✨ Features del MVP:
            </h3>
            <ul className="space-y-1 text-primary-800">
              <li>• Teleprompter con scroll suave</li>
              <li>• Grabación con logo overlay</li>
              <li>• Edición simple (cortar inicio/fin)</li>
              <li>• Exportación a MP4</li>
              <li>• Procesamiento 100% local</li>
            </ul>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleNewProject}
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Crear Proyecto de Video
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">o</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button
              onClick={handleTeleprompter}
              className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Solo Teleprompter
            </button>
            <p className="text-sm text-gray-500">
              Úsalo para videollamadas, presentaciones en vivo, sin grabar
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-400">
          <p>Versión 1.0.0 (MVP) • Por Verumax</p>
        </div>
      </div>
    </main>
  );
}
