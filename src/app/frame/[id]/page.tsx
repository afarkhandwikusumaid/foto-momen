'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getFrameTemplate, FrameTemplate } from '../../../services/dbService';
import { Camera, Sparkles, AlertCircle, Home, CheckCircle2, LayoutTemplate } from 'lucide-react';

interface FrameProfileProps {
  params: Promise<{ id: string }>;
}

export default function FrameProfilePage({ params }: FrameProfileProps) {
  const resolvedParams = use(params);
  const frameId = resolvedParams.id;

  const [frame, setFrame] = useState<FrameTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFrame() {
      setIsLoading(true);
      try {
        const data = await getFrameTemplate(frameId);
        setFrame(data);
      } catch (err) {
        console.error('Error fetching frame template:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFrame();
  }, [frameId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen premium-bg text-slate-800">
        <div className="w-12 h-12 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat detail frame...</p>
      </div>
    );
  }

  if (!frame) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen premium-bg px-4 text-center">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 max-w-md w-full shadow-2xl shadow-slate-200/50 animate-fade-in">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Frame Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Maaf, template frame dengan kode <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">{frameId}</span> tidak tersedia atau telah dihapus.
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

  const handleApplyFrame = () => {
    // Redirect to home page with frame parameter
    window.location.href = `/?frame=${frame.id}`;
  };

  return (
    <div className="min-h-screen premium-bg text-slate-900 flex flex-col font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[130px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-purple-400/10 blur-[130px]" />
      </div>

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img src="/favicon/fm-icon.png" alt="Icon" className="h-8 w-auto object-contain" />
          <img src="/fm-logo-text.png" alt="Logo" className="h-5 w-auto object-contain" />
        </Link>
        <span className="text-xs uppercase bg-[#1d90ff]/10 border border-[#1d90ff]/20 px-3 py-1 rounded-full text-[#1d90ff] font-bold">
          Frame Detail
        </span>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Kiri: Frame Preview Mockup */}
          <div className="md:col-span-5 flex justify-center animate-fade-in">
            <div className="relative group p-4 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-2xl shadow-slate-200/50 max-w-xs sm:max-w-sm w-full overflow-hidden">
              <div 
                className="w-full aspect-[3/4] relative rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100"
                style={{ backgroundColor: frame.hex || '#ffffff' }}
              >
                {/* Simulated photobooth photo placeholders inside frame */}
                {frame.imageUrl ? (
                  <img 
                    src={frame.imageUrl} 
                    alt={frame.name} 
                    className="absolute inset-0 w-full h-full object-cover z-10" 
                  />
                ) : (
                  <div className="absolute inset-0 border-8" style={{ borderColor: frame.textColor || '#000000' }} />
                )}

                <div className="text-center z-0 p-6 flex flex-col items-center justify-center opacity-40">
                  <LayoutTemplate className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview Frame</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: Frame Info Card */}
          <div className="md:col-span-7 flex flex-col gap-6 animate-fade-in delay-150">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                Template Frame Premium
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                {frame.name}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                ID Template: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">{frame.id}</span>
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Spesifikasi Frame</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-bold">JUMLAH FOTO</div>
                  <div className="text-lg font-black text-slate-800 mt-1">{frame.photoCount} Foto</div>
                </div>
                
                <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-bold">WARNA UTAMA</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-5 h-5 rounded-full border border-slate-300 shadow-inner" style={{ backgroundColor: frame.hex }} />
                    <span className="text-sm font-bold text-slate-800 uppercase">{frame.hex}</span>
                  </div>
                </div>

                <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl col-span-2">
                  <div className="text-xs text-slate-400 font-bold">TIPE LAYOUT</div>
                  <div className="text-sm font-bold text-slate-800 mt-1 capitalize">
                    {frame.layout.startsWith('[') ? 'Custom Grid Layout' : frame.layout.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyFrame}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-base"
            >
              <Camera className="w-5 h-5" />
              Gunakan Frame Ini & Mulai Foto
            </button>
          </div>

        </div>
      </main>

      <footer className="w-full text-center py-6 border-t border-slate-100 text-xs text-slate-400 relative z-10 shrink-0">
        © {new Date().getFullYear()} Foto Momen. Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic';

