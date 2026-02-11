'use client';

import { useState } from 'react';
import { getAvailableMarkers } from '@/lib/scriptMarkers';

export default function MarkersHelp() {
  const [showHelp, setShowHelp] = useState(false);
  const markers = getAvailableMarkers();

  return (
    <>
      {/* Botón para mostrar ayuda */}
      <button
        onClick={() => setShowHelp(true)}
        className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        ¿Cómo usar marcadores de expresión?
      </button>

      {/* Modal de ayuda */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Marcadores de Expresión</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Introducción */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Los marcadores de expresión te ayudan a controlar tu lectura y expresiones mientras
                  usas el teleprompter. Simplemente escribe los marcadores entre corchetes en tu guion.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Ejemplo:</strong> Hola, bienvenidos. [PAUSA 2s] Hoy vamos a hablar de un tema importante. [SONREÍR]
                  </p>
                </div>
              </div>

              {/* Lista de marcadores */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Marcadores Disponibles</h3>
              <div className="space-y-3">
                {markers.map((marker) => (
                  <div
                    key={marker.marker}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-2xl mr-2">{marker.icon}</span>
                          <code className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-sm">
                            {marker.example}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600">{marker.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Los marcadores aparecerán en <span className="text-green-600 font-semibold">verde</span> en el teleprompter</li>
                  <li>• Usa [PAUSA Xs] para pausas automáticas (ej: [PAUSA 3s])</li>
                  <li>• Los marcadores no distinguen mayúsculas/minúsculas</li>
                  <li>• Puedes usar acentos o no: [ÉNFASIS] o [ENFASIS]</li>
                  <li>• Los marcadores se guardan junto con tu guion</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
