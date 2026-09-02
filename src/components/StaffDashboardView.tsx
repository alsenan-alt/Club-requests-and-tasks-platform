import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  XCircle, 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  Filter, 
  Calendar, 
  Sparkles, 
  Building2, 
  User, 
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
  ChevronDown,
  ChevronUp,
  FileText,
  Trash2,
  Globe,
  ExternalLink,
  Link2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/initialData';
import { Task, TaskStatus, StaffMember, ClubRequest } from '../types';
import { StaffServicesCatalogManager } from './StaffServicesCatalogManager';
import { TaskRequirementsViewer } from './TaskRequirementsViewer';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface Props {
  staff: StaffMember;
  onOpenRequestDetails: (requestId: string) => void;
}

export const StaffDashboardView: React.FC<Props> = ({ staff: propStaff, onOpenRequestDetails }) => {
  const { 
    requests, 
    updateTaskStatus, 
    addTaskComment,
    updateTaskExternalUrl,
    deleteTask,
    deleteRequest,
    currentStaff,
    userAccounts
  } = useApp();

  const staff = currentStaff || propStaff;

  const [activeMainTab, setActiveMainTab] = useState<'all_view' | 'services_config' | 'tasks_board'>('all_view');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeCommentTaskId, setActiveCommentTaskId] = useState<string | null>(null);
  const [activeUrlTaskId, setActiveUrlTaskId] = useState<string | null>(null);
  const [urlInputText, setUrlInputText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTarget, setDeletingTarget] = useState<{ task: Task; request: ClubRequest } | null>(null);

  // Extract all tasks belonging to this staff member
  const allStaffTasks: { task: Task; request: any }[] = [];
  requests.forEach(req => {
    req.tasks.forEach(task => {
      if (task.staffId === staff.id) {
        allStaffTasks.push({ task, request: req });
      }
    });
  });

  // Filter tasks
  const filteredTasks = allStaffTasks.filter(({ task, request }) => {
    if (selectedDeptFilter !== 'all' && task.departmentId !== selectedDeptFilter) return false;
    if (selectedStatusFilter !== 'all' && task.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.serviceName.toLowerCase().includes(q) ||
        request.clubName.toLowerCase().includes(q) ||
        request.eventTitle.toLowerCase().includes(q) ||
        request.requestNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = allStaffTasks.filter(t => t.task.status === 'pending').length;
  const inProgressCount = allStaffTasks.filter(t => t.task.status === 'in_progress').length;
  const completedCount = allStaffTasks.filter(t => t.task.status === 'completed').length;

  const handleSendComment = (taskId: string) => {
    if (!commentText.trim()) return;
    addTaskComment(taskId, commentText);
    setCommentText('');
    setActiveCommentTaskId(null);
  };

  const handleOpenUrlInput = (taskId: string, currentUrl?: string) => {
    if (activeUrlTaskId === taskId) {
      setActiveUrlTaskId(null);
    } else {
      setActiveUrlTaskId(taskId);
      setUrlInputText(currentUrl || '');
      setActiveCommentTaskId(null);
    }
  };

  const handleSaveUrl = (taskId: string) => {
    updateTaskExternalUrl(taskId, urlInputText);
    setActiveUrlTaskId(null);
    setUrlInputText('');
  };

  const getServiceIcon = (deptId: string) => {
    switch (deptId) {
      case 'transport': return <Bus className="w-5 h-5 text-blue-600" />;
      case 'housing_services': return <Armchair className="w-5 h-5 text-indigo-600" />;
      case 'electrical': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'it': return <Laptop className="w-5 h-5 text-cyan-600" />;
      case 'events_buildings': return <Building2 className="w-5 h-5 text-sky-600" />;
      case 'halls_venues': return <DoorOpen className="w-5 h-5 text-emerald-600" />;
      case 'announcements': return <Megaphone className="w-5 h-5 text-teal-600" />;
      case 'printing': return <Printer className="w-5 h-5 text-purple-600" />;
      case 'pr_media': return <Camera className="w-5 h-5 text-rose-600" />;
      case 'security': return <ShieldCheck className="w-5 h-5 text-orange-600" />;
      case 'catering': return <Utensils className="w-5 h-5 text-yellow-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Staff Profile & Duty Summary Banner */}
      <div className={`bg-gradient-to-br ${staff.avatarBg} text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/20 shadow-inner">
              👔
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-2 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>لوحة متابعة ومعالجة المهام الموجهة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Tajawal',sans-serif]">
                {staff.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                {staff.title} • {staff.office}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold">{staff.phone}</span>
            </div>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-cyan-300" />
              <span>{staff.email}</span>
            </div>
          </div>
        </div>

        {/* Managed Departments Tags */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <span className="text-xs font-bold text-white/70 block mb-2">الأقسام والخدمات التابعة لك:</span>
          <div className="flex flex-wrap gap-2">
            {staff.departmentIds.map(dId => {
              const dept = DEPARTMENTS[dId];
              return (
                <span key={dId} className="px-3 py-1 bg-white/15 backdrop-blur-xs text-white rounded-xl text-xs font-semibold border border-white/20 flex items-center gap-1.5">
                  <span>{dept?.name}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-white/70 text-xs font-medium block">إجمالي المهام الموجهة</span>
            <span className="text-2xl font-black text-white mt-1 block font-['Tajawal',sans-serif]">
              {allStaffTasks.length}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-white/70 text-xs font-medium block">مهام جديدة بانتظار البدء</span>
            <span className="text-2xl font-black text-amber-300 mt-1 block font-['Tajawal',sans-serif]">
              {pendingCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-white/70 text-xs font-medium block">قيد التجهيز والتنفيذ</span>
            <span className="text-2xl font-black text-cyan-300 mt-1 block font-['Tajawal',sans-serif]">
              {inProgressCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <span className="text-white/70 text-xs font-medium block">تم إنجازها بنجاح</span>
            <span className="text-2xl font-black text-emerald-300 mt-1 block font-['Tajawal',sans-serif]">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setActiveMainTab('all_view')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'all_view'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>عرض شامل (تهيئة الخدمات + لوحة الطلبات)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('services_config')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'services_config'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>استعراض وتهيئة الخدمات الموكلة والتفاصيل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tasks_board')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'tasks_board'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>لوحة معالجة المهام والطلبات ({allStaffTasks.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Staff Services & Requirements Configuration (BEFORE operations board) */}
      {(activeMainTab === 'all_view' || activeMainTab === 'services_config') && (
        <section className="space-y-4">
          <StaffServicesCatalogManager staff={staff} />
        </section>
      )}

      {/* SECTION 2: Operations Board & Tasks Management */}
      {(activeMainTab === 'all_view' || activeMainTab === 'tasks_board') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Tajawal',sans-serif]">
                لوحة العمليات ومعالجة طلبات الفعاليات
              </h3>
              <p className="text-xs text-slate-500">
                متابعة المهام المسندة إليك من الأندية الطلابية، وتحديث حالات التنفيذ والتواصل
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {filteredTasks.length} مهام معروضة
            </span>
          </div>

          {/* Task Filters & Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Department Tab Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedDeptFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                كافة الأقسام ({allStaffTasks.length})
              </button>

              {staff.departmentIds.map(deptId => {
                const dept = DEPARTMENTS[deptId];
                const count = allStaffTasks.filter(t => t.task.departmentId === deptId).length;

                return (
                  <button
                    key={deptId}
                    onClick={() => setSelectedDeptFilter(deptId)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedDeptFilter === deptId
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{dept?.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-black/10 rounded-full">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Status Filter & Search */}
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder="بحث في المهام..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 w-40 sm:w-48"
              />

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">كافة الحالات</option>
                <option value="pending">جديد بانتظار البدء</option>
                <option value="in_progress">قيد التنفيذ والتجهيز</option>
                <option value="completed">تم الإنجاز بنجاح</option>
                <option value="rejected">معتذر عنه / مرفوض</option>
              </select>
            </div>
          </div>

          {/* Task Cards Matrix */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800">لا توجد مهام معلقة في هذا القسم</h4>
          <p className="text-xs text-slate-500 mt-1">
            جميع الطلبات المعنية تم إنجازها بنجاح أو لم يتم تقديم طلبات جديدة بعد
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(({ task, request }) => {
            const dept = DEPARTMENTS[task.departmentId];
            const isCommenting = activeCommentTaskId === task.id;
            const isAddingUrl = activeUrlTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Task Item Top Bar */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      {getServiceIcon(task.departmentId)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {task.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 font-['Tajawal',sans-serif]">
                          {task.serviceName}
                        </h3>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${dept?.badgeBg}`}>
                          {dept?.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : task.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          أولوية {task.priority === 'urgent' ? 'عاجلة جداً' : task.priority === 'high' ? 'عالية' : 'عادية'}
                        </span>
                      </div>

                      {/* Parent Request & Club details */}
                      <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                        <span className="font-bold text-slate-900">
                          🎓 {request.clubName}
                        </span>
                        <span className="text-slate-500">
                          الفعالية: <strong>{request.eventTitle}</strong> ({request.requestNumber})
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {request.eventDate} ({request.startTime} - {request.endTime})
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          المسؤول: {(() => {
                            const clubAcc = userAccounts.find(u => u.clubName === request.clubName);
                            const name = request.presidentName || clubAcc?.name || 'المسؤول';
                            const phone = request.presidentPhone || clubAcc?.phone || '';
                            return phone ? `${name} (${phone})` : name;
                          })()}
                        </span>
                      </div>

                      {/* Service Details & Requirements Viewer */}
                      <div className="mt-4">
                        <TaskRequirementsViewer 
                          task={task} 
                          requestTitle={request.eventTitle}
                          clubName={request.clubName}
                          eventDate={request.eventDate}
                          eventTime={`${request.startTime} - ${request.endTime}`}
                          location={request.locationSummary || request.location}
                          requestId={request.requestNumber}
                          supervisorName={task.staffName}
                        />
                      </div>

                      {/* Comments & Communication Thread */}
                      {task.comments && task.comments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 block">سجل الملاحظات والتواصل:</span>
                          {task.comments.map(c => (
                            <div key={c.id} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                <span className="font-bold text-emerald-900">{c.authorName}</span>
                                <span>{new Date(c.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-800 font-medium">{c.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input Box */}
                      {isCommenting && (
                        <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-xl space-y-2">
                          <textarea
                            rows={2}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="اكتب ملاحظة أو توجيه لرئيس النادي..."
                            className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveCommentTaskId(null)}
                              className="px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => handleSendComment(task.id)}
                              className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>إرسال الملاحظة</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add / Edit External URL Input Box */}
                      {isAddingUrl && (
                        <div className="mt-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2.5 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                              <Globe className="w-4 h-4 text-blue-600" />
                              <span>إرفاق رابط خارجي / موقع إلكتروني للمشرف ورئيس النادي:</span>
                            </div>
                            {task.externalUrl && (
                              <span className="text-[10px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-bold">
                                يوجد رابط حالي
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <Link2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <input
                              type="url"
                              value={urlInputText}
                              onChange={e => setUrlInputText(e.target.value)}
                              placeholder="https://drive.google.com/... أو https://example.com"
                              dir="ltr"
                              className="w-full text-xs p-2.5 pr-9 rounded-lg bg-white border border-blue-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-left"
                              autoFocus
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            {task.externalUrl ? (
                              <button
                                type="button"
                                onClick={() => {
                                  updateTaskExternalUrl(task.id, '');
                                  setActiveUrlTaskId(null);
                                  setUrlInputText('');
                                }}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>إزالة الرابط المرفق</span>
                              </button>
                            ) : <div />}

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveUrlTaskId(null)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                              >
                                إلغاء
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveUrl(task.id)}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>حفظ الرابط</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Task Status Controls & Action Buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    
                    {/* Status Indicator */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block mb-1">الحالة الحالية:</span>
                      {task.status === 'completed' && (
                        <span className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-xl inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>تم الإنجاز بنجاح</span>
                        </span>
                      )}
                      {task.status === 'in_progress' && (
                        <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 rounded-xl inline-flex items-center gap-1.5">
                          <Clock3 className="w-4 h-4 text-blue-600 animate-spin" />
                          <span>جارٍ التجهيز والعمل</span>
                        </span>
                      )}
                      {task.status === 'pending' && (
                        <span className="px-3 py-1 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-xl inline-flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>جديدة بانتظار الإجراء</span>
                        </span>
                      )}
                      {task.status === 'rejected' && (
                        <span className="px-3 py-1 text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 rounded-xl inline-flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>اعتذار</span>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {task.status !== 'in_progress' && task.status !== 'completed' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress', 'تم قبول المهمة وبدء التجهيز')}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>بدء التجهيز</span>
                        </button>
                      )}

                      {task.status !== 'completed' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed', 'تم استكمال وتجهيز كافة المتطلبات بنجاح')}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اعتماد الإنجاز</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenUrlInput(task.id, task.externalUrl)}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer border ${
                          task.externalUrl
                            ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-300 shadow-2xs'
                            : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100 border-slate-200'
                        }`}
                        title={task.externalUrl ? 'تعديل أو استعراض رابط الصفحة الخارجية' : 'إرفاق رابط خارجي / موقع للمهمة'}
                      >
                        <Globe className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveCommentTaskId(isCommenting ? null : task.id)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                        title="إضافة ملاحظة للرئيس"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenRequestDetails(request.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                        title="استعراض تفاصيل الطلب الكامل"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Delete Task or Request Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingTarget({ task, request })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                        title="حذف المهمة أو الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      </section>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingTarget)}
        task={deletingTarget?.task}
        request={deletingTarget?.request}
        onClose={() => setDeletingTarget(null)}
        onConfirmDeleteTask={(taskId) => {
          deleteTask(taskId);
        }}
        onConfirmDeleteRequest={(requestId) => {
          deleteRequest(requestId);
        }}
      />

    </div>
  );
};
