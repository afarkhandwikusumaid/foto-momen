import React from 'react';
import { Camera, Sparkles, Wand2 } from 'lucide-react';
import { getPosePlaceholder } from '../Photobooth/PosePlaceholders';

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-transparent py-16 md:py-24 select-none">
      
      {/* Decorative Glow Blob Background */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: Typography & Action Buttons */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 px-4 py-2 text-xs font-black text-blue-600 shadow-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            <span className="uppercase tracking-widest text-[10px]">
              Platform Photobooth Modern
            </span>
          </div>

          <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            <span className="block text-slate-900">Abadikan Momen</span>
            <span className="block bg-gradient-to-r from-blue-600 via-[#1d90ff] to-purple-600 bg-clip-text text-transparent pb-2 pt-1 animate-gradient">
              Virtual Estetik
            </span>
            <span className="block text-slate-900">Di Sini.</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Foto Momen menghadirkan pengalaman photobooth interaktif langsung dari browser Anda. Poles dengan <strong>AI Beauty Retouch</strong>, stiker lucu, dan bagikan cetakan digital secara instan!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4 lg:py-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5 text-blue-400" />
              Mulai Foto Sekarang
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Wand2 className="w-4 h-4 text-purple-400" /> 100% Gratis
            </div>
          </div>
        </div>
        
        {/* Right Side: Round-Backdrop Character Illustration */}
        <div className="lg:col-span-5 flex justify-center items-center relative mt-8 lg:mt-0">
          
          <div className="relative w-full max-w-[380px] aspect-square bg-[#1d90ff] border border-white rounded-[60px] flex items-center justify-center p-6 shadow-2xl shadow-blue-900/10 ">
            
            {/* Background Decorative Rings */}
            <div className="absolute inset-4 border border-white/60 rounded-[50px] pointer-events-none" />

            {/* Minimalist Floating Polaroid 1 */}
            <div className="absolute bg-white/90 backdrop-blur-md p-4 rounded-[28px] shadow-2xl border border-white rotate-[-8deg] w-[160px] left-2 sm:left-4 top-10 hover:rotate-[-4deg] hover:-translate-y-2 transition-all duration-500">
              <div className="w-full aspect-[4/3] bg-gradient-to-tr from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                {getPosePlaceholder(0, "w-full h-full p-2 text-blue-500", "#1d90ff")}
              </div>
              <div className="text-center font-black text-[10px] text-slate-800 mt-4 tracking-widest font-sans uppercase">
                Happy
              </div>
            </div>

            {/* Minimalist Floating Polaroid 2 */}
            <div className="absolute bg-white/90 backdrop-blur-md p-4 rounded-[28px] shadow-2xl border border-white rotate-[12deg] w-[160px] right-2 sm:right-4 bottom-10 hover:rotate-[8deg] hover:-translate-y-2 transition-all duration-500 z-10">
              <div className="w-full aspect-[4/3] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                {getPosePlaceholder(1, "w-full h-full p-2 text-purple-500", "#a855f7")}
              </div>
              <div className="text-center font-black text-[10px] text-slate-800 mt-4 tracking-widest font-sans uppercase">
                Memories
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
