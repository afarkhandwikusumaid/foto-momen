import React, { useState } from 'react';
import { Layout, Sparkles } from 'lucide-react';
import { getPosePlaceholder } from '../Photobooth/PosePlaceholders';
import { FrameLayout, FrameColor } from '../../types';

// Hardcode a few preview colors just for the showcase widget demo
const SHOWCASE_COLORS: FrameColor[] = [
  { id: 'champagne', name: 'Champagne Gold', bgClass: 'bg-[#e6dfd5]', hex: '#e6dfd5', textColor: '#5c4a37', borderClass: 'border-stone-300' },
  { id: 'rose-blush', name: 'Rose Blush', bgClass: 'bg-[#e8c5c8]', hex: '#e8c5c8', textColor: '#523639', borderClass: 'border-rose-300/40' },
  { id: 'deep-bronze', name: 'Deep Bronze', bgClass: 'bg-[#3d3735]', hex: '#3d3735', textColor: '#c5a880', borderClass: 'border-stone-700' },
  { id: 'ivory', name: 'Ivory Cream', bgClass: 'bg-[#faf8f6]', hex: '#faf8f6', textColor: '#2b2625', borderClass: 'border-stone-200' },
];

const SHOWCASE_LAYOUTS: { id: FrameLayout; name: string }[] = [
  { id: 'vertical-strip', name: '2x6 Strip' },
  { id: 'grid-2x2', name: '2x2 Grid' },
  { id: 'single-polar', name: 'Polaroid' },
  { id: 'triple-strip', name: 'Triple' },
];

export default function ShowcaseWidget() {
  const [showcaseLayout, setShowcaseLayout] = useState<FrameLayout>('vertical-strip');
  const [showcaseColor, setShowcaseColor] = useState<FrameColor>(SHOWCASE_COLORS[0]);

  const renderShowcaseStrip = () => {
    const textColor = showcaseColor.textColor;

    switch (showcaseLayout) {
      case 'vertical-strip':
        return (
          <div
            className="w-[145px] p-2.5 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300 bg-white"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="flex flex-col gap-2 w-full">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-1", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3.5 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Foto Momen
            </div>
          </div>
        );

      case 'grid-2x2':
        return (
          <div
            className="w-[180px] p-3 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="grid grid-cols-2 gap-2 w-full">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-0.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Grid Style
            </div>
          </div>
        );

      case 'triple-strip':
        return (
          <div
            className="w-[145px] p-2.5 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="flex flex-col gap-2 w-full">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-1", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3.5 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Triple Strip
            </div>
          </div>
        );

      case 'single-polar':
      default:
        return (
          <div
            className="w-[180px] p-3 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="w-full aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10 mb-2">
              {getPosePlaceholder(3, "w-full h-full p-2", textColor)}
            </div>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-0.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Polaroid Mini
            </div>
          </div>
        );
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-[32px] p-8 shadow-sm">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Demo Interaktif
        </span>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 mt-2">Coba Tampilan Frame</h2>
        <p className="text-slate-500 text-sm mt-1">Pilih layout dan warna untuk preview real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5 select-none">
              <Layout className="w-4 h-4 text-[#1d90ff]" /> 1. Pilih Layout
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {SHOWCASE_LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setShowcaseLayout(l.id)}
                  className={`py-2.5 px-4 rounded-full border text-xs font-bold transition cursor-pointer select-none ${
                    showcaseLayout === l.id
                      ? 'bg-[#1d90ff] border-[#1d90ff] text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5 select-none">
              <Sparkles className="w-4 h-4 text-[#1d90ff]" /> 2. Coba Warna Frame
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SHOWCASE_COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setShowcaseColor(col)}
                  className={`flex items-center gap-2 p-3 rounded-full border text-xs font-bold transition text-left cursor-pointer select-none ${
                    showcaseColor.id === col.id
                      ? 'bg-white border-[#1d90ff] shadow-md ring-2 ring-blue-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border ${col.borderClass} flex-shrink-0`} style={{ backgroundColor: col.hex }} />
                  <span className="truncate text-slate-700 font-bold">{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output rendering */}
        <div className="lg:col-span-3 flex justify-center items-center bg-white border border-slate-200 p-8 rounded-2xl shadow-inner min-h-[300px]">
          {renderShowcaseStrip()}
        </div>
      </div>
    </section>
  );
}
