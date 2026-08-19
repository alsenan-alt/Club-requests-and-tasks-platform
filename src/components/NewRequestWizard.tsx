import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Building2, 
  Calendar, 
  Clock, 
  Users, 
  Bus, 
  Armchair, 
  Zap, 
  Laptop, 
  DoorOpen, 
  Megaphone, 
  Printer, 
  Camera, 
  ShieldCheck, 
  Utensils, 
  Send,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, STAFF_MEMBERS, CLUBS_LIST } from '../data/initialData';
import { ServiceItem, SecurityGuestEntry } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestWizard: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    activeClubName, 
    currentUser,
    currentRole,
    clubsList,
    services,
    createNewRequest, 
    setSelectedRequestId 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    clubName: currentUser?.clubName || activeClubName || CLUBS_LIST[0],
    presidentName: currentUser?.name || 'رئيس النادي الطلابي',
    presidentPhone: currentUser?.phone || '0551122334',
    presidentEmail: currentUser?.email || 'club.president@student.kfupm.edu.sa',
    eventTitle: '',
    eventType: 'workshop',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '21:00',
    locationSummary: 'مبنى 70 - البهو الرئيسي',
    expectedAttendees: 75,
    description: '',
    budget: '',
  });

  // Step 2 Selected Services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'srv_buildings_booking',
    'srv_furniture_logistics',
    'srv_announcements',
  ]);

  // Step 3 Service Specific Details
  const [servicesData, setServicesData] = useState<Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>>({
    srv_buildings_booking: {
      serviceId: 'srv_buildings_booking',
      priority: 'high',
      details: {
        building_number: 'مبنى 70 (المركز الثقافي / المعارض)',
        facility_area: 'البهو الرئيسي',
        setup_date: 'قبل الفعالية بساعتين',
      },
    },
    srv_furniture_logistics: {
      serviceId: 'srv_furniture_logistics',
      priority: 'normal',
      details: {
        chairs_count: 80,
        tables_count: 12,
        need_stage: 'نعم - منصة إلقاء صغيرة',
        need_carpet: 'لا يلزم',
        partitions_count: 4,
        crowd_barriers: 6,
        placement_notes: 'توزيع الكراسي بنظام المسرح مع ممر أوسط واسع',
      },
    },
    srv_announcements: {
      serviceId: 'srv_announcements',
      priority: 'normal',
      details: {
        channel: 'كلاهما (الإيميل الجامعي + The Fives)',
        target_audience: 'جميع طلاب الجامعة',
        announcement_title: '',
        announcement_body: '',
      },
    },
  });

  if (!isOpen) return null;

  const toggleServiceSelection = (service: ServiceItem) => {
    if (selectedServiceIds.includes(service.id)) {
      setSelectedServiceIds(prev => prev.filter(id => id !== service.id));
      const nextData = { ...servicesData };
      delete nextData[service.id];
      setServicesData(nextData);
    } else {
      setSelectedServiceIds(prev => [...prev, service.id]);
      
      // initialize default field values
      const initialDetails: Record<string, any> = {};
      service.fields.forEach(f => {
        if (f.defaultValue !== undefined) {
          initialDetails[f.id] = f.defaultValue;
        }
      });

      setServicesData(prev => ({
        ...prev,
        [service.id]: {
          serviceId: service.id,
          priority: 'normal',
          details: initialDetails,
        },
      }));
    }
  };

  const handleFieldChange = (serviceId: string, fieldId: string, value: any) => {
    setServicesData(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        details: {
          ...prev[serviceId]?.details,
          [fieldId]: value,
        },
      },
    }));
  };

  const handlePriorityChange = (serviceId: string, priority: 'normal' | 'high' | 'urgent') => {
    setServicesData(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        priority,
      },
    }));
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bus': return <Bus className="w-5 h-5" />;
      case 'Armchair': return <Armchair className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'DoorOpen': return <DoorOpen className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventTitle.trim()) {
      alert('يرجى كتابة عنوان الفعالية');
      return;
    }
    if (selectedServiceIds.length === 0) {
      alert('يرجى اختيار خدمة واحدة على الأقل');
      return;
    }

    const created = createNewRequest({
      ...formData,
      servicesData,
    });

    setSelectedRequestId(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Wizard Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 border-b border-emerald-900/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>معالج تقديم طلب فعالية وتوجيه المهام</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Tajawal',sans-serif]">
                طلب فعالية جديدة مع التوزيع الآلي للمهام
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
            
            <div className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${
              currentStep >= 1 ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-slate-700 text-slate-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <span>بيانات الفعالية</span>
            </div>

            <div className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${
              currentStep >= 2 ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-slate-700 text-slate-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <span>اختيار الخدمات</span>
            </div>

            <div className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${
              currentStep >= 3 ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-slate-700 text-slate-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep > 3 ? 'bg-emerald-500 text-white' : currentStep === 3 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
              <span>تفاصيل الخدمات</span>
            </div>

            <div className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${
              currentStep === 4 ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-slate-700 text-slate-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep === 4 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                4
              </div>
              <span>معاينة التوجيه والاعتماد</span>
            </div>

          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* STEP 1: Basic Event & Club Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <span className="font-bold">المرحلة الأولى:</span> قم بتعبئة بيانات الفعالية الأساسية. في الخطوة التالية، ستتمكن من تحديد الخدمات المطلوبة ليقوم النظام بتوجيهها آلياً للموظفين المعنيين (أ. حسين رمضان، أ. موسى آل سنان، أ. مصلح الشمراني).
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم النادي الطلابي مقدم الطلب <span className="text-rose-500">*</span>
                  </label>
                  {currentRole === 'club_president' && currentUser?.clubName ? (
                    <div className="w-full text-xs font-bold p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between">
                      <span>{currentUser.clubName}</span>
                      <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-800">حساب موثق ومقفل</span>
                    </div>
                  ) : (
                    <select
                      value={formData.clubName}
                      onChange={e => setFormData({ ...formData, clubName: e.target.value })}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {clubsList.map(club => (
                        <option key={club} value={club}>{club}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم رئيس النادي / المفوض بالطلب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.presidentName}
                    onChange={e => setFormData({ ...formData, presidentName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="الاسم الكامل"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الجوال للتواصل والمتابعة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.presidentPhone}
                    onChange={e => setFormData({ ...formData, presidentPhone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-left dir-ltr"
                    placeholder="05xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني الجامعي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.presidentEmail}
                    onChange={e => setFormData({ ...formData, presidentEmail: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-left dir-ltr"
                    placeholder="student@kfupm.edu.sa"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  عنوان الفعالية البارز <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eventTitle}
                  onChange={e => setFormData({ ...formData, eventTitle: e.target.value })}
                  className="w-full text-sm font-bold p-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="مثال: منتدى الابتكار وريادة الأعمال 2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نوع الفعالية
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="hackathon">هاكاثون ومنافسة برمجية</option>
                    <option value="workshop">ورشة عمل تدريبية</option>
                    <option value="exhibition">معرض مفتوح</option>
                    <option value="lecture">محاضرة وندوة علمية</option>
                    <option value="sports">بطولة رياضية</option>
                    <option value="trip">رحلة ميدانية وزيارة</option>
                    <option value="other">فعالية أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تاريخ الفعالية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    العدد المتوقع للمشاركين
                  </label>
                  <input
                    type="number"
                    value={formData.expectedAttendees}
                    onChange={e => setFormData({ ...formData, expectedAttendees: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    وقت البدء والانتهاء
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المقر المقترح للفعالية
                  </label>
                  <input
                    type="text"
                    value={formData.locationSummary}
                    onChange={e => setFormData({ ...formData, locationSummary: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="مثال: مبنى 70 - البهو الرئيسي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نبذة ووصف الفعالية والأهداف
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="اكتب نبذة مختصرة عن الفعالية، الفئات المستهدفة، والمخرجات المرجوة..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Multi-Service Picker Grouped by Staff & Department */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-950">
                  <span className="font-bold">المرحلة الثانية:</span> اختر الخدمات والتجهيزات التي تحتاجها فعاليتك. يوضح كل قسم اسم الموظف المسؤول الذي ستوجه إليه المهمة تلقائياً.
                </div>
              </div>

              {/* Group 1: أ. حسين رمضان */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">الأستاذ حسين رمضان</h3>
                      <p className="text-[11px] text-slate-500">مسؤول الحركة • الإسكان • الكهرباء • تقنية المعلومات IT • حجز المباني</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                    5 إدارات معتمدة
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.filter(s => s.staffId === 'hussein_ramadan').map(srv => {
                    const isSelected = selectedServiceIds.includes(srv.id);
                    const dept = DEPARTMENTS[srv.departmentId];

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleServiceSelection(srv)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center text-white shrink-0 transition-colors ${
                          isSelected ? 'bg-blue-600' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept.badgeBg}`}>
                              {dept.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: أ. موسى آل سنان */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">الأستاذ موسى آل سنان</h3>
                      <p className="text-[11px] text-slate-500">مسؤول حجز القاعات • إعلان الفعاليات • المطابع والشهادات • العلاقات العامة</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    4 إدارات معتمدة
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.filter(s => s.staffId === 'mousa_alsinan').map(srv => {
                    const isSelected = selectedServiceIds.includes(srv.id);
                    const dept = DEPARTMENTS[srv.departmentId];

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleServiceSelection(srv)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center text-white shrink-0 transition-colors ${
                          isSelected ? 'bg-emerald-600' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept.badgeBg}`}>
                              {dept.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: أ. مصلح الشمراني */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">الأستاذ مصلح الشمراني</h3>
                      <p className="text-[11px] text-slate-500">مسؤول قسم الأمن وتصاريح الدخول • الخدمات الغذائية والضيافة</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    الأمن والسلامة
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.filter(s => s.staffId === 'musleh_alshamrani').map(srv => {
                    const isSelected = selectedServiceIds.includes(srv.id);
                    const dept = DEPARTMENTS[srv.departmentId];

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleServiceSelection(srv)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center text-white shrink-0 transition-colors ${
                          isSelected ? 'bg-amber-600' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept.badgeBg}`}>
                              {dept.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {srv.description}
                          </p>
                          {srv.restrictedToVip && (
                            <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mt-1.5">
                              ⚠️ خاص بالفعاليات الرسمية أو إدارة النشاط
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>تم تحديد <strong className="text-emerald-700">{selectedServiceIds.length}</strong> خدمات مطلوبة للفعالية</span>
                {selectedServiceIds.length === 0 && (
                  <span className="text-rose-600 font-bold">يرجى تحديد خدمة واحدة على الأقل للمتابعة</span>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Configure Service Details */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <span className="font-bold">المرحلة الثالثة:</span> تفاصيل المتطلبات لكل خدمة. املأ الأعداد والمواصفات الدقيقة لتمكين الموظفين من تجهيزها بسرعة وبدقة.
                </div>
              </div>

              {selectedServiceIds.map(serviceId => {
                const srv = services.find(s => s.id === serviceId);
                if (!srv) return null;
                const dept = DEPARTMENTS[srv.departmentId];
                const staff = STAFF_MEMBERS.find(sm => sm.id === srv.staffId);
                const currentData = servicesData[serviceId] || { serviceId, priority: 'normal', details: {} };

                return (
                  <div key={srv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                          {getServiceIcon(srv.iconName)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{srv.name}</h4>
                          <span className="text-[11px] text-slate-500">
                            موجه تلقائياً إلى: <strong className="text-slate-800">{staff?.shortName}</strong> ({dept.name})
                          </span>
                        </div>
                      </div>

                      {/* Priority selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-slate-600">أولوية المهمة:</label>
                        <select
                          value={currentData.priority}
                          onChange={e => handlePriorityChange(srv.id, e.target.value as any)}
                          className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="normal">عادية</option>
                          <option value="high">عالية الأهمية</option>
                          <option value="urgent">عاجلة جداً</option>
                        </select>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                      {srv.id === 'srv_security_permits' && (
                        <div className="mb-4">
                          <SecurityGuestListManager
                            guests={(currentData.details?.guestsList as SecurityGuestEntry[]) || []}
                            onChange={(newGuests) => {
                              handleFieldChange(srv.id, 'guestsList', newGuests);
                              handleFieldChange(srv.id, 'visitor_count', newGuests.length);
                            }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {srv.fields
                          .filter(field => !(srv.id === 'srv_security_permits' && (field.id === 'visitor_details' || field.id === 'visitor_count')))
                          .map(field => {
                          const val = currentData.details?.[field.id] ?? field.defaultValue ?? '';

                          if (field.type === 'select') {
                            return (
                              <div key={field.id}>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                <select
                                  value={val}
                                  onChange={e => handleFieldChange(srv.id, field.id, e.target.value)}
                                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                >
                                  {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          }

                          if (field.type === 'textarea') {
                            return (
                              <div key={field.id} className="sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                <textarea
                                  rows={2}
                                  value={val}
                                  onChange={e => handleFieldChange(srv.id, field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            );
                          }

                          if (field.type === 'checkbox') {
                            return (
                              <div key={field.id} className="sm:col-span-2 flex items-center gap-2 pt-2">
                                <input
                                  type="checkbox"
                                  id={`chk-${srv.id}-${field.id}`}
                                  checked={Boolean(val)}
                                  onChange={e => handleFieldChange(srv.id, field.id, e.target.checked)}
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor={`chk-${srv.id}-${field.id}`} className="text-xs font-semibold text-slate-800 cursor-pointer">
                                  {field.label}
                                </label>
                              </div>
                            );
                          }

                          return (
                            <div key={field.id}>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {field.label} {field.unit && <span className="text-slate-400">({field.unit})</span>} {field.required && <span className="text-rose-500">*</span>}
                              </label>
                              <input
                                type={field.type}
                                value={val}
                                onChange={e => handleFieldChange(srv.id, field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 4: Smart Task Routing Preview & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">معاينة محرك التوجيه الآلي للمهام</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    سيقوم النظام فور نقرك على "تأكيد وإرسال الطلب" بتفكيك الطلب إلى مهام فرعية مستقلة وإرسالها فورياً إلى صناديق المهام للموظفين المعنيين:
                  </p>
                </div>
              </div>

              {/* Event Summary Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-3">{formData.eventTitle || 'فعالية بدون عنوان'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="block text-slate-400 text-[11px]">النادي مقدم الطلب:</span>
                    <span className="font-bold text-slate-800">{formData.clubName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">تاريخ الفعالية:</span>
                    <span className="font-bold text-slate-800">{formData.eventDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">التوقيت:</span>
                    <span className="font-bold text-slate-800">{formData.startTime} - {formData.endTime}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">الحضور المتوقع:</span>
                    <span className="font-bold text-slate-800">{formData.expectedAttendees} مشارك</span>
                  </div>
                </div>
              </div>

              {/* Dispatching Tree */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  المهام التي ستوجه تلقائياً ({selectedServiceIds.length} مهام):
                </h4>

                <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {selectedServiceIds.map((serviceId, idx) => {
                    const srv = services.find(s => s.id === serviceId);
                    if (!srv) return null;
                    const dept = DEPARTMENTS[srv.departmentId];
                    const staff = STAFF_MEMBERS.find(sm => sm.id === srv.staffId);
                    const srvData = servicesData[serviceId];

                    return (
                      <div key={srv.id} className="p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept.badgeBg}`}>
                                {dept.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              المسؤول المباشر: <span className="font-bold text-slate-700">{staff?.shortName}</span> ({staff?.phone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            srvData?.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : srvData?.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            أولوية {srvData?.priority === 'urgent' ? 'عاجلة' : srvData?.priority === 'high' ? 'عالية' : 'عادية'}
                          </span>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            جاهز للتوجيه الفوري ➔
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Wizard Footer Buttons */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الخطوة السابقة</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (currentStep === 1 && !formData.eventTitle.trim()) {
                  alert('يرجى كتابة عنوان الفعالية');
                  return;
                }
                if (currentStep === 2 && selectedServiceIds.length === 0) {
                  alert('يرجى اختيار خدمة واحدة على الأقل');
                  return;
                }
                setCurrentStep((prev) => (prev + 1) as any);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-500/20"
            >
              <span>متابعة للخطوة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-submit-new-request"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ring-2 ring-emerald-500/30"
            >
              <Send className="w-4 h-4" />
              <span>تأكيد وإرسال وتوجيه المهام تلقائياً</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
