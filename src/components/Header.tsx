import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Plus, 
  Layers, 
  RotateCcw, 
  FileText,
  Calendar,
  Sparkles,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Lock,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenReferenceGuide: () => void;
  activeTab: 'main' | 'calendar' | 'all_tasks';
  setActiveTab: (tab: 'main' | 'calendar' | 'all_tasks') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenReferenceGuide,
  activeTab,
  setActiveTab
}) => {
  const {
    currentUser,
    logout,
    currentRole,
    activeClubName,
    currentStaff,
    unreadNotificationCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsNewRequestModalOpen,
    setIsUserProfileModalOpen,
    setIsSyncModalOpen,
    setSelectedRequestId,
    resetToSampleData,
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const filteredNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (n.targetRole === 'all') return true;
    return n.targetRole === currentUser.role;
  });

  const getRoleDisplay = () => {
    if (currentUser?.role === 'club_president') {
      return {
        badgeTitle: 'رئيس نادي معتمد',
        entityTitle: currentUser.clubName || activeClubName,
        userName: currentUser.name,
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        icon: '🎓',
      };
    }
    if (currentUser?.role === 'admin') {
      return {
        badgeTitle: 'المشرف العام',
        entityTitle: 'إدارة النشاط الطلابي',
        userName: currentUser.name,
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        dotClass: 'bg-purple-500',
        icon: '👑',
      };
    }
    if (currentStaff) {
      return {
        badgeTitle: 'موظف مختص',
        entityTitle: currentStaff.shortName,
        userName: currentStaff.name,
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        dotClass: 'bg-blue-500',
        icon: '👔',
      };
    }
    return {
      badgeTitle: 'مستخدم',
      entityTitle: 'حساب مسجل',
      userName: 'مستخدم النظام',
      badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-500',
      icon: '👤',
    };
  };

  const roleInfo = getRoleDisplay();

  const handleLogoutClick = () => {
    if (window.confirm('هل ترغب في تسجيل الخروج وقفل الجلسة الحالية؟')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner / System Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            نظام التوجيه التلقائي للمهام
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">
            جلسة مؤمنة بنظام الخصوصية المعزولة لكل نادٍ وموظف
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReferenceGuide}
            className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>دليل مهام الموظفين الرسمي</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => {
              if (window.confirm('هل تريد استعادة البيانات الافتراضية؟')) {
                resetToSampleData();
              }
            }}
            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="إعادة ضبط البيانات التوضيحية"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">استعادة البيانات</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-['Tajawal',sans-serif]">
                  منصة طلبات ومهام الأندية
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/60 hidden sm:inline">
                  النشاط الطلابي
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                تقديم الطلبات والتوجيه الآلي المباشر للموظفين المعنيين
              </p>
            </div>
          </div>

          {/* Navigation Views Tab */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'main'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>لوحة العمليات والطلبات</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>تقويم المباني والقاعات</span>
            </button>

            <button
              onClick={() => setActiveTab('all_tasks')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all_tasks'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مصفوفة المهام الموزعة</span>
            </button>
          </div>

          {/* Actions & Authenticated Session User Card */}
          <div className="flex items-center gap-2.5">
            
            {/* Primary New Request CTA for President */}
            {currentRole === 'club_president' && (
              <button
                id="btn-new-request-header"
                onClick={() => setIsNewRequestModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>تقديم طلب جديد</span>
              </button>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
                title="الإشعارات والتنبيهات الخاصة بحسابك"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center px-1 animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotifDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-700" />
                        <span className="text-xs font-bold text-slate-800">
                          الإشعارات الخاصة بك ({filteredNotifications.length})
                        </span>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                        >
                          تحديد الكل كمقروء
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          لا توجد إشعارات جديدة حالياً
                        </div>
                      ) : (
                        filteredNotifications.map(item => (
                          <div
                            key={item.id}
                            onClick={() => {
                              markNotificationAsRead(item.id);
                              if (item.requestId) {
                                setSelectedRequestId(item.requestId);
                              }
                              setIsNotifDropdownOpen(false);
                            }}
                            className={`p-3 text-right hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5 ${
                              !item.read ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!item.read ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-slate-900 mb-0.5">{item.title}</h4>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{item.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                                {new Date(item.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Authenticated User Session Profile Indicator */}
            <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl border ${roleInfo.badgeBg} shadow-xs`}>
              {/* Clickable Profile Avatar & Name */}
              <button
                onClick={() => setIsUserProfileModalOpen(true)}
                className="flex items-center gap-2 text-right hover:opacity-85 transition-opacity cursor-pointer group"
                title="تعديل بيانات الحساب والنادي / لوحة المستخدم"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                  {roleInfo.icon}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${roleInfo.dotClass}`} />
                    <span className="text-xs font-bold text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                      {roleInfo.userName}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 max-w-[150px] truncate">
                    {roleInfo.entityTitle}
                  </p>
                </div>
              </button>

              {/* Profile Settings Icon Button */}
              <button
                onClick={() => setIsUserProfileModalOpen(true)}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                title="لوحة المستخدم وتعديل البيانات"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Sign Out Action Button */}
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mr-0.5"
                title="تسجيل الخروج والعودة لبوابة الدخول"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
