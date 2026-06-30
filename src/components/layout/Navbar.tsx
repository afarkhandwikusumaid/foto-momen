import React from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { ActivePhase } from '../../types';

interface NavbarProps {
  currentPhase: ActivePhase;
  onReset: () => void;
  activeTab: 'home' | 'catalog';
  setActiveTab: (tab: 'home' | 'catalog') => void;
  onStartBooth: () => void;
}

export default function Navbar({ currentPhase, onReset, activeTab, setActiveTab, onStartBooth }: NavbarProps) {
  const handleNavClick = (tab: 'home' | 'catalog', e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    if (currentPhase !== 'landing') {
      onReset();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 select-none">
      <div className="mx-auto max-w-5xl bg-white/85 backdrop-blur-md rounded-full border border-slate-200/80 px-4 py-2 shadow-sm flex items-center justify-between transition-all duration-300">
        
        {/* Left Side: Brand Logo */}
        <div 
          onClick={(e) => { onReset(); setActiveTab('home'); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="h-8.5 w-8.5 rounded-full bg-[#1d90ff] flex items-center justify-center shadow-md shadow-blue-500/10">
            <Camera className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-800 text-sm tracking-tight hover:text-[#1d90ff] transition">
            Foto Momen
          </span>
        </div>

        {/* Center: Capsule-based Navigation Tabs */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black">
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

        {/* Right Side: Action Button */}
        <div className="flex items-center gap-3">
          {currentPhase !== 'landing' ? (
            <button
              onClick={() => { onReset(); setActiveTab('home'); }}
              className="flex items-center gap-1.5 rounded-full bg-[#1d90ff] hover:bg-blue-650 text-white px-4 py-2 text-xs font-bold shadow-sm cursor-pointer transition active:scale-98"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Kembali Ke Home</span>
            </button>
          ) : (
            <button
              onClick={onStartBooth}
              className="flex items-center gap-1.5 rounded-full bg-[#1d90ff] hover:bg-blue-650 text-white px-4 py-2 text-xs font-bold shadow-sm cursor-pointer transition active:scale-98"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Mulai Foto</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
