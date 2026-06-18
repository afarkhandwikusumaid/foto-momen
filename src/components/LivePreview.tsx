import React, { useState, useEffect } from 'react';
import { FrameLayout, FrameColor } from '../types';
import { Camera, ChevronRight } from 'lucide-react';

interface LivePreviewProps {
  capturedPhotos: string[];       // Array base64 foto yang baru diambil
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

  useEffect(() => {
    if (visibleCount < capturedPhotos.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, capturedPhotos.length]);

  // Rotasi untuk photo card (alternating)
  const getRotationClass = (index: number) => {
    const rotations = ['-rotate-2 hover:rotate-0', 'rotate-3 hover:rotate-0', '-rotate-3 hover:rotate-0', 'rotate-2 hover:rotate-0'];
    return rotations[index % rotations.length];
  };

  const renderPhotos = () => {
    switch (layout) {
      case 'vertical-strip':
      case 'triple-strip':
        return (
          <div className="flex flex-col gap-4 items-center max-w-[280px] mx-auto py-4">
            {capturedPhotos.map((photo, index) => {
              if (index >= visibleCount) return null;
              return (
                <div
                  key={index}
                  className={`w-full bg-white p-3 shadow-2xl rounded-xl border border-slate-100 transition-all duration-300 hover:scale-105 animate-print-in ${getRotationClass(index)}`}
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Pose ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mt-2 text-[10px] font-mono text-slate-400">
                    POSE {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'grid-2x2':
        return (
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto py-4">
            {capturedPhotos.map((photo, index) => {
              if (index >= visibleCount) return null;
              return (
                <div
                  key={index}
                  className={`bg-white p-3 shadow-2xl rounded-xl border border-slate-100 transition-all duration-300 hover:scale-105 animate-print-in ${getRotationClass(index)}`}
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Pose ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mt-2 text-[10px] font-mono text-slate-400">
                    POSE {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'single-polar':
      default:
        return (
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-4">
            {/* Foto besar di tengah */}
            {visibleCount > 0 && (
              <div
                className="w-full bg-white p-4 shadow-2xl rounded-xl border border-slate-100 transition-all duration-300 hover:scale-105 animate-print-in -rotate-1 hover:rotate-0"
              >
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={capturedPhotos[0]}
                    alt="Hero Pose"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center mt-3 text-xs font-mono text-slate-400">
                  MAIN SHOT
                </div>
              </div>
            )}

            {/* Miniatur di bawah */}
            <div className="flex gap-3 justify-center w-full">
              {capturedPhotos.slice(1).map((photo, index) => {
                const actualIndex = index + 1;
                if (actualIndex >= visibleCount) return null;
                return (
                  <div
                    key={actualIndex}
                    className={`w-24 bg-white p-1.5 shadow-xl rounded-lg border border-slate-100 transition-all duration-300 hover:scale-110 animate-print-in ${getRotationClass(actualIndex)}`}
                  >
                    <div className="aspect-[4/3] w-full bg-slate-100 rounded-md overflow-hidden">
                      <img
                        src={photo}
                        alt={`Mini Pose ${actualIndex}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem-4rem)] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden bg-slate-50 bg-[radial-gradient(#dbeafe_1.5px,transparent_1.5px)] [background-size:24px_24px] text-slate-800">
      
      {/* Counter Animasi di Pojok Kanan Atas */}
      <div className="absolute top-6 right-6 bg-white/80 border border-blue-100 backdrop-blur-md px-4 py-2 rounded-2xl font-mono text-blue-700 text-sm flex items-center gap-2 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span>
          {Math.min(visibleCount, capturedPhotos.length)} / {capturedPhotos.length} POSES
        </span>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 max-w-md z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          ✨ Foto Berhasil Diambil!
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Momen Kamu Siap!
        </h2>
        <p className="text-slate-600 text-sm md:text-base mt-2">
          Periksa setiap pose sebelum melanjutkan ke editing
        </p>
      </div>

      {/* Gallery Render Area */}
      <div className="w-full max-w-4xl min-h-[360px] flex items-center justify-center mb-10 z-10">
        {renderPhotos()}
      </div>

      {/* Buttons Panel */}
      <div 
        className={`flex flex-col sm:flex-row gap-4 w-full max-w-sm px-4 justify-center items-center z-10 transition-all duration-700 transform ${
          showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <button
          onClick={onRetake}
          className="w-full sm:w-auto min-w-[140px] px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer shadow-sm"
        >
          <Camera className="h-4 w-4 text-blue-650" />
          <span>Ambil Ulang</span>
        </button>
        <button
          onClick={onContinue}
          className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
        >
          <span>Lanjut Edit & Simpan</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid overlay shading to focus on the photos */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-transparent to-slate-100/50 pointer-events-none" />
    </div>
  );
}
