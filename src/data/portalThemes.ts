export interface PortalTheme {
  id: string;
  name: string;
  desc: string;
  badge: string;
  // Background styling
  bgGradient: string;
  ambientGlowPrimary: string;
  ambientGlowSecondary: string;
  // Card & border
  cardBg: string;
  cardBorder: string;
  cardGlowRing: string;
  // Top header styling
  topLogoBg: string;
  topBadgeClass: string;
  // Tab styling
  activeTabGradient: string;
  // Admin button & highlight styling
  adminButtonBg: string;
  adminAccentColor: string;
  adminBadgeBg: string;
  // Swatch preview colors
  swatchColors: [string, string, string]; // [primary, secondary, bg]
}

export const PORTAL_THEMES: PortalTheme[] = [
  {
    id: 'emerald',
    name: 'الأخضر الزمردي الجامعي',
    desc: 'الهوية الأكاديمية الكلاسيكية لجامعة الملك فهد',
    badge: 'الافتراضي',
    bgGradient: 'from-slate-950 via-slate-900 to-emerald-950',
    ambientGlowPrimary: 'bg-emerald-500/15',
    ambientGlowSecondary: 'bg-teal-500/10',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-slate-700/80',
    cardGlowRing: 'ring-emerald-500/20',
    topLogoBg: 'from-emerald-500 to-teal-700 shadow-emerald-900/40',
    topBadgeClass: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
    activeTabGradient: 'from-emerald-600 to-teal-700 shadow-emerald-900/30 border-emerald-500/40',
    adminButtonBg: 'from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 shadow-emerald-950/50',
    adminAccentColor: 'text-emerald-400',
    adminBadgeBg: 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200',
    swatchColors: ['#10b981', '#0d9488', '#022c22'],
  },
  {
    id: 'sapphire',
    name: 'الأزرق الملكي والنيلي',
    desc: 'طابع إداري قيادي متزن وثقة مؤسسية',
    badge: 'ملكي',
    bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
    ambientGlowPrimary: 'bg-blue-500/15',
    ambientGlowSecondary: 'bg-indigo-500/15',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-blue-900/50',
    cardGlowRing: 'ring-blue-500/20',
    topLogoBg: 'from-blue-500 to-indigo-700 shadow-blue-900/40',
    topBadgeClass: 'bg-blue-500/15 border-blue-400/30 text-blue-300',
    activeTabGradient: 'from-blue-600 to-indigo-700 shadow-blue-900/30 border-blue-500/40',
    adminButtonBg: 'from-blue-600 via-indigo-600 to-sky-700 hover:from-blue-700 hover:to-sky-800 shadow-blue-950/50',
    adminAccentColor: 'text-blue-400',
    adminBadgeBg: 'bg-blue-950/40 border-blue-500/20 text-blue-200',
    swatchColors: ['#3b82f6', '#6366f1', '#172554'],
  },
  {
    id: 'purple',
    name: 'البنفسجي الإشرافي الفاخر',
    desc: 'هيبة إشرافية مميزة للإدارة المركزية',
    badge: 'إشرافي',
    bgGradient: 'from-slate-950 via-slate-900 to-purple-950',
    ambientGlowPrimary: 'bg-purple-500/15',
    ambientGlowSecondary: 'bg-fuchsia-500/10',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-purple-900/50',
    cardGlowRing: 'ring-purple-500/20',
    topLogoBg: 'from-purple-500 to-indigo-700 shadow-purple-900/40',
    topBadgeClass: 'bg-purple-500/15 border-purple-400/30 text-purple-300',
    activeTabGradient: 'from-purple-600 to-pink-700 shadow-purple-900/30 border-purple-500/40',
    adminButtonBg: 'from-purple-600 via-pink-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-purple-950/50',
    adminAccentColor: 'text-purple-400',
    adminBadgeBg: 'bg-purple-950/40 border-purple-500/20 text-purple-200',
    swatchColors: ['#a855f7', '#ec4899', '#3b0764'],
  },
  {
    id: 'amber',
    name: 'الذهبي والعنبري المتميز',
    desc: 'دفء وفخامة وريادة ملموسة',
    badge: 'بريميوم',
    bgGradient: 'from-slate-950 via-neutral-900 to-amber-950',
    ambientGlowPrimary: 'bg-amber-500/15',
    ambientGlowSecondary: 'bg-orange-500/10',
    cardBg: 'bg-neutral-900/90',
    cardBorder: 'border-amber-900/50',
    cardGlowRing: 'ring-amber-500/20',
    topLogoBg: 'from-amber-500 to-yellow-700 shadow-amber-900/40',
    topBadgeClass: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
    activeTabGradient: 'from-amber-600 to-yellow-700 shadow-amber-900/30 border-amber-500/40',
    adminButtonBg: 'from-amber-600 via-yellow-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-amber-950/50',
    adminAccentColor: 'text-amber-400',
    adminBadgeBg: 'bg-amber-950/40 border-amber-500/20 text-amber-200',
    swatchColors: ['#f59e0b', '#eab308', '#451a03'],
  },
  {
    id: 'teal',
    name: 'الكحلي والبترولي الحديث',
    desc: 'أفق حيوي مبتكر وتقني حديث',
    badge: 'عصري',
    bgGradient: 'from-slate-950 via-slate-900 to-cyan-950',
    ambientGlowPrimary: 'bg-cyan-500/15',
    ambientGlowSecondary: 'bg-teal-500/10',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-cyan-900/50',
    cardGlowRing: 'ring-cyan-500/20',
    topLogoBg: 'from-teal-500 to-cyan-700 shadow-cyan-900/40',
    topBadgeClass: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
    activeTabGradient: 'from-teal-600 to-cyan-700 shadow-teal-900/30 border-teal-500/40',
    adminButtonBg: 'from-teal-600 via-cyan-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 shadow-cyan-950/50',
    adminAccentColor: 'text-cyan-400',
    adminBadgeBg: 'bg-cyan-950/40 border-cyan-500/20 text-cyan-200',
    swatchColors: ['#14b8a6', '#06b6d4', '#083344'],
  },
  {
    id: 'rose',
    name: 'العنابي والياقوتي الراقي',
    desc: 'قوة ونشاط مع أناقة ملفتة',
    badge: 'راقي',
    bgGradient: 'from-slate-950 via-slate-900 to-rose-950',
    ambientGlowPrimary: 'bg-rose-500/15',
    ambientGlowSecondary: 'bg-pink-500/10',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-rose-900/50',
    cardGlowRing: 'ring-rose-500/20',
    topLogoBg: 'from-rose-500 to-red-700 shadow-rose-900/40',
    topBadgeClass: 'bg-rose-500/15 border-rose-400/30 text-rose-300',
    activeTabGradient: 'from-rose-600 to-red-700 shadow-rose-900/30 border-rose-500/40',
    adminButtonBg: 'from-rose-600 via-red-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 shadow-rose-950/50',
    adminAccentColor: 'text-rose-400',
    adminBadgeBg: 'bg-rose-950/40 border-rose-500/20 text-rose-200',
    swatchColors: ['#f43f5e', '#e11d48', '#4c0519'],
  },
  {
    id: 'slate',
    name: 'الرمادي التيتانيوم والفحمي',
    desc: 'بساطة هادئة ومظهر دارك مود فائق الاحترافية',
    badge: 'تيتانيوم',
    bgGradient: 'from-zinc-950 via-slate-950 to-neutral-900',
    ambientGlowPrimary: 'bg-slate-400/10',
    ambientGlowSecondary: 'bg-zinc-500/10',
    cardBg: 'bg-zinc-900/90',
    cardBorder: 'border-zinc-700/80',
    cardGlowRing: 'ring-slate-400/20',
    topLogoBg: 'from-slate-600 to-zinc-800 shadow-slate-900/40',
    topBadgeClass: 'bg-slate-500/15 border-slate-400/30 text-slate-300',
    activeTabGradient: 'from-slate-700 to-zinc-800 shadow-slate-900/30 border-slate-500/40',
    adminButtonBg: 'from-slate-700 via-zinc-700 to-neutral-800 hover:from-slate-800 hover:to-neutral-900 shadow-slate-950/50',
    adminAccentColor: 'text-slate-300',
    adminBadgeBg: 'bg-zinc-800/60 border-zinc-500/20 text-zinc-200',
    swatchColors: ['#94a3b8', '#64748b', '#09090b'],
  },
];

export const DEFAULT_PORTAL_THEME = 'emerald';

export function getPortalTheme(themeId?: string): PortalTheme {
  const found = PORTAL_THEMES.find(t => t.id === themeId);
  return found || PORTAL_THEMES[0];
}
