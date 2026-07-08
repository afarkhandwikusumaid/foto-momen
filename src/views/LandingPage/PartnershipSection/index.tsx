import React from 'react';
import { Briefcase, Mail, MessageCircle, ArrowRight, QrCode, Sparkles, MapPin, Clock, Phone, PhoneCall, PhoneOff, User } from 'lucide-react';
import { getPosePlaceholder } from '../../Photobooth/PosePlaceholders';

export default function PartnershipSection() {
  return (
    <section className="w-full premium-glass rounded-[32px] border border-blue-100 p-6 sm:p-10 shadow-xl overflow-hidden relative mt-16 mb-16">
      
      {/* Background Decorative Cobalt Blue Circles (Inspired by Level Slide 8) */}
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-brand-blue rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-10" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: Strategic Info & Partnership Offer (Inspired by Slide 8 "Contact Us!") */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 px-4 py-2 text-xs font-bold text-brand-blue shadow-sm">
            <Briefcase className="h-4 w-4 text-brand-blue" />
            <span className="uppercase tracking-widest text-[9px]">
              Kemitraan B2B & Event
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Hubungi Kami!<br />
            <span className="bg-gradient-to-r from-blue-600 via-brand-blue to-purple-600 bg-clip-text text-transparent pb-1 pt-1 animate-gradient relative inline-block mt-1">
              Contact Us for Partnership
            </span>
          </h3>

          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl font-semibold">
            Ingin menghadirkan pengalaman photobooth interaktif berlogo sekolah, kelas, atau event Anda? Hubungi kami untuk aktivasi instan link kustom!
          </p>

          {/* Contact Details List with circular icons (Inspired by Slide 8) */}
          <div className="space-y-4 pt-4">
            
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                <MessageCircle className="h-5 w-5 fill-white/10" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Chat</p>
                <a 
                  href="https://wa.me/6285944629716?text=Halo%20Foto%20Momen,%20saya%20tertarik%20untuk%20kerjasama%20kemitraan%20event/yearbook."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-extrabold text-slate-800 hover:text-brand-blue transition-colors"
                >
                  0859-4462-9716
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Kemitraan</p>
                <a 
                  href="mailto:halo@fotomomen.com?subject=Tanya%20Kemitraan%20Foto%20Momen"
                  className="text-sm font-extrabold text-slate-800 hover:text-brand-blue transition-colors"
                >
                  halo@fotomomen.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proses Setup Cepat</p>
                <p className="text-sm font-extrabold text-slate-800">
                  Aktif dalam 1x24 jam setelah diskusi
                </p>
              </div>
            </div>

          </div>

          <div className="pt-6">
            <a
              href="https://wa.me/6285944629716?text=Halo%20Foto%20Momen,%20saya%20tertarik%20untuk%20kerjasama%20kemitraan%20event/yearbook."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 text-sm font-extrabold shadow-lg shadow-brand-blue/25 transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Mulai Kolaborasi
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Right Side: Mockup HP over a Blue Solid Sphere/Wave (Inspired by Slide 8) */}
        <div className="lg:col-span-5 flex justify-center items-center mt-8 lg:mt-0 select-none relative min-h-[480px]">
          
          {/* Large Solid Blue Backdrop Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] bg-brand-blue rounded-full -z-10" />

          <div className="relative w-[230px] h-[460px] rounded-[44px] border-[8px] border-slate-950 bg-slate-950 z-10 rotate-[2deg] hover:rotate-0 transition-transform duration-500 ring-4 ring-slate-900/5">
            
            {/* Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-40" />

            {/* Screen Content - Calling Foto Momen UI (Inspired by Slide 8 Contact) */}
            <div className="w-full h-full bg-slate-900 relative flex flex-col pt-10 pb-8 px-4 overflow-hidden rounded-[36px] text-white">
              
              {/* Inside Screen Header / Status */}
              <div className="text-center space-y-1.5 mb-6">
                <div className="flex justify-center items-center gap-1.5 animate-pulse">
                  <img src="/fm-logo-text.png" alt="Foto Momen" className="h-3 w-auto object-contain brightness-0 invert" />
                  <span className="text-[6px] font-black text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded uppercase tracking-wider">Partner</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Incoming Call...</p>
              </div>

              {/* Central Pulsing Avatar Profile */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  {/* Pulsing ring background */}
                  <div className="absolute inset-0 rounded-full bg-brand-blue/30 scale-125 animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-brand-blue flex items-center justify-center text-white border-2 border-white/20 relative shadow-xl">
                    <PhoneCall className="w-9 h-9 text-white" />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <img src="/fm-logo-text.png" alt="Foto Momen" className="h-5 w-auto object-contain mx-auto brightness-0 invert" />
                  <p className="text-[9px] font-semibold text-slate-400 mt-1">Event & Yearbook Team</p>
                </div>
                
                {/* Active connecting details */}
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl py-2 px-3 text-center max-w-[160px] shadow-sm">
                  <span className="text-[8px] font-bold text-slate-300 block">PROSES SETUP</span>
                  <span className="text-[9px] font-extrabold text-brand-blue block mt-0.5">1x24 Jam Link Aktif</span>
                </div>
              </div>

              {/* Bottom Phone Action Buttons (Decline / Accept sliders simulation) */}
              <div className="flex items-center justify-around px-2 pt-4">
                
                {/* Decline Button */}
                <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/20 active:scale-95 transition-all">
                    <PhoneOff className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">Decline</span>
                </div>

                {/* Accept Button */}
                <a 
                  href="https://wa.me/6285944629716?text=Halo%20Foto%20Momen,%20saya%20tertarik%20untuk%20kerjasama%20kemitraan%20event/yearbook."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/20 active:scale-95 transition-all hover:scale-105">
                    <Phone className="w-5 h-5 text-white fill-white/10" />
                  </div>
                  <span className="text-[7px] font-bold text-emerald-400 uppercase tracking-wider">Accept</span>
                </a>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
