import React from 'react';
import { Sparkles } from 'lucide-react';

interface BeautySlidersProps {
  brightness: number;
  setBrightness: (v: number) => void;
  contrast: number;
  setContrast: (v: number) => void;
  saturation: number;
  setSaturation: (v: number) => void;
  smoothing: number;
  setSmoothing: (v: number) => void;
}

export default function BeautySliders({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  smoothing,
  setSmoothing,
}: BeautySlidersProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-4">
      <h3 className="flex items-center gap-2 font-display text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
        <Sparkles className="h-4.5 w-4.5 text-[#ff007f] animate-pulse" /> AI Beauty & Retouch
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Kecerahan (Light)</span>
            <span className="text-[#1d90ff]">{brightness}%</span>
          </div>
          <input
            type="range"
            min="85"
            max="140"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1d90ff]"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Kontras</span>
            <span className="text-indigo-500">{contrast}%</span>
          </div>
          <input
            type="range"
            min="85"
            max="135"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Saturasi Warna</span>
            <span className="text-pink-500">{saturation}%</span>
          </div>
          <input
            type="range"
            min="85"
            max="135"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        {/* Smoothing */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Retouch Halus</span>
            <span className="text-emerald-500">{smoothing > 0 ? `${smoothing}px` : 'Mati'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={smoothing}
            onChange={(e) => setSmoothing(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
