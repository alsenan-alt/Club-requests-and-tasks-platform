import React from 'react';
import { Tag, Globe, ExternalLink } from 'lucide-react';
import { Task, SecurityGuestEntry } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';
import { useApp } from '../context/AppContext';

interface Props {
  task: Task;
  requestTitle?: string;
  clubName?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  requestId?: string;
  supervisorName?: string;
}

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

export const TaskRequirementsViewer: React.FC<Props> = ({ 
  task,
  requestTitle,
  clubName,
  eventDate,
  eventTime,
  location,
  requestId,
  supervisorName
}) => {
  const { t, tField, tDynamic, tUnit, tOption, isRtl, services } = useApp();
  const details = task.details || {};
  const hasGuests = Array.isArray(details.guestsList) && details.guestsList.length > 0;
  const standardEntries = Object.entries(details).filter(([k, v]) => k !== 'guestsList' && v !== undefined && v !== '');

  // Look up service and its fields
  const currentService = services.find(s => s.id === task.serviceId);

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
              <span className="text-xs font-bold text-blue-950 block">
                {t('details.external_url', 'رابط الصفحة / الموقع المرفق من الموظف:')}
              </span>
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
            title={t('details.open_page', 'الانتقال إلى الصفحة')}
          >
            <span>{t('details.open_page', 'الانتقال إلى الصفحة')}</span>
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
            eventTitle={requestTitle}
            clubName={clubName}
            eventDate={eventDate}
            eventTime={eventTime}
            location={location}
            requestId={requestId}
            supervisorName={supervisorName || task.staffName}
          />
        </div>
      )}

      {/* Standard Details Grid */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/70">
          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Tag className="w-3.5 h-3.5" />
            </span>
            <span>{t('details.specifications', 'المواصفات والمتطلبات المسجلة')}</span>
          </h5>
          {standardEntries.length > 0 && (
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              {standardEntries.length} {isRtl ? 'متطلبات محددة' : 'specifications'}
            </span>
          )}
        </div>

        {standardEntries.length === 0 && !hasGuests && !task.externalUrl ? (
          <p className="text-xs text-slate-500 italic py-1">
            {isRtl ? 'لا توجد تفاصيل إضافية مسجلة لهذه الخدمة.' : 'No additional specifications registered for this service.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {standardEntries.map(([key, val]) => {
              // 1. Check if the task recorded the label at creation
              const savedLabel = task.detailsLabels?.[key];

              // 2. Look up field in current service or all catalog services
              const matchedField = currentService?.fields?.find(f => f.id === key || f.label === key);
              const anyField = !matchedField ? services.flatMap(s => s.fields || []).find(f => f.id === key || f.label === key) : undefined;
              const fieldDef = matchedField || anyField;

              // 3. Resolve the human-readable label
              const fallbackLabel = savedLabel || fieldDef?.label;
              const label = tField(key, fallbackLabel, task.serviceId);

              // 4. Value formatting
              const isValUrl = isUrl(val) || key.toLowerCase().includes('link') || key.toLowerCase().includes('url');
              const isBool = typeof val === 'boolean';
              const rawDisplay = isBool 
                ? (val ? (isRtl ? 'نعم' : 'Yes') : (isRtl ? 'لا' : 'No')) 
                : typeof val === 'object'
                  ? JSON.stringify(val)
                  : String(val);

              const unitText = fieldDef?.unit ? tUnit(fieldDef.unit) : '';
              const translatedDisplay = isValUrl 
                ? rawDisplay 
                : fieldDef?.type === 'select'
                  ? tOption(rawDisplay)
                  : tDynamic(rawDisplay);

              return (
                <div 
                  key={key} 
                  className={`p-3 rounded-xl border transition-all ${
                    isValUrl 
                      ? 'bg-blue-50/70 border-blue-200/80 shadow-2xs' 
                      : isBool
                        ? val 
                          ? 'bg-emerald-50/50 border-emerald-200/70 shadow-2xs' 
                          : 'bg-white border-slate-200/90 shadow-2xs'
                        : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{label}</span>
                  </span>

                  {isValUrl ? (
                    <a
                      href={formatUrl(rawDisplay)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-all max-w-full truncate group shadow-2xs"
                      title={t('details.open_page', 'الانتقال إلى الرابط')}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate font-mono" dir="ltr">{rawDisplay}</span>
                    </a>
                  ) : isBool ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                      val ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {translatedDisplay}
                    </span>
                  ) : (
                    <span className="font-bold text-slate-900 text-xs break-words leading-relaxed block">
                      {translatedDisplay} {unitText && <span className="font-normal text-slate-500 text-[11px] mr-1 ml-1">({unitText})</span>}
                    </span>
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
