import React, { useState, useEffect, useMemo } from 'react';
import TemplateCatalog from '../../components/TemplateCatalog';
import { deleteTemplate, getCustomRoutes, CustomRoute } from '../../../../services/dbService';
import { RefreshCw, ImageIcon } from 'lucide-react';

import Swal from 'sweetalert2';

interface TemplateCatalogViewProps {
  isPrivate: boolean;
  templates: any[];
  loadTemplates: () => Promise<void>;
  isLoading: boolean;
  onEditRequest: (template: any) => void;
}

export default function TemplateCatalogView({ isPrivate, templates, loadTemplates, isLoading, onEditRequest }: TemplateCatalogViewProps) {
  const [routes, setRoutes] = useState<CustomRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  useEffect(() => {
    if (isPrivate) {
      setIsLoadingRoutes(true);
      getCustomRoutes()
        .then(data => setRoutes(data))
        .catch(console.error)
        .finally(() => setIsLoadingRoutes(false));
    }
  }, [isPrivate]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Hapus Template?',
      text: 'Yakin ingin menghapus template ini secara permanen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTemplate(id);
      await loadTemplates();
      Swal.fire('Terhapus!', 'Template berhasil dihapus.', 'success');
    } catch {
      Swal.fire('Gagal', 'Gagal menghapus template.', 'error');
    }
  };

  const filteredTemplates = useMemo(() => {
    return isPrivate 
      ? templates.filter(t => !!t.eventCode) 
      : templates.filter(t => !t.eventCode);
  }, [templates, isPrivate]);

  const routeMap = useMemo(() => {
    const map: Record<string, CustomRoute> = {};
    routes.forEach(r => {
      map[r.slug] = r;
    });
    return map;
  }, [routes]);

  // Group templates by eventCode if private
  const groupedTemplates = useMemo(() => {
    if (!isPrivate) return [];
    
    const groups: Record<string, { eventCode: string; route?: CustomRoute; templates: any[] }> = {};
    
    filteredTemplates.forEach(tpl => {
      const code = tpl.eventCode || 'unassigned';
      if (!groups[code]) {
        groups[code] = {
          eventCode: code,
          route: routeMap[code],
          templates: []
        };
      }
      groups[code].templates.push(tpl);
    });
    
    // Sort groups so that unassigned is last, or sort alphabetically
    return Object.values(groups).sort((a, b) => {
      if (a.eventCode === 'unassigned') return 1;
      if (b.eventCode === 'unassigned') return -1;
      return a.eventCode.localeCompare(b.eventCode);
    });
  }, [filteredTemplates, isPrivate, routeMap]);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {isPrivate ? 'Katalog Template Privat' : 'Katalog Template Publik'}
          </h2>
          <p className="text-slate-500 mt-1">
            {isPrivate 
              ? 'Daftar semua frame privat yang terhubung dengan rute kolaborasi (event code) tertentu.' 
              : 'Daftar semua frame publik yang terdaftar di website utama Foto Momen.'}
          </p>
        </div>
        <button 
          onClick={() => {
            loadTemplates();
            if (isPrivate) {
              setIsLoadingRoutes(true);
              getCustomRoutes()
                .then(data => setRoutes(data))
                .catch(console.error)
                .finally(() => setIsLoadingRoutes(false));
            }
          }}
          className="p-2 text-slate-400 hover:text-[#1d90ff] bg-white border border-slate-200 hover:bg-blue-50 rounded-xl transition shadow-sm self-center animate-none"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading || isLoadingRoutes ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isPrivate ? (
        isLoadingRoutes && routes.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium text-sm">Memuat pengelompokan event...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center py-12 text-slate-400 font-medium">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            Belum ada template privat yang dibuat.
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTemplates.map(group => {
              const { eventCode, route, templates: groupTemplates } = group;
              
              let badgeText = 'Event';
              let badgeClass = 'bg-blue-50 text-blue-600 border border-blue-100';
              let groupTitle = eventCode === 'unassigned' ? 'Belum Diisi Event Code' : `Event Code: ${eventCode}`;
              
              if (route) {
                groupTitle = route.title;
                if (route.routeType === 'yearbook') {
                  badgeText = 'Yearbook / Sekolah';
                  badgeClass = 'bg-purple-50 text-purple-600 border border-purple-100';
                } else {
                  badgeText = 'Event / Acara';
                  badgeClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                }
              } else if (eventCode !== 'unassigned') {
                badgeText = 'Custom Event';
                badgeClass = 'bg-slate-100 text-slate-600 border border-slate-200';
              } else {
                badgeText = 'Draft / Orphan';
                badgeClass = 'bg-red-50 text-red-600 border border-red-100';
              }

              return (
                <div key={eventCode} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {badgeText}
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-base">{groupTitle}</h3>
                      {route && (
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                          (Slug: <code className="bg-slate-50 px-1 py-0.5 rounded text-slate-600 font-mono">/{route.slug}</code>)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {groupTemplates.length} Frame
                    </div>
                  </div>

                  <TemplateCatalog 
                    templates={groupTemplates}
                    isLoading={isLoading}
                    editingId={null}
                    onEdit={onEditRequest}
                    onDelete={handleDelete}
                    onRefresh={loadTemplates}
                    isCompact={true}
                  />
                </div>
              );
            })}
          </div>
        )
      ) : (
        <TemplateCatalog 
          templates={filteredTemplates}
          isLoading={isLoading}
          editingId={null}
          onEdit={onEditRequest}
          onDelete={handleDelete}
          onRefresh={loadTemplates}
          isCompact={true}
        />
      )}
    </div>
  );
}
