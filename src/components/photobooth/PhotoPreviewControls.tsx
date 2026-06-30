import React from 'react';
import { Download, Wand2, Type, Calendar, QrCode, ArrowLeft } from 'lucide-react';
import { FrameColor, PhotoFilter } from '../../types';
import { CustomBackdrop, CustomFont } from '../../services/dbService';
import BeautySliders from './BeautySliders';
import { FILTERS, FRAME_PATTERNS } from './PhotoPreview';

interface PhotoPreviewControlsProps {
  dbBackdrops: CustomBackdrop[];
  selectedBackdrop: CustomBackdrop | null;
  setSelectedBackdrop: (bd: CustomBackdrop | null) => void;
  allFrameColors: FrameColor[];
  frameColor: FrameColor;
  onColorSelect: (color: FrameColor) => void;
  selectedPattern: string;
  setSelectedPattern: (p: string) => void;
  selectedFilter: PhotoFilter;
  setSelectedFilter: (f: PhotoFilter) => void;
  capturedPhotos: string[];
  brightness: number;
  setBrightness: (v: number) => void;
  contrast: number;
  setContrast: (v: number) => void;
  saturation: number;
  setSaturation: (v: number) => void;
  smoothing: number;
  setSmoothing: (v: number) => void;
  stickerText: string;
  setStickerText: (t: string) => void;
  dbFonts: CustomFont[];
  selectedFont: string;
  setSelectedFont: (f: string) => void;
  showDate: boolean;
  setShowDate: (d: boolean) => void;
  handleDownloadImage: () => void;
  handleUploadAndShare: () => void;
  isProcessing: boolean;
  isUploading: boolean;
  onBackToSelector: () => void;
}

export default function PhotoPreviewControls({
  dbBackdrops, selectedBackdrop, setSelectedBackdrop,
  allFrameColors, frameColor, onColorSelect,
  selectedPattern, setSelectedPattern,
  selectedFilter, setSelectedFilter,
  capturedPhotos,
  brightness, setBrightness,
  contrast, setContrast,
  saturation, setSaturation,
  smoothing, setSmoothing,
  stickerText, setStickerText,
  dbFonts, selectedFont, setSelectedFont,
  showDate, setShowDate,
  handleDownloadImage, handleUploadAndShare,
  isProcessing, isUploading,
  onBackToSelector
}: PhotoPreviewControlsProps) {
  return (
    <>
      {/* 1. Warna Frame Row (Circles) */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
          Warna Frame
        </h3>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin select-none">
          <button
            onClick={() => {
              if (dbBackdrops.length > 0) {
                setSelectedBackdrop(dbBackdrops[0]);
              }
            }}
            className={`h-9 w-9 rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 border transition cursor-pointer flex-shrink-0 ${
              selectedBackdrop !== null ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'border-slate-200'
            }`}
            title="Ganti Background Gradasi"
          />

          {allFrameColors.map(color => {
            const isSelected = frameColor.id === color.id && selectedBackdrop === null;
            return (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedBackdrop(null);
                  onColorSelect(color);
                }}
                style={{ backgroundColor: color.hex }}
                className={`h-9 w-9 rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 border-blue-600'
                    : 'border-slate-200/90 hover:scale-[1.01]'
                }`}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Stiker / Pola Frame Grid */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
          Stiker (Motif Frame)
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {FRAME_PATTERNS.map(pattern => {
            const isSelected = selectedPattern === pattern.id;
            return (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`flex flex-col items-center justify-center p-2 h-16 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-blue-650 bg-blue-50/20 text-blue-800 ring-2 ring-blue-500/10 font-bold scale-102'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg mb-1 shadow-inner border border-slate-100 ${pattern.previewClass}`}>
                  {pattern.id === 'dots' || pattern.id === 'grid' ? null : pattern.icon}
                </div>
                <span className="text-[9px] font-black text-slate-500 truncate w-full text-center">
                  {pattern.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Latar Belakang Gradasi (Gradients) */}
      {selectedBackdrop !== null && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm animate-fade-in">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            Latar Belakang Gradasi Premium
          </h3>
          <div className="flex flex-wrap gap-2">
            {dbBackdrops.map(bd => (
              <button
                key={bd.id}
                onClick={() => setSelectedBackdrop(bd)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                  selectedBackdrop?.id === bd.id
                    ? 'border-blue-600 bg-blue-50/10 text-blue-800 shadow-sm ring-1 ring-blue-500/10'
                    : 'border-slate-200 hover:scale-[1.01]'
                } bg-gradient-to-r from-pink-100 to-blue-100 text-slate-800`}
              >
                {bd.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Pilih Filter Estetik */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">
          <Wand2 className="h-4.5 w-4.5 text-blue-600" /> Pilih Filter Estetik
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as PhotoFilter)}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-blue-650 bg-blue-50/20 text-blue-800 shadow-sm ring-1 ring-blue-500/10 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 mb-1.5 shadow-inner">
                  {capturedPhotos[0] && (
                    <img 
                      src={capturedPhotos[0]} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover"
                      style={{ filter: filter.css }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-slate-700 text-center leading-tight truncate w-full">
                  {filter.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. AI Beauty & Retouch Sliders */}
      <BeautySliders
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
        saturation={saturation}
        setSaturation={setSaturation}
        smoothing={smoothing}
        setSmoothing={setSmoothing}
      />

      {/* 6. Teks Footer & Custom Fonts */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="flex items-center gap-2 font-display text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
          <Type className="h-4.5 w-4.5 text-blue-600" /> Teks Footer Frame
        </h3>
        
        <div className="space-y-3">
          <input
            type="text"
            maxLength={36}
            value={stickerText}
            onChange={(e) => setStickerText(e.target.value)}
            placeholder="Contoh: 🌟 Malam Bahagia 🌟"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-slate-800 bg-slate-50"
          />
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 block">Pilih Font Tulisan:</label>
            <div className="flex flex-wrap gap-2">
              {dbFonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    selectedFont === f.name
                      ? 'border-blue-600 bg-blue-50/20 text-blue-800 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                  style={{ fontFamily: f.name }}
                >
                  {f.displayName}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <label className="flex items-center gap-2.5 mt-2 cursor-pointer text-xs font-black text-slate-750 select-none">
          <input 
             type="checkbox" 
             checked={showDate} 
             onChange={e => setShowDate(e.target.checked)}
             className="rounded text-blue-650 focus:ring-blue-500 w-4.5 h-4.5 accent-blue-600 border-slate-300 cursor-pointer" 
          />
          <Calendar className="w-4 h-4 text-slate-450" /> Tampilkan Tanggal Hari Ini
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadImage}
            disabled={isProcessing}
            className="flex-1 group flex items-center justify-center gap-2.5 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-2xl text-[13px] font-extrabold shadow-lg shadow-blue-500/20 hover:scale-[1.01] active:scale-98 transition cursor-pointer"
          >
            <Download className="h-4.5 w-4.5 group-hover:scale-110 transition" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleUploadAndShare}
            disabled={isProcessing || isUploading}
            className="flex-1 group flex items-center justify-center gap-2.5 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-[13px] font-extrabold shadow-lg shadow-purple-500/20 hover:scale-[1.01] active:scale-98 transition cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            {isUploading ? (
              <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <QrCode className="h-4.5 w-4.5 group-hover:scale-110 transition" />
            )}
            <span>{isUploading ? 'Menyimpan...' : 'QR Code Cloud'}</span>
          </button>
        </div>
        
        <button
          onClick={onBackToSelector}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-400 hover:text-slate-650 transition mt-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali Ke Awal
        </button>
      </div>
    </>
  );
}
