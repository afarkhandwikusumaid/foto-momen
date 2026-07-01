import React from 'react';
import { Image as ImageIcon, CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react';

interface TemplateCatalogProps {
  templates: any[];
  isLoading: boolean;
  editingId: string | null;
  onEdit: (tpl: any) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onRefresh: () => void;
}

export default function TemplateCatalog({
  templates,
  isLoading,
  editingId,
  onEdit,
  onDelete,
  onRefresh
}: TemplateCatalogProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-slate-400" /> Katalog Template
        </h2>
        <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-[#1d90ff] bg-slate-50 hover:bg-blue-50 rounded-xl transition shadow-sm">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400 font-medium">Memuat data dari database...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <div className="w-14 h-14 bg-white shadow text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7" />
          </div>
          <p className="text-slate-500 font-medium">Belum ada template custom.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map(tpl => (
            <div 
              key={tpl.id} 
              onClick={() => onEdit(tpl)}
              className={`group relative border-2 rounded-2xl p-3 cursor-pointer transition-all ${editingId === tpl.id ? 'border-[#1d90ff] bg-blue-50 shadow-md' : 'border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50'}`}
            >
              {!tpl.active && (
                <div className="absolute top-2 left-2 z-30 bg-slate-800/80 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                   <XCircle className="w-3 h-3" /> Nonaktif
                </div>
              )}
              {tpl.active && (
                <div className="absolute top-2 left-2 z-30 bg-emerald-500/90 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> Aktif
                </div>
              )}
              
              <div className="aspect-[3/4] bg-white rounded-xl mb-3 overflow-hidden flex items-center justify-center relative shadow-sm border border-slate-100 p-2" style={{ backgroundColor: tpl.hex || '#ffffff' }}>
                {tpl.imageUrl && <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-contain drop-shadow-md z-10 relative" />}
              </div>
              
              <div className="px-1 pb-1 text-center">
                <h3 className="font-bold text-slate-800 text-sm truncate">{tpl.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{tpl.layout} • {tpl.photoCount || 4} Pose</p>
              </div>
              
              <button 
                onClick={(e) => onDelete(tpl.id, e)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur text-red-500 hover:bg-red-500 hover:text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-all z-30"
                title="Hapus Permanen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
