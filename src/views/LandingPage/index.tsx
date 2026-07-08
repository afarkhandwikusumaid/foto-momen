import React from 'react';
import { FrameColor } from '../../types';

// Modular Component Imports (1 Feature = 1 File)
import HeroSection from './HeroSection';
import VisualGuide from './VisualGuide';
import TemplatesCatalog from './TemplatesCatalog';
import PartnershipSection from './PartnershipSection';

interface LandingPageProps {
  onStart: () => void;
  onStartWithTemplate: (template: FrameColor) => void;
  activeTab: 'home' | 'catalog';
}

export default function LandingPage({ onStart, onStartWithTemplate, activeTab }: LandingPageProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-4 sm:pb-8">

      {activeTab === 'home' && (
        <div className="space-y-4 animate-fade-in">
          <HeroSection onStart={onStart} />
          <VisualGuide />
          <PartnershipSection />
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
