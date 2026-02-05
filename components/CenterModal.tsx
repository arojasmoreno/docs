
import React, { useState, useEffect } from 'react';
import { WorkCenter } from '../types';

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (center: Partial<WorkCenter>) => void;
  editingCenter: WorkCenter | null;
}

const CenterModal: React.FC<CenterModalProps> = ({ isOpen, onClose, onSave, editingCenter }) => {
  const [formData, setFormData] = useState<Partial<WorkCenter>>({ name: '', location: '' });

  useEffect(() => {
    if (editingCenter) setFormData(editingCenter);
    else setFormData({ name: '', location: '' });
  }, [editingCenter, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{editingCenter ? 'Editar Centro' : 'Nuevo Centro'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Centro</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                   value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                   value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CenterModal;
