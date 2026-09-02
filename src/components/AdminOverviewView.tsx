import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  Sparkles, 
  BarChart3, 
  Calendar, 
  FileText, 
  Phone,
  Layers,
  ArrowUpRight,
  Trash2,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { ClubRequest, Task } from '../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CloudSyncIndicator } from './CloudSyncIndicator';

interface Props {
  onOpenRequestDetails: (requestId: string) => void;
}

export const AdminOverviewView: React.FC<Props> = ({ onOpenRequestDetails }) => {
  const { 
    requests, 
    deleteRequest, 
    deleteTask,
    setIsSyncModalOpen,
    cloudSyncStatus,
    lastSyncTime,
    staffMembers
  } = useApp();
  const [deletingTarget, setDeletingTarget] = useState<{ task?: Task; request: ClubRequest } | null>(null);

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;
  const submittedRequests = requests.filter(r => r.status === 'submitted').length;

  const allTasks: Task[] = requests.flatMap(r => r.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Admin Hero */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>إدارة النشاط الطلابي • الرقابة والإشراف العام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Tajawal',sans-serif]">
              لوحة التحكم والمؤشرات الإشرافية
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              متابعة تدفق طلبات الأندية الطلابية، وتوزيع أحمال العمل بين الموظفين الثلاثة، ومراقبة نسب الإنجاز وجداول حجوزات المباني والقاعات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Cloud Sync Manager Button for Activity Administration */}
            <button
              id="btn-admin-cloud-sync"
              onClick={() => setIsSyncModalOpen(true)}
              className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-white px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center gap-3 text-xs font-bold shadow-md cursor-pointer group hover:scale-[1.02]"
              title="إدارة المزامنة وقاعدة البيانات السحابية مع GitHub Sync Repository (خاص بإدارة النشاط)"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/40 flex items-center justify-center text-purple-200 border border-purple-300/40 group-hover:scale-110 transition-transform">
                {cloudSyncStatus === 'synced' ? (
                  <CloudCheck className="w-5 h-5 text-emerald-400" />
                ) : cloudSyncStatus === 'syncing' ? (
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                ) : cloudSyncStatus === 'error' ? (
                  <CloudOff className="w-5 h-5 text-rose-400" />
                ) : (
                  <Cloud className="w-5 h-5 text-purple-200" />
                )}
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-purple-200 font-medium">مستودع المزامنة السحابية</span>
                <span className="text-xs text-white font-bold flex items-center gap-1.5">
                  <span>
                    {cloudSyncStatus === 'synced' ? 'GitHub Sync (متزامن)' : 
                     cloudSyncStatus === 'syncing' ? 'جاري المزامنة...' : 
                     cloudSyncStatus === 'error' ? 'تنبيه المزامنة' : 'إدارة GitHub Sync'}
                  </span>
                  {cloudSyncStatus === 'synced' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </span>
              </div>
            </button>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[11px] text-purple-200 block">نسبة الإنجاز الإجمالية</span>
              <span className="text-2xl font-black text-emerald-400 font-['Tajawal',sans-serif]">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs block">إجمالي طلبات الفعاليات</span>
            <span className="text-2xl font-black text-white mt-1 block font-['Tajawal',sans-serif]">
              {totalRequests}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs block">طلبات جديدة للتوجيه</span>
            <span className="text-2xl font-black text-amber-300 mt-1 block font-['Tajawal',sans-serif]">
              {submittedRequests}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs block">طلبات قيد التجهيز الميداني</span>
            <span className="text-2xl font-black text-blue-300 mt-1 block font-['Tajawal',sans-serif]">
              {inProgressRequests}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-xs block">طلبات مكتملة بالكامل</span>
            <span className="text-2xl font-black text-emerald-300 mt-1 block font-['Tajawal',sans-serif]">
              {completedRequests}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Load Distribution Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Tajawal',sans-serif] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <span>توزيع أحمال العمل ونسب الإنجاز بين الموظفين المعنيين</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffMembers.map(staff => {
            const staffTasks = allTasks.filter(t => t.staffId === staff.id);
            const staffDone = staffTasks.filter(t => t.status === 'completed').length;
            const staffInProgress = staffTasks.filter(t => t.status === 'in_progress').length;
            const staffPending = staffTasks.filter(t => t.status === 'pending').length;
            const pct = staffTasks.length > 0 ? Math.round((staffDone / staffTasks.length) * 100) : 0;

            return (
              <div key={staff.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg">
                        👔
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{staff.name}</h4>
                        <span className="text-[11px] text-slate-500">{staff.office}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {staffTasks.length} مهام
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>معدل الإنجاز</span>
                      <span className="font-bold text-slate-900">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Task counts breakdown */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="text-amber-700 font-bold block text-sm">{staffPending}</span>
                      <span className="text-amber-800 text-[10px]">جديدة</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-blue-700 font-bold block text-sm">{staffInProgress}</span>
                      <span className="text-blue-800 text-[10px]">جارية</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 font-bold block text-sm">{staffDone}</span>
                      <span className="text-emerald-800 text-[10px]">منجزة</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px]">{staff.email}</span>
                  <span className="font-bold text-slate-700">{staff.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Requests Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-600" />
            <h3 className="text-base font-bold text-slate-900">
              السجل العام الموحد لطلبات الأندية الطلابية
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            إجمالي {requests.length} طلبات مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">رقم الطلب</th>
                <th className="p-3.5">النادي مقدم الطلب</th>
                <th className="p-3.5">عنوان الفعالية</th>
                <th className="p-3.5">تاريخ الفعالية</th>
                <th className="p-3.5">المهام الموزعة</th>
                <th className="p-3.5">حالة الطلب</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => {
                const completedCount = req.tasks.filter(t => t.status === 'completed').length;
                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{req.requestNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{req.clubName}</td>
                    <td className="p-3.5 text-slate-900 font-medium">{req.eventTitle}</td>
                    <td className="p-3.5 text-slate-500">{req.eventDate}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {completedCount} / {req.tasks.length} مهام
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'completed' ? 'مكتمل' : req.status === 'in_progress' ? 'قيد التنفيذ' : 'جديد'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenRequestDetails(req.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="عرض التقرير والتفاصيل"
                        >
                          <span>التفاصيل</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingTarget({ request: req })}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="حذف هذا الطلب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
