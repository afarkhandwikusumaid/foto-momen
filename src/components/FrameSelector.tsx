import React from 'react';
import { Layout, Palette, ArrowRight, Sparkles, Box, Camera } from 'lucide-react';
import { FrameLayout, FrameColor, PhotoCount, BorderStyle } from '../types';

interface FrameSelectorProps {
  selectedLayout: FrameLayout;
  onLayoutSelect: (layout: FrameLayout) => void;
  selectedColor: FrameColor;
  onColorSelect: (color: FrameColor) => void;
  photoCount: PhotoCount;
  onPhotoCountSelect: (count: PhotoCount) => void;
  borderStyle: BorderStyle;
  onBorderStyleSelect: (style: BorderStyle) => void;
  onNext: () => void;
}

export const FRAME_COLORS: FrameColor[] = [
  {
    id: 'white',
    name: 'Pure White',
    bgClass: 'bg-white',
    hex: '#ffffff',
    textColor: '#0f172a',
    borderClass: 'border-slate-200',
  },
  {
    id: 'navy',
    name: 'Deep Navy',
    bgClass: 'bg-blue-950',
    hex: '#0a1628',
    textColor: '#93c5fd', // blue-300
    borderClass: 'border-blue-800',
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    bgClass: 'bg-blue-800',
    hex: '#1a3a6b',
    textColor: '#dbeafe', // blue-100
    borderClass: 'border-blue-600',
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    bgClass: 'bg-sky-200',
    hex: '#bae6fd',
    textColor: '#0c4a6e', // sky-900
    borderClass: 'border-sky-300',
  },
  {
    id: 'ice-blue',
    name: 'Ice Blue',
    bgClass: 'bg-blue-100',
    hex: '#dbeafe',
    textColor: '#1e3a8a', // blue-900
    borderClass: 'border-blue-200',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bgClass: 'bg-slate-900',
    hex: '#0f172a',
    textColor: '#60a5fa', // blue-400
    borderClass: 'border-slate-700',
  },
  {
    id: 'steel',
    name: 'Steel',
    bgClass: 'bg-slate-400',
    hex: '#94a3b8',
    textColor: '#0f172a',
    borderClass: 'border-slate-500',
  },
  {
    id: 'gold-navy',
    name: 'Navy & Gold',
    bgClass: 'bg-blue-900',
    hex: '#1e3a8a',
    textColor: '#fbbf24', // amber-400 (emas)
    borderClass: 'border-amber-400',
  },
];

export default function FrameSelector({
  selectedLayout,
  onLayoutSelect,
  selectedColor,
  onColorSelect,
  photoCount,
  onPhotoCountSelect,
  borderStyle,
  onBorderStyleSelect,
  onNext,
}: FrameSelectorProps) {

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in text-slate-800">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Langkah 1 dari 3: Kustomisasi Frame
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Pilih Gaya dan Warna Frame-mu
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          
          {/* Jumlah Foto */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800 mb-4 select-none">
              <Camera className="h-4.5 w-4.5 text-blue-600" />
              1. Jumlah Foto Sesi Ini
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onPhotoCountSelect(count as PhotoCount)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-center cursor-pointer ${
                    photoCount === count
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-650 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {count} Pose
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800 mb-4 select-none">
              <Layout className="h-4.5 w-4.5 text-blue-600" />
              2. Tata Letak (Layout)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'vertical-strip', name: 'Vertical Strip', desc: 'Klasik Memanjang' },
                { id: 'triple-strip', name: '3-Strip Classic', desc: 'Ikonik Premium' },
                { id: 'grid-2x2', name: '2x2 Grid', desc: 'Kotak Rapi' },
                { id: 'single-polar', name: 'Polaroid', desc: '1 Besar + 3 Kecil' }
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onLayoutSelect(l.id as FrameLayout)}
                  className={`p-3 flex flex-col items-center justify-center text-center rounded-xl border-2 transition-all cursor-pointer ${
                    selectedLayout === l.id
                      ? 'border-blue-600 bg-blue-50 text-blue-750 shadow-sm'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800">{l.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Warna Frame */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800 mb-4 select-none">
              <Palette className="h-4.5 w-4.5 text-blue-600" />
              3. Warna Frame
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FRAME_COLORS.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onColorSelect(color)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div 
                      className={`h-6 w-6 rounded-md shadow-sm border ${color.borderClass}`} 
                      style={{ backgroundColor: color.hex }} 
                    />
                    <span className="text-xs font-bold text-slate-700">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ketebalan Frame */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800 mb-4 select-none">
              <Box className="h-4.5 w-4.5 text-blue-600" />
              4. Ketebalan Frame (Border)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'thin', name: 'Tipis (Thin)' },
                { id: 'classic', name: 'Medium (Classic)' },
                { id: 'thick', name: 'Tebal (Thick)' }
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onBorderStyleSelect(style.id as BorderStyle)}
                  className={`py-3 px-2 rounded-xl border-2 transition-all font-bold text-center text-xs cursor-pointer ${
                    borderStyle === style.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-650 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-slate-100/60 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 shadow-inner min-h-[460px]">
            {/* Simple mock display just to give user idea */}
            <div 
              className={`border-2 ${selectedColor.borderClass} shadow-2xl transition-all p-3 flex flex-col items-center justify-center`}
              style={{ backgroundColor: selectedColor.hex, width: '180px', height: '280px' }}
            >
              <div 
                className="w-full h-full border border-dashed border-slate-350 bg-white/80 flex items-center justify-center flex-col text-center rounded p-2"
              >
                <span className="font-bold text-sm" style={{ color: selectedColor.textColor }}>{selectedColor.name}</span>
                <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase font-mono">{selectedLayout}</span>
                <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase font-mono">{photoCount} Poses</span>
                <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase border border-slate-300 rounded px-1.5 py-0.5 mt-2 font-mono">{borderStyle}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onNext}
            className="group w-full mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 text-base font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] hover:shadow-blue-600/40 cursor-pointer transition-all"
          >
            <span>Lanjut Ke Kamera</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
