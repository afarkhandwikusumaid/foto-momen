import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, Camera, RefreshCw, Image as ImageIcon, Filter } from 'lucide-react';
import { FrameColor, PhotoCount } from '../../../types';
import { getFrameTemplates } from '../../../services/dbService';

export const FRAME_COLORS: FrameColor[] = [];

interface FrameSelectorProps {
  selectedColor: FrameColor;
  onColorSelect: (color: FrameColor) => void;
  onPhotoCountSelect: (count: PhotoCount) => void;
  onNext: () => void;
  onPrev: () => void;
  nextButtonText?: string;
  nextButtonIcon?: React.ReactNode;
}

export default function FrameSelector({
  selectedColor,
  onColorSelect,
  onPhotoCountSelect,
  onNext,
  onPrev,
  nextButtonText = 'Lanjut Ke Kamera',
  nextButtonIcon = <Camera className="h-4 w-4" />,
}: FrameSelectorProps) {

  const [templates, setTemplates] = useState<FrameColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

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
            photoCount: t.photoCount || (t.photoAreas?.length) || 4,
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

  // Generate categories based on available photo counts
  const categories = useMemo(() => {
    const counts = new Set(templates.map(t => t.photoCount || t.photoAreas?.length || 4));
    const sortedCounts = Array.from(counts).sort((a, b) => a - b);
    return ['Semua', ...sortedCounts.map(c => `${c} Foto`)];
  }, [templates]);

  // Filter templates based on selected category
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'Semua') return templates;
    return templates.filter(t => {
      const count = t.photoCount || t.photoAreas?.length || 4;
      return `${count} Foto` === selectedCategory;
    });
  }, [templates, selectedCategory]);

  const handleSelect = (template: FrameColor) => {
    onColorSelect(template);
    if (template.photoCount) {
      onPhotoCountSelect(template.photoCount as PhotoCount);
    }
  };

  const isSelected = (t: FrameColor) => selectedColor.id === t.id;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 animate-fade-in text-slate-800">

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
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Category Filters */}
          {!isLoading && templates.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
              <p className="text-sm font-medium">Memuat template...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <ImageIcon className="w-12 h-12 text-slate-300" />
              <div className="text-center">
                <p className="font-bold text-slate-600">
                  {templates.length === 0 ? 'Belum ada template' : 'Kategori Kosong'}
                </p>
                <p className="text-sm mt-1">
                  {templates.length === 0 
                    ? 'Admin belum menambahkan frame apapun.' 
                    : `Tidak ada template dengan kategori ${selectedCategory}.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none flex flex-col ${
                    isSelected(template)
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Gambar Frame (Fixed Height, object-contain to avoid crop) */}
                  <div
                    className="w-full h-40 relative flex items-center justify-center p-2"
                    style={{ backgroundColor: template.hex }}
                  >
                    {/* Subtle grid pattern background to fill empty space nicely */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:10px_10px]" />
                    
                    {template.imageUrl ? (
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-contain relative z-10 drop-shadow-md"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full relative z-10">
                        <Camera className="w-8 h-8 text-black/20" />
                      </div>
                    )}

                    {/* Selected Overlay */}
                    {isSelected(template) && (
                      <div className="absolute inset-0 bg-blue-500/10 z-20 flex items-center justify-center">
                        <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white border-t border-slate-100 flex-grow">
                    <p className="font-bold text-slate-800 text-sm truncate">{template.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {template.photoCount || (template.photoAreas?.length)} Foto
                    </p>
                  </div>

                  {/* Selected Badge */}
                  {isSelected(template) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow z-30">
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
                  className="max-h-[380px] w-auto object-contain rounded-lg shadow-xl"
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
            {nextButtonIcon}
            <span>{nextButtonText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
