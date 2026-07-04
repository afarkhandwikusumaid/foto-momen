import React from 'react';
import { Edit2, Plus, RefreshCw, UploadCloud } from 'lucide-react';
import { FrameLayout, PhotoArea } from '../../../../types';

interface TemplateFormProps {
  editingId: string | null;
  name: string;
  setName: (name: string) => void;
  layout: FrameLayout;
  setLayout: (layout: FrameLayout) => void;
  photoCount: number;
  setPhotoCount: (count: number) => void;
  photoAreas?: PhotoArea[];
  isDetecting?: boolean;
  hex: string;
  setHex: (hex: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function TemplateForm({
  editingId,
  name, setName,
  layout, setLayout,
  photoCount, setPhotoCount,
  photoAreas, isDetecting,
  hex, setHex,
  textColor, setTextColor,
  isActive, setIsActive,
  file, onFileChange,
  isUploading,
  onSubmit,
  onCancel
}: TemplateFormProps) {
  return (
    <div className={`bg-white p-6 rounded-3xl border shadow-lg ${editingId ? 'border-blue-300 shadow-blue-100' : 'border-slate-200'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {editingId ? <Edit2 className="w-5 h-5 text-[#1d90ff]" /> : <Plus className="w-5 h-5 text-[#1d90ff]" />} 
          {editingId ? 'Edit Template' : 'Tambah Template Baru'}
        </h2>
        {editingId && (
          <button type="button" onClick={onCancel} className="text-xs font-bold text-slate-400 hover:text-slate-600">Batal Edit</button>
        )}
      </div>
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Template</label>
          <input 
            type="text" value={name} onChange={e => setName(e.target.value)} required
            placeholder="Misal: Bunga Tropis 2x6"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1d90ff] focus:ring-1 focus:ring-[#1d90ff]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Layout (Ukuran)</label>
            <select 
              value={layout} onChange={e => setLayout(e.target.value as FrameLayout)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1d90ff]"
            >
              <option value="vertical-strip">Vertical Strip (2x6)</option>
              <option value="grid-2x2">Grid 2x2</option>
              <option value="single-polar">Single Polaroid</option>
              <option value="triple-strip">Triple Strip</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Jumlah Foto</label>
            <select 
              value={photoCount} onChange={e => setPhotoCount(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1d90ff]"
            >
              <option value={2}>2 Foto</option>
              <option value={3}>3 Foto</option>
              <option value={4}>4 Foto</option>
            </select>
          </div>
        </div>



        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Gambar Overlay (PNG Transparan)</label>
          <div className="relative mb-3">
            <input 
              type="file" accept="image/png" onChange={onFileChange} required={!editingId}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1d90ff]/10 file:text-[#1d90ff] hover:file:bg-[#1d90ff]/20 cursor-pointer"
            />
          </div>
          {isDetecting ? (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis lubang transparan...
            </div>
          ) : (
            photoAreas && photoAreas.length > 0 && (
              <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                <span className="font-bold text-slate-800">✅ Deteksi Otomatis:</span> Terdeteksi <span className="font-bold text-blue-600">{photoAreas.length} lubang foto</span> pada frame ini. Tata letak akan otomatis menyesuaikan lubang tersebut!
              </div>
            )
          )}
          {editingId && !file && <p className="text-xs text-slate-400 mt-2">Kosongkan jika tidak ingin mengubah gambar.</p>}
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h4 className="font-bold text-slate-700 text-sm">Status Template</h4>
            <p className="text-xs text-slate-500">Tampilkan template ini untuk pelanggan.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d90ff]"></div>
          </label>
        </div>

        <button 
          type="submit" disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 bg-[#1d90ff] hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-blue-500/20"
        >
          {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {isUploading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Unggah & Simpan Baru')}
        </button>
      </form>
    </div>
  );
}
