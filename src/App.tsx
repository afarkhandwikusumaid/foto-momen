/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './components/landing-page/LandingPage';
import FrameSelector, { FRAME_COLORS } from './components/photobooth/FrameSelector';
import CameraBooth from './components/photobooth/CameraBooth';
import LivePreview from './components/photobooth/LivePreview';
import PhotoPreview from './components/photobooth/PhotoPreview';
import AdminPanel from './components/admin/AdminPanel';
import { ActivePhase, FrameLayout, FrameColor, PhotoCount, BorderStyle } from './types';
import { ensureAuth, getPhotoSession } from './services/dbService';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<ActivePhase>('landing');
  const [selectedLayout, setSelectedLayout] = useState<FrameLayout>('vertical-strip');
  const [selectedColor, setSelectedColor] = useState<FrameColor>(FRAME_COLORS[0]);
  const [activeTab, setActiveTab] = useState<'home' | 'catalog'>('home');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  const [photoCount, setPhotoCount] = useState<PhotoCount>(4);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('classic');

  const [sharedSession, setSharedSession] = useState<any>(null);
  const [isLoadingShare, setIsLoadingShare] = useState(false);

  // Initialize Anonymous Auth, check share parameter, and set up hash-based admin routing
  useEffect(() => {
    ensureAuth().catch(console.error);

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPhase('admin');
      } else if (currentPhase === 'admin') {
        setCurrentPhase('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once initially

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

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPhase]);

  const handleResetToHome = () => {
    setCapturedPhotos([]);
    setCurrentPhase('landing');
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    // Clear URL share parameter if returning to home
    if (window.location.search.includes('share')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handlePhotosCaptured = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentPhase('live-preview');
    // Increment the free photobooth sessions count!
    const currentUses = parseInt(localStorage.getItem('foto_momen_free_uses') || '0', 10);
    localStorage.setItem('foto_momen_free_uses', (currentUses + 1).toString());
  };

  return (
    <div className="min-h-screen flex flex-col premium-bg text-slate-900 antialiased font-sans">
      {currentPhase !== 'admin' && (
        <Navbar 
          currentPhase={currentPhase} 
          onReset={handleResetToHome} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartBooth={() => setCurrentPhase('select-frame')}
        />
      )}

      <main className={`flex-grow flex items-center justify-center ${currentPhase === 'admin' ? 'p-0' : 'py-6 px-4'}`}>
        <div className="w-full transition-all duration-300">
          {sharedSession ? (
            <div className="max-w-md w-full mx-auto p-2 text-center animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-md">
                <span className="text-4xl">📸</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">Foto Momen Bersama</h2>
                <p className="text-slate-655 text-sm mb-6">Seseorang membagikan momen bahagianya denganmu!</p>
                
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
                  className="w-full py-4 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-md transition duration-200 cursor-pointer"
                >
                  Mulai Ambil Foto Kamu Sendiri
                </button>
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
                  onStart={() => {
                    setCurrentPhase('select-frame');
                  }} 
                  activeTab={activeTab}
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
                  onColorSelect={setSelectedColor}
                  photoCount={photoCount}
                  borderStyle={borderStyle}
                  capturedPhotos={capturedPhotos}
                  onBackToSelector={() => setCurrentPhase('select-frame')}
                />
              )}

              {currentPhase === 'admin' && (
                <AdminPanel 
                  onBackToHome={handleResetToHome} 
                />
              )}
            </>
          )}
        </div>
      </main>

      {currentPhase !== 'admin' && <Footer />}
    </div>
  );
}
