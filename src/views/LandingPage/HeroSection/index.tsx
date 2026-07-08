import React from 'react';
import { Camera, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { getPosePlaceholder } from '../../Photobooth/PosePlaceholders';

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-transparent pt-4 sm:pt-6 pb-6 sm:pb-8 select-none">
      
      {/* Decorative Glow Blob Backgrounds */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center relative z-10">
        
        {/* Left Side: Typography & Action Buttons (Inspired by "Make Pay Go Further") */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left order-2 lg:order-1 mt-6 lg:mt-0">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue animate-pulse" />
            <span className="uppercase tracking-widest text-[9px]">
              Aplikasi Photobooth Virtual Terbaik
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
            Abadikan <span className="text-brand-blue">Momen</span><br />
            <span className="bg-gradient-to-r from-blue-600 via-brand-blue to-purple-600 bg-clip-text text-transparent pb-1 pt-1 animate-gradient inline-block">
              Virtual Aesthetic
            </span><br />
            Di Sini.
          </h1>

          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-semibold">
            Foto Momen menghadirkan pengalaman photobooth interaktif berkecepatan tinggi langsung dari browser Anda. Lengkap dengan filter estetik dan cetak foto instan!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-sm rounded-full hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-blue-200" />
              Mulai Foto Sekarang
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex items-center gap-2 text-xs font-black text-slate-400">
              <Wand2 className="w-4 h-4 text-purple-400" /> 100% GRATIS & TANPA INSTALASI
            </div>
          </div>
        </div>
        
        {/* Right Side: Phone Mockup over a Large Cobalt Blue Circle (Inspired by Level Home Slide) */}
        <div className="lg:col-span-5 flex justify-center items-center relative mb-6 lg:mb-0 min-h-[460px] order-1 lg:order-2">
          
          {/* Large Cobalt Blue Circular Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] bg-brand-blue rounded-full -z-10 flex items-center justify-center overflow-hidden">
            {/* Soft decorative inner circles */}
            <div className="absolute inset-8 border border-white/10 rounded-full" />
            <div className="absolute inset-20 border border-white/5 rounded-full" />
          </div>

          {/* Realistic CSS Phone Mockup */}
          <div className="relative w-[230px] h-[460px] rounded-[44px] border-[8px] border-slate-950 bg-slate-950 z-10 rotate-[4deg] hover:rotate-0 transition-transform duration-500 flex-shrink-0">
            
            {/* Notch/Camera Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30" />

            {/* Screen Content */}
            <div className="w-full h-full bg-[#f8fafc] relative flex flex-col pt-7 pb-4 px-2.5 overflow-hidden rounded-[36px]">
              
              {/* Inside Screen Navbar */}
              <div className="flex items-center justify-between px-1 mb-2">
                <img src="/fm-logo-text.png" alt="Foto Momen" className="h-3.5 w-auto object-contain" />
                <span className="text-[7px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>

              {/* Photo Frame Container */}
              <div className="flex-1 bg-white border border-slate-200/80 rounded-xl p-2 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:8px_8px]" />
                
                {/* Photo grid inside frame */}
                <div className="grid grid-cols-2 gap-1.5 h-[80%] z-10">
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(0, "w-8 h-8 text-brand-blue opacity-80", "#2563eb")}
                  </div>
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(1, "w-8 h-8 text-purple-500 opacity-80", "#a855f7")}
                  </div>
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(2, "w-8 h-8 text-emerald-500 opacity-80", "#10b981")}
                  </div>
                  <div className="bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200/50">
                    {getPosePlaceholder(3, "w-8 h-8 text-pink-500 opacity-80", "#ec4899")}
                  </div>
                </div>

                {/* Frame logo branding bottom */}
                <div className="bg-slate-900 text-white rounded-lg py-1.5 px-0.5 text-center z-10 relative shadow flex items-center justify-center min-h-[22px]">
                  <img src="/fm-logo-text.png" alt="Foto Momen" className="h-3 w-auto object-contain brightness-0 invert" />
                </div>
              </div>

              {/* Bottom Camera Action Button Simulation */}
              <div className="mt-3 flex items-center justify-center gap-3 px-1 z-20">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <Wand2 className="w-3.5 h-3.5" />
                </div>
                <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
