import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, Play, HelpCircle, Timer, Palette } from 'lucide-react';
import { FrameLayout, PhotoCount } from '../types';

const WebcamComponent = Webcam as any;

interface CameraBoothProps {
  layout: FrameLayout;
  photoCount: PhotoCount;
  onPhotosCaptured: (photos: string[]) => void;
  onBack: () => void;
}

const LIVE_FILTERS = [
  { id: 'none', label: 'Natural', css: 'none' },
  { id: 'soft', label: 'Soft Glow', css: 'brightness(1.08) contrast(0.95) saturate(1.1)' },
  { id: 'bw', label: 'B&W', css: 'grayscale(100%) contrast(1.1)' },
  { id: 'warm', label: 'Warm', css: 'sepia(30%) saturate(1.3) brightness(1.05)' },
  { id: 'cool', label: 'Cool', css: 'hue-rotate(15deg) saturate(1.2) brightness(1.02)' },
  { id: 'vivid', label: 'Vivid', css: 'saturate(1.6) contrast(1.1)' },
];

const COUNTDOWN_OPTIONS = [3, 5, 10];

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export default function CameraBooth({ layout, photoCount, onPhotosCaptured, onBack }: CameraBoothProps) {
  const webcamRef = useRef<any>(null);

  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Siap berfoto? Klik tombol di bawah!');
  
  const [selectedLiveFilter, setSelectedLiveFilter] = useState(LIVE_FILTERS[0]);
  const [countdownDuration, setCountdownDuration] = useState(3);

  // Ref to track the actual countdown value to avoid stale closures in setInterval
  const countdownRef = useRef<number>(countdownDuration);

  // Keep countdownRef in sync with countdownDuration when changing duration options
  useEffect(() => {
    countdownRef.current = countdownDuration;
  }, [countdownDuration]);

  const handleReset = () => {
    setCapturedPhotos([]);
    setIsCapturing(false);
    setCurrentPoseIndex(0);
    setCountdown(null);
    setShowFlash(false);
    setStatusMessage('Siap berfoto? Klik tombol di bawah!');
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Webcam permission denied or hardware error:", error);
    setCameraPermissionError(true);
  };

  const captureScreenshot = useCallback(() => {
    if (webcamRef.current) {
      // Create a temporary canvas to apply the CSS filter directly into the captured image
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = selectedLiveFilter.css;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/png');
        
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);

        setCapturedPhotos((prev) => {
          const updated = [...prev, imageSrc];
          if (updated.length === photoCount) {
            setIsCapturing(false);
            setStatusMessage('Selesai! Memproses fotomu...');
            setTimeout(() => {
              onPhotosCaptured(updated);
            }, 800);
          }
          return updated;
        });
      }
    }
  }, [onPhotosCaptured, photoCount, selectedLiveFilter]);

  // Handle Capture Sequence
  useEffect(() => {
    if (!isCapturing) return;

    if (capturedPhotos.length >= photoCount) {
      setIsCapturing(false);
      return;
    }

    const nextPose = capturedPhotos.length;
    setCurrentPoseIndex(nextPose);
    setStatusMessage(`Bersiap untuk Pose Ke-${nextPose + 1}!`);
    
    // Set initial countdown values
    setCountdown(countdownDuration);
    countdownRef.current = countdownDuration;
    
    const countdownTimer = setInterval(() => {
      countdownRef.current -= 1;
      
      if (countdownRef.current <= 0) {
        clearInterval(countdownTimer);
        setCountdown(null);
        captureScreenshot();
      } else {
        setCountdown(countdownRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, [isCapturing, capturedPhotos.length, captureScreenshot, photoCount, countdownDuration]);

  const startPhotoSession = () => {
    setCapturedPhotos([]);
    setIsCapturing(true);
    setCurrentPoseIndex(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative animate-fade-in text-slate-800">
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[9999] opacity-100 pointer-events-none transition-opacity duration-200" />
      )}

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-705">
          <Sparkles className="h-3 w-3 text-blue-600" /> Langkah 2 dari 3: Ambil Pose Terbaikmu
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-2 select-none">
          Kamera Booth
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Kamera akan mengambil <strong className="text-blue-600 font-bold">{photoCount} pose berturut-turut</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2">
               <Timer className="w-4 h-4 text-slate-400" />
               <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg">
                 {COUNTDOWN_OPTIONS.map(sec => (
                   <button 
                      key={sec}
                      disabled={isCapturing}
                      onClick={() => setCountdownDuration(sec)}
                      className={`text-xs px-3 py-1 rounded-md transition font-bold cursor-pointer ${
                        countdownDuration === sec 
                          ? 'bg-white shadow text-blue-700' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                   >
                     {sec}s
                   </button>
                 ))}
               </div>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase font-mono">
              Pose {currentPoseIndex + 1} / {photoCount}
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] max-w-md sm:max-w-xl bg-slate-950 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
            {!cameraPermissionError ? (
              <div className="w-full h-full relative">
                <WebcamComponent
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={videoConstraints}
                  onUserMediaError={handleUserMediaError}
                  className="w-full h-full object-cover scale-x-[-1]" 
                  style={{ filter: selectedLiveFilter.css }}
                />

                <div className="absolute inset-0 pointer-events-none border border-white/10 grid grid-cols-3 grid-rows-3 opacity-10">
                  {Array.from({length: 9}).map((_, i) => <div key={i} className="border border-white/5"></div>)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-450">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-3 animate-bounce" />
                <h4 className="font-bold text-slate-800 text-lg">Akses Kamera Diperlukan</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Aplikasi ini membutuhkan akses kamera. Silakan izinkan akses kamera pada peramban web Anda dan segarkan halaman.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Segarkan Halaman
                </button>
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                <div className="animate-ping absolute h-32 w-32 rounded-full border-4 border-blue-550 opacity-70"></div>
                <div className="bg-slate-900/90 text-white rounded-full h-24 w-24 flex items-center justify-center shadow-2xl border-2 border-blue-500 scale-110">
                  <span className="text-4xl font-extrabold font-display leading-none animate-bounce">{countdown}</span>
                </div>
                <span className="text-white text-sm font-bold uppercase tracking-wider mt-4 px-3 py-1 rounded bg-blue-600/80 shadow border border-blue-500/20">
                  Pose Ke {currentPoseIndex + 1}
                </span>
              </div>
            )}
          </div>

          {/* Live Filters Strip */}
          <div className="w-full max-w-xl mt-4">
             <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-slate-550" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Filters</span>
             </div>
             <div className="flex overflow-x-auto pb-2 gap-2 snap-x hide-scrollbar">
                {LIVE_FILTERS.map(f => (
                  <button
                    key={f.id}
                    disabled={isCapturing}
                    onClick={() => setSelectedLiveFilter(f)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition snap-center whitespace-nowrap cursor-pointer ${
                      selectedLiveFilter.id === f.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="w-full text-center mt-4">
            <p className="text-sm font-semibold text-slate-700 flex items-center justify-center gap-1.5 font-sans">
              <span className={`inline-block h-2 w-2 rounded-full ${isCapturing ? 'bg-blue-600 animate-ping' : 'bg-emerald-500'}`} />
              {statusMessage}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={onBack}
              disabled={isCapturing}
              className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer shadow-sm"
            >
              Kembali
            </button>

            {!isCapturing ? (
              <button
                onClick={startPhotoSession}
                disabled={cameraPermissionError}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-600/30 disabled:opacity-60 text-white rounded-xl text-base font-extrabold shadow-lg shadow-blue-600/20 active:scale-98 transition cursor-pointer"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>{capturedPhotos.length > 0 ? 'Mulai Ulang Sesi' : `Mulai Capture (${photoCount} Pose)`}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                <span>Hentikan & Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl w-full shadow-md">
          <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>Sesi Hasil Capture</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono font-bold">
              {capturedPhotos.length}/{photoCount}
            </span>
          </h3>

          <div className={`grid gap-3.5 ${photoCount === 4 ? 'grid-cols-2' : photoCount === 3 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-1'}`}>
            {Array.from({ length: photoCount }).map((_, index) => {
              const photo = capturedPhotos[index];
              return (
                <div 
                  key={index}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative flex items-center justify-center"
                >
                  {photo ? (
                    <>
                      <img src={photo} alt={`Pose ${index + 1}`} className="w-full h-full object-cover scale-x-[-1]" />
                      <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="absolute bottom-1 bg-slate-900/70 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        Pose {index + 1}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 select-none">
                      <Camera className="h-5 w-5 text-slate-300 opacity-60" />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">Pose {index + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex gap-2.5">
            <HelpCircle className="h-4 w-4 text-blue-650 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-800 font-sans">
              Ubah pose terbaikmu setiap pergantian hitungan mundur! Foto otomatis ter-render dalam template setelah sesi selesai.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
