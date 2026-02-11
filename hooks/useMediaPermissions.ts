'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

interface MediaPermissionsOptions {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

export function useMediaPermissions(options: MediaPermissionsOptions = { video: true, audio: true }) {
  const [permissionState, setPermissionState] = useState<PermissionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Solicitar permisos
  const requestPermissions = useCallback(async () => {
    setPermissionState('requesting');
    setError(null);

    // Verificar si getUserMedia está disponible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Tu navegador no soporta acceso a cámara/micrófono, o el sitio no está en HTTPS. Por favor, accede usando HTTPS (https://intuitus.verumax.com)');
      setPermissionState('error');
      return null;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: options.video || false,
        audio: options.audio || false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState('granted');

      return mediaStream;
    } catch (err) {
      console.error('Error requesting media permissions:', err);

      let errorMessage = 'Error desconocido al solicitar permisos';

      if (err instanceof Error) {
        // Errores comunes de getUserMedia
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            errorMessage = 'Permiso denegado. Por favor, permite el acceso a la cámara y micrófono.';
            setPermissionState('denied');
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorMessage = 'No se encontró cámara o micrófono. Verifica que estén conectados.';
            setPermissionState('error');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            errorMessage = 'El dispositivo está siendo usado por otra aplicación.';
            setPermissionState('error');
            break;
          case 'OverconstrainedError':
            errorMessage = 'Las restricciones de video/audio no pueden ser satisfechas.';
            setPermissionState('error');
            break;
          case 'SecurityError':
            errorMessage = 'Error de seguridad. Asegúrate de estar usando HTTPS.';
            setPermissionState('error');
            break;
          default:
            errorMessage = `Error: ${err.message}`;
            setPermissionState('error');
        }
      }

      setError(errorMessage);
      return null;
    }
  }, [options.video, options.audio]);

  // Detener stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setPermissionState('idle');
    }
  }, []);

  // Reintentar permisos
  const retry = useCallback(() => {
    setError(null);
    setPermissionState('idle');
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    permissionState,
    error,
    stream,
    requestPermissions,
    stopStream,
    retry,
  };
}
