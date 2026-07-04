'use client';

/**
 * Halaman utama Foto Momen (/)
 * Semua logika photobooth ada di App.tsx — komponen ini hanya sebagai entry point Next.js.
 * Menggunakan 'use client' karena App.tsx memakai hooks, state, dan browser APIs (window, sessionStorage).
 */
import App from '../App';

export default function HomePage() {
  return <App />;
}
