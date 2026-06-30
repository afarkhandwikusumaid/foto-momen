import React, { useState, useEffect } from 'react';
import { FrameLayout, FrameColor } from '../../types';
import { Camera, ChevronRight, RefreshCw, Printer } from 'lucide-react';

interface LivePreviewProps {
  capturedPhotos: string[];       // Array of base64 captured photos
  layout: FrameLayout;
  frameColor: FrameColor;
  onContinue: () => void;         // Lanjut ke halaman edit
  onRetake: () => void;           // Ambil ulang foto (kembali ke camera)
}

export default function LivePreview({
  capturedPhotos,
  layout,
  frameColor,
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
      }, 550); // Delay between each photo slot printing
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowButtons(true);
        setIsPrinting(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, capturedPhotos.length]);

  const renderUnifiedStrip = () => {
    const textColor = frameColor.textColor;
    const isDark = frameColor.id === 'navy' || frameColor.id === 'midnight' || frameColor.id === 'royal-blue' || frameColor.id === 'gold-navy';
    
    // Determine layouts
    switch (layout) {
      case 'vertical-strip':
      case 'triple-strip':
        const displayPhotosCount = layout === 'triple-strip' ? 3 : capturedPhotos.length;
        return (
          <div 
            className="w-[200px] p-4 flex flex-col items-center rounded-xl transition-all duration-500 border border-slate-200/50 shadow-2xl relative bg-white animate-print-in select-none"
            style={{ 
              backgroundColor: frameColor.hex, 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Glossy sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-xl pointer-events-none z-10" />
            
            <div className="flex flex-col gap-3 w-full">
              {capturedPhotos.slice(0, displayPhotosCount).map((photo, index) => {
                const isVisible = index < visibleCount;
                return (
                  <div 
                    key={index} 
                    className={`aspect-[4/3] w-full rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner transition-all duration-500 ease-out transform ${
                      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
                    }`}
                  >
                    {isVisible && (
                      <img
                        src={photo}
                        alt={`Pose ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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

      case 'grid-2x2':
        return (
          <div 
            className="w-[260px] p-5 flex flex-col items-center rounded-xl transition-all duration-500 border border-slate-200/50 shadow-2xl relative bg-white animate-print-in select-none"
            style={{ 
              backgroundColor: frameColor.hex,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-xl pointer-events-none z-10" />

            <div className="grid grid-cols-2 gap-3 w-full">
              {capturedPhotos.slice(0, 4).map((photo, index) => {
                const isVisible = index < visibleCount;
                return (
                  <div 
                    key={index} 
                    className={`aspect-[4/3] w-full rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner transition-all duration-500 ease-out transform ${
                      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
                    }`}
                  >
                    {isVisible && (
                      <img
                        src={photo}
                        alt={`Pose ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center font-display font-black text-sm mt-5 tracking-wider" style={{ color: textColor }}>
              Grid Collection
            </div>
            <div className="text-[8px] font-mono mt-1 opacity-70" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );

      case 'single-polar':
      default:
        return (
          <div 
            className="w-[260px] p-5 flex flex-col items-center rounded-xl transition-all duration-500 border border-slate-200/50 shadow-2xl relative bg-white animate-print-in select-none"
            style={{ 
              backgroundColor: frameColor.hex,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-xl pointer-events-none z-10" />

            {/* Main big shot */}
            <div 
              className={`w-full aspect-[4/3] rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner mb-3 transition-all duration-500 ease-out transform ${
                visibleCount > 0 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
              }`}
            >
              {visibleCount > 0 && (
                <img
                  src={capturedPhotos[0]}
                  alt="Main Shot"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Bottom 3 miniatures */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              {capturedPhotos.slice(1).map((photo, index) => {
                const actualIndex = index + 1;
                const isVisible = actualIndex < visibleCount;
                return (
                  <div 
                    key={actualIndex} 
                    className={`aspect-[4/3] w-full rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner transition-all duration-500 ease-out transform ${
                      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
                    }`}
                  >
                    {isVisible && (
                      <img
                        src={photo}
                        alt={`Mini Pose ${actualIndex}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center font-display font-black text-xs mt-5 tracking-widest uppercase" style={{ color: textColor }}>
              Polaroid Style
            </div>
            <div className="text-[7.5px] font-mono mt-1 opacity-70" style={{ color: textColor }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem-4rem)] flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden bg-slate-50 text-slate-800">
      
      {/* Background elegant pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Printing Notification Bar */}
      <div className="absolute top-6 right-6 bg-white/90 border border-slate-200 backdrop-blur-md px-4 py-2.5 rounded-2xl font-mono text-slate-700 text-xs flex items-center gap-2.5 shadow-lg select-none">
        <Printer className={`w-4 h-4 ${isPrinting ? 'text-blue-650 animate-bounce' : 'text-emerald-500'}`} />
        <span>
          {isPrinting ? 'MENCETAK STRIP FOTO...' : 'SELESAI MENCETAK'}
        </span>
      </div>

      {/* Header Section */}
      <div className="text-center mb-10 max-w-md z-10 select-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          ✨ Selesai Capture!
        </span>
        <h2 className="font-display text-4xl font-black text-slate-900 leading-tight">
          Cetak Foto Berhasil
        </h2>
        <p className="text-slate-550 text-sm mt-2 leading-relaxed">
          Tunggu hingga strip foto Anda selesai tercetak dari mesin simulator kami.
        </p>
      </div>

      {/* Simulated printer output container */}
      <div className="relative w-full max-w-md flex flex-col items-center mb-10 z-10">
        
        {/* Physical Printer Slot Graphic */}
        <div className="w-[300px] h-3 bg-gradient-to-b from-slate-900 to-slate-800 rounded-full shadow-md border-b border-white/10 z-20 flex items-center justify-center">
          <div className="w-[280px] h-[2px] bg-slate-950 rounded" />
        </div>
        
        {/* Printed Strip emerging from Slot */}
        <div className="pt-2 origin-top animate-fade-in flex justify-center w-full">
          {renderUnifiedStrip()}
        </div>
      </div>

      {/* Buttons Panel */}
      <div 
        className={`flex flex-col sm:flex-row gap-4.5 w-full max-w-sm px-4 justify-center items-center z-10 transition-all duration-500 transform ${
          showButtons ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
        }`}
      >
        <button
          onClick={onRetake}
          className="w-full sm:w-auto min-w-[140px] px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl font-bold transition flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer shadow-sm"
        >
          <Camera className="h-4.5 w-4.5 text-slate-500" />
          <span>Foto Ulang</span>
        </button>
        <button
          onClick={onContinue}
          className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-extrabold shadow-lg shadow-blue-600/10 transition flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
        >
          <span>Lanjut Edit & Simpan</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}
