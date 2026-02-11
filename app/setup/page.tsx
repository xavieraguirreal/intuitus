'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useScriptLibrary } from '@/hooks/useScriptLibrary';
import ScriptEditor from '@/components/setup/ScriptEditor';
import LogoUploader from '@/components/setup/LogoUploader';
import SetupSummary from '@/components/setup/SetupSummary';
import ScriptLibrary from '@/components/scripts/ScriptLibrary';
import type { Project } from '@/types';

export default function SetupPage() {
  const { setCurrentView, setCurrentProject, addProject } = useAppStore();
  const router = useRouter();
  const { save: saveScript } = useScriptLibrary();

  const [script, setScript] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >('top-right');
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentView('setup');
  }, [setCurrentView]);

  // Guardar guion en biblioteca
  const handleSaveScript = async () => {
    if (!script.trim()) {
      alert('Escribe un guion antes de guardar');
      return;
    }

    const nombre = prompt('Nombre del guion:', scriptName || `Guion ${new Date().toLocaleDateString()}`);
    if (!nombre) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      await saveScript(nombre, script);
      setScriptName(nombre);
      setSaveMessage('✓ Guion guardado correctamente');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving script:', error);
      alert('Error al guardar el guion');
    } finally {
      setSaving(false);
    }
  };

  // Cargar guion desde biblioteca
  const handleLoadScript = (contenido: string, nombre: string) => {
    setScript(contenido);
    setScriptName(nombre);
  };

  const handleContinue = () => {
    // Crear nuevo proyecto
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: scriptName || `Proyecto ${new Date().toLocaleDateString()}`,
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
            {/* Botones de biblioteca */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex gap-3">
              <button
                onClick={() => setShowLibrary(true)}
                className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
                Cargar Guion Guardado
              </button>

              <button
                onClick={handleSaveScript}
                disabled={!script.trim() || saving}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {saving ? 'Guardando...' : 'Guardar Guion'}
              </button>
            </div>

            {/* Mensaje de guardado */}
            {saveMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium text-center">{saveMessage}</p>
              </div>
            )}

            {/* Nombre del guion cargado */}
            {scriptName && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Guion actual:</span> {scriptName}
                </p>
              </div>
            )}

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

      {/* Modal de biblioteca de guiones */}
      {showLibrary && (
        <ScriptLibrary
          onLoadScript={handleLoadScript}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
