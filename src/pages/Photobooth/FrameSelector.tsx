import React, { useState, useEffect } from 'react';
import { Layout, Palette, ArrowRight, Sparkles, Box, Camera, Check } from 'lucide-react';
import { FrameLayout, FrameColor, PhotoCount, BorderStyle } from '../../types';
import { getPosePlaceholder } from './PosePlaceholders';
import { getFrameTemplates } from '../../services/dbService';
import LayoutSelector from './LayoutSelector';
import ThemeSelector from './ThemeSelector';
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
  onPrev: () => void;
}

export const FRAME_COLORS: FrameColor[] = [
  {
    id: 'champagne',
    name: 'Champagne Gold',
    bgClass: 'bg-[#e6dfd5]',
    hex: '#e6dfd5',
    textColor: '#5c4a37',
    borderClass: 'border-stone-300',
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush',
    bgClass: 'bg-[#e8c5c8]',
    hex: '#e8c5c8',
    textColor: '#523639',
    borderClass: 'border-rose-300/40',
  },
  {
    id: 'deep-bronze',
    name: 'Deep Bronze',
    bgClass: 'bg-[#3d3735]',
    hex: '#3d3735',
    textColor: '#c5a880',
    borderClass: 'border-stone-700',
  },
  {
    id: 'ivory',
    name: 'Ivory Cream',
    bgClass: 'bg-[#faf8f6]',
    hex: '#faf8f6',
    textColor: '#2b2625',
    borderClass: 'border-stone-200',
  },
  {
    id: 'terracotta',
    name: 'Warm Clay',
    bgClass: 'bg-[#b38e86]',
    hex: '#b38e86',
    textColor: '#ffffff',
    borderClass: 'border-[#c5a880]/30',
  },
  {
    id: 'sage',
    name: 'Sage Green',
    bgClass: 'bg-[#c5cfc2]',
    hex: '#c5cfc2',
    textColor: '#3a4736',
    borderClass: 'border-stone-350/40',
  },
  {
    id: 'pearl',
    name: 'Soft Pearl',
    bgClass: 'bg-[#f5f2eb]',
    hex: '#f5f2eb',
    textColor: '#c5a880',
    borderClass: 'border-amber-400/20',
  },
  {
    id: 'charcoal',
    name: 'Royal Charcoal',
    bgClass: 'bg-[#21201f]',
    hex: '#21201f',
    textColor: '#e6dfd5',
    borderClass: 'border-stone-850',
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
  onPrev,
}: FrameSelectorProps) {
  
  const [customTemplates, setCustomTemplates] = useState<FrameColor[]>([]);

  useEffect(() => {
    getFrameTemplates().then(data => {
      if (data && data.length > 0) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          bgClass: 'bg-custom',
          hex: t.hex || '#ffffff',
          textColor: t.textColor || '#000000',
          borderClass: t.borderClass || 'border-slate-200',
          imageUrl: t.imageUrl,
          layout: t.layout,
          active: t.active !== false,
          photoCount: t.photoCount || 4,
        }));
        setCustomTemplates(mapped.filter((t: any) => t.active));
      }
    }).catch(console.error);
  }, []);

  const allFrameColors = [
    ...FRAME_COLORS, 
    ...customTemplates.filter(t => !t.layout || t.layout === selectedLayout)
  ];

  // Get padding class based on border thickness setting
  const getBorderPaddingClass = () => {
    if (borderStyle === 'thin') return 'p-2.5';
    if (borderStyle === 'thick') return 'p-6';
    return 'p-4.5'; // classic/medium
  };

  // Render high fidelity preview strip dynamically
  const renderInteractivePreview = () => {
    const paddingClass = getBorderPaddingClass();
    const textColor = selectedColor.textColor;

    if (selectedColor.photoAreas && selectedColor.photoAreas.length > 0) {
      return (
        <div 
          className={`w-[210px] ${paddingClass} flex flex-col items-center border rounded-none bg-white relative aspect-[2/3]`}
          style={{ backgroundColor: selectedColor.hex, borderColor: selectedColor.textColor + '22' }}
        >
          {selectedColor.imageUrl && (
            <img src={selectedColor.imageUrl} alt="Frame" className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" />
          )}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {selectedColor.photoAreas.map((area, idx) => (
              <div 
                key={idx} 
                className="absolute bg-white/30 rounded overflow-hidden flex items-center justify-center shadow-inner"
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`
                }}
              >
                {getPosePlaceholder(idx, "w-full h-full p-1 opacity-50", textColor)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (selectedLayout) {
      case 'vertical-strip':
        return (
          <div 
            className={`w-[170px] ${paddingClass} flex flex-col items-center border rounded-none bg-white`}
            style={{ backgroundColor: selectedColor.hex, borderColor: selectedColor.textColor + '22' }}
          >
            <div className="flex flex-col gap-2 w-full">
              {Array.from({ length: photoCount }).map((_, idx) => (
                <div key={idx} className="aspect-[4/3] bg-white/10 overflow-hidden flex items-center justify-center border border-white/5">
                  {getPosePlaceholder(idx, "w-full h-full p-1.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-display font-bold text-[10px] mt-4 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Foto Momen
            </div>
            <div className="text-[7px] font-mono mt-1 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );

      case 'triple-strip':
        return (
          <div 
            className={`w-[170px] ${paddingClass} flex flex-col items-center border rounded-none bg-white`}
            style={{ backgroundColor: selectedColor.hex, borderColor: selectedColor.textColor + '22' }}
          >
            <div className="flex flex-col gap-2 w-full">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="aspect-[4/3] bg-white/10 overflow-hidden flex items-center justify-center border border-white/5">
                  {getPosePlaceholder(idx + 1, "w-full h-full p-1.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-display font-bold text-[9px] mt-4 tracking-widest uppercase select-none" style={{ color: textColor }}>
              3-Strip Style
            </div>
            <div className="text-[7px] font-mono mt-1 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );

      case 'grid-2x2':
        return (
          <div 
            className={`w-[210px] ${paddingClass} flex flex-col items-center border rounded-none bg-white`}
            style={{ backgroundColor: selectedColor.hex, borderColor: selectedColor.textColor + '22' }}
          >
            <div className="grid grid-cols-2 gap-2 w-full">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="aspect-[4/3] bg-white/10 overflow-hidden flex items-center justify-center border border-white/5">
                  {getPosePlaceholder(idx, "w-full h-full p-1", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-display font-bold text-[11px] mt-4 tracking-wider select-none" style={{ color: textColor }}>
              Grid Collection
            </div>
            <div className="text-[7.5px] font-mono mt-1 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );

      case 'single-polar':
      default:
        return (
          <div 
            className={`w-[210px] ${paddingClass} flex flex-col items-center border rounded-none bg-white`}
            style={{ backgroundColor: selectedColor.hex, borderColor: selectedColor.textColor + '22' }}
          >
            <div className="w-full aspect-[4/3] bg-white/10 overflow-hidden flex items-center justify-center border border-white/5 mb-2">
              {getPosePlaceholder(3, "w-full h-full p-2", textColor)}
            </div>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="aspect-[4/3] bg-white/10 overflow-hidden flex items-center justify-center border border-white/5">
                  {getPosePlaceholder(idx, "w-full h-full p-0.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-display font-bold text-[10px] mt-4 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Polaroid Mini
            </div>
            <div className="text-[7.5px] font-mono mt-1 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in text-slate-800">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-750 shadow-sm">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" /> Langkah 1 dari 3: Kustomisasi Frame
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Rancang Tampilan Cetak Foto Anda
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Sesuaikan layout, palet warna, dan ketebalan border sebelum mulai berpose.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          
          <LayoutSelector 
            photoCount={photoCount}
            onPhotoCountSelect={onPhotoCountSelect}
            selectedLayout={selectedLayout}
            onLayoutSelect={onLayoutSelect}
          />
          
          <ThemeSelector 
            allFrameColors={allFrameColors}
            selectedColor={selectedColor}
            onColorSelect={(color) => {
              onColorSelect(color);
              if ((color as any).photoCount && (color as any).photoCount !== photoCount) {
                onPhotoCountSelect((color as any).photoCount as PhotoCount);
              }
            }}
            borderStyle={borderStyle}
            onBorderStyleSelect={onBorderStyleSelect}
          />

        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <div className="w-full bg-slate-50 flex flex-col items-center justify-center p-6 border border-slate-200 min-h-[460px] rounded-xl">
            {/* Dynamic visual preview */}
            {renderInteractivePreview()}
          </div>
        </div>
      </div>

      {/* Static Bottom Navigation Bar */}
      <div className="mt-12 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            className="flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 px-6 sm:px-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="h-4.5 w-4.5 rotate-180" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <button
            onClick={onNext}
            className="flex-1 sm:flex-none sm:min-w-[280px] flex items-center justify-center gap-3 rounded-lg bg-[#1d90ff] hover:bg-blue-600 text-white py-3 px-8 text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <span>Lanjut Ke Kamera</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
