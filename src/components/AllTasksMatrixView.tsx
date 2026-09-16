import React, { useState } from 'react';
import { 
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useApp, isTaskAssignedToStaff } from '../context/AppContext';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/initialData';
import { Task } from '../types';

interface Props {
  onOpenRequestDetails: (requestId: string) => void;
}

export const AllTasksMatrixView: React.FC<Props> = ({ onOpenRequestDetails }) => {
  const { 
    visibleRequests, 
    currentUser, 
    currentStaff, 
    currentRole, 
    staffMembers, 
    t, 
    tService, 
    tDepartment, 
    tDynamic, 
    isRtl 
  } = useApp();

  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Extract tasks from visibleRequests (strictly privacy isolated)
  const allTasks: { task: Task; request: any }[] = [];
  visibleRequests.forEach(req => {
    req.tasks.forEach(task => {
      // If staff, only show their own tasks
      if ((currentStaff || (currentUser?.role && currentUser.role.startsWith('staff_'))) && currentRole !== 'admin') {
        if (isTaskAssignedToStaff(task, currentStaff, currentUser)) {
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
                ? (isRtl ? 'مصفوفة مهام النادي المعتمدة' : 'Authorized Club Tasks Matrix') 
                : currentStaff 
                ? (isRtl ? `مصفوفة مهام ${tDynamic(currentStaff.shortName)}` : `${tDynamic(currentStaff.shortName)} Tasks Matrix`)
                : (isRtl ? 'مصفوفة المهام العامة الشاملة' : 'Comprehensive Central Tasks Matrix')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-['Tajawal',sans-serif]">
            {isRtl ? `متابعة المهام الموجهة (${allTasks.length} مهام مصرح بالاطلاع عليها)` : `Track Directed Tasks (${allTasks.length} authorized tasks)`}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'club_president' 
              ? (isRtl ? `عرض المهام التابعة لـ (${currentUser?.clubName}) فقط لحماية خصوصية النادي.` : `Showing tasks for (${currentUser?.clubName}) only for privacy.`)
              : currentStaff
              ? (isRtl ? `عرض المهام الخاصة بأقسام (${tDynamic(currentStaff.shortName)}) فقط لضمان سرية العمل.` : `Showing tasks assigned to (${tDynamic(currentStaff.shortName)}) departments only.`)
              : (isRtl ? 'نظرة إشرافية مركزية لإدارة النشاط الطلابي عبر جميع الأندية والموظفين.' : 'Central supervisory view for Student Activity Dept across all clubs & staff.')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder={isRtl ? 'بحث سريع في المهام...' : 'Search tasks...'}
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
              <option value="all">{isRtl ? 'كافة الموظفين' : 'All Staff'}</option>
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>{tDynamic(s.name)}</option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{t('status.all', 'كافة الحالات')}</option>
            <option value="pending">{t('status.pending', 'جديدة')}</option>
            <option value="in_progress">{t('status.in_progress', 'قيد التجهيز')}</option>
            <option value="completed">{t('status.completed', 'تم الإنجاز')}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">{t('table.task_id', 'رمز المهمة')}</th>
                <th className="p-3.5">{t('table.service_name', 'الخدمة المطلوبة')}</th>
                <th className="p-3.5">{t('table.dept_name', 'القسم')}</th>
                <th className="p-3.5">{t('table.staff_name', 'الموظف المعني')}</th>
                <th className="p-3.5">{t('table.club_name', 'النادي والفعالية')}</th>
                <th className="p-3.5">{t('table.date_time', 'تاريخ الفعالية')}</th>
                <th className="p-3.5">{t('table.status', 'الحالة')}</th>
                <th className="p-3.5 text-center">{t('table.actions', 'التفاصيل')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {isRtl ? 'لا توجد مهام مطابقة لخيارات البحث الحالية' : 'No tasks match current search criteria'}
                  </td>
                </tr>
              ) : (
                filteredTasks.map(({ task, request }) => {
                  const dept = DEPARTMENTS[task.departmentId];
                  const staff = staffMembers.find(s => s.id === task.staffId) || STAFF_MEMBERS.find(s => s.id === task.staffId);
                  const localizedSrv = tService(task.serviceId, task.serviceName);
                  const localizedDept = dept ? tDepartment(dept.id, dept.name) : { name: task.departmentName };

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500 font-mono">{task.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{localizedSrv.name}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept?.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                          {localizedDept.name}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        👔 {tDynamic(staff?.shortName || task.staffName)}
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
                            ✓ {t('status.completed', 'تم الإنجاز')}
                          </span>
                        )}
                        {task.status === 'in_progress' && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                            {t('status.in_progress', 'جارٍ التجهيز')}
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                            {t('status.pending', 'جديدة')}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onOpenRequestDetails(request.id)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title={isRtl ? 'فتح تفاصيل الطلب' : 'Open Request Details'}
                        >
                          <ArrowUpRight className={`w-4 h-4 ${!isRtl ? 'rotate-90' : ''}`} />
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
