import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'button' | 'minimal' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'pill',
  className = '' 
}) => {
  const { language, setLanguage, t } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'ar' 
            ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700' 
            : 'bg-slate-800 text-blue-400 hover:bg-slate-700'
        } ${className}`}
        title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'English' : 'عربي'}</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 shadow-xs backdrop-blur-xs ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
          language === 'ar'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>🇸🇦 العربية</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>🇺🇸 English</span>
      </button>
    </div>
  );
};
