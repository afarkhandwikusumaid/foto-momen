import React from 'react';
import { ImageIcon, Users, Settings } from 'lucide-react';

interface StatsProps {
  stats: {
    totalPhotos: number;
    totalBookings: number;
    activeTemplates: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      
      <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#faf8f6] border border-[#e6dfd5] text-[#c5a880] flex items-center justify-center shadow-inner">
          <ImageIcon className="h-5.5 w-5.5" />
        </div>
        <div>
          <span className="text-stone-450 text-[10px] font-bold uppercase tracking-wider block">Foto Dicetak</span>
          <span className="text-xl font-black text-stone-900 mt-0.5 block">{stats.totalPhotos} Kali</span>
        </div>
      </div>
      
      <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#faf8f6] border border-[#e6dfd5] text-[#c5a880] flex items-center justify-center shadow-inner">
          <Users className="h-5.5 w-5.5" />
        </div>
        <div>
          <span className="text-stone-450 text-[10px] font-bold uppercase tracking-wider block">Booking Masuk</span>
          <span className="text-xl font-black text-stone-900 mt-0.5 block">{stats.totalBookings} Booking</span>
        </div>
      </div>

      <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#faf8f6] border border-[#e6dfd5] text-[#c5a880] flex items-center justify-center shadow-inner">
          <Settings className="h-5.5 w-5.5" />
        </div>
        <div>
          <span className="text-stone-450 text-[10px] font-bold uppercase tracking-wider block">Preset Warna</span>
          <span className="text-xl font-black text-stone-900 mt-0.5 block">{stats.activeTemplates} Tema</span>
        </div>
      </div>

    </div>
  );
}
