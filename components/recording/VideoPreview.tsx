'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPreviewProps {
  stream: MediaStream | null;
  mirrored?: boolean;
  className?: string;
}

export default function VideoPreview({
  stream,
  mirrored = true,
  className = '',
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !stream) {
      console.log('VideoPreview: No video element or stream', { videoElement, stream });
      return;
    }

    console.log('VideoPreview: Setting stream', stream);
    videoElement.srcObject = stream;

    // Intentar reproducir el video
    const playVideo = async () => {
      try {
        await videoElement.play();
        setIsPlaying(true);
        setError(null);
        console.log('VideoPreview: Video playing successfully');
      } catch (err) {
        console.error('VideoPreview: Error playing video:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    playVideo();

    // Cleanup
    return () => {
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  if (!stream) {
    return (
      <div className={`bg-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-400">Sin señal de video</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full bg-black ${mirrored ? 'scale-x-[-1]' : ''}`}
      />

      {/* Indicador de estado */}
      {!isPlaying && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <svg
              className="animate-spin h-12 w-12 mx-auto mb-2"
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
            <p className="text-sm">Iniciando cámara...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80">
          <div className="text-center text-white p-4">
            <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold">Error de reproducción</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
