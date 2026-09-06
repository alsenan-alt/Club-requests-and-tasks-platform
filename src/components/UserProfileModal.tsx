import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Award, 
  Save, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Edit3,
  Layers,
  Clock,
  Plus,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Shield,
  Trash2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { RoleType, UserAccount } from '../types';

export const UserProfileModal: React.FC = () => {
  const { 
    currentUser, 
    userAccounts, 
    updateUserProfile, 
    changePassword,
    registerNewClubPresident, 
    deleteClubAccount,
    registerNewSupervisor,
    deleteSupervisorAccount,
    isUserProfileModalOpen, 
    setIsUserProfileModalOpen,
    requests,
    staffMembers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'manage_clubs' | 'manage_supervisors' | 'staff_directory'>('profile');
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [saveAlertMessage, setSaveAlertMessage] = useState('تم حفظ وتحديث البيانات بنجاح في المنظومة.');
  const [isAddingNewClub, setIsAddingNewClub] = useState(false);
  const [clubToDelete, setClubToDelete] = useState<UserAccount | null>(null);

  // Supervisor management state for Admin
  const [isAddingNewSupervisor, setIsAddingNewSupervisor] = useState(false);
  const [supervisorToDelete, setSupervisorToDelete] = useState<UserAccount | null>(null);
  const [newSupName, setNewSupName] = useState('');
  const [newSupDept, setNewSupDept] = useState('إشراف الأندية الطلابية');
  const [newSupTitle, setNewSupTitle] = useState('مشرف أكاديمي معتمد');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupOffice, setNewSupOffice] = useState('مبنى العمادة / الكلية');
  const [newSupPassword, setNewSupPassword] = useState('');
  const [newSupBio, setNewSupBio] = useState('');

  // Form State for current user profile
  const [name, setName] = useState('');
  const [clubName, setClubName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [office, setOffice] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [bio, setBio] = useState('');
  const [membersCount, setMembersCount] = useState(30);
  const [socialHandle, setSocialHandle] = useState('');
  const [statusAvailability, setStatusAvailability] = useState<'available' | 'busy' | 'away'>('available');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // New Club Form State (for Admin)
  const [newClubName, setNewClubName] = useState('');
  const [newPresName, setNewPresName] = useState('');
  const [newPresPhone, setNewPresPhone] = useState('');
  const [newPresEmail, setNewPresEmail] = useState('');
  const [newClubCat, setNewClubCat] = useState('تقني وهندسي');
  const [customNewClubCat, setCustomNewClubCat] = useState('');
  const [newClubPassword, setNewClubPassword] = useState('');

  // Load user data into form
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setClubName(currentUser.clubName || '');
      setTitle(currentUser.title || '');
      setDepartment(currentUser.department || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setOffice(currentUser.office || '');
      
      const standardCats = [
        'تقني وهندسي',
        'علمي وبحثي',
        'ثقافي وفكري',
        'اجتماعي وتطوعي',
        'فنون وإبداع',
        'رياضي وكشفي',
        'قيادي وتطويري',
        'ريادة أعمال وابتكار',
        'إعلامي وتواصلي',
        'صحي وبيئي',
        'عام'
      ];
      const currentCat = currentUser.category || 'تقني وهندسي';
      if (standardCats.includes(currentCat)) {
        setCategory(currentCat);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setCustomCategory(currentCat);
      }

      setBio(currentUser.bio || '');
      setMembersCount(currentUser.membersCount || 35);
      setSocialHandle(currentUser.socialHandle || '@club_kfupm');
      setStatusAvailability(currentUser.statusAvailability || 'available');
      
      // Reset password states
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordError('');
      setPasswordSuccess('');
    }
  }, [currentUser, isUserProfileModalOpen]);

  if (!isUserProfileModalOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'custom'
      ? (customCategory.trim() || 'عام ومخصص')
      : category;

    updateUserProfile({
      name: name.trim(),
      clubName: currentUser.role === 'club_president' ? clubName.trim() : currentUser.clubName,
      title: title.trim() || currentUser.title,
      department: department.trim() || currentUser.department,
      phone: phone.trim(),
      email: email.trim(),
      office: office.trim(),
      category: finalCategory,
      bio: bio.trim(),
      membersCount: Number(membersCount),
      socialHandle: socialHandle.trim(),
      statusAvailability,
    });

    setSaveAlertMessage('تم حفظ وتحديث البيانات بنجاح في المنظومة.');
    setShowSaveAlert(true);
    setTimeout(() => {
      setShowSaveAlert(false);
    }, 3000);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('يرجى إدخال كلمة المرور الحالية');
      return;
    }

    if (!newPassword || newPassword.trim().length < 3) {
      setPasswordError('يجب ألا تقل كلمة المرور الجديدة عن 3 خانات');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.message);
    } else {
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setPasswordSuccess('');
      }, 4000);
    }
  };

  const handleAdminCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim() || !newPresName.trim()) return;
    if (!newClubPassword.trim() || newClubPassword.trim().length < 3) {
      alert('يرجى تحديد كلمة مرور للنادي لا تقل عن 3 خانات');
      return;
    }

    const finalCat = newClubCat === 'custom' 
      ? (customNewClubCat.trim() || 'عام ومخصص') 
      : newClubCat;

    registerNewClubPresident({
      clubName: newClubName,
      presidentName: newPresName,
      username: `club_${Date.now().toString().slice(-4)}`,
      password: newClubPassword.trim(),
      email: newPresEmail.trim() || `${newPresName.toLowerCase().replace(/\s+/g, '.')}@student.kfupm.edu.sa`,
      phone: newPresPhone.trim() || '0550000000',
      category: finalCat,
      office: 'مقر الأندية الطلابية - مبنى 10',
      bio: `النادي الطلابي المعتمد: ${newClubName}`,
    });

    setNewClubName('');
    setNewPresName('');
    setNewPresPhone('');
    setNewPresEmail('');
    setNewClubPassword('');
    setCustomNewClubCat('');
    setIsAddingNewClub(false);
    setSaveAlertMessage('تم تسجيل واعتماد النادي وتعيين كلمة المرور بنجاح!');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  // Handle Admin Creating New Supervisor
  const handleAdminCreateSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) {
      alert('يرجى إدخال اسم المشرف الأكاديمي');
      return;
    }

    registerNewSupervisor({
      name: newSupName.trim(),
      title: newSupTitle.trim() || 'مشرف أكاديمي معتمد',
      department: newSupDept.trim() || 'إشراف الأندية الطلابية',
      email: newSupEmail.trim() || `${newSupName.toLowerCase().replace(/\s+/g, '.')}@kfupm.edu.sa`,
      phone: newSupPhone.trim(),
      office: newSupOffice.trim() || 'مبنى العمادة / الكلية',
      password: newSupPassword.trim() || '123',
      bio: newSupBio.trim() || 'مشرف أكاديمي معتمد للأندية الطلابية بجامعة الملك فهد للبترول والمعادن.',
      autoLogin: false,
    });

    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    setNewSupOffice('مبنى العمادة / الكلية');
    setNewSupPassword('');
    setNewSupBio('');
    setIsAddingNewSupervisor(false);
    setSaveAlertMessage('تم تسجيل واعتماد المشرف الأكاديمي وتفعيل حسابه بنجاح!');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  // Club Request stats for this club
  const clubRequests = requests.filter(r => r.clubName === currentUser.clubName);
  const completedClubRequests = clubRequests.filter(r => r.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['Cairo',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${currentUser.avatarBg || 'from-slate-800 to-slate-900'} text-white relative`}>
          <button
            onClick={() => setIsUserProfileModalOpen(false)}
            className="absolute top-5 left-5 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentUser.role === 'club_president' ? '🎓' : currentUser.role === 'club_supervisor' ? '🏛️' : currentUser.role === 'admin' ? '👑' : '👔'}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold font-['Tajawal',sans-serif]">
                  {currentUser.role === 'club_president' ? (currentUser.clubName || 'بيانات النادي الطلابي') : currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-xs">
                  {currentUser.title || (currentUser.role === 'club_supervisor' ? 'مشرف أكاديمي' : 'موظف النشاط')}
                </span>
              </div>
              <p className="text-xs text-white/80">
                {currentUser.role === 'club_president' 
                  ? 'لوحة التحكم وتعديل بيانات النادي، وكلمة مرور الحساب المعتمد'
                  : currentUser.role === 'club_supervisor'
                    ? 'لوحة بيانات المشرف الأكاديمي، الأندية المسندة، وساعات الاستشارة وتحديث كلمة المرور'
                    : currentUser.role === 'admin' 
                      ? 'لوحة إدارة النشاط وإعدادات المنظومة الشاملة والأمان'
                      : 'لوحة التحكم ببيانات الموظف وساعات المراجعة وتعديل كلمة المرور'}
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>البيانات الأساسية</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>تغيير كلمة المرور والأمان 🔐</span>
            </button>

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('manage_clubs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'manage_clubs' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>إدارة الأندية المسجلة ({userAccounts.filter(u => u.role === 'club_president').length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('manage_supervisors')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'manage_supervisors' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>إدارة المشرفين الأكاديميين ({userAccounts.filter(u => u.role === 'club_supervisor').length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('staff_directory')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'staff_directory' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>دليل الموظفين ({STAFF_MEMBERS.length})</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* Success Notice */}
          {showSaveAlert && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveAlertMessage}</span>
            </div>
          )}

          {/* TAB 1: User / Club Profile Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in">
              
              {/* Club President Section */}
              {currentUser.role === 'club_president' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-semibold block">إجمالي الطلبات</span>
                      <span className="text-lg font-bold text-slate-900">{clubRequests.length}</span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-semibold block">الطلبات المنجزة</span>
                      <span className="text-lg font-bold text-emerald-600">{completedClubRequests}</span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-semibold block">أعضاء النادي</span>
                      <span className="text-lg font-bold text-blue-600">{membersCount}</span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-semibold block">حالة الاعتماد</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">معتمد رسمي</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">اسم النادي الطلابي الرسمي:</label>
                      <input
                        type="text"
                        value={clubName}
                        onChange={e => setClubName(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 block">تصنيف النادي:</label>
                        {category === 'custom' && (
                          <span className="text-[10px] text-emerald-700 font-bold">تصنيف مخصص</span>
                        )}
                      </div>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                      >
                        <option value="تقني وهندسي">تقني وهندسي</option>
                        <option value="علمي وبحثي">علمي وبحثي</option>
                        <option value="ثقافي وفكري">ثقافي وفكري</option>
                        <option value="اجتماعي وتطوعي">اجتماعي وتطوعي</option>
                        <option value="فنون وإبداع">فنون وإبداع</option>
                        <option value="رياضي وكشفي">رياضي وكشفي</option>
                        <option value="قيادي وتطويري">قيادي وتطويري</option>
                        <option value="ريادة أعمال وابتكار">ريادة أعمال وابتكار</option>
                        <option value="إعلامي وتواصلي">إعلامي وتواصلي</option>
                        <option value="صحي وبيئي">صحي وبيئي</option>
                        <option value="عام">عام</option>
                        <option value="custom">✏️ أخرى (كتابة تصنيف مخصص غير موجود)...</option>
                      </select>

                      {category === 'custom' && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <input
                            type="text"
                            value={customCategory}
                            onChange={e => setCustomCategory(e.target.value)}
                            placeholder="اكتب تصنيف النادي المخصص..."
                            className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-white border border-emerald-500 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">اسم رئيس النادي:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">رقم جوال رئيس النادي للتواصل:</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="05xxxxxxxx"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">البريد الإلكتروني الجامعي:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="president@student.kfupm.edu.sa"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">مقر / مكتب النادي في الجامعة:</label>
                      <input
                        type="text"
                        value={office}
                        onChange={e => setOffice(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="مثال: مبنى 10 - مقر الأندية"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">عدد أعضاء ولجان النادي:</label>
                      <input
                        type="number"
                        value={membersCount}
                        onChange={e => setMembersCount(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        min={5}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">حساب النادي على X أو المنصات:</label>
                      <input
                        type="text"
                        value={socialHandle}
                        onChange={e => setSocialHandle(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="@ClubHandle"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">نبذة عن النادي ورسالته وأهدافه:</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="اكتب نبذة تعريفية قصيرة عن النادي وأبرز أهدافه وأنشطته السنوية..."
                    />
                  </div>
                </>
              )}

              {/* Academic Supervisor Section */}
              {currentUser.role === 'club_supervisor' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                    <div className="text-center p-2.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
                      <span className="text-[10px] text-amber-700 font-semibold block">الأندية المسندة</span>
                      <span className="text-lg font-bold text-amber-900">
                        {currentUser.supervisedClubs && currentUser.supervisedClubs.length > 0 
                          ? currentUser.supervisedClubs.length 
                          : currentUser.clubName ? 1 : 0}
                      </span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
                      <span className="text-[10px] text-amber-700 font-semibold block">طلبات قيد المراجعة</span>
                      <span className="text-lg font-bold text-amber-600">
                        {requests.filter(r => r.status === 'under_review' && (
                          (currentUser.supervisedClubs && currentUser.supervisedClubs.includes(r.clubName)) ||
                          r.clubName === currentUser.clubName
                        )).length}
                      </span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
                      <span className="text-[10px] text-amber-700 font-semibold block">فعاليات معتمدة</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {requests.filter(r => r.status === 'approved' && (
                          (currentUser.supervisedClubs && currentUser.supervisedClubs.includes(r.clubName)) ||
                          r.clubName === currentUser.clubName
                        )).length}
                      </span>
                    </div>
                    <div className="text-center p-2.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs">
                      <span className="text-[10px] text-amber-700 font-semibold block">صفة الحساب</span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">مشرف أكاديمي</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">اسم المشرف الأكاديمي الرباعي:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">الرتبة واللقب الأكاديمي:</label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="مثال: أستاذ مشارك - قسم الهندسة الميكانيكية"
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">الكلية / القسم الأكاديمي:</label>
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder="مثال: كلية علوم وهندسة الحاسب الآلي"
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">حالة التواجد وساعات الإتاحة:</label>
                      <select
                        value={statusAvailability}
                        onChange={e => setStatusAvailability(e.target.value as any)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                      >
                        <option value="available">🟢 متاح للاستشارات ومراجعة الفعاليات</option>
                        <option value="busy">🟡 في محاضرات / اجتماعات علمية</option>
                        <option value="away">🔴 في إجازة رسمية / خارج الجامعة</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">رقم الجوال / الهاتف المكتبي:</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="05xxxxxxxx"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">البريد الإلكتروني الجامعي الرسمي:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="supervisor@kfupm.edu.sa"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">المكتب وساعات الاستشارة الأكاديمية للطلاب:</label>
                      <input
                        type="text"
                        value={office}
                        onChange={e => setOffice(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="مثال: مبنى 24 - مكتب 310 (الساعات المكتبية: الإثنين والأربعاء 10 - 12)"
                      />
                    </div>
                  </div>

                  {/* Supervised Clubs Badges */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>الأندية الطلابية المسندة تحت إشرافكم الأكاديمي:</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentUser.supervisedClubs && currentUser.supervisedClubs.length > 0 ? (
                        currentUser.supervisedClubs.map(cName => (
                          <span key={cName} className="px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5">
                            <span>🎓</span>
                            <span>{cName}</span>
                          </span>
                        ))
                      ) : currentUser.clubName ? (
                        <span className="px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5">
                          <span>🎓</span>
                          <span>{currentUser.clubName}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-amber-700 italic">لا توجد أندية مسندة حالياً.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">التوجيه الإرشادي والرسالة للأندية الطلابية:</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="اكتب توجيهاتك وإرشاداتك لأعضاء ورؤساء الأندية الطلابية لرفع جودة الفعاليات..."
                    />
                  </div>
                </>
              )}

              {/* Staff Member Section */}
              {(currentUser.role.startsWith('staff') || currentUser.role === 'staff') && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">الاسم واللقب الوظيفي:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">المسمى الوظيفي والمسؤولية:</label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="مثال: منسق الخدمات اللوجستية والإنارة"
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">الإدارة / القسم:</label>
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder="مثال: إدارة الخدمات الطلابية والأنشطة"
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">حالة التواجد الحالية:</label>
                      <select
                        value={statusAvailability}
                        onChange={e => setStatusAvailability(e.target.value as any)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                      >
                        <option value="available">🟢 متاح في المكتب لمعالجة الطلبات</option>
                        <option value="busy">🟡 مشغول في تجهيز ميداني لفعالية</option>
                        <option value="away">🔴 في إجازة رسمية / خارج أوقات العمل</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">رقم الجوال / الهاتف المكتبي:</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">البريد الإلكتروني الجامعي:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">المكتب وساعات المراجعة للطلاب:</label>
                      <input
                        type="text"
                        value={office}
                        onChange={e => setOffice(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="مبنى 10 - مكتب 104 (الأحد إلى الخميس: 8 ص - 2 م)"
                      />
                    </div>
                  </div>

                  {/* Assigned Departments reference */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>الأقسام والمسؤوليات الموكلة إليك رسمياً:</span>
                    </h4>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      {currentUser.role === 'staff_hussein' && 'الحركة (الباصات) • الإسكان والخدمات المكتبية • الكهرباء والإنارة • تقنية المعلومات IT • حجز المباني (70، 54، 42، 10، 60).'}
                      {currentUser.role === 'staff_mousa' && 'حجز القاعات والملاعب • إعلانات الفعاليات (الإيميل و The Fives) • المطابع والشهادات • العلاقات العامة والتغطية الإعلامية.'}
                      {currentUser.role === 'staff_musleh' && 'الأمن والسلامة وتصاريح الدخول • الخدمات الغذائية والضيافة الخاصة للفعاليات المعتمدة.'}
                      {!['staff_hussein', 'staff_mousa', 'staff_musleh'].includes(currentUser.role) && (currentUser.department || 'إدارة النشاط الطلابي وتنسيق الفعاليات المعتمدة.')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">نبذة / ملاحظات وتوجيهات للمنظومة:</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="اكتب أي ملاحظات إدارية أو أوقات تواجد إضافية..."
                    />
                  </div>
                </>
              )}

              {/* Admin Profile Section */}
              {currentUser.role === 'admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">الجهة / اسم الإدارة:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">المسمى الوظيفي:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="مدير النشاط الطلابي"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">هاتف الإدارة المركزي:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">البريد الإلكتروني الموحد:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">مقر الإدارة العامة:</label>
                    <input
                      type="text"
                      value={office}
                      onChange={e => setOffice(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">الرسالة الإدارية وتوجيهات المنظومة:</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit / Save Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsUserProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  إغلاق
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وتحديث البيانات</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: Security & Password Change */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-5 animate-in fade-in">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold shrink-0 text-xl shadow-2xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">تعديل كلمة مرور الحساب والأمان</h4>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-slate-200/80 text-slate-800">
                      اسم المستخدم: {currentUser.username}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    يمكنك تغيير كلمة المرور الخاصة بحساب (<strong className="text-slate-900">{currentUser.name}</strong> - {currentUser.title || currentUser.role}). سيتم حفظ كلمة المرور وتفعيلها فوراً في المنظومة مع المزامنة السحابية.
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-4 max-w-lg mx-auto">
                {/* Current Password */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>كلمة المرور الحالية:</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الحالية..."
                      className="w-full text-xs sm:text-sm p-3 pl-10 rounded-xl bg-slate-50 border border-slate-300 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    كلمة المرور الجديدة:
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة..."
                      className="w-full text-xs sm:text-sm p-3 pl-10 rounded-xl bg-slate-50 border border-slate-300 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    تأكيد كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور الجديدة..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Password change submit buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsUserProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  إغلاق
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تحديث وحفظ كلمة المرور</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: Manage Registered Clubs (For Admin) */}
          {activeTab === 'manage_clubs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">سجل الأندية الطلابية المسجلة</h3>
                  <p className="text-xs text-slate-500">استعراض وتعديل بيانات الأندية أو إضافة نادٍ جديد للمنظومة</p>
                </div>

                <button
                  onClick={() => setIsAddingNewClub(!isAddingNewClub)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingNewClub ? 'إلغاء الإضافة' : 'إضافة نادٍ جديد'}</span>
                </button>
              </div>

              {/* Add New Club Form */}
              {isAddingNewClub && (
                <form onSubmit={handleAdminCreateClub} className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-4 animate-in fade-in">
                  <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>تسجيل نادٍ طلابي ورئيس نادٍ جديد:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">اسم النادي الجديد:</label>
                      <input
                        type="text"
                        value={newClubName}
                        onChange={e => setNewClubName(e.target.value)}
                        placeholder="مثال: نادي الطاقة المتجددة"
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 block">تصنيف النادي:</label>
                        {newClubCat === 'custom' && (
                          <span className="text-[10px] text-purple-700 font-bold">كتابة تصنيف يدوي</span>
                        )}
                      </div>
                      <select
                        value={newClubCat}
                        onChange={e => setNewClubCat(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-semibold cursor-pointer"
                      >
                        <option value="تقني وهندسي">تقني وهندسي</option>
                        <option value="علمي وبحثي">علمي وبحثي</option>
                        <option value="ثقافي وفكري">ثقافي وفكري</option>
                        <option value="اجتماعي وتطوعي">اجتماعي وتطوعي</option>
                        <option value="فنون وإبداع">فنون وإبداع</option>
                        <option value="رياضي وكشفي">رياضي وكشفي</option>
                        <option value="قيادي وتطويري">قيادي وتطويري</option>
                        <option value="ريادة أعمال وابتكار">ريادة أعمال وابتكار</option>
                        <option value="إعلامي وتواصلي">إعلامي وتواصلي</option>
                        <option value="صحي وبيئي">صحي وبيئي</option>
                        <option value="عام">عام</option>
                        <option value="custom">✏️ أخرى (كتابة تصنيف مخصص غير موجود)...</option>
                      </select>

                      {/* Custom Category Input for Admin */}
                      {newClubCat === 'custom' && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <input
                            type="text"
                            value={customNewClubCat}
                            onChange={e => setCustomNewClubCat(e.target.value)}
                            placeholder="اكتب تصنيف النادي المخصص..."
                            className="w-full text-xs p-2.5 rounded-xl bg-white border border-purple-400 text-slate-900 font-bold focus:ring-2 focus:ring-purple-500"
                            required
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">اسم رئيس النادي:</label>
                      <input
                        type="text"
                        value={newPresName}
                        onChange={e => setNewPresName(e.target.value)}
                        placeholder="اسم الطالب رئيس النادي"
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-semibold focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">رقم الجوال:</label>
                      <input
                        type="tel"
                        value={newPresPhone}
                        onChange={e => setNewPresPhone(e.target.value)}
                        placeholder="055xxxxxxx"
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">كلمة مرور الحساب:</label>
                      <input
                        type="password"
                        value={newClubPassword}
                        onChange={e => setNewClubPassword(e.target.value)}
                        placeholder="كلمة مرور الحساب"
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">البريد الإلكتروني الجامعي:</label>
                      <input
                        type="email"
                        value={newPresEmail}
                        onChange={e => setNewPresEmail(e.target.value)}
                        placeholder="president@student.kfupm.edu.sa"
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewClub(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      تأكيد وتسجيل النادي
                    </button>
                  </div>
                </form>
              )}

              {/* Clubs List Table */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {userAccounts.filter(u => u.role === 'club_president').map(clubUser => {
                  const reqCount = requests.filter(r => r.clubName === clubUser.clubName).length;
                  return (
                    <div key={clubUser.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${clubUser.avatarBg || 'from-emerald-600 to-teal-700'} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}>
                          🎓
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{clubUser.clubName}</h4>
                          <p className="text-[11px] text-slate-500">
                            الرئيس: <span className="font-semibold text-slate-800">{clubUser.name}</span> • {clubUser.phone}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                              {clubUser.category || 'نادي معتمد'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                          {reqCount} طلبات
                        </span>

                        <button
                          type="button"
                          onClick={() => setClubToDelete(clubUser)}
                          className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          title={`حذف نادي ${clubUser.clubName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف النادي</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirm Delete Club Modal Dialog */}
              {clubToDelete && (
                <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-rose-200 shadow-2xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                      <Trash2 className="w-6 h-6" />
                    </div>

                    <div className="text-center">
                      <h4 className="text-sm font-bold text-slate-900">تأكيد حذف النادي الطلابي</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        هل أنت متأكد من رغبتك في حذف حساب نادٍ (<strong className="text-rose-600">{clubToDelete.clubName}</strong>) ورئيسه (<strong className="text-slate-800">{clubToDelete.name}</strong>) نهائياً من المنظومة؟
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>تنبيه: سيتم إزالة الحساب من قائمة الأندية المسجلة ومنع تسجيل الدخول به مستقبلاً.</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setClubToDelete(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        إلغاء التراجع
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const res = deleteClubAccount(clubToDelete.id);
                          setClubToDelete(null);
                          setSaveAlertMessage(res.message);
                          setShowSaveAlert(true);
                          setTimeout(() => setShowSaveAlert(false), 3500);
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>نعم، حذف النادي نهائياً</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Manage Academic Supervisors (For Admin) */}
          {activeTab === 'manage_supervisors' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>لوحة إدارة المشرفين الأكاديميين المعتمدين</span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-1">
                    تسجيل المشرفين الجدد ومتابعة وتعيين صلاحيات الإشراف على الأندية الطلابية
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNewSupervisor(!isAddingNewSupervisor)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isAddingNewSupervisor 
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {isAddingNewSupervisor ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isAddingNewSupervisor ? 'إلغاء الإضافة' : 'إضافة مشرف أكاديمي جديد'}</span>
                </button>
              </div>

              {/* Add New Supervisor Form */}
              {isAddingNewSupervisor && (
                <form onSubmit={handleAdminCreateSupervisor} className="p-5 bg-white border-2 border-dashed border-amber-300 rounded-2xl space-y-4 shadow-sm animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>بيانات المشرف الأكاديمي الجديد</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشرف الثلاثي *</label>
                      <input
                        type="text"
                        required
                        placeholder="د. خالد بن فهد الشمري"
                        value={newSupName}
                        onChange={(e) => setNewSupName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">المسمى الوظيفي / الأكاديمي</label>
                      <input
                        type="text"
                        placeholder="مشرف أكاديمي / أستاذ مشارك"
                        value={newSupTitle}
                        onChange={(e) => setNewSupTitle(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">البريد الجامعي الرسمي</label>
                      <input
                        type="email"
                        placeholder="khalid@kfupm.edu.sa"
                        value={newSupEmail}
                        onChange={(e) => setNewSupEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال للتواصل</label>
                      <input
                        type="tel"
                        placeholder="05XXXXXXXX"
                        value={newSupPhone}
                        onChange={(e) => setNewSupPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الكلية أو القسم الأكاديمي</label>
                      <input
                        type="text"
                        placeholder="كلية علوم وهندسة الحاسب الآلي"
                        value={newSupDept}
                        onChange={(e) => setNewSupDept(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الابتدائية</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={newSupPassword}
                        onChange={(e) => setNewSupPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewSupervisor(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>اعتماد وحفظ المشرف فوراً</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Supervisors List Table */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {userAccounts.filter(u => u.role === 'club_supervisor').map(supUser => {
                  const supervisedCount = supUser.supervisedClubNames?.length || 0;
                  return (
                    <div key={supUser.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${supUser.avatarBg || 'from-amber-600 to-orange-700'} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}>
                          🏛️
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{supUser.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            {supUser.title} • <span className="text-slate-700 font-semibold">{supUser.department}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block font-medium">
                              📧 {supUser.email || 'لا يوجد بريد مسجل'}
                            </span>
                            {supUser.phone && (
                              <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                📞 {supUser.phone}
                              </span>
                            )}
                            {supUser.office && (
                              <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                🏢 {supUser.office}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                          {supervisedCount > 0 ? `${supervisedCount} أندية مسندة` : 'إشراف عام'}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSupervisorToDelete(supUser)}
                          className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          title={`حذف المشرف ${supUser.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirm Delete Supervisor Modal Dialog */}
              {supervisorToDelete && (
                <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-rose-200 shadow-2xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                      <Trash2 className="w-6 h-6" />
                    </div>

                    <div className="text-center">
                      <h4 className="text-sm font-bold text-slate-900">تأكيد حذف المشرف الأكاديمي</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        هل أنت متأكد من رغبتك في حذف حساب المشرف الأكاديمي (<strong className="text-rose-600">{supervisorToDelete.name}</strong>) نهائياً من المنظومة؟
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>تنبيه: سيتم إلغاء صلاحيات الدخول لهذا الحساب وحذفه من قائمة المشرفين المتاحين للأندية.</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSupervisorToDelete(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        إلغاء التراجع
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const res = deleteSupervisorAccount(supervisorToDelete.id);
                          setSupervisorToDelete(null);
                          setSaveAlertMessage(res.message);
                          setShowSaveAlert(true);
                          setTimeout(() => setShowSaveAlert(false), 3500);
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>نعم، حذف المشرف نهائياً</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Staff Directory (For Admin) */}
          {activeTab === 'staff_directory' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-xs text-slate-600 mb-2">
                دليل الموظفين المعنيين بإدارة النشاط وتوجيه المهام اللوجستية:
              </div>

              <div className="grid grid-cols-1 gap-3">
                {staffMembers.map(staff => (
                  <div key={staff.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${staff.avatarBg} text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs`}>
                        👔
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">{staff.title}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-1">
                          <span>📞 {staff.phone}</span>
                          <span>🏢 {staff.office}</span>
                          <span>✉️ {staff.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
