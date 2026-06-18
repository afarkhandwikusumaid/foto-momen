import React, { useEffect, useState } from 'react';
import { Camera, Sparkles, Layout, Download, Grid, Watch, X, Image as ImageIcon, Cloud } from 'lucide-react';
import { getUserSessions } from '../firebase/config';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [localHistory, setLocalHistory] = useState<Array<{ id: string; imageUrl: string; layout: string; createdAt: number }>>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const sessions = await getUserSessions();
      sessions.sort((a, b) => b.createdAt - a.createdAt);
      setLocalHistory(sessions);
    } catch (err) {
      console.error("Gagal membaca riwayat:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-16 text-slate-800">
      {/* Hero Section with Custom Gradient Background */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-slate-50 border border-blue-100 p-8 md:p-12 mb-16 shadow-xl shadow-blue-100/10 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 fill-blue-600/10" />
              <span>Premium Web-Based Photobooth</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Tangkap Momenmu Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 font-display">Foto Momen</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-body">
              Ubah perangkatmu menjadi photobooth klasik & premium. Ambil pose seru, tambahkan live filter, hiasi dengan stiker, lalu simpan memori abadi.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStart}
                className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Camera className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span>Mulai Foto Sekarang</span>
              </button>
            </div>
          </div>
          
          {/* Animated Mockup */}
          <div className="hidden lg:flex justify-center items-center relative h-full min-h-[300px]">
            {/* White/Silver Elegant Frame Mockup */}
            <div className="absolute w-48 h-[320px] bg-white border border-blue-100 p-3 rounded-xl shadow-2xl rotate-[-8deg] z-20 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full border border-blue-100 rounded-lg flex flex-col p-2 gap-2 bg-slate-50">
                <div className="flex-1 bg-blue-100/40 border border-blue-100/20 rounded"></div>
                <div className="flex-1 bg-blue-100/40 border border-blue-100/20 rounded"></div>
                <div className="flex-1 bg-blue-100/40 border border-blue-100/20 rounded"></div>
                <div className="text-center font-display font-bold text-[10px] text-blue-600 pt-1 tracking-widest uppercase">Foto Momen</div>
              </div>
            </div>
            {/* Midnight Frame Mockup */}
            <div className="absolute w-48 h-[320px] bg-[#0a1628] border border-blue-800/50 p-3 rounded-xl shadow-xl rotate-[12deg] z-10 translate-x-12 translate-y-8 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full border border-blue-700/30 rounded-lg flex flex-col p-2 gap-2 bg-[#0f2342]">
                <div className="flex-1 bg-blue-900/30 rounded"></div>
                <div className="flex-1 bg-blue-900/30 rounded"></div>
                <div className="flex-1 bg-blue-900/30 rounded"></div>
                <div className="text-center font-display font-bold text-[10px] text-amber-400 pt-1 tracking-wider">Navy & Gold</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Guide Grid */}
      <div className="my-16">
        <h2 className="font-display text-center text-2xl font-bold text-slate-850 mb-10 flex items-center justify-center gap-2">
          <Grid className="h-6 w-6 text-blue-600" /> Cara Kerja Foto Momen
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-blue-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Layout className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">1. Pilih Layout</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-body">
              Atur tata letak strip memanjang klasik, polaroid, hingga warna frame yang premium.
            </p>
          </div>
          <div className="bg-white border border-blue-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Watch className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">2. Pose & Capture</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-body">
              Gunakan live filter kamera dan berpose di setiap hitungan mundur otomatis.
            </p>
          </div>
          <div className="bg-white border border-blue-50 p-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">3. Dekorasi & Simpan</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-body">
              Hiasi foto final dengan stiker lucu, lalu dapatkan QR code untuk membagikannya ke awan.
            </p>
          </div>
        </div>
      </div>

      {/* Riwayat Foto Cloud */}
      {localHistory.length > 0 && (
        <div className="border-t border-blue-100 pt-12">
          <div className="flex items-center justify-between mb-8 select-none">
            <h3 className="font-display text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-blue-600" />
              Galeri Momenmu
            </h3>
            <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Cloud className="h-3.5 w-3.5" />
              Tersimpan di Cloud
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {localHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setPreviewImage(item.imageUrl)}
                className="group relative aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt="Riwayat Foto Strip"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-6">
                  <div className="text-[10px] font-bold text-white/95 drop-shadow">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Preview Image */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={previewImage} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/20" 
              alt="Preview" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
