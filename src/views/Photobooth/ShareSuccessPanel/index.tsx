import React from 'react';
import { Check, Download, ArrowLeft } from 'lucide-react';

interface ShareSuccessPanelProps {
  qrDataUrl: string;
  liveQrDataUrl?: string;
  onDownload: () => void;
  onNewSession: () => void;
}

export default function ShareSuccessPanel({
  qrDataUrl,
  liveQrDataUrl,
  onDownload,
  onNewSession
}: ShareSuccessPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center space-y-6 h-full justify-center min-h-[500px] animate-fade-in">
      <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
        <Check className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900">Foto Tersimpan!</h3>
        <p className="text-[12px] text-slate-500 font-bold leading-relaxed px-4">
          Scan QR Code di bawah untuk mengunduh foto dari handphone Anda.
          <br />
          <span className="text-rose-500">*QR Code & Foto hanya berlaku selama 1 jam.</span>
        </p>
      </div>

      {/* QR Codes Grid */}
      <div className={`grid gap-4 w-full ${liveQrDataUrl ? 'grid-cols-2' : 'grid-cols-1 max-w-[220px] mx-auto'}`}>
        {/* Foto QR */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
            <img
              src={qrDataUrl}
              alt="QR Code Foto"
              className="w-36 h-36 rounded-lg"
            />
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
            📸 Unduh Foto
          </span>
        </div>

        {/* Live Photo QR (jika ada video) */}
        {liveQrDataUrl && (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-violet-50 border border-violet-200 rounded-2xl shadow-inner">
              <img
                src={liveQrDataUrl}
                alt="QR Code Live Photo"
                className="w-36 h-36 rounded-lg"
              />
            </div>
            <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-wide">
              🎬 Live Video
            </span>
          </div>
        )}
      </div>

      <div className="w-full space-y-3 pt-2">
        <button
          onClick={onDownload}
          className="w-full group flex items-center justify-center gap-2 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-2xl text-[13px] font-extrabold shadow-md hover:scale-[1.01] active:scale-98 transition cursor-pointer"
        >
          <Download className="h-4 w-4 group-hover:scale-110 transition" /> Download File Asli
        </button>
        <button
          onClick={onNewSession}
          className="w-full group flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[13px] font-extrabold transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Mulai Sesi Baru
        </button>
      </div>
    </div>
  );
}
