'use client';

import { useAppStore } from '@/lib/store';
import type { AppView } from '@/types';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const { currentView, setCurrentView, resetApp } = useAppStore();

  const handleHome = () => {
    resetApp();
  };

  const views: { id: AppView; label: string; icon: string }[] = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'setup', label: 'Configurar', icon: '⚙️' },
    { id: 'record', label: 'Grabar', icon: '🎬' },
    { id: 'editor', label: 'Editar', icon: '✂️' },
  ];

  return (
    <nav className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleHome}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Intuitus
            </button>
          </div>

          {/* Breadcrumb de vistas */}
          <div className="flex items-center space-x-2">
            {views.map((view, index) => (
              <div key={view.id} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-300">→</span>
                )}
                <button
                  onClick={() => setCurrentView(view.id)}
                  disabled={currentView === view.id}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      currentView === view.id
                        ? 'bg-primary-100 text-primary-700 cursor-default'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }
                  `}
                >
                  <span>{view.icon}</span>
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Versión */}
          <div className="flex items-center">
            <span className="text-xs text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
