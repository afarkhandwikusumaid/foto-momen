import React from 'react';
import TemplateCatalog from '../components/TemplateCatalog';
import { deleteTemplate } from '../../../services/dbService';

interface TemplateCatalogViewProps {
  templates: any[];
  loadTemplates: () => Promise<void>;
  isLoading: boolean;
  onEditRequest: (template: any) => void;
}

export default function TemplateCatalogView({ templates, loadTemplates, isLoading, onEditRequest }: TemplateCatalogViewProps) {
  
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Yakin ingin menghapus template ini secara permanen?')) return;
    try {
      await deleteTemplate(id);
      await loadTemplates();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus template.');
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
