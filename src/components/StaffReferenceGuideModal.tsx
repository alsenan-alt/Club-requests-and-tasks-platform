import React from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, Building2, User, Bus, Armchair, Zap, Laptop, DoorOpen, Megaphone, Printer, Camera, ShieldCheck, Utensils } from 'lucide-react';
import { STAFF_MEMBERS } from '../data/initialData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffReferenceGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الدليل المرجعي الرسمي لتوزيع المهام</span>
            </div>
            <h2 className="text-xl font-bold font-['Tajawal',sans-serif]">
              دليل مهام ومسؤوليات موظفي إدارة النشاط الطلابي
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              التوزيع المعتمد للخدمات والأقسام الموجهة لرؤساء الأندية الطلابية
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Cards of the 3 Staff Members */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          
          {/* 1. أ. حسين رمضان */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-xs p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">1. الأستاذ حسين رمضان</h3>
                  <p className="text-xs text-slate-500">مسؤول الحركة والإسكان والكهرباء وIT وإدارة المباني</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                ✓ جميع الإدارات والخدمات تُشارك مع الطلاب
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700">
              
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                  <Bus className="w-4 h-4 text-blue-600" />
                  <span>قسم الحركة:</span>
                </div>
                <p className="text-slate-600"><strong>الخدمة:</strong> حجز الباصات (حافلات النقل والرحلات والزيارات).</p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                  <Armchair className="w-4 h-4 text-indigo-600" />
                  <span>قسم الإسكان والخدمات المكتبية:</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> توفير الكراسي، الطاولات، السجاد، الستيج (المسرح)، البارتيشن، حواجز فعاليات التنظيم.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>قسم الكهرباء:</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> توصيلات الكهرباء مع الإضاءات والأنوار والإنارة الخاصة.</p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-100">
                <div className="font-bold text-cyan-900 flex items-center gap-1.5 mb-1">
                  <Laptop className="w-4 h-4 text-cyan-600" />
                  <span>قسم IT (تقنية المعلومات):</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> أنظمة صوتية، توفير الشاشات، توفير الإنترنت (الواي فاي).</p>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 md:col-span-2">
                <div className="font-bold text-sky-900 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>قسم إدارة الفعاليات:</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> حجز المباني (المبنى 70، المبنى 54، المبنى 42، المبنى 10، المبنى 60).</p>
              </div>

            </div>
          </div>

          {/* 2. أ. موسى آل سنان */}
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
            
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">2. الأستاذ موسى آل سنان</h3>
                  <p className="text-xs text-slate-500">مسؤول حجز القاعات والإعلانات والمطابع والعلاقات العامة</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                ✓ جميع الإدارات والخدمات تُشارك مع الطلاب
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700">
              
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <DoorOpen className="w-4 h-4 text-emerald-600" />
                  <span>حجز القاعات والملاعب:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  يشمل القاعات من قبل المسجل (يُبحث أن يكون التسجيل مباشرًا من رئيس النادي)، وقاعات إدارة النشاط، وقاعات تُحجز عن طريق رئيس القسم (بما فيها الملاعب).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                <div className="font-bold text-teal-900 flex items-center gap-1.5 mb-1">
                  <Megaphone className="w-4 h-4 text-teal-600" />
                  <span>إعلان الفعاليات:</span>
                </div>
                <p className="text-slate-600">عن طريق الإيميل الجامعي الموحد أو عبر منصة The Fives.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                  <Printer className="w-4 h-4 text-purple-600" />
                  <span>قسم المطابع:</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> طباعة المطبوعات الورقية والبوسترات، وطباعة الشهادات المعتمدة.</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <div className="font-bold text-rose-900 flex items-center gap-1.5 mb-1">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span>التواصل مع العلاقات العامة:</span>
                </div>
                <p className="text-slate-600">التصوير الفوتوغرافي والتوثيق، ونشر التغريدات والتغطيات الرسمية.</p>
              </div>

            </div>
          </div>

          {/* 3. أ. مصلح الشمراني */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-600 to-orange-600"></div>
            
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">3. الأستاذ مصلح الشمراني</h3>
                  <p className="text-xs text-slate-500">مسؤول الأمن والسلامة وتصاريح الدخول والخدمات الغذائية الخاصة</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700">
              
              <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-orange-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>قسم الأمن:</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">متاح للطلاب</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> التغطيات الأمنية للفعاليات، تصاريح الدخول، طلبات خاصة تحتاج خطابًا رسميًا.</p>
              </div>

              <div className="p-3 rounded-xl bg-yellow-50/50 border border-yellow-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-yellow-900 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-yellow-600" />
                    <span>الخدمات الغذائية:</span>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">لا تُشارك مع الطلاب</span>
                </div>
                <p className="text-slate-600"><strong>الخدمات:</strong> توفير الضيافة ووجبات العشاء للفعاليات الخاصة أو لإدارة النشاط فقط.</p>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};
