import React from 'react';
import { Palette, Play, RefreshCw } from 'lucide-react';

export interface LiveFilter {
  id: string;
  label: string;
  css: string;
}

interface CameraControlsProps {
  liveFilters: LiveFilter[];
  selectedLiveFilter: LiveFilter;
  setSelectedLiveFilter: (f: LiveFilter) => void;
  isCapturing: boolean;
  statusMessage: string;
  cameraPermissionError: boolean;
  capturedPhotosCount: number;
  photoCount: number;
  startPhotoSession: () => void;
  handleReset: () => void;
  onBack: () => void;
}

export default function CameraControls({
  liveFilters,
  selectedLiveFilter,
  setSelectedLiveFilter,
  isCapturing,
  statusMessage,
  cameraPermissionError,
  capturedPhotosCount,
  photoCount,
  startPhotoSession,
  handleReset,
  onBack
}: CameraControlsProps) {
  return (
    <>
      {/* Live Filters Strip */}
      <div className="w-full max-w-xl mt-6">
         <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Live Filters</span>
         </div>
         <div className="flex overflow-x-auto pb-2 gap-2 snap-x hide-scrollbar">
            {liveFilters.map(f => (
              <button
                key={f.id}
                disabled={isCapturing}
                onClick={() => setSelectedLiveFilter(f)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition snap-center whitespace-nowrap cursor-pointer ${
                  selectedLiveFilter.id === f.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-white border border-slate-200 text-slate-650 hover:border-slate-350'
                }`}
              >
                {f.label}
              </button>
            ))}
         </div>
      </div>

      {/* Status Message */}
      <div className="w-full text-center mt-5">
        <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${isCapturing ? 'bg-blue-600 animate-ping' : 'bg-emerald-500'}`} />
          <span>{statusMessage}</span>
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row w-full max-w-xl mx-auto items-stretch sm:items-center justify-center gap-3 mt-6 px-4 sm:px-0">
        <button
          onClick={onBack}
          disabled={isCapturing}
          className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Ganti Layout / Frame
        </button>

        {!isCapturing ? (
          <button
            onClick={startPhotoSession}
            disabled={cameraPermissionError}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-60 text-white rounded-lg text-base font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Play className="h-5 w-5 fill-white" />
            <span>{capturedPhotosCount > 0 ? 'Mulai Ulang Sesi' : `Mulai Capture (${photoCount} Pose)`}</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-sm font-bold transition-colors"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>Hentikan & Reset</span>
          </button>
        )}
      </div>
    </>
  );
}
