import React, { useState } from 'react';
import { Camera, RefreshCw, Menu, X } from 'lucide-react';
import { ActivePhase } from '../../types';

interface NavbarProps {
  currentPhase: ActivePhase;
  onReset: () => void;
  activeTab: 'home' | 'catalog';
  setActiveTab: (tab: 'home' | 'catalog') => void;
  onStartBooth: () => void;
}

export default function Navbar({ currentPhase, onReset, activeTab, setActiveTab, onStartBooth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'catalog', e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (currentPhase !== 'landing') {
      onReset();
    }
  };

  const isLanding = currentPhase === 'landing';

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 sm:py-6 select-none">
      <div className="w-full mx-auto max-w-5xl bg-white/90 backdrop-blur-xl rounded-[28px] sm:rounded-full border border-slate-200/80 p-2 sm:px-4 sm:py-2.5 shadow-lg shadow-slate-200/50 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Left Side: Brand Logo */}
          <div 
            onClick={(e) => { 
              if (e.detail === 3) {
                window.location.href = '/admin';
                return;
              }
              onReset(); 
              if (setActiveTab) setActiveTab('home'); 
              setMobileMenuOpen(false); 
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-[#1d90ff] flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Camera className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight hover:text-[#1d90ff] transition hidden sm:inline-block">
              Foto Momen
            </span>
          </div>

          {/* Center: Desktop Navigation Tabs (Only in Landing) */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] sm:text-xs font-black">
              <a 
                href="#" 
                onClick={(e) => handleNavClick('home', e)} 
                className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                  activeTab === 'home' 
                    ? 'bg-blue-50 border border-blue-100 text-[#1d90ff]' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                Beranda
              </a>
              <a 
                href="#" 
                onClick={(e) => handleNavClick('catalog', e)} 
                className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
                  activeTab === 'catalog' 
                    ? 'bg-blue-50 border border-blue-100 text-[#1d90ff]' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                Katalog Tema
              </a>
            </div>
          )}

          {/* Right Side: Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {!isLanding ? (
              <button
                onClick={() => { onReset(); setActiveTab('home'); }}
                className="flex items-center gap-1.5 rounded-full bg-[#1d90ff] hover:bg-blue-600 text-white px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline-block">Kembali Ke Home</span>
                <span className="sm:hidden">Home</span>
              </button>
            ) : (
              <button
                onClick={onStartBooth}
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#1d90ff] hover:bg-blue-600 text-white px-5 py-2.5 text-xs font-extrabold shadow-md shadow-blue-500/20 cursor-pointer transition-all active:scale-95"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Mulai Foto</span>
              </button>
            )}

            {/* Mobile Menu Toggle (Only in Landing) */}
            {isLanding && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown (Only in Landing) */}
        {isLanding && mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex gap-1 md:gap-4 ml-8 border-l border-slate-200 pl-4 md:pl-8 flex-1 md:flex-none justify-center">
              <button 
                onClick={() => {
                  onReset();
                  if(setActiveTab) setActiveTab('home');
                }}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'home' ? 'bg-[#1d90ff] text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                Beranda
              </button>
              <button 
                onClick={() => {
                  onReset();
                  if(setActiveTab) setActiveTab('catalog');
                }}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'catalog' ? 'bg-[#1d90ff] text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                Katalog
              </button>
            </div>
              <button
                onClick={() => { onStartBooth(); setMobileMenuOpen(false); }}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-[#1d90ff] text-white px-4 py-3.5 text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all w-full"
              >
                <Camera className="h-4 w-4" />
                <span>Mulai Foto Sekarang</span>
              </button>
          </div>
        )}

      </div>
    </header>
  );
}
