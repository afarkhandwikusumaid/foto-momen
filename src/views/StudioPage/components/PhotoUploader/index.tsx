import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, ArrowRight, Trash2, Camera } from 'lucide-react';
import { FrameColor, PhotoCount } from '../../../../types';
import Swal from 'sweetalert2';

interface PhotoUploaderProps {
  frameColor: FrameColor;
  photoCount: PhotoCount;
  onPhotosUploaded: (photosBase64: string[]) => void;
  onBack: () => void;
}

export default function PhotoUploader({
  frameColor,
  photoCount,
  onPhotosUploaded,
  onBack,
}: PhotoUploaderProps) {
  // Array to hold the base64 string of the uploaded photo for each slot
  const [photos, setPhotos] = useState<string[]>(Array(photoCount).fill(''));
  
  // Create refs for hidden file inputs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSlotClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Format Salah', 'Harap unggah file gambar (JPG/PNG).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newPhotos = [...photos];
        newPhotos[index] = event.target.result as string;
        setPhotos(newPhotos);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input value so the same file can be selected again if removed
    e.target.value = '';
  };

  const handleRemovePhoto = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newPhotos = [...photos];
    newPhotos[index] = '';
    setPhotos(newPhotos);
  };

  const isAllFilled = photos.every((photo) => photo !== '');

  const handleNext = () => {
    if (isAllFilled) {
      onPhotosUploaded(photos);
    }
  };

  // Determine grid layout based on photoCount
  const getGridClass = () => {
    const count = photoCount as number;
    if (count === 1) return 'grid-cols-1 max-w-sm';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-4xl';
    if (count === 4) return 'grid-cols-2 max-w-2xl';
    return 'grid-cols-2';
  };

  const renderLivePreview = () => {
    if (frameColor.photoAreas && frameColor.photoAreas.length > 0 && frameColor.imageUrl) {
      return (
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl select-none flex-shrink-0"
          style={{
            width: '260px',
            backgroundColor: frameColor.hex,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={frameColor.imageUrl}
            alt="Frame overlay"
            className="w-full h-auto relative z-20 pointer-events-none block"
          />
          {frameColor.photoAreas.map((area, index) => {
            const photoData = photos[index];
            return (
              <div
                key={index}
                className="absolute overflow-hidden z-10 bg-black/10 flex items-center justify-center text-slate-400 text-xs font-bold"
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                }}
              >
                {photoData ? (
                  <img
                    src={photoData}
                    alt={`Pose ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Fallback for non-custom layout
    return (
      <div
        className="w-[200px] p-4 flex flex-col items-center rounded-xl border border-slate-200/50 shadow-2xl relative select-none"
        style={{
          backgroundColor: frameColor.hex,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex flex-col gap-3 w-full relative z-10">
          {photos.map((photoData, index) => (
            <div
              key={index}
              className="aspect-[4/3] w-full rounded overflow-hidden bg-slate-800/10 border border-black/5 shadow-inner flex items-center justify-center text-slate-400 text-xs font-bold"
            >
              {photoData ? (
                <img src={photoData} alt={`Pose ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center font-display font-black text-xs mt-5 tracking-widest uppercase relative z-10" style={{ color: frameColor.textColor }}>
          Foto Momen
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 animate-fade-in text-slate-800">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
          <UploadCloud className="h-4 w-4 text-blue-600" />
          Langkah 2 dari 3: Unggah Foto
        </span>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Isi Slot Foto Anda
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Pilih foto dari galeri Anda untuk mengisi setiap bagian pada frame <span className="font-bold text-slate-700">{frameColor.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Slots */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`grid gap-4 ${getGridClass()} w-full`}>
            {photos.map((photoBase64, index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 flex justify-between items-center px-1">
                  <span>Foto ke-{index + 1}</span>
                  {photoBase64 && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Terisi
                    </span>
                  )}
                </label>
                
                <div 
                  onClick={() => handleSlotClick(index)}
                  className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group shadow-sm flex flex-col items-center justify-center
                    ${photoBase64 
                      ? 'border-transparent shadow-md' 
                      : 'border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'
                    }
                  `}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[index] = el; }}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                  
                  {photoBase64 ? (
                    <>
                      <img 
                        src={photoBase64} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSlotClick(index)}
                            className="bg-white/90 text-slate-800 p-2 rounded-full hover:bg-white hover:scale-110 transition-transform shadow-lg"
                            title="Ganti Foto"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleRemovePhoto(e, index)}
                            className="bg-rose-500/90 text-white p-2 rounded-full hover:bg-rose-500 hover:scale-110 transition-transform shadow-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors p-4 text-center">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-600 group-hover:text-blue-600 text-sm">Klik untuk Upload</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
          <div className="w-full bg-slate-50 flex flex-col items-center justify-center py-8 border border-slate-200 min-h-[460px] rounded-xl gap-4 shadow-inner">
             {renderLivePreview()}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 px-6 sm:px-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="hidden sm:inline">Ganti Frame</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isAllFilled}
            className="flex-1 sm:flex-none sm:min-w-[280px] flex items-center justify-center gap-3 rounded-lg bg-[#1d90ff] hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-8 text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Camera className="h-4 w-4" />
            <span>Lanjut Ke Preview Akhir</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
