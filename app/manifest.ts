import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tec Fazer - Soluções Tecnológicas',
    short_name: 'Tec Fazer',
    description: 'Desenvolvimento de websites, aplicações web e mobile, e-commerce e soluções tecnológicas personalizadas em Mafra, Lisboa.',
    start_url: '/pt',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B7A8A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'technology', 'productivity'],
    lang: 'pt-PT',
    dir: 'ltr',
    orientation: 'portrait-primary',
  }
}
