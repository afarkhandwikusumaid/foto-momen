import React from 'react';
import { TabType } from './AdminPanel';
import { BarChart3, Palette, Sliders, Smile, Calendar, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onBackToHome: () => void;
}

export default function Header({ activeTab, setActiveTab, onBackToHome }: HeaderProps) {
  const getBreadcrumb = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'templates': return 'Manajemen Tema';
      case 'backdrops': return 'Manajemen Backdrop';
      case 'stickers-fonts': return 'Stiker & Font';
      case 'bookings': return 'Reservasi Event';
      default: return '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full">
      {/* Desktop & Mobile Header Bar */}
      <div className="h-[72px] px-6 flex items-center justify-between w-full">
        
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-4 select-none">
          <button 
            onClick={onBackToHome}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors cursor-pointer"
            title="Kembali ke Web Profile"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right: Status & Profile */}
        <div className="flex items-center gap-4 select-none">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-700">Online</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[10px] text-white shadow-sm ring-2 ring-white cursor-pointer hover:ring-purple-200 transition-all">
            A
          </div>
        </div>
      </div>

      {/* Mobile-only Navigation Tabs (Scrollable horizontal row) */}
      <div className="lg:hidden w-full flex overflow-x-auto border-t border-slate-100 px-4 py-2 gap-2 hide-scrollbar bg-slate-50">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'templates', label: 'Tema', icon: Palette },
          { id: 'backdrops', label: 'Backdrop', icon: Sliders },
          { id: 'stickers-fonts', label: 'Stiker', icon: Smile },
          { id: 'bookings', label: 'Reservasi', icon: Calendar },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
