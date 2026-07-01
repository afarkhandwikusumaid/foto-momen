import React, { useEffect, useState, useRef } from 'react';
import { Palette, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getFrameTemplates } from '../../services/dbService';
import { FRAME_COLORS } from '../Photobooth/FrameSelector';
import { getPosePlaceholder } from '../Photobooth/PosePlaceholders';

export default function TemplatesCatalog() {
  const [templates, setTemplates] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFrameTemplates().then(data => {
      if (data && data.length > 0) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          hex: t.hex,
          textColor: t.text_color || '#ffffff',
          imageUrl: t.image_url,
          layout: t.layout,
          badge: 'NEW LAYOUT',
          badgeColor: 'bg-rose-500 text-white',
          layoutDesc: t.layout === 'grid-2x2' ? 'Size 2x2 Grid' : 'Size 6 x 2 Strip',
          poses: `${t.photoCount || 4} Pose`,
          active: t.active !== false,
          photoAreas: t.photoAreas
        }));
        setTemplates(mapped.filter((t: any) => t.active));
      }
    }).catch(console.error);
  }, []);

  const defaultThemes = FRAME_COLORS.map((c, index) => {
    let badge = 'TRY IT NOW';
    let badgeColor = 'bg-amber-500 text-white';
    if (index % 3 === 1) {
      badge = 'COLLAB EVENT';
      badgeColor = 'bg-emerald-500 text-white';
    } else if (index % 3 === 2) {
      badge = 'NEW LAYOUT';
      badgeColor = 'bg-rose-500 text-white';
    }
    return {
      id: c.id,
      name: c.name,
      hex: c.hex,
      textColor: c.textColor,
      badge,
      badgeColor,
      layoutDesc: 'Size 6 x 2 Strip',
      poses: index % 2 === 0 ? '3 Pose' : '4 Pose'
    };
  });

  const allThemes = [...defaultThemes, ...templates];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-12 px-4 select-none bg-gradient-to-b from-blue-50/20 via-white to-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
      
      {/* Decorative Blur Background Blob */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="text-center space-y-3 mb-10 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          choose your layout
        </h2>
        <p className="text-xs text-slate-500 italic font-medium">
          Select from our collection of photo booth layouts
        </p>
      </div>

      {/* Carousel Container with Arrows next to it */}
      <div className="relative max-w-5xl mx-auto flex items-center justify-center gap-4 px-2">
        
        {/* Left Arrow Button (Hidden on pure touch devices if desired, but nice to have) */}
        <button
          onClick={scrollLeft}
          className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-650 cursor-pointer shadow-sm active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Scroll Wrapper */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 hide-scrollbar scroll-smooth"
        >
          {allThemes.map((theme) => (
            <div
              key={theme.id}
              className="flex-shrink-0 w-[180px] sm:w-[200px] snap-start flex flex-col items-center space-y-4"
            >
              
              {/* Polaroid Frame Card */}
              <div 
                className="relative aspect-[1/2.8] w-full rounded-[24px] p-3 flex flex-col justify-between shadow-lg border border-slate-200/50 bg-white group transition duration-300 select-none overflow-hidden"
              >
                
                {/* Badge Overlay */}
                <span className={`absolute top-2 left-1/2 -translate-x-1/2 text-[7px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm ${theme.badgeColor} z-10 scale-95`}>
                  {theme.badge}
                </span>

                {/* Inner Frame Background Box */}
                <div 
                  className="w-full h-full rounded-[18px] p-2 flex flex-col justify-between relative shadow-inner overflow-hidden"
                  style={{ backgroundColor: theme.hex }}
                >
                  {/* Grid of Polaroid Poses inside the Frame */}
                  {(theme as any).photoAreas && (theme as any).photoAreas.length > 0 ? (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      {(theme as any).photoAreas.map((area: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="absolute bg-slate-100/50 rounded overflow-hidden flex items-center justify-center border border-white/20 shadow-inner"
                          style={{
                            left: `${area.x}%`,
                            top: `${area.y}%`,
                            width: `${area.width}%`,
                            height: `${area.height}%`
                          }}
                        >
                          {getPosePlaceholder(idx, "w-full h-full p-1 opacity-50", theme.hex)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center gap-1.5 py-6 z-10 relative">
                      <div className="aspect-[4/3] bg-slate-100/50 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                        {getPosePlaceholder(0, "w-full h-full p-0.5", theme.hex)}
                      </div>
                      <div className="aspect-[4/3] bg-slate-100/50 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                        {getPosePlaceholder(1, "w-full h-full p-0.5", theme.hex)}
                      </div>
                      <div className="aspect-[4/3] bg-slate-100/50 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                        {getPosePlaceholder(2, "w-full h-full p-0.5", theme.hex)}
                      </div>
                    </div>
                  )}

                  {/* Frame branding footer text */}
                  <div 
                    className="text-center pb-1 truncate" 
                    style={{ color: theme.textColor, zIndex: 10 }}
                  >
                    <p className="text-[7px] font-black uppercase tracking-widest font-mono">
                      {theme.name}
                    </p>
                  </div>
                  
                  {theme.imageUrl && (
                    <img src={theme.imageUrl} alt="Frame Overlay" className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20" />
                  )}
                </div>

              </div>

              {/* Sub-label text */}
              <div className="text-center space-y-0.5">
                <h4 className="font-extrabold text-xs text-slate-800 tracking-wide truncate max-w-[170px]">
                  {theme.name}
                </h4>
                <p className="text-[9px] text-slate-400 font-bold font-mono">
                  {theme.layoutDesc} <span className="block mt-0.5">({theme.poses})</span>
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="h-11 w-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-650 cursor-pointer shadow-sm active:scale-95 transition"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

      </div>

    </div>
  );
}
