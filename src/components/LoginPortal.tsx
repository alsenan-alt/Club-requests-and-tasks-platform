import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserPlus, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  KeyRound,
  ShieldAlert,
  HelpCircle,
  Cloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { RoleType, UserAccount } from '../types';
import { CloudSyncIndicator } from './CloudSyncIndicator';

interface Props {
  onOpenReferenceGuide: () => void;
}

export const LoginPortal: React.FC<Props> = ({ onOpenReferenceGuide }) => {
  const { 
    validateAndLogin, 
    userAccounts, 
    registerNewClubPresident, 
    setIsSyncModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'clubs' | 'register_club' | 'staff' | 'admin'>('clubs');
  
  // Club Login State
  const [selectedClubUser, setSelectedClubUser] = useState<string>(() => {
    const club = userAccounts.find(u => u.role === 'club_president');
    return club ? club.id : 'user_club_software';
  });
  const [clubPassword, setClubPassword] = useState('');
  const [showClubPassword, setShowClubPassword] = useState(false);
  const [clubError, setClubError] = useState('');

  // Staff Login State
  const [selectedStaffId, setSelectedStaffId] = useState<string>('staff_hussein');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffError, setStaffError] = useState('');

  // Admin Login State
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  // New Club Registration Form State
  const [regClubName, setRegClubName] = useState('');
  const [regPresName, setRegPresName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCategory, setRegCategory] = useState('تقني وهندسي');
  const [regOffice, setRegOffice] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regError, setRegError] = useState('');

  // Handle Club Login
  const handleClubLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setClubError('');
    if (!clubPassword) {
      setClubError('يرجى إدخال كلمة المرور للمتابعة');
      return;
    }
    const res = validateAndLogin(selectedClubUser, clubPassword);
    if (!res.success) {
      setClubError(res.message || 'كلمة المرور غير صحيحة، يرجى التأكد والمحاولة ثانية');
    }
  };

  // Handle Staff Login
  const handleStaffLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStaffError('');
    if (!staffPassword) {
      setStaffError('يرجى إدخال كلمة المرور للمتابعة');
      return;
    }
    const account = userAccounts.find(u => u.role === selectedStaffId);
    if (!account) {
      setStaffError('حساب الموظف غير متوفر');
      return;
    }
    const res = validateAndLogin(account.id, staffPassword);
    if (!res.success) {
      setStaffError(res.message || 'كلمة مرور الموظف غير صحيحة');
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminError('');
    if (!adminPassword) {
      setAdminError('يرجى إدخال كلمة المرور للمتابعة');
      return;
    }
    const account = userAccounts.find(u => u.role === 'admin');
    if (!account) {
      setAdminError('حساب الإدارة غير متوفر');
      return;
    }
    const res = validateAndLogin(account.id, adminPassword);
    if (!res.success) {
      setAdminError(res.message || 'كلمة مرور إدارة النشاط غير صحيحة');
    }
  };

  // Handle New Club Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regClubName.trim()) {
      setRegError('يرجى كتابة اسم النادي الطلابي');
      return;
    }
    if (!regPresName.trim()) {
      setRegError('يرجى كتابة اسم رئيس النادي');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('يرجى إدخال رقم الجوال للتواصل');
      return;
    }
    if (!regPassword || regPassword.trim().length < 3) {
      setRegError('يجب ألا تقل كلمة المرور عن 3 خانات');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('كلمتا المرور غير متطابقتين');
      return;
    }

    setRegError('');
    const newAccount = registerNewClubPresident({
      clubName: regClubName,
      presidentName: regPresName,
      username: regUsername || `club_${Date.now().toString().slice(-4)}`,
      password: regPassword.trim(),
      email: regEmail.trim() || `${regPresName.toLowerCase().replace(/\s+/g, '.')}@student.kfupm.edu.sa`,
      phone: regPhone.trim(),
      category: regCategory,
      office: regOffice.trim() || 'مقر الأندية - مبنى 10',
      bio: regBio.trim() || `نادي ${regClubName} الطلابي المعتمد بجامعة الملك فهد للبترول والمعادن.`,
    });

    if (newAccount) {
      validateAndLogin(newAccount.id, regPassword.trim());
    }
  };

  const clubAccounts = userAccounts.filter(u => u.role === 'club_president');
  const selectedClubObj = clubAccounts.find(u => u.id === selectedClubUser);
  const selectedStaffObj = STAFF_MEMBERS.find(s => s.roleCode === selectedStaffId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-['Cairo',sans-serif] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white font-['Tajawal',sans-serif] block">
              جامعة الملك فهد للبترول والمعادن
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              عمادة شؤون الطلاب • إدارة النشاط الطلابي
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <CloudSyncIndicator onClick={() => setIsSyncModalOpen(true)} />

          <button
            onClick={onOpenReferenceGuide}
            className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>دليل المهام والمسؤوليات</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-3xl w-full mx-auto my-8 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Intro */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>بوابة تسجيل الدخول الآمنة بالتحقق من كلمة المرور</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal',sans-serif] tracking-tight">
            منظومة طلبات وتوجيه مهام الأندية الطلابية
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
            تسجيل الدخول محمي بكلمة مرور لكل حساب؛ يمنح كل نادٍ خصوصية تامة لعزل بياناته، ويقصر صلاحية كل موظف على مهامه الموكلة.
          </p>
        </div>

        {/* Portal Container */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 p-2 gap-2 bg-slate-950/40">
            
            {/* Tab 1: Clubs Login */}
            <button
              onClick={() => { setActiveTab('clubs'); setClubError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'clubs'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/30 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>دخول الأندية ({clubAccounts.length})</span>
            </button>

            {/* Tab 2: Register New Club */}
            <button
              onClick={() => { setActiveTab('register_club'); setRegError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register_club'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-900/30 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل نادٍ جديد ✨</span>
            </button>

            {/* Tab 3: Staff Members */}
            <button
              onClick={() => { setActiveTab('staff'); setStaffError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/30 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>الموظفون المعنيون</span>
            </button>

            {/* Tab 4: Admin Supervision */}
            <button
              onClick={() => { setActiveTab('admin'); setAdminError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg shadow-purple-900/30 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>إدارة النشاط</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            
            {/* TAB 1: Student Clubs Login */}
            {activeTab === 'clubs' && (
              <form onSubmit={handleClubLogin} className="space-y-5">
                
                {clubError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{clubError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-200 block">
                      اختر النادي الطلابي المصرح له:
                    </label>
                    <span className="text-[11px] text-emerald-400">نطاق بيانات معزول</span>
                  </div>

                  <select
                    value={selectedClubUser}
                    onChange={e => {
                      setSelectedClubUser(e.target.value);
                      setClubError('');
                      setClubPassword('');
                    }}
                    className="w-full text-xs sm:text-sm font-bold p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    {clubAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        🎓 {acc.clubName} — ({acc.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password Input for Club */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <span>كلمة مرور رئيس النادي:</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showClubPassword ? 'text' : 'password'}
                      value={clubPassword}
                      onChange={e => setClubPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور..."
                      className="w-full text-xs sm:text-sm p-3.5 pl-11 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowClubPassword(!showClubPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showClubPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {selectedClubObj && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      رئيس النادي الحالي: <strong className="text-slate-300">{selectedClubObj.name}</strong>
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>تأكيد الخصوصية والأمان:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    عند تسجيل الدخول، ستتمكن حصرياً من متابعة طلبات وفعاليات ناديك فقط دون الاطلاع على بيانات الأندية الأخرى.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>تأكيد كلمة المرور والدخول</span>
                </button>

                {/* Quick 1-click presets */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] text-slate-400 font-semibold block">
                      اختيار سريع لأحد الأندية:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register_club')}
                      className="text-[11px] text-teal-400 hover:underline font-bold"
                    >
                      + تسجيل نادٍ جديد
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {clubAccounts.slice(0, 3).map(acc => (
                      <button
                        type="button"
                        key={acc.id}
                        onClick={() => {
                          setSelectedClubUser(acc.id);
                          setClubPassword('');
                          setClubError('');
                        }}
                        className={`p-2.5 bg-slate-800/80 hover:bg-slate-800 border rounded-xl text-right transition-all cursor-pointer group ${
                          selectedClubUser === acc.id ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-700/80 hover:border-emerald-500/50'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-white group-hover:text-emerald-300 block truncate">
                          {acc.clubName?.replace('نادي ', '')}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">{acc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: Register New Club President */}
            {activeTab === 'register_club' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-teal-950/50 border border-teal-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-teal-200">
                  <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-bold block">تسجيل حساب نادٍ طلابي ورئيس نادٍ جديد مع كلمة مرور:</span>
                    <span className="text-[11px] text-slate-300">يتم إنشاء الحساب واعتماده مباشرة لتقديم الطلبات وعزل البيانات.</span>
                  </div>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-200 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">اسم النادي الطلابي:</label>
                    <input
                      type="text"
                      value={regClubName}
                      onChange={e => setRegClubName(e.target.value)}
                      placeholder="مثال: نادي الذكاء الاصطناعي أو نادي الطاقة"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">تصنيف النادي:</label>
                    <select
                      value={regCategory}
                      onChange={e => setRegCategory(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold cursor-pointer"
                    >
                      <option value="تقني وهندسي">تقني وهندسي</option>
                      <option value="علمي وبحثي">علمي وبحثي</option>
                      <option value="ثقافي وفكري">ثقافي وفكري</option>
                      <option value="اجتماعي وتطوعي">اجتماعي وتطوعي</option>
                      <option value="فنون وإبداع">فنون وإبداع</option>
                      <option value="رياضي وكشفي">رياضي وكشفي</option>
                      <option value="عام">عام</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">اسم رئيس النادي الكامل:</label>
                    <input
                      type="text"
                      value={regPresName}
                      onChange={e => setRegPresName(e.target.value)}
                      placeholder="مثال: م. أحمد بن خالد العتيبي"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">رقم الجوال للتواصل:</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="055xxxxxxx"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                      required
                    />
                  </div>

                  {/* Password Fields for New Club */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">كلمة المرور للحساب:</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="كلمة المرور (3 خانات على الأقل)"
                        className="w-full text-xs sm:text-sm p-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-teal-500 font-semibold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">تأكيد كلمة المرور:</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="أعد كتابة كلمة المرور"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-teal-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">البريد الإلكتروني الجامعي:</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="president@student.kfupm.edu.sa"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">مقر النادي (اختياري):</label>
                    <input
                      type="text"
                      value={regOffice}
                      onChange={e => setRegOffice(e.target.value)}
                      placeholder="مبنى 10 - مقر الأندية"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">نبذة عن النادي وأهدافه (اختياري):</label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={e => setRegBio(e.target.value)}
                    placeholder="اكتب نبذة موجزة عن النادي..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد التسجيل والدخول الفوري للنظام</span>
                </button>
              </form>
            )}

            {/* TAB 3: Staff Members Login */}
            {activeTab === 'staff' && (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="text-xs text-slate-300 mb-2 flex items-center justify-between">
                  <span>اختر حساب الموظف وأدخل كلمة المرور للوصول لصندوق مهامه:</span>
                  <span className="text-[11px] text-blue-400">حماية مهام الموظف</span>
                </div>

                {staffError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{staffError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {STAFF_MEMBERS.map(staff => (
                    <div 
                      key={staff.id}
                      onClick={() => {
                        setSelectedStaffId(staff.roleCode);
                        setStaffError('');
                        setStaffPassword('');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        selectedStaffId === staff.roleCode
                          ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${staff.avatarBg} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                          👔
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                            {selectedStaffId === staff.roleCode && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">
                                تم الاختيار
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-blue-300 mt-0.5">
                            {staff.roleCode === 'staff_hussein' && 'الحركة (الباصات) • الإسكان والمكتبية • الكهرباء والإنارة • IT والشبكات • حجز المباني'}
                            {staff.roleCode === 'staff_mousa' && 'حجز القاعات والملاعب • إعلان الفعاليات (الإيميل و The Fives) • المطابع • العلاقات العامة'}
                            {staff.roleCode === 'staff_musleh' && 'الأمن والسلامة وتصاريح الدخول • الخدمات الغذائية والضيافة الخاصة'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Password input for Staff */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                      <span>كلمة مرور الموظف ({selectedStaffObj?.name || 'الموظف'}):</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      value={staffPassword}
                      onChange={e => setStaffPassword(e.target.value)}
                      placeholder="أدخل كلمة مرور الموظف..."
                      className="w-full text-xs sm:text-sm p-3.5 pl-11 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-xl shadow-blue-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>تأكيد كلمة المرور ودخول الموظف</span>
                </button>
              </form>
            )}

            {/* TAB 4: Admin Supervision */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-5 text-center">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mx-auto text-2xl">
                  👑
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Tajawal',sans-serif]">
                    بوابة الإشراف العام • إدارة النشاط الطلابي
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                    مخصصة للإدارة المركزية لمتابعة تدفق طلبات جميع الأندية، مراقبة نسب إنجاز الموظفين، وإدارة الحسابات والأندية المسجلة.
                  </p>
                </div>

                {adminError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                {/* Password Input for Admin */}
                <div className="text-right max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                      <span>كلمة مرور إدارة النشاط:</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور..."
                      className="w-full text-xs sm:text-sm p-3.5 pl-11 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-950/40 border border-purple-500/20 rounded-2xl text-xs text-purple-200 max-w-md mx-auto">
                  صلاحيات كاملة للاطلاع الإشرافي على كافة الأندية والموظفين وتعديل البيانات.
                </div>

                <button
                  type="submit"
                  className="w-full max-w-md mx-auto py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-sm shadow-xl shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد كلمة المرور والدخول للإشراف العام</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 py-3 z-10">
        © 2026 عمادة شؤون الطلاب • نظام إدارة طلبات الأندية والمهام اللوجستية المحمي
      </div>

    </div>
  );
};
