import React from 'react';
import { FrameColor } from '../../types';

// Modular Component Imports (1 Feature = 1 File)
import HeroSection from './HeroSection';
import ShowcaseWidget from './ShowcaseWidget';
import VisualGuide from './VisualGuide';
import TemplatesCatalog from './TemplatesCatalog';

interface LandingPageProps {
  onStart: () => void;
  onStartWithTemplate: (template: FrameColor) => void;
  activeTab: 'home' | 'catalog';
}

export default function LandingPage({ onStart, onStartWithTemplate, activeTab }: LandingPageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">

      {activeTab === 'home' && (
        <div className="space-y-12 animate-fade-in">
          <HeroSection onStart={onStart} />
          <ShowcaseWidget />
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
