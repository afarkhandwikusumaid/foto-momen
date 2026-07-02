import React, { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { FrameLayout, FrameColor, PhotoFilter, PhotoCount } from '../../types';
import Swal from 'sweetalert2';
import { uploadPhotoSession, getFrameTemplates } from '../../services/dbService';
import confetti from 'canvas-confetti';
import BeautySliders from './BeautySliders';
import LiveGifPreview, { LiveGifPreviewRef } from './LiveGifPreview';
import PhotoPreviewControls from './PhotoPreviewControls';
import ShareSuccessPanel from './ShareSuccessPanel';

interface PhotoPreviewProps {
  frameColor: FrameColor;
  photoCount: PhotoCount;
  capturedPhotos: string[];
  capturedVideos: Blob[];
  onBackToSelector: () => void;
}

export const FILTERS = [
  { id: 'original', name: 'Original', css: 'none' },
  { id: 'grayscale', name: 'B&W Classic', css: 'grayscale(100%) contrast(105%)' },
  { id: 'sepia', name: 'Retro Sepia', css: 'sepia(100%) contrast(100%) brightness(95%)' },
  { id: 'vivid', name: 'Vivid Warm', css: 'saturate(150%) contrast(110%) brightness(100%)' },
  { id: 'cool', name: 'Cyber Cool', css: 'hue-rotate(15deg) saturate(115%) contrast(105%)' },
  { id: 'instant', name: 'Instant Wash', css: 'contrast(90%) brightness(105%) sepia(15%) saturate(125%)' },
];

export interface FramePattern {
  id: string;
  name: string;
  icon: string;
  previewClass?: string;
}

export const FRAME_PATTERNS: FramePattern[] = [
  { id: 'none', name: 'Polos', icon: '🚫', previewClass: 'bg-slate-100 flex items-center justify-center text-slate-400 font-bold' },
  { id: 'dots', name: 'Polka Dots', icon: '⚫', previewClass: 'bg-[radial-gradient(#cfd8dc_20%,transparent_20%)] [background-size:8px_8px] bg-white' },
  { id: 'stars', name: 'Bintang', icon: '★', previewClass: 'bg-white flex items-center justify-center text-blue-500 font-bold text-lg' },
  { id: 'grid', name: 'Kotak-Kotak', icon: '🌐', previewClass: 'bg-[linear-gradient(to_right,#eceff1_1px,transparent_1px),linear-gradient(to_bottom,#eceff1_1px,transparent_1px)] [background-size:10px_10px] bg-white' },
  { id: 'hearts', name: 'Hati', icon: '♥', previewClass: 'bg-white flex items-center justify-center text-rose-500 font-bold text-lg animate-pulse' },
  { id: 'flowers', name: 'Bunga', icon: '✿', previewClass: 'bg-white flex items-center justify-center text-emerald-500 font-bold text-lg' },
];

function drawPattern(ctx: CanvasRenderingContext2D, patternId: string, width: number, height: number, frameColor: FrameColor) {
  ctx.save();
  const isLight = isColorLight(frameColor.hex);
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.22)';
  ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';

  if (patternId === 'dots') {
    const spacing = 35;
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.arc(x + (y % 2 ? spacing / 2 : 0), y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternId === 'stars') {
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const spacing = 50;
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        ctx.fillText('★', x + (y % 2 ? spacing / 2 : 0), y);
      }
    }
  } else if (patternId === 'grid') {
    ctx.lineWidth = 1.5;
    const spacing = 30;
    ctx.beginPath();
    for (let x = 0; x < width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  } else if (patternId === 'hearts') {
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const spacing = 45;
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        ctx.fillText('♥', x + (y % 2 ? spacing / 2 : 0), y);
      }
    }
  } else if (patternId === 'flowers') {
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const spacing = 50;
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        ctx.fillText('✿', x + (y % 2 ? spacing / 2 : 0), y);
      }
    }
  }
  ctx.restore();
}

function isColorLight(hex: string): boolean {
  if (!hex || hex.startsWith('linear-gradient') || !hex.startsWith('#')) return true;
  const rgb = parseInt(hex.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 180;
}

export default function PhotoPreview({
  frameColor,
  photoCount,
  capturedPhotos,
  capturedVideos,
  onBackToSelector,
}: PhotoPreviewProps) {
  const layout: FrameLayout = (frameColor.layout as FrameLayout) || 'vertical-strip';
  // onColorSelect is no longer needed (frame is fixed once selected)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('original');
  const [selectedPattern, setSelectedPattern] = useState<string>('none');
  const [stickerText, setStickerText] = useState('🌟 Foto Momen 🌟');
  const [showDate, setShowDate] = useState(true);
  const [finalImageBase64, setFinalImageBase64] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [activePreviewTab, setActivePreviewTab] = useState<'print' | 'live'>('print');
  const liveGifRef = useRef<LiveGifPreviewRef>(null);

  // Beauty Retouch sliders states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [smoothing, setSmoothing] = useState(0);

  const [shareResult, setShareResult] = useState<{
    shareUrl: string;
    imageUrl: string;
    qrDataUrl: string;
    videoUrl?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load admin custom templates for color reference only
  const [customTemplates, setCustomTemplates] = useState<FrameColor[]>([]);
  useEffect(() => {
    getFrameTemplates().then(data => {
      if (data && data.length > 0) {
        setCustomTemplates(data.map(t => ({
          id: t.id,
          name: t.name,
          bgClass: 'bg-custom',
          hex: t.hex,
          textColor: t.textColor || '#ffffff',
          borderClass: t.borderClass || 'border-slate-200'
        })));
      }
    }).catch(console.error);
  }, []);

  const allFrameColors = [...customTemplates];

  useEffect(() => {
    const renderCanvas = async () => {
      setIsProcessing(true);
      await document.fonts.ready; // Wait for Google fonts to register
      
      setTimeout(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Wajib untuk Supabase Storage URL
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        };

        let frameImgOverlay: HTMLImageElement | null = null;
        if (frameColor.imageUrl) {
          try {
            frameImgOverlay = await loadImage(frameColor.imageUrl);
          } catch (err) {
            console.error('Gagal memuat gambar frame kustom:', err);
          }
        }

        let width = 0;
        let height = 0;
        const borderPadding = 35;

        // Use custom frame dimensions if available
        if (frameImgOverlay) {
          width = frameImgOverlay.width;
          height = frameImgOverlay.height;
        } else {
          // Fallback to legacy layout dimensions
          if (layout === 'vertical-strip') {
            width = 600;
            const photoW = width - (borderPadding * 2);
            const photoH = (photoW * 3) / 4;
            height = (borderPadding * 2) + (photoCount * photoH) + ((photoCount - 1) * 20) + 120;
          } else if (layout === 'triple-strip') {
            width = 600;
            height = 1420;
          } else if (layout === 'grid-2x2') {
            width = 800;
            height = 960;
          } else { // single-polar
            width = 600;
            height = borderPadding * 2 + 450 + 150 + 150;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw card frame background
        ctx.fillStyle = frameColor.hex;
        ctx.fillRect(0, 0, width, height);

        // Draw Frame Texture Pattern Overlay (Polka, Stars, Grid, etc.)
        drawPattern(ctx, selectedPattern, width, height, frameColor);

        const loadedImages = await Promise.all(capturedPhotos.slice(0, photoCount).map(loadImage));

        // Save context and apply combined CSS filter adjustments (Static filter + custom beauty sliders)
        ctx.save();
        const activeFilterObj = FILTERS.find(f => f.id === selectedFilter);
        const filterBase = activeFilterObj && activeFilterObj.id !== 'original' ? activeFilterObj.css : '';
        const beautyAdjustments = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${smoothing}px)`;
        ctx.filter = filterBase ? `${filterBase} ${beautyAdjustments}` : beautyAdjustments;

        if (frameColor.photoAreas && frameColor.photoAreas.length > 0) {
           // Dynamic positioning based on detected transparent holes
           loadedImages.slice(0, frameColor.photoAreas.length).forEach((img, index) => {
             const area = frameColor.photoAreas![index];
             if (area) {
               const dx = (area.x / 100) * width;
               const dy = (area.y / 100) * height;
               const dw = (area.width / 100) * width;
               const dh = (area.height / 100) * height;
               
               // Implement object-cover logic to prevent squishing
               const imgAspect = img.width / img.height;
               const destAspect = dw / dh;
               
               let sx, sy, sw, sh;
               
               if (imgAspect > destAspect) {
                 // Image is too wide, crop horizontally
                 sh = img.height;
                 sw = img.height * destAspect;
                 sx = (img.width - sw) / 2;
                 sy = 0;
               } else {
                 // Image is too tall, crop vertically
                 sw = img.width;
                 sh = img.width / destAspect;
                 sx = 0;
                 sy = (img.height - sh) / 2;
               }
               
               // Draw the image with cropping (object-cover)
               ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
             }
           });
        } else if (layout === 'vertical-strip') {
          const padding = borderPadding;
          const spacing = 20;
          const photoW = width - (padding * 2);
          const photoH = (photoW * 3) / 4;

          loadedImages.forEach((img, index) => {
            const dy = padding + index * (photoH + spacing);
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

        } else { // single-polar
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

        // Restore context (remove filters) to draw clean text overlays
        ctx.restore();

        // Draw Custom Frame Image Overlay (Canva Style)
        if (frameImgOverlay) {
          ctx.drawImage(frameImgOverlay, 0, 0, width, height);
        }

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        setFinalImageBase64(dataUrl);
        setIsProcessing(false);
      }, 50);
    };

    renderCanvas();
  }, [
    layout, frameColor, photoCount, capturedPhotos, selectedFilter, selectedPattern,
    stickerText, showDate, customTemplates,
    brightness, contrast, saturation, smoothing
  ]);

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
      let videoBlob: Blob | undefined;
      if (capturedVideos && capturedVideos.length > 0 && liveGifRef.current) {
        try {
          videoBlob = await liveGifRef.current.generateVideoBlob();
        } catch (e) {
          console.error('Gagal men-generate video blob:', e);
        }
      }

      const result = await uploadPhotoSession(finalImageBase64, {
        layout,
        frameColorId: frameColor.id,
        filter: selectedFilter,
        stickerText,
        showDate
      }, videoBlob);

      // Generate QR code for share URL
      const QRCode = await import('qrcode');
      const qrDataUrl = await QRCode.default.toDataURL(result.shareUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#0f2342', light: '#ffffff' },
      });

      // Generate separate QR for live video if available
      let liveQrDataUrl: string | undefined;
      if (result.videoUrl) {
        liveQrDataUrl = await QRCode.default.toDataURL(result.videoUrl, {
          width: 300,
          margin: 2,
          color: { dark: '#6d28d9', light: '#ffffff' },
        });
      }

      setShareResult({ ...result, qrDataUrl, liveQrDataUrl });
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Upload gagal:', err);
      const errMsg = err?.message || 'Gagal mengunggah foto ke Cloud. Silakan periksa koneksi internet Anda.';
      Swal.fire({
        title: 'Upload Gagal',
        text: errMsg,
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 relative animate-fade-in text-slate-800">
      
      {/* Title */}
      <div className="mb-6 select-none">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-650 animate-pulse" /> Hias Momen Bahagiamu
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Hias cetak foto dengan live filter, retouch kecantikan, ganti warna frame, dan judul acara.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Render Preview Canvas (Swapped to Left) */}
        <div className="lg:col-span-5 order-1 flex flex-col items-center lg:sticky lg:top-24 space-y-4">
          
          {/* View Switcher Tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full max-w-[280px] shadow-inner select-none font-bold border border-slate-200">
            <button
              onClick={() => setActivePreviewTab('print')}
              className={`flex-1 py-2 text-center text-xs rounded-xl cursor-pointer transition duration-150 ${
                activePreviewTab === 'print'
                  ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cetak Foto Strip 📸
            </button>
            <button
              onClick={() => setActivePreviewTab('live')}
              className={`flex-1 py-2 text-center text-xs rounded-xl cursor-pointer transition duration-150 ${
                activePreviewTab === 'live'
                  ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Live Photo GIF 🎬
            </button>
          </div>

          <div className="w-full bg-slate-100/50 border border-slate-200 p-2 sm:p-4 md:p-6 rounded-3xl flex flex-col items-center justify-center shadow-inner relative min-h-[400px] md:min-h-[480px]">
            
            {isProcessing && (
              <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Rendering Canvas...</span>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {activePreviewTab === 'print' ? (
              finalImageBase64 && (
                <img
                  src={finalImageBase64}
                  alt="Foto Momen Render Final"
                  className="max-w-full rounded-2xl border border-slate-200/50 shadow-2xl transition-all duration-300 ease-out max-h-[55vh] sm:max-h-[500px] md:max-h-[650px] w-auto object-contain bg-white"
                />
              )
            ) : (
              <LiveGifPreview
                ref={liveGifRef}
                photos={capturedPhotos}
                videos={capturedVideos}
                filterCss={FILTERS.find(f => f.id === selectedFilter)?.css || 'none'}
                frame={frameColor}
                caption={stickerText}
              />
            )}
          </div>
        </div>

        {/* Right Column: Edit Options */}
        <div className="lg:col-span-7 order-2 space-y-6">
          {shareResult ? (
            <ShareSuccessPanel 
              qrDataUrl={shareResult.qrDataUrl}
              liveQrDataUrl={shareResult.liveQrDataUrl}
              onDownload={handleDownloadImage}
              onNewSession={() => {
                setShareResult(null);
                onBackToSelector();
              }}
            />
          ) : (
            <PhotoPreviewControls 
              allFrameColors={allFrameColors}
              frameColor={frameColor}
              selectedPattern={selectedPattern}
              setSelectedPattern={setSelectedPattern}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              capturedPhotos={capturedPhotos}
              brightness={brightness}
              setBrightness={setBrightness}
              contrast={contrast}
              setContrast={setContrast}
              saturation={saturation}
              setSaturation={setSaturation}
              smoothing={smoothing}
              setSmoothing={setSmoothing}
              stickerText={stickerText}
              setStickerText={setStickerText}
              showDate={showDate}
              setShowDate={setShowDate}
              handleDownloadImage={handleDownloadImage}
              handleUploadAndShare={handleUploadAndShare}
              isProcessing={isProcessing}
              isUploading={isUploading}
              onBackToSelector={onBackToSelector}
            />
          )}
        </div>

      </div>
    </div>
  );
}
