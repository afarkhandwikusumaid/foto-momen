import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Pause } from 'lucide-react';

interface LiveGifPreviewProps {
  photos: string[];
  filterCss: string;
  frameColor: string;
  textColor: string;
  caption: string;
}

export default function LiveGifPreview({
  photos,
  filterCss,
  frameColor,
  textColor,
  caption,
}: LiveGifPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 450); // loop frame timing
    return () => clearInterval(interval);
  }, [isPlaying, photos]);

  if (photos.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white p-5 rounded-[28px] shadow-xl border border-slate-800 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-pink-400">
          <Sparkles className="h-4 w-4 text-[#ff007f] animate-pulse" /> Live Photo Boomerang
        </h3>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 transition flex items-center gap-1 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'Pause' : 'Play Loop'}</span>
        </button>
      </div>

      <div 
        className="mx-auto max-w-[260px] rounded-2xl p-4.5 border shadow-inner transition duration-300 relative flex flex-col items-center justify-between"
        style={{ backgroundColor: frameColor, borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-slate-100/10 shadow-md">
          <img
            src={photos[currentIndex]}
            alt="Live Boomerang Frame"
            className="w-full h-full object-cover transition-all duration-150"
            style={{ filter: filterCss }}
          />
        </div>
        
        <div className="mt-4 text-center select-none" style={{ color: textColor }}>
          <p className="text-[7px] opacity-75 mt-0.5 uppercase tracking-widest font-mono">
            ★ Live Boomerang Loop ★
          </p>
        </div>
      </div>
    </div>
  );
}
