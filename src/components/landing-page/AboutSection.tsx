import React from 'react';
import { Shield, Sparkles, Smartphone, Heart } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-12 border-t border-slate-100">
      <div className="text-center max-w-xl mx-auto mb-10 select-none">
        <span className="text-[10px] text-[#1d90ff] font-bold px-3 py-1 bg-blue-50 border border-blue-100 rounded-full inline-block uppercase tracking-wider">
          Tentang Kami
        </span>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">
          Kenalan dengan Foto Momen
        </h2>
        <p className="text-slate-500 text-xs mt-2">
          Platform photobooth virtual pintar yang merangkum kenangan bahagiamu secara instan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Brief Info Text */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">
            Studio Fotografi Pintar di Saku Anda
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Foto Momen hadir sebagai solusi photobooth modern yang memadukan kepraktisan teknologi web dengan hasil estetik berkualitas tinggi. Kami percaya setiap tawa, pose konyol, dan senyuman di hari spesial Anda layak untuk diabadikan dan dibagikan dengan mudah.
          </p>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Baik digunakan secara online gratis sebagai hiburan mandiri, maupun diintegrasikan langsung sebagai fasilitas booth fisik di acara pesta pernikahan, ulang tahun, atau perayaan kelulusan Anda.
          </p>
        </div>

        {/* Right Side: Simple Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 border border-slate-200 rounded-[24px] bg-white space-y-2">
            <Smartphone className="w-5 h-5 text-[#1d90ff]" />
            <h4 className="font-bold text-xs text-slate-850">Akses Web Instan</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Tanpa unduh aplikasi. Buka browser di ponsel, tablet, atau laptop dan langsung jepret.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-[24px] bg-white space-y-2">
            <Sparkles className="w-5 h-5 text-[#1d90ff]" />
            <h4 className="font-bold text-xs text-slate-850">Tema Kustom Kreatif</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Ubah latar belakang frame, layout kolase, filter retro, serta tambahkan emoji sesukamu.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-[24px] bg-white space-y-2">
            <Shield className="w-5 h-5 text-[#1d90ff]" />
            <h4 className="font-bold text-xs text-slate-850">Penyimpanan Cloud</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Unduh cetakan foto secara aman atau bagikan ke teman lewat scan QR Code instan.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-[24px] bg-white space-y-2">
            <Heart className="w-5 h-5 text-[#1d90ff]" />
            <h4 className="font-bold text-xs text-slate-850">Layanan Fisik Event</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Dukungan setup kamera DSLR, studio lightning, printer cetak, & operator handal di lokasi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
