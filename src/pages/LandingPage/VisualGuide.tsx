import React from 'react';
import { Camera, Layout, Download, Grid } from 'lucide-react';

export default function VisualGuide() {
  return (
    <section className="py-12 border-t border-slate-100">
      <div className="text-center max-w-xl mx-auto mb-10 select-none">
        <span className="text-[10px] text-[#1d90ff] font-bold px-3 py-1 bg-blue-50 border border-blue-100 rounded-full inline-block uppercase tracking-wider">
          Panduan
        </span>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">
          Bagaimana Cara Kerjanya?
        </h2>
        <p className="text-slate-500 text-xs mt-2">
          Hanya butuh tiga langkah mudah untuk mengabadikan dan mencetak fotomu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-[32px] text-left space-y-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 text-[#1d90ff] flex items-center justify-center">
            <Layout className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-850">1. Atur Frame</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pilih rasio layout strip, tebal border, dan warna latar frame pastel yang cocok dengan gayamu.
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-[32px] text-left space-y-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 text-[#1d90ff] flex items-center justify-center">
            <Camera className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-850">2. Ambil Pose</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nyalakan webcam dan ikuti panduan pose. Kamera akan memotret secara otomatis sesuai jeda waktu.
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-[32px] text-left space-y-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 text-[#1d90ff] flex items-center justify-center">
            <Download className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-850">3. Unduh & Bagikan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Terapkan live filter, unduh hasil fotomu dalam format gambar atau video, dan bagikan dengan praktis via QR Code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
