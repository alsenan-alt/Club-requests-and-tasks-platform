import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Car, 
  Users, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles,
  Download,
  BadgeCheck
} from 'lucide-react';
import { SecurityGuestEntry } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guests: SecurityGuestEntry[];
  eventTitle?: string;
  clubName?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  requestId?: string;
  supervisorName?: string;
}

export const SecurityPermitsPrintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  guests = [],
  eventTitle = 'فعالية طلابية معتمدة',
  clubName = 'نادي طلابي',
  eventDate,
  eventTime,
  location = 'جامعة الملك فهد للبترول والمعادن',
  requestId = `SEC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  supervisorName = 'أ. مصلح الشمراني (مشرف الأمن والسلامة)'
}) => {
  const [printMode, setPrintMode] = useState<'manifest' | 'dash_passes'>('manifest');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalCompanions = guests.reduce((sum, g) => sum + (Number(g.companionsCount) || 0), 0);
  const totalBeneficiaries = guests.length + totalCompanions;
  const currentDateFormatted = new Date().toLocaleDateString('ar-SA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const printTimestamp = new Date().toLocaleString('ar-SA');

  const handlePrint = () => {
    window.print();
  };

  const copyGuestListAsText = () => {
    let text = `📋 قائمة وتصاريح دخول الضيوف والمركبات - ${clubName}\n`;
    text += `الفعالية: ${eventTitle}\n`;
    text += `التاريخ: ${eventDate || currentDateFormatted}\n`;
    text += `المقر: ${location}\n`;
    text += `إجمالي المركبات: ${guests.length} | إجمالي الأفراد: ${totalBeneficiaries}\n\n`;
    text += `---------------------------------------------------\n`;

    guests.forEach((g, idx) => {
      text += `${idx + 1}. الاسم: ${g.name}\n`;
      text += `   - الهوية: ${g.nationalId}\n`;
      text += `   - لوحة المركبة: ${g.plateNumber} (KSA)\n`;
      text += `   - نوع المركبة: ${g.carType} ${g.carModel !== '-' ? g.carModel : ''} (لون: ${g.carColor})\n`;
      text += `   - السائق/المالك: ${g.ownerName || g.name}\n`;
      text += `   - عدد المرافقين: ${g.companionsCount}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Print Specific CSS Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #security-print-document, #security-print-document * {
            visibility: visible;
          }
          #security-print-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15mm;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-['Tajawal',sans-serif]">
                  طباعة وتصدير تصاريح دخول الضيوف والمركبات
                </h3>
                <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  {guests.length} مركبة معتمدة
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-0.5">
                توليد بيان الحراسات الأمنية وبطاقات طبلون دخول السيارات لبوابات الجامعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode & Action Selector Bar (Hidden during print) */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          
          {/* Mode Switch Tabs */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPrintMode('manifest')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                printMode === 'manifest'
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span>جدول التصاريح الرسمي (الأمن والبوابات)</span>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode('dash_passes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                printMode === 'dash_passes'
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-orange-600" />
              <span>بطاقات دخول المركبات (لطبلون السيارة)</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyGuestListAsText}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="نسخ القائمة كنص لإرسالها عبر الواتساب أو البريد"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ القائمة كنص'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند / حفظ كـ PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 print:bg-white print:p-0">
          
          <div 
            id="security-print-document" 
            ref={printAreaRef}
            className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0"
            dir="rtl"
          >
            {/* ------------------------------------------------------------- */}
            {/* MODE 1: OFFICIAL SECURITY MANIFEST & GATE CLEARANCE TABLE */}
            {/* ------------------------------------------------------------- */}
            {printMode === 'manifest' && (
              <div className="space-y-6">
                
                {/* Official University / Security Header */}
                <div className="border-b-2 border-slate-900 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-right space-y-0.5">
                      <h4 className="text-xs text-slate-500 font-bold">المملكة العربية السعودية</h4>
                      <h2 className="text-base sm:text-lg font-black text-slate-950 font-['Tajawal',sans-serif]">
                        جامعة الملك فهد للبترول والمعادن
                      </h2>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                        عمادة شؤون الطلاب • إدارة النشاط الطلابي والأندية
                      </h3>
                      <p className="text-[11px] text-orange-800 font-bold">
                        قسم الأمن والسلامة الجامعية — تصاريح دخول بوابات الجامعة
                      </p>
                    </div>

                    <div className="text-left font-mono text-xs border border-slate-300 p-2.5 rounded-lg bg-slate-50">
                      <div className="font-bold text-slate-900">{requestId}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{printTimestamp}</div>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded">
                        معتمد أمنياً
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 py-1.5 px-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <h1 className="text-sm sm:text-base font-black text-orange-950 font-['Tajawal',sans-serif]">
                      بيان وتصريح دخول ضيوف ومركبات الفعالية الطلابية
                    </h1>
                  </div>
                </div>

                {/* Event & Clearance Meta Information */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-300 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">النادي المنظم:</span>
                    <strong className="text-slate-900 text-xs">{clubName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">عنوان ومسمى الفعالية:</span>
                    <strong className="text-slate-900 text-xs">{eventTitle}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">تاريخ ووقت الدخول:</span>
                    <strong className="text-slate-900 text-xs">
                      {eventDate || currentDateFormatted} {eventTime && `(${eventTime})`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">مقر الفعالية والوصول:</span>
                    <strong className="text-slate-900 text-xs">{location}</strong>
                  </div>

                  <div className="col-span-2 sm:col-span-4 border-t border-slate-200 pt-2 mt-1 flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      <span>إجمالي المركبات المصرحة: <strong>{guests.length} سيارة</strong></span>
                      <span>إجمالي الأفراد والمرافقين: <strong>{totalBeneficiaries} شخص</strong></span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      المشرف المسؤول: <strong>{supervisorName}</strong>
                    </div>
                  </div>
                </div>

                {/* Guests & Vehicles Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-orange-600" />
                    <span>قائمة الضيوف والمركبات المعتمدة لدخول البوابات:</span>
                  </h4>

                  {guests.length === 0 ? (
                    <div className="p-6 text-center border border-slate-200 rounded-xl text-xs text-slate-400">
                      لا توجد بيانات ضيوف مدخلة في هذا الطلب
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs border-collapse border border-slate-400">
                        <thead className="bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-400">
                          <tr>
                            <th className="p-2 border border-slate-300 text-center w-8">م</th>
                            <th className="p-2 border border-slate-300">اسم الضيف / الزائر</th>
                            <th className="p-2 border border-slate-300">الهوية الوطنية / الإقامة</th>
                            <th className="p-2 border border-slate-300 text-center">رقم اللوحة (KSA)</th>
                            <th className="p-2 border border-slate-300">نوع وموديل المركبة</th>
                            <th className="p-2 border border-slate-300">لون السيارة</th>
                            <th className="p-2 border border-slate-300">السائق / المالك</th>
                            <th className="p-2 border border-slate-300 text-center">المرافقين</th>
                            <th className="p-2 border border-slate-300 text-center w-20">توقيع البوابة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                          {guests.map((guest, idx) => (
                            <tr key={guest.id || idx} className="hover:bg-slate-50">
                              <td className="p-2 border border-slate-300 text-center font-bold text-slate-700">
                                {idx + 1}
                              </td>
                              <td className="p-2 border border-slate-300 font-bold text-slate-900">
                                {guest.name}
                              </td>
                              <td className="p-2 border border-slate-300 font-mono font-medium text-slate-800" dir="ltr">
                                {guest.nationalId}
                              </td>
                              <td className="p-2 border border-slate-300 text-center">
                                <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-950 border border-slate-400 rounded text-[11px] inline-block tracking-wider" dir="ltr">
                                  {guest.plateNumber}
                                </span>
                              </td>
                              <td className="p-2 border border-slate-300">
                                {guest.carType} {guest.carModel !== '-' ? `• ${guest.carModel}` : ''}
                              </td>
                              <td className="p-2 border border-slate-300">
                                {guest.carColor}
                              </td>
                              <td className="p-2 border border-slate-300 text-slate-700">
                                {guest.ownerName || guest.name}
                              </td>
                              <td className="p-2 border border-slate-300 text-center font-bold">
                                {guest.companionsCount > 0 ? guest.companionsCount : '0'}
                              </td>
                              <td className="p-2 border border-slate-300 text-center text-slate-300">
                                [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Gate Security Security Instructions & Notes */}
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>تنبيهات وتعليمات الحراسات الأمنية وبوابات الدخول:</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-900/90 pr-1 space-y-0.5">
                    <li>يسمح بدخول المركبات المذكورة بياناتها أعلاه عبر بوابات الجامعة المحددة خلال فترة الفعالية فقط.</li>
                    <li>يرجى من رجل الأمن مطابقة رقم اللوحة الإنجليزية وهوية قائد المركبة قبل منح الدخول.</li>
                    <li>يمنع الوقوف في المواقف المخصصة لمركبات الطوارئ وذوي الاحتياجات الخاصة.</li>
                  </ul>
                </div>

                {/* Official Signatures and Endorsements Footer */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-slate-900 text-center text-xs page-break-inside-avoid">
                  <div>
                    <p className="font-bold text-slate-900 mb-10">مسؤول النادي المنظم</p>
                    <p className="text-[11px] text-slate-600 font-medium">{clubName}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-10">مشرف الأمن والسلامة</p>
                    <p className="text-[11px] text-slate-600 font-medium">{supervisorName}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-10">إدارة الأمن الجامعي / ختم البوابة</p>
                    <p className="text-[11px] text-slate-400">........................</p>
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODE 2: INDIVIDUAL VEHICLE DASHBOARD ENTRY PASSES (BADGES) */}
            {/* ------------------------------------------------------------- */}
            {printMode === 'dash_passes' && (
              <div className="space-y-6">
                
                <div className="border-b-2 border-slate-900 pb-3 text-center">
                  <h2 className="text-base sm:text-lg font-black text-slate-950 font-['Tajawal',sans-serif]">
                    بطاقات وتصاريح دخول المركبات (لطبلون السيارة)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    يرجى طباعة وقص وتوزيع هذه البطاقات على الضيوف لوضعها بوضوح على طبلون المركبة عند البوابة
                  </p>
                </div>

                {guests.length === 0 ? (
                  <div className="p-8 text-center border border-slate-200 rounded-xl text-xs text-slate-400">
                    لا توجد مركبات مضافة لإصدار البطاقات
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guests.map((guest, idx) => (
                      <div 
                        key={guest.id || idx}
                        className="border-2 border-dashed border-slate-800 p-4 rounded-2xl bg-white relative space-y-3 page-break-inside-avoid shadow-xs"
                      >
                        {/* Cut Line Indicator */}
                        <div className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-bold text-slate-400 border border-slate-200 rounded">
                          ✂️ قص من هنا وضعها على الطبلون
                        </div>

                        {/* Badge Header */}
                        <div className="flex items-center justify-between border-b-2 border-orange-600 pb-2">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block">جامعة الملك فهد للبترول والمعادن</span>
                            <h4 className="text-xs sm:text-sm font-black text-orange-950 font-['Tajawal',sans-serif]">
                              تصريح دخول مركبة زائر
                            </h4>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Large License Plate Display Box */}
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-center font-mono" dir="ltr">
                          <div className="text-left">
                            <span className="text-[9px] text-amber-400 block font-bold">KSA PLATE</span>
                            <span className="text-base sm:text-lg font-black tracking-widest text-amber-300">
                              {guest.plateNumber}
                            </span>
                          </div>
                          <div className="w-9 h-9 bg-white text-slate-900 rounded-lg flex items-center justify-center font-sans font-bold text-[10px] shadow-xs">
                            KSA 🇸🇦
                          </div>
                        </div>

                        {/* Guest & Vehicle Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[9px] text-slate-400 block">اسم الضيف:</span>
                            <strong className="text-slate-900 block truncate">{guest.name}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">الهوية الوطنية:</span>
                            <strong className="text-slate-800 font-mono text-[10px]" dir="ltr">{guest.nationalId}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">نوع السيارة:</span>
                            <span className="text-slate-800 font-semibold">{guest.carType} {guest.carModel !== '-' ? guest.carModel : ''}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">لون السيارة:</span>
                            <span className="text-slate-800 font-semibold">{guest.carColor}</span>
                          </div>
                        </div>

                        {/* Event & Gate Info */}
                        <div className="text-[10px] space-y-0.5 border-t border-slate-200 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">الفعالية: <strong>{eventTitle}</strong></span>
                            <span className="text-slate-500">النادي: <strong>{clubName}</strong></span>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400">
                            <span>التاريخ: {eventDate || currentDateFormatted}</span>
                            <span>رقم التصريح: {requestId}-V{idx + 1}</span>
                          </div>
                        </div>

                        {/* Bottom verification badge */}
                        <div className="flex items-center justify-between text-[9px] bg-orange-50 text-orange-950 p-1.5 rounded-lg font-bold border border-orange-200">
                          <span>✓ مصرح بدخول بوابات الجامعة</span>
                          <span>المرافقين: {guest.companionsCount}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Modal Bottom Footer (Hidden during print) */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-500">
            💡 يمكنك استخدام اختصار <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold">Ctrl + P</kbd> للطباعة المباشرة
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إغلاق
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند الحالي</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
