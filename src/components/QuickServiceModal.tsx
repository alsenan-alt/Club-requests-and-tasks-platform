import React, { useState } from 'react';
import { X, Send, Sparkles, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, STAFF_MEMBERS, CLUBS_LIST } from '../data/initialData';
import { SecurityGuestEntry } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

export const QuickServiceModal: React.FC<Props> = ({ isOpen, onClose, serviceId }) => {
  const { 
    activeClubName, 
    currentUser, 
    currentRole, 
    services, 
    createSingleServiceRequest, 
    setSelectedRequestId,
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

  const service = services.find(s => s.id === serviceId) || services[0];
  const dept = DEPARTMENTS[service?.departmentId || 'transport'];
  const staff = staffMembers.find(sm => sm.id === service?.staffId) || STAFF_MEMBERS.find(sm => sm.id === service?.staffId);

  const localizedService = service ? tService(service.id, service.name, service.description) : { name: '', description: '' };
  const localizedDept = dept ? tDepartment(dept.id, dept.name, dept.description) : { name: '', description: '' };

  const [clubName, setClubName] = useState(currentUser?.clubName || activeClubName || CLUBS_LIST[0]);
  const [presidentName, setPresidentName] = useState(currentUser?.name || (isRtl ? 'رئيس النادي الطلابي' : 'Club President'));
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const [formDetails, setFormDetails] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    if (service?.fields) {
      service.fields.forEach(f => {
        if (f.defaultValue !== undefined) init[f.id] = f.defaultValue;
      });
    }
    return init;
  });

  if (!isOpen || !service) return null;

  const handleDetailChange = (fieldId: string, value: any) => {
    setFormDetails(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveClubName = (currentRole === 'club_president' && currentUser?.clubName) ? currentUser.clubName : clubName;
    const title = eventTitle.trim() || `${localizedService.name} - ${effectiveClubName}`;
    
    const created = createSingleServiceRequest(
      service.id,
      formDetails,
      effectiveClubName,
      presidentName,
      title,
      eventDate,
      priority
    );

    setSelectedRequestId(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('quick.badge', 'طلب خدمة فردية سريعة')}</span>
            </div>
            <h3 className="text-lg font-bold font-['Tajawal',sans-serif]">
              {localizedService.name}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {t('quick.direct_routing', 'توجيه مباشر إلى:')} <strong className="text-emerald-300">{tDynamic(staff?.shortName)}</strong> ({localizedDept.name})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 bg-slate-50/50 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('wizard.club_name', 'النادي مقدم الطلب')}
              </label>
              {currentRole === 'club_president' && currentUser?.clubName ? (
                <div className="w-full text-xs font-bold p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between">
                  <span>{currentUser.clubName}</span>
                  <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-800">
                    {isRtl ? 'حساب موثق' : 'Verified'}
                  </span>
                </div>
              ) : (
                <select
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {CLUBS_LIST.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('wizard.president_name', 'اسم رئيس النادي / الممثل')}
              </label>
              <input
                type="text"
                value={presidentName}
                onChange={e => setPresidentName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('quick.purpose', 'عنوان المناسبة أو الغرض')}
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                placeholder={isRtl ? 'مثال: ورشة تدريبية لأعضاء النادي' : 'e.g., Training Workshop for Club Members'}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('quick.needed_date', 'تاريخ الحاجة للخدمة')}
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Dynamic Service Specific Fields */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              {isRtl ? `متطلبات خدمة (${localizedService.name}):` : `Requirements for (${localizedService.name}):`}
            </h4>

            {service.id === 'srv_security_permits' && (
              <div className="mb-4">
                <SecurityGuestListManager
                  guests={(formDetails.guestsList as SecurityGuestEntry[]) || []}
                  eventTitle={eventTitle || localizedService.name}
                  clubName={(currentRole === 'club_president' && currentUser?.clubName) ? currentUser.clubName : clubName}
                  eventDate={eventDate}
                  onChange={(newGuests) => {
                    handleDetailChange('guestsList', newGuests);
                    handleDetailChange('visitor_count', newGuests.length);
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {service.fields
                .filter(field => !(service.id === 'srv_security_permits' && (field.id === 'visitor_details' || field.id === 'visitor_count')))
                .map(field => {
                const val = formDetails[field.id] ?? field.defaultValue ?? '';
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
                        onChange={e => handleDetailChange(field.id, e.target.value)}
                        className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
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
                        onChange={e => handleDetailChange(field.id, e.target.value)}
                        placeholder={placeholder}
                        className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
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
                          onChange={e => handleDetailChange(field.id, e.target.value)}
                          placeholder={placeholder || 'https://...'}
                          dir="ltr"
                          className={`w-full text-xs p-2 ${isRtl ? 'pr-9' : 'pl-9'} rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono text-left`}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={field.id}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {fieldLabel} {fieldUnit && <span className="text-slate-400">({fieldUnit})</span>}
                    </label>
                    <input
                      type={field.type}
                      value={val}
                      onChange={e => handleDetailChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      placeholder={placeholder}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <span className="text-emerald-950 font-semibold">
              {isRtl ? (
                <>سيتم إرسال المهمة وتنبيه <strong className="text-emerald-800">{tDynamic(staff?.shortName)}</strong> فورياً</>
              ) : (
                <>Task will be routed and notified to <strong className="text-emerald-800">{tDynamic(staff?.shortName)}</strong> immediately</>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-600">{t('table.priority', 'الأولوية:')}:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="text-xs p-1 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option value="normal">{t('priority.normal', 'عادية')}</option>
                <option value="high">{t('priority.high', 'عالية')}</option>
                <option value="urgent">{t('priority.urgent', 'عاجلة')}</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t('action.cancel', 'إلغاء')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('quick.submit', 'إرسال وتوجيه المهمة الآن')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
