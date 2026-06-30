import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { FrameColor } from '../../types';
import { uploadTemplateImage } from '../../services/dbService';

interface TemplateManagerProps {
  templates: FrameColor[];
  onAddTemplate: (name: string, hex: string, textColor: string, imageUrl?: string) => Promise<void>;
  onUpdateTemplate: (id: string, name: string, hex: string, textColor: string, imageUrl?: string) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
}

export default function TemplateManager({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}: TemplateManagerProps) {
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#1d90ff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [editingTemplate, setEditingTemplate] = useState<FrameColor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set fields when entering Edit mode
  useEffect(() => {
    if (editingTemplate) {
      setColorName(editingTemplate.name);
      setColorHex(editingTemplate.hex);
      setTextColor(editingTemplate.textColor);
      setImageFile(null);
      setImagePreview(editingTemplate.imageUrl || '');
    } else {
      setColorName('');
      setColorHex('#1d90ff');
      setTextColor('#ffffff');
      setImageFile(null);
      setImagePreview('');
    }
  }, [editingTemplate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon unggah file gambar yang valid.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Ukuran file maksimal adalah 2MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorName || (!colorHex && !imageFile && !imagePreview)) return;
    
    setIsSubmitting(true);
    try {
      let uploadedUrl: string | undefined = editingTemplate?.imageUrl;
      
      // Upload file if selected
      if (imageFile) {
        uploadedUrl = await uploadTemplateImage(imageFile);
      }

      if (editingTemplate) {
        await onUpdateTemplate(editingTemplate.id, colorName, colorHex, textColor, uploadedUrl);
        setEditingTemplate(null);
      } else {
        await onAddTemplate(colorName, colorHex, textColor, uploadedUrl);
      }
      setColorName('');
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menyimpan template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (color: FrameColor) => {
    setEditingTemplate(color);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column (Add / Edit) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            {editingTemplate ? 'Edit Tema Warna' : 'Tambah Tema Warna Baru'}
          </h3>
          {editingTemplate && (
            <button 
              onClick={handleCancelEdit} 
              className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-55 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nama Tema Warna</label>
            <input
              type="text"
              required
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Contoh: Bubblegum Blue"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-xs font-bold text-slate-800 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">HEX Latar (Fallback)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[10px] font-mono font-bold text-slate-800 bg-white uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">HEX Warna Teks</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[10px] font-mono font-bold text-slate-800 bg-white uppercase"
                />
              </div>
            </div>
          </div>
          
          {/* Custom Image Upload Section */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-600 flex justify-between">
              <span>Gambar Frame Kustom (Opsional)</span>
              <span className="text-[10px] text-slate-400 font-normal">PNG dengan potongan transparan</span>
            </label>
            <div className="flex items-center gap-3">
              <div 
                className="relative h-14 w-14 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                )}
                
                {imagePreview && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file"
                  accept="image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  Pilih File Gambar
                </button>
                <p className="text-[9px] text-slate-400 mt-1 leading-tight">Maks 2MB, harus berformat PNG (Transparan untuk tempat foto).</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {editingTemplate && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-bold text-xs transition cursor-pointer select-none text-center"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-grow py-3 bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-md transition cursor-pointer select-none flex items-center justify-center gap-1.5"
            >
              {editingTemplate ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isSubmitting ? 'Menyimpan...' : editingTemplate ? 'Simpan Perubahan' : 'Tambah Template'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List Column */}
      <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Daftar Tema Warna Aktif</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {templates.map((color) => (
            <div 
              key={color.id}
              className={`flex items-center justify-between p-3.5 border rounded-2xl bg-white transition ${
                editingTemplate?.id === color.id ? 'border-[#1d90ff] ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className={`h-8 w-8 rounded-full border ${color.borderClass} flex items-center justify-center overflow-hidden shrink-0 bg-slate-100`} 
                  style={!color.imageUrl ? { backgroundColor: color.hex } : undefined} 
                >
                  {color.imageUrl ? (
                    <img src={color.imageUrl} alt={color.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">{color.name}</h4>
                  <span className="text-[9px] font-mono text-slate-450 flex items-center gap-1">
                    <span className="uppercase">{color.hex}</span>
                    {color.imageUrl && <span className="bg-emerald-100 text-emerald-600 px-1 rounded-sm text-[8px]">IMG</span>}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEditClick(color)}
                  className="p-2 text-slate-400 hover:text-[#1d90ff] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTemplate(color.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
