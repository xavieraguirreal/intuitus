'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onPositionChange: (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => void;
}

export default function LogoUploader({
  logo,
  onLogoChange,
  position,
  onPositionChange,
}: LogoUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen (PNG, JPG, SVG)');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 2MB');
      return;
    }

    // Leer archivo como base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const positions = [
    { id: 'top-left', label: 'Superior izquierda', icon: '↖️' },
    { id: 'top-right', label: 'Superior derecha', icon: '↗️' },
    { id: 'bottom-left', label: 'Inferior izquierda', icon: '↙️' },
    { id: 'bottom-right', label: 'Inferior derecha', icon: '↘️' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo (Opcional)
        </label>
        <p className="text-sm text-gray-500">
          Agrega tu logo para que aparezca en el video
        </p>
      </div>

      {/* Upload / Preview */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!logo ? (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Seleccionar logo
              </label>
              <input
                id="logo-upload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG o SVG hasta 2MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                src={logo}
                alt="Logo preview"
                width={200}
                height={200}
                className="max-h-32 w-auto object-contain"
              />
            </div>
            <button
              onClick={handleRemoveLogo}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Eliminar logo
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Posición (solo si hay logo) */}
      {logo && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Posición del logo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => onPositionChange(pos.id)}
                className={`
                  flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all
                  ${
                    position === pos.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <span className="mr-2 text-lg">{pos.icon}</span>
                <span className="text-sm font-medium">{pos.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
