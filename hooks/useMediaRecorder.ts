'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface UseMediaRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export function useMediaRecorder(
  stream: MediaStream | null,
  options: UseMediaRecorderOptions = {}
) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0); // en segundos

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Determinar el mejor mimeType soportado
  const getSupportedMimeType = useCallback(() => {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return ''; // Usar default del navegador
  }, []);

  // Iniciar grabación
  const startRecording = useCallback(() => {
    if (!stream) {
      setError('No hay stream de video disponible');
      return;
    }

    try {
      const mimeType = options.mimeType || getSupportedMimeType();
      const recorderOptions: MediaRecorderOptions = {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: options.videoBitsPerSecond || 2500000, // 2.5 Mbps default
      };

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      // Event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'video/webm',
        });
        setRecordedBlob(blob);
        setRecordingState('stopped');
        chunksRef.current = [];

        // Detener timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Error durante la grabación');
        setRecordingState('idle');
      };

      // Iniciar grabación
      mediaRecorder.start(1000); // Capturar chunks cada segundo
      mediaRecorderRef.current = mediaRecorder;
      setRecordingState('recording');
      setError(null);
      setRecordedBlob(null);
      chunksRef.current = [];

      // Iniciar timer
      pausedTimeRef.current = 0; // Reset en cada inicio
      startTimeRef.current = Date.now();

      // Actualizar inmediatamente para mostrar 0:00
      setDuration(0);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        console.log('Timer tick:', elapsed); // Debug
        setDuration(elapsed);
      }, 1000);

      console.log('Recording started with mimeType:', mimeType);
      console.log('Timer started at:', new Date(startTimeRef.current).toISOString());
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar grabación');
      setRecordingState('idle');
    }
  }, [stream, options.mimeType, options.videoBitsPerSecond, getSupportedMimeType]);

  // Pausar grabación
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');

      // Pausar timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      pausedTimeRef.current = Date.now() - startTimeRef.current;

      console.log('Recording paused at:', pausedTimeRef.current / 1000, 'seconds');
    }
  }, [recordingState]);

  // Reanudar grabación
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');

      // Reanudar timer
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
      }, 1000);

      console.log('Recording resumed');
    }
  }, [recordingState]);

  // Detener grabación
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState !== 'idle') {
      mediaRecorderRef.current.stop();
      console.log('Recording stopped');
    }
  }, [recordingState]);

  // Reset (limpiar todo)
  const reset = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (recordingState === 'recording' || recordingState === 'paused') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    chunksRef.current = [];
    setRecordingState('idle');
    setRecordedBlob(null);
    setError(null);
    setDuration(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, [recordingState]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && recordingState !== 'idle') {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  // Formatear duración
  const formatDuration = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    recordingState,
    recordedBlob,
    error,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
    isSupported: typeof MediaRecorder !== 'undefined',
  };
}
