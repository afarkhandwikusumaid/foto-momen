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
      <div className="bg-white border border-slate-200 p-6 rounded-xl mt-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Palette className="h-4 w-4 text-slate-800" />
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
                className={`relative flex items-center gap-2.5 p-3 rounded-lg border transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'border-[#1d90ff] bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div 
                  className={`h-5 w-5 rounded-md border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 bg-slate-100`} 
                  style={!color.imageUrl ? { backgroundColor: color.hex } : undefined} 
                >
                  {color.imageUrl ? (
                    <img src={color.imageUrl} alt={color.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <span className="text-[11px] font-bold text-slate-700 truncate">{color.name}</span>
                
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

      {/* Ketebalan Frame */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl mt-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 mb-4 select-none uppercase tracking-wider">
          <Box className="h-4 w-4 text-slate-800" />
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
                className={`relative py-3 px-2 rounded-lg border transition-colors font-bold text-center text-[10px] cursor-pointer ${
                  isSelected
                    ? 'border-[#1d90ff] bg-blue-50 text-[#1d90ff]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span>{style.name}</span>
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
