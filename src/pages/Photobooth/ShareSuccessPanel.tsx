import React from 'react';
import { Check, Download, ArrowLeft } from 'lucide-react';

interface ShareSuccessPanelProps {
  qrDataUrl: string;
  onDownload: () => void;
  onNewSession: () => void;
}

export default function ShareSuccessPanel({
  qrDataUrl,
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
          Scan QR Code di bawah ini untuk mengunduh foto Anda dari handphone. Tidak bisa diedit lagi karena foto sudah final.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl shadow-inner inline-block">
        <img 
          src={qrDataUrl}
          alt="QR Code"
          className="w-44 h-44 rounded-xl"
        />
      </div>

      <div className="w-full space-y-3 pt-4">
        <button
          onClick={onDownload}
          className="w-full group flex items-center justify-center gap-2 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-2xl text-[13px] font-extrabold shadow-md hover:scale-[1.01] active:scale-98 transition cursor-pointer"
        >
          <Download className="h-4.5 w-4.5 group-hover:scale-110 transition" /> Download File Asli
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
