import React from 'react';
import { FrameColor } from '../../types';

// Modular Component Imports (1 Feature = 1 File)
import HeroSection from './HeroSection';
import VisualGuide from './VisualGuide';
import TemplatesCatalog from './TemplatesCatalog';

interface LandingPageProps {
  onStart: () => void;
  onStartWithTemplate: (template: FrameColor) => void;
  activeTab: 'home' | 'catalog';
}

export default function LandingPage({ onStart, onStartWithTemplate, activeTab }: LandingPageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 pt-2 pb-8 sm:pt-4 sm:pb-8">

      {activeTab === 'home' && (
        <div className="space-y-12 animate-fade-in">
          <HeroSection onStart={onStart} />
          <VisualGuide />
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="animate-fade-in">
          <TemplatesCatalog onStartWithTemplate={onStartWithTemplate} />
        </div>
      )}

    </div>
  );
}
