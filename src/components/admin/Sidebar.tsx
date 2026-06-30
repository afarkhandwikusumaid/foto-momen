import React from 'react';
import { BarChart3, Palette, Sliders, Smile, Calendar, LogOut, Database } from 'lucide-react';
import { TabType } from './AdminPanel';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'templates' as TabType, label: 'Manajemen Tema', icon: Palette },
    { id: 'backdrops' as TabType, label: 'Manajemen Backdrop', icon: Sliders },
    { id: 'stickers-fonts' as TabType, label: 'Stiker & Font', icon: Smile },
    { id: 'bookings' as TabType, label: 'Reservasi Event', icon: Calendar },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-[#1c182b] text-slate-300 fixed left-0 top-0 z-50 border-r border-slate-800/50 shadow-2xl">
      
      {/* Brand Header */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/5 select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-[13px] tracking-wide leading-tight">Admin Portal</span>
            <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Foto Momen</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-left ${
                isActive 
                  ? 'bg-purple-500/20 text-white font-bold' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-4 select-none">
          <div className="h-9 w-9 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[11px] text-white shadow-lg">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-white">Administrator</span>
            <span className="text-[9px] text-slate-500 font-medium">admin@fotomomen.com</span>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-left text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs">Logout</span>
        </button>
      </div>

    </aside>
  );
}
