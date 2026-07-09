import React, { useState, useEffect } from 'react';
import { getCustomRoutes, saveCustomRoute, deleteCustomRoute, CustomRoute } from '../../../../services/dbService';
import { Plus, Trash2, Edit2, Link2, ExternalLink, Copy, Check, Info } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CollaborationRoutesView() {
  const [routes, setRoutes] = useState<CustomRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [routeType, setRouteType] = useState<CustomRoute['routeType']>('event');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetId, setTargetId] = useState('');

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await getCustomRoutes();
      setRoutes(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'Gagal memuat daftar rute kolaborasi.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const resetForm = () => {
    setEditingRouteId(null);
    setSlug('');
    setRouteType('event');
    setTitle('');
    setDescription('');
    setTargetId('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (route: CustomRoute) => {
    setEditingRouteId(route.id);
    setSlug(route.slug);
    setRouteType(route.routeType);
    setTitle(route.title);
    setDescription(route.description || '');
    setTargetId(route.targetId || '');
    setIsFormOpen(true);
  };

  const handleCopyLink = (slugPath: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/${slugPath}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopiedId(slugPath);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  const handleDelete = async (route: CustomRoute) => {
    const result = await Swal.fire({
      title: 'Hapus Rute?',
      text: `Apakah Anda yakin ingin menghapus rute /${route.slug}? Tindakan ini tidak bisa dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteCustomRoute(route.id);
        await loadRoutes();
        Swal.fire({
          title: 'Dihapus!',
          text: 'Rute kolaborasi berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err: any) {
        Swal.fire({
          title: 'Gagal',
          text: err.message || 'Gagal menghapus rute.',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      Swal.fire('Input Error', 'Slug path tidak boleh kosong!', 'warning');
      return;
    }

    // Slug format validation: lowercase, numbers, dash, underscore, and slash for directory structure
    const slugRegex = /^[a-z0-9\-_]+(\/[a-z0-9\-_]+)*$/;
    if (!slugRegex.test(cleanSlug)) {
      Swal.fire(
        'Format Slug Salah',
        'Slug hanya boleh mengandung huruf kecil, angka, tanda hubung (-), garis bawah (_), dan garis miring (/) untuk struktur sub-folder (contoh: lentera/12a).',
        'warning'
      );
      return;
    }

    if (!title.trim()) {
      Swal.fire('Input Error', 'Judul rute tidak boleh kosong!', 'warning');
      return;
    }

    try {
      await saveCustomRoute({
        id: editingRouteId || undefined,
        slug: cleanSlug,
        routeType,
        title: title.trim(),
        description: description.trim() || undefined,
        targetId: targetId.trim() || undefined
      });

      setIsFormOpen(false);
      resetForm();
      await loadRoutes();

      Swal.fire({
        title: 'Sukses!',
        text: editingRouteId ? 'Rute berhasil diperbarui.' : 'Rute baru berhasil didaftarkan.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan saat menyimpan rute.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Rute Kolaborasi</h2>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi rute custom/slug dinamis untuk profil perusahaan, yearbook kelas, atau event khusus.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold shadow-md shadow-blue-500/10 transition duration-150 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Tambah Rute Baru
        </button>
      </div>

      {/* Main Form Modal / Sidebar Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-fade-in">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                {editingRouteId ? 'Edit Rute Kolaborasi' : 'Tambah Rute Kolaborasi Baru'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-light cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              
              {/* Route Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tipe Rute</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['company', 'yearbook', 'event'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRouteType(type)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize ${
                        routeType === type
                          ? 'bg-[#1d90ff]/10 text-[#1d90ff] border-[#1d90ff]'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'company' ? 'Company' : type === 'yearbook' ? 'Yearbook/Class' : 'Event'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slug Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Slug Path URL</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#1d90ff] transition-all bg-slate-50">
                  <span className="px-3.5 flex items-center text-slate-400 text-xs font-semibold select-none border-r border-slate-200 bg-slate-100">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={routeType === 'company' ? 'lentera' : routeType === 'yearbook' ? 'lentera/12a' : 'eventnama'}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white focus:outline-none text-slate-800 font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Format: huruf kecil, angka, - (strip), _ (garis bawah), / (garis miring)
                </p>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Rute / Nama Profil</label>
                <input
                  type="text"
                  required
                  placeholder={routeType === 'company' ? 'PT Lentera Yearbook Indonesia' : routeType === 'yearbook' ? 'Kelas XII IPA 1' : 'Ulang Tahun Lentera'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#1d90ff] text-slate-800 font-medium"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Singkat</label>
                <textarea
                  placeholder="Keterangan opsional yang akan ditampilkan pada halaman profil rute."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#1d90ff] text-slate-800 font-medium resize-none"
                />
              </div>

              {/* Target ID Field */}
              {routeType !== 'company' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Event Code (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Biarkan kosong untuk mencocokkan otomatis dengan Slug URL"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#1d90ff] text-slate-800 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Jika diisi, studio photobooth akan memuat template frame dengan event_code ini.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full text-sm font-bold transition shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Simpan Rute
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Rute List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Memuat data rute...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Link2 className="w-12 h-12 text-slate-300" />
            <div className="text-center">
              <p className="font-bold text-slate-600">Belum ada rute custom</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan tombol di atas untuk menambahkan rute custom pertama.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Profil / Rute</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Link URL</th>
                  <th className="px-6 py-4">Target Event Code</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {routes.map((route) => {
                  return (
                    <tr key={route.id} className="hover:bg-slate-50/50 transition-all">
                      
                      {/* Name & Title */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{route.title}</div>
                        {route.description && (
                          <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{route.description}</div>
                        )}
                      </td>

                      {/* Route Type Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          route.routeType === 'company'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : route.routeType === 'yearbook'
                            ? 'bg-purple-50 text-purple-600 border border-purple-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {route.routeType === 'company' ? 'Company' : route.routeType === 'yearbook' ? 'Yearbook' : 'Event'}
                        </span>
                      </td>

                      {/* URL Link and Copy Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 group">
                          <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded text-slate-500 font-semibold max-w-[200px] truncate">
                            /{route.slug}
                          </span>
                          <button
                            onClick={() => handleCopyLink(route.slug)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            title="Salin Link"
                          >
                            {copiedId === route.slug ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`/${route.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1d90ff] hover:bg-slate-100 transition cursor-pointer"
                            title="Buka Halaman"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>

                      {/* Target ID / Event Code */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium">
                          {route.routeType === 'company' ? '-' : route.targetId || route.slug}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(route)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Rute"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(route)}
                            className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                            title="Hapus Rute"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
