import React, { useState } from 'react';
import { Image as ImageIcon, Cloud, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  layout: string;
  createdAt: number;
}

interface CommunityGalleryProps {
  localHistory: GalleryItem[];
}

export default function CommunityGallery({ localHistory }: CommunityGalleryProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (localHistory.length === 0) return null;

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 select-none">
        <div className="text-center sm:text-left">
          <span className="text-[10px] text-emerald-600 font-bold px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full inline-block uppercase tracking-wider mb-2 animate-pulse">
            Riwayat Cetak Privat Anda (Private Room)
          </span>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-500" />
            Galeri Foto Pribadi
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            🔒 Foto Anda tersimpan secara privat di perangkat ini dan tidak diekspor/dibagikan ke publik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {localHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewImage(item.imageUrl)}
            className="group relative bg-white p-3.5 rounded-[24px] border border-slate-200 cursor-pointer hover:border-[#1d90ff] transition-all duration-300"
          >
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={item.imageUrl}
                alt="Riwayat Foto Strip"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 font-mono">
                {new Date(item.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="text-[8px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-mono font-bold uppercase select-none">
                {item.layout.replace('-',' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img 
              src={previewImage} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10 bg-white" 
              alt="Preview" 
            />
          </div>
        </div>
      )}
    </section>
  );
}
