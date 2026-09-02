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
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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
    updateTaskStatus, 
    addTaskComment,
    deleteTask,
    deleteRequest,
    staffMembers,
    userAccounts
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'print_form'>('overview');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [deletingTarget, setDeletingTarget] = useState<{ task?: Task; request: any } | null>(null);

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
                    const isAssignee = currentStaff?.id === task.staffId;

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
