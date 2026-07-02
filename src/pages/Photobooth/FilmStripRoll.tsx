import React from 'react';
import { Camera, CheckCircle2, Info } from 'lucide-react';

interface FilmStripRollProps {
  capturedPhotos: string[];
  photoCount: number;
}

export default function FilmStripRoll({ capturedPhotos, photoCount }: FilmStripRollProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-3xl w-full shadow-md">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          Film Strip Roll
        </h3>
        <span className="text-[10px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-slate-600 font-mono font-extrabold">
          {capturedPhotos.length}/{photoCount} POSES
        </span>
      </div>

      {/* Film Strip Outer Frame */}
      <div className="border-x-2 border-dashed border-slate-300 px-3 py-1 space-y-4 bg-slate-50/40 rounded-xl">
        {Array.from({ length: photoCount }).map((_, index) => {
          const photo = capturedPhotos[index];
          return (
            <div 
              key={index}
              className={`aspect-[4/3] rounded-xl overflow-hidden border transition bg-white shadow-sm relative flex items-center justify-center ${
                photo ? 'border-slate-250' : 'border-dashed border-slate-300'
              }`}
            >
              {photo ? (
                <>
                  <img src={photo} alt={`Pose ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                    <CheckCircle2 className="h-4.5 w-4.5 stroke-[2.5]" />
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-slate-950/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono select-none">
                    POSE {index + 1}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 select-none">
                  <Camera className="h-6 w-6 text-slate-350 opacity-60" />
                  <span className="text-[10px] font-bold text-slate-400 font-mono">POSE {index + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex gap-2.5">
        <Info className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-blue-800 font-bold font-sans">
          Ubah pose terbaikmu setiap kali hitungan mundur selesai. Foto akan secara otomatis dirangkai ke dalam template frame pilihan Anda!
        </p>
      </div>
    </div>
  );
}
