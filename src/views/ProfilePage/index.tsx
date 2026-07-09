'use client';

import React, { useEffect, useState } from 'react';
import { Camera, Sparkles, MapPin, ArrowRight, Home } from 'lucide-react';
import { getCustomRoute, CustomRoute } from '../../services/dbService';

interface ProfilePageProps {
  slugPath: string;
}

export default function ProfilePage({ slugPath }: ProfilePageProps) {
  const [routeData, setRouteData] = useState<CustomRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data custom route berdasarkan full slug (contoh: 'lentera' atau 'lentera/12a')
    getCustomRoute(slugPath)
      .then((data) => {
        setRouteData(data);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [slugPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium animate-pulse">Menyiapkan profil kolaborasi...</p>
      </div>
    );
  }

  // Tampilan 404 jika Rute tidak ditemukan
  if (!routeData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-10 rounded-[32px] max-w-md w-full shadow-lg border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
          <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8 font-medium">Link kolaborasi <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">/{slugPath}</span> belum terdaftar di sistem Foto Momen.</p>
          <a href="/" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  // Menentukan URL Photobooth
  const photoboothUrl = routeData.targetId 
    ? `/?frame=${routeData.targetId}` 
    : '/';

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden flex flex-col">
      
      {/* Navbar Minimalis */}
      <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-center sm:justify-start">
        <a href="/" className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-slate-200/50 flex items-center gap-2 hover:bg-white transition cursor-pointer">
          <img src="/fm-logo-text.png" alt="Foto Momen" className="h-4 object-contain" />
        </a>
      </nav>

      {/* Background Ornaments (Modern Premium Aesthetic) */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1d90ff]/10 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 pt-20">
        
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="premium-glass rounded-[40px] border border-white/60 p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center">
            
            {/* Label Kolaborasi */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-xs font-bold text-[#1d90ff] shadow-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-widest text-[10px]">
                {routeData.routeType === 'company' ? 'Company Collaboration' : routeData.routeType === 'yearbook' ? 'Yearbook Class Profile' : 'Exclusive Event'}
              </span>
            </div>

            {/* Judul & Deskripsi Profil */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              {routeData.title}
            </h1>
            
            <p className="text-slate-500 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed font-medium mb-12">
              {routeData.description || 'Selamat datang di halaman photobooth virtual eksklusif kolaborasi bersama Foto Momen. Yuk, abadikan keseruan hari ini!'}
            </p>

            {/* Call to Action Button */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Ripple Effect Behind Button */}
              <div className="absolute inset-0 bg-[#1d90ff]/20 rounded-full scale-[1.3] blur-xl opacity-70 animate-pulse pointer-events-none"></div>
              
              <a 
                href={photoboothUrl}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-[#1d90ff] hover:bg-blue-600 text-white font-extrabold text-lg rounded-full hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg shadow-blue-500/30 overflow-hidden"
              >
                {/* Shiny sweep animation inside button */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                
                <Camera className="w-6 h-6 text-blue-200" />
                <span>Mulai Sesi Foto</span>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <p className="text-xs text-slate-400 mt-5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 
                Ready to shoot
              </p>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
