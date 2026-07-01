import React from 'react';
import { Sparkles } from 'lucide-react';
import { getPosePlaceholder } from '../../Photobooth/PosePlaceholders';
import { PhotoArea } from '../../../types';

interface LiveSimulatorProps {
  previewUrl: string | null;
  hex: string;
  textColor: string;
  layout: string;
  photoCount: number;
  photoAreas?: PhotoArea[];
  name: string;
}

export default function LiveSimulator({
  previewUrl,
  hex,
  textColor,
  layout,
  photoCount,
  photoAreas,
  name
}: LiveSimulatorProps) {
  return (
    <div className="bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[300px]">
      <div className="text-center sm:text-left flex-1 max-w-xs">
        <h3 className="text-white font-black text-xl mb-2 flex items-center gap-2 justify-center sm:justify-start">
          <Sparkles className="w-5 h-5 text-amber-400" /> Live Simulator
        </h3>
        <p className="text-slate-400 text-sm">Pratinjau ini menunjukkan bagaimana hasil akhir cetakan dengan frame overlay Anda.</p>
        {!previewUrl && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 text-xs">
            Unggah PNG atau pilih dari katalog untuk melihat simulasi.
          </div>
        )}
      </div>
      
      {/* The Actual Simulator */}
      <div className="shrink-0 flex items-center justify-center relative">
        <div 
          className="relative w-full max-w-[200px] flex flex-col items-center border shadow-xl rounded-xl transition-all overflow-hidden"
          style={{ backgroundColor: hex, borderColor: `${textColor}40` }}
        >
          {/* Frame Overlay (Layered on top of photos) */}
          {previewUrl && (
             <img src={previewUrl} alt="Overlay" className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" />
          )}

          {/* Photos (Underneath) */}
          {photoAreas && photoAreas.length > 0 ? (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {photoAreas.map((area, idx) => (
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
          ) : (
            <div className={`flex flex-col gap-2 w-full p-3 z-10 pt-4 ${layout === 'grid-2x2' ? 'grid grid-cols-2' : ''}`}>
              {Array.from({ length: photoCount }).map((_, idx) => (
                <div key={idx} className="aspect-[4/3] bg-white/30 rounded overflow-hidden flex items-center justify-center border border-white/40 shadow-inner">
                   {getPosePlaceholder(idx, "w-full h-full p-1 opacity-50", textColor)}
                </div>
              ))}
            </div>
          )}
          
          {/* Footer text simulated (only if using fallback layout, else PNG handles it) */}
          {(!photoAreas || photoAreas.length === 0) && (
            <div className="z-10 text-center font-display font-black text-[9px] mt-2 mb-3 tracking-widest uppercase" style={{ color: textColor }}>
              {name || 'Foto Momen'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
