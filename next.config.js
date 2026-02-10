/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para FFmpeg.wasm (Cross-Origin Isolation)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },

  // Optimizaciones
  reactStrictMode: true,
  swcMinify: true,

  // Configuración de imágenes
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack config para archivos de gran tamaño
  webpack: (config, { isServer }) => {
    // FFmpeg.wasm requiere soporte de WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

module.exports = nextConfig;
