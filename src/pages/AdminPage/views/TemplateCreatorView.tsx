import React, { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';
import LiveSimulator from '../components/LiveSimulator';
import { FrameLayout } from '../../../types';
import { saveTemplate, uploadTemplateImage } from '../../../services/dbService';

interface TemplateCreatorViewProps {
  initialData?: any;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export default function TemplateCreatorView({ initialData, onSuccess, onCancel }: TemplateCreatorViewProps) {
  // Local Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [layout, setLayout] = useState<FrameLayout>('vertical-strip');
  const [hex, setHex] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [photoCount, setPhotoCount] = useState<number>(4);
  const [isActive, setIsActive] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setEditingId(initialData.id);
      setName(initialData.name);
      setLayout(initialData.layout);
      setHex(initialData.hex || '#ffffff');
      setTextColor(initialData.textColor || '#000000');
      setPhotoCount(initialData.photoCount || 4);
      setIsActive(initialData.active !== false);
      setPreviewUrl(initialData.imageUrl);
      setFile(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(objectUrl);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setPreviewUrl(null);
    setName('');
    setLayout('vertical-strip');
    setHex('#ffffff');
    setTextColor('#000000');
    setPhotoCount(4);
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
        hex,
        textColor,
        borderClass: 'border-slate-200',
        imageUrl: finalImageUrl,
        layout,
        photoCount,
        active: isActive
      };
      
      await saveTemplate(newTemplate);
      
      alert(`Template berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`);
      await onSuccess(); // This should reload templates and maybe redirect back to catalog
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan template.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Kiri: Form */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <TemplateForm 
          editingId={editingId}
          name={name} setName={setName}
          layout={layout} setLayout={setLayout}
          photoCount={photoCount} setPhotoCount={setPhotoCount}
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
          layout={layout}
          photoCount={photoCount}
          name={name}
        />
      </div>
    </div>
  );
}
