import React from 'react';
import TemplateCatalog from '../../components/TemplateCatalog';
import { deleteTemplate } from '../../../../services/dbService';

import Swal from 'sweetalert2';

interface TemplateCatalogViewProps {
  templates: any[];
  loadTemplates: () => Promise<void>;
  isLoading: boolean;
  onEditRequest: (template: any) => void;
}

export default function TemplateCatalogView({ templates, loadTemplates, isLoading, onEditRequest }: TemplateCatalogViewProps) {
  
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
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal menghapus template.', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Katalog Template</h2>
        <p className="text-slate-500 mt-1">Daftar semua frame yang telah Anda unggah. Anda dapat mengubah status aktif/non-aktif di sini.</p>
      </div>

      <TemplateCatalog 
        templates={templates}
        isLoading={isLoading}
        editingId={null} // We are not editing directly here, clicking edit navigates
        onEdit={onEditRequest}
        onDelete={handleDelete}
        onRefresh={loadTemplates}
      />
    </div>
  );
}
