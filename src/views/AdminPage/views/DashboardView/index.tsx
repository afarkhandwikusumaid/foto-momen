import React, { useState, useEffect } from 'react';
import { Images, Image as ImageIcon, ArrowUpRight, Link2, Sparkles, FolderOpen, Heart } from 'lucide-react';
import { getAllSessions, getCustomRoutes } from '../../../../services/dbService';

interface DashboardViewProps {
  templates: any[];
}

export default function DashboardView({ templates }: DashboardViewProps) {
  // Public templates calculations
  const publicTemplates = templates.filter(t => !t.eventCode);
  const activePublicTemplates = publicTemplates.filter(t => t.active).length;

  // Private templates calculations
  const privateTemplates = templates.filter(t => !!t.eventCode);
  const activePrivateTemplates = privateTemplates.filter(t => t.active).length;

  const [totalSessions, setTotalSessions] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getAllSessions().then(data => setTotalSessions(data.length)),
      getCustomRoutes().then(data => setTotalRoutes(data.length))
    ])
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Selamat Datang di Dashboard</h2>
        <p className="text-slate-500 mt-1">Ringkasan performa, data template, dan aktivitas rute kolaborasi Foto Momen.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Memuat rangkasan data...</p>
        </div>
      ) : (
        <>
          {/* Section 1: Aktivitas & Event */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Aktivitas & Event Kolaborasi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat Card 1: Total Sesi Foto */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Sesi Foto</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-800">{totalSessions}</span>
                    <span className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Sesi Terambil</span>
                  </div>
                </div>
              </div>

              {/* Stat Card 2: Rute Kolaborasi */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Link2 className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Rute Kolaborasi Aktif</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-800">{totalRoutes}</span>
                    <span className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Rute Terdaftar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Distribusi Frame Template */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              Manajemen Frame Template
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat Card 3: Template Publik */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Images className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Template Publik</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-800">{activePublicTemplates}</span>
                    <span className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Aktif • Dari {publicTemplates.length} Total</span>
                  </div>
                </div>
              </div>

              {/* Stat Card 4: Template Privat */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Heart className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Template Privat (Event)</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-800">{activePrivateTemplates}</span>
                    <span className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Aktif • Dari {privateTemplates.length} Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Info Panel */}
      <div className="bg-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-black mb-3">Foto Momen Admin</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Kini dashboard telah dikelompokkan dengan jelas antara template Publik, template Privat khusus Event, serta statistik Rute Kolaborasi. Anda dapat mengelola masing-masing kategori melalui menu sidebar.
          </p>
        </div>
      </div>
    </div>
  );
}
