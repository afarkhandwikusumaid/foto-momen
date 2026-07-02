/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import FrameSelector from './pages/Photobooth/FrameSelector';
import CameraBooth from './pages/Photobooth/CameraBooth';
import LivePreview from './pages/Photobooth/LivePreview';
import PhotoPreview from './pages/Photobooth/PhotoPreview';
import AdminPage from './pages/AdminPage/AdminPage';
import { ActivePhase, FrameColor, PhotoCount, PhotoArea } from './types';
import { ensureAuth, getPhotoSession } from './services/dbService';

// Empty placeholder FrameColor used as initial state before user selects a template
const EMPTY_FRAME: FrameColor = {
  id: '',
  name: '',
  bgClass: '',
  hex: '#ffffff',
  textColor: '#000000',
  borderClass: 'border-slate-200',
};

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<ActivePhase>('landing');
  const [selectedColor, setSelectedColor] = useState<FrameColor>(EMPTY_FRAME);
  const [activeTab, setActiveTab] = useState<'home' | 'catalog'>('home');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [capturedVideos, setCapturedVideos] = useState<Blob[]>([]);
  const [photoCount, setPhotoCount] = useState<PhotoCount>(4);
  const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([]);

  const [sharedSession, setSharedSession] = useState<any>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingShare, setIsLoadingShare] = useState(false);

  // Initialize Anonymous Auth and check share parameter
  useEffect(() => {
    ensureAuth().catch(console.error);

    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    if (shareId) {
      setIsLoadingShare(true);
      getPhotoSession(shareId)
        .then(async (session) => {
          if (session) {
            setSharedSession(session);
            // Check if corresponding webm exists
            const imgUrl = session.image_url || session.imageUrl;
            if (imgUrl) {
              const vUrl = imgUrl.replace('.png', '.webm');
              try {
                const res = await fetch(vUrl, { method: 'HEAD' });
                if (res.ok) {
                  setHasVideo(true);
                  setVideoUrl(vUrl);
                }
              } catch (e) {
                console.error("Video not found:", e);
              }
            }
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingShare(false));
    }
  }, []);

  const handleDownloadShared = async () => {
    if (!sharedSession?.imageUrl) return;
    try {
      const response = await fetch(sharedSession.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `foto-momen-${sharedSession.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const handleResetToHome = () => {
    setCapturedPhotos([]);
    setCapturedVideos([]);
    setCurrentPhase('landing');
    if (window.location.search.includes('share')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handlePhotosCaptured = (photos: string[], videos: Blob[]) => {
    setCapturedPhotos(photos);
    setCapturedVideos(videos);
    setCurrentPhase('live-preview');
  };

  // Handler: pilih template dari katalog dan langsung mulai foto
  const handleStartWithTemplate = (template: FrameColor) => {
    setSelectedColor(template);
    if (template.photoAreas && template.photoAreas.length > 0) {
      setPhotoAreas(template.photoAreas);
      setPhotoCount(template.photoAreas.length as PhotoCount);
    } else if (template.photoCount) {
      setPhotoAreas([]);
      setPhotoCount(template.photoCount as PhotoCount);
    }
    setCurrentPhase('camera');
  };

  const handleColorSelect = (color: FrameColor) => {
    setSelectedColor(color);
    if (color.photoAreas && color.photoAreas.length > 0) {
      setPhotoAreas(color.photoAreas);
      setPhotoCount(color.photoAreas.length as PhotoCount);
    } else if (color.photoCount) {
      setPhotoAreas([]);
      setPhotoCount(color.photoCount as PhotoCount);
    }
  };

  const isAdminRoute = window.location.pathname === '/admin';
  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen flex flex-col premium-bg text-slate-900 antialiased font-sans">
      <Navbar
        currentPhase={currentPhase}
        onReset={handleResetToHome}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartBooth={() => setCurrentPhase('select-frame')}
      />

      <main className="flex-grow flex items-center justify-center py-6 px-4">
        <div className="w-full transition-all duration-300">
          {sharedSession ? (
            <div className="max-w-md w-full mx-auto p-2 text-center animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-md">
                <span className="text-4xl">📸</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">Foto Momen Bersama</h2>
                <p className="text-slate-500 text-sm mb-6">Seseorang membagikan momen bahagianya denganmu!</p>

                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-block mb-6 max-w-full">
                  {hasVideo && videoUrl ? (
                     <video
                       src={videoUrl}
                       autoPlay muted loop playsInline
                       className="max-h-[55vh] object-contain rounded-xl"
                     />
                  ) : (
                    <img
                      src={sharedSession.image_url || sharedSession.imageUrl}
                      alt="Foto Momen Shared"
                      className="max-h-[55vh] object-contain rounded-xl"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleDownloadShared}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      Foto
                    </button>
                    {hasVideo && videoUrl && (
                      <button
                        onClick={async () => {
                           try {
                             const response = await fetch(videoUrl);
                             const blob = await response.blob();
                             const url = window.URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = `Live_FotoMomen_${Date.now()}.webm`;
                             document.body.appendChild(a);
                             a.click();
                             window.URL.revokeObjectURL(url);
                             a.remove();
                           } catch(e) { console.error(e); }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-[#ff007f] hover:bg-[#d6006a] text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        Live Video
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      window.history.replaceState({}, document.title, window.location.pathname);
                      setSharedSession(null);
                      setCurrentPhase('select-frame');
                    }}
                    className="w-full py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
                  >
                    Mulai Ambil Foto Kamu Sendiri
                  </button>
                </div>
              </div>
            </div>
          ) : isLoadingShare ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Memuat foto momen...</p>
            </div>
          ) : (
            <>
              {currentPhase === 'landing' && (
                <LandingPage
                  onStart={() => setCurrentPhase('select-frame')}
                  onStartWithTemplate={handleStartWithTemplate}
                  activeTab={activeTab}
                />
              )}

              {currentPhase === 'select-frame' && (
                <FrameSelector
                  selectedColor={selectedColor}
                  onColorSelect={handleColorSelect}
                  onPhotoCountSelect={setPhotoCount}
                  onNext={() => setCurrentPhase('camera')}
                  onPrev={handleResetToHome}
                />
              )}

              {currentPhase === 'camera' && (
                <CameraBooth
                  photoCount={photoCount}
                  onPhotosCaptured={handlePhotosCaptured}
                  onBack={() => setCurrentPhase('select-frame')}
                />
              )}

              {currentPhase === 'live-preview' && (
                <LivePreview
                  capturedPhotos={capturedPhotos}
                  frameColor={selectedColor}
                  photoAreas={photoAreas}
                  onContinue={() => setCurrentPhase('preview')}
                  onRetake={() => setCurrentPhase('camera')}
                />
              )}

              {currentPhase === 'preview' && (
                <PhotoPreview
                  frameColor={selectedColor}
                  photoCount={photoCount}
                  capturedPhotos={capturedPhotos}
                  capturedVideos={capturedVideos}
                  onBackToSelector={() => setCurrentPhase('select-frame')}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
