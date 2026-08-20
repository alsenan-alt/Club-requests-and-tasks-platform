import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Settings2, 
  RotateCcw, 
  Tag, 
  Layers, 
  HelpCircle, 
  CheckCircle2,
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
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/initialData';
import { StaffMember, ServiceItem, ServiceField } from '../types';
import { EditServiceTitleModal } from './EditServiceTitleModal';

interface Props {
  staff?: StaffMember;
}

export const StaffServicesCatalogManager: React.FC<Props> = ({ staff }) => {
  const { 
    services, 
    addServiceField, 
    updateServiceField, 
    deleteServiceField, 
    resetServiceToDefault,
    currentRole 
  } = useApp();

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [addingFieldToServiceId, setAddingFieldToServiceId] = useState<string | null>(null);
  const [editingFieldInfo, setEditingFieldInfo] = useState<{ serviceId: string; field: ServiceField } | null>(null);
  const [editingServiceForTitle, setEditingServiceForTitle] = useState<ServiceItem | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New field form state
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<ServiceField['type']>('text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldUnit, setFieldUnit] = useState('');
  const [fieldOptionsText, setFieldOptionsText] = useState('');

  // Filter services assigned to this staff member (or all for admin)
  const assignedServices = services.filter(srv => {
    if (currentRole === 'admin') return true;
    if (!staff) return true;
    return staff.departmentIds.includes(srv.departmentId) || srv.staffId === staff.id;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bus': return <Bus className="w-5 h-5" />;
      case 'Armchair': return <Armchair className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'DoorOpen': return <DoorOpen className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getFieldTypeLabel = (type: ServiceField['type']) => {
    switch (type) {
      case 'text': return 'نص عادي';
      case 'number': return 'رقم / كمية';
      case 'select': return 'قائمة اختيار';
      case 'textarea': return 'نص طويل / وصف';
      case 'checkbox': return 'اختيار نعم/لا';
      case 'date': return 'تاريخ';
      case 'time': return 'وقت';
      default: return type;
    }
  };

  const handleOpenAddField = (serviceId: string) => {
    setAddingFieldToServiceId(serviceId);
    setEditingFieldInfo(null);
    setFieldLabel('');
    setFieldType('text');
    setFieldPlaceholder('');
    setFieldRequired(false);
    setFieldUnit('');
    setFieldOptionsText('');
  };

  const handleOpenEditField = (serviceId: string, field: ServiceField) => {
    setEditingFieldInfo({ serviceId, field });
    setAddingFieldToServiceId(null);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldPlaceholder(field.placeholder || '');
    setFieldRequired(Boolean(field.required));
    setFieldUnit(field.unit || '');
    setFieldOptionsText(field.options ? field.options.join(', ') : '');
  };

  const handleSaveField = (e: React.FormEvent, serviceId: string) => {
    e.preventDefault();
    if (!fieldLabel.trim()) return;

    const options = fieldType === 'select' && fieldOptionsText.trim()
      ? fieldOptionsText.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    if (editingFieldInfo) {
      // Update existing
      const res = updateServiceField(serviceId, editingFieldInfo.field.id, {
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim() || undefined,
        required: fieldRequired,
        unit: fieldUnit.trim() || undefined,
        options,
      });
      setAlertMessage(res.message);
      setEditingFieldInfo(null);
    } else {
      // Create new
      const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newField: ServiceField = {
        id: fieldId,
        label: fieldLabel.trim(),
        type: fieldType,
        placeholder: fieldPlaceholder.trim() || undefined,
        required: fieldRequired,
        unit: fieldUnit.trim() || undefined,
        options,
      };
      const res = addServiceField(serviceId, newField);
      setAlertMessage(res.message);
      setAddingFieldToServiceId(null);
    }

    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleDeleteField = (serviceId: string, field: ServiceField) => {
    if (window.confirm(`هل أنت متأكد من حذف تفصيل (${field.label}) من هذه الخدمة؟ لن يظهر هذا الحقل لرؤساء الأندية عند تقديم الطلبات.`)) {
      const res = deleteServiceField(serviceId, field.id);
      setAlertMessage(res.message);
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  const handleResetService = (serviceId: string, serviceName: string) => {
    if (window.confirm(`هل ترغب في استعادة جميع الحقول والتفاصيل الافتراضية الأصلية لخدمة (${serviceName})؟`)) {
      resetServiceToDefault(serviceId);
      setAlertMessage(`تمت استعادة الحقول الافتراضية لخدمة (${serviceName}) بنجاح!`);
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200/80 shadow-md p-6 sm:p-7 space-y-6">
      
      {/* Top Banner & Context Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md shrink-0">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                إدارة نماذج وتفاصيل الخدمات الموكلة
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {assignedServices.length} خدمات تحت إشرافك
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Tajawal',sans-serif] mt-1">
              تهيئة وتخصيص تفاصيل الخدمات لنماذج طلبات الأندية
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              يمكنك هنا استعراض جميع الخدمات الموكلة لك، وإضافة أو تعديل أو حذف أي متطلب أو تفصيل تريده أن يظهر لرؤساء الأندية عند تقديمهم طلب فعالية جديدة.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs text-emerald-900 font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تنعكس التعديلات فوراً على نماذج الطلاب</span>
        </div>
      </div>

      {/* Global Success Alert Banner */}
      {alertMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{alertMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setAlertMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Assigned Services List */}
      <div className="space-y-4">
        {assignedServices.map(srv => {
          const dept = DEPARTMENTS[srv.departmentId];
          const isExpanded = expandedServiceId === srv.id || assignedServices.length === 1;
          const isAddingToThis = addingFieldToServiceId === srv.id;
          const isEditingThisService = editingFieldInfo?.serviceId === srv.id;

          return (
            <div 
              key={srv.id}
              className={`rounded-2xl border transition-all ${
                isExpanded 
                  ? 'border-emerald-400 bg-slate-50/40 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Service Header Row */}
              <div 
                onClick={() => setExpandedServiceId(isExpanded ? null : srv.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-emerald-700 shrink-0`}>
                    {getServiceIcon(srv.iconName)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {srv.name}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingServiceForTitle(srv);
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="تعديل عنوان ومسمى الخدمة وأيقونتها"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${dept?.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                        {dept?.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {srv.fields.length} تفاصيل/حقول مهيأة
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingServiceForTitle(srv);
                    }}
                    className="hidden sm:flex px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold rounded-xl items-center gap-1 border border-slate-200 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل العنوان</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedServiceId(srv.id);
                      handleOpenAddField(srv.id);
                    }}
                    className="hidden sm:flex px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة تفصيل جديد</span>
                  </button>

                  <div className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Service Expanded Fields & Configuration Section */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-200/80 mt-1 space-y-4 animate-in fade-in">
                  
                  {/* Action Bar inside Expanded Service */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3 pb-1">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>قائمة التفاصيل والحقول المعروضة لرئيس النادي في هذه الخدمة:</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResetService(srv.id, srv.name)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="إعادة ضبط حقول هذه الخدمة إلى الحالة الافتراضية"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-500" />
                        <span>استعادة الافتراضي</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAddField(srv.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ إضافة تفصيل/حقل جديد</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Field Modal or Inline Form */}
                  {(isAddingToThis || (isEditingThisService && editingFieldInfo)) && (
                    <form 
                      onSubmit={(e) => handleSaveField(e, srv.id)}
                      className="p-4 bg-white border-2 border-emerald-400 rounded-2xl shadow-sm space-y-4 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>{editingFieldInfo ? `تعديل تفصيل (${editingFieldInfo.field.label})` : `إضافة تفصيل جديد لخدمة (${srv.name})`}</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingFieldToServiceId(null);
                            setEditingFieldInfo(null);
                          }}
                          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                        {/* Field Label */}
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block font-bold text-slate-700 mb-1">
                            اسم / عنوان التفصيل: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={fieldLabel}
                            onChange={e => setFieldLabel(e.target.value)}
                            placeholder="مثال: عدد الميكروفونات / نقطة الانطلاق"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            required
                          />
                        </div>

                        {/* Field Type */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            نوع الحقل: <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={fieldType}
                            onChange={e => setFieldType(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            <option value="text">نص قصير (Text)</option>
                            <option value="number">رقم أو عدد (Number)</option>
                            <option value="select">قائمة اختيار منسدلة (Select)</option>
                            <option value="textarea">نص طويل / وصف (Textarea)</option>
                            <option value="checkbox">مربع اختيار نعم/لا (Checkbox)</option>
                            <option value="date">تاريخ (Date)</option>
                            <option value="time">وقت (Time)</option>
                          </select>
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            وحدة القياس (اختياري):
                          </label>
                          <input
                            type="text"
                            value={fieldUnit}
                            onChange={e => setFieldUnit(e.target.value)}
                            placeholder="مثال: حافلة / كرسي / مشارك / متر"
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        {/* Placeholder */}
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            نص التلميح المساعد للمستخدم (Placeholder):
                          </label>
                          <input
                            type="text"
                            value={fieldPlaceholder}
                            onChange={e => setFieldPlaceholder(e.target.value)}
                            placeholder="مثال: يرجى تحديد العدد بدقة..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        {/* Required Toggle */}
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id={`chk-req-${srv.id}`}
                            checked={fieldRequired}
                            onChange={e => setFieldRequired(e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <label htmlFor={`chk-req-${srv.id}`} className="font-bold text-slate-800 cursor-pointer">
                            حقل إلزامي على رئيس النادي تعبئته
                          </label>
                        </div>
                      </div>

                      {/* Select Options Input if type === select */}
                      {fieldType === 'select' && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                          <label className="block font-bold text-slate-800">
                            خيارات القائمة المنسدلة (افصل بين الخيارات بفاصلة ,):
                          </label>
                          <input
                            type="text"
                            value={fieldOptionsText}
                            onChange={e => setFieldOptionsText(e.target.value)}
                            placeholder="مثال: خيار 1, خيار 2, خيار 3"
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setAddingFieldToServiceId(null);
                            setEditingFieldInfo(null);
                          }}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingFieldInfo ? 'حفظ التعديلات' : 'إدراج التفصيل في الخدمة'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Configured Fields */}
                  {srv.fields.length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                      لا توجد تفاصيل أو حقول مسجلة لهذه الخدمة حالياً. اضغط على "+ إضافة تفصيل/حقل جديد" لإدراج أول تفصيل.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {srv.fields.map(field => (
                        <div 
                          key={field.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900">
                                {field.label}
                              </span>
                              {field.required && (
                                <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                                  إلزامي
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                                النوع: {getFieldTypeLabel(field.type)}
                              </span>
                              {field.unit && (
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px]">
                                  الوحدة: {field.unit}
                                </span>
                              )}
                            </div>

                            {field.placeholder && (
                              <p className="text-[11px] text-slate-400 italic truncate">
                                تلميح: "{field.placeholder}"
                              </p>
                            )}

                            {field.options && field.options.length > 0 && (
                              <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                                <span className="font-bold">الخيارات: </span>
                                {field.options.join(' • ')}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2.5 mt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleOpenEditField(srv.id, field)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteField(srv.id, field)}
                              className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      <EditServiceTitleModal
        isOpen={Boolean(editingServiceForTitle)}
        service={editingServiceForTitle}
        onClose={() => setEditingServiceForTitle(null)}
      />

    </div>
  );
};
