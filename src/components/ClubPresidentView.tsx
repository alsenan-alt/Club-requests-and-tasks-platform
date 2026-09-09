import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Bus, 
  Armchair, 
  Zap, 
  Laptop, 
  DoorOpen, 
  Megaphone, 
  Printer, 
  Camera, 
  ShieldCheck, 
  Utensils, 
  Phone, 
  Mail, 
  ExternalLink,
  Filter,
  Check,
  Edit3,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, STAFF_MEMBERS, CLUBS_LIST } from '../data/initialData';
import { ClubRequest, Task, TaskStatus, ServiceItem } from '../types';
import { EditServiceTitleModal } from './EditServiceTitleModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface Props {
  onOpenNewWizard: () => void;
  onOpenQuickService: (serviceId: string) => void;
  onOpenRequestDetails: (requestId: string) => void;
}

export const ClubPresidentView: React.FC<Props> = ({
  onOpenNewWizard,
  onOpenQuickService,
  onOpenRequestDetails,
}) => {
  const { 
    currentUser,
    activeClubName, 
    visibleRequests, 
    setSelectedRequestId,
    services,
    deleteTask,
    deleteRequest,
    staffMembers,
    setEditingRequest,
    setIsEditRequestModalOpen
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(visibleRequests[0]?.id || null);
  const [editingServiceForTitle, setEditingServiceForTitle] = useState<ServiceItem | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<{ task?: Task; request: ClubRequest } | null>(null);

  // Strict Privacy: Only show requests authorized for this club
  const displayedRequests = visibleRequests;

  const filteredRequests = displayedRequests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.eventTitle.toLowerCase().includes(q) ||
        req.requestNumber.toLowerCase().includes(q) ||
        req.clubName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalTasks = displayedRequests.reduce((acc, r) => acc + r.tasks.length, 0);
  const completedTasks = displayedRequests.reduce(
    (acc, r) => acc + r.tasks.filter(t => t.status === 'completed').length, 
    0
  );
  const inProgressTasks = displayedRequests.reduce(
    (acc, r) => acc + r.tasks.filter(t => t.status === 'in_progress').length, 
    0
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'مكتمل بالكامل', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'in_progress':
        return { label: 'قيد التنفيذ والتجهيز', badge: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'submitted':
        return { label: 'تم التوجيه للموظفين', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'rejected':
        return { label: 'معتذر عنه', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: 'جديد', badge: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const getTaskStatusChip = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> تم الإنجاز</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"><Clock3 className="w-3 h-3" /> جارٍ العمل</span>;
      case 'needs_info':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"><AlertCircle className="w-3 h-3" /> مطلوب تفاصيل</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">معتذر</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">قيد المراجعة</span>;
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bus': return <Bus className="w-4 h-4" />;
      case 'Armchair': return <Armchair className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'DoorOpen': return <DoorOpen className="w-4 h-4" />;
      case 'Megaphone': return <Megaphone className="w-4 h-4" />;
      case 'Printer': return <Printer className="w-4 h-4" />;
      case 'Camera': return <Camera className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Club Hero Action Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منظومة الخدمات اللوجستية للأندية الطلابية</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold font-['Tajawal',sans-serif] tracking-tight">
              أهلاً بك، رئيس {activeClubName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              يمكنك تقديم طلب متكامل لفعاليتك أو طلب خدمة محددة، وسيقوم النظام تلقائياً بتوزيع المهام إلى الموظفين المسؤولين (أ. حسين رمضان، أ. موسى آل سنان، أ. مصلح الشمراني) لمتابعتها ومعالجتها فورياً.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              id="btn-hero-new-request"
              onClick={onOpenNewWizard}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ring-2 ring-emerald-400/30"
            >
              <Plus className="w-5 h-5" />
              <span>تقديم طلب فعالية متكاملة</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs font-medium block">إجمالي طلبات الفعاليات</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block font-['Tajawal',sans-serif]">
              {displayedRequests.length}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs font-medium block">إجمالي المهام الموجهة</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block font-['Tajawal',sans-serif]">
              {totalTasks}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs font-medium block">مهام قيد التجهيز</span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block font-['Tajawal',sans-serif]">
              {inProgressTasks}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs font-medium block">مهام منجزة بنجاح</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block font-['Tajawal',sans-serif]">
              {completedTasks}
            </span>
          </div>
        </div>
      </div>

      {/* Revisions Needed Alert Banner */}
      {displayedRequests.some(r => r.supervisorStatus === 'needs_info') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              ⚠️
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 font-['Tajawal',sans-serif]">
                تنبيه: لديك {displayedRequests.filter(r => r.supervisorStatus === 'needs_info').length} طلب فعالية يتطلب تعديلات وملاحظات من المشرف الأكاديمي
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                قام مشرف النادي بمراجعة الطلب وطلب بعض التعديلات أو الاستفسارات الإضافية. يمكنك تعديل الطلب واستيفاء المطلوب وإعادة إرساله فوراً.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
            <button
              onClick={() => {
                const target = displayedRequests.find(r => r.supervisorStatus === 'needs_info');
                if (target) {
                  setEditingRequest(target);
                  setIsEditRequestModalOpen(true);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل الطلب واستيفاء الملاحظات</span>
            </button>
            <button
              onClick={() => setFilterStatus('needs_info')}
              className="px-3.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
            >
              عرض القائمة
            </button>
          </div>
        </div>
      )}

      {/* Fast Service Launchers Grid (Catalog of Services by Staff) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Tajawal',sans-serif]">
              الخدمات المباشرة السريعة
            </h3>
            <p className="text-xs text-slate-500">
              انقر على أي خدمة لطلبها مباشرة وتوجيهها للموظف المسؤول، أو عدّل مسمياتها
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            توجيه آلي مباشر
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {services.map(srv => {
            const staff = staffMembers.find(sm => sm.id === srv.staffId) || STAFF_MEMBERS.find(sm => sm.id === srv.staffId);
            const dept = DEPARTMENTS[srv.departmentId];

            return (
              <div
                key={srv.id}
                onClick={() => onOpenQuickService(srv.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-right group cursor-pointer flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                      {getServiceIcon(srv.iconName)}
                    </div>
                    
                    {/* Quick Edit Title Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingServiceForTitle(srv);
                      }}
                      title="تعديل عنوان ومسمى الخدمة"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 opacity-70 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {srv.name}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-600">المسؤول: {staff?.shortName}</span>
                  <span className="text-emerald-600 font-bold group-hover:translate-x-[-2px] transition-transform">طلب ➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requests & Dispatched Tasks Stream */}
      <div className="space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              سجل طلبات الفعاليات وتتبع المهام ({filteredRequests.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="بحث في الطلبات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 w-44"
            />

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="submitted">تم التوجيه</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>

        {/* Requests List with Collapsible Task Tree */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">لا توجد طلبات تطابق هذا البحث</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              يمكنك إنشاء طلب جديد الآن ليتم توجيه جميع المهام اللوجستية والأمنية والإعلامية آلياً
            </p>
            <button
              onClick={onOpenNewWizard}
              className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تقديم طلب فعالية الآن</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(req => {
              const isExpanded = expandedRequestId === req.id;
              const statusInfo = getStatusBadge(req.status);
              const completedCount = req.tasks.filter(t => t.status === 'completed').length;
              const progressPct = req.tasks.length > 0 ? Math.round((completedCount / req.tasks.length) * 100) : 0;

              return (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Request Header Bar */}
                  <div className="p-5 sm:p-6 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Building2 className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {req.requestNumber}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 font-['Tajawal',sans-serif]">
                            {req.eventTitle}
                          </h4>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.badge}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            🎓 {req.clubName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {req.eventDate} ({req.startTime} - {req.endTime})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {req.expectedAttendees} مشارك
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Actions */}
                    <div className="flex items-center gap-4 self-end lg:self-center">
                      
                      {/* Task Progress Meter */}
                      <div className="text-left w-36 hidden sm:block">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>إنجاز المهام</span>
                          <span className="font-bold text-slate-900">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {completedCount} من {req.tasks.length} مهام منجزة
                        </span>
                      </div>

                      {/* Detail View CTA */}
                      <button
                        onClick={() => onOpenRequestDetails(req.id)}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>التقرير والطباعة</span>
                      </button>

                      {/* Edit Request Button (Available for Pending & Needs Info) */}
                      {(req.supervisorStatus === 'needs_info' || req.supervisorStatus === 'pending' || req.status === 'pending_supervisor') && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRequest(req);
                            setIsEditRequestModalOpen(true);
                          }}
                          className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          title="تعديل بيانات الفعالية والخدمات"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span className="hidden sm:inline">تعديل الطلب</span>
                        </button>
                      )}

                      {/* Delete / Cancel Request Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingTarget({ request: req })}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                        title="حذف أو إلغاء هذا الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Expand / Collapse Tree Toggle */}
                      <button
                        onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="عرض المهام الموجهة"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                  </div>

                  {/* Supervisor Review & Revision Notes Banner if Applicable */}
                  {req.supervisorStatus === 'needs_info' && (
                    <div className="mx-5 sm:mx-6 mb-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                          ⚠️
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                              مطلوب تعديلات قبل الاعتماد
                            </span>
                            <span className="text-xs font-bold text-amber-800">
                              مشرف النادي: {req.supervisorName || 'المشرف الأكاديمي'}
                            </span>
                          </div>
                          <p className="text-xs text-amber-900 font-semibold mt-1.5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200">
                            📝 <strong>ملاحظات المشرف:</strong> {req.supervisorNotes || 'يرجى مراجعة تفاصيل الفعالية وتزويدنا بالمعلومات الناقصة.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                        <button
                          onClick={() => {
                            setEditingRequest(req);
                            setIsEditRequestModalOpen(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل الطلب وإعادة الإرسال</span>
                        </button>
                        <button
                          onClick={() => onOpenRequestDetails(req.id)}
                          className="px-3.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  )}

                  {req.supervisorStatus === 'approved' && (
                    <div className="mx-5 sm:mx-6 mb-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                      <span className="text-emerald-600">✅</span>
                      <span>تم اعتماد الفعالية من المشرف الأكاديمي ({req.supervisorName}) وتم توجيه المهام للموظفين التنفيذيين.</span>
                    </div>
                  )}

                  {req.status === 'pending_supervisor' && (
                    <div className="mx-5 sm:mx-6 mb-2 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-2">
                      <span className="text-amber-600">⏳</span>
                      <span>الطلب حالياً في مرحلة المراجعة والاعتماد لدى المشرف الأكاديمي ({req.supervisorName}).</span>
                    </div>
                  )}

                  {/* Expandable Task Breakdown (Subtasks Tree) */}
                  {isExpanded && (
                    <div className="bg-slate-50/90 border-t border-slate-200/80 p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>المهام الموجهة آلياً للموظفين ({req.tasks.length} مهام):</span>
                        </h5>
                        <span className="text-[11px] text-slate-500">
                          يتم تحديث الحالة فور اتخاذ الموظف لأي إجراء
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {req.tasks.map(task => {
                          const staff = staffMembers.find(s => s.id === task.staffId) || STAFF_MEMBERS.find(s => s.id === task.staffId);
                          const dept = DEPARTMENTS[task.departmentId];

                          return (
                            <div
                              key={task.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h6 className="text-xs font-bold text-slate-900">{task.serviceName}</h6>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold mt-1 inline-block ${dept?.badgeBg}`}>
                                      {dept?.name}
                                    </span>
                                  </div>
                                  <div>
                                    {getTaskStatusChip(task.status)}
                                  </div>
                                </div>

                                {/* Staff Assignee Info */}
                                <div className="mt-3 p-2 bg-slate-50 rounded-lg flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                                      👔
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-800">{staff?.shortName}</span>
                                      <span className="text-slate-400 block text-[10px]">{staff?.office}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 text-slate-500">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{staff?.phone}</span>
                                  </div>
                                </div>

                                {/* Comments / Notes snippet if any */}
                                {task.comments && task.comments.length > 0 && (
                                  <div className="mt-2 text-[11px] text-slate-600 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                                    <span className="font-bold text-emerald-900 block mb-0.5">آخر ملاحظة من {task.comments[task.comments.length - 1].authorName}:</span>
                                    {task.comments[task.comments.length - 1].message}
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                <span>رقم المهمة: {task.id}</span>
                                <button
                                  onClick={() => onOpenRequestDetails(req.id)}
                                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                                >
                                  مراسلة وتفاصيل ➔
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      <EditServiceTitleModal
        isOpen={Boolean(editingServiceForTitle)}
        service={editingServiceForTitle}
        onClose={() => setEditingServiceForTitle(null)}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deletingTarget)}
        task={deletingTarget?.task}
        request={deletingTarget?.request}
        onClose={() => setDeletingTarget(null)}
        onConfirmDeleteTask={(taskId) => {
          deleteTask(taskId);
        }}
        onConfirmDeleteRequest={(reqId) => {
          deleteRequest(reqId);
        }}
      />

    </div>
  );
};
