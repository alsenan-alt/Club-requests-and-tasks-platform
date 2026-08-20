import React, { useState, useEffect } from 'react';
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
  Check, 
  KeyRound, 
  Settings, 
  Save, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSyncConfig, saveSyncConfig } from '../services/gistSyncService';

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

  // Settings & Credentials State
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [gistIdInput, setGistIdInput] = useState('');
  const [filenameInput, setFilenameInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSyncConfig();
      setTokenInput(config.isCustomToken ? config.token : '');
      setGistIdInput(config.gistId);
      setFilenameInput(config.filename);
      setFeedbackMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = getSyncConfig();
  const gistId = currentConfig.gistId;
  const gistUrl = `https://gist.github.com/alsenan-alt/${gistId}`;
  const rawUrl = `https://gist.githubusercontent.com/alsenan-alt/${gistId}/raw/${encodeURIComponent(currentConfig.filename)}`;

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

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSyncConfig({
      token: tokenInput,
      gistId: gistIdInput,
      filename: filenameInput,
    });
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
    setFeedbackMessage({
      type: 'success',
      text: 'تم حفظ إعدادات الاتصال والرمز بنجاح! يمكنك الآن تجربة المزامنة.',
    });
  };

  const handleResetConfig = () => {
    if (window.confirm('هل ترغب في استعادة الإعدادات الافتراضية للاتصال؟')) {
      saveSyncConfig({ token: '', gistId: '', filename: '' });
      const resetConfig = getSyncConfig();
      setTokenInput('');
      setGistIdInput(resetConfig.gistId);
      setFilenameInput(resetConfig.filename);
      setFeedbackMessage({
        type: 'success',
        text: 'تمت استعادة إعدادات الاتصال الافتراضية بنجاح.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-['Tajawal',sans-serif]">إدارة المزامنة السحابية (إدارة النشاط)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 font-semibold">
                  خاص بالإدارة
                </span>
              </div>
              <p className="text-xs text-slate-300">مزامنة البيانات الحية مع مستودع GitHub Gist المركزي</p>
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
                  {cloudSyncStatus === 'synced' && 'المنصة متصلة ومتزامنة سحابياً'}
                  {cloudSyncStatus === 'syncing' && 'جاري مزامنة وتحديث البيانات مع GitHub Gist...'}
                  {cloudSyncStatus === 'error' && 'تنبيه: تعذر إتمام التحديث السحابي'}
                  {cloudSyncStatus === 'idle' && 'المزامنة السحابية جاهزة'}
                </span>
                {lastSyncTime && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/80 border border-current font-semibold">
                    آخر مزامنة: {lastSyncTime}
                  </span>
                )}
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                يتم حفظ وتحديث كافة الطلبات، مهام الموظفين، الحسابات، وتهيئة الخدمات في المستودع السحابي، بالإضافة للحفظ التلقائي في الذاكرة المحلية للجهاز.
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

          {/* Connection Info & Toggle Settings */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Server className="w-4 h-4 text-purple-600" />
                <span>بيانات اتصال GitHub Gist</span>
              </div>

              <button
                type="button"
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showConfigPanel ? 'إخفاء إعدادات الرمز' : 'تعديل الرمز والمعرّف'}</span>
              </button>
            </div>

            {/* Collapsible Token & Gist ID Config Form */}
            {showConfigPanel && (
              <form onSubmit={handleSaveConfig} className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-3 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    رمز الوصول الشخصي (GitHub Personal Access Token):
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={tokenInput}
                      onChange={e => setTokenInput(e.target.value)}
                      placeholder="ghp_... أو اترك فارغاً للافتراضي"
                      className="w-full text-xs p-2.5 pl-9 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 font-mono focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">معرّف Gist ID:</label>
                    <input
                      type="text"
                      value={gistIdInput}
                      onChange={e => setGistIdInput(e.target.value)}
                      placeholder="011b1641afb49fcd0bae42ab6f483230"
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 font-mono focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">اسم الملف داخل Gist:</label>
                    <input
                      type="text"
                      value={filenameInput}
                      onChange={e => setFilenameInput(e.target.value)}
                      placeholder="Club requests and tasks platform.json"
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>استعادة الافتراضي</span>
                  </button>

                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ الإعدادات</span>
                  </button>
                </div>
              </form>
            )}

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
                {currentConfig.filename}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <a
                href={gistUrl}
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 hover:text-purple-800 font-bold flex items-center gap-1 hover:underline"
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
              className="px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
              <span>{isPushing ? 'جاري الحفظ في السحابة...' : 'رفع وحفظ البيانات الحالية في السحابة'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            تتم المزامنة تلقائياً في الخلفية مع حفظ محلي كامل
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

