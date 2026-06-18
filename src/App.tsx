/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import FrameSelector, { FRAME_COLORS } from './components/FrameSelector';
import CameraBooth from './components/CameraBooth';
import LivePreview from './components/LivePreview';
import PhotoPreview from './components/PhotoPreview';
import { ActivePhase, FrameLayout, FrameColor, PhotoCount, BorderStyle } from './types';
import { ensureAuth, getPhotoSession } from './firebase/config';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<ActivePhase>('landing');
  const [selectedLayout, setSelectedLayout] = useState<FrameLayout>('vertical-strip');
  const [selectedColor, setSelectedColor] = useState<FrameColor>(FRAME_COLORS[0]);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  const [photoCount, setPhotoCount] = useState<PhotoCount>(4);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('classic');

  const [sharedSession, setSharedSession] = useState<any>(null);
  const [isLoadingShare, setIsLoadingShare] = useState(false);

  // Initialize Anonymous Auth and check share URL parameters
  useEffect(() => {
    ensureAuth().catch(console.error);

    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    if (shareId) {
      setIsLoadingShare(true);
      getPhotoSession(shareId)
        .then((session) => {
          if (session) {
            setSharedSession(session);
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsLoadingShare(false);
        });
    }
  }, []);

  const handleResetToHome = () => {
    setCapturedPhotos([]);
    setCurrentPhase('landing');
    // Clear URL share parameter if returning to home
    if (window.location.search.includes('share')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handlePhotosCaptured = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentPhase('live-preview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-slate-50 text-slate-900 antialiased font-sans">
      <Navbar 
        currentPhase={currentPhase} 
        onReset={handleResetToHome} 
      />

      <main className="flex-grow flex items-center justify-center py-6 px-4">
        <div className="w-full transition-all duration-300">
          {sharedSession ? (
            <div className="max-w-md w-full mx-auto p-2 text-center animate-fade-in">
              <div className="bg-white border border-blue-100 rounded-3xl p-8 shadow-2xl">
                <span className="text-4xl">📸</span>
                <h2 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2">Foto Momen Bersama</h2>
                <p className="text-slate-600 text-sm mb-6 font-sans">Seseorang membagikan momen bahagianya denganmu!</p>
                
                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-block mb-6 max-w-full">
                  <img 
                    src={sharedSession.imageUrl} 
                    alt="Foto Momen Shared" 
                    className="max-h-[55vh] object-contain rounded-xl"
                  />
                </div>

                <button
                  onClick={() => {
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setSharedSession(null);
                    setCurrentPhase('landing');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-550 hover:to-blue-650 text-white rounded-2xl font-extrabold shadow-lg shadow-blue-600/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  Mulai Ambil Foto Kamu Sendiri
                </button>
              </div>
            </div>
          ) : isLoadingShare ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-blue-300">Memuat foto momen...</p>
            </div>
          ) : (
            <>
              {currentPhase === 'landing' && (
                <LandingPage 
                  onStart={() => setCurrentPhase('select-frame')} 
                />
              )}

              {currentPhase === 'select-frame' && (
                <FrameSelector
                  selectedLayout={selectedLayout}
                  onLayoutSelect={setSelectedLayout}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  photoCount={photoCount}
                  onPhotoCountSelect={setPhotoCount}
                  borderStyle={borderStyle}
                  onBorderStyleSelect={setBorderStyle}
                  onNext={() => setCurrentPhase('camera')}
                />
              )}

              {currentPhase === 'camera' && (
                <CameraBooth
                  layout={selectedLayout}
                  photoCount={photoCount}
                  onPhotosCaptured={handlePhotosCaptured}
                  onBack={() => setCurrentPhase('select-frame')}
                />
              )}

              {currentPhase === 'live-preview' && (
                <LivePreview
                  capturedPhotos={capturedPhotos}
                  layout={selectedLayout}
                  frameColor={selectedColor}
                  onContinue={() => setCurrentPhase('preview')}
                  onRetake={() => setCurrentPhase('camera')}
                />
              )}

              {currentPhase === 'preview' && (
                <PhotoPreview
                  layout={selectedLayout}
                  frameColor={selectedColor}
                  photoCount={photoCount}
                  borderStyle={borderStyle}
                  capturedPhotos={capturedPhotos}
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
