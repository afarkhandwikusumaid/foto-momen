import React, { useState, useEffect } from 'react';
import { FrameColor, PhotoArea } from '../../types';
import { Camera, ChevronRight, RefreshCw, Printer } from 'lucide-react';

interface LivePreviewProps {
  capturedPhotos: string[];
  frameColor: FrameColor;
  photoAreas?: PhotoArea[];
  onContinue: () => void;
  onRetake: () => void;
}

export default function LivePreview({
  capturedPhotos,
  frameColor,
  photoAreas,
  onContinue,
  onRetake,
}: LivePreviewProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isPrinting, setIsPrinting] = useState(true);

  useEffect(() => {
    if (visibleCount < capturedPhotos.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowButtons(true);
        setIsPrinting(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, capturedPhotos.length]);

  const renderStrip = () => {
    const textColor = frameColor.textColor;

    // Template admin dengan photoAreas: render foto di posisi lubang, frame overlay di atas
    if (photoAreas && photoAreas.length > 0 && frameColor.imageUrl) {
      return (
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl animate-print-in select-none flex-shrink-0"
          style={{
            width: '220px',
            aspectRatio: '2/3',
            backgroundColor: frameColor.hex,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          }}
        >
          {photoAreas.map((area, index) => {
            const isVisible = index < visibleCount;
            return (
              <div
                key={index}
                className={`absolute overflow-hidden transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                }}
              >
                {isVisible && capturedPhotos[index] && (
                  <img
                    src={capturedPhotos[index]}
                    alt={`Pose ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
          {/* Frame overlay di atas foto */}
          <img
            src={frameColor.imageUrl}
            alt="Frame overlay"
            className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
          />
        </div>
      );
    }

    // Fallback: vertical strip sederhana
    return (
      <div
        className="w-[200px] p-4 flex flex-col items-center rounded-xl border border-slate-200/50 shadow-2xl relative animate-print-in select-none"
        style={{
          backgroundColor: frameColor.hex,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-xl pointer-events-none" />

        <div className="flex flex-col gap-3 w-full">
          {capturedPhotos.map((photo, index) => {
            const isVisible = index < visibleCount;
            return (
              <div
                key={index}
                className={`aspect-[4/3] w-full rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner transition-all duration-500 ease-out transform ${
                  isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
                }`}
              >
                {isVisible && (
                  <img src={photo} alt={`Pose ${index + 1}`} className="w-full h-full object-cover" />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center font-display font-black text-xs mt-5 tracking-widest uppercase" style={{ color: textColor }}>
          Foto Momen
        </div>
        <div className="text-[7.5px] font-mono mt-1 opacity-70" style={{ color: textColor }}>
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem-4rem)] flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden bg-slate-50 text-slate-800">

      {/* Background dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Printing Notification Bar */}
      <div className="absolute top-6 right-6 bg-white/90 border border-slate-200 backdrop-blur-md px-4 py-2.5 rounded-2xl font-mono text-slate-700 text-xs flex items-center gap-2.5 shadow-lg select-none">
        <Printer className={`w-4 h-4 ${isPrinting ? 'text-blue-500 animate-bounce' : 'text-emerald-500'}`} />
        <span>{isPrinting ? 'MENCETAK STRIP FOTO...' : 'SELESAI MENCETAK'}</span>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-md z-10 select-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          ✨ Selesai Capture!
        </span>
        <h2 className="font-display text-4xl font-black text-slate-900 leading-tight">
          Cetak Foto Berhasil
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Lihat hasilnya! Lanjutkan untuk menambahkan efek dan filter kece.
        </p>
      </div>

      {/* Strip Preview */}
      <div className="z-10 flex justify-center mb-10">
        {renderStrip()}
      </div>

      {/* Action Buttons */}
      <div
        className={`z-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm transition-all duration-500 ${
          showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Foto Ulang
        </button>
        <button
          onClick={onContinue}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1d90ff] hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-md shadow-blue-500/20 text-sm"
        >
          <span>Lanjut Edit</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
