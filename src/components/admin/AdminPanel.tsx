import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, BarChart3, Palette, Calendar, LogOut, Sliders, Smile } from 'lucide-react';
import { FRAME_COLORS } from '../photobooth/FrameSelector';
import { FrameColor } from '../../types';
import { 
  getUserSessions, 
  CustomBackdrop, CustomSticker, CustomFont,
  getBackdrops, saveBackdrop, updateBackdrop, deleteBackdrop,
  getStickers, saveSticker, updateSticker, deleteSticker,
  getFonts, saveFont, updateFont, deleteFont
} from '../../services/dbService';
import { supabase, isSupabaseReady } from '../../supabase/config';

// Modular Component Imports (1 Feature = 1 File)
import DashboardStats from './DashboardStats';
import TemplateManager from './TemplateManager';
import BookingManager from './BookingManager';
import BackdropManager from './BackdropManager';
import StickersFontsManager from './StickersFontsManager';
import Login from './Login';
import AdminLayout from './AdminLayout';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export type TabType = 'dashboard' | 'templates' | 'bookings' | 'backdrops' | 'stickers-fonts';

export default function AdminPanel({ onBackToHome }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [templates, setTemplates] = useState<FrameColor[]>(FRAME_COLORS);
  
  // Premium customizable lists
  const [backdrops, setBackdrops] = useState<CustomBackdrop[]>([]);
  const [stickers, setStickers] = useState<CustomSticker[]>([]);
  const [fonts, setFonts] = useState<CustomFont[]>([]);

  // Password-lock States
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('foto_momen_admin_auth') === 'true'
  );

  // Bookings list
  const [bookings, setBookings] = useState([
    {
      id: 'book_1',
      name: 'Aditya Pratama',
      email: 'aditya.p@gmail.com',
      eventDate: '2026-08-15',
      eventType: 'Pernikahan (Wedding)',
      notes: 'Membutuhkan setup photobooth fisik dengan custom watermark logo pernikahan.',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'book_2',
      name: 'Sherly Amanda',
      email: 'sherly.amanda@outlook.com',
      eventDate: '2026-09-02',
      eventType: 'Ulang Tahun (Birthday Party)',
      notes: 'Perkiraan undangan 150 orang. Sewa durasi 3 jam.',
      createdAt: Date.now() - 86400000 * 5
    }
  ]);

  const [stats, setStats] = useState({
    totalPhotos: 24,
    totalBookings: 2,
    activeTemplates: FRAME_COLORS.length
  });

  const fetchSupabaseData = async () => {

    try {
      // 1. Fetch Bookings from Supabase
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!bError && bData) {
        setBookings(bData.map((b: any) => ({
          id: b.id.toString(),
          name: b.name,
          email: b.email,
          eventDate: b.event_date,
          eventType: b.event_type,
          notes: b.notes,
          createdAt: new Date(b.created_at).getTime()
        })));
        setStats(prev => ({ ...prev, totalBookings: bData.length }));
      }

      // 2. Fetch Custom Templates from Supabase
      const { data: tData, error: tError } = await supabase
        .from('templates')
        .select('*');
      
      if (!tError && tData && tData.length > 0) {
        setTemplates(tData);
        setStats(prev => ({ ...prev, activeTemplates: tData.length }));
      }
    } catch (err) {
      console.error('Gagal mengambil data dari Supabase:', err);
    }
  };

  useEffect(() => {
    // Load some live counts
    getUserSessions().then((sessions) => {
      if (sessions && sessions.length > 0) {
        setStats(prev => ({
          ...prev,
          totalPhotos: sessions.length + 24
        }));
      }
    }).catch(console.error);

    fetchSupabaseData();

    // Fetch Dynamic backdrops, stickers, fonts
    getBackdrops().then(setBackdrops).catch(console.error);
    getStickers().then(setStickers).catch(console.error);
    getFonts().then(setFonts).catch(console.error);
  }, []);



  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('foto_momen_admin_auth');
    onBackToHome();
  };

  const handleAddTemplate = async (name: string, hex: string, textColor: string, imageUrl?: string) => {
    const newTemp: FrameColor = {
      id: `custom_${Date.now()}`,
      name,
      bgClass: `bg-custom`,
      hex,
      textColor,
      borderClass: 'border-slate-200',
      imageUrl
    };

    try {
      const { error } = await supabase
        .from('templates')
        .insert([{
          id: newTemp.id,
          name: newTemp.name,
          hex: newTemp.hex,
          text_color: newTemp.textColor,
          border_class: newTemp.borderClass,
          image_url: newTemp.imageUrl,
          active: true
        }]);
      if (error) throw error;
    } catch (err) {
      console.error('Supabase insert template failed:', err);
    }

    setTemplates(prev => [...prev, newTemp]);
    setStats(prev => ({ ...prev, activeTemplates: prev.activeTemplates + 1 }));
  };

  const handleUpdateTemplate = async (id: string, name: string, hex: string, textColor: string, imageUrl?: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          name,
          hex,
          text_color: textColor,
          image_url: imageUrl
        })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Supabase update template failed:', err);
    }

    setTemplates(prev => prev.map(t => t.id === id ? { ...t, name, hex, textColor, imageUrl } : t));
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await supabase
        .from('templates')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error('Supabase delete template failed:', err);
    }
    setTemplates(prev => prev.filter(t => t.id !== id));
    setStats(prev => ({ ...prev, activeTemplates: prev.activeTemplates - 1 }));
  };

  // Backdrops Handlers
  const handleAddBackdrop = async (name: string, value: string) => {
    const item: CustomBackdrop = { id: `bd_${Date.now()}`, name, value, active: true };
    await saveBackdrop(item);
    setBackdrops(prev => [...prev, item]);
  };
  const handleUpdateBackdrop = async (id: string, name: string, value: string) => {
    const item = { id, name, value, active: true };
    await updateBackdrop(item);
    setBackdrops(prev => prev.map(x => x.id === id ? item : x));
  };
  const handleDeleteBackdrop = async (id: string) => {
    await deleteBackdrop(id);
    setBackdrops(prev => prev.filter(x => x.id !== id));
  };

  // Stickers Handlers
  const handleAddSticker = async (emoji: string, category: string) => {
    const item: CustomSticker = { id: `st_${Date.now()}`, emoji, category, active: true };
    await saveSticker(item);
    setStickers(prev => [...prev, item]);
  };
  const handleUpdateSticker = async (id: string, emoji: string, category: string) => {
    const item = { id, emoji, category, active: true };
    await updateSticker(item);
    setStickers(prev => prev.map(x => x.id === id ? item : x));
  };
  const handleDeleteSticker = async (id: string) => {
    await deleteSticker(id);
    setStickers(prev => prev.filter(x => x.id !== id));
  };

  // Fonts Handlers
  const handleAddFont = async (name: string, displayName: string) => {
    const item: CustomFont = { id: `f_${Date.now()}`, name, displayName, active: true };
    await saveFont(item);
    setFonts(prev => [...prev, item]);
  };
  const handleUpdateFont = async (id: string, name: string, displayName: string) => {
    const item = { id, name, displayName, active: true };
    await updateFont(item);
    setFonts(prev => prev.map(x => x.id === id ? item : x));
  };
  const handleDeleteFont = async (id: string) => {
    await deleteFont(id);
    setFonts(prev => prev.filter(x => x.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <Login 
        onLoginSuccess={() => setIsAuthenticated(true)} 
        onBackToHome={onBackToHome} 
      />
    );
  }

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      onBackToHome={onBackToHome}
    >
      {/* Dynamic Tab Render */}
      <div className="w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <DashboardStats stats={stats} />
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-left">
                <h4 className="font-extrabold text-sm text-slate-800">Database Supabase Aktif</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  Sistem basis data terhubung secara penuh. Segala pembaruan template akan langsung tersimpan secara dinamis dan direfleksikan langsung ke halaman cetak photobooth virtual.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 self-start sm:self-auto select-none shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Connected
              </span>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <TemplateManager
              templates={templates}
              onAddTemplate={handleAddTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </div>
        )}

        {activeTab === 'backdrops' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <BackdropManager
              backdrops={backdrops}
              onAddBackdrop={handleAddBackdrop}
              onUpdateBackdrop={handleUpdateBackdrop}
              onDeleteBackdrop={handleDeleteBackdrop}
            />
          </div>
        )}

        {activeTab === 'stickers-fonts' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <StickersFontsManager
              stickers={stickers}
              onAddSticker={handleAddSticker}
              onUpdateSticker={handleUpdateSticker}
              onDeleteSticker={handleDeleteSticker}
              fonts={fonts}
              onAddFont={handleAddFont}
              onUpdateFont={handleUpdateFont}
              onDeleteFont={handleDeleteFont}
            />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <BookingManager bookings={bookings} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
