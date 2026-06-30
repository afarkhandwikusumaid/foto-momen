import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { CustomBackdrop } from '../../services/dbService';

interface BackdropManagerProps {
  backdrops: CustomBackdrop[];
  onAddBackdrop: (name: string, value: string) => Promise<void>;
  onUpdateBackdrop: (id: string, name: string, value: string) => Promise<void>;
  onDeleteBackdrop: (id: string) => Promise<void>;
}

export default function BackdropManager({
  backdrops,
  onAddBackdrop,
  onUpdateBackdrop,
  onDeleteBackdrop
}: BackdropManagerProps) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)');
  const [editingItem, setEditingItem] = useState<CustomBackdrop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setValue(editingItem.value);
    } else {
      setName('');
      setValue('linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)');
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await onUpdateBackdrop(editingItem.id, name, value);
        setEditingItem(null);
      } else {
        await onAddBackdrop(name, value);
      }
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Column */}
      <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            {editingItem ? 'Edit Backdrop Digital' : 'Tambah Backdrop Baru'}
          </h3>
          {editingItem && (
            <button onClick={() => setEditingItem(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650">Nama Backdrop</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sunset Gold"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-xs font-bold text-slate-800 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650">CSS Gradient / Hex Latar</label>
            <textarea
              required
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-[11px] font-mono text-slate-700 bg-white"
            />
          </div>

          {/* Live Preview Card */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Preview Visual:</label>
            <div 
              style={{ background: value }} 
              className="w-full h-24 rounded-2xl border border-slate-200 flex items-center justify-center text-xs font-bold shadow-inner"
            >
              <span className="bg-white/85 px-3 py-1.5 rounded-full border border-slate-100 text-slate-800 text-[10px] uppercase shadow-sm tracking-wider">
                {name || 'Tanpa Nama'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-md transition cursor-pointer select-none flex items-center justify-center gap-1.5"
          >
            {editingItem ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isSubmitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Backdrop'}</span>
          </button>
        </form>
      </div>

      {/* List Column */}
      <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Daftar Backdrop Aktif</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
          {backdrops.map((bd) => (
            <div 
              key={bd.id}
              className={`flex flex-col border rounded-2xl bg-white overflow-hidden transition ${
                editingItem?.id === bd.id ? 'border-[#1d90ff] ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-350'
              }`}
            >
              <div 
                style={{ background: bd.value }}
                className="h-16 w-full flex items-end p-2.5 border-b border-slate-150"
              >
                <span className="bg-white/90 px-2 py-0.5 rounded text-[9px] font-bold text-slate-800 uppercase tracking-tight shadow-sm">
                  {bd.name}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <span className="text-[9px] font-mono text-slate-400 truncate max-w-[130px] uppercase select-all" title={bd.value}>
                  {bd.value}
                </span>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setEditingItem(bd)}
                    className="p-1.5 text-slate-400 hover:text-[#1d90ff] hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteBackdrop(bd.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
