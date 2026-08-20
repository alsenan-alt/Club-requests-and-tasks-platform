import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Check, Layers, Sparkles } from 'lucide-react';
import { Task, ClubRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  request?: ClubRequest | null;
  onConfirmDeleteTask?: (taskId: string) => void;
  onConfirmDeleteRequest?: (requestId: string) => void;
}

export const DeleteConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  task,
  request,
  onConfirmDeleteTask,
  onConfirmDeleteRequest,
}) => {
  const [deleteMode, setDeleteMode] = useState<'task' | 'request'>('task');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  // Determine if both task and request are available
  const hasTask = Boolean(task);
  const hasRequest = Boolean(request);

  const handleExecuteDelete = () => {
    setIsDeleting(true);
    try {
      if (deleteMode === 'task' && task && onConfirmDeleteTask) {
        onConfirmDeleteTask(task.id);
      } else if (request && onConfirmDeleteRequest) {
        onConfirmDeleteRequest(request.id);
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-700 to-red-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-rose-100 border border-white/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Tajawal',sans-serif]">
                تأكيد حذف المهمة أو الطلب
              </h3>
              <p className="text-xs text-rose-100/90 mt-0.5">
                يرجى تحديد نوع الحذف والتأكيد للمتابعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Warning Message */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 space-y-1">
              <p className="font-bold">تنبيه هام:</p>
              <p className="text-rose-800 leading-relaxed">
                عملية الحذف ستؤدي إلى إزالة السجلات ومزامنة التحديث فورياً مع كافة حسابات الموظفين ورؤساء الأندية.
              </p>
            </div>
          </div>

          {/* Option Selector when both task and request are provided */}
          {hasTask && hasRequest && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                حدد ما ترغب في حذفه:
              </label>
              
              <div className="grid grid-cols-1 gap-2.5">
                {/* Option 1: Delete Single Task */}
                <button
                  type="button"
                  onClick={() => setDeleteMode('task')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    deleteMode === 'task'
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        حذف هذه المهمة المحددة فقط
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                        {task?.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      خدمة: <strong className="text-slate-800 font-bold">{task?.serviceName}</strong> • القسم: {task?.departmentName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      سيتم حذف هذه المهمة فقط مع بقاء بقية مهام الطلب فعالة.
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    deleteMode === 'task' ? 'bg-rose-600 text-white' : 'border border-slate-300'
                  }`}>
                    {deleteMode === 'task' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Option 2: Delete Entire Request */}
                <button
                  type="button"
                  onClick={() => setDeleteMode('request')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    deleteMode === 'request'
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        حذف طلب الفعالية بالكامل
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                        {request?.requestNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      الفعالية: <strong className="text-slate-800 font-bold">{request?.eventTitle}</strong> ({request?.clubName})
                    </p>
                    <p className="text-[10px] text-slate-400">
                      سيتم حذف كامل الطلب وكافة المهام التابعة له ({request?.tasks?.length || 0} مهام).
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    deleteMode === 'request' ? 'bg-rose-600 text-white' : 'border border-slate-300'
                  }`}>
                    {deleteMode === 'request' && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Details Summary of what will be deleted */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="text-slate-500 font-bold text-[11px] block">العنصر المراد حذفه:</span>
            {(!hasTask || deleteMode === 'request') ? (
              <div className="text-slate-800">
                <span className="font-bold text-rose-700">طلب الفعالية:</span> {request?.eventTitle} ({request?.requestNumber}) التابع لـ {request?.clubName}
              </div>
            ) : (
              <div className="text-slate-800">
                <span className="font-bold text-rose-700">المهمة:</span> {task?.serviceName} ({task?.id}) ضمن فعالية ({request?.eventTitle || 'الطلب'})
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            إلغاء وتراجع
          </button>

          <button
            type="button"
            onClick={handleExecuteDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {isDeleting ? 'جارٍ الحذف...' : (
                deleteMode === 'task' && hasTask ? 'تأكيد حذف المهمة' : 'تأكيد حذف الطلب كاملاً'
              )}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
