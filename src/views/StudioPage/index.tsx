import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageTransition from '../../components/layout/PageTransition';
import FrameSelector from '../Photobooth/FrameSelector';
import PhotoPreview from '../Photobooth/PhotoPreview';
import PhotoUploader from './components/PhotoUploader';
import { FrameColor, PhotoCount, PhotoArea } from '../../types';
import { ensureAuth } from '../../services/dbService';

type StudioPhase = 'select-frame' | 'upload-photos' | 'preview';

const EMPTY_FRAME: FrameColor = {
  id: '',
  name: '',
  bgClass: '',
  hex: '#ffffff',
  textColor: '#000000',
  borderClass: 'border-slate-200',
};

interface StudioPageProps {
  eventCode?: string;
}

export default function StudioPage({ eventCode }: StudioPageProps) {
  const [currentPhase, setCurrentPhase] = useState<StudioPhase>('select-frame');
  const [selectedColor, setSelectedColor] = useState<FrameColor>(EMPTY_FRAME);
  const [photoCount, setPhotoCount] = useState<PhotoCount>(4);
  const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  // Dummy tab for Navbar to highlight correct menu if we add 'studio' to Navbar tabs
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'studio'>('studio');

  useEffect(() => {
    ensureAuth().catch(console.error);
  }, []);

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

  const handleResetToHome = () => {
    window.location.href = '/';
  };

  const handlePhotosUploaded = (photosBase64: string[]) => {
    setUploadedPhotos(photosBase64);
    setCurrentPhase('preview');
  };

  return (
    <div className="min-h-screen flex flex-col premium-bg text-slate-900 antialiased font-sans">
      <Navbar
        currentPhase={currentPhase as any} // Cast to any because StudioPhase might not map exactly to ActivePhase in Navbar yet
        onReset={handleResetToHome}
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        onStartBooth={() => setCurrentPhase('select-frame')}
      />

      <main className="flex-grow w-full flex flex-col py-2 sm:py-6 px-2 sm:px-4">
        <div className="w-full transition-all duration-300">
          <AnimatePresence mode="wait">
            {currentPhase === 'select-frame' && (
              <PageTransition key="select-frame">
                <FrameSelector
                  eventCode={eventCode}
                  selectedColor={selectedColor}
                  onColorSelect={handleColorSelect}
                  onPhotoCountSelect={setPhotoCount}
                  onNext={() => setCurrentPhase('upload-photos')}
                  onPrev={() => window.location.href = '/'} // Redirect back to home
                  nextButtonText="Lanjut Upload Foto"
                  nextButtonIcon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                />
              </PageTransition>
            )}

            {currentPhase === 'upload-photos' && (
              <PageTransition key="upload-photos">
                <PhotoUploader
                  frameColor={selectedColor}
                  photoCount={photoCount}
                  onPhotosUploaded={handlePhotosUploaded}
                  onBack={() => setCurrentPhase('select-frame')}
                />
              </PageTransition>
            )}

            {currentPhase === 'preview' && (
              <PageTransition key="preview">
                <PhotoPreview
                  frameColor={selectedColor}
                  photoCount={photoCount}
                  capturedPhotos={uploadedPhotos}
                  capturedVideos={[]} // No videos for static uploads
                  onBackToSelector={() => setCurrentPhase('select-frame')}
                />
              </PageTransition>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
