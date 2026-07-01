import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Calendar, Layout, Trash2 } from 'lucide-react';
import { getAllSessions } from '../../../services/dbService';

export default function GalleryView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSessions();
      // Sort descending
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSessions(data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Yakin ingin menghapus riwayat sesi ini dari galeri? (File asli di pengunjung tidak terhapus)')) return;
    // Note: In a real app with Supabase, perform a DELETE operation here.
    // For now, we simulate the local deletion.
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Galeri Pengguna</h2>
          <p className="text-slate-500 mt-1">Daftar foto yang dicetak oleh pengunjung melalui Photobooth Anda.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
          Total Foto: <span className="text-[#1d90ff] ml-1">{sessions.length}</span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Foto</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Data riwayat foto akan muncul di sini secara otomatis setelah ada pengunjung yang menyelesaikan sesi cetak di Photobooth.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="break-inside-avoid bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer"
              onClick={() => setSelectedImage(session.imageUrl)}
            >
              <div className="bg-slate-50 rounded-xl overflow-hidden relative">
                <img 
                  src={session.imageUrl} 
                  alt="Sesi Foto" 
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                <button 
                  onClick={(e) => deleteSession(session.id, e)}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Hapus dari riwayat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Layout className="w-3.5 h-3.5 text-blue-500" />
                  {session.frameName} ({session.layout})
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.createdAt).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Preview Penuh" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
          <button className="absolute top-6 right-6 text-white bg-slate-800/50 hover:bg-slate-800 p-3 rounded-full backdrop-blur-md transition">
            Tutup
          </button>
        </div>
      )}

    </div>
  );
}
