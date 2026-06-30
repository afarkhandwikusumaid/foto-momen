import React from 'react';
import { Camera, Layout, Check } from 'lucide-react';
import { PhotoCount, FrameLayout } from '../../types';

interface LayoutSelectorProps {
  photoCount: PhotoCount;
  onPhotoCountSelect: (c: PhotoCount) => void;
  selectedLayout: FrameLayout;
  onLayoutSelect: (l: FrameLayout) => void;
}

export default function LayoutSelector({
  photoCount, onPhotoCountSelect,
  selectedLayout, onLayoutSelect
}: LayoutSelectorProps) {
  return (
    <>
      {/* Jumlah Foto */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Camera className="h-4.5 w-4.5 text-[#ff007f]" />
          1. Jumlah Pose Sesi Ini
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[2, 3, 4].map((count) => {
            const isSelected = photoCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => onPhotoCountSelect(count as PhotoCount)}
                className={`group relative py-4 px-4 rounded-2xl border-2 transition-all font-extrabold text-xs text-center cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm font-black'
                    : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                }`}
              >
                <span>{count} Pose</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow animate-pulse">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Layout className="h-4.5 w-4.5 text-[#1d90ff]" />
          2. Pilihan Tata Letak (Layout)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'vertical-strip', name: 'Vertical Strip', desc: 'Klasik' },
            { id: 'triple-strip', name: '3-Strip Classic', desc: 'Premium' },
            { id: 'grid-2x2', name: '2x2 Grid', desc: 'Grid Rapi' },
            { id: 'single-polar', name: 'Polaroid Style', desc: 'Mini Custom' }
          ].map((l) => {
            const isSelected = selectedLayout === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLayoutSelect(l.id as FrameLayout)}
                className={`group relative p-3 flex flex-col items-center justify-center text-center rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-blue-800 shadow-sm font-black'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-800">{l.name}</span>
                <span className="text-[8px] text-slate-400 mt-0.5">{l.desc}</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow animate-pulse">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
