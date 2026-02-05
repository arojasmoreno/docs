
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, IndustrialDocument, AuthState, DocType, WorkCenter, Language, getDocTypeKey } from './types';
import { INITIAL_USERS, INITIAL_DOCS, INITIAL_CENTERS } from './constants';
import Layout from './components/Layout';
import DocModal from './components/DocModal';
import UserModal from './components/UserModal';
import CenterModal from './components/CenterModal';
import RecoveryModal from './components/RecoveryModal';
import ChatBot from './components/ChatBot';
import DocIcon from './components/DocIcon';
import { searchDocumentsAI } from './services/geminiService';
import { translations } from './translations';

const App: React.FC = () => {
  const [centers, setCenters] = useState<WorkCenter[]>(() => {
    const saved = localStorage.getItem('indudocs_centers');
    return saved ? JSON.parse(saved) : INITIAL_CENTERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('indudocs_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [docs, setDocs] = useState<IndustrialDocument[]>(() => {
    const saved = localStorage.getItem('indudocs_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('indudocs_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('indudocs_lang');
    return (saved as Language) || 'es';
  });

  const [activeTab, setActiveTab] = useState<'docs' | 'users' | 'centers'>('docs');
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocType | 'ALL'>('ALL');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('ALL');

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<IndustrialDocument | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<WorkCenter | null>(null);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Persistencia
  useEffect(() => { localStorage.setItem('indudocs_centers', JSON.stringify(centers)); }, [centers]);
  useEffect(() => { localStorage.setItem('indudocs_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('indudocs_docs', JSON.stringify(docs)); }, [docs]);
  useEffect(() => { localStorage.setItem('indudocs_auth', JSON.stringify(auth)); }, [auth]);
  useEffect(() => { localStorage.setItem('indudocs_lang', language); }, [language]);

  const t = (key: string) => translations[language][key] || key;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    if (user) { setAuth({ user, isAuthenticated: true }); setLoginError(''); }
    else setLoginError('Credenciales incorrectas');
  };

  const handleLogout = () => setAuth({ user: null, isAuthenticated: false });

  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      if (auth.user?.role === UserRole.OPERARIO) {
        if (doc.centerId !== auth.user.centerId) return false;
      }
      if (auth.user?.role === UserRole.ADMIN && selectedCenterId !== 'ALL') {
        if (doc.centerId !== selectedCenterId) return false;
      }
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || doc.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [docs, searchTerm, selectedType, selectedCenterId, auth.user]);

  const handleAiSearch = async () => {
    if (!searchTerm) return;
    setLoadingAI(true);
    const result = await searchDocumentsAI(searchTerm, filteredDocs, language);
    setAiSuggestion(result);
    setLoadingAI(false);
  };

  const saveCenter = (centerData: Partial<WorkCenter>) => {
    if (editingCenter) {
      setCenters(centers.map(c => c.id === editingCenter.id ? { ...c, ...centerData } as WorkCenter : c));
    } else {
      const newC = { ...centerData, id: 'c' + Date.now() } as WorkCenter;
      setCenters([...centers, newC]);
    }
    setIsCenterModalOpen(false);
  };

  const deleteCenter = (id: string) => {
    if (window.confirm('Eliminar el centro afectará a usuarios y documentos. ¿Continuar?')) {
      setCenters(centers.filter(c => c.id !== id));
    }
  };

  const saveDoc = (d: Partial<IndustrialDocument>) => {
    if (editingDoc) setDocs(docs.map(x => x.id === editingDoc.id ? { ...x, ...d, lastUpdated: new Date().toISOString().split('T')[0] } as IndustrialDocument : x));
    else setDocs([...docs, { ...d, id: 'd' + Date.now(), lastUpdated: new Date().toISOString().split('T')[0] } as IndustrialDocument]);
    setIsDocModalOpen(false);
  };

  const saveUser = (u: Partial<User>) => {
    if (editingUser) setUsers(users.map(x => x.id === editingUser.id ? { ...x, ...u } as User : x));
    else setUsers([...users, { ...u, id: 'u' + Date.now() } as User]);
    setIsUserModalOpen(false);
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 text-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col items-center">
             <div className="flex items-center space-x-2 mb-2">
                <div className="bg-[#1a2b3c] p-2 rounded-lg shadow-inner">
                    <span className="text-white font-black text-2xl tracking-tighter">S</span>
                </div>
                <span className="text-[#1a2b3c] font-black text-2xl tracking-widest uppercase">SAMSIC</span>
             </div>
             <h1 className="text-xl font-bold text-slate-400">Doc Manager</h1>
          </div>
          <form className="space-y-6 text-left" onSubmit={handleLogin}>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Email Corporativo</label>
              <input type="email" required className="w-full p-4 border border-slate-100 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#1a2b3c] outline-none transition-all shadow-inner" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => setIsRecoveryModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  ¿Has olvidado la contraseña?
                </button>
              </div>
              <input type="password" required className="w-full p-4 border border-slate-100 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#1a2b3c] outline-none transition-all shadow-inner" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
            </div>
            {loginError && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-[#1a2b3c] text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 hover:bg-slate-800 transition-all transform active:scale-95">
              Iniciar Sesión
            </button>
          </form>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold pt-4 border-t border-slate-100">
            admin@indudocs.com / admin <br/> juan@indudocs.com / user123
          </div>
        </div>

        <RecoveryModal 
          isOpen={isRecoveryModalOpen} 
          onClose={() => setIsRecoveryModalOpen(false)} 
          users={users} 
        />
      </div>
    );
  }

  return (
    <Layout 
      user={auth.user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      language={language} 
      setLanguage={setLanguage}
    >
      {activeTab === 'docs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-0">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2b3c]">{t('docs')}</h2>
              <p className="text-slate-500 text-sm">
                {auth.user?.role === UserRole.OPERARIO 
                  ? `Sede: ${centers.find(c => c.id === auth.user?.centerId)?.name}` 
                  : 'Administración Global Samsic'}
              </p>
            </div>
            {auth.user?.role === UserRole.ADMIN && (
              <button onClick={() => { setEditingDoc(null); setIsDocModalOpen(true); }} className="bg-[#1a2b3c] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">{t('add_doc')}</button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" placeholder={t('search_placeholder')} className="flex-1 p-3 border border-slate-100 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#1a2b3c] outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              {auth.user?.role === UserRole.ADMIN && (
                <select className="p-3 border border-slate-100 rounded-xl bg-slate-50 font-medium" value={selectedCenterId} onChange={e => setSelectedCenterId(e.target.value)}>
                  <option value="ALL">{t('all_centers')}</option>
                  {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              <button onClick={handleAiSearch} className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">{t('analyze_ai')}</button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
              <button onClick={() => setSelectedType('ALL')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedType === 'ALL' ? 'bg-[#1a2b3c] text-white border-[#1a2b3c]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                Todos
              </button>
              {Object.values(DocType).map(t_val => (
                <button 
                  key={t_val} 
                  onClick={() => setSelectedType(t_val as any)} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center space-x-2 ${selectedType === t_val ? 'bg-[#1a2b3c] text-white border-[#1a2b3c]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                >
                  <DocIcon type={t_val} className="w-3.5 h-3.5" />
                  <span>{t(getDocTypeKey(t_val))}</span>
                </button>
              ))}
            </div>
          </div>

          {aiSuggestion && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-300 flex items-start space-x-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 mb-0.5">IA Analyst</p>
                <p className="text-sm font-medium leading-relaxed">{aiSuggestion}</p>
              </div>
              <button onClick={() => setAiSuggestion(null)} className="text-indigo-300 hover:text-indigo-600"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-0">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`flex items-center space-x-2 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    doc.type === DocType.FDS ? 'bg-rose-50 text-rose-700' : 
                    doc.type === DocType.INSTRUCCION ? 'bg-emerald-50 text-emerald-700' :
                    doc.type === DocType.FT ? 'bg-sky-50 text-sky-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    <DocIcon type={doc.type} className="w-3.5 h-3.5" />
                    <span>{t(getDocTypeKey(doc.type))}</span>
                  </div>
                  {auth.user?.role === UserRole.ADMIN && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingDoc(doc); setIsDocModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-[#1a2b3c] rounded-lg">✎</button>
                      <button onClick={() => setDocs(docs.filter(d => d.id !== doc.id))} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg">✕</button>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-2 flex-1 leading-tight text-lg">{doc.title}</h3>
                <div className="text-[10px] text-slate-400 flex justify-between items-center mt-4 pt-4 border-t border-slate-50 font-bold uppercase tracking-widest">
                  <span className="truncate max-w-[150px]">{centers.find(c => c.id === doc.centerId)?.name || 'Sin Centro'}</span>
                  <span>{doc.lastUpdated}</span>
                </div>
                <a href={doc.driveUrl} target="_blank" className="mt-4 block w-full text-center py-3 bg-[#1a2b3c] text-white rounded-xl font-bold text-sm hover:bg-slate-800 shadow-md transition-colors active:scale-95">{t('view_doc')}</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300 p-4 md:p-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1a2b3c]">{t('personal')}</h2>
            <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-[#1a2b3c] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">{t('new_user')}</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Usuario</th><th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Centro</th><th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rol</th><th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Acciones</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{centers.find(c => c.id === u.centerId)?.name || 'Samsic Global'}</td>
                    <td className="p-4 text-[10px] font-bold uppercase tracking-widest"><span className={`px-2 py-1 rounded-md ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="mr-3 text-blue-600 font-bold text-xs hover:underline">Editar</button>
                      <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="text-red-600 font-bold text-xs hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'centers' && (
        <div className="space-y-6 animate-in fade-in duration-300 p-4 md:p-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1a2b3c]">{t('work_centers')}</h2>
            <button onClick={() => { setEditingCenter(null); setIsCenterModalOpen(true); }} className="bg-[#1a2b3c] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">{t('add_center')}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-xl transition-all group">
                <h3 className="font-bold text-xl text-slate-800 leading-tight mb-2">{c.name}</h3>
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{c.location || 'Ubicación no especificada'}</span>
                </div>
                <div className="flex justify-end mt-8 space-x-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingCenter(c); setIsCenterModalOpen(true); }} className="text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest">Editar</button>
                  <button onClick={() => deleteCenter(c.id)} className="text-red-600 font-bold text-xs hover:underline uppercase tracking-widest">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DocModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        onSave={saveDoc} 
        editingDoc={editingDoc} 
        workCenters={centers} 
        language={language}
      />
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={saveUser} editingUser={editingUser} workCenters={centers} />
      <CenterModal isOpen={isCenterModalOpen} onClose={() => setIsCenterModalOpen(false)} onSave={saveCenter} editingCenter={editingCenter} />
      <ChatBot docs={filteredDocs} language={language} />
    </Layout>
  );
};

export default App;
