'use client';

import { useMediaPermissions, PermissionState } from '@/hooks/useMediaPermissions';

interface PermissionsRequestProps {
  onPermissionsGranted?: (stream: MediaStream) => void;
  videoConstraints?: boolean | MediaTrackConstraints;
  audioConstraints?: boolean | MediaTrackConstraints;
}

export default function PermissionsRequest({
  onPermissionsGranted,
  videoConstraints = true,
  audioConstraints = true,
}: PermissionsRequestProps) {
  const { permissionState, error, requestPermissions, retry } = useMediaPermissions({
    video: videoConstraints,
    audio: audioConstraints,
  });

  const handleRequestPermissions = async () => {
    const stream = await requestPermissions();
    if (stream && onPermissionsGranted) {
      onPermissionsGranted(stream);
    }
  };

  const getStateIcon = (state: PermissionState) => {
    switch (state) {
      case 'idle':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case 'requesting':
        return (
          <svg
            className="w-16 h-16 text-primary-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case 'granted':
        return (
          <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'denied':
      case 'error':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getStateTitle = (state: PermissionState) => {
    switch (state) {
      case 'idle':
        return 'Permisos Requeridos';
      case 'requesting':
        return 'Solicitando Permisos...';
      case 'granted':
        return 'Permisos Concedidos';
      case 'denied':
        return 'Permisos Denegados';
      case 'error':
        return 'Error';
    }
  };

  const getStateMessage = (state: PermissionState) => {
    switch (state) {
      case 'idle':
        return 'Necesitamos acceso a tu cámara y micrófono para grabar el video.';
      case 'requesting':
        return 'Por favor, acepta los permisos en tu navegador...';
      case 'granted':
        return '¡Todo listo! Ahora puedes comenzar a grabar.';
      case 'denied':
        return error || 'Has denegado el acceso. Por favor, permite el acceso para continuar.';
      case 'error':
        return error || 'Ocurrió un error al solicitar los permisos.';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="text-center space-y-6">
        {/* Icono de estado */}
        <div className="flex justify-center">{getStateIcon(permissionState)}</div>

        {/* Título */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {getStateTitle(permissionState)}
          </h3>
          <p className="text-gray-400">{getStateMessage(permissionState)}</p>
        </div>

        {/* Detalles de permisos */}
        {permissionState === 'idle' && (
          <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-300">
              <svg className="w-5 h-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>{videoConstraints ? 'Cámara' : 'Sin cámara'}</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-300">
              <svg className="w-5 h-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span>{audioConstraints ? 'Micrófono' : 'Sin micrófono'}</span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="pt-4">
          {permissionState === 'idle' && (
            <button
              onClick={handleRequestPermissions}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Solicitar Permisos
            </button>
          )}

          {(permissionState === 'denied' || permissionState === 'error') && (
            <button
              onClick={retry}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar
            </button>
          )}
        </div>

        {/* Ayuda adicional para permisos denegados */}
        {permissionState === 'denied' && (
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-amber-300 mb-2">
              ¿Cómo permitir el acceso?
            </h4>
            <ul className="text-xs text-amber-200 space-y-1 text-left">
              <li>1. Haz clic en el ícono de candado (🔒) en la barra de direcciones</li>
              <li>2. Busca "Cámara" y "Micrófono"</li>
              <li>3. Cambia a "Permitir"</li>
              <li>4. Recarga la página</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
