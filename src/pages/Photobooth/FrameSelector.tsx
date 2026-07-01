import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Camera, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { FrameColor, PhotoCount } from '../../types';
import { getFrameTemplates } from '../../services/dbService';

// Export FRAME_COLORS agar tidak break import di tempat lain
export const FRAME_COLORS: FrameColor[] = [];

interface FrameSelectorProps {
  selectedColor: FrameColor;
  onColorSelect: (color: FrameColor) => void;
  onPhotoCountSelect: (count: PhotoCount) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FrameSelector({
  selectedColor,
  onColorSelect,
  onPhotoCountSelect,
  onNext,
  onPrev,
}: FrameSelectorProps) {

  const [templates, setTemplates] = useState<FrameColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        // Auto-select first template if none selected or selected is from default colors
        if (mapped.length > 0 && !mapped.find(t => t.id === selectedColor.id)) {
          const first = mapped[0];
          onColorSelect(first);
          if (first.photoCount) onPhotoCountSelect(first.photoCount as PhotoCount);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelect = (template: FrameColor) => {
    onColorSelect(template);
    if (template.photoCount) {
      onPhotoCountSelect(template.photoCount as PhotoCount);
    }
  };

  const isSelected = (t: FrameColor) => selectedColor.id === t.id;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in text-slate-800">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          Langkah 1 dari 3: Pilih Template Frame
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Pilih Frame Foto Anda
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Pilih salah satu template frame di bawah ini untuk memulai sesi foto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Kiri: Grid Template */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
              <p className="text-sm font-medium">Memuat template...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <ImageIcon className="w-12 h-12 text-slate-300" />
              <div className="text-center">
                <p className="font-bold text-slate-600">Belum ada template</p>
                <p className="text-sm mt-1">Admin belum menambahkan frame apapun. Hubungi admin untuk menambahkan template.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none ${
                    isSelected(template)
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Gambar Frame */}
                  <div
                    className="w-full aspect-[2/3] relative overflow-hidden"
                    style={{ backgroundColor: template.hex }}
                  >
                    {template.imageUrl ? (
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-10 h-10 text-slate-300" />
                      </div>
                    )}

                    {/* Selected Overlay */}
                    {isSelected(template) && (
                      <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                        <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <p className="font-bold text-slate-800 text-sm truncate">{template.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {template.photoCount || (template.photoAreas?.length)} Foto
                    </p>
                  </div>

                  {/* Selected Badge */}
                  {isSelected(template) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                      ✓ DIPILIH
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kanan: Preview Panel */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <div className="w-full bg-slate-50 flex flex-col items-center justify-center p-6 border border-slate-200 min-h-[460px] rounded-xl gap-4">
            {selectedColor.imageUrl ? (
              <>
                <img
                  src={selectedColor.imageUrl}
                  alt={selectedColor.name}
                  className="max-h-[380px] w-auto object-contain rounded-lg shadow-lg"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">{selectedColor.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedColor.photoCount || selectedColor.photoAreas?.length || '?'} foto •{' '}
                    {selectedColor.photoAreas ? 'Layout otomatis' : 'Layout standar'}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                <p className="text-sm font-medium">Pilih template untuk preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-12 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            className="flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 px-6 sm:px-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <button
            onClick={onNext}
            disabled={!selectedColor.imageUrl && templates.length > 0}
            className="flex-1 sm:flex-none sm:min-w-[280px] flex items-center justify-center gap-3 rounded-lg bg-[#1d90ff] hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-8 text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Camera className="h-4 w-4" />
            <span>Lanjut Ke Kamera</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
