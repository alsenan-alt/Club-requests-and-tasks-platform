import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  XCircle, 
  Send, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  FileText,
  Trash2,
  Edit3
} from 'lucide-react';
import { useApp, isTaskAssignedToStaff } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { Task, TaskStatus } from '../types';
import { TaskRequirementsViewer } from './TaskRequirementsViewer';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface Props {
  requestId: string | null;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<Props> = ({ requestId, onClose }) => {
  const { 
    requests, 
    currentRole, 
    currentStaff, 
    currentUser,
    updateTaskStatus, 
    addTaskComment,
    deleteTask,
    deleteRequest,
    staffMembers,
    userAccounts,
    setEditingRequest,
    setIsEditRequestModalOpen,
    openEmailPreviewForRequest,
    resendSupervisorEmail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'print_form'>('overview');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [deletingTarget, setDeletingTarget] = useState<{ task?: Task; request: any } | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  const request = requests.find(r => r.id === requestId);

  if (!requestId || !request) return null;

  const completedCount = request.tasks.filter(t => t.status === 'completed').length;
  const progressPct = request.tasks.length > 0 ? Math.round((completedCount / request.tasks.length) * 100) : 0;

  const handleSendTaskComment = (taskId: string) => {
    const text = commentInputs[taskId];
    if (!text || !text.trim()) return;
    addTaskComment(taskId, text);
    setCommentInputs(prev => ({ ...prev, [taskId]: '' }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-emerald-900/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                {request.requestNumber}
              </span>
              <span className="text-xs text-slate-300">
                تاريخ التقديم: {new Date(request.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Tajawal',sans-serif]">
              {request.eventTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              مقدم من: <strong className="text-white">{request.clubName}</strong> • المسؤول: {request.presidentName} ({request.presidentPhone})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(currentRole === 'club_president' || currentRole === 'admin') && (request.supervisorStatus === 'needs_info' || request.supervisorStatus === 'pending' || request.status === 'pending_supervisor') && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setEditingRequest(request);
                  setIsEditRequestModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="تعديل تفاصيل الفعالية وإعادة إرسالها"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل الطلب</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab(activeTab === 'overview' ? 'print_form' : 'overview')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{activeTab === 'overview' ? 'عرض نموذج الطباعة الرسمي' : 'العودة للمتابعة التفاعلية'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* TAB 1: Interactive Breakdown & Tasks Chat */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Approval Lifecycle Stepper (President -> Supervisor -> Staff -> Execution) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>دورة الاعتماد والتوجيه التنفيذي للفعالية:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {/* Step 1: President Submission */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                      <strong className="text-emerald-900">رئيس النادي</strong>
                    </div>
                    <span className="text-[11px] text-emerald-800 block">تم تقديم الطلب بنجاح</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{request.presidentName || request.clubName}</span>
                  </div>

                  {/* Step 2: Academic Supervisor Review */}
                  <div className={`p-3.5 rounded-xl border ${
                    request.supervisorStatus === 'approved' 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : request.supervisorStatus === 'needs_info'
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                      : request.supervisorStatus === 'rejected'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                        request.supervisorStatus === 'approved' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-900'
                      }`}>2</span>
                      <strong className={request.supervisorStatus === 'approved' ? 'text-emerald-900' : 'text-amber-900'}>مشرف النادي</strong>
                    </div>
                    <span className="text-[11px] font-bold block">
                      {request.supervisorStatus === 'approved' && '✅ معتمد وموافق عليه'}
                      {request.supervisorStatus === 'needs_info' && '⚠️ مطلوب تعديلات وإيضاح'}
                      {request.supervisorStatus === 'rejected' && '❌ معتذر عنه'}
                      {(!request.supervisorStatus || request.supervisorStatus === 'pending') && '⏳ قيد المراجعة والاعتماد'}
                    </span>
                    <span className="text-[10px] text-slate-600 block truncate">
                      {request.supervisorName || 'المشرف الأكاديمي'}
                    </span>
                  </div>

                  {/* Step 3: Staff Assignment */}
                  <div className={`p-3.5 rounded-xl border ${
                    request.status === 'in_progress' || request.status === 'completed' || request.status === 'submitted'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                      <strong className="text-blue-900">الموظفون التنفيذيون</strong>
                    </div>
                    <span className="text-[11px] text-blue-800 block">توجيه {request.tasks.length} مهام ميدانية</span>
                    <span className="text-[10px] text-slate-500">أ. حسين • أ. موسى • أ. مصلح</span>
                  </div>

                  {/* Step 4: Completion */}
                  <div className={`p-3.5 rounded-xl border ${
                    progressPct === 100
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                        progressPct === 100 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>4</span>
                      <strong className="text-slate-800">اكتمال الفعالية</strong>
                    </div>
                    <span className="text-[11px] block">{progressPct}% مكتمل</span>
                    <span className="text-[10px] text-slate-500">{completedCount} من {request.tasks.length} مهام</span>
                  </div>
                </div>
              </div>

              {/* Supervisor Automated Email Notification Card */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-emerald-800 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold border border-emerald-400/30 shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          إشعار بريد إلكتروني رسمي (KFUPM Mail)
                        </span>
                        <span className="text-[11px] text-emerald-400/80 font-medium">
                          {request.supervisorEmailSent ? '✅ تم إرسال الإشعار آلياً' : '⏳ جاري التوجيه'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        إشعار المشرف الأكاديمي: {request.supervisorName || 'المشرف الأكاديمي'} ({request.supervisorEmail || 'club.supervisor@kfupm.edu.sa'})
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        تم إرسال تفاصيل الفعالية ورابط الاعتماد المباشر فور رفع رئيس النادي للطلب.
                      </p>
                      {emailStatusMsg && (
                        <p className="text-xs text-amber-300 mt-1 font-semibold animate-pulse">
                          {emailStatusMsg}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => openEmailPreviewForRequest(request.id)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>معاينة البريد</span>
                    </button>

                    <button
                      type="button"
                      disabled={isResendingEmail}
                      onClick={async () => {
                        setIsResendingEmail(true);
                        setEmailStatusMsg('جاري إعادة إرسال البريد الإلكتروني...');
                        const res = await resendSupervisorEmail(request.id);
                        setIsResendingEmail(false);
                        setEmailStatusMsg(res.message);
                        setTimeout(() => setEmailStatusMsg(null), 5000);
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="إعادة إرسال البريد الإلكتروني للمشرف"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isResendingEmail ? 'جاري الإرسال...' : 'إعادة إرسال'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Supervisor Notes Box if notes or revision requested */}
              {(request.supervisorNotes || request.supervisorStatus === 'needs_info') && (
                <div className={`p-4 sm:p-5 rounded-2xl border-2 ${
                  request.supervisorStatus === 'needs_info'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      📝
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-slate-900 font-['Tajawal',sans-serif]">
                          توجيهات وملاحظات مشرف النادي ({request.supervisorName || 'المشرف الأكاديمي'})
                        </h4>
                        {request.supervisorDecisionDate && (
                          <span className="text-[11px] text-slate-500">
                            تاريخ المراجعة: {new Date(request.supervisorDecisionDate).toLocaleDateString('ar-SA')}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 p-3 rounded-xl bg-white border border-amber-200 text-xs font-semibold leading-relaxed text-slate-800">
                        {request.supervisorNotes || 'لا توجد ملاحظات إضافية مكتوبة.'}
                      </div>
                      
                      {(currentRole === 'club_president' || currentRole === 'admin') && request.supervisorStatus === 'needs_info' && (
                        <div className="mt-3 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              setEditingRequest(request);
                              setIsEditRequestModalOpen(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل بيانات الفعالية والخدمات وإعادة الإرسال للمشرف الأكاديمي</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* President's Resubmission Response Card */}
              {(request.isResubmitted || request.presidentReplyNotes) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/70 to-purple-50/50 border-2 border-purple-200 text-purple-950 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      💬
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-purple-950 font-['Tajawal',sans-serif]">
                            إفادة ورد رئيس النادي على التعديلات المستوفاة
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold">
                            طلب معدل 🔄
                          </span>
                        </div>
                        {request.lastResubmittedAt && (
                          <span className="text-[11px] text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md font-semibold">
                            تاريخ التعديل: {new Date(request.lastResubmittedAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                      </div>

                      {request.presidentReplyNotes ? (
                        <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs font-bold leading-relaxed text-purple-950 shadow-xs">
                          {request.presidentReplyNotes}
                        </div>
                      ) : (
                        <p className="text-xs text-purple-900 font-semibold italic bg-white/70 p-2.5 rounded-xl border border-purple-200">
                          قام رئيس النادي بتحديث وتعديل بيانات الفعالية والمهام اللوجستية المطلوبة وفق توجيهات المشرف الأكاديمي.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Event Quick Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاريخ ووقت الفعالية:</span>
                    <span className="font-bold text-slate-800">{request.eventDate} ({request.startTime} - {request.endTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المقر المقترح:</span>
                    <span className="font-bold text-slate-800">{request.locationSummary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">العدد المتوقع:</span>
                    <span className="font-bold text-slate-800">{request.expectedAttendees} مشارك</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">نسبة استكمال المهام:</span>
                    <span className="font-bold text-emerald-600">{progressPct}% ({completedCount} من {request.tasks.length})</span>
                  </div>
                </div>

                {request.description && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-800 block mb-1">وصف الفعالية والأهداف:</strong>
                    <p className="leading-relaxed">{request.description}</p>
                  </div>
                )}
              </div>

              {/* Routed Tasks Detail Matrix */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>المهام الموزعة وحالة الإنجاز ({request.tasks.length} مهام):</span>
                </h3>

                <div className="space-y-3">
                  {request.tasks.map(task => {
                    const staff = staffMembers.find(s => s.id === task.staffId) || STAFF_MEMBERS.find(s => s.id === task.staffId);
                    const dept = DEPARTMENTS[task.departmentId];
                    const isAssignee = isTaskAssignedToStaff(task, currentStaff, currentUser);

                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                      >
                        {/* Task Top Row */}
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {task.id}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">{task.serviceName}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept?.badgeBg}`}>
                                {dept?.name}
                              </span>
                            </div>

                            <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                              <span>الموظف المعني: <strong className="text-slate-800">{staff?.shortName}</strong></span>
                              <span>•</span>
                              <span>هاتف: {staff?.phone}</span>
                              <span>•</span>
                              <span>مكتب: {staff?.office}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {task.status === 'completed' && (
                              <span className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl border border-emerald-300 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>تم الإنجاز</span>
                              </span>
                            )}
                            {task.status === 'in_progress' && (
                              <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-xl border border-blue-300 inline-flex items-center gap-1">
                                <Clock3 className="w-3.5 h-3.5 text-blue-600" />
                                <span>قيد التجهيز</span>
                              </span>
                            )}
                            {task.status === 'pending' && (
                              <span className="px-3 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-xl border border-amber-300 inline-flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>بانتظار البدء</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Task Form Parameters & Details Viewer */}
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

                        {/* Action buttons if current user is assignee or admin */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                          {(isAssignee || currentRole === 'admin') && task.status !== 'completed' ? (
                            <div className="flex items-center gap-2">
                              {request.supervisorStatus !== 'approved' && currentRole !== 'admin' ? (
                                <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>بانتظار موافقة المشرف الأكاديمي أولاً للبدء بالتنفيذ</span>
                                </div>
                              ) : (
                                <>
                                  <span className="text-xs font-bold text-slate-600">إجراءات الموظف:</span>
                                  {task.status === 'pending' && (
                                    <button
                                      onClick={() => updateTaskStatus(task.id, 'in_progress', 'تم بدء العمل على التجهيزات')}
                                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                    >
                                      بدء التجهيز
                                    </button>
                                  )}
                                  <button
                                    onClick={() => updateTaskStatus(task.id, 'completed', 'تم إنجاز وتأكيد الخدمة بالكامل')}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                  >
                                    اعتماد الإنجاز
                                  </button>
                                </>
                              )}
                            </div>
                          ) : <div />}

                          {/* Delete Task Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingTarget({ task, request })}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 flex items-center gap-1.5 cursor-pointer ml-auto"
                            title="حذف هذه المهمة المحددة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف المهمة</span>
                          </button>
                        </div>

                        {/* Task Comments Section */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {task.comments && task.comments.map(c => (
                            <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 text-xs border border-slate-200">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                <span className="font-bold text-slate-800">{c.authorName}</span>
                                <span>{new Date(c.timestamp).toLocaleTimeString('ar-SA')}</span>
                              </div>
                              <p className="text-slate-700">{c.message}</p>
                            </div>
                          ))}

                          {/* Add comment field */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={commentInputs[task.id] || ''}
                              onChange={e => setCommentInputs({ ...commentInputs, [task.id]: e.target.value })}
                              placeholder="أضف ملاحظة أو استفسار حول هذه المهمة..."
                              className="flex-1 text-xs p-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            />
                            <button
                              onClick={() => handleSendTaskComment(task.id)}
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>إرسال</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Official Printable Requisition Document */}
          {activeTab === 'print_form' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-md text-slate-900 font-serif print:m-0 print:border-none print:shadow-none">
              
              {/* Document Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-black font-['Tajawal',sans-serif]">عمادة شؤون الطلاب • إدارة النشاط الطلابي</h2>
                  <p className="text-xs text-slate-600">نموذج طلب خدمة وتوجيه لوجستي معتمد لفعاليات الأندية</p>
                </div>
                <div className="text-left">
                  <div className="font-mono text-sm font-bold text-slate-900">{request.requestNumber}</div>
                  <div className="text-[11px] text-slate-500">{new Date(request.createdAt).toLocaleDateString('ar-SA')}</div>
                </div>
              </div>

              {/* Request Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-4 rounded-lg mb-6">
                <div><strong>النادي الطلابي:</strong> {request.clubName}</div>
                <div>
                  <strong>رئيس النادي:</strong> {(() => {
                    const clubAcc = userAccounts.find(u => u.clubName === request.clubName);
                    const name = request.presidentName || clubAcc?.name || 'غير مسجل';
                    const phone = request.presidentPhone || clubAcc?.phone || '';
                    return phone ? `${name} (${phone})` : name;
                  })()}
                </div>
                <div><strong>عنوان الفعالية:</strong> {request.eventTitle}</div>
                <div><strong>تاريخ وتوقيت الفعالية:</strong> {request.eventDate} ({request.startTime} - {request.endTime})</div>
                <div className="col-span-2"><strong>المقر المعتمد:</strong> {request.locationSummary}</div>
              </div>

              {/* Tasks Breakdown Table */}
              <div className="mb-6">
                <h4 className="text-xs font-bold mb-2">جدول المهام والتوجيه المعتمد:</h4>
                <table className="w-full text-right text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border-l border-slate-300">م</th>
                      <th className="p-2 border-l border-slate-300">الخدمة المطلوبة</th>
                      <th className="p-2 border-l border-slate-300">القسم المعني</th>
                      <th className="p-2 border-l border-slate-300">الموظف المسؤول</th>
                      <th className="p-2">الحالة والإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {request.tasks.map((task, idx) => (
                      <tr key={task.id}>
                        <td className="p-2 border-l border-slate-300 font-bold">{idx + 1}</td>
                        <td className="p-2 border-l border-slate-300 font-medium">{task.serviceName}</td>
                        <td className="p-2 border-l border-slate-300">{task.departmentName}</td>
                        <td className="p-2 border-l border-slate-300 font-bold">{task.staffName}</td>
                        <td className="p-2 font-bold text-emerald-800">
                          {task.status === 'completed' ? '✓ تم الإنجاز' : task.status === 'in_progress' ? 'جارٍ التجهيز' : 'قيد المراجعة'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Signature Boxes */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300 text-center text-xs">
                <div>
                  <p className="font-bold text-slate-800 mb-8">رئيس النادي الطلابي</p>
                  <p className="text-[11px] text-slate-500">{request.presidentName}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-8">الموظفون المعنيون بالتنفيذ</p>
                  <p className="text-[11px] text-slate-500">تم التوجيه والاعتماد آلياً</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-8">إدارة النشاط الطلابي</p>
                  <p className="text-[11px] text-slate-500">ختم الاعتماد الرسمي</p>
                </div>
              </div>

              {/* Print Action Bar */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة النموذج أو حفظ كـ PDF</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDeletingTarget({ request })}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف الطلب كاملاً</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
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
          onClose();
        }}
      />
    </div>
  );
};
