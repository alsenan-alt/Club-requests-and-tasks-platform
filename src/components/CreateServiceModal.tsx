import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Sparkles, 
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
  Building2, 
  Car, 
  Globe, 
  Tag, 
  Wrench,
  HelpCircle,
  Trash2,
  Lock,
  Layers,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, STAFF_MEMBERS } from '../data/initialData';
import { DepartmentId, StaffMember, ServiceField, ServiceItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember;
  onServiceCreated?: (newService: ServiceItem) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Sparkles', label: 'خدمة عامة/مميزة', icon: Sparkles },
  { name: 'Bus', label: 'حافلة / نقل', icon: Bus },
  { name: 'Armchair', label: 'كراسي وأثاث', icon: Armchair },
  { name: 'Zap', label: 'كهرباء وإنارة', icon: Zap },
  { name: 'Laptop', label: 'تقنية وشاشات', icon: Laptop },
  { name: 'DoorOpen', label: 'قاعات ومسارح', icon: DoorOpen },
  { name: 'Megaphone', label: 'صوتيات ومايكات', icon: Megaphone },
  { name: 'Printer', label: 'طباعة وبنرات', icon: Printer },
  { name: 'Camera', label: 'تصوير وتوثيق', icon: Camera },
  { name: 'ShieldCheck', label: 'أمن وتصاريح', icon: ShieldCheck },
  { name: 'Utensils', label: 'ضيافة وتموين', icon: Utensils },
  { name: 'Building2', label: 'مباني ومرافق', icon: Building2 },
  { name: 'Car', label: 'مركبات وسيارات', icon: Car },
  { name: 'Globe', label: 'مواقع وروابط', icon: Globe },
  { name: 'Wrench', label: 'تجهيزات وصيانة', icon: Wrench },
  { name: 'Tag', label: 'متفرقات وتصنيف', icon: Tag },
];

export const CreateServiceModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  staff, 
  onServiceCreated 
}) => {
  const { addNewCustomService, currentRole, currentStaff, staffMembers } = useApp();

  // Determine allowed departments
  const availableDepartmentIds: DepartmentId[] = (
    staff?.departmentIds || 
    currentStaff?.departmentIds || 
    (Object.keys(DEPARTMENTS) as DepartmentId[])
  );

  const initialDept: DepartmentId = availableDepartmentIds[0] || 'transport';

  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState<DepartmentId>(initialDept);
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [restrictedToVip, setRestrictedToVip] = useState(false);
  const [initialFields, setInitialFields] = useState<Array<{ label: string; type: ServiceField['type']; required: boolean; placeholder: string; unit?: string }>>([
    { label: 'مواصفات وتفاصيل الخدمة المطلوبة', type: 'textarea', required: true, placeholder: 'اكتب مواصفات وتفاصيل طلبك هنا بدقة...' }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<ServiceField['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDepartmentId(availableDepartmentIds[0] || 'transport');
      setDescription('');
      setIconName('Sparkles');
      setRestrictedToVip(false);
      setInitialFields([
        { label: 'مواصفات وتفاصيل الخدمة المطلوبة', type: 'textarea', required: true, placeholder: 'اكتب مواصفات وتفاصيل طلبك هنا بدقة...' }
      ]);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, staff, currentStaff]);

  if (!isOpen) return null;

  const handleAddInitialField = () => {
    if (!newFieldLabel.trim()) return;
    setInitialFields(prev => [
      ...prev,
      {
        label: newFieldLabel.trim(),
        type: newFieldType,
        required: newFieldRequired,
        placeholder: newFieldType === 'url' ? 'https://...' : 'يرجى التحديد أو الكتابة...',
      }
    ]);
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldRequired(false);
  };

  const handleRemoveInitialField = (index: number) => {
    setInitialFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم أو مسمى الخدمة الجديدة');
      return;
    }

    const compiledFields: ServiceField[] = initialFields.map((f, idx) => ({
      id: `field_init_${Date.now()}_${idx}`,
      label: f.label,
      type: f.type,
      required: f.required,
      placeholder: f.placeholder,
      unit: f.unit,
    }));

    const result = addNewCustomService({
      name: name.trim(),
      departmentId,
      description: description.trim() || 'خدمة مخصصة جديدة مضافة من قبل المشرف',
      iconName,
      restrictedToVip,
      staffId: staff?.id || currentStaff?.id || DEPARTMENTS[departmentId]?.staffId,
      fields: compiledFields,
    });

    if (result.success) {
      setSuccessMsg(result.message);
      if (onServiceCreated) {
        onServiceCreated(result.service);
      }
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  const SelectedIconComp = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon || Sparkles;
  const currentDeptInfo = DEPARTMENTS[departmentId];
  const assignedStaff = staffMembers.find(s => s.id === (staff?.id || currentDeptInfo?.staffId)) || STAFF_MEMBERS.find(s => s.id === (staff?.id || currentDeptInfo?.staffId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
              <SelectedIconComp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  إضافة نموذج خدمة جديد
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {assignedStaff?.shortName || 'مشرف النشاط'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-['Tajawal',sans-serif] mt-0.5">
                إنشاء وتخصيص خدمة جديدة لطلبات الأندية
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Service Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Service Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>اسم / عنوان الخدمة الجديدة: <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">مثال: حجز قاعة كبار الشخصيات / تصوير درون</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="أدخل مسمى الخدمة بوضوح..."
                className="w-full text-sm font-bold p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
                required
                autoFocus
              />
            </div>

            {/* Department Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                القسم / الوحدة الإدارية المعنية: <span className="text-rose-500">*</span>
              </label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value as DepartmentId)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {availableDepartmentIds.map(deptKey => {
                  const d = DEPARTMENTS[deptKey];
                  if (!d) return null;
                  return (
                    <option key={deptKey} value={deptKey}>
                      {d.name} ({d.staffName})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* VIP Restriction Toggle */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="checkbox"
                id="chk-vip-restriction"
                checked={restrictedToVip}
                onChange={e => setRestrictedToVip(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="chk-vip-restriction" className="cursor-pointer select-none">
                <span className="font-bold text-slate-800 block flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>خدمة مخصصة للفعاليات الكبرى / VIP</span>
                </span>
                <span className="text-[10px] text-slate-500 block">
                  تظهر كخدمة ذات أولوية عالية أو خاصة
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1.5">
                الوصف المختصر للخدمة (يظهر لرؤساء الأندية عند التقديم):
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="وضح ما تقدمه هذه الخدمة والشروط العامة إن وجدت..."
                className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              اختر الأيقونة المناسبة للخدمة:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl max-h-36 overflow-y-auto">
              {AVAILABLE_ICONS.map(item => {
                const Icon = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-105' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Fields / Requirements Builder */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>حقول ومتطلبات نموذج الخدمة ({initialFields.length} حقول):</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                يمكنك إضافة المزيد من الحقول لاحقاً أيضاً
              </span>
            </div>

            {/* List of current fields */}
            <div className="space-y-2">
              {initialFields.map((field, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800 truncate">{field.label}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {field.type}
                    </span>
                    {field.required && (
                      <span className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded font-bold">
                        إلزامي
                      </span>
                    )}
                  </div>

                  {initialFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInitialField(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف هذا الحقل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add another field quick bar */}
            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newFieldLabel}
                onChange={e => setNewFieldLabel(e.target.value)}
                placeholder="اسم حقل إضافي (مثال: عدد المقاعد / رابط الفعالية)"
                className="sm:col-span-6 p-2 rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-emerald-500 text-xs"
              />
              <select
                value={newFieldType}
                onChange={e => setNewFieldType(e.target.value as any)}
                className="sm:col-span-3 p-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
              >
                <option value="text">نص عادي</option>
                <option value="url">رابط / موقع URL</option>
                <option value="number">رقم / كمية</option>
                <option value="date">تاريخ</option>
                <option value="time">وقت</option>
                <option value="textarea">نص طويل</option>
                <option value="checkbox">نعم / لا</option>
              </select>
              <button
                type="button"
                onClick={handleAddInitialField}
                disabled={!newFieldLabel.trim()}
                className="sm:col-span-3 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إدراج حقل</span>
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              معاينة بطاقة الخدمة كما ستظهر لرؤساء الأندية:
            </span>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <SelectedIconComp className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {name || 'اسم الخدمة الجديدة'}
                  </h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${currentDeptInfo?.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                    {currentDeptInfo?.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {description || 'وصف الخدمة يظهر هنا للطلاب عند اختيار الخدمات'}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء وإدراج الخدمة فوراً</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
