import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intuitus - Grabador Tutorial Profesional',
  description: 'Crea videos educativos profesionales con teleprompter inteligente y edición simple. 100% privado, procesamiento local.',
  keywords: ['grabador', 'teleprompter', 'video tutorial', 'educación', 'contenido educativo'],
  authors: [{ name: 'Verumax' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0ea5e9',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://intuitus.verumax.com',
    title: 'Intuitus - Grabador Tutorial Profesional',
    description: 'Crea videos educativos profesionales con teleprompter inteligente',
    siteName: 'Intuitus',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
