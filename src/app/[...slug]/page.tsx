'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomRoute, getAssociatedYearbookRoutes, CustomRoute } from '../../services/dbService';
import StudioPage from '../../views/StudioPage';
import { ArrowRight, Sparkles, Building2, Calendar, BookOpen, AlertCircle, Home } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default function CatchAllRoute({ params }: PageProps) {
  const resolvedParams = use(params);
  const slugPath = resolvedParams.slug.join('/');

  const [routeData, setRouteData] = useState<CustomRoute | null>(null);
  const [associatedRoutes, setAssociatedRoutes] = useState<CustomRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRoute() {
      setIsLoading(true);
      try {
        const route = await getCustomRoute(slugPath);
        if (route) {
          setRouteData(route);
          if (route.routeType === 'company') {
            const yearbookRoutes = await getAssociatedYearbookRoutes(route.slug);
            setAssociatedRoutes(yearbookRoutes);
          }
        }
      } catch (err) {
        console.error('Error fetching custom route:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoute();
  }, [slugPath]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen premium-bg text-slate-800">
        <div className="w-12 h-12 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">Menghubungkan ke server...</p>
      </div>
    );
  }

  // Route not found
  if (!routeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen premium-bg px-4 text-center">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 max-w-md w-full shadow-2xl shadow-slate-200/50 animate-fade-in">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Maaf, rute kolaborasi <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">/{slugPath}</span> tidak terdaftar atau telah dinonaktifkan oleh administrator.
          </p>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold shadow-lg shadow-slate-950/10 transition duration-200 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Render Studio Page directly for Yearbook Class or Event
  if (routeData.routeType === 'yearbook' || routeData.routeType === 'event') {
    return <StudioPage eventCode={routeData.targetId || routeData.slug} />;
  }

  // Render Company Profile Page
  return (
    <div className="min-h-screen premium-bg text-slate-900 flex flex-col font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-400/10 blur-[120px]" />
      </div>

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img src="/favicon/fm-icon.png" alt="Icon" className="h-8 w-auto object-contain" />
          <img src="/fm-logo-text.png" alt="Logo" className="h-5 w-auto object-contain" />
        </Link>
        <span className="text-xs uppercase bg-[#1d90ff]/10 border border-[#1d90ff]/20 px-3 py-1 rounded-full text-[#1d90ff] font-bold">
          Partner Portal
        </span>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col justify-center">
        {/* Company Jumbotron Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 sm:p-10 shadow-xl shadow-slate-100/50 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            {/* Logo Wrapper */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] bg-gradient-to-tr from-[#1d90ff] to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            
            <div className="flex-grow">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
                <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
                Kolaborasi Eksklusif
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {routeData.title}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
                {routeData.description || 'Selamat datang di portal kolaborasi foto resmi. Temukan dan abadikan momen terbaik Anda bersama tim dan teman-teman menggunakan frame berdesain khusus.'}
              </p>
            </div>
          </div>
        </div>

        {/* List of Sub-routes (Yearbook Classes) */}
        <div className="space-y-4 animate-fade-in delay-150">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1d90ff]" />
              Pilih Kelas / Album Kenangan
            </h2>
            <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
              {associatedRoutes.length} Tersedia
            </span>
          </div>

          {associatedRoutes.length === 0 ? (
            <div className="bg-white/40 border border-slate-200/50 rounded-2xl p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">Belum Ada Kelas Terdaftar</p>
              <p className="text-xs mt-1">Hubungi admin untuk mendaftarkan kelas yearbook Anda di portal ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {associatedRoutes.map((route) => (
                <Link
                  key={route.id}
                  href={`/${route.slug}`}
                  className="group bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/50 hover:border-[#1d90ff]/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1d90ff] group-hover:bg-[#1d90ff] group-hover:text-white transition-all duration-300 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-slate-900 transition-colors">
                        {route.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {route.description || `Mulai sesi foto kelas ${route.title}`}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#1d90ff] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full text-center py-6 border-t border-slate-100 text-xs text-slate-400 relative z-10 shrink-0">
        © {new Date().getFullYear()} Foto Momen. Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic';

