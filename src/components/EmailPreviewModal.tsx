import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  Printer, 
  RotateCw, 
  Send, 
  Building2, 
  User, 
  Clock, 
  Calendar,
  CheckCircle2,
  FileText,
  Info
} from 'lucide-react';
import { EmailNotificationLog } from '../types';
import { useApp } from '../context/AppContext';
import { 
  getGmailComposeUrl, 
  getOutlookComposeUrl, 
  getOffice365ComposeUrl, 
  getMailtoUrl 
} from '../utils/emailService';

interface Props {
  emailLog: EmailNotificationLog | null;
  onClose: () => void;
  onResend?: (emailLog: EmailNotificationLog) => void;
}

export const EmailPreviewModal: React.FC<Props> = ({ emailLog, onClose, onResend }) => {
  const { isRtl, resendSupervisorEmail } = useApp();
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  if (!emailLog) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(emailLog.bodyText || emailLog.bodyHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <title>${emailLog.subject}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${emailLog.subject}</h2>
            <p><strong>المستلم:</strong> ${emailLog.recipientName} (${emailLog.recipientEmail})</p>
            <p><strong>التاريخ:</strong> ${new Date(emailLog.sentAt).toLocaleString('ar-SA')}</p>
          </div>
          ${emailLog.bodyHtml}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleOpenNativeMail = () => {
    const mailto = getMailtoUrl(emailLog.recipientEmail, emailLog.subject, emailLog.bodyText);
    window.location.href = mailto;
  };

  const handleOpenGmail = () => {
    const gmailUrl = getGmailComposeUrl(emailLog.recipientEmail, emailLog.subject, emailLog.bodyText);
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOutlook = () => {
    const outlookUrl = getOffice365ComposeUrl(emailLog.recipientEmail, emailLog.subject, emailLog.bodyText);
    window.open(outlookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResend = async () => {
    setIsResending(true);
    if (onResend) {
      onResend(emailLog);
      setIsResending(false);
      setResendSuccess(true);
      setResendMsg('تم إعادة تسجيل وتجهيز الإشعار للمشرف');
      setTimeout(() => setResendSuccess(false), 4000);
    } else {
      const res = await resendSupervisorEmail(emailLog.requestId);
      setIsResending(false);
      if (res.success) {
        setResendSuccess(true);
        setResendMsg(res.message || 'تم إرسال الإشعار بنجاح');
        setTimeout(() => setResendSuccess(false), 4000);
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Email Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold border border-emerald-400/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  إشعار بريدي جامعي رسمي (KFUPM Mail)
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {emailLog.requestNumber}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-1">
                {emailLog.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata Details Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-slate-500 min-w-16">المُرسل:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-emerald-800">
                منظومة الأنشطة الطلابية &lt;student.activities@kfupm.edu.sa&gt;
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-slate-500 min-w-16">المُستلم:</span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-emerald-900">
                {emailLog.recipientName} &lt;{emailLog.recipientEmail}&gt;
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-slate-500 min-w-16">وقت الإرسال:</span>
              <span className="text-slate-600 font-medium">
                {new Date(emailLog.sentAt).toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'medium' })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-slate-500 min-w-16">حالة التسليم:</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم التوليد والتسليم للمنظومة</span>
              </span>
            </div>
          </div>

          {/* Quick Direct Webmail Dispatch Info Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
            <div className="flex items-start gap-2 text-xs">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">إرسال فوري ومباشر لصندوق بريد المشرف:</span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  يمكنك بضغطة زر فتح شاشة الإرسال في Gmail أو Outlook معبأة بالكامل بعنوان المشرف ونص الخطاب لإرسالها فوراً دون أي حظر أو فلترة.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleOpenGmail}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="فتح في Gmail مباشرة"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال عبر Gmail</span>
              </button>

              <button
                type="button"
                onClick={handleOpenOutlook}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="فتح في Outlook الجامعي / الويب"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>إرسال عبر Outlook</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('html')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'html' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                تنسيق البريد (HTML)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'text' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                النص الخام (Text)
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>طباعة</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNativeMail}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="فتح في تطبيق البريد المثبت على جهازك"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                <span>تطبيق البريد (Mail App)</span>
              </button>

              <button
                type="button"
                disabled={isResending}
                onClick={handleResend}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'جاري الإرسال...' : 'إعادة إرسال الإشعار'}</span>
              </button>
            </div>
          </div>

          {resendSuccess && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs rounded-xl text-center animate-in fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{resendMsg || '✅ تم إعادة إرسال وتجهيز الإشعار البريدي بنجاح!'}</span>
            </div>
          )}
        </div>

        {/* Email Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/70">
          {viewMode === 'html' ? (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden max-w-2xl mx-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: emailLog.bodyHtml }} 
                className="prose prose-sm max-w-none"
              />
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-w-2xl mx-auto select-all">
              {emailLog.bodyText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>نظام الإشعارات الآلية المعتمدة • عمادة شؤون الطلاب - KFUPM</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
