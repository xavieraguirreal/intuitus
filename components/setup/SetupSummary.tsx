'use client';

import Image from 'next/image';

interface SetupSummaryProps {
  script: string;
  logo: string | null;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onContinue: () => void;
}

export default function SetupSummary({
  script,
  logo,
  logoPosition,
  onContinue,
}: SetupSummaryProps) {
  const isValid = script.trim().length > 0;
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedTime = wordCount > 0 ? Math.ceil((wordCount / 150) * 60) : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const positionLabels = {
    'top-left': 'Superior izquierda',
    'top-right': 'Superior derecha',
    'bottom-left': 'Inferior izquierda',
    'bottom-right': 'Inferior derecha',
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Resumen del Proyecto
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Verifica que todo esté correcto antes de continuar
        </p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guion */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <svg
              className="w-5 h-5 text-primary-600 mr-2"
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
            <h4 className="font-semibold text-gray-700">Guion</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Palabras:</span>
              <span className="font-medium text-gray-800">{wordCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duración estimada:</span>
              <span className="font-medium text-gray-800">
                {formatTime(estimatedTime)}
              </span>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 line-clamp-3">
              {script.substring(0, 150)}
              {script.length > 150 && '...'}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <svg
              className="w-5 h-5 text-primary-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h4 className="font-semibold text-gray-700">Logo</h4>
          </div>
          {logo ? (
            <div className="space-y-3">
              <div className="flex justify-center p-4 bg-gray-50 rounded">
                <Image
                  src={logo}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="max-h-20 w-auto object-contain"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Posición:</span>
                <span className="font-medium text-gray-800">
                  {positionLabels[logoPosition]}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              Sin logo
            </div>
          )}
        </div>
      </div>

      {/* Botón continuar */}
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`
            flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all
            ${
              isValid
                ? 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Continuar a Grabación
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      {/* Validación */}
      {!isValid && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900">
                El guion es obligatorio
              </h4>
              <p className="text-sm text-amber-800 mt-1">
                Debes escribir un guion antes de continuar a la grabación.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
