export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo y Título */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Intuitus
          </h1>
          <p className="text-2xl text-gray-600">
            Grabador Tutorial Profesional
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Crea videos educativos con teleprompter inteligente,
            edición simple y mirada natural. 100% privado.
          </p>
        </div>

        {/* Estado temporal - MVP en desarrollo */}
        <div className="bg-white rounded-2xl shadow-xl p-12 space-y-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              MVP en Desarrollo
            </h2>
            <p className="text-gray-600">
              Estamos construyendo la primera versión de Intuitus.
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-primary-900 mb-2">
              ✨ Features del MVP:
            </h3>
            <ul className="space-y-1 text-primary-800">
              <li>• Teleprompter con scroll suave</li>
              <li>• Grabación con logo overlay</li>
              <li>• Edición simple (cortar inicio/fin)</li>
              <li>• Exportación a MP4</li>
              <li>• Procesamiento 100% local</li>
            </ul>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-500">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
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
              Implementando componentes...
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-400">
          <p>Versión 1.0.0 (MVP) • Por Verumax</p>
        </div>
      </div>
    </main>
  );
}
