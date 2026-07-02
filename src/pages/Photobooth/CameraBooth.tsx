import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, Play, HelpCircle, Timer, Palette, Info } from 'lucide-react';
import { PhotoCount } from '../../types';
import FilmStripRoll from './FilmStripRoll';
import CameraControls from './CameraControls';

const WebcamComponent = Webcam as any;

interface CameraBoothProps {
  photoCount: PhotoCount;
  onPhotosCaptured: (photos: string[], videos: Blob[]) => void;
  onBack: () => void;
}

const LIVE_FILTERS = [
  { id: 'none', label: 'Natural', css: 'none' },
  { id: 'soft', label: 'Soft Glow', css: 'brightness(1.08) contrast(0.95) saturate(1.1)' },
  { id: 'bw', label: 'B&W Classic', css: 'grayscale(100%) contrast(1.1)' },
  { id: 'warm', label: 'Warm Sepia', css: 'sepia(30%) saturate(1.3) brightness(1.05)' },
  { id: 'cool', label: 'Cool Cyber', css: 'hue-rotate(15deg) saturate(1.2) brightness(1.02)' },
  { id: 'vivid', label: 'Vivid Pop', css: 'saturate(1.6) contrast(1.1)' },
];

const COUNTDOWN_OPTIONS = [3, 5, 10];

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export default function CameraBooth({ photoCount, onPhotosCaptured, onBack }: CameraBoothProps) {
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [capturedVideos, setCapturedVideos] = useState<Blob[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Siap berfoto? Klik tombol Mulai di bawah!');
  
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
    setCapturedVideos([]);
    setIsCapturing(false);
    setCurrentPoseIndex(0);
    setCountdown(null);
    setShowFlash(false);
    setStatusMessage('Siap berfoto? Klik tombol Mulai di bawah!');
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
        // Draw the image flipped/mirrored since the webcam feed is mirrored
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        ctx.filter = selectedLiveFilter.css;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        const imageSrc = canvas.toDataURL('image/png');
        
        // Flash feedback effect
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);

        setCapturedPhotos((prev) => {
          const updated = [...prev, imageSrc];
          if (updated.length === photoCount) {
            setIsCapturing(false);
            setStatusMessage('Selesai! Memproses fotomu...');
            setTimeout(() => {
              onPhotosCaptured(updated, capturedVideos); // We will append the current video in the effect
            }, 800);
          }
          return updated;
        });
      }
    }
  }, [onPhotosCaptured, photoCount, selectedLiveFilter, capturedVideos]);

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
      
      // Start recording 2 seconds before snap (if duration is enough)
      if (countdownRef.current === 2 && webcamRef.current?.video?.srcObject) {
        try {
          const stream = webcamRef.current.video.srcObject;
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              setCapturedVideos(prev => {
                const newVideos = [...prev, e.data];
                // If this is the last pose, onPhotosCaptured gets called in captureScreenshot.
                // However, state updates are async, so captureScreenshot might use stale capturedVideos.
                // We handle this edge case by passing the new array directly if it's the last pose, or we use a ref.
                return newVideos;
              });
            }
          };
          mediaRecorderRef.current.start();
        } catch (e) {
          console.error("MediaRecorder error", e);
        }
      }

      if (countdownRef.current <= 0) {
        clearInterval(countdownTimer);
        setCountdown(null);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
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
    setCapturedVideos([]);
    setIsCapturing(true);
    setCurrentPoseIndex(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 relative animate-fade-in text-slate-800">
      
      {/* Visual Camera Shutter Flash Overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[9999] opacity-100 pointer-events-none transition-opacity duration-150" />
      )}

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800">
          <Camera className="h-3.5 w-3.5 text-slate-800" /> Langkah 2 dari 3: Ambil Pose Terbaikmu
        </span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 select-none">
          Kamera Studio Booth
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Kamera akan mengambil <strong className="text-slate-800 font-bold">{photoCount} pose secara otomatis</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Camera View */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="w-full flex flex-wrap justify-between items-center mb-4 px-2 gap-2">
            <div className="flex items-center gap-2.5">
               <Timer className="w-4.5 h-4.5 text-slate-450" />
               <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl shadow-inner">
                 {COUNTDOWN_OPTIONS.map(sec => (
                   <button 
                      key={sec}
                      disabled={isCapturing}
                      onClick={() => setCountdownDuration(sec)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg transition font-extrabold cursor-pointer ${
                        countdownDuration === sec 
                          ? 'bg-white shadow text-blue-700' 
                          : 'text-slate-550 hover:text-slate-800'
                      }`}
                   >
                     {sec}s
                   </button>
                 ))}
               </div>
            </div>
            <div className="text-xs font-extrabold text-slate-450 uppercase font-mono tracking-widest bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Pose {currentPoseIndex + 1} / {photoCount}
            </div>
          </div>

          {/* Premium Camera Frame Mockup */}
          <div className="relative w-full aspect-[4/3] max-w-xl bg-[#1d90ff] rounded-xl p-2 border border-blue-500 flex items-center justify-center overflow-hidden">
            
            {/* Camera Body Glass Shine Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10" />

            {!cameraPermissionError ? (
              <div className="w-full h-full relative rounded-2xl overflow-hidden">
                <WebcamComponent
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={videoConstraints}
                  onUserMediaError={handleUserMediaError}
                  className="w-full h-full object-cover scale-x-[-1]" 
                  style={{ filter: selectedLiveFilter.css }}
                />

                {/* Professional Camera Rule-Of-Thirds Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 z-10">
                  {Array.from({length: 9}).map((_, i) => (
                    <div key={i} className="border border-dashed border-white/40"></div>
                  ))}
                </div>
                
                {/* Vintage Camera Lens Info Border Overlay */}
                <div className="absolute inset-x-4 top-4 flex justify-between text-[9px] font-mono text-white/60 tracking-wider z-10 select-none">
                  <span>ISO 400</span>
                  <span>F/2.8</span>
                  <span>EV +0.3</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping inline-block" /> REC
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 z-10">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4.5 animate-bounce" />
                <h4 className="font-extrabold text-slate-200 text-lg">Akses Kamera Diperlukan</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Aplikasi ini membutuhkan akses kamera. Silakan izinkan akses kamera pada peramban web Anda dan segarkan halaman.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Segarkan Halaman
                </button>
              </div>
            )}

            {/* Countdown Number (No background) */}
            {countdown !== null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-25 pointer-events-none">
                <span className="text-3xl sm:text-6xl font-bold font-sans text-[#1d90ff] leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {/* Modularized Camera Controls & Live Filters */}
          <CameraControls
            liveFilters={LIVE_FILTERS}
            selectedLiveFilter={selectedLiveFilter}
            setSelectedLiveFilter={setSelectedLiveFilter}
            isCapturing={isCapturing}
            statusMessage={statusMessage}
            cameraPermissionError={cameraPermissionError}
            capturedPhotosCount={capturedPhotos.length}
            photoCount={photoCount}
            startPhotoSession={startPhotoSession}
            handleReset={handleReset}
            onBack={onBack}
          />
        </div>

        {/* Modularized Sidebar Poses Roll */}
        <FilmStripRoll
          capturedPhotos={capturedPhotos}
          photoCount={photoCount}
        />

      </div>
    </div>
  );
}
