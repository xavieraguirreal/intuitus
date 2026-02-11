'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function RecordPage() {
  const { setCurrentView } = useAppStore();

  useEffect(() => {
    setCurrentView('record');
  }, [setCurrentView]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Vista de Grabación
          </h1>
          <p className="text-gray-300">
            Vista de grabación - Implementada en Tareas #5, #6 y #7
          </p>
        </div>
      </div>
    </div>
  );
}
