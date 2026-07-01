import React, { useEffect, useState, useRef } from 'react';
import { Camera, ChevronLeft, ChevronRight, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { getFrameTemplates } from '../../services/dbService';
import { FrameColor } from '../../types';

interface TemplatesCatalogProps {
  onStartWithTemplate: (template: FrameColor) => void;
}

export default function TemplatesCatalog({ onStartWithTemplate }: TemplatesCatalogProps) {
  const [templates, setTemplates] = useState<FrameColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getFrameTemplates()
      .then(data => {
        const mapped: FrameColor[] = data
          .filter((t: any) => t.active !== false)
          .map((t: any) => ({
            id: t.id,
            name: t.name,
            bgClass: 'bg-white',
            hex: t.hex || '#ffffff',
            textColor: t.textColor || '#000000',
            borderClass: t.borderClass || 'border-slate-200',
            imageUrl: t.imageUrl,
            layout: t.layout,
            active: t.active,
            photoCount: t.photoCount || 4,
            photoAreas: t.photoAreas,
          }));
        setTemplates(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-12 px-4 select-none bg-gradient-to-b from-blue-50/20 via-white to-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">

      {/* Decorative Blob */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-3 mb-10 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pilih Frame Foto Kamu
        </h2>
        <p className="text-xs text-slate-500 italic font-medium">
          Klik frame favoritmu untuk langsung mulai sesi foto!
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-sm">Memuat koleksi frame...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl mx-4">
          <ImageIcon className="w-12 h-12 text-slate-200" />
          <div className="text-center">
            <p className="font-bold text-slate-500">Belum ada template tersedia</p>
            <p className="text-sm mt-1 text-slate-400">Admin sedang menyiapkan koleksi frame terbaik untuk Anda.</p>
          </div>
        </div>
      ) : (
        /* Carousel */
        <div className="relative max-w-5xl mx-auto flex items-center justify-center gap-4 px-2">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer shadow-sm active:scale-95 transition flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 px-2 hide-scrollbar scroll-smooth"
          >
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex-shrink-0 w-[200px] sm:w-[220px] snap-start flex flex-col items-center gap-3"
              >
                {/* Frame Card */}
                <div
                  className="w-full rounded-2xl overflow-hidden border border-slate-200/50 shadow-lg group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  onClick={() => onStartWithTemplate(template)}
                >
                  {/* Frame image */}
                  <div
                    className="w-full aspect-[2/3] relative overflow-hidden"
                    style={{ backgroundColor: template.hex }}
                  >
                    {template.imageUrl ? (
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-10 h-10 text-slate-300" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-blue-600 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        Mulai Foto
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <p className="font-extrabold text-sm text-slate-800 truncate">{template.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-medium">
                      {template.photoCount || template.photoAreas?.length || '?'} Pose
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onStartWithTemplate(template)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1d90ff] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Mulai dengan Frame Ini
                </button>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer shadow-sm active:scale-95 transition flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
}
