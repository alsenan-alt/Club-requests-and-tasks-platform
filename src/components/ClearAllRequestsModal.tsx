import React, { useState } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  X, 
  Check, 
  Calendar, 
  RotateCcw, 
  Sparkles,
  ShieldAlert,
  Archive,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ClearAllRequestsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { requests, clearAllRequests, currentAcademicYear } = useApp();
  
  const [targetYear, setTargetYear] = useState(currentAcademicYear || '1447-1448هـ (2026-2027)');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [archiveReason, setArchiveReason] = useState<'new_academic_year' | 'semester_reset' | 'administrative_cleanup'>('new_academic_year');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalRequestsCount = requests.length;
  const totalTasksCount = requests.reduce((acc, r) => acc + (r.tasks?.length || 0), 0);

  const REQUIRED_CONFIRM_WORD = 'تأكيد الحذف';

  const handleConfirm = () => {
    if (confirmationCode.trim() !== REQUIRED_CONFIRM_WORD) {
      setErrorMsg(`يرجى كتابة عبارة "${REQUIRED_CONFIRM_WORD}" بدقة لتأكيد العملية.`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = clearAllRequests({
        academicYear: targetYear,
        archiveReason: archiveReason === 'new_academic_year' 
          ? 'بدء عام أكاديمي جديد' 
          : archiveReason === 'semester_reset' 
          ? 'تصفير فصلي' 
          : 'أرشفة وتنظيف إداري',
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'حدث خطأ أثناء تنفيذ الحذف الشامل');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-rose-100 border border-white/20 shadow-inner">
              <Calendar className="w-6 h-6 text-rose-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-['Tajawal',sans-serif]">
                  تصفير الطلبات وبدء عام دراسي جديد
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/20">
                  إدارة النشاط
                </span>
              </div>
              <p className="text-xs text-rose-100/90 mt-0.5">
                تصفير وحذف جميع طلبات ومهام الأندية الطلابية لبدء فترة جديدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Warning Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 space-y-1">
              <p className="font-bold text-rose-900 text-sm">إجراء حرج وإداري:</p>
              <p className="text-rose-800 leading-relaxed">
                سيؤدي هذا الإجراء إلى <strong>حذف كافة سجلات الطلبات ({totalRequestsCount} طلب)</strong> وجميع المهام التنفيذية المرتبطة بها ({totalTasksCount} مهمة) من السجلات وقاعدة البيانات السحابية مع الحفاظ على حسابات الأندية وإعدادات الخدمات والموظفين.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              سبب الإجراء وتحديد العام الجديد:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setArchiveReason('new_academic_year')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  archiveReason === 'new_academic_year'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                بدء عام جديد
              </button>

              <button
                type="button"
                onClick={() => setArchiveReason('semester_reset')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  archiveReason === 'semester_reset'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                تصفير فصلي
              </button>

              <button
                type="button"
                onClick={() => setArchiveReason('administrative_cleanup')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  archiveReason === 'administrative_cleanup'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                تنظيف إداري
              </button>
            </div>
          </div>

          {/* Academic Year input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              مسمى العام الأكاديمي الجديد:
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                placeholder="مثال: 1448-1449هـ (2026-2027)"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              سيتم تثبيت هذا العام كعنوان رسمي لبيئة العمل وتحديث السجلات السحابية.
            </p>
          </div>

          {/* Summary of items to be cleared */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">الطلبات التي ستُحذف</span>
              <span className="text-lg font-black text-rose-600 block">{totalRequestsCount}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">المهام الميدانية</span>
              <span className="text-lg font-black text-rose-600 block">{totalTasksCount}</span>
            </div>
          </div>

          {/* Security confirmation code input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>لتأكيد الحذف النهائي، اكتب العبارة التالية:</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-mono font-bold text-[11px]">
                {REQUIRED_CONFIRM_WORD}
              </span>
            </label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => {
                setConfirmationCode(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder={`اكتب "${REQUIRED_CONFIRM_WORD}" هنا...`}
              className="w-full text-xs p-3 rounded-xl border border-rose-300 bg-rose-50/40 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-center"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إلغاء وتراجع
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing || confirmationCode.trim() !== REQUIRED_CONFIRM_WORD}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>جاري تصفير الطلبات...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>تأكيد حذف جميع الطلبات وبدء العام</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
