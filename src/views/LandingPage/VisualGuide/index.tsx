import React from 'react';
import { Camera, Layout, Download, Filter, Sparkles } from 'lucide-react';
import { getPosePlaceholder } from '../../Photobooth/PosePlaceholders';

export default function VisualGuide() {
  return (
    <section className="py-6 border-t border-slate-100 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 select-none">
        <span className="text-[9px] text-brand-blue font-black px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full inline-block uppercase tracking-widest shadow-sm">
          Alur Kerja
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
          Bagaimana Cara Kerjanya?
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-2">
          Hanya butuh empat langkah menyenangkan untuk mengabadikan momen serumu.
        </p>
      </div>

      {/* 3-Column Layout (Left Cards, Center Mockup, Right Cards) - Inspired by "What is Level?" slide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Columns: Step 1 & Step 2 */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-1">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/85 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-blue/20">
                  1
                </div>
                <h3 className="font-extrabold text-base text-slate-800">Atur Frame</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Layout className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Pilih rasio layout strip, tebal border, dan warna latar frame pastel yang paling cocok dengan gayamu hari ini.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white border border-slate-200/85 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-blue/20">
                  2
                </div>
                <h3 className="font-extrabold text-base text-slate-800">Ambil Pose</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Camera className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Nyalakan webcam dan ikuti panduan pose unik. Kamera akan memotret secara otomatis sesuai jeda waktu hitung mundur.
            </p>
          </div>

        </div>

        {/* Center Column: Phone Mockup over accent circle */}
        <div className="lg:col-span-4 flex justify-center items-center order-3 lg:order-2 my-4 lg:my-0 relative">
          
          {/* Accent Blue Circle behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] bg-brand-blue/10 rounded-full -z-10 blur-md" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] sm:w-[240px] sm:h-[240px] bg-brand-blue rounded-full -z-10" />

          {/* High Fidelity Phone Mockup */}
          <div className="relative w-[210px] h-[420px] rounded-[40px] border-[8px] border-slate-950 bg-slate-950 flex-shrink-0">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-30" />
            
            <div className="w-full h-full bg-[#f8fafc] relative flex flex-col pt-7 pb-3 px-2 rounded-[32px] overflow-hidden">
              {/* Screen header with fm-logo-text.png */}
              <div className="flex items-center justify-between px-1 mb-2">
                <img src="/fm-logo-text.png" alt="Foto Momen" className="h-2.5 w-auto object-contain" />
                <span className="text-[7px] font-bold text-brand-blue flex items-center gap-0.5">
                  <Sparkles className="w-2 h-2 animate-spin" />
                  PRO
                </span>
              </div>

              {/* Photo frame collage inside phone preview */}
              <div className="flex-1 bg-white border border-slate-200/80 rounded-xl p-2 flex flex-col justify-between shadow-inner">
                <div className="grid grid-cols-1 gap-1 h-[82%]">
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(0, "w-8 h-8 text-brand-blue opacity-85", "#2563eb")}
                  </div>
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(1, "w-8 h-8 text-purple-500 opacity-85", "#a855f7")}
                  </div>
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(2, "w-8 h-8 text-emerald-500 opacity-85", "#10b981")}
                  </div>
                </div>

                <div className="bg-brand-blue text-white rounded-lg py-1 px-0.5 text-center shadow-sm">
                  <p className="text-[6px] font-black tracking-widest uppercase">XII - BAHASA</p>
                </div>
              </div>

              {/* Bottom buttons preview */}
              <div className="mt-2.5 flex items-center justify-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-[8px] font-black">
                  ✓
                </div>
                <div className="text-[7px] font-bold text-slate-500">
                  Ready to Share
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Step 3 & Step 4 */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-3">
          
          {/* Card 3 */}
          <div className="bg-white border border-slate-200/85 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-blue/20">
                  3
                </div>
                <h3 className="font-extrabold text-base text-slate-800">Terapkan Filter</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Filter className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Poles hasil tangkapan fotomu menggunakan berbagai pilihan filter warna estetik untuk hasil akhir yang maksimal.
            </p>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white border border-slate-200/85 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-blue/20">
                  4
                </div>
                <h3 className="font-extrabold text-base text-slate-800">Unduh & Bagikan</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Download className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Dapatkan fotomu dalam format cetak Strip Foto atau file GIF/Video pendek, lalu bagikan dengan memindai QR Code di layar HP Anda.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
