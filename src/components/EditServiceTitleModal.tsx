import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
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
  FileText,
  Wrench,
  HelpCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { DEPARTMENTS, STAFF_MEMBERS } from '../data/initialData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

const AVAILABLE_ICONS = [
  { name: 'Bus', label: 'حافلة / باص', icon: Bus },
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
  { name: 'Car', label: 'مركبات ونقل', icon: Car },
  { name: 'Sparkles', label: 'خدمة عامة/أخرى', icon: Sparkles },
];

export const EditServiceTitleModal: React.FC<Props> = ({ isOpen, onClose, service }) => {
  const { updateServiceInfo, staffMembers } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name || '');
      setDescription(service.description || '');
      setIconName(service.iconName || 'Sparkles');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

  const dept = DEPARTMENTS[service.departmentId];
  const staff = staffMembers.find(s => s.id === service.staffId) || STAFF_MEMBERS.find(s => s.id === service.staffId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('يرجى كتابة عنوان أو مسمى الخدمة');
      return;
    }

    const res = updateServiceInfo(service.id, {
      name: name.trim(),
      description: description.trim(),
      iconName,
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  const SelectedIconComp = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <SelectedIconComp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Tajawal',sans-serif]">
                تعديل عنوان وبيانات الخدمة
              </h3>
              <p className="text-xs text-slate-300">
                المسؤول: {staff?.shortName} • {dept?.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Service Title / Name */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center justify-between">
              <span>مسمى / عنوان الخدمة:</span>
              <span className="text-[11px] text-slate-400 font-normal">مثال: حجز الباصات والنقل الجماعي</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: حجز الباصات"
              className="w-full text-sm font-bold p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              الوصف المختصر للخدمة:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="وصف لما تشمله هذه الخدمة..."
              className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              الأيقونة والرمز التعبيري:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
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
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview of the Service Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              معاينة فورية لبطاقة الخدمة:
            </span>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <SelectedIconComp className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {name || 'عنوان الخدمة'}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {description || 'وصف الخدمة يظهر هنا'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وتحديث العنوان</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
