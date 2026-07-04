import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Foto Momen',
    short_name: 'Foto Momen',
    description: 'Virtual Photobooth Indonesia - Buat foto strip digital bersama teman!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d90ff',
    icons: [
      {
        src: '/favicon/fm-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/fm-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
