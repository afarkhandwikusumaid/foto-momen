import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { CustomSticker, CustomFont } from '../../services/dbService';

interface StickersFontsManagerProps {
  stickers: CustomSticker[];
  onAddSticker: (emoji: string, category: string) => Promise<void>;
  onUpdateSticker: (id: string, emoji: string, category: string) => Promise<void>;
  onDeleteSticker: (id: string) => Promise<void>;

  fonts: CustomFont[];
  onAddFont: (name: string, displayName: string) => Promise<void>;
  onUpdateFont: (id: string, name: string, displayName: string) => Promise<void>;
  onDeleteFont: (id: string) => Promise<void>;
}

export default function StickersFontsManager({
  stickers,
  onAddSticker,
  onUpdateSticker,
  onDeleteSticker,
  fonts,
  onAddFont,
  onUpdateFont,
  onDeleteFont
}: StickersFontsManagerProps) {
  // Sticker States
  const [emoji, setEmoji] = useState('');
  const [stickerCategory, setStickerCategory] = useState('Cute');
  const [editingSticker, setEditingSticker] = useState<CustomSticker | null>(null);
  const [isSubmittingSticker, setIsSubmittingSticker] = useState(false);

  // Font States
  const [fontName, setFontName] = useState('');
  const [fontDisplay, setFontDisplay] = useState('');
  const [editingFont, setEditingFont] = useState<CustomFont | null>(null);
  const [isSubmittingFont, setIsSubmittingFont] = useState(false);

  // Load editing values
  useEffect(() => {
    if (editingSticker) {
      setEmoji(editingSticker.emoji);
      setStickerCategory(editingSticker.category);
    } else {
      setEmoji('');
      setStickerCategory('Cute');
    }
  }, [editingSticker]);

  useEffect(() => {
    if (editingFont) {
      setFontName(editingFont.name);
      setFontDisplay(editingFont.displayName);
    } else {
      setFontName('');
      setFontDisplay('');
    }
  }, [editingFont]);

  // Submit Handlers
  const handleStickerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emoji) return;
    setIsSubmittingSticker(true);
    try {
      if (editingSticker) {
        await onUpdateSticker(editingSticker.id, emoji, stickerCategory);
        setEditingSticker(null);
      } else {
        await onAddSticker(emoji, stickerCategory);
      }
      setEmoji('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingSticker(false);
    }
  };

  const handleFontSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fontName || !fontDisplay) return;
    setIsSubmittingFont(true);
    try {
      if (editingFont) {
        await onUpdateFont(editingFont.id, fontName, fontDisplay);
        setEditingFont(null);
      } else {
        await onAddFont(fontName, fontDisplay);
      }
      setFontName('');
      setFontDisplay('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFont(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* 1. STICKERS MANAGEMENT CARD */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">Kelola Stiker Emoji</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#1d90ff] rounded-full border border-blue-100 uppercase">
            {stickers.length} Preset
          </span>
        </div>

        {/* Sticker Input Form */}
        <form onSubmit={handleStickerSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Karakter Emoji</label>
            <input
              type="text"
              required
              maxLength={2}
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="✨"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center text-lg bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Kategori</label>
            <select
              value={stickerCategory}
              onChange={(e) => setStickerCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
            >
              <option value="Cute">Cute 🎀</option>
              <option value="Party">Party 🎈</option>
              <option value="Cool">Cool 🕶️</option>
              <option value="Funny">Funny 🤪</option>
            </select>
          </div>

          <div className="flex gap-2">
            {editingSticker && (
              <button 
                type="button" 
                onClick={() => setEditingSticker(null)}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmittingSticker}
              className="w-full py-2.5 bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
            >
              {editingSticker ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingSticker ? 'Simpan' : 'Tambah'}</span>
            </button>
          </div>
        </form>

        {/* Sticker Grid List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
          {stickers.map((st) => (
            <div 
              key={st.id} 
              className={`flex items-center justify-between p-2.5 border rounded-xl bg-white transition ${
                editingSticker?.id === st.id ? 'border-[#1d90ff] ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-350'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl select-all">{st.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-600">{st.category}</span>
                </div>
              </div>
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => setEditingSticker(st)}
                  className="p-1 text-slate-400 hover:text-[#1d90ff] transition"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteSticker(st.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FONTS MANAGEMENT CARD */}
      <div className="bg-white border border-slate-200 p-6 rounded-[28px] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">Kelola Google Fonts</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#1d90ff] rounded-full border border-blue-100 uppercase">
            {fonts.length} Font
          </span>
        </div>

        {/* Font Input Form */}
        <form onSubmit={handleFontSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Nama Google Font</label>
            <input
              type="text"
              required
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              placeholder="Pacifico"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white text-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Label Tampilan</label>
            <input
              type="text"
              required
              value={fontDisplay}
              onChange={(e) => setFontDisplay(e.target.value)}
              placeholder="Retro Cursive"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
            />
          </div>

          <div className="flex gap-2">
            {editingFont && (
              <button 
                type="button" 
                onClick={() => setEditingFont(null)}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmittingFont}
              className="w-full py-2.5 bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
            >
              {editingFont ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingFont ? 'Simpan' : 'Tambah'}</span>
            </button>
          </div>
        </form>

        {/* Font List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {fonts.map((f) => (
            <div 
              key={f.id} 
              className={`flex items-center justify-between p-3 border rounded-xl bg-white transition ${
                editingFont?.id === f.id ? 'border-[#1d90ff] ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-350'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800" style={{ fontFamily: f.name }}>
                  {f.displayName}
                </span>
                <span className="text-[9px] font-mono text-slate-400">Google Font: {f.name}</span>
              </div>
              
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingFont(f)}
                  className="p-1.5 text-slate-400 hover:text-[#1d90ff] hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteFont(f.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
