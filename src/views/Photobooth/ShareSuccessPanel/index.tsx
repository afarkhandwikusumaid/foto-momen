import React, { useState } from 'react';
import { Check, Download, ArrowLeft, Share2, Copy, MessageCircle, Instagram } from 'lucide-react';
import Swal from 'sweetalert2';

interface ShareSuccessPanelProps {
  qrDataUrl: string;
  liveQrDataUrl?: string;
  shareUrl: string;
  imageUrl: string;
  onDownload: () => void;
  onNewSession: () => void;
}

export default function ShareSuccessPanel({
  qrDataUrl,
  liveQrDataUrl,
  shareUrl,
  imageUrl,
  onDownload,
  onNewSession
}: ShareSuccessPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: 'Link berhasil disalin!'
      });
    } catch (err) {
      console.error('Gagal menyalin link:', err);
    }
  };

  const handleWhatsAppShare = () => {
    // Share the clean share web page URL. In production, WhatsApp will read the OpenGraph tags and show the photo strip preview.
    const text = `Lihat foto seru kami dari FotoMomen! 📸✨\n\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleInstagramShare = () => {
    // Copy the link first
    handleCopyLink();
    // Explain because Instagram web doesn't support sharing URL directly
    Swal.fire({
      title: 'Salin Link Instagram',
      html: 'Link sudah disalin ke clipboard!<br/><br/>Buka aplikasi <b>Instagram</b>, lalu tempelkan link ini di <b>Instagram Story (Link Sticker)</b> atau <b>Bio</b> Anda untuk berbagi! 💖',
      icon: 'info',
      confirmButtonText: 'Buka Instagram',
      showCancelButton: true,
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#E1306C'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('https://instagram.com', '_blank');
      }
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Foto Momen Bersama',
          text: 'Lihat foto seru kami dari FotoMomen! 📸✨',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center space-y-5 h-full justify-center min-h-[500px] animate-fade-in select-none">
      <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
        <Check className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900">Foto Tersimpan!</h3>
        <p className="text-[12px] text-slate-500 font-bold leading-relaxed px-4">
          Scan QR Code di bawah untuk mengunduh foto dari handphone Anda.
          <br />
          <span className="text-rose-500">*QR Code & Foto hanya berlaku selama 15 menit.</span>
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

      {/* Share Section */}
      <div className="w-full space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
          Bagikan ke Sosial Media
        </span>
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-2xl text-[12px] font-bold shadow-sm transition hover:scale-[1.01] active:scale-98 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 fill-white text-[#25D366]" />
            WhatsApp
          </button>
          
          <button
            onClick={handleInstagramShare}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white rounded-2xl text-[12px] font-bold shadow-sm transition hover:scale-[1.01] active:scale-98 cursor-pointer"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </button>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-[12px] font-bold transition cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Link Disalin!' : 'Salin Link'}
          </button>

          {typeof navigator !== 'undefined' && !!(navigator as any).share && (
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition cursor-pointer"
              title="Bagikan Lainnya"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={onDownload}
          className="w-full group flex items-center justify-center gap-2 py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-2xl text-[13px] font-extrabold shadow-md hover:scale-[1.01] active:scale-98 transition cursor-pointer"
        >
          <Download className="h-4 w-4 group-hover:scale-110 transition" /> Download File Asli
        </button>
        <button
          onClick={onNewSession}
          className="w-full group flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl text-[12px] font-bold transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Sesi Baru
        </button>
      </div>
    </div>
  );
}
