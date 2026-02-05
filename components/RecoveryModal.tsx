
import React, { useState } from 'react';
import { User } from '../types';
import { simulatePasswordRecovery } from '../services/geminiService';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, onClose, users }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      const aiText = await simulatePasswordRecovery(user.email, user.name);
      setMessage(aiText || `Se ha enviado un correo a ${email}.`);
    } else {
      // Por seguridad, en sistemas reales no se suele decir si el email existe, 
      // pero para esta app demo daremos feedback claro.
      setError('No se ha encontrado ninguna cuenta asociada a este correo electrónico.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-[#1a2b3c] text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Recuperar Acceso</h2>
          <button onClick={() => { onClose(); setMessage(null); setEmail(''); }} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-slate-500 leading-relaxed">
                Introduce tu correo electrónico corporativo de Samsic y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Corporativo</label>
                <input 
                  type="email" 
                  required 
                  autoFocus
                  placeholder="ejemplo@indudocs.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a2b3c] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-pulse">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#1a2b3c] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando solicitud...</span>
                  </>
                ) : 'Enviar Instrucciones'}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center animate-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">¡Solicitud Enviada!</h3>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-sm text-slate-600 italic whitespace-pre-wrap leading-relaxed shadow-inner font-serif">
                "{message}"
              </div>
              <p className="text-xs text-slate-400">
                Por favor, revisa tu carpeta de SPAM si no recibes el correo en los próximos 5 minutos.
              </p>
              <button 
                onClick={() => { onClose(); setMessage(null); setEmail(''); }}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecoveryModal;
