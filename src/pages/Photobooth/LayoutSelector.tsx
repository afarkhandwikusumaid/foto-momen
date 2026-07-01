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
      <div className="bg-white border border-slate-200 p-6 rounded-xl">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Camera className="h-4 w-4 text-slate-800" />
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
                className={`group relative py-3.5 px-4 rounded-lg border transition-colors font-bold text-xs text-center cursor-pointer ${
                  isSelected
                    ? 'border-[#1d90ff] bg-blue-50 text-[#1d90ff]'
                    : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{count} Pose</span>
                {isSelected && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1d90ff] border border-white text-white flex items-center justify-center shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl mt-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Layout className="h-4 w-4 text-slate-800" />
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
                className={`group relative p-3 flex flex-col items-center justify-center text-center rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1d90ff] bg-blue-50 text-[#1d90ff]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-[11px] font-bold">{l.name}</span>
                <span className={`text-[8px] mt-0.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>{l.desc}</span>
                {isSelected && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1d90ff] border border-white text-white flex items-center justify-center shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
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
