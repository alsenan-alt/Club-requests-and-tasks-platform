import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Car, 
  User, 
  CreditCard, 
  Users, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Hash, 
  Palette, 
  Printer, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { SecurityGuestEntry } from '../types';
import { SecurityPermitsPrintModal } from './SecurityPermitsPrintModal';

interface Props {
  guests: SecurityGuestEntry[];
  onChange?: (updatedGuests: SecurityGuestEntry[]) => void;
  readOnly?: boolean;
  eventTitle?: string;
  clubName?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  requestId?: string;
  supervisorName?: string;
}

export const SecurityGuestListManager: React.FC<Props> = ({
  guests = [],
  onChange,
  readOnly = false,
  eventTitle,
  clubName,
  eventDate,
  eventTime,
  location,
  requestId,
  supervisorName
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Guest Form State
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setNationalId('');
    setPlateNumber('');
    setCarType('');
    setCarModel('');
    setCarColor('');
    setOwnerName('');
    setCompanionsCount(0);
    setFormError(null);
    setIsAdding(false);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('يرجى إدخال اسم الضيف أو الزائر');
      return;
    }
    if (!nationalId.trim()) {
      setFormError('يرجى إدخال رقم الهوية الوطنية أو الإقامة');
      return;
    }
    if (!plateNumber.trim()) {
      setFormError('يرجى إدخال رقم لوحة السيارة باللغة الإنجليزية');
      return;
    }

    const newGuest: SecurityGuestEntry = {
      id: `gst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      nationalId: nationalId.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      carType: carType.trim() || 'سيارة خاصة',
      carModel: carModel.trim() || '-',
      carColor: carColor.trim() || 'غير محدد',
      ownerName: ownerName.trim() || name.trim(),
      companionsCount: Math.max(0, Number(companionsCount) || 0),
    };

    const updated = [...guests, newGuest];
    if (onChange) {
      onChange(updated);
    }
    resetForm();
  };

  const handleRemoveGuest = (guestId: string) => {
    const updated = guests.filter(g => g.id !== guestId);
    if (onChange) {
      onChange(updated);
    }
  };

  // Plate input sanitization (English characters, digits, and spaces only)
  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Replace non-English alphanumeric and hyphens/spaces
    const englishOnly = rawVal.replace(/[^a-zA-Z0-9\s-]/g, '').toUpperCase();
    setPlateNumber(englishOnly);
  };

  const totalPeople = guests.reduce((sum, g) => sum + 1 + (Number(g.companionsCount) || 0), 0);

  return (
    <div className="space-y-4">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/80 p-4 rounded-2xl border border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-orange-950 font-['Tajawal',sans-serif]">
              قائمة وتصاريح دخول الضيوف والمركبات
            </h4>
            <p className="text-[11px] text-orange-800/80 mt-0.5">
              إدراج بيانات الزوار المعتمدة ولوحات السيارات بالإنجليزية لإرسالها لأمن البوابات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-900 border border-orange-200 text-xs font-bold shadow-2xs">
            <Car className="w-3.5 h-3.5 text-orange-600" />
            <span>{guests.length} سيارة / ضيف</span>
            <span className="text-slate-300">|</span>
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{totalPeople} إجمالي الأشخاص</span>
          </div>

          {/* Print Permits Button */}
          {guests.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-orange-100/70 active:scale-95 text-orange-950 border border-orange-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:border-orange-400"
              title="طباعة قائمة وتصاريح دخول الضيوف والمركبات"
            >
              <Printer className="w-3.5 h-3.5 text-orange-600" />
              <span>طباعة التصاريح والبيان</span>
            </button>
          )}

          {!readOnly && (
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'إلغاء' : 'إضافة ضيف جديد'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Entry Form (shown when isAdding = true) */}
      {!readOnly && isAdding && (
        <div className="p-4 sm:p-5 bg-white border-2 border-orange-300 rounded-2xl shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-orange-100 pb-2.5">
            <div className="flex items-center gap-2 text-orange-900 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>إدراج وتوثيق بيانات ضيف ومركبة جديدة</span>
            </div>
            <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md font-semibold">
              تصريح بوابة رقم {guests.length + 1}
            </span>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* 1. Guest Name */}
            <div className="lg:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                اسم الضيف / الزائر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setFormError(null); }}
                  placeholder="مثال: د. خالد إبراهيم الدوسري"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* 2. National ID / Iqama */}
            <div className="lg:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                رقم الهوية الوطنية / الإقامة <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nationalId}
                  onChange={e => { setNationalId(e.target.value); setFormError(null); }}
                  placeholder="10xxxxxxxx أو 20xxxxxxxx"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-mono font-bold"
                  required
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* 3. Plate Number (English only) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  رقم اللوحة <span className="text-rose-500">*</span>
                </label>
                <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded">
                  إنجليزي فقط
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={handlePlateChange}
                  placeholder="1234 ABC"
                  dir="ltr"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border-2 border-orange-200 text-orange-950 font-mono font-black text-center tracking-widest focus:bg-white focus:ring-2 focus:ring-orange-500 uppercase"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">مثال: 7890 KSA أو 1234 ABC</span>
            </div>

            {/* 4. Car Make / Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                نوع وصانع السيارة
              </label>
              <input
                type="text"
                value={carType}
                onChange={e => setCarType(e.target.value)}
                placeholder="تويوتا / نيسان / لكزس / فورد..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* 5. Car Model */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                الموديل / سنة الصنع
              </label>
              <input
                type="text"
                value={carModel}
                onChange={e => setCarModel(e.target.value)}
                placeholder="مثال: كامري 2024 / تاهو 2023"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* 6. Car Color */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                لون السيارة
              </label>
              <input
                type="text"
                value={carColor}
                onChange={e => setCarColor(e.target.value)}
                placeholder="أبيض / أسود / فضي / رمادي..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* 7. Owner Name */}
            <div className="lg:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                اسم مالك السيارة / السائق
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="اتركه فارغاً إن كان نفس اسم الضيف"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* 8. Number of Accompanying Persons */}
            <div className="lg:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                عدد المرافقين بالسيارة (غير السائق)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={companionsCount}
                  onChange={e => setCompanionsCount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-orange-500 font-bold"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleAddGuest}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>إدراج الضيف في القائمة</span>
            </button>
          </div>

        </div>
      )}

      {/* Guests List Render */}
      {guests.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">لا توجد بيانات ضيوف أو مركبات مضافة بعد</p>
          <p className="text-[11px] text-slate-400 mt-1">
            اضغط على زر (+ إضافة ضيف جديد) بالأعلى لإدراج أسماء الضيوف ولوحات سياراتهم باللغة الإنجليزية
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guests.map((guest, idx) => (
            <div
              key={guest.id}
              className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{guest.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono font-medium block">
                        هوية: {guest.nationalId}
                      </span>
                    </div>
                  </div>

                  {/* Saudi-styled Plate Badge */}
                  <div className="bg-slate-900 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 text-center font-mono font-bold text-xs tracking-wider shadow-inner shrink-0" dir="ltr">
                    <span className="text-[9px] text-slate-400 block -mb-0.5 leading-none">KSA</span>
                    {guest.plateNumber}
                  </div>
                </div>

                {/* Car specs grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block">السيارة والموديل:</span>
                    <strong className="text-slate-800">{guest.carType} {guest.carModel !== '-' && `• ${guest.carModel}`}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">اللون والمالك:</span>
                    <strong className="text-slate-800">{guest.carColor} {guest.ownerName && `(${guest.ownerName})`}</strong>
                  </div>

                  <div className="col-span-2 flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400">عدد المرافقين بالسيارة:</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold text-[10px]">
                      {guest.companionsCount} مرافقين
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions on Card */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="text-[11px] text-orange-700 hover:text-orange-900 hover:bg-orange-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  title="معاينة وطباعة تصريح هذا الضيف أو كافة الضيوف"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة التصريح</span>
                </button>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(guest.id)}
                    className="text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Permits Print & Export Modal */}
      <SecurityPermitsPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        guests={guests}
        eventTitle={eventTitle}
        clubName={clubName}
        eventDate={eventDate}
        eventTime={eventTime}
        location={location}
        requestId={requestId}
        supervisorName={supervisorName}
      />

    </div>
  );
};
