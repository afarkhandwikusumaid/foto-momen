import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import TemplateForm from '../../components/TemplateForm';
import LiveSimulator from '../../components/LiveSimulator';
import { FrameLayout, PhotoArea } from '../../../../types';
import { saveTemplate, uploadTemplateImage } from '../../../../services/dbService';
import { detectTransparentHoles } from '../../../../utils/imageAnalyzer';

interface TemplateCreatorViewProps {
  isPrivate: boolean;
  initialData?: any;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export default function TemplateCreatorView({ isPrivate, initialData, onSuccess, onCancel }: TemplateCreatorViewProps) {
  // Local Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [layout, setLayout] = useState<FrameLayout | string>('vertical-strip');
  const [hex, setHex] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [photoCount, setPhotoCount] = useState<number>(4);
  const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([]);
  const [isActive, setIsActive] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setEditingId(initialData.id);
      setName(initialData.name);
      setEventCode(initialData.eventCode || '');
      setLayout(initialData.layout);
      setHex(initialData.hex || '#ffffff');
      setTextColor(initialData.textColor || '#000000');
      setPhotoCount(initialData.photoCount || 4);
      
      if (initialData.layout?.startsWith('[')) {
        try {
          setPhotoAreas(JSON.parse(initialData.layout));
        } catch { /* ignore */ }
      }
      
      setIsActive(initialData.active !== false);
      setPreviewUrl(initialData.imageUrl);
      setFile(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Deteksi area transparan otomatis
      setIsDetecting(true);
      try {
        const { holes, processedImageUrl } = await detectTransparentHoles(objectUrl, selectedFile.type);
        if (holes.length > 0) {
          setPhotoAreas(holes);
          setPhotoCount(holes.length);
          setLayout(JSON.stringify(holes));
          
          if (processedImageUrl) {
            setPreviewUrl(processedImageUrl);
            try {
              const res = await fetch(processedImageUrl);
              const blob = await res.blob();
              setFile(new File([blob], selectedFile.name, { type: selectedFile.type }));
            } catch { /* chroma key fallback */ }
          }
        } else {
          Swal.fire({
            title: 'Peringatan',
            text: 'Tidak ada area lubang transparan (bolong) yang terdeteksi pada gambar ini.',
            icon: 'warning',
            confirmButtonColor: '#3085d6'
          });
          setPhotoAreas([]);
        }
      } catch { /* no holes detected — fine */ } finally {
        setIsDetecting(false);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setPreviewUrl(null);
    setName('');
    setEventCode('');
    setLayout('vertical-strip');
    setHex('#ffffff');
    setTextColor('#000000');
    setPhotoCount(4);
    setPhotoAreas([]);
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!editingId && !file) return;

    setIsUploading(true);
    try {
      let finalImageUrl = previewUrl; 
      if (file) {
        finalImageUrl = await uploadTemplateImage(file);
      }
      
      const newTemplate = {
        id: editingId || `tpl_${Date.now()}`,
        name: name.trim(),
        eventCode: isPrivate ? (eventCode.trim() || undefined) : undefined,
        hex,
        textColor,
        borderClass: 'border-slate-200',
        imageUrl: finalImageUrl || undefined,
        layout,
        photoCount,
        active: isActive
      };
      
      await saveTemplate(newTemplate);
      Swal.fire({ title: 'Berhasil!', text: `Template berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`, icon: 'success', confirmButtonColor: '#3085d6' });
      await onSuccess();
    } catch (err: any) {
      Swal.fire({ title: 'Gagal Menyimpan', text: err?.message || 'Terjadi kesalahan tidak dikenal.', icon: 'error', confirmButtonColor: '#3085d6' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Kiri: Form */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <TemplateForm 
          isPrivate={isPrivate}
          editingId={editingId}
          name={name} setName={setName}
          layout={layout as any} setLayout={setLayout as any}
          photoCount={photoCount} setPhotoCount={setPhotoCount}
          photoAreas={photoAreas}
          eventCode={eventCode} setEventCode={setEventCode}
          isDetecting={isDetecting}
          hex={hex} setHex={setHex}
          textColor={textColor} setTextColor={setTextColor}
          isActive={isActive} setIsActive={setIsActive}
          file={file} onFileChange={handleFileChange}
          isUploading={isUploading}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>

      {/* Kanan: Simulator */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <LiveSimulator 
          previewUrl={previewUrl}
          hex={hex}
          textColor={textColor}
          layout={layout as any}
          photoCount={photoCount}
          photoAreas={photoAreas}
          name={name}
        />
      </div>
    </div>
  );
}
