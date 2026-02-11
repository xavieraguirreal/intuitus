'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import ScriptEditor from '@/components/setup/ScriptEditor';
import LogoUploader from '@/components/setup/LogoUploader';
import SetupSummary from '@/components/setup/SetupSummary';
import type { Project } from '@/types';

export default function SetupPage() {
  const { setCurrentView, setCurrentProject, addProject } = useAppStore();
  const router = useRouter();

  const [script, setScript] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >('top-right');

  useEffect(() => {
    setCurrentView('setup');
  }, [setCurrentView]);

  const handleContinue = () => {
    // Crear nuevo proyecto
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: `Proyecto ${new Date().toLocaleDateString()}`,
      script,
      logo: logo || undefined,
      logoPosition,
      cuts: [],
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Guardar en store
    addProject(newProject);
    setCurrentProject(newProject);

    // Ir a vista de grabación
    router.push('/record');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configuración del Proyecto
          </h1>
          <p className="text-gray-600">
            Prepara tu guion y personaliza tu video antes de grabar
          </p>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor de guion */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ScriptEditor value={script} onChange={setScript} />
            </div>

            {/* Upload de logo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <LogoUploader
                logo={logo}
                onLogoChange={setLogo}
                position={logoPosition}
                onPositionChange={setLogoPosition}
              />
            </div>
          </div>

          {/* Columna derecha: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <SetupSummary
                script={script}
                logo={logo}
                logoPosition={logoPosition}
                onContinue={handleContinue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
