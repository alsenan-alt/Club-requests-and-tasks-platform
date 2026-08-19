import React from 'react';
import { Tag, ShieldCheck, Users, Info } from 'lucide-react';
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

export const TaskRequirementsViewer: React.FC<Props> = ({ task }) => {
  const details = task.details || {};
  const hasGuests = Array.isArray(details.guestsList) && details.guestsList.length > 0;
  const standardEntries = Object.entries(details).filter(([k, v]) => k !== 'guestsList' && v !== undefined && v !== '');

  return (
    <div className="space-y-3">
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
          <span>المواصفات والمتطلبات المسجلة من النادي:</span>
        </h5>

        {standardEntries.length === 0 && !hasGuests ? (
          <p className="text-xs text-slate-400">لا توجد تفاصيل إضافية مسجلة لهذه الخدمة.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {standardEntries.map(([key, val]) => {
              const label = FIELD_LABELS[key] || key;
              const displayVal = typeof val === 'boolean' 
                ? (val ? 'نعم' : 'لا') 
                : typeof val === 'object'
                  ? JSON.stringify(val)
                  : String(val);

              return (
                <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block mb-0.5">{label}:</span>
                  <span className="font-bold text-slate-800 break-words">{displayVal}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
