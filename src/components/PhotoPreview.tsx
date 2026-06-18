import React, { useRef, useState, useEffect } from 'react';
import { Download, Palette, Sparkles, Wand2, ArrowLeft, Type, Calendar, Image as ImageIcon, Cloud, Check } from 'lucide-react';
import { FrameLayout, FrameColor, PhotoFilter, PhotoCount, BorderStyle } from '../types';
import { uploadPhotoSession } from '../firebase/config';
import confetti from 'canvas-confetti';

interface PhotoPreviewProps {
  layout: FrameLayout;
  frameColor: FrameColor;
  photoCount: PhotoCount;
  borderStyle: BorderStyle;
  capturedPhotos: string[];
  onBackToSelector: () => void;
}

const FILTERS = [
  { id: 'original', name: 'Original', desc: 'Asli tanpa filter' },
  { id: 'grayscale', name: 'B&W Classic', desc: 'Hitam & putih dramatis' },
  { id: 'sepia', name: 'Retro Sepia', desc: 'Nuansa hangat kecokelatan' },
  { id: 'vivid', name: 'Vivid Warm', desc: 'Saturasi & kontras tinggi' },
  { id: 'cool', name: 'Cyberpunk Cool', desc: 'Warna dingin & neon' },
  { id: 'instant', name: 'Instant Wash', desc: 'Gaya film analog pudar' },
];

const EMOJIS = ['✨', '💕', '🌸', '🌟', '👑', '🎀', '🎈', '🎉'];

export default function PhotoPreview({
  layout,
  frameColor,
  photoCount,
  borderStyle,
  capturedPhotos,
  onBackToSelector,
}: PhotoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('original');
  const [stickerText, setStickerText] = useState('🌟 Foto Momen 🌟');
  const [showDate, setShowDate] = useState(true);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [finalImageBase64, setFinalImageBase64] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);

  // Firebase share states
  const [shareResult, setShareResult] = useState<{
    shareUrl: string;
    imageUrl: string;
    qrDataUrl: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]
    );
  };

  useEffect(() => {
    const renderCanvas = async () => {
      setIsProcessing(true);
      await document.fonts.ready; // Wait for fonts to load
      
      // Allow DOM to update canvas dimensions before drawing
      setTimeout(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        
        let borderPadding = 35;
        if (borderStyle === 'thin') borderPadding = 20;
        if (borderStyle === 'thick') borderPadding = 55;

        // Tentukan dimensi canvas
        if (layout === 'vertical-strip') {
          width = 600;
          const photoW = width - (borderPadding * 2);
          const photoH = (photoW * 3) / 4;
          height = (borderPadding * 2) + (photoCount * photoH) + ((photoCount - 1) * 20) + 120; // +120 for footer text
        } else if (layout === 'triple-strip') {
          width = 600;
          height = 1420;
        } else if (layout === 'grid-2x2') {
          width = 800;
          height = 960;
        } else { // single-polar
          width = 600;
          height = borderPadding * 2 + 450 + 150 + 150; // hero + small + footer approx
        }

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = frameColor.hex;
        ctx.fillRect(0, 0, width, height);

        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
          });
        };

        const loadedImages = await Promise.all(capturedPhotos.slice(0, photoCount).map(loadImage));

        ctx.save();
        switch (selectedFilter) {
          case 'grayscale': ctx.filter = 'grayscale(100%) contrast(105%)'; break;
          case 'sepia': ctx.filter = 'sepia(100%) contrast(100%) brightness(95%)'; break;
          case 'vivid': ctx.filter = 'saturate(150%) contrast(110%) brightness(100%)'; break;
          case 'cool': ctx.filter = 'hue-rotate(15deg) saturate(115%) contrast(105%)'; break;
          case 'instant': ctx.filter = 'contrast(90%) brightness(105%) sepia(15%) saturate(125%)'; break;
          default: ctx.filter = 'none';
        }

        if (layout === 'vertical-strip') {
          const padding = borderPadding;
          const spacing = 20;
          const photoW = width - (padding * 2);
          const photoH = (photoW * 3) / 4;

          loadedImages.forEach((img, index) => {
            const dy = padding + index * (photoH + spacing);
            // Gambar normal (tidak mirror)
            ctx.drawImage(img, padding, dy, photoW, photoH);
          });

        } else if (layout === 'triple-strip') {
          const padding = borderPadding;
          const spacing = 25;
          const photoW = width - (padding * 2);
          const photoH = (photoW * 3) / 4;
          
          loadedImages.slice(0, 3).forEach((img, index) => {
            const dy = padding + index * (photoH + spacing);
            ctx.drawImage(img, padding, dy, photoW, photoH);
          });

        } else if (layout === 'grid-2x2') {
          const padding = borderPadding;
          const gap = 25;
          const photoW = (width - (padding * 2) - gap) / 2;
          const photoH = (photoW * 3) / 4;

          const positions = [
            { x: padding, y: padding },
            { x: padding + photoW + gap, y: padding },
            { x: padding, y: padding + photoH + gap },
            { x: padding + photoW + gap, y: padding + photoH + gap }
          ];

          loadedImages.slice(0, 4).forEach((img, index) => {
            const pos = positions[index];
            if (pos) {
               ctx.drawImage(img, pos.x, pos.y, photoW, photoH);
            }
          });

        } else { // single-polar (1 besar + 3 kecil horizontal)
          const padding = borderPadding;
          const heroW = width - (padding * 2);
          const heroH = (heroW * 3) / 4;

          if (loadedImages[0]) {
            ctx.drawImage(loadedImages[0], padding, padding, heroW, heroH);
          }

          const remainingImages = loadedImages.slice(1);
          if (remainingImages.length > 0) {
            const gap = 15;
            const smallW = (heroW - (gap * (remainingImages.length - 1))) / remainingImages.length;
            const smallH = (smallW * 3) / 4;
            const startY = padding + heroH + gap;

            remainingImages.forEach((img, idx) => {
              const dx = padding + idx * (smallW + gap);
              ctx.drawImage(img, dx, startY, smallW, smallH);
            });
          }
        }

        ctx.restore(); // Hapus filter untuk teks/emoji

        // Dekorasi Emoji
        if (selectedEmojis.length > 0) {
           ctx.font = '36px sans-serif';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           // Render emojis across the top border
           selectedEmojis.forEach((emoji, i) => {
             const x = borderPadding + (width - borderPadding * 2) * ((i + 1) / (selectedEmojis.length + 1));
             const y = borderPadding / 2 + 10;
             ctx.fillText(emoji, x, y);
           });
        }

        // Teks Footer
        ctx.fillStyle = frameColor.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let textY = height - 70;
        if (layout === 'grid-2x2') textY = height - 85;
        if (layout === 'single-polar') textY = height - 80;

        if (stickerText) {
          ctx.font = 'bold 32px "Playfair Display", serif';
          ctx.fillText(stickerText, width / 2, textY);
        }

        if (showDate) {
          const dateStr = new Date().toLocaleDateString('id-ID', { 
            day: 'numeric', month: 'long', year: 'numeric' 
          });
          ctx.font = '16px "DM Sans", sans-serif';
          ctx.fillText(dateStr, width / 2, textY + 35);
        }

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        setFinalImageBase64(dataUrl);
        setIsProcessing(false);
      }, 0);
    };

    renderCanvas();
  }, [layout, frameColor, photoCount, borderStyle, capturedPhotos, selectedFilter, stickerText, showDate, selectedEmojis]);

  const handleDownloadImage = () => {
    if (!finalImageBase64) return;
    const link = document.createElement('a');
    link.download = `foto_momen_${Date.now()}.png`;
    link.href = finalImageBase64;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleUploadAndShare = async () => {
    if (!finalImageBase64 || isUploading) return;
    setIsUploading(true);
    try {
      const result = await uploadPhotoSession(finalImageBase64, {
        layout,
        frameColorId: frameColor.id,
        filter: selectedFilter,
        stickerText,
        showDate,
      });

      // Generate QR Code from share URL using dynamic import
      const QRCode = await import('qrcode');
      const qrDataUrl = await QRCode.default.toDataURL(result.shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f2342',  // blue-900 (dark dots)
          light: '#ffffff', // white bg
        },
      });

      setShareResult({ ...result, qrDataUrl });

      // Confetti celebration!
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Upload gagal:', err);
      alert('Gagal mengunggah foto ke Cloud. Pastikan konfigurasi Firebase Anda sudah diisi dengan benar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareResult) {
      navigator.clipboard.writeText(shareResult.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in text-slate-800 relative">
      
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <Sparkles className="h-3 w-3 text-blue-600" /> Langkah 3 dari 3: Sentuhan Akhir & Berbagi
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-3 select-none">
          Kustomisasi Hasil Fotomu
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panel Kiri: Edit Options */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          
          {/* Edit Filter */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-md">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-850 uppercase tracking-widest mb-4">
              <Wand2 className="h-4.5 w-4.5 text-blue-600" /> Pilih Filter Final
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id as PhotoFilter)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedFilter === filter.id
                      ? 'border-blue-500 bg-blue-50 text-blue-750 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <p className="text-[11px] font-bold leading-tight">{filter.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stiker Emojis */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-md">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-850 uppercase tracking-widest mb-4">
              <ImageIcon className="h-4.5 w-4.5 text-blue-600" /> Ornamen Emoji
            </h3>
            <div className="flex flex-wrap gap-2">
               {EMOJIS.map(em => (
                 <button
                   key={em}
                   onClick={() => toggleEmoji(em)}
                   className={`h-10 w-10 text-xl flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                     selectedEmojis.includes(em) ? 'border-blue-500 bg-blue-50 shadow-sm scale-110' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 grayscale hover:grayscale-0'
                   }`}
                 >
                   {em}
                 </button>
               ))}
            </div>
          </div>

          {/* Edit Teks & Tanggal */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-md">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-850 uppercase tracking-widest mb-4">
              <Type className="h-4.5 w-4.5 text-blue-600" /> Teks Bawah
            </h3>
            
            <input
              type="text"
              maxLength={40}
              value={stickerText}
              onChange={(e) => setStickerText(e.target.value)}
              placeholder="Teks judul acara..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 bg-slate-50"
            />
            
            <label className="flex items-center gap-2 mt-4 cursor-pointer text-sm font-bold text-slate-700">
              <input 
                 type="checkbox" 
                 checked={showDate} 
                 onChange={e => setShowDate(e.target.checked)}
                 className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 border-slate-300" 
              />
              <Calendar className="w-4 h-4 text-slate-400" /> Tampilkan Tanggal Hari Ini
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleUploadAndShare}
              disabled={isProcessing || isUploading}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-extrabold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengupload ke Cloud...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-5 w-5" />
                  <span>Simpan ke Cloud & Dapatkan QR</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isProcessing}
              className="group flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-base font-extrabold shadow-md active:scale-98 transition cursor-pointer"
            >
              <Download className="h-4.5 w-4.5 group-hover:scale-110 transition text-blue-300" />
              <span>Download Foto</span>
            </button>
            
            <button
              onClick={onBackToSelector}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-400 font-bold hover:text-slate-600 transition mt-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
          </div>

        </div>

        {/* Panel Kanan: Live Render Preview Canvas */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center">
          <div className="w-full bg-slate-100/60 border border-slate-200 p-4 md:p-8 rounded-3xl flex flex-col items-center justify-center shadow-inner relative min-h-[500px]">
            
            {isProcessing && (
              <div className="absolute inset-0 z-10 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                 <span className="text-xs font-bold text-slate-550 uppercase tracking-widest font-mono">Rendering...</span>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {finalImageBase64 && (
              <img
                src={finalImageBase64}
                alt="Foto Momen Render Final"
                className={`max-w-full rounded-xl border border-slate-200 shadow-2xl transition-all duration-300 ease-out 
                  ${layout === 'vertical-strip' || layout === 'triple-strip' ? 'h-[500px] md:h-[650px]' : 'h-[360px] md:h-[500px]'} 
                  object-contain bg-white
                `}
              />
            )}
          </div>
        </div>

      </div>

      {/* Modal Share Result - Light Elegant Card with Overlay */}
      {shareResult && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in text-slate-800">
          <div className="bg-white border border-blue-100 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative max-h-[95vh] overflow-y-auto">
            
            {/* Header */}
            <div className="mb-6">
              <span className="text-4xl">🎉</span>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 leading-tight">Foto Berhasil Dibagikan!</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">Scan QR Code di bawah atau salin link untuk membuka foto dari perangkat lain</p>
            </div>

            {/* QR Code Graphic Container */}
            <div className="bg-slate-50 rounded-2xl p-4 inline-block mb-6 shadow-md border border-slate-200">
              <img 
                src={shareResult.qrDataUrl} 
                alt="QR Code Share" 
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain mx-auto rounded-lg"
              />
              <p className="text-[10px] font-bold text-blue-700 mt-2.5 font-mono uppercase tracking-widest">Scan untuk buka foto</p>
            </div>

            {/* Copyable Share URL Bar */}
            <div className="flex gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl mb-6">
              <input
                type="text"
                readOnly
                value={shareResult.shareUrl}
                className="flex-1 bg-transparent text-slate-700 text-xs font-mono outline-none px-2 select-all overflow-hidden text-ellipsis whitespace-nowrap"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : null}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadImage}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 transition cursor-pointer"
              >
                Download Foto
              </button>
              <button
                onClick={() => setShareResult(null)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
