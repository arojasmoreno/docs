
import React, { useState, useEffect } from 'react';
import { IndustrialDocument, DocType, WorkCenter, Language, getDocTypeKey } from '../types';
import { translations } from '../translations';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Partial<IndustrialDocument>) => void;
  editingDoc: IndustrialDocument | null;
  workCenters: WorkCenter[];
  language?: Language;
}

const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose, onSave, editingDoc, workCenters, language = 'es' }) => {
  const [formData, setFormData] = useState<Partial<IndustrialDocument>>({
    title: '',
    type: DocType.INSTRUCCION,
    category: '',
    driveUrl: '',
    description: '',
    centerId: ''
  });

  const t = (key: string) => translations[language][key] || key;

  useEffect(() => {
    if (editingDoc) {
      setFormData(editingDoc);
    } else {
      setFormData({
        title: '',
        type: DocType.INSTRUCCION,
        category: '',
        driveUrl: '',
        description: '',
        centerId: workCenters[0]?.id || ''
      });
    }
  }, [editingDoc, isOpen, workCenters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {editingDoc ? 'Editar Documento' : 'Nuevo Documento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Título</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as DocType })}>
                {Object.values(DocType).map(docType => (
                  <option key={docType} value={docType}>
                    {t(getDocTypeKey(docType))}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Centro de Trabajo</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.centerId} onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}>
                {workCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">URL Google Drive</label>
            <input type="url" required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.driveUrl} onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg h-20" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocModal;
