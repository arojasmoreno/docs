
import React from 'react';
import { User, UserRole, Language } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: 'docs' | 'users' | 'centers';
  setActiveTab: (tab: 'docs' | 'users' | 'centers') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab, language, setLanguage }) => {
  if (!user) return <>{children}</>;

  const t = (key: string) => translations[language][key] || key;

  const languages = [
    { code: 'es', label: 'ESP', flag: '🇪🇸' },
    { code: 'fr', label: 'FRA', flag: '🇫🇷' },
    { code: 'ar', label: 'MAR', flag: '🇲🇦' },
    { code: 'wo', label: 'WOL', flag: '🇸🇳' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-72 bg-[#1a2b3c] text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center space-x-3 mb-1">
            <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                <span className="text-white font-black text-2xl tracking-tighter">S</span>
            </div>
            <div>
                <h1 className="text-xl font-black tracking-[0.2em] uppercase leading-none">SAMSIC</h1>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Doc Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1.5">
          <button
            onClick={() => setActiveTab('docs')}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
              activeTab === 'docs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="font-semibold">{t('docs')}</span>
          </button>

          {user.role === UserRole.ADMIN && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                  activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="font-semibold">{t('users')}</span>
              </button>
              <button
                onClick={() => setActiveTab('centers')}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                  activeTab === 'centers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="font-semibold">{t('centers')}</span>
              </button>
            </>
          )}

          <div className="pt-6 mt-6 border-t border-slate-700/50">
            <label className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">{t('language')}</label>
            <div className="grid grid-cols-2 gap-2 px-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`flex items-center justify-center space-x-2 py-2.5 text-[10px] font-bold rounded-lg transition-all border ${
                    language === lang.code 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                      : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-700/50 bg-black/10">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
    </div>
  );
};

export default Layout;
