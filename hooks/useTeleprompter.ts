'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTeleprompterProps {
  script: string;
  onComplete?: () => void;
}

export function useTeleprompter({ script, onComplete }: UseTeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150); // WPM (palabras por minuto)
  const [fontSize, setFontSize] = useState(32); // px
  const [scrollPosition, setScrollPosition] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Calcular velocidad de scroll en px/ms
  // Asumiendo altura promedio de línea = 1.5 * fontSize
  // Velocidad base: (speed WPM / 60 segundos) * (altura línea / palabras por línea)
  const getScrollSpeed = useCallback(() => {
    const lineHeight = fontSize * 1.5;
    const wordsPerLine = 8; // Estimación para columna de 350px
    const linesPerMinute = speed / wordsPerLine;
    const pixelsPerMinute = linesPerMinute * lineHeight;
    const pixelsPerMs = pixelsPerMinute / 60000;
    return pixelsPerMs;
  }, [speed, fontSize]);

  // Auto-scroll
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const scrollSpeed = getScrollSpeed();
      const newPosition = scrollPosition + scrollSpeed * deltaTime;

      // Verificar si llegamos al final
      const container = containerRef.current;
      if (container) {
        const maxScroll = container.scrollHeight - container.clientHeight;

        if (newPosition >= maxScroll) {
          setScrollPosition(maxScroll);
          setIsPlaying(false);
          onComplete?.();
          return;
        }
      }

      setScrollPosition(newPosition);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, scrollPosition, getScrollSpeed, onComplete]);

  // Aplicar scroll position al contenedor
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          increaseSpeed();
          break;
        case 'ArrowDown':
          e.preventDefault();
          decreaseSpeed();
          break;
        case 'Equal': // Tecla +
        case 'NumpadAdd':
          e.preventDefault();
          increaseFontSize();
          break;
        case 'Minus':
        case 'NumpadSubtract':
          e.preventDefault();
          decreaseFontSize();
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            reset();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        lastTimeRef.current = 0; // Reset timer cuando se reanuda
      }
      return !prev;
    });
  }, []);

  const increaseSpeed = useCallback(() => {
    setSpeed((prev) => Math.min(prev + 10, 500)); // Máximo 500 WPM
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeed((prev) => Math.max(prev - 10, 50)); // Mínimo 50 WPM
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 60)); // Máximo 60px
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 20)); // Mínimo 20px
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setScrollPosition(0);
    lastTimeRef.current = 0;
  }, []);

  const setCustomSpeed = useCallback((newSpeed: number) => {
    setSpeed(Math.max(50, Math.min(500, newSpeed)));
  }, []);

  const setCustomFontSize = useCallback((newSize: number) => {
    setFontSize(Math.max(20, Math.min(60, newSize)));
  }, []);

  return {
    // Estado
    isPlaying,
    speed,
    fontSize,
    scrollPosition,
    containerRef,

    // Acciones
    togglePlay,
    increaseSpeed,
    decreaseSpeed,
    increaseFontSize,
    decreaseFontSize,
    reset,
    setCustomSpeed,
    setCustomFontSize,
  };
}
