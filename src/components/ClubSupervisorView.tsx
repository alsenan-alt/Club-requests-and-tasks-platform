import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Phone,
  Mail,
  Award,
  Layers,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClubRequest, TaskStatus } from '../types';
import { DEPARTMENTS } from '../data/initialData';

interface Props {
  onOpenRequestDetails: (requestId: string) => void;
}

export const ClubSupervisorView: React.FC<Props> = ({ onOpenRequestDetails }) => {
  const { 
    currentUser, 
    visibleRequests, 
    requests,
    approveRequestBySupervisor,
    rejectRequestBySupervisor,
    requestChangesBySupervisor,
    setSelectedRequestId,
    staffMembers
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action Modal States
  const [approvingRequest, setApprovingRequest] = useState<ClubRequest | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  
  const [requestingInfoRequest, setRequestingInfoRequest] = useState<ClubRequest | null>(null);
  const [infoNotes, setInfoNotes] = useState('');

  const [rejectingRequest, setRejectingRequest] = useState<ClubRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Supervised Clubs List
  const supervisedClubs = currentUser?.supervisedClubNames || [];

  // Filter requests belonging to this supervisor
  const supervisorRequests = visibleRequests;

  const pendingRequests = supervisorRequests.filter(r => r.status === 'pending_supervisor' || r.supervisorStatus === 'pending' || r.supervisorStatus === 'needs_info');
  const approvedRequests = supervisorRequests.filter(r => r.supervisorStatus === 'approved' || r.status !== 'pending_supervisor');

  const filteredRequests = supervisorRequests.filter(req => {
    if (activeSubTab === 'pending' && req.status !== 'pending_supervisor' && req.supervisorStatus !== 'pending' && req.supervisorStatus !== 'needs_info') {
      return false;
    }
    if (activeSubTab === 'approved' && req.supervisorStatus !== 'approved' && req.status === 'pending_supervisor') {
      return false;
    }
    if (selectedClubFilter !== 'all' && req.clubName !== selectedClubFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.eventTitle.toLowerCase().includes(q) ||
        req.requestNumber.toLowerCase().includes(q) ||
        req.clubName.toLowerCase().includes(q) ||
        req.presidentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAttendees = supervisorRequests.reduce((acc, r) => acc + (Number(r.expectedAttendees) || 0), 0);

  const handleConfirmApproval = () => {
    if (!approvingRequest) return;
    approveRequestBySupervisor(approvingRequest.id, approvalNote.trim() || 'تمت الموافقة والاعتماد من مشرف النادي.');
    setApprovingRequest(null);
    setApprovalNote('');
  };

  const handleConfirmRequestInfo = () => {
    if (!requestingInfoRequest || !infoNotes.trim()) return;
    requestChangesBySupervisor(requestingInfoRequest.id, infoNotes.trim());
    setRequestingInfoRequest(null);
    setInfoNotes('');
  };

  const handleConfirmRejection = () => {
    if (!rejectingRequest || !rejectionReason.trim()) return;
    rejectRequestBySupervisor(rejectingRequest.id, rejectionReason.trim());
    setRejectingRequest(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Supervisor Banner & Profile Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/20 shrink-0">
              👨‍🏫
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  مشرف أندية طلابية معتمد
                </span>
                <span className="text-xs text-slate-300">
                  {currentUser?.office || 'جامعة الملك فهد للبترول والمعادن'}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal',sans-serif]">
                {currentUser?.name || 'سعادة المشرف'}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentUser?.title || 'الإشراف الأكاديمي والطلابي على أنشطة ومشاريع الأندية المعتمدة.'}
              </p>

              {/* Supervised Clubs Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">الأندية تحت إشرافكم:</span>
                {supervisedClubs.length > 0 ? (
                  supervisedClubs.map((cName, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-emerald-300 text-xs font-medium border border-white/10 backdrop-blur-xs flex items-center gap-1"
                    >
                      <Building2 className="w-3 h-3 text-emerald-400" />
                      {cName}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">جميع الأندية المسندة</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-xs shrink-0 text-center">
            <div className="p-2">
              <span className="text-[11px] text-amber-300 block font-medium">بانتظار الاعتماد</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-['Tajawal',sans-serif]">
                {pendingRequests.length}
              </span>
            </div>
            <div className="p-2 border-x border-white/10">
              <span className="text-[11px] text-emerald-300 block font-medium">طلبات معتمدة</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-['Tajawal',sans-serif]">
                {approvedRequests.length}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-teal-300 block font-medium">إجمالي المستفيدين</span>
              <span className="text-xl sm:text-2xl font-black text-white font-['Tajawal',sans-serif]">
                {totalAttendees}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Approval Flow Notice Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-start gap-3.5">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-emerald-950 font-bold block mb-1">
            آلية التوجيه الذكي: مرحلة اعتماد المشرف أولاً
          </strong>
          عندما يقدم النادي طلب فعالية، يتم توجيهه إلى هذه اللوحة لموافقتكم الكريمة أولاً. وبمجرد اعتمادكم للطلب، يتولى النظام تلقائياً توزيع المهام اللوجستية وإشعار الموظفين المختصين (أ. حسين رمضان، أ. موسى آل سنان، أ. مصلح الشمراني) لبدء التنفيذ الفوري.
        </div>
      </div>

      {/* 3. Filter and Tab Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sub Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>طلبات بانتظار الاعتماد ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>الطلبات المعتمدة ({approvedRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>كافة الطلبات ({supervisorRequests.length})</span>
          </button>
        </div>

        {/* Club Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {supervisedClubs.length > 1 && (
            <select
              value={selectedClubFilter}
              onChange={e => setSelectedClubFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="all">كل الأندية المشرف عليها</option>
              {supervisedClubs.map((club, idx) => (
                <option key={idx} value={club}>{club}</option>
              ))}
            </select>
          )}

          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في الفعاليات أو الأرقام..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl pr-9 pl-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-['Tajawal',sans-serif]">
              لا توجد طلبات تطابق هذا التصنيف
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeSubTab === 'pending' 
                ? 'رائع! لا توجد حالياً أي طلبات معلقة بانتظار الاعتماد.'
                : 'لم يتم العثور على فعاليات مسجلة تحت هذا الفلتر.'}
            </p>
          </div>
        ) : (
          filteredRequests.map(request => {
            const isPending = request.status === 'pending_supervisor' || request.supervisorStatus === 'pending' || request.supervisorStatus === 'needs_info';
            const isApproved = request.supervisorStatus === 'approved' || (request.status !== 'pending_supervisor' && request.status !== 'rejected');
            
            const completedCount = request.tasks.filter(t => t.status === 'completed').length;
            const progressPct = request.tasks.length > 0 ? Math.round((completedCount / request.tasks.length) * 100) : 0;

            return (
              <div 
                key={request.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs overflow-hidden ${
                  isPending 
                    ? 'border-amber-300 ring-2 ring-amber-400/20 hover:border-amber-400' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold font-mono">
                        {request.requestNumber}
                      </span>

                      <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        {request.clubName}
                      </span>

                      {/* Supervisor Status Badge */}
                      {isPending ? (
                        <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          بانتظار موافقتكم للاعتماد
                        </span>
                      ) : request.supervisorStatus === 'needs_info' ? (
                        <span className="px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 text-xs font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                          مطلوب توضيحات من النادي
                        </span>
                      ) : request.supervisorStatus === 'rejected' || request.status === 'rejected' ? (
                        <span className="px-3 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          تم الاعتذار عن الطلب
                        </span>
                      ) : (
                        <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          معتمد ومحال للموظفين
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Tajawal',sans-serif]">
                      {request.eventTitle}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>رئيس النادي: <strong className="text-slate-800">{request.presidentName}</strong></span>
                      <span>جوال: <strong className="text-slate-800">{request.presidentPhone}</strong></span>
                      <span>تاريخ التقديم: {new Date(request.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                  {/* Actions for Pending Request */}
                  {isPending ? (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setApprovingRequest(request);
                          setApprovalNote('');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                      >
                        <Check className="w-4 h-4" />
                        <span>اعتماد الفعالية والموافقة ✨</span>
                      </button>

                      <button
                        onClick={() => {
                          setRequestingInfoRequest(request);
                          setInfoNotes('');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="طلب ملاحظات أو تعديلات من رئيس النادي"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-600" />
                        <span>طلب تعديلات</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectingRequest(request);
                          setRejectionReason('');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="اعتذار عن اعتماد الفعالية"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>اعتذار</span>
                      </button>

                      <button
                        onClick={() => onOpenRequestDetails(request.id)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="عرض كامل التفاصيل"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Live Staff Completion Indicator */}
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">إنجاز مهام الموظفين:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-emerald-700">{progressPct}%</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenRequestDetails(request.id)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>تفاصيل التنفيذ</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Event Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">موعد الفعالية:</span>
                      <strong className="text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {request.eventDate}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">التوقيت:</span>
                      <strong className="text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {request.startTime} - {request.endTime}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">المقر المقترح:</span>
                      <strong className="text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {request.locationSummary}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">المستفيدون المتوقعون:</span>
                      <strong className="text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        {request.expectedAttendees} مشارك
                      </strong>
                    </div>
                  </div>

                  {/* Description */}
                  {request.description && (
                    <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 block mb-1 text-xs">أهداف ووصف الفعالية:</strong>
                      <p className="leading-relaxed text-slate-600">{request.description}</p>
                    </div>
                  )}

                  {/* Supervisor Note if already approved / reviewed */}
                  {request.supervisorNotes && (
                    <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-indigo-900">ملاحظات المشرف المسجلة:</strong>
                        <p>{request.supervisorNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Logistical Services / Tasks Overview */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      الخدمات والتجهيزات اللوجستية المطلوبة ({request.tasks.length} مهام):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {request.tasks.map((task, idx) => (
                        <div 
                          key={task.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 block truncate">{task.serviceName}</span>
                            <span className="text-[11px] text-slate-500 block truncate">{task.departmentName} • {task.staffName}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                            task.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : task.status === 'in_progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {task.status === 'completed' ? 'منجز' : task.status === 'in_progress' ? 'قيد العمل' : 'بانتظار التوجيه'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Confirm Approval */}
      {approvingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-['Tajawal',sans-serif]">
              اعتماد فعالية: {approvingRequest.eventTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              المقدمة من <strong>{approvingRequest.clubName}</strong>. بمجرد تأكيد الاعتماد، سيقوم النظام تلقائياً بإنشاء المهام وإرسال الإشعارات للموظفين المعنيين للبدء بالتنفيذ.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات أو توجيهات المشرف للنادي والموظفين (اختياري):
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                placeholder="مثال: تمت المراجعة والاعتماد، يرجى الالتزام بالوقت المحدد..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                rows={3}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setApprovingRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد الاعتماد والإحالة للموظفين</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Info / Changes */}
      {requestingInfoRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-['Tajawal',sans-serif]">
              طلب تعديلات أو إيضاحات من النادي
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              فعالية: <strong>{requestingInfoRequest.eventTitle}</strong> ({requestingInfoRequest.clubName})
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الملاحظات أو التعديلات المطلوبة من رئيس النادي:
              </label>
              <textarea
                value={infoNotes}
                onChange={e => setInfoNotes(e.target.value)}
                placeholder="اكتب التعديلات المطلوبة بوضوح، مثل: تعديل موعد الفعالية، توضيح مقر الحجز، إلخ..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                rows={4}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRequestingInfoRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmRequestInfo}
                disabled={!infoNotes.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الملاحظات للنادي</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Rejection Confirmation */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-['Tajawal',sans-serif]">
              الاعتذار عن اعتماد الفعالية
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              فعالية: <strong>{rejectingRequest.eventTitle}</strong> ({rejectingRequest.clubName})
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سبب الاعتذار:
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="سبب عدم إمكانية اعتماد الفعالية في الوقت الحالي..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                rows={3}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>تأكيد الاعتذار</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
