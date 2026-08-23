import React from 'react';
import { Tag, ShieldCheck, Users, Info, Globe, ExternalLink } from 'lucide-react';
import { Task, SecurityGuestEntry } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';

interface Props {
  task: Task;
}

const FIELD_LABELS: Record<string, string> = {
  bus_count: 'عدد الحافلات المطلوبة',
  pickup_location: 'نقطة الانطلاق',
  destination: 'الوجهة / مسار الرحلة',
  passenger_count: 'العدد التقديري للركاب',
  pickup_time: 'وقت التحرك',
  return_time: 'وقت العودة التقريبي',
  chairs_count: 'عدد الكراسي',
  tables_count: 'عدد الطاولات',
  need_stage: 'تجهيز مسرح / ستيج',
  need_carpet: 'السجاد والممرات الحمراء',
  partitions_count: 'قواطع البارتيشن',
  crowd_barriers: 'حواجز تنظيم الحشود',
  placement_notes: 'ملاحظات وتوزيع الأثاث',
  power_outlets: 'عدد نقاط وتوصيلات الكهرباء',
  need_lighting: 'تجهيز الإضاءات والكشافات',
  sound_system: 'الأنظمة الصوتية والميكروفونات',
  screens_projectors: 'شاشات العرض والبروجكتر',
  wifi_support: 'شبكة الإنترنت والواي فاي',
  technical_assistant: 'طلب فني صوتيات وتقنية ميداني',
  channel: 'قنوات نشر الإعلان',
  target_audience: 'الفئة المستهدفة للإعلان',
  announcement_title: 'عنوان الإعلان المقترح',
  announcement_body: 'نص مسودة الإعلان',
  registration_link: 'رابط التسجيل / النموذج',
  broadcast_date: 'التاريخ المفضل لنشر الإعلان',
  print_types: 'نوع المطبوعات المطلوبة',
  certificates_count: 'عدد الشهادات المطلوب طباعتها',
  paper_prints_count: 'عدد المطبوعات الورقية / البوسترات',
  paper_size: 'مقاس الورق ونوعيته',
  delivery_deadline: 'موعد استلام المطبوعات',
  media_services: 'الخدمات الإعلامية المطلوبة',
  coverage_duration: 'مدة التغطية الإعلامية',
  tweet_draft: 'مسودة التغريدة أو الهاشتاق',
  security_type: 'الخدمة الأمنية المطلوبة',
  visitor_count: 'عدد الزوار أو السيارات',
  visitor_details: 'بيانات الضيوف السابقة',
  special_letter_details: 'تفاصيل الخطاب الرسمي للأمن',
  catering_type: 'نوع الضيافة المطلوبة',
  guest_count: 'عدد المستفيدين من الضيافة',
  admin_approval_note: 'جهة الاعتماد للضيافة',
  dietary_notes: 'ملاحظات التغذية والتوقيت',
  hall_type: 'نوع وموقع القاعة المطلوبة',
  attendees_capacity: 'السعة المطلوبة للقاعة',
  building_number: 'المبنى المطلوب',
  facility_area: 'المنطقة أو البهو',
  setup_date: 'توقيت التجهيز',
};

const isUrl = (val: any): boolean => {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return /^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed);
};

const formatUrl = (val: string): string => {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const TaskRequirementsViewer: React.FC<Props> = ({ task }) => {
  const details = task.details || {};
  const hasGuests = Array.isArray(details.guestsList) && details.guestsList.length > 0;
  const standardEntries = Object.entries(details).filter(([k, v]) => k !== 'guestsList' && v !== undefined && v !== '');

  return (
    <div className="space-y-3">
      {/* Attached External URL / Landing Page by Employee */}
      {task.externalUrl && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-center justify-between gap-3 flex-wrap shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-blue-950 block">رابط الصفحة / الموقع المرفق من الموظف:</span>
              <span className="text-[11px] text-blue-700 font-mono truncate block max-w-xs sm:max-w-md" dir="ltr">
                {task.externalUrl}
              </span>
            </div>
          </div>

          <a
            href={formatUrl(task.externalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            title="الانتقال إلى الصفحة الخارجية في نافذة جديدة"
          >
            <span>الانتقال إلى الصفحة</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Security Guest List if present */}
      {hasGuests && (
        <div className="pt-1">
          <SecurityGuestListManager
            guests={details.guestsList as SecurityGuestEntry[]}
            readOnly={true}
          />
        </div>
      )}

      {/* Standard Details Grid */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>المواصفات والمتطلبات المسجلة:</span>
        </h5>

        {standardEntries.length === 0 && !hasGuests && !task.externalUrl ? (
          <p className="text-xs text-slate-400">لا توجد تفاصيل إضافية مسجلة لهذه الخدمة.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {standardEntries.map(([key, val]) => {
              const label = FIELD_LABELS[key] || key;
              const isValUrl = isUrl(val) || key.toLowerCase().includes('link') || key.toLowerCase().includes('url');
              const displayVal = typeof val === 'boolean' 
                ? (val ? 'نعم' : 'لا') 
                : typeof val === 'object'
                  ? JSON.stringify(val)
                  : String(val);

              return (
                <div key={key} className={`p-2.5 rounded-lg border shadow-2xs ${isValUrl ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block mb-0.5">{label}:</span>
                  {isValUrl ? (
                    <a
                      href={formatUrl(displayVal)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200 transition-colors max-w-full truncate group"
                      title="الانتقال إلى الرابط الخارجي"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate" dir="ltr">{displayVal}</span>
                    </a>
                  ) : (
                    <span className="font-bold text-slate-800 break-words">{displayVal}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
