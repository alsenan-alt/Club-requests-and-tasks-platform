import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Building2, 
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
  Globe,
  Edit3,
  AlertTriangle,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, STAFF_MEMBERS, CLUBS_LIST } from '../data/initialData';
import { ServiceItem, SecurityGuestEntry, ClubRequest } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: ClubRequest | null;
}

export const EditRequestModal: React.FC<Props> = ({ isOpen, onClose, request }) => {
  const { 
    services,
    editAndResubmitRequest, 
    staffMembers,
    t,
    tService,
    tDepartment,
    tField,
    tOption,
    tUnit,
    tDynamic,
    isRtl
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'info' | 'services' | 'response'>('info');

  // Event Data State
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: 'workshop',
    eventDate: '',
    startTime: '17:00',
    endTime: '21:00',
    locationSummary: '',
    expectedAttendees: 50,
    description: '',
    budget: '',
    presidentNotes: '',
  });

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [servicesData, setServicesData] = useState<Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sync state with incoming request
  useEffect(() => {
    if (request) {
      setFormData({
        eventTitle: request.eventTitle || '',
        eventType: request.eventType || 'workshop',
        eventDate: request.eventDate || '',
        startTime: request.startTime || '17:00',
        endTime: request.endTime || '21:00',
        locationSummary: request.locationSummary || '',
        expectedAttendees: request.expectedAttendees || 50,
        description: request.description || '',
        budget: request.budget || '',
        presidentNotes: '',
      });

      const sIds = (request.tasks || []).map(t => t.serviceId);
      setSelectedServiceIds(sIds);

      const sDataMap: Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }> = {};
      (request.tasks || []).forEach(t => {
        sDataMap[t.serviceId] = {
          serviceId: t.serviceId,
          priority: t.priority || 'normal',
          details: t.details || {},
        };
      });

      setServicesData(sDataMap);
      setCurrentTab('info');
      setFeedbackMessage(null);
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  const toggleServiceSelection = (service: ServiceItem) => {
    if (selectedServiceIds.includes(service.id)) {
      setSelectedServiceIds(prev => prev.filter(id => id !== service.id));
      const nextData = { ...servicesData };
      delete nextData[service.id];
      setServicesData(nextData);
    } else {
      setSelectedServiceIds(prev => [...prev, service.id]);
      
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
      alert(isRtl ? 'يرجى كتابة عنوان الفعالية' : 'Please enter event title');
      return;
    }
    if (selectedServiceIds.length === 0) {
      alert(isRtl ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Please select at least one service');
      return;
    }

    setIsSubmitting(true);
    const res = editAndResubmitRequest(request.id, {
      eventTitle: formData.eventTitle.trim(),
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      locationSummary: formData.locationSummary.trim(),
      expectedAttendees: Number(formData.expectedAttendees) || 50,
      description: formData.description.trim(),
      budget: formData.budget?.trim() || undefined,
      servicesData,
      presidentNotes: formData.presidentNotes.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'} 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-right"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between gap-4 shrink-0 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-amber-100 shadow-inner">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-900/60 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {request.requestNumber || 'طلب فعالية'}
                </span>
                <span className="text-xs font-semibold text-amber-100">
                  {request.clubName}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-['Tajawal',sans-serif] text-white mt-1">
                تعديل الطلب وإعادة الإرسال للمشرف الأكاديمي
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Instructions Box (Notice Banner) */}
        {(request.supervisorNotes || request.supervisorStatus === 'needs_info') && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-3.5 flex items-start gap-3 text-amber-950 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shrink-0 mt-0.5 shadow-xs">
              ⚠️
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-bold text-amber-950 text-sm">
                  ملاحظات المشرف ({request.supervisorName || 'المشرف الأكاديمي'}):
                </span>
                {request.updatedAt && (
                  <span className="text-[11px] text-amber-800">
                    آخر تحديث: {new Date(request.updatedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <p className="font-medium text-amber-900 mt-1 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-300/80">
                {request.supervisorNotes || 'يرجى مراجعة تفاصيل الفعالية واستكمال البيانات الناقصة لتتم الموافقة عليها.'}
              </p>
            </div>
          </div>
        )}

        {/* Success Feedback Alert */}
        {feedbackMessage && (
          <div className="bg-emerald-500 text-white p-3 text-center text-xs font-bold animate-in fade-in flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100/90 border-b border-slate-200 p-1.5 gap-1 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCurrentTab('info')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'info'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>1. تفاصيل الفعالية الأساسية</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('services')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'services'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>2. الخدمات والمهام ({selectedServiceIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('response')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'response'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>3. رد النادي والمراجعة</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: Event Basic Info */}
          {currentTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">
                  💡 إمكانية التعديل الشامل:
                </span>
                يمكنك تحديث عنوان الفعالية، التوقيت، المقر المقترح، الأعداد المتوقعة، والوصف، وسيتم إخطار المشرف الأكاديمي بالتعديلات فوراً.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان الفعالية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.eventTitle}
                    onChange={e => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
                    placeholder="مثال: المعرض التقني السنوي الثاني للذكاء الاصطناعي"
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نوع الفعالية
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData(prev => ({ ...prev, eventType: e.target.value as any }))}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="workshop">ورشة عمل تدريبية</option>
                    <option value="hackathon">هاكاثون ومسابقة برمجية</option>
                    <option value="exhibition">معرض طلابي / بوثات</option>
                    <option value="lecture">محاضرة ولقاء حواري</option>
                    <option value="sports">بطولة أو نشاط رياضي</option>
                    <option value="trip">رحلة ميدانية أو زيارة خارجية</option>
                    <option value="other">فعالية أخرى عامة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ الفعالية المقترح
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت البدء
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت الانتهاء
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المقر المقترح للفعالية
                  </label>
                  <input
                    type="text"
                    value={formData.locationSummary}
                    onChange={e => setFormData(prev => ({ ...prev, locationSummary: e.target.value }))}
                    placeholder="مثال: مبنى 70 - البهو الرئيسي / القاعة الكبرى"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    العدد المتوقع للمشاركين
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.expectedAttendees}
                    onChange={e => setFormData(prev => ({ ...prev, expectedAttendees: Number(e.target.value) }))}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الميزانية التقديرية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="مثال: 3,500 ريال (رعاية + صندوق النادي)"
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وصف الفعالية وأهدافها
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="اكتب نبذة واضحة عن الفعالية، الفئات المستهدفة، والمخرجات المتوقعة..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Services & Details */}
          {currentTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Service Selection Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 font-['Tajawal',sans-serif]">
                    الخدمات المطلوبة للفعالية (اختر أو عدّل الخدمات المطلوبة):
                  </h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {selectedServiceIds.length} خدمات محددة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {services.map(srv => {
                    const isSelected = selectedServiceIds.includes(srv.id);
                    const dept = DEPARTMENTS[srv.departmentId];
                    const localizedSrv = tService(srv.id, srv.name, srv.description);

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleServiceSelection(srv)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {getServiceIcon(srv.iconName)}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {localizedSrv.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {dept?.name || 'قسم معني'}
                            </span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-slate-50'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Forms Accordion */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 font-['Tajawal',sans-serif]">
                  تعبئة وتحديث تفاصيل كل خدمة:
                </h3>

                {selectedServiceIds.map((srvId, idx) => {
                  const srv = services.find(s => s.id === srvId);
                  if (!srv) return null;

                  const dept = DEPARTMENTS[srv.departmentId];
                  const staff = staffMembers.find(sm => sm.id === srv.staffId) || STAFF_MEMBERS.find(sm => sm.id === srv.staffId);
                  const currentData = servicesData[srv.id] || { serviceId: srv.id, priority: 'normal', details: {} };
                  const localizedSrv = tService(srv.id, srv.name, srv.description);

                  return (
                    <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{localizedSrv.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${dept?.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                                {dept?.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                              المسؤول المباشر: <strong className="text-slate-700">{staff?.shortName}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Priority Selector */}
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-600">الأولوية:</label>
                          <select
                            value={currentData.priority}
                            onChange={e => handlePriorityChange(srv.id, e.target.value as any)}
                            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="normal">عادية</option>
                            <option value="high">عالية الأهمية</option>
                            <option value="urgent">عاجلة جداً</option>
                          </select>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="p-4 space-y-4">
                        {srv.id === 'srv_security_permits' && (
                          <div className="mb-4">
                            <SecurityGuestListManager
                              guests={(currentData.details?.guestsList as SecurityGuestEntry[]) || []}
                              eventTitle={formData.eventTitle}
                              clubName={request.clubName}
                              eventDate={formData.eventDate}
                              eventTime={`${formData.startTime} - ${formData.endTime}`}
                              location={formData.locationSummary}
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
                              const fieldLabel = tField(field.id, field.label);
                              const fieldUnit = tUnit(field.unit);
                              const placeholder = field.placeholder ? tDynamic(field.placeholder) : '';

                              if (field.type === 'select') {
                                return (
                                  <div key={field.id}>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      {fieldLabel} {field.required && <span className="text-rose-500">*</span>}
                                    </label>
                                    <select
                                      value={val}
                                      onChange={e => handleFieldChange(srv.id, field.id, e.target.value)}
                                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
                                    >
                                      {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{tOption(opt)}</option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              }

                              if (field.type === 'textarea') {
                                return (
                                  <div key={field.id} className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      {fieldLabel} {field.required && <span className="text-rose-500">*</span>}
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={val}
                                      onChange={e => handleFieldChange(srv.id, field.id, e.target.value)}
                                      placeholder={placeholder}
                                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
                                    />
                                  </div>
                                );
                              }

                              if (field.type === 'checkbox') {
                                return (
                                  <div key={field.id} className="sm:col-span-2 flex items-center gap-2 pt-2">
                                    <input
                                      type="checkbox"
                                      id={`chk-edit-${srv.id}-${field.id}`}
                                      checked={Boolean(val)}
                                      onChange={e => handleFieldChange(srv.id, field.id, e.target.checked)}
                                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <label htmlFor={`chk-edit-${srv.id}-${field.id}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                                      {fieldLabel}
                                    </label>
                                  </div>
                                );
                              }

                              if (field.type === 'url') {
                                return (
                                  <div key={field.id} className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                      {fieldLabel} {field.required && <span className="text-rose-500">*</span>}
                                    </label>
                                    <div className="relative">
                                      <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                                        <Globe className="w-4 h-4 text-blue-500" />
                                      </div>
                                      <input
                                        type="url"
                                        value={val}
                                        onChange={e => handleFieldChange(srv.id, field.id, e.target.value)}
                                        placeholder={placeholder || 'https://...'}
                                        dir="ltr"
                                        className={`w-full text-xs p-2.5 ${isRtl ? 'pr-9' : 'pl-9'} rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono text-left font-semibold`}
                                      />
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div key={field.id}>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {fieldLabel} {fieldUnit && <span className="text-slate-400">({fieldUnit})</span>} {field.required && <span className="text-rose-500">*</span>}
                                  </label>
                                  <input
                                    type={field.type}
                                    value={val}
                                    onChange={e => handleFieldChange(srv.id, field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
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

            </div>
          )}

          {/* TAB 3: Response Notes & Final Review */}
          {currentTab === 'response' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* President Response to Supervisor */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-300 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    💬
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 font-['Tajawal',sans-serif]">
                      رد رئيس النادي وإيضاح التعديلات للمشرف الأكاديمي:
                    </h4>
                    <p className="text-xs text-amber-800">
                      يمكنك كتابة رسالة توضيحية للمشرف تشرح فيها ما تم تعديله أو الإجابة عن استفساراته.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={formData.presidentNotes}
                  onChange={e => setFormData(prev => ({ ...prev, presidentNotes: e.target.value }))}
                  placeholder="مثال: مرحباً سعادة المشرف، تم تعديل المقر إلى البهو الرئيسي، وتحديث عدد الكراسي والتصاريح الأمنية وفق توجيهاتكم الكريمة..."
                  className="w-full text-xs p-3 rounded-xl bg-white border border-amber-300 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Summary of Edited Request */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ملخص الطلب بعد التعديل:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">عنوان الفعالية:</span>
                    <span className="font-bold text-slate-800">{formData.eventTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاريخ ووقت الفعالية:</span>
                    <span className="font-bold text-slate-800">{formData.eventDate} ({formData.startTime} - {formData.endTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المقر المقترح:</span>
                    <span className="font-bold text-slate-800">{formData.locationSummary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">الخدمات المطلوبة:</span>
                    <span className="font-bold text-amber-600">{selectedServiceIds.length} خدمات موجهة</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950 font-bold">
                <span className="text-lg">🚀</span>
                <span>عند النقر على زر التأكيد، ستتم إعادة إرسال الفعالية للمشرف الأكاديمي للاعتماد المباشر وتحديث الحالة في السحابة فوراً.</span>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            {currentTab !== 'info' ? (
              <button
                type="button"
                onClick={() => {
                  if (currentTab === 'response') setCurrentTab('services');
                  else if (currentTab === 'services') setCurrentTab('info');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentTab === 'info' && (
              <button
                type="button"
                onClick={() => {
                  if (!formData.eventTitle.trim()) {
                    alert('يرجى كتابة عنوان الفعالية');
                    return;
                  }
                  setCurrentTab('services');
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>التالي: مراجعة الخدمات</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}

            {currentTab === 'services' && (
              <button
                type="button"
                onClick={() => {
                  if (selectedServiceIds.length === 0) {
                    alert('يرجى اختيار خدمة واحدة على الأقل');
                    return;
                  }
                  setCurrentTab('response');
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>التالي: كتابة الرد والمراجعة</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}

            {currentTab === 'response' && (
              <button
                type="button"
                id="btn-submit-edit-request"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ring-2 ring-amber-500/30"
              >
                <Send className="w-4 h-4" />
                <span>حفظ التعديلات وإعادة الإرسال للمشرف للاعتماد</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
