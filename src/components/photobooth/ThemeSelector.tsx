import React from 'react';
import { Palette, Box, Check } from 'lucide-react';
import { FrameColor, BorderStyle } from '../../types';

interface ThemeSelectorProps {
  allFrameColors: FrameColor[];
  selectedColor: FrameColor;
  onColorSelect: (c: FrameColor) => void;
  borderStyle: BorderStyle;
  onBorderStyleSelect: (b: BorderStyle) => void;
}

export default function ThemeSelector({
  allFrameColors,
  selectedColor,
  onColorSelect,
  borderStyle,
  onBorderStyleSelect
}: ThemeSelectorProps) {
  return (
    <>
      {/* Warna Frame */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Palette className="h-4.5 w-4.5 text-[#ff007f]" />
          3. Palet Warna Frame
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allFrameColors.map((color) => {
            const isSelected = selectedColor.id === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onColorSelect(color)}
                className={`group relative flex items-center gap-2.5 p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-blue-800 shadow-sm font-black'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div 
                  className={`h-6 w-6 rounded-lg shadow-inner border transition group-hover:scale-105 ${color.borderClass} flex items-center justify-center overflow-hidden shrink-0 bg-slate-100`} 
                  style={!color.imageUrl ? { backgroundColor: color.hex } : undefined} 
                >
                  {color.imageUrl ? (
                    <img src={color.imageUrl} alt={color.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <span className="text-[11px] font-bold text-slate-700 truncate">{color.name}</span>
                
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

      {/* Ketebalan Frame */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Box className="h-4.5 w-4.5 text-[#1d90ff]" />
          4. Ketebalan Border Frame
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'thin', name: 'Tipis (Thin)' },
            { id: 'classic', name: 'Medium (Classic)' },
            { id: 'thick', name: 'Tebal (Thick)' }
          ].map((style) => {
            const isSelected = borderStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onBorderStyleSelect(style.id as BorderStyle)}
                className={`group relative py-3 px-2 rounded-2xl border-2 transition-all font-extrabold text-center text-[10px] cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-blue-800 shadow-sm font-black'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span>{style.name}</span>
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
