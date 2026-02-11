'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function SetupPage() {
  const { setCurrentView } = useAppStore();

  useEffect(() => {
    setCurrentView('setup');
  }, [setCurrentView]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Configuración del Proyecto
          </h1>
          <p className="text-gray-600">
            Vista de configuración - Próximamente implementada en Tarea #3
          </p>
        </div>
      </div>
    </div>
  );
}
