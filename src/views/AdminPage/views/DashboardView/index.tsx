import React, { useState, useEffect } from 'react';
import { Images, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { getAllSessions } from '../../../../services/dbService';

interface DashboardViewProps {
  templates: any[];
}

export default function DashboardView({ templates }: DashboardViewProps) {
  const activeTemplates = templates.filter(t => t.active).length;
  const totalTemplates = templates.length;

  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    getAllSessions().then(data => {
      setTotalSessions(data.length);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Selamat Datang di Dashboard</h2>
        <p className="text-slate-500 mt-1">Ringkasan performa dan data sistem Foto Momen Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Images className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +2
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold mb-1">Total Template Aktif</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-800">{activeTemplates}</span>
              <span className="text-sm text-slate-400 font-medium mb-1">dari {totalTemplates}</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold mb-1">Total Sesi Foto</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-800">{totalSessions}</span>
              <span className="text-sm text-slate-400 font-medium mb-1">Sesi dicetak</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions or Info */}
      <div className="bg-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-black mb-3">Foto Momen Photobooth Kiosk</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Sistem web photobooth ini dirancang untuk berjalan pada layar sentuh/Kiosk.
            Semua template yang ditambahkan melalui menu <strong>Kelola Template</strong> akan langsung tersinkronisasi ke aplikasi utama.
          </p>
        </div>
      </div>
    </div>
  );
}
