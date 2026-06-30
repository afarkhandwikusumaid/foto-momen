import React, { useState } from 'react';
import { Layout, Sparkles } from 'lucide-react';
import { FRAME_COLORS } from '../photobooth/FrameSelector';
import { getPosePlaceholder } from '../photobooth/PosePlaceholders';
import { FrameLayout, FrameColor } from '../../types';

export default function ShowcaseWidget() {
  const [showcaseLayout, setShowcaseLayout] = useState<FrameLayout>('vertical-strip');
  const [showcaseColor, setShowcaseColor] = useState<FrameColor>(FRAME_COLORS[0]); // Pure White or first item

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
            <div className="text-[6.5px] font-mono mt-0.5 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
      case 'triple-strip':
        return (
          <div 
            className="w-[145px] p-2.5 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300 bg-white"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="flex flex-col gap-2 w-full">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx + 1, "w-full h-full p-1", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3.5 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Classic 3
            </div>
            <div className="text-[6.5px] font-mono mt-0.5 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
      case 'grid-2x2':
        return (
          <div 
            className="w-[180px] p-3.5 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300 bg-white"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="grid grid-cols-2 gap-2 w-full">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-0.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[10px] mt-3.5 tracking-wider select-none" style={{ color: textColor }}>
              Grid Collection
            </div>
            <div className="text-[7px] font-mono mt-0.5 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
      case 'single-polar':
      default:
        return (
          <div 
            className="w-[180px] p-3.5 flex flex-col items-center border border-slate-200 rounded-xl shadow-md transition-all duration-300 bg-white"
            style={{ backgroundColor: showcaseColor.hex }}
          >
            <div className="w-full aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10 mb-2">
              {getPosePlaceholder(3, "w-full h-full p-1.5", textColor)}
            </div>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="aspect-[4/3] bg-slate-100/10 rounded overflow-hidden flex items-center justify-center border border-slate-200/10">
                  {getPosePlaceholder(idx, "w-full h-full p-0.5", textColor)}
                </div>
              ))}
            </div>
            <div className="text-center font-bold text-[9px] mt-3.5 tracking-widest uppercase select-none" style={{ color: textColor }}>
              Polaroid Style
            </div>
            <div className="text-[7px] font-mono mt-0.5 opacity-70 select-none" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
    }
  };

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="text-center max-w-xl mx-auto mb-10 select-none">
        <span className="text-[10px] text-[#1d90ff] font-bold px-3 py-1 bg-blue-50 border border-blue-100 rounded-full inline-block uppercase tracking-wider">
          Galeri Klien
        </span>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">
          Coba Layout & Desain Frame
        </h2>
        <p className="text-slate-500 text-xs mt-2">
          Rancang dan simulasikan strip foto virtual Anda secara langsung sebelum mengambil pose.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8fafc] border border-slate-200 p-6 md:p-8 rounded-3xl">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5 select-none">
              <Layout className="w-4 h-4 text-[#1d90ff]" /> 1. Pilih Tata Letak
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'vertical-strip', name: 'Vertical Strip' },
                { id: 'triple-strip', name: 'Classic 3' },
                { id: 'grid-2x2', name: '2x2 Grid' },
                { id: 'single-polar', name: 'Polaroid' }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setShowcaseLayout(l.id as FrameLayout)}
                  className={`p-3.5 rounded-full border text-xs font-bold text-center transition cursor-pointer select-none ${
                    showcaseLayout === l.id 
                      ? 'bg-[#1d90ff] border-transparent text-white shadow-md' 
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
              {FRAME_COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setShowcaseColor(col)}
                  className={`flex items-center gap-2 p-3 rounded-full border text-xs font-bold transition text-left cursor-pointer select-none ${
                    showcaseColor.id === col.id 
                      ? 'bg-white border-[#1d90ff] shadow-md ring-2 ring-blue-500/10' 
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className={`h-4.5 w-4.5 rounded-full border ${col.borderClass}`} style={{ backgroundColor: col.hex }} />
                  <span className="truncate text-slate-700 font-bold">{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output rendering */}
        <div className="lg:col-span-5 flex justify-center items-center bg-white border border-slate-200 p-8 rounded-2xl shadow-inner min-h-[300px]">
          {renderShowcaseStrip()}
        </div>
      </div>
    </section>
  );
}
