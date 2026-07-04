'use client';

/**
 * Halaman Admin (/admin)
 * Dipindahkan dari routing manual di App.tsx (window.location.pathname === '/admin')
 * ke halaman Next.js yang proper.
 */
import AdminPage from '../../views/AdminPage';

export default function AdminRoutePage() {
  return <AdminPage />;
}
