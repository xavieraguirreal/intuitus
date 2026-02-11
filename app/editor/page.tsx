'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function EditorPage() {
  const { setCurrentView } = useAppStore();

  useEffect(() => {
    setCurrentView('editor');
  }, [setCurrentView]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Editor de Video
          </h1>
          <p className="text-gray-600">
            Vista del editor - Implementada en Tareas #9, #10 y #11
          </p>
        </div>
      </div>
    </div>
  );
}
