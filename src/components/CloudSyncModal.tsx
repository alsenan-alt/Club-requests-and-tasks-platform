import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CloudCheck, 
  CloudOff, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudSyncModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    cloudSyncStatus, 
    lastSyncTime, 
    syncError, 
    triggerManualSync, 
    triggerManualPush,
    requests,
    userAccounts,
    services
  } = useApp();

  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const gistId = '011b1641afb49fcd0bae42ab6f483230';
  const gistUrl = `https://gist.github.com/alsenan-alt/${gistId}`;
  const rawUrl = `https://gist.githubusercontent.com/alsenan-alt/${gistId}/raw/Club%2520requests%2520and%2520tasks%2520platform.json`;

  const handlePull = async () => {
    setIsPulling(true);
    setFeedbackMessage(null);
    try {
      await triggerManualSync();
      setFeedbackMessage({
        type: 'success',
        text: 'تم استرجاع ومزامنة أحدث البيانات من GitHub Gist بنجاح!',
      });
    } catch (e: any) {
      setFeedbackMessage({
        type: 'error',
        text: e.message || 'تعذر استرجاع البيانات من السحابة',
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handlePush = async () => {
    setIsPushing(true);
    setFeedbackMessage(null);
    try {
      await triggerManualPush();
      setFeedbackMessage({
        type: 'success',
        text: 'تم رفع وحفظ كافة بيانات النظام الحالية في GitHub Gist بنجاح!',
      });
    } catch (e: any) {
      setFeedbackMessage({
        type: 'error',
        text: e.message || 'تعذر رفع البيانات إلى السحابة',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const handleCopyRawUrl = () => {
    navigator.clipboard.writeText(rawUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Tajawal',sans-serif]">المزامنة السحابية المباشرة (GitHub Gist)</h3>
              <p className="text-xs text-slate-300">مزامنة تلقائية حية لجميع الأجهزة والحسابات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">

          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
            cloudSyncStatus === 'synced'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : cloudSyncStatus === 'syncing'
              ? 'bg-blue-50 border-blue-200 text-blue-950'
              : cloudSyncStatus === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="mt-0.5 shrink-0">
              {cloudSyncStatus === 'synced' && <CloudCheck className="w-6 h-6 text-emerald-600" />}
              {cloudSyncStatus === 'syncing' && <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />}
              {cloudSyncStatus === 'error' && <CloudOff className="w-6 h-6 text-rose-600" />}
              {cloudSyncStatus === 'idle' && <Cloud className="w-6 h-6 text-slate-500" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-bold">
                  {cloudSyncStatus === 'synced' && 'المنصة متصلة ومتزامنة لحظياً بالسحابة'}
                  {cloudSyncStatus === 'syncing' && 'جاري مزامنة وتحديث البيانات مع GitHub Gist...'}
                  {cloudSyncStatus === 'error' && 'تنبيه: حدث خطأ أثناء المزامنة السحابية'}
                  {cloudSyncStatus === 'idle' && 'المزامنة السحابية جاهزة'}
                </span>
                {lastSyncTime && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/80 border border-current font-semibold">
                    آخر مزامنة: {lastSyncTime}
                  </span>
                )}
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                يتم حفظ وتحديث كافة الطلبات، مهام الموظفين، الحسابات، وتهيئة الخدمات تلقائياً ومباشرة في مستودع Gist السحابي، مما يتيح فتح المنصة من أي متصفح أو جهاز مع الحصول على أحدث البيانات فورياً.
              </p>
              {syncError && (
                <div className="mt-2 text-xs font-semibold text-rose-700 bg-rose-100/80 p-2 rounded-xl border border-rose-200">
                  {syncError}
                </div>
              )}
            </div>
          </div>

          {/* Feedback alert */}
          {feedbackMessage && (
            <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] text-slate-500 block">إجمالي الطلبات</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{requests.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] text-slate-500 block">حسابات المستخدمين</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{userAccounts.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] text-slate-500 block">الخدمات المهيئة</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{services.length}</span>
            </div>
          </div>

          {/* Repository & Connection Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                معرّف Gist السحابي:
              </span>
              <code className="bg-white px-2 py-0.5 rounded-lg border border-slate-300 font-mono text-[11px] text-slate-800">
                {gistId}
              </code>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                اسم ملف قاعدة البيانات:
              </span>
              <span className="font-medium text-slate-800">
                Club requests and tasks platform.json
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                حالة المصادقة والتفويض:
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                ✓ متصل ومصرح بالرمز الشخصي
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <a
                href={gistUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                <span>فتح مستودع Gist على GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyRawUrl}
                className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم نسخ الرابط الخام' : 'نسخ رابط Raw'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handlePull}
              disabled={isPulling || isPushing}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <DownloadCloud className={`w-4 h-4 text-blue-600 ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'جاري السحب والمزامنة...' : 'سحب وتحديث البيانات من السحابة'}</span>
            </button>

            <button
              type="button"
              onClick={handlePush}
              disabled={isPulling || isPushing}
              className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
              <span>{isPushing ? 'جاري الحفظ في السحابة...' : 'رفع وحفظ البيانات الحالية في السحابة'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            المزامنة تعمل تلقائياً في الخلفية عند كل تعديل
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
