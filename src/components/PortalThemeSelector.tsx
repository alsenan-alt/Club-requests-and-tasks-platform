import React from 'react';
import { Palette, Check, Sparkles, X, Sun, Moon, RefreshCcw } from 'lucide-react';
import { PORTAL_THEMES, PortalTheme, getPortalTheme } from '../data/portalThemes';

interface Props {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PortalThemeSelector: React.FC<Props> = ({
  currentThemeId,
  onSelectTheme,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentTheme = getPortalTheme(currentThemeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Tajawal',sans-serif]">
                تخصيص ثيم وألوان بوابة الدخول
              </h3>
              <p className="text-xs text-slate-400">
                اختر النمط اللوني المناسب لمنظومة تسجيل دخول النشاط الطلابي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Themes Grid */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>الأنماط اللونية المتاحة ({PORTAL_THEMES.length}):</span>
            <span className="text-[11px] text-emerald-400">تطبيق وحفظ فوري</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PORTAL_THEMES.map((theme: PortalTheme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-400 ring-2 ring-teal-500/40 shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/70'
                  }`}
                >
                  {/* Visual Color Preview Bar */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span 
                        className="w-4 h-4 rounded-full shadow-xs border border-white/20" 
                        style={{ backgroundColor: theme.swatchColors[0] }} 
                        title="اللون الأساسي"
                      />
                      <span 
                        className="w-4 h-4 rounded-full shadow-xs border border-white/20" 
                        style={{ backgroundColor: theme.swatchColors[1] }} 
                        title="اللون الثانوي"
                      />
                      <span 
                        className="w-4 h-4 rounded-full shadow-xs border border-white/20" 
                        style={{ backgroundColor: theme.swatchColors[2] }} 
                        title="لون الخلفية"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-bold">
                        {theme.badge}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Theme Info */}
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-teal-300 transition-colors">
                    {theme.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {theme.desc}
                  </p>

                  {/* Gradient Sample Strip */}
                  <div 
                    className={`h-2 w-full rounded-full mt-3 bg-gradient-to-r ${theme.activeTabGradient}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Current Selection Confirmation */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              الثيم المفعل حالياً: <strong className="text-white">{currentTheme.name}</strong>
            </span>
            <button
              onClick={() => onSelectTheme('emerald')}
              className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
