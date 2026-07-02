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
      {/* 1. Latar Belakang Gradasi (Gradients) */}
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
      <div className="bg-white border border-slate-200 p-6 rounded-xl mt-4">
        <h3 className="flex items-center gap-2 font-display text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          <Wand2 className="h-4 w-4 text-slate-800" /> Pilih Filter Estetik
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as PhotoFilter)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-colors cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-[#1d90ff] bg-blue-50 text-[#1d90ff] font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 mb-1.5">
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



      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadImage}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-lg text-[13px] font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleUploadAndShare}
            disabled={isProcessing || isUploading}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 rounded-lg text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            {isUploading ? (
              <div className="w-4.5 h-4.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
            ) : (
              <QrCode className="h-4.5 w-4.5" />
            )}
            <span>{isUploading ? 'Menyimpan...' : 'QR Code Cloud'}</span>
          </button>
        </div>
        
        <button
          onClick={onBackToSelector}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-400 hover:text-slate-650 transition mt-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Ubah Layout / Frame
        </button>
      </div>
    </>
  );
}
