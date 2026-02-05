
import React, { useState, useEffect } from 'react';
import { User, UserRole, WorkCenter } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  editingUser: User | null;
  workCenters: WorkCenter[];
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, editingUser, workCenters }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.OPERARIO,
    password: '',
    centerId: ''
  });

  useEffect(() => {
    if (editingUser) setFormData(editingUser);
    else setFormData({ name: '', email: '', role: UserRole.OPERARIO, password: '', centerId: workCenters[0]?.id || '' });
  }, [editingUser, isOpen, workCenters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rol</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
                <option value={UserRole.OPERARIO}>Operario</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Centro</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.centerId} onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}>
                <option value="">Ninguno (Admin Global)</option>
                {workCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input type="password" required={!editingUser} className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
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

export default UserModal;
