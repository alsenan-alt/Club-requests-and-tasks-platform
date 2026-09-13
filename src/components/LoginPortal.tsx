import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserPlus, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  KeyRound, 
  ShieldAlert, 
  HelpCircle,
  GraduationCap,
  UserCheck,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAFF_MEMBERS } from '../data/initialData';
import { getPortalTheme } from '../data/portalThemes';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Props {
  onOpenReferenceGuide: () => void;
}

export const LoginPortal: React.FC<Props> = ({ onOpenReferenceGuide }) => {
  const { 
    validateAndLogin, 
    userAccounts, 
    registerNewClubPresident,
    registerNewSupervisor,
    staffMembers,
    portalTheme,
    language,
    t,
    isRtl
  } = useApp();

  const currentTheme = getPortalTheme(portalTheme);

  const [activeTab, setActiveTab] = useState<'clubs' | 'supervisors' | 'register_club' | 'staff' | 'admin'>('clubs');
  
  // Club Login State
  const [selectedClubUser, setSelectedClubUser] = useState<string>(() => {
    const club = userAccounts.find(u => u.role === 'club_president');
    return club ? club.id : 'user_club_software';
  });
  const [clubPassword, setClubPassword] = useState('');
  const [showClubPassword, setShowClubPassword] = useState(false);
  const [clubError, setClubError] = useState('');

  // Supervisor Tab Sub-mode: 'login' or 'register'
  const [supervisorMode, setSupervisorMode] = useState<'login' | 'register'>('login');

  // Supervisor Login State
  const supervisorAccounts = userAccounts.filter(u => u.role === 'club_supervisor');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>(() => {
    const sup = supervisorAccounts[0];
    return sup ? sup.id : 'user_sup_eng';
  });
  const [supervisorPassword, setSupervisorPassword] = useState('');
  const [showSupervisorPassword, setShowSupervisorPassword] = useState(false);
  const [supervisorError, setSupervisorError] = useState('');

  // New Supervisor Registration State
  const [regSupName, setRegSupName] = useState('');
  const [regSupEmail, setRegSupEmail] = useState('');
  const [regSupPhone, setRegSupPhone] = useState('');
  const [regSupOffice, setRegSupOffice] = useState('');
  const [regSupPassword, setRegSupPassword] = useState('');
  const [regSupConfirmPassword, setRegSupConfirmPassword] = useState('');
  const [showRegSupPassword, setShowRegSupPassword] = useState(false);
  const [regSupBio, setRegSupBio] = useState('');
  const [regSupError, setRegSupError] = useState('');

  // Inline Supervisor Registration Modal inside Register Club tab
  const [showInlineSupervisorModal, setShowInlineSupervisorModal] = useState(false);
  const [inlineSupName, setInlineSupName] = useState('');
  const [inlineSupEmail, setInlineSupEmail] = useState('');
  const [inlineSupPhone, setInlineSupPhone] = useState('');
  const [inlineSupOffice, setInlineSupOffice] = useState('');
  const [inlineSupPassword, setInlineSupPassword] = useState('');
  const [inlineSupError, setInlineSupError] = useState('');
  const [inlineSupSuccess, setInlineSupSuccess] = useState('');

  // Handle Quick Inline Supervisor Registration Submit
  const handleQuickInlineSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineSupError('');
    setInlineSupSuccess('');

    if (!inlineSupName.trim()) {
      setInlineSupError(isRtl ? 'يرجى إدخال اسم المشرف الأكاديمي' : 'Please enter supervisor name');
      return;
    }

    try {
      const newSup = registerNewSupervisor({
        name: inlineSupName.trim(),
        title: isRtl ? 'مشرف أكاديمي معتمد' : 'Certified Academic Supervisor',
        department: isRtl ? 'إشراف الأندية الطلابية' : 'Student Clubs Supervision',
        email: inlineSupEmail.trim() || `${inlineSupName.toLowerCase().replace(/\s+/g, '.')}@kfupm.edu.sa`,
        phone: inlineSupPhone.trim() || '',
        office: inlineSupOffice.trim() || 'مبنى العمادة / الكلية',
        password: inlineSupPassword.trim() || '123',
        bio: isRtl ? `مشرف أكاديمي معتمد للأندية الطلابية.` : 'Certified Student Clubs Academic Supervisor.',
        autoLogin: false,
      });

      setRegSupervisorId(newSup.id);
      setInlineSupSuccess(isRtl ? `تم تسجيل المشرف (${newSup.name}) بنجاح وتم اختياره لناديك!` : `Supervisor ${newSup.name} registered and selected!`);
      setTimeout(() => {
        setShowInlineSupervisorModal(false);
        setInlineSupName('');
        setInlineSupEmail('');
        setInlineSupPhone('');
        setInlineSupOffice('');
        setInlineSupPassword('');
        setInlineSupSuccess('');
      }, 1000);
    } catch (err: any) {
      setInlineSupError(err?.message || 'حدث خطأ أثناء حفظ المشرف');
    }
  };

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
  const [customRegCategory, setCustomRegCategory] = useState('');
  const [regSupervisorId, setRegSupervisorId] = useState<string>(() => {
    const sup = userAccounts.find(u => u.role === 'club_supervisor');
    return sup ? sup.id : '';
  });
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

  // Handle Supervisor Login
  const handleSupervisorLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSupervisorError('');
    if (!selectedSupervisorId) {
      setSupervisorError('يرجى اختيار المشرف الأكاديمي');
      return;
    }
    if (!supervisorPassword) {
      setSupervisorError('يرجى إدخال كلمة المرور للمتابعة');
      return;
    }
    const res = validateAndLogin(selectedSupervisorId, supervisorPassword);
    if (!res.success) {
      setSupervisorError(res.message || 'كلمة المرور غير صحيحة، يرجى التأكد والمحاولة ثانية');
    }
  };

  // Handle New Supervisor Registration Submit
  const handleRegisterSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSupError('');

    if (!regSupName.trim()) {
      setRegSupError('يرجى كتابة الاسم الثلاثي للمشرف الأكاديمي');
      return;
    }

    if (!regSupEmail.trim()) {
      setRegSupError('يرجى إدخال البريد الإلكتروني الجامعي');
      return;
    }

    const pass = regSupPassword.trim() || '123';
    if (regSupPassword && regSupConfirmPassword && regSupPassword !== regSupConfirmPassword) {
      setRegSupError('كلمتا المرور غير متطابقتين، يرجى التحقق');
      return;
    }

    try {
      registerNewSupervisor({
        name: regSupName.trim(),
        title: 'مشرف أكاديمي معتمد',
        department: 'إشراف الأندية الطلابية',
        email: regSupEmail.trim(),
        phone: regSupPhone.trim(),
        office: regSupOffice.trim() || 'مبنى العمادة / الكلية',
        password: pass,
        bio: regSupBio.trim() || `مشرف أكاديمي معتمد لدى عمادة شؤون الطلاب.`,
      });
    } catch (err: any) {
      setRegSupError(err?.message || 'حدث خطأ أثناء تسجيل حساب المشرف');
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
    const account = userAccounts.find(u => 
      u.role === selectedStaffId || 
      u.staffId === selectedStaffId || 
      u.id === selectedStaffId ||
      u.id === `user_staff_${selectedStaffId}`
    );
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
    const finalCategory = regCategory === 'custom' 
      ? (customRegCategory.trim() || 'عام ومخصص') 
      : regCategory;

    const selectedSup = supervisorAccounts.find(s => s.id === regSupervisorId);

    const newAccount = registerNewClubPresident({
      clubName: regClubName,
      presidentName: regPresName,
      username: regUsername || `club_${Date.now().toString().slice(-4)}`,
      password: regPassword.trim(),
      email: regEmail.trim() || `${regPresName.toLowerCase().replace(/\s+/g, '.')}@student.kfupm.edu.sa`,
      phone: regPhone.trim(),
      category: finalCategory,
      supervisorId: regSupervisorId || undefined,
      supervisorName: selectedSup?.name || undefined,
      office: regOffice.trim() || 'مقر الأندية - مبنى 10',
      bio: regBio.trim() || `نادي ${regClubName} الطلابي المعتمد بجامعة الملك فهد للبترول والمعادن.`,
    });

    if (newAccount) {
      validateAndLogin(newAccount.id, regPassword.trim());
    }
  };

  const clubAccounts = userAccounts.filter(u => u.role === 'club_president');
  const selectedClubObj = clubAccounts.find(u => u.id === selectedClubUser);
  const selectedSupervisorObj = supervisorAccounts.find(u => u.id === selectedSupervisorId);
  const selectedStaffObj = staffMembers.find(s => s.roleCode === selectedStaffId) || STAFF_MEMBERS.find(s => s.roleCode === selectedStaffId);

  // Auto-sync selectedClubUser if invalid or empty
  useEffect(() => {
    if (clubAccounts.length > 0 && (!selectedClubUser || !clubAccounts.some(c => c.id === selectedClubUser))) {
      setSelectedClubUser(clubAccounts[0].id);
    }
  }, [clubAccounts, selectedClubUser]);

  // Auto-sync selectedSupervisorId if invalid or empty
  useEffect(() => {
    if (supervisorAccounts.length > 0 && (!selectedSupervisorId || !supervisorAccounts.some(s => s.id === selectedSupervisorId))) {
      setSelectedSupervisorId(supervisorAccounts[0].id);
    }
  }, [supervisorAccounts, selectedSupervisorId]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient} text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-['Cairo',sans-serif] relative overflow-hidden transition-colors duration-500`}>
      
      {/* Background ambient lighting */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${currentTheme.ambientGlowPrimary} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${currentTheme.ambientGlowSecondary} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTheme.topLogoBg} flex items-center justify-center text-white shadow-lg`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white font-['Tajawal',sans-serif] block">
              {t('university.name', 'جامعة الملك فهد للبترول والمعادن')}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {t('deanship.name', 'عمادة شؤون الطلاب • إدارة النشاط الطلابي')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher variant="pill" />

          <button
            onClick={onOpenReferenceGuide}
            className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('top_banner.reference_guide', 'دليل المهام والمسؤوليات')}</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl w-full mx-auto my-8 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Intro */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${currentTheme.topBadgeClass} text-xs font-semibold mb-3`}>
            <Lock className="w-3.5 h-3.5" />
            <span>{t('login.portal_badge', 'بوابة تسجيل الدخول الآمنة بالتحقق من كلمة المرور')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal',sans-serif] tracking-tight">
            {t('login.portal_title', 'منظومة طلبات وتوجيه مهام الأندية الطلابية')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            {t('login.portal_subtitle', 'تسجيل الدخول محمي بكلمة مرور لكل حساب؛ يمنح كل نادٍ ومشرف خصوصية تامة لعزل بياناته، ويقصر صلاحية كل موظف على مهامه الموكلة.')}
          </p>
        </div>

        {/* Portal Container */}
        <div className={`${currentTheme.cardBg} backdrop-blur-md rounded-3xl border ${currentTheme.cardBorder} ring-1 ${currentTheme.cardGlowRing} shadow-2xl overflow-hidden transition-all duration-300`}>
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-800 p-2 gap-2 bg-slate-950/40">
            
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
              <span>{t('tab.clubs', 'دخول الأندية')} ({clubAccounts.length})</span>
            </button>

            {/* Tab 2: Supervisors Login */}
            <button
              onClick={() => { setActiveTab('supervisors'); setSupervisorError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'supervisors'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-900/30 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{t('tab.supervisors', 'مشرفو الأندية')} ({supervisorAccounts.length})</span>
            </button>

            {/* Tab 3: Register New Club */}
            <button
              onClick={() => { setActiveTab('register_club'); setRegError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register_club'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-900/30 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('tab.register_club', 'تسجيل نادٍ جديد ✨')}</span>
            </button>

            {/* Tab 4: Staff Members */}
            <button
              onClick={() => { setActiveTab('staff'); setStaffError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/30 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('tab.staff', 'الموظفون المعنيون')}</span>
            </button>

            {/* Tab 5: Admin Supervision */}
            <button
              onClick={() => { setActiveTab('admin'); setAdminError(''); }}
              className={`py-3 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg shadow-purple-900/30 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('tab.admin', 'إدارة النشاط')}</span>
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
                      {t('login.select_club', 'اختر النادي الطلابي المصرح له:')}
                    </label>
                    <span className="text-[11px] text-emerald-400">
                      {t('login.isolated_scope', 'نطاق بيانات معزول')}
                    </span>
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
                        🎓 {acc.clubName} — ({acc.name}) {acc.supervisorName ? `[${t('field.supervisor', 'المشرف')}: ${acc.supervisorName}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password Input for Club */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('login.president_password', 'كلمة مرور رئيس النادي:')}</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showClubPassword ? 'text' : 'password'}
                      value={clubPassword}
                      onChange={e => setClubPassword(e.target.value)}
                      placeholder={t('login.enter_password', 'أدخل كلمة المرور...')}
                      className={`w-full text-xs sm:text-sm p-3.5 ${isRtl ? 'pl-11' : 'pr-11'} rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowClubPassword(!showClubPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer`}
                    >
                      {showClubPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {selectedClubObj && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                      <span className="text-[11px] text-slate-400">
                        {t('login.current_president', 'رئيس النادي الحالي:')} <strong className="text-slate-200">{selectedClubObj.name}</strong>
                      </span>
                      {selectedClubObj.supervisorName && (
                        <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                          👨‍🏫 {t('field.supervisor', 'المشرف')}: {selectedClubObj.supervisorName}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{t('login.privacy_note_title', 'تأكيد الخصوصية وسلسلة الاعتماد:')}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {t('login.privacy_note_desc', 'عند تقديم أي طلب، يُحال تلقائياً لمشرف ناديك للاعتماد الأكاديمي، وبمجرد موافقته يتلقى الموظفون التنفيذيون مهامهم فوراً.')}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t('action.login_to_portal', 'دخول منصة')} ({selectedClubObj?.clubName || t('club', 'النادي')})</span>
                </button>

                {/* Quick 1-click presets */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] text-slate-400 font-semibold block">
                      {t('login.quick_select', 'اختيار سريع لأحد الأندية:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register_club')}
                      className="text-[11px] text-teal-400 hover:underline font-bold cursor-pointer"
                    >
                      + {t('action.register_new_club', 'تسجيل نادٍ جديد')}
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
                        className={`p-2.5 bg-slate-800/80 hover:bg-slate-800 border rounded-xl ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group ${
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

            {/* TAB 2: Club Supervisors Login & Registration */}
            {activeTab === 'supervisors' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Supervisor Sub-Mode Toggle */}
                <div className="flex items-center p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSupervisorMode('login');
                      setSupervisorError('');
                      setRegSupError('');
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      supervisorMode === 'login'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t('login.supervisor_login_tab', 'دخول المشرفين المعتمدين')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSupervisorMode('register');
                      setSupervisorError('');
                      setRegSupError('');
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      supervisorMode === 'register'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                        : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                    <span>{t('login.register_supervisor_tab', 'تسجيل مشرف جديد ✨')}</span>
                  </button>
                </div>

                {/* Sub-mode 1: Login */}
                {supervisorMode === 'login' ? (
                  <form onSubmit={handleSupervisorLogin} className="space-y-5 animate-in fade-in">
                    <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-amber-200">
                      <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold block">{t('login.supervisor_portal_title', 'بوابة اعتماد مشرفي الأندية الطلابية:')}</span>
                        <span className="text-[11px] text-slate-300">{t('login.supervisor_portal_desc', 'يقوم المشرف بمراجعة طلبات وفعاليات الأندية المسندة إليه واعتمادها لتصل للموظفين التنفيذيين.')}</span>
                      </div>
                    </div>

                    {supervisorError && (
                      <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{supervisorError}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-200 block">
                          {t('login.select_supervisor', 'اختر المشرف الأكاديمي/الطلابي:')}
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {t('login.registered_supervisors', 'المشرفون المسجلون:')} <strong className="text-amber-400">{supervisorAccounts.length}</strong>
                        </span>
                      </div>

                      <div className={`grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto ${isRtl ? 'pr-1' : 'pl-1'}`}>
                        {supervisorAccounts.map(sup => {
                          const isSelected = selectedSupervisorId === sup.id;
                          const supervised = sup.supervisedClubNames || [];
                          return (
                            <div
                              key={sup.id}
                              onClick={() => {
                                setSelectedSupervisorId(sup.id);
                                setSupervisorError('');
                                setSupervisorPassword('');
                              }}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                                isSelected
                                  ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30'
                                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center font-bold text-base shrink-0">
                                  👨‍🏫
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-white">{sup.name}</h4>
                                    {sup.isCustom && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                        {t('badge.new', 'جديد')}
                                      </span>
                                    )}
                                    {isSelected && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                                        {t('badge.selected', 'المشرف المختار')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-amber-300/90 mt-0.5">
                                    {sup.title || t('role.club_supervisor', 'مشرف نادي طلابي')} • {sup.department || t('club_supervision', 'إشراف الأندية الطلابية')}
                                  </p>
                                  {supervised.length > 0 && (
                                    <p className="text-[10px] text-slate-400 mt-1">
                                      {t('supervised_clubs', 'الأندية المعتمدة:')} {supervised.join(' • ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Password Input for Supervisor */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t('login.supervisor_password', 'كلمة مرور المشرف')} ({selectedSupervisorObj?.name || t('supervisor', 'المشرف')}):</span>
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type={showSupervisorPassword ? 'text' : 'password'}
                          value={supervisorPassword}
                          onChange={e => setSupervisorPassword(e.target.value)}
                          placeholder={t('login.enter_password', 'أدخل كلمة مرور المشرف...')}
                          className={`w-full text-xs sm:text-sm p-3.5 ${isRtl ? 'pl-11' : 'pr-11'} rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSupervisorPassword(!showSupervisorPassword)}
                          className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer`}
                        >
                          {showSupervisorPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('login.enter_supervisor_panel', 'دخول لوحة اعتماد المشرف')} ({selectedSupervisorObj?.name})</span>
                    </button>

                    {/* Prompt to register supervisor */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSupervisorMode('register');
                          setRegSupError('');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('login.prompt_register_supervisor', 'لست مسجلاً بعد؟ اضغط هنا لإنشاء وتسجيل حساب مشرف جديد')}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Sub-mode 2: Supervisor Registration Form */
                  <form onSubmit={handleRegisterSupervisorSubmit} className="space-y-4 animate-in fade-in">
                    <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-amber-200">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold block">{t('login.register_supervisor_heading', 'تسجيل حساب مشرف أكاديمي / طلابي جديد:')}</span>
                        <span className="text-[11px] text-slate-300">{t('login.register_supervisor_subheading', 'يتم تفعيل الحساب مباشرة، ويظهر اسمك في قائمة المشرفين ليتمكن رؤساء الأندية من اختيارك للإشراف على أنديتهم.')}</span>
                      </div>
                    </div>

                    {regSupError && (
                      <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-200 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{regSupError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('login.sup_full_name', 'اسم المشرف الثلاثي:')}
                        </label>
                        <input
                          type="text"
                          value={regSupName}
                          onChange={e => setRegSupName(e.target.value)}
                          placeholder={isRtl ? "مثال: د. محمد بن عبد الله الشمري" : "e.g., Dr. Mohammed Al-Shammari"}
                          className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('login.univ_email', 'البريد الإلكتروني الجامعي:')}
                        </label>
                        <input
                          type="email"
                          value={regSupEmail}
                          onChange={e => setRegSupEmail(e.target.value)}
                          placeholder="example@kfupm.edu.sa"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('field.phone', 'رقم الجوال للتواصل:')}
                        </label>
                        <input
                          type="tel"
                          value={regSupPhone}
                          onChange={e => setRegSupPhone(e.target.value)}
                          placeholder="05XXXXXXXX"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('login.sup_office', 'مكتب المشرف / مبنى الكلية:')}
                        </label>
                        <input
                          type="text"
                          value={regSupOffice}
                          onChange={e => setRegSupOffice(e.target.value)}
                          placeholder={isRtl ? "مثال: مبنى 22 - مكتب 315" : "e.g. Bldg 22 - Office 315"}
                          className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('login.set_sup_password', 'تعيين كلمة مرور للمشرف:')}
                        </label>
                        <div className="relative">
                          <input
                            type={showRegSupPassword ? 'text' : 'password'}
                            value={regSupPassword}
                            onChange={e => setRegSupPassword(e.target.value)}
                            placeholder={t('login.enter_password', 'أدخل كلمة المرور للحساب...')}
                            className={`w-full text-xs sm:text-sm p-3 ${isRtl ? 'pl-10' : 'pr-10'} rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-amber-500`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegSupPassword(!showRegSupPassword)}
                            className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200`}
                          >
                            {showRegSupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {t('login.confirm_password', 'تأكيد كلمة المرور:')}
                        </label>
                        <input
                          type={showRegSupPassword ? 'text' : 'password'}
                          value={regSupConfirmPassword}
                          onChange={e => setRegSupConfirmPassword(e.target.value)}
                          placeholder={t('login.reenter_password', 'أعد كتابة كلمة المرور...')}
                          className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {t('login.sup_bio', 'نبذة أو اهتمامات إشرافية (اختياري):')}
                      </label>
                      <textarea
                        value={regSupBio}
                        onChange={e => setRegSupBio(e.target.value)}
                        placeholder={isRtl ? "مجالات الاهتمام الأكاديمي، الأنشطة الطلابية التي ترغب بالإشراف عليها..." : "Academic interests, student club categories you'd like to supervise..."}
                        rows={2}
                        className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                        <span>{t('action.register_supervisor_btn', 'تسجيل وتفعيل حساب المشرف فوراً')}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setSupervisorMode('login');
                          setRegSupError('');
                        }}
                        className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        {t('action.cancel', 'إلغاء والعودة للدخول')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: Register New Club President */}
            {activeTab === 'register_club' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                <div className="p-3.5 bg-teal-950/50 border border-teal-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-teal-200">
                  <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-bold block">{t('login.reg_club_title', 'تسجيل حساب نادٍ طلابي ورئيس نادٍ جديد مع كلمة مرور:')}</span>
                    <span className="text-[11px] text-slate-300">{t('login.reg_club_desc', 'يتم إنشاء الحساب واعتماده مباشرة لتقديم الطلبات وعزل البيانات، مع إسناده لمشرف معتمد.')}</span>
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
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('field.club_name', 'اسم النادي الطلابي:')}
                    </label>
                    <input
                      type="text"
                      value={regClubName}
                      onChange={e => setRegClubName(e.target.value)}
                      placeholder={isRtl ? "مثال: نادي الذكاء الاصطناعي أو نادي الطاقة" : "e.g. AI Club or Energy Club"}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300 block">
                        {t('field.club_category', 'تصنيف النادي:')}
                      </label>
                      {regCategory === 'custom' && (
                        <span className="text-[10px] text-teal-400 font-bold">
                          {t('custom_category', 'كتابة تصنيف يدوي مخصص')}
                        </span>
                      )}
                    </div>
                    <select
                      value={regCategory}
                      onChange={e => setRegCategory(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold cursor-pointer"
                    >
                      <option value="تقني وهندسي">{isRtl ? 'تقني وهندسي' : 'Technical & Engineering'}</option>
                      <option value="علمي وبحثي">{isRtl ? 'علمي وبحثي' : 'Scientific & Research'}</option>
                      <option value="ثقافي وفكري">{isRtl ? 'ثقافي وفكري' : 'Cultural & Intellectual'}</option>
                      <option value="اجتماعي وتطوعي">{isRtl ? 'اجتماعي وتطوعي' : 'Social & Volunteering'}</option>
                      <option value="فنون وإبداع">{isRtl ? 'فنون وإبداع' : 'Arts & Creativity'}</option>
                      <option value="رياضي وكشفي">{isRtl ? 'رياضي وكشفي' : 'Sports & Scouts'}</option>
                      <option value="قيادي وتطويري">{isRtl ? 'قيادي وتطويري' : 'Leadership & Development'}</option>
                      <option value="ريادة أعمال وابتكار">{isRtl ? 'ريادة أعمال وابتكار' : 'Entrepreneurship & Innovation'}</option>
                      <option value="إعلامي وتواصلي">{isRtl ? 'إعلامي وتواصلي' : 'Media & Communication'}</option>
                      <option value="صحي وبيئي">{isRtl ? 'صحي وبيئي' : 'Health & Environment'}</option>
                      <option value="عام">{isRtl ? 'عام' : 'General'}</option>
                      <option value="custom">✏️ {t('custom_category_option', 'أخرى (كتابة تصنيف مخصص غير موجود بالقائمة)...')}</option>
                    </select>

                    {/* Custom Category Input when selected */}
                    {regCategory === 'custom' && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <input
                          type="text"
                          value={customRegCategory}
                          onChange={e => setCustomRegCategory(e.target.value)}
                          placeholder={isRtl ? "اكتب تصنيف النادي المخصص هنا..." : "Write custom club category here..."}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-800/95 border border-teal-500 text-white focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500 font-bold"
                          required
                          autoFocus
                        />
                        <p className="text-[10px] text-teal-400 mt-1 font-medium">
                          {t('custom_category_hint', 'سيتم تسجيل واعتماد هذا التصنيف المخصص في بطاقة وبيانات النادي.')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Supervisor Selection Dropdown */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span>{t('login.select_club_supervisor_label', 'مشرف النادي الطلابي (لاعتماد الفعاليات والطلبات):')}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowInlineSupervisorModal(true)}
                        className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-lg hover:border-amber-400 font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('login.supervisor_unregistered_prompt', 'مشرفك غير مسجل؟ اضغط هنا لإضافته فوراً')}</span>
                      </button>
                    </div>
                    <select
                      value={regSupervisorId}
                      onChange={e => setRegSupervisorId(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-amber-500/60 text-white focus:ring-2 focus:ring-amber-500 font-semibold cursor-pointer"
                      required
                    >
                      <option value="">-- {t('login.choose_supervisor_placeholder', 'اختر المشرف الأكاديمي المسند للنادي')} ({supervisorAccounts.length} مشرفين متاحين) --</option>
                      {supervisorAccounts.map(sup => (
                        <option key={sup.id} value={sup.id}>
                          👨‍🏫 {sup.name} ({sup.department || t('club_supervision', 'إشراف الأندية الطلابية')}) {sup.isCustom ? '★ جديد' : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('login.supervisor_routing_note', 'عند تقديم النادي لأي طلب فعالية، يُحال للمشرف المختار أولاً للاعتماد والموافقة قبل انتقال المهام للموظفين المختصين.')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('field.president_name', 'اسم رئيس النادي الكامل:')}
                    </label>
                    <input
                      type="text"
                      value={regPresName}
                      onChange={e => setRegPresName(e.target.value)}
                      placeholder={isRtl ? "مثال: م. أحمد بن خالد العتيبي" : "e.g. Ahmed Al-Otaibi"}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('field.phone', 'رقم الجوال للتواصل:')}
                    </label>
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
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('login.account_password', 'كلمة المرور للحساب:')}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder={t('login.enter_password', 'أدخل كلمة المرور...')}
                        className={`w-full text-xs sm:text-sm p-3 ${isRtl ? 'pl-10' : 'pr-10'} rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-teal-500 font-semibold`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200`}
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('login.confirm_password', 'تأكيد كلمة المرور:')}
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder={t('login.reenter_password', 'أعد كتابة كلمة المرور')}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-teal-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('login.univ_email', 'البريد الإلكتروني الجامعي:')}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="president@student.kfupm.edu.sa"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {t('field.office', 'مقر النادي (اختياري):')}
                    </label>
                    <input
                      type="text"
                      value={regOffice}
                      onChange={e => setRegOffice(e.target.value)}
                      placeholder={isRtl ? "مبنى 10 - مقر الأندية" : "Bldg 10 - Clubs Center"}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t('field.bio', 'نبذة عن النادي وأهدافه (اختياري):')}
                  </label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={e => setRegBio(e.target.value)}
                    placeholder={isRtl ? "اكتب نبذة موجزة عن النادي..." : "Write a brief description of the club..."}
                    className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('action.register_club_submit', 'تأكيد التسجيل والدخول الفوري للنظام')}</span>
                </button>
              </form>
            )}

            {/* TAB 4: Staff Members Login */}
            {activeTab === 'staff' && (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="text-xs text-slate-300 mb-2 flex items-center justify-between">
                  <span>{t('login.select_staff_prompt', 'اختر حساب الموظف وأدخل كلمة المرور للوصول لصندوق مهامه:')}</span>
                  <span className="text-[11px] text-blue-400">{t('login.protect_staff_tasks', 'حماية مهام الموظف')}</span>
                </div>

                {staffError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{staffError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {staffMembers.map(staff => (
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
                                {t('badge.selected', 'تم الاختيار')}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-blue-300 mt-0.5">
                            {staff.roleCode === 'staff_hussein' && (isRtl ? 'الحركة (الباصات) • الإسكان والمكتبية • الكهرباء والإنارة • IT والشبكات • حجز المباني' : 'Transportation (Buses) • Housing • Electricity • IT & Networks • Building Booking')}
                            {staff.roleCode === 'staff_mousa' && (isRtl ? 'حجز القاعات والملاعب • إعلان الفعاليات (الإيميل و The Fives) • المطابع • العلاقات العامة' : 'Halls & Fields • Event Announcements (Email & The Fives) • Printing Press • Public Relations')}
                            {staff.roleCode === 'staff_musleh' && (isRtl ? 'الأمن والسلامة وتصاريح الدخول • الخدمات الغذائية والضيافة الخاصة' : 'Security, Safety & Entry Permits • Food Services & VIP Catering')}
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
                      <span>{t('login.staff_password', 'كلمة مرور الموظف')} ({selectedStaffObj?.name || t('staff_member', 'الموظف')}):</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      value={staffPassword}
                      onChange={e => setStaffPassword(e.target.value)}
                      placeholder={t('login.enter_password', 'أدخل كلمة مرور الموظف...')}
                      className={`w-full text-xs sm:text-sm p-3.5 ${isRtl ? 'pl-11' : 'pr-11'} rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer`}
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
                  <span>{t('login.enter_staff_inbox', 'دخول صندوق مهام الموظف')} ({selectedStaffObj?.shortName})</span>
                </button>
              </form>
            )}

            {/* TAB 5: Admin Supervision */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-5 text-center">
                <div className={`w-16 h-16 rounded-3xl ${currentTheme.ambientGlowPrimary} ${currentTheme.adminAccentColor} border ${currentTheme.cardBorder} flex items-center justify-center mx-auto text-2xl shadow-lg`}>
                  👑
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Tajawal',sans-serif]">
                    {t('login.admin_portal_title', 'بوابة الإشراف العام • إدارة النشاط الطلابي')}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                    {t('login.admin_portal_desc', 'مخصصة للإدارة المركزية لمتابعة تدفق طلبات جميع الأندية، مراقبة نسب إنجاز الموظفين، وإدارة الحسابات والأندية المسجلة.')}
                  </p>
                </div>

                {adminError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                {/* Password Input for Admin */}
                <div className={`${isRtl ? 'text-right' : 'text-left'} max-w-md mx-auto`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <KeyRound className={`w-3.5 h-3.5 ${currentTheme.adminAccentColor}`} />
                      <span>{t('login.admin_password', 'كلمة مرور إدارة النشاط:')}</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder={t('login.enter_password', 'أدخل كلمة المرور...')}
                      className={`w-full text-xs sm:text-sm p-3.5 ${isRtl ? 'pl-11' : 'pr-11'} rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer`}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className={`p-3.5 ${currentTheme.adminBadgeBg} rounded-2xl text-xs max-w-md mx-auto`}>
                  {t('login.admin_permissions_note', 'صلاحيات كاملة للاطلاع الإشرافي على كافة الأندية والموظفين وتعديل البيانات.')}
                </div>

                <button
                  type="submit"
                  className={`w-full max-w-md mx-auto py-3.5 px-4 rounded-2xl bg-gradient-to-r ${currentTheme.adminButtonBg} text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('login.admin_submit_btn', 'تأكيد كلمة المرور والدخول للإشراف العام')}</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* System Footnote */}
        <div className="text-center mt-6 text-xs text-slate-300">
          <p>{t('login.footer_copyright', 'عمادة شؤون الطلاب • جامعة الملك فهد للبترول والمعادن (KFUPM) • 2026')}</p>
        </div>
      </div>

      {/* Inline Quick Supervisor Registration Modal */}
      {showInlineSupervisorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg p-5 sm:p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-['Tajawal',sans-serif]">
                    {t('login.quick_add_sup_title', 'تسجيل وإدراج مشرف أكاديمي جديد')}
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    {t('login.quick_add_sup_subtitle', 'يتم حفظ المشرف وإدراجه فوراً في القائمة واختياره لناديك')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInlineSupervisorModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inlineSupError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{inlineSupError}</span>
              </div>
            )}

            {inlineSupSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{inlineSupSuccess}</span>
              </div>
            )}

            <form onSubmit={handleQuickInlineSupervisorSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {t('login.sup_full_name', 'اسم المشرف الثلاثي:')} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={inlineSupName}
                  onChange={e => setInlineSupName(e.target.value)}
                  placeholder={isRtl ? "مثال: د. محمد بن عبد الله الشمري" : "e.g., Dr. Mohammed Al-Shammari"}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-bold"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t('login.univ_email', 'البريد الإلكتروني الجامعي:')}
                  </label>
                  <input
                    type="email"
                    value={inlineSupEmail}
                    onChange={e => setInlineSupEmail(e.target.value)}
                    placeholder="example@kfupm.edu.sa"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t('field.phone', 'رقم الجوال:')}
                  </label>
                  <input
                    type="tel"
                    value={inlineSupPhone}
                    onChange={e => setInlineSupPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t('login.sup_office', 'مكتب المشرف / الكلية:')}
                  </label>
                  <input
                    type="text"
                    value={inlineSupOffice}
                    onChange={e => setInlineSupOffice(e.target.value)}
                    placeholder={isRtl ? "مبنى 22 - مكتب 315" : "Bldg 22 - Office 315"}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t('login.set_sup_password', 'كلمة مرور المشرف للدخول:')}
                  </label>
                  <input
                    type="text"
                    value={inlineSupPassword}
                    onChange={e => setInlineSupPassword(e.target.value)}
                    placeholder="123"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>{t('action.save_and_select_sup', 'حفظ وإدراج المشرف مباشرة في القائمة')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInlineSupervisorModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {t('action.cancel', 'إلغاء')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div />
    </div>
  );
};
