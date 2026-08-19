import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  Filter, 
  Sparkles, 
  Calendar, 
  Building2, 
  User, 
  ArrowUpRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { Task, TaskStatus } from '../types';

interface Props {
  onOpenRequestDetails: (requestId: string) => void;
}

export const AllTasksMatrixView: React.FC<Props> = ({ onOpenRequestDetails }) => {
  const { visibleRequests, currentUser, currentStaff, currentRole } = useApp();

  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Extract tasks from visibleRequests (strictly privacy isolated)
  const allTasks: { task: Task; request: any }[] = [];
  visibleRequests.forEach(req => {
    req.tasks.forEach(task => {
      // If staff, only show their own tasks
      if (currentStaff && currentRole !== 'admin') {
        if (task.staffId === currentStaff.id) {
          allTasks.push({ task, request: req });
        }
      } else {
        allTasks.push({ task, request: req });
      }
    });
  });

  const filteredTasks = allTasks.filter(({ task, request }) => {
    if (staffFilter !== 'all' && task.staffId !== staffFilter) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        task.serviceName.toLowerCase().includes(q) ||
        task.departmentName.toLowerCase().includes(q) ||
        task.staffName.toLowerCase().includes(q) ||
        request.clubName.toLowerCase().includes(q) ||
        request.eventTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
            <Lock className="w-3.5 h-3.5" />
            <span>
              {currentRole === 'club_president' 
                ? 'مصفوفة مهام النادي المعتمدة' 
                : currentStaff 
                ? `مصفوفة مهام ${currentStaff.shortName}` 
                : 'مصفوفة المهام العامة الشاملة'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-['Tajawal',sans-serif]">
            متابعة المهام الموجهة ({allTasks.length} مهام مصرح بالاطلاع عليها)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'club_president' 
              ? `عرض المهام التابعة لـ (${currentUser?.clubName}) فقط لحماية خصوصية النادي.`
              : currentStaff
              ? `عرض المهام الخاصة بأقسام (${currentStaff.shortName}) فقط لضمان سرية العمل.`
              : 'نظرة إشرافية مركزية لإدارة النشاط الطلابي عبر جميع الأندية والموظفين.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="بحث سريع في المهام..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 w-44"
          />

          {currentRole === 'admin' && (
            <select
              value={staffFilter}
              onChange={e => setStaffFilter(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">كافة الموظفين</option>
              {STAFF_MEMBERS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">كافة الحالات</option>
            <option value="pending">جديدة</option>
            <option value="in_progress">قيد التجهيز</option>
            <option value="completed">تم الإنجاز</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">رمز المهمة</th>
                <th className="p-3.5">الخدمة المطلوبة</th>
                <th className="p-3.5">القسم</th>
                <th className="p-3.5">الموظف المعني</th>
                <th className="p-3.5">النادي والفعالية</th>
                <th className="p-3.5">تاريخ الفعالية</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد مهام مطابقة لخيارات البحث الحالية
                  </td>
                </tr>
              ) : (
                filteredTasks.map(({ task, request }) => {
                  const dept = DEPARTMENTS[task.departmentId];
                  const staff = STAFF_MEMBERS.find(s => s.id === task.staffId);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500">{task.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{task.serviceName}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept?.badgeBg}`}>
                          {dept?.name}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        👔 {staff?.shortName}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{request.clubName}</div>
                        <div className="text-[11px] text-slate-500">{request.eventTitle}</div>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {request.eventDate}
                      </td>
                      <td className="p-3.5">
                        {task.status === 'completed' && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                            ✓ تم الإنجاز
                          </span>
                        )}
                        {task.status === 'in_progress' && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                            جارٍ التجهيز
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                            جديدة
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onOpenRequestDetails(request.id)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="فتح تفاصيل الطلب"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
